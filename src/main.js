/**
 * Coffee Empire — M0 self-contained entry point.
 * Tidak ada import. Semua logika berada di file ini.
 * Phaser diakses via window.Phaser (dari UMD script di index.html).
 */

(function () {
  'use strict';

  // ===== Constants =====
  var VERSION = '0.1.0-M0';
  var TILE_W = 64;
  var TILE_H = 32;
  var COLOR_BG = 0x1a1410;
  var COLOR_FLOOR = 0x8b6f47;
  var COLOR_FLOOR_ALT = 0xa68457;

  // ===== Boot error helper =====
  function showError(msg) {
    var el = document.getElementById('boot-error');
    var msgEl = document.getElementById('boot-error-msg');
    if (el) el.style.display = 'flex';
    if (msgEl) msgEl.textContent = msg;
  }

  // ===== Cek Phaser =====
  if (typeof window.Phaser === 'undefined') {
    showError('Phaser tidak termuat dari CDN.');
    return;
  }

  var Phaser = window.Phaser;

  // ===== BootScene =====
  function BootScene() {
    Phaser.Scene.call(this, { key: 'BootScene' });
  }
  BootScene.prototype = Object.create(Phaser.Scene.prototype);
  BootScene.prototype.constructor = BootScene;

  BootScene.prototype.create = function () {
    var width = this.scale.width;
    var height = this.scale.height;

    // Judul
    this.add.text(width / 2, height * 0.15, 'Coffee Empire', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '28px',
      color: '#f5e6d3',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Versi
    this.add.text(width / 2, height * 0.15 + 38, 'v' + VERSION, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#a68457'
    }).setOrigin(0.5);

    // Diamond isometrik placeholder
    var cx = width / 2;
    var cy = height / 2;
    var g = this.add.graphics();
    drawIsoDiamond(g, cx, cy - TILE_H / 2, COLOR_FLOOR);
    drawIsoDiamond(g, cx, cy + TILE_H / 2, COLOR_FLOOR_ALT);

    // Label status
    this.add.text(width / 2, height * 0.85,
      'M0 — Skeleton OK. Rendering isometrik placeholder.', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '12px',
        color: '#a68457',
        align: 'center',
        wordWrap: { width: width * 0.8 }
      }).setOrigin(0.5);

    // Sembunyikan error jika sempat muncul
    var err = document.getElementById('boot-error');
    if (err) err.style.display = 'none';
  };

  function drawIsoDiamond(g, cx, cy, color) {
    var halfW = TILE_W / 2;
    var halfH = TILE_H / 2;
    g.fillStyle(color, 1);
    g.beginPath();
    g.moveTo(cx, cy - halfH);
    g.lineTo(cx + halfW, cy);
    g.lineTo(cx, cy + halfH);
    g.lineTo(cx - halfW, cy);
    g.closePath();
    g.fillPath();
  }

  // ===== Konfigurasi Phaser =====
  var gameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: COLOR_BG,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: {
      antialias: true,
      pixelArt: false
    },
    scene: [BootScene]
  };

  // ===== Buat game =====
  try {
    window.__COFFEE_EMPIRE_GAME__ = new Phaser.Game(gameConfig);
  } catch (err) {
    var msg = (err && err.message) ? err.message : 'Gagal membuat Phaser.Game';
    showError(msg);
  }

})();
