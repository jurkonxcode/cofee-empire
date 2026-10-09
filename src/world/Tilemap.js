/**
 * Coffee Empire — Tilemap (M1)
 * Menyimpan grid tile dan merendernya sebagai diamond isometrik.
 * Placeholder warna; aset visual asli menyusul di milestone berikutnya.
 *
 * Bergantung pada: window.CoffeeEmpire.IsoUtils (harus dimuat lebih dulu).
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.Tilemap = (function () {
  'use strict';

  var IsoUtils = window.CoffeeEmpire.IsoUtils;
  var TILE_W = IsoUtils.TILE_W;
  var TILE_H = IsoUtils.TILE_H;

  var COLOR_FLOOR_A = 0x8b6f47;
  var COLOR_FLOOR_B = 0xa68457;
  var COLOR_EDGE = 0x000000;

  // 0 = lantai, -1 = kosong (tidak dirender)
  var DEFAULT_GRID = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];

  class Tilemap {
    constructor(scene, grid) {
      this.scene = scene;
      this.grid = grid || DEFAULT_GRID;
      this.rows = this.grid.length;
      this.cols = this.grid[0].length;
      this.graphics = scene.add.graphics();
    }

    /**
     * Render ulang semua tile. Dipanggil setiap kali grid berubah
     * atau saat resize (karena posisi tile independen dari kamera,
     * sebenarnya tidak wajib re-render saat resize, tapi aman).
     */
    render() {
      var g = this.graphics;
      g.clear();

      // Urutkan berdasarkan gx + gy (depth-sort sederhana) — di M1 semua
      // tile setinggi 0, tapi urutan ini penting saat ada objek bertumpuk
      // di milestone berikutnya.
      for (var gy = 0; gy < this.rows; gy++) {
        for (var gx = 0; gx < this.cols; gx++) {
          var value = this.grid[gy][gx];
          if (value < 0) continue;

          var p = IsoUtils.gridToScreen(gx, gy);
          var color = ((gx + gy) % 2 === 0) ? COLOR_FLOOR_A : COLOR_FLOOR_B;
          this._drawDiamond(p.x, p.y, color);
        }
      }
    }

    _drawDiamond(topX, topY, fillColor) {
      // Diamond 4 titik: atas, kanan, bawah, kiri
      var g = this.graphics;
      g.fillStyle(fillColor, 1);
      g.lineStyle(1, COLOR_EDGE, 0.15);
      g.beginPath();
      g.moveTo(topX, topY);
      g.lineTo(topX + TILE_W / 2, topY + TILE_H / 2);
      g.lineTo(topX, topY + TILE_H);
      g.lineTo(topX - TILE_W / 2, topY + TILE_H / 2);
      g.closePath();
      g.fillPath();
      g.strokePath();
    }

    /**
     * Bounding box dunia untuk semua tile yang dirender.
     * Dipakai CameraController untuk membatasi pan/zoom.
     */
    getWorldBounds() {
      var minX = Infinity, minY = Infinity;
      var maxX = -Infinity, maxY = -Infinity;

      for (var gy = 0; gy < this.rows; gy++) {
        for (var gx = 0; gx < this.cols; gx++) {
          if (this.grid[gy][gx] < 0) continue;
          var p = IsoUtils.gridToScreen(gx, gy);
          // Diamond: titik top ada di p, extend ke kiri/kanan/bawah
          if (p.x - TILE_W / 2 < minX) minX = p.x - TILE_W / 2;
          if (p.x + TILE_W / 2 > maxX) maxX = p.x + TILE_W / 2;
          if (p.y < minY) minY = p.y;
          if (p.y + TILE_H > maxY) maxY = p.y + TILE_H;
        }
      }

      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    }
  }

  return Tilemap;
})();
