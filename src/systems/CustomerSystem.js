/**
 * Coffee Empire — CustomerSystem (M2.2e)
 * Mengelola siklus lengkap pelanggan:
 *   spawn -> jalan ke queue -> tunggu -> jalan ke counter ->
 *   dilayani 3 detik -> jalan ke exit -> despawn -> queue shift.
 *
 * Perubahan dari M2.2d:
 * - Pelanggan di front queue maju ke counter otomatis.
 * - Setelah dilayani, pelanggan jalan ke exit dan despawn.
 * - Pelanggan di belakang maju satu slot (shift forward).
 * - Slot dianggap bebas begitu pelanggan front mulai jalan ke counter.
 *
 * Belum ada: uang/transaksi (M2.3), HUD (M2.4), upgrade (M2.5).
 *
 * Event yang di-emit:
 *   customer:spawned          { slot }   (slot=-1 = langsung ke counter)
 *   customer:spawn-blocked    { reason }
 *   customer:arrived-counter  { }
 *   customer:left             { }
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.CustomerSystem = (function () {
  'use strict';

  var MIN_INTERVAL_MS = 6000;
  var MAX_INTERVAL_MS = 12000;
  var FIRST_SPAWN_MS  = 2000;
  var WALK_DELAY_MS   = 400;
  var SERVICE_TIME_MS = 3000;

  function CustomerSystem(scene, eventBus, gameState, cafeLayout, CustomerClass) {
    this.scene = scene;
    this.eventBus = eventBus;
    this.gameState = gameState;
    this.cafeLayout = cafeLayout;
    this.CustomerClass = CustomerClass;

    this.customers = [];      // semua customer hidup (di queue atau counter atau jalan)
    this._queueLine = [];     // yang sedang menunggu di queue slot (tidak termasuk counter)
    this._atCounter = null;   // customer yang sedang dilayani
    this._maxQueue = cafeLayout.getQueueSize();

    this._spawnTimer = 0;
    this._nextSpawnInterval = FIRST_SPAWN_MS;
  }

  CustomerSystem.prototype.update = function (deltaMs) {
    var i;
    for (i = 0; i < this.customers.length; i++) {
      this.customers[i].update(deltaMs);
    }

    this._spawnTimer += deltaMs;
    if (this._spawnTimer >= this._nextSpawnInterval) {
      this._spawnTimer = 0;
      this._nextSpawnInterval = this._randomInterval();
      this._trySpawn();
    }
  };

  CustomerSystem.prototype._randomInterval = function () {
    return MIN_INTERVAL_MS +
      Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS);
  };

  CustomerSystem.prototype._trySpawn = function () {
    if (this._queueLine.length >= this._maxQueue) {
      if (this.eventBus) {
        this.eventBus.emit('customer:spawn-blocked', { reason: 'queue-full' });
      }
      return;
    }

    var entry = this.cafeLayout.layout.entry;
    var customer = new this.CustomerClass(this.scene, {
      gx: entry.gx,
      gy: entry.gy
    });
    this.customers.push(customer);

    var self = this;

    // Jalur cepat: counter kosong DAN antrean kosong -> langsung ke counter.
    if (this._atCounter === null && this._queueLine.length === 0) {
      this._atCounter = customer;
      customer.state = 'to-counter';
      if (this.eventBus) this.eventBus.emit('customer:spawned', { slot: -1 });
      var counterA = this.cafeLayout.layout.counter;
      this.scene.time.delayedCall(WALK_DELAY_MS, function () {
        customer.walkToGrid(counterA.gx, counterA.gy, function (c) {
          self._onCustomerAtCounter(c);
        });
      });
      return;
    }

    // Jalur normal: masuk antrean paling belakang.
    var targetSlotIndex = this._queueLine.length;
    var qSlot = this.cafeLayout.getQueueSlot(targetSlotIndex);
    if (!qSlot) {
      // Defensif: jangan biarkan customer menggantung.
      var ci = this.customers.indexOf(customer);
      if (ci >= 0) this.customers.splice(ci, 1);
      customer.destroy();
      return;
    }

    this._queueLine.push(customer);
    if (this.eventBus) {
      this.eventBus.emit('customer:spawned', { slot: targetSlotIndex });
    }

    this.scene.time.delayedCall(WALK_DELAY_MS, function () {
      customer.walkToGrid(qSlot.gx, qSlot.gy, function () {
        self._checkAdvance();
      });
    });
  };

  /**
   * Kalau counter kosong dan ada antrean, majukan yang depan
   * ke counter, lalu geser sisanya maju satu slot.
   */
  CustomerSystem.prototype._checkAdvance = function () {
    if (this._atCounter) return;
    if (this._queueLine.length === 0) return;

    var customer = this._queueLine.shift();
    var counter = this.cafeLayout.layout.counter;
    this._atCounter = customer;
    customer.state = 'to-counter';

    // Shift remaining queue customers forward.
    for (var i = 0; i < this._queueLine.length; i++) {
      var c = this._queueLine[i];
      var slot = this.cafeLayout.getQueueSlot(i);
      if (slot && (c.gx !== slot.gx || c.gy !== slot.gy)) {
        c.walkToGrid(slot.gx, slot.gy);
      }
    }

    var self = this;
    customer.walkToGrid(counter.gx, counter.gy, function (c) {
      self._onCustomerAtCounter(c);
    });
  };

  CustomerSystem.prototype._onCustomerAtCounter = function (customer) {
    customer.state = 'being-served';
    if (this.eventBus) this.eventBus.emit('customer:arrived-counter', {});

    var self = this;
    this.scene.time.delayedCall(SERVICE_TIME_MS, function () {
      self._sendToExit(customer);
    });
  };

  CustomerSystem.prototype._sendToExit = function (customer) {
    var exit = this.cafeLayout.layout.exit;
    var self = this;
    customer.state = 'leaving';
    customer.walkToGrid(exit.gx, exit.gy, function (c) {
      self._destroyCustomer(c);
    });
  };

  CustomerSystem.prototype._destroyCustomer = function (customer) {
    var ci = this.customers.indexOf(customer);
    if (ci >= 0) this.customers.splice(ci, 1);

    if (customer.destroy) customer.destroy();

    if (this.eventBus) this.eventBus.emit('customer:left', {});

    // Kalau ini yang di counter, bersihkan dan majukan berikutnya.
    if (this._atCounter === customer) {
      this._atCounter = null;
      this._checkAdvance();
    }
  };

  CustomerSystem.prototype.getCustomerCount = function () {
    return this.customers.length;
  };

  CustomerSystem.prototype.getQueueCount = function () {
    return this._queueLine.length + (this._atCounter ? 1 : 0);
  };

  CustomerSystem.prototype.getMaxQueue = function () {
    return this._maxQueue;
  };

  return CustomerSystem;
})();
