/**
 * Coffee Empire — Entry Point (M2.2c)
 * Tambah movement: customer berjalan dari entry ke queue[0].
 *
 * Perubahan dari M2.2b:
 * - Customer di-spawn di entry, lalu setelah 1 detik jalan
 *   ke queue[0] via walkToGrid().
 * - BootScene.update() memanggil customer.update(d) setiap frame.
 *
 * Belum ada auto-spawn / layanan / transaksi. Itu di M2.2d/e.
 */

(function () {
  'use strict';

  var VERSION = '0.3.5-M2.2c';
  var COLOR_BG = 0x1a1410;
  var DPR = Math.min(window.devicePixelRatio || 1, 3);
  var MAX_DELTA_MS = 100;

  function showError(msg) {
    if (typeof window.showBootError === 'function') {
      window.showBootError(msg);
      return;
    }
    var el = document.getElementById('boot-error');
    if (el) el.style.display = 'flex';
  }

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
      || !window.CoffeeEmpire.CafeLayout
      || !window.CoffeeEmpire.Customer
      || !window.CoffeeEmpire.CameraController) {
    showError('Modul Coffee Empire tidak lengkap. Cek urutan script di index.html.');
    return;
  }

  var Phaser = window.Phaser;
  var IsoUtils = window.CoffeeEmpire.IsoUtils;
  var Tilemap = window.CoffeeEmpire.Tilemap;
  var CafeLayout = window.CoffeeEmpire.CafeLayout;
  var Customer = window.CoffeeEmpire.Customer;
  var CameraController = window.CoffeeEmpire.CameraController;
  var EventBus = window.CoffeeEmpire.EventBus;
  var GameState = window.CoffeeEmpire.GameState;
  var TimeSystem = window.CoffeeEmpire.TimeSystem;

  var runtime = window.CoffeeEmpire.runtime = {
    eventBus: null,
    gameState: null,
    timeSystem: null,
    scene: null,
    tilemap: null,
    cafeLayout: null,
    cameraController: null,
    customers: []
  };

  runtime.eventBus = new EventBus();
  runtime.gameState = new GameState(runtime.eventBus);
  runtime.timeSystem = new TimeSystem(runtime.gameState, runtime.eventBus);

  var timeEl = document.getElementById('ce-time-display');

  function renderTimeDom() {
    if (!timeEl) return;
    var gs = runtime.gameState;
    var h = gs.get('hour');
    var m = gs.get('minute');
    var hh = (h < 10 ? '0' : '') + h;
    var mm = (m < 10 ? '0' : '') + m;
    timeEl.textContent = 'M2.2c · Day ' + gs.get('day') + ' · ' + hh + ':' + mm;
  }

  runtime.eventBus.on('time:minute-changed', function (payload) {
    if (payload.minute % 5 !== 0) return;
    renderTimeDom();
  });
  renderTimeDom();

  class BootScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BootScene' });
    }

    create() {
      var self = this;
      var width = this.scale.width;
      var height = this.scale.height;
      runtime.scene = this;

      // === Tilemap (M1) ===
      this.tilemap = new Tilemap(this);
      this.tilemap.render();
      runtime.tilemap = this.tilemap;

      // === CafeLayout (M2.2a) ===
      this.cafeLayout = new CafeLayout(this);
      this.cafeLayout.render();
      runtime.cafeLayout = this.cafeLayout;

      // === Customer (M2.2c) ===
      var entry = this.cafeLayout.layout.entry;
      var q0 = this.cafeLayout.layout.queue[0];
      var customer = new Customer(this, {
        gx: entry.gx,
        gy: entry.gy
      });
      runtime.customers.push(customer);

      // Setelah 1 detik, mulainya jalan dari entry ke queue[0].
      this.time.delayedCall(1000, function () {
        customer.walkToGrid(q0.gx, q0.gy);
      });

      // === Kamera ===
      var bounds = this.tilemap.getWorldBounds();
      var worldCenterX = bounds.x + bounds.width / 2;
      var worldCenterY = bounds.y + bounds.height / 2;
      this.cameras.main.centerOn(worldCenterX, worldCenterY);

      this.cameraController = new CameraController(this, {
        minZoom: 0.5,
        maxZoom: 2.5,
        bounds: bounds
      });
      runtime.cameraController = this.cameraController;

      // === Overlay M1 ===
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

      var err = document.getElementById('boot-error');
      if (err) err.style.display = 'none';

      this.scale.on('resize', function (gameSize) {
        var w = gameSize.width;
        var h = gameSize.height;
        title.setPosition(w / 2, h * 0.12);
        version.setPosition(w / 2, h * 0.12 + 32);
        hint.setPosition(w / 2, h * 0.92);
        hint.setWordWrapWidth(w * 0.85);
      });
    }

    update(time, delta) {
      var d = delta > MAX_DELTA_MS ? MAX_DELTA_MS : delta;
      runtime.timeSystem.update(d);

      // Update semua customer
      for (var i = 0; i < runtime.customers.length; i++) {
        runtime.customers[i].update(d);
      }
    }
  }

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
