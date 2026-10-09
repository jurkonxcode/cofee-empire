/**
 * Coffee Empire — Entry Point (M2.1)
 * Menginisialisasi Phaser + modul M1 (IsoUtils, Tilemap, CC)
 * + modul M2.1 (EventBus, GameState, TimeSystem).
 *
 * Perubahan dari M1 Rev 2:
 * - Runtime container: window.CoffeeEmpire.runtime
 * - Instansiasi EventBus, GameState, TimeSystem.
 * - BootScene.update() memanggil TimeSystem dengan delta ter-clamp.
 * - Teks verifikasi kecil di bawah layar (SEMENTARA, akan
 *   dihapus di M2.4 saat HUD dibuat).
 *
 * Tidak ada logika bisnis di file ini.
 */

(function () {
  'use strict';

  var VERSION = '0.3.0-M2.1';
  var COLOR_BG = 0x1a1410;
  var DPR = Math.min(window.devicePixelRatio || 1, 3);
  var MAX_DELTA_MS = 100; // clamp agar tab tidak aktif tidak melompat

  // ===== Boot error helper =====
  function showError(msg) {
    if (typeof window.showBootError === 'function') {
      window.showBootError(msg);
      return;
    }
    var el = document.getElementById('boot-error');
    if (el) el.style.display = 'flex';
  }

  // ===== Cek dependensi =====
  if (typeof window.Phaser === 'undefined') {
    showError('Phaser tidak termuat dari CDN.');
    return;
  }
  if (!window.CoffeeEmpire
      || !window.CoffeeEmpire.EventBus
      || !window.CoffeeEmpire.GameState
      || !window.CoffeeEmpire.TimeSystem
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
  var EventBus = window.CoffeeEmpire.EventBus;
  var GameState = window.CoffeeEmpire.GameState;
  var TimeSystem = window.CoffeeEmpire.TimeSystem;

  // ===== Runtime container =====
  // Satu tempat untuk semua instance sistem. Terbuka untuk
  // debugging via DevTools (window.CoffeeEmpire.runtime).
  var runtime = window.CoffeeEmpire.runtime = {
    eventBus: null,
    gameState: null,
    timeSystem: null,
    scene: null
  };

  // Instansiasi sistem inti. Urutan: bus dulu, lalu state,
  // lalu time system (butuh keduanya).
  runtime.eventBus = new EventBus();
  runtime.gameState = new GameState(runtime.eventBus);
  runtime.timeSystem = new TimeSystem(runtime.gameState, runtime.eventBus);

  // ===== BootScene =====
  class BootScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BootScene' });
    }

    create() {
      var width = this.scale.width;
      var height = this.scale.height;
      runtime.scene = this;

      // === Tilemap (M1) ===
      this.tilemap = new Tilemap(this);
      this.tilemap.render();

      // === Kamera (M1 Rev 2) ===
      var bounds = this.tilemap.getWorldBounds();
      var worldCenterX = bounds.x + bounds.width / 2;
      var worldCenterY = bounds.y + bounds.height / 2;
      this.cameras.main.centerOn(worldCenterX, worldCenterY);

      this.cameraController = new CameraController(this, {
        minZoom: 0.5,
        maxZoom: 2.5,
        bounds: bounds
      });

      // === Overlay (M1) ===
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

      // === Teks verifikasi M2.1 (SEMENTARA) ===
      // Menampilkan jam game. Akan dihapus di M2.4 saat HUD dibuat.
      var verify = this.add.text(width / 2, height - 22,
        formatVerify(), {
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#8b6f47'
        }).setOrigin(0.5).setScrollFactor(0);
      verify.setResolution(DPR);

      function formatVerify() {
        var gs = runtime.gameState;
        var h = gs.get('hour');
        var m = gs.get('minute');
        var hh = (h < 10 ? '0' : '') + h;
        var mm = (m < 10 ? '0' : '') + m;
        return 'M2.1 · Day ' + gs.get('day') + ' · ' + hh + ':' + mm;
      }

      // Update teks verifikasi saat menit berubah.
      runtime.eventBus.on('time:minute-changed', function () {
        verify.setText(formatVerify());
      });

      // Sembunyikan error jika sempat muncul.
      var err = document.getElementById('boot-error');
      if (err) err.style.display = 'none';

      // === Resize handler ===
      this.scale.on('resize', function (gameSize) {
        var w = gameSize.width;
        var h = gameSize.height;
        title.setPosition(w / 2, h * 0.12);
        version.setPosition(w / 2, h * 0.12 + 32);
        hint.setPosition(w / 2, h * 0.92);
        hint.setWordWrapWidth(w * 0.85);
        verify.setPosition(w / 2, h - 22);
      });
    }

    update(time, delta) {
      // Clamp delta: tab tidak aktif dapat menghasilkan delta besar.
      var d = delta > MAX_DELTA_MS ? MAX_DELTA_MS : delta;
      runtime.timeSystem.update(d);
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
