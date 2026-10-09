/**
 * Coffee Empire — CafeLayout (M2.2a)
 * Definisi titik-titik penting di kedai dalam koordinat grid:
 *   entry, queue[], counter, exit.
 * Menyediakan render penanda visual (debug) di atas tilemap.
 *
 * Bergantung pada: window.CoffeeEmpire.IsoUtils (harus dimuat lebih dulu).
 * Tidak menyentuh Tilemap.js, CameraController.js, atau main.js.
 *
 * Catatan penting:
 * - Ini definisi statis. Belum ada pelanggan yang bergerak.
 * - Pergerakan pelanggan diimplementasikan di M2.2b (Customer.js).
 * - Penanda visual di sini adalah debug. Akan dihapus saat
 *   aset visual asli masuk.
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.CafeLayout = (function () {
  'use strict';

  var IsoUtils = window.CoffeeEmpire.IsoUtils;
  var TILE_W = IsoUtils.TILE_W;
  var TILE_H = IsoUtils.TILE_H;

  // Konfigurasi waypoint default untuk peta 8x8.
  // Semua titik sejajar dalam sumbu isometrik agar pergerakan
  // pelanggan (M2.2b) langsung lurus tanpa pathfinding.
  var DEFAULT_LAYOUT = {
    entry:   { gx: 0, gy: 4 },
    queue:   [
      { gx: 2, gy: 4 },
      { gx: 2, gy: 5 },
      { gx: 2, gy: 6 },
      { gx: 2, gy: 7 }
    ],
    counter: { gx: 3, gy: 4 },
    exit:    { gx: 0, gy: 4 }
  };

  // Warna penanda (debug).
  var COLOR_ENTRY   = 0x4a90d9; // biru
  var COLOR_QUEUE   = 0xd9c34a; // kuning
  var COLOR_COUNTER = 0xd94a4a; // merah
  var MARKER_HALF_W = 10;
  var MARKER_HALF_H = 5;
  var MARKER_ALPHA  = 0.85;

  function CafeLayout(scene, layout) {
    this.scene = scene;
    this.layout = layout || DEFAULT_LAYOUT;
    this.graphics = scene.add.graphics();
    // Pastikan penanda berada di atas tilemap (default depth lebih tinggi).
    this.graphics.setDepth(10);
  }

  /**
   * Gambar penanda di semua waypoint. Dipanggil sekali di create().
   * Tidak ada loop per-frame.
   */
  CafeLayout.prototype.render = function () {
    var g = this.graphics;
    g.clear();

    var self = this;
    var L = this.layout;

    // Entry
    this._drawMarker(L.entry, COLOR_ENTRY, 'E');

    // Queue (beri nomor index)
    for (var i = 0; i < L.queue.length; i++) {
      this._drawMarker(L.queue[i], COLOR_QUEUE, String(i));
    }

    // Counter
    this._drawMarker(L.counter, COLOR_COUNTER, 'C');

    // Exit (jika berbeda dari entry)
    if (L.exit.gx !== L.entry.gx || L.exit.gy !== L.entry.gy) {
      this._drawMarker(L.exit, COLOR_ENTRY, 'X');
    }
  };

  CafeLayout.prototype._drawMarker = function (wp, color, label) {
    var g = this.graphics;

    // IsoUtils.gridToScreen mengembalikan TOP corner diamond,
    // bukan CENTER. Untuk penempatan marker, kita pakai CENTER.
    var p = IsoUtils.gridToScreen(wp.gx, wp.gy);
    var cx = p.x;
    var cy = p.y + TILE_H / 2;

    // Diamond kecil
    g.fillStyle(color, MARKER_ALPHA);
    g.lineStyle(1, 0x000000, 0.35);
    g.beginPath();
    g.moveTo(cx, cy - MARKER_HALF_H);
    g.lineTo(cx + MARKER_HALF_W, cy);
    g.lineTo(cx, cy + MARKER_HALF_H);
    g.lineTo(cx - MARKER_HALF_W, cy);
    g.closePath();
    g.fillPath();
    g.strokePath();
  };

  /**
   * Helper: konversi waypoint grid ke koordinat layar (CENTER tile).
   * Dipakai M2.2b untuk animasi posisi pelanggan.
   */
  CafeLayout.prototype.waypointToScreen = function (wp) {
    var p = IsoUtils.gridToScreen(wp.gx, wp.gy);
    return {
      x: p.x,
      y: p.y + TILE_H / 2
    };
  };

  /**
   * Ambil queue slot ke-index. Return null kalau out of range.
   */
  CafeLayout.prototype.getQueueSlot = function (index) {
    if (index < 0 || index >= this.layout.queue.length) return null;
    return this.layout.queue[index];
  };

  /**
   * Jumlah slot antrean.
   */
  CafeLayout.prototype.getQueueSize = function () {
    return this.layout.queue.length;
  };

  return CafeLayout;
})();
