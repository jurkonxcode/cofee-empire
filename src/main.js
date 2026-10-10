/**
 * Coffee Empire — Entry Point (M2.4)
 * HUD proper di dalam canvas (Phaser Rectangle + Text).
 */

(function () {
  'use strict';

  var VERSION = '0.3.9-M2.4';
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
      || !window.CoffeeEmpire.Data
      || !window.CoffeeEmpire.Data.products
      || !window.CoffeeEmpire.EconomySystem
      || !window.CoffeeEmpire.IsoUtils
      || !window.CoffeeEmpire.Tilemap
      || !window.CoffeeEmpire.CafeLayout
      || !window.CoffeeEmpire.Customer
      || !window.CoffeeEmpire.CustomerSystem
      || !window.CoffeeEmpire.HUD
      || !window.CoffeeEmpire.CameraController) {
    showError('Modul Coffee Empire tidak lengkap. Cek urutan script di index.html.');
    return;
  }

  var Phaser = window.Phaser;
  var IsoUtils = window.CoffeeEmpire.IsoUtils;
  var Tilemap = window.CoffeeEmpire.Tilemap;
  var CafeLayout = window.CoffeeEmpire.CafeLayout;
  var Customer = window.CoffeeEmpire.Customer;
  var CustomerSystem = window.CoffeeEmpire.CustomerSystem;
  var EconomySystem = window.CoffeeEmpire.EconomySystem;
  var HUD = window.CoffeeEmpire.HUD;
  var CameraController = window.CoffeeEmpire.CameraController;
  var EventBus = window.CoffeeEmpire.EventBus;
  var GameState = window.CoffeeEmpire.GameState;
  var TimeSystem = window.CoffeeEmpire.TimeSystem;

  var runtime = window.CoffeeEmpire.runtime = {
    eventBus: null,
    gameState: null,
    timeSystem: null,
    economySystem: null,
    scene: null,
    tilemap: null,
    cafeLayout: null,
    cameraController: null,
    customerSystem: null,
    hud: null
  };

  runtime.eventBus = new EventBus();
  runtime.gameState = new GameState(runtime.eventBus);
  runtime.timeSystem = new TimeSystem(runtime.gameState, runtime.eventBus);
  runtime.economySystem = new EconomySystem(
    runtime.gameState,
    runtime.eventBus,
    window.CoffeeEmpire.Data.products
  );

  class BootScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BootScene' });
    }

    create() {
      var width = this.scale.width;
      var height = this.scale.height;
      runtime.scene = this;

      this.tilemap = new Tilemap(this);
      this.tilemap.render();
      runtime.tilemap = this.tilemap;

      this.cafeLayout = new CafeLayout(this);
      this.cafeLayout.render();
      runtime.cafeLayout = this.cafeLayout;

      this.customerSystem = new CustomerSystem(
        this,
        runtime.eventBus,
        runtime.gameState,
        this.cafeLayout,
        Customer
      );
      runtime.customerSystem = this.customerSystem;

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

      // === HUD (M2.4) ===
      this.hud = new HUD(
        this,
        runtime.eventBus,
        runtime.gameState,
        this.customerSystem
      );
      runtime.hud = this.hud;

      var err = document.getElementById('boot-error');
      if (err) err.style.display = 'none';

      var self = this;
      this.scale.on('resize', function (gameSize) {
        if (self.hud) self.hud.layout(gameSize.width, gameSize.height);
      });
    }

    update(time, delta) {
      var d = delta > MAX_DELTA_MS ? MAX_DELTA_MS : delta;
      runtime.timeSystem.update(d);
      runtime.customerSystem.update(d);
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
