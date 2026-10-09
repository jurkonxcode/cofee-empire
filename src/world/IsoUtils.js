/**
 * Coffee Empire — IsoUtils (M1)
 * Konversi koordinat grid <-> screen untuk isometrik 2:1.
 * Pure math, tanpa dependensi Phaser.
 * Referensi rumus: standar isometrik 2:1 (tile 64x32).
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.IsoUtils = (function () {
  'use strict';

  var TILE_W = 64;
  var TILE_H = 32;

  /**
   * Grid isometrik -> koordinat layar.
   * Nilai x,y adalah pixel di dunia game (bukan layar).
   * Titik (0,0) adalah ujung atas diamond tile (0,0).
   */
  function gridToScreen(gx, gy) {
    return {
      x: (gx - gy) * (TILE_W / 2),
      y: (gx + gy) * (TILE_H / 2)
    };
  }

  /**
   * Koordinat layar -> grid (hasil float, perlu Math.round/floor).
   * Gunakan untuk picking: cari tile mana yang diklik.
   */
  function screenToGrid(sx, sy) {
    return {
      gx: ((sx / (TILE_W / 2)) + (sy / (TILE_H / 2))) / 2,
      gy: ((sy / (TILE_H / 2)) - (sx / (TILE_W / 2))) / 2
    };
  }

  return {
    TILE_W: TILE_W,
    TILE_H: TILE_H,
    gridToScreen: gridToScreen,
    screenToGrid: screenToGrid
  };
})();
