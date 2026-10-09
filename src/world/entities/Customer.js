/**
 * Coffee Empire — Customer entity (M2.2b)
 * Karakter pelanggan sederhana dari Phaser Graphics.
 * Belum bergerak. Belum auto-spawn. Belum punya state AI.
 *
 * Bergantung pada: window.CoffeeEmpire.IsoUtils (harus dimuat lebih dulu).
 *
 * Bentuk karakter (dari bawah ke atas):
 *   - Bayangan diamond (iso)
 *   - Kaki (rect gelap)
 *   - Badan (rect berwarna, warna unik per instance)
 *   - Kepala (lingkaran warna kulit)
 *   - Rambut (arc gelap di atas kepala)
 *
 * Semua digambar relatif ke titik (0,0) di graphics.x/y.
 * Titik (0,0) = kaki pelanggan, yang diletakkan di CENTER tile.
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.Customer = (function () {
  'use strict';

  var IsoUtils = window.CoffeeEmpire.IsoUtils;
  var TILE_H = IsoUtils.TILE_H;

  // Palet warna badan. Setiap instance dapat satu warna acak.
  var PALETTE = [
    0xc85a4a, // merah bata
    0x4a7ec8, // biru
    0x6bbf5a, // hijau
    0xc89f4a, // oranye
    0x9c5ac8, // ungu
    0x4ac8b8  // teal
  ];

  var COLOR_SKIN  = 0xf0c9a0;
  var COLOR_HAIR  = 0x3a2a1a;
  var COLOR_LEGS  = 0x2a1a10;
  var COLOR_LINE  = 0x000000;
  var LINE_ALPHA  = 0.35;
  var DEPTH       = 20; // di atas tilemap (0) dan marker (10)

  function Customer(scene, options) {
    options = options || {};
    this.scene = scene;
    this.color = options.color ||
      PALETTE[Math.floor(Math.random() * PALETTE.length)];

    // Posisi grid awal. Default: entry (0, 4).
    this.gx = (options.gx != null) ? options.gx : 0;
    this.gy = (options.gy != null) ? options.gy : 4;

    this.graphics = scene.add.graphics();
    this.graphics.setDepth(DEPTH);

    this._draw();
    this._updateScreenPosition();
  }

  Customer.prototype._draw = function () {
    var g = this.graphics;
    g.clear();

    // --- Bayangan (diamond kecil) ---
    g.fillStyle(0x000000, 0.25);
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(8, 4);
    g.lineTo(0, 8);
    g.lineTo(-8, 4);
    g.closePath();
    g.fillPath();

    // --- Kaki ---
    g.fillStyle(COLOR_LEGS, 1);
    g.fillRect(-4, -6, 8, 6);

    // --- Badan ---
    g.fillStyle(this.color, 1);
    g.fillRect(-6, -20, 12, 14);
    g.lineStyle(1, COLOR_LINE, LINE_ALPHA);
    g.strokeRect(-6, -20, 12, 14);

    // --- Kepala ---
    g.fillStyle(COLOR_SKIN, 1);
    g.fillCircle(0, -27, 6);
    g.lineStyle(1, COLOR_LINE, LINE_ALPHA);
    g.strokeCircle(0, -27, 6);

    // --- Rambut (setengah lingkaran atas kepala) ---
    g.fillStyle(COLOR_HAIR, 1);
    g.beginPath();
    g.arc(0, -27, 6, Math.PI, 0, false);
    g.lineTo(6, -27);
    g.lineTo(-6, -27);
    g.closePath();
    g.fillPath();
  };

  /**
   * Pindahkan pelanggan ke tile grid. Titik (0,0) graphics
   * diletakkan di CENTER tile.
   */
  Customer.prototype.setGridPosition = function (gx, gy) {
    this.gx = gx;
    this.gy = gy;
    this._updateScreenPosition();
  };

  Customer.prototype._updateScreenPosition = function () {
    var p = IsoUtils.gridToScreen(this.gx, this.gy);
    // gridToScreen mengembalikan TOP corner diamond.
    // Untuk kaki di CENTER, geser ke bawah sebesar TILE_H / 2.
    this.graphics.x = p.x;
    this.graphics.y = p.y + TILE_H / 2;
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
