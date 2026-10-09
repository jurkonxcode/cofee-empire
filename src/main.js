/**
 * Coffee Empire — M0 self-contained entry point.
 * Tidak ada import. Semua logika di file ini.
 * Phaser diakses via window.Phaser (dari UMD script di index.html).
 *
 * Ketajaman (M0.1):
 * - DPR diambil dari window.devicePixelRatio (cap 3).
 * - Setiap Text object memakai setResolution(DPR) supaya dirender di
 *   resolusi fisik HP, bukan CSS pixel.
 *   Referensi: https://docs.phaser.io/api-documentation/class/gameobjects-text#setResolution
 * - antialias: true dipertahankan untuk WebGL.
 * - roundPixels: false agar antialias bekerja pada tepi diagonal isometrik.
 * - scale.mode tetap RESIZE agar rotasi portrait <-> landscape otomatis.
 *
 * CATATAN: setResolution hanya bekerja pada Text, tidak pada Graphics.
 * Diamond placeholder tetap di-render pada resolusi default canvas.
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

  // ===== HiDPI: batas 3 agar tidak memakan memori berlebihan =====
  var DPR = Math.min(window.devicePixelRatio || 1, 3);

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

  // ===== BootScene (ES6 class — WAJIB untuk Phaser 3) =====
  class BootScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BootScene' });
    }

    create() {
      var width = this.scale.width;
      var height = this.scale.height;

      // Judul
      var title = this.add.text(width / 2, height * 0.15, 'Coffee Empire', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '28px',
        color: '#f5e6d3',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      title.setResolution(DPR);

      // Versi
      var version = this.add.text(width / 2, height * 0.15 + 38, 'v' + VERSION, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        color: '#a68457'
      }).setOrigin(0.5);
      version.setResolution(DPR);

      // Diamond isometrik placeholder
      var cx = width / 2;
      var cy = height / 2;
      var g = this.add.graphics();
      this.drawIsoDiamond(g, cx, cy - TILE_H / 2, COLOR_FLOOR);
      this.drawIsoDiamond(g, cx, cy + TILE_H / 2, COLOR_FLOOR_ALT);

      // Label status
      var label = this.add.text(width / 2, height * 0.85,
        'M0 — Skeleton OK. Rendering isometrik placeholder.', {
          fontFamily: 'system-ui, sans-serif',
          fontSize: '12px',
          color: '#a68457',
          align: 'center',
          wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);
      label.setResolution(DPR);

      // Sembunyikan error jika sempat muncul
      var err = document.getElementById('boot-error');
      if (err) err.style.display = 'none';
    }

    drawIsoDiamond(g, cx, cy, color) {
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
  }

  // ===== Konfigurasi Phaser (dimodifikasi minimal, bukan baru) =====
  var gameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: COLOR_BG,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: {
      antialias: true,       // tetap (WebGL + Canvas smoothing)
      roundPixels: false,    // biarkan antialias bekerja (bukan pixel art)
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
