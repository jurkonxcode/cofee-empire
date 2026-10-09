/**
 * Coffee Empire — Entry Point (M1)
 * Menginisialisasi Phaser, Tilemap, dan CameraController.
 * Tidak ada import. Modul Coffee Empire diakses via window.CoffeeEmpire.
 *
 * Perubahan dari M0.1:
 * - BootScene merender tilemap isometrik 8x8.
 * - Kamera mendukung drag (pan) dan pinch (zoom).
 * - Teks judul/versi pakai setScrollFactor(0) supaya tetap menempel
 *   ke layar meski kamera digeser.
 */

(function () {
  'use strict';

  var VERSION = '0.2.0-M1';
  var COLOR_BG = 0x1a1410;
  var DPR = Math.min(window.devicePixelRatio || 1, 3);

  // ===== Boot error helper =====
  function showError(msg) {
    if (typeof window.showBootError === 'function') {
      window.showBootError(msg);
      return;
    }
    // Fallback kalau index.html tidak memuat helper (kasus ekstrem).
    var el = document.getElementById('boot-error');
    if (el) el.style.display = 'flex';
  }

  // ===== Cek dependensi =====
  if (typeof window.Phaser === 'undefined') {
    showError('Phaser tidak termuat dari CDN.');
    return;
  }
  if (!window.CoffeeEmpire
      || !window.CoffeeEmpire.IsoUtils
      || !window.CoffeeEmpire.Tilemap
      || !window.CoffeeEmpire.CameraController) {
    showError('Modul Coffee Empire tidak lengkap. Cek urutan script di index.html.');
    return;
  }

  var Phaser = window.Phaser;
  var IsoUtils = window.CoffeeEmpire.IsoUtils;
  var Tilemap = window.CoffeeEmpire.Tilemap;
  var CameraController = window.CoffeeEmpire.CameraController;

  // ===== BootScene =====
  class BootScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BootScene' });
    }

    create() {
      var width = this.scale.width;
      var height = this.scale.height;

      // === Tilemap ===
      this.tilemap = new Tilemap(this);
      this.tilemap.render();

      // === Kamera: center ke tilemap, aktifkan drag & pinch ===
      var bounds = this.tilemap.getWorldBounds();
      var worldCenterX = bounds.x + bounds.width / 2;
      var worldCenterY = bounds.y + bounds.height / 2;

      this.cameras.main.centerOn(worldCenterX, worldCenterY);

      this.cameraController = new CameraController(this, {
        minZoom: 0.5,
        maxZoom: 2.5,
        bounds: bounds
      });

      // === Overlay UI (teks statis) — pakai scrollFactor(0) ===
      var title = this.add.text(width / 2, height * 0.12, 'Coffee Empire', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
        color: '#f5e6d3',
        fontStyle: 'bold'
      }).setOrigin(0.5).setScrollFactor(0);
      title.setResolution(DPR);

      var version = this.add.text(width / 2, height * 0.12 + 32, 'v' + VERSION, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '13px',
        color: '#a68457'
      }).setOrigin(0.5).setScrollFactor(0);
      version.setResolution(DPR);

      var hint = this.add.text(width / 2, height * 0.92,
        'Drag untuk geser peta. Cubit (pinch) untuk zoom.', {
          fontFamily: 'system-ui, sans-serif',
          fontSize: '12px',
          color: '#a68457',
          align: 'center',
          wordWrap: { width: width * 0.85 }
        }).setOrigin(0.5).setScrollFactor(0);
      hint.setResolution(DPR);

      // === Sembunyikan error jika ada ===
      var err = document.getElementById('boot-error');
      if (err) err.style.display = 'none';

      // === Handle resize: reposisi teks overlay ===
      this.scale.on('resize', function (gameSize) {
        var w = gameSize.width;
        var h = gameSize.height;
        title.setPosition(w / 2, h * 0.12);
        version.setPosition(w / 2, h * 0.12 + 32);
        hint.setPosition(w / 2, h * 0.92);
        hint.setWordWrapWidth(w * 0.85);
      });
    }
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
      roundPixels: false,
      pixelArt: false
    },
    scene: [BootScene]
  };

  try {
    window.__COFFEE_EMPIRE_GAME__ = new Phaser.Game(gameConfig);
  } catch (err) {
    var msg = (err && err.message) ? err.message : 'Gagal membuat Phaser.Game';
    showError(msg);
  }

})();
