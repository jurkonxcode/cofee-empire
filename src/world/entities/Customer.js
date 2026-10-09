/**
 * Coffee Empire — Customer entity (M2.2c)
 * Karakter pelanggan dari Phaser Graphics + movement isometrik.
 *
 * Perubahan dari M2.2b:
 * - Tambah walkToGrid(gx, gy, onArrive) — gerak linear ke tile.
 * - Tambah update(deltaMs) — dipanggil per frame.
 * - Tambah state string untuk debugging.
 *
 * Belum ada: auto-spawn, antrean berlapis, layanan, transaksi.
 * Itu di M2.2d/M2.2e.
 *
 * Bergantung pada: window.CoffeeEmpire.IsoUtils.
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.Customer = (function () {
  'use strict';

  var IsoUtils = window.CoffeeEmpire.IsoUtils;
  var TILE_H = IsoUtils.TILE_H;

  var PALETTE = [
    0xc85a4a, 0x4a7ec8, 0x6bbf5a,
    0xc89f4a, 0x9c5ac8, 0x4ac8b8
  ];

  var COLOR_SKIN = 0xf0c9a0;
  var COLOR_HAIR = 0x3a2a1a;
  var COLOR_LEGS = 0x2a1a10;
  var COLOR_LINE = 0x000000;
  var LINE_ALPHA = 0.35;
  var DEPTH = 20;

  // Kecepatan jalan dalam pixel dunia per detik.
  // Entry (0,4) ke queue[0] (2,4) = ~71 px -> ~1.2 detik.
  var WALK_SPEED = 60;

  function Customer(scene, options) {
    options = options || {};
    this.scene = scene;
    this.color = options.color ||
      PALETTE[Math.floor(Math.random() * PALETTE.length)];

    this.gx = (options.gx != null) ? options.gx : 0;
    this.gy = (options.gy != null) ? options.gy : 4;

    this.state = 'idle';
    this._walking = false;
    this._targetScreen = null;
    this._targetGrid = null;
    this._onArrive = null;

    this.graphics = scene.add.graphics();
    this.graphics.setDepth(DEPTH);

    this._draw();
    this._updateScreenPosition();
  }

  Customer.prototype._draw = function () {
    var g = this.graphics;
    g.clear();

    // Bayangan
    g.fillStyle(0x000000, 0.25);
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(8, 4);
    g.lineTo(0, 8);
    g.lineTo(-8, 4);
    g.closePath();
    g.fillPath();

    // Kaki
    g.fillStyle(COLOR_LEGS, 1);
    g.fillRect(-4, -6, 8, 6);

    // Badan
    g.fillStyle(this.color, 1);
    g.fillRect(-6, -20, 12, 14);
    g.lineStyle(1, COLOR_LINE, LINE_ALPHA);
    g.strokeRect(-6, -20, 12, 14);

    // Kepala
    g.fillStyle(COLOR_SKIN, 1);
    g.fillCircle(0, -27, 6);
    g.lineStyle(1, COLOR_LINE, LINE_ALPHA);
    g.strokeCircle(0, -27, 6);

    // Rambut
    g.fillStyle(COLOR_HAIR, 1);
    g.beginPath();
    g.arc(0, -27, 6, Math.PI, 0, false);
    g.lineTo(6, -27);
    g.lineTo(-6, -27);
    g.closePath();
    g.fillPath();
  };

  Customer.prototype._updateScreenPosition = function () {
    var p = IsoUtils.gridToScreen(this.gx, this.gy);
    this.graphics.x = p.x;
    this.graphics.y = p.y + TILE_H / 2;
  };

  Customer.prototype.setGridPosition = function (gx, gy) {
    this.gx = gx;
    this.gy = gy;
    this._updateScreenPosition();
  };

  /**
   * Mulai jalan ke tile (gx, gy). Panggil onArrive saat tiba.
   * Kalau sedang jalan, target lama ditimpa.
   */
  Customer.prototype.walkToGrid = function (gx, gy, onArrive) {
    var target = IsoUtils.gridToScreen(gx, gy);
    this._targetScreen = { x: target.x, y: target.y + TILE_H / 2 };
    this._targetGrid = { gx: gx, gy: gy };
    this._onArrive = onArrive || null;
    this._walking = true;
    this.state = 'walking';
  };

  /**
   * Dipanggil setiap frame. deltaMs = ms sejak frame sebelumnya.
   */
  Customer.prototype.update = function (deltaMs) {
    if (!this._walking) return;
    if (!(deltaMs > 0)) return;

    var dt = deltaMs / 1000;
    var dx = this._targetScreen.x - this.graphics.x;
    var dy = this._targetScreen.y - this.graphics.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var step = WALK_SPEED * dt;

    if (dist <= step || dist === 0) {
      // Sudah sampai
      this.graphics.x = this._targetScreen.x;
      this.graphics.y = this._targetScreen.y;
      this.gx = this._targetGrid.gx;
      this.gy = this._targetGrid.gy;
      this._walking = false;
      this.state = 'idle';

      var cb = this._onArrive;
      this._onArrive = null;
      this._targetScreen = null;
      this._targetGrid = null;

      if (typeof cb === 'function') cb(this);
      return;
    }

    // Lanjut jalan
    var ratio = step / dist;
    this.graphics.x += dx * ratio;
    this.graphics.y += dy * ratio;
  };

  Customer.prototype.getWorldPosition = function () {
    return { x: this.graphics.x, y: this.graphics.y };
  };

  Customer.prototype.destroy = function () {
    if (this.graphics) {
      this.graphics.destroy();
      this.graphics = null;
    }
  };

  return Customer;
})();
