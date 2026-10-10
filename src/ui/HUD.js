/**
 * Coffee Empire — HUD (M2.4)
 * Panel atap & bawah di dalam canvas, pakai Phaser Rectangle + Text.
 * setScrollFactor(0) supaya tetap di posisi saat kamera gerak.
 *
 * Update efisien: hanya saat event terkait (bukan setiap frame)
 * agar tidak memicu re-render text texture 5x/detik.
 *
 * Tombol upgrade di M2.4 masih visual placeholder. Akan dibuat
 * interaktif di M2.5.
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.HUD = (function () {
  'use strict';

  var DPR = Math.min(window.devicePixelRatio || 1, 3);
  var PANEL_BG = 0x0a0805;
  var PANEL_ALPHA = 0.78;
  var TEXT_COLOR = '#f5e6d3';
  var MONEY_COLOR = '#d9c34a';
  var DIM_COLOR = '#a68457';
  var BTN_BG = 0x3a2a1a;
  var BTN_ALPHA = 0.85;
  var DEPTH = 100;
  var TOP_H = 64;
  var BOTTOM_H = 60;

  function HUD(scene, eventBus, gameState, customerSystem) {
    this.scene = scene;
    this.eventBus = eventBus;
    this.gameState = gameState;
    this.customerSystem = customerSystem;
    this._els = {};
    this._build();
    this._wireEvents();
    this.layout(scene.scale.width, scene.scale.height);
  }

  HUD.prototype._build = function () {
    var scene = this.scene;
    var els = this._els;

    // === Panel atas ===
    els.topBg = scene.add.rectangle(0, 0, 10, 10, PANEL_BG, PANEL_ALPHA)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(DEPTH);

    els.money = scene.add.text(0, 0, '\uD83D\uDCB0 100', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      color: MONEY_COLOR,
      fontStyle: 'bold'
    }).setOrigin(0, 0).setScrollFactor(0).setDepth(DEPTH + 1);
    els.money.setResolution(DPR);

    els.time = scene.add.text(0, 0, 'Day 1 \u00B7 08:00', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: TEXT_COLOR
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(DEPTH + 1);
    els.time.setResolution(DPR);

    els.served = scene.add.text(0, 0, 'Dilayani: 0', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
      color: DIM_COLOR
    }).setOrigin(0, 0).setScrollFactor(0).setDepth(DEPTH + 1);
    els.served.setResolution(DPR);

    els.queue = scene.add.text(0, 0, 'Antre: 0/4', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
      color: DIM_COLOR
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(DEPTH + 1);
    els.queue.setResolution(DPR);

    // === Panel bawah ===
    els.bottomBg = scene.add.rectangle(0, 0, 10, 10, PANEL_BG, PANEL_ALPHA)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(DEPTH);

    // Tombol upgrade (placeholder visual M2.5)
    els.upgradeBg = scene.add.rectangle(0, 0, 10, 10, BTN_BG, BTN_ALPHA)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(DEPTH + 1);

    els.upgradeText = scene.add.text(0, 0, '\uD83D\uDD27 Upgrade \u2014 segera', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      color: DIM_COLOR
    }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(DEPTH + 2);
    els.upgradeText.setResolution(DPR);
  };

  HUD.prototype._wireEvents = function () {
    var self = this;
    this.eventBus.on('economy:money-changed', function () {
      self.updateMoney();
      self.updateServed();
    });
    this.eventBus.on('time:minute-changed', function (p) {
      if (p.minute % 5 !== 0) return;
      self.updateTime();
    });
    this.eventBus.on('customer:spawned', function () { self.updateQueue(); });
    this.eventBus.on('customer:left', function () { self.updateQueue(); });
    this.eventBus.on('customer:arrived-counter', function () { self.updateQueue(); });

    this.updateMoney();
    this.updateTime();
    this.updateServed();
    this.updateQueue();
  };

  HUD.prototype.updateMoney = function () {
    this._els.money.setText('\uD83D\uDCB0 ' + this.gameState.get('money'));
  };

  HUD.prototype.updateTime = function () {
    var d = this.gameState.get('day');
    var h = this.gameState.get('hour');
    var m = this.gameState.get('minute');
    var hh = (h < 10 ? '0' : '') + h;
    var mm = (m < 10 ? '0' : '') + m;
    this._els.time.setText('Day ' + d + ' \u00B7 ' + hh + ':' + mm);
  };

  HUD.prototype.updateServed = function () {
    this._els.served.setText('Dilayani: ' + this.gameState.get('servedCount'));
  };

  HUD.prototype.updateQueue = function () {
    if (!this.customerSystem) return;
    var c = this.customerSystem.getQueueCount();
    var m = this.customerSystem.getMaxQueue();
    this._els.queue.setText('Antre: ' + c + '/' + m);
  };

  HUD.prototype.layout = function (width, height) {
    var els = this._els;
    var pad = 14;

    els.topBg.setPosition(0, 0);
    els.topBg.setSize(width, TOP_H);

    els.money.setPosition(pad, 8);
    els.time.setPosition(width - pad, 12);
    els.served.setPosition(pad, 40);
    els.queue.setPosition(width - pad, 42);

    els.bottomBg.setPosition(0, height - BOTTOM_H);
    els.bottomBg.setSize(width, BOTTOM_H);

    var btnW = Math.min(260, width - 32);
    var btnH = 38;
    var btnX = (width - btnW) / 2;
    var btnY = height - BOTTOM_H + (BOTTOM_H - btnH) / 2;
    els.upgradeBg.setPosition(btnX, btnY);
    els.upgradeBg.setSize(btnW, btnH);
    els.upgradeText.setPosition(btnX + btnW / 2, btnY + btnH / 2);
  };

  HUD.prototype.destroy = function () {
    for (var k in this._els) {
      if (this._els[k] && this._els[k].destroy) this._els[k].destroy();
    }
    this._els = {};
  };

  return HUD;
})();
