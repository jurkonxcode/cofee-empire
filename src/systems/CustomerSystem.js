/**
 * Coffee Empire — CustomerSystem (M2.2d)
 * Mengelola spawn otomatis dan antrean pelanggan.
 *
 * Tanggung jawab:
 * - Timer spawn: setiap 6-12 detik (acak).
 * - Cari slot antrean kosong. Kalau tidak ada, skip spawn.
 * - Instansiasi Customer, tugaskan ke slot, lalu jalan ke slot.
 * - Update semua customer setiap frame.
 *
 * Belum ada: layanan, transaksi, customer pergi.
 * Itu di M2.2e.
 *
 * Bergantung pada:
 *   window.CoffeeEmpire.CafeLayout (untuk getQueueSlot)
 *   window.CoffeeEmpire.Customer    (kelas entitas)
 *
 * Event yang di-emit:
 *   customer:spawned         { slot }
 *   customer:spawn-blocked   { reason: 'queue-full' }
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.CustomerSystem = (function () {
  'use strict';

  var MIN_INTERVAL_MS = 6000;
  var MAX_INTERVAL_MS = 12000;
  var FIRST_SPAWN_MS  = 2000;
  var WALK_DELAY_MS   = 400; // jeda kecil sebelum mulai jalan

  function CustomerSystem(scene, eventBus, gameState, cafeLayout, CustomerClass) {
    this.scene = scene;
    this.eventBus = eventBus;
    this.gameState = gameState;
    this.cafeLayout = cafeLayout;
    this.CustomerClass = CustomerClass;

    this.customers = [];
    this._maxQueue = cafeLayout.getQueueSize();
    this._queueOccupied = [];
    for (var i = 0; i < this._maxQueue; i++) {
      this._queueOccupied.push(false);
    }

    this._spawnTimer = 0;
    this._nextSpawnInterval = FIRST_SPAWN_MS;
  }

  CustomerSystem.prototype.update = function (deltaMs) {
    var i;

    // Update entitas customer
    for (i = 0; i < this.customers.length; i++) {
      this.customers[i].update(deltaMs);
    }

    // Timer spawn
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

  CustomerSystem.prototype._findFreeSlot = function () {
    for (var i = 0; i < this._queueOccupied.length; i++) {
      if (!this._queueOccupied[i]) return i;
    }
    return -1;
  };

  CustomerSystem.prototype._trySpawn = function () {
    var slot = this._findFreeSlot();
    if (slot === -1) {
      if (this.eventBus) {
        this.eventBus.emit('customer:spawn-blocked', { reason: 'queue-full' });
      }
      return;
    }

    // Tandai slot sebagai terisi (bahkan sebelum customer tiba,
    // agar tidak ditugaskan dua kali).
    this._queueOccupied[slot] = true;

    var entry = this.cafeLayout.layout.entry;
    var qSlot = this.cafeLayout.getQueueSlot(slot);
    if (!qSlot) return;

    var customer = new this.CustomerClass(this.scene, {
      gx: entry.gx,
      gy: entry.gy
    });
    customer._queueSlot = slot;

    this.customers.push(customer);

    if (this.eventBus) {
      this.eventBus.emit('customer:spawned', { slot: slot });
    }

    // Setelah jeda pendek, mulai jalan ke slot antrean.
    var self = this;
    this.scene.time.delayedCall(WALK_DELAY_MS, function () {
      customer.walkToGrid(qSlot.gx, qSlot.gy);
    });
  };

  CustomerSystem.prototype.getCustomerCount = function () {
    return this.customers.length;
  };

  CustomerSystem.prototype.getQueueOccupiedCount = function () {
    var n = 0;
    for (var i = 0; i < this._queueOccupied.length; i++) {
      if (this._queueOccupied[i]) n++;
    }
    return n;
  };

  CustomerSystem.prototype.getMaxQueue = function () {
    return this._maxQueue;
  };

  return CustomerSystem;
})();
