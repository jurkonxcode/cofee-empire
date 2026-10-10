/**
 * Coffee Empire — Tilemap (M2.6-mini)
 * Nilai tile:
 *   0 = lantai
 *   1 = dinding
 *   2 = counter (meja layanan)
 *   -1 = kosong (tidak dirender)
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.Tilemap = (function () {
  'use strict';

  var IsoUtils = window.CoffeeEmpire.IsoUtils;
  var TILE_W = IsoUtils.TILE_W;
  var TILE_H = IsoUtils.TILE_H;

  var COLOR_FLOOR_A = 0x8b6f47;
  var COLOR_FLOOR_B = 0xa68457;
  var COLOR_WALL = 0x3a2a1a;
  var COLOR_WALL_EDGE = 0x1a1410;
  var COLOR_COUNTER = 0xa06a3a;
  var COLOR_COUNTER_EDGE = 0x5a3a1a;
  var COLOR_EDGE = 0x000000;

  // Layout 8x8 dengan dinding border & counter di (3,4).
  // (0,4) sengaja lantai untuk entry/exit.
  var DEFAULT_GRID = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1]
  ];

  class Tilemap {
    constructor(scene, grid) {
      this.scene = scene;
      this.grid = grid || DEFAULT_GRID;
      this.rows = this.grid.length;
      this.cols = this.grid[0].length;
      this.graphics = scene.add.graphics();
    }

    render() {
      var g = this.graphics;
      g.clear();

      for (var gy = 0; gy < this.rows; gy++) {
        for (var gx = 0; gx < this.cols; gx++) {
          var value = this.grid[gy][gx];
          if (value < 0) continue;

          var p = IsoUtils.gridToScreen(gx, gy);
          var color;

          if (value === 1) {
            color = COLOR_WALL;
          } else if (value === 2) {
            color = COLOR_COUNTER;
          } else {
            color = ((gx + gy) % 2 === 0) ? COLOR_FLOOR_A : COLOR_FLOOR_B;
          }

          this._drawDiamond(p.x, p.y, color, value);
        }
      }
    }

    _drawDiamond(topX, topY, fillColor, value) {
      var g = this.graphics;
      g.fillStyle(fillColor, 1);

      if (value === 1) {
        g.lineStyle(2, COLOR_WALL_EDGE, 0.6);
      } else if (value === 2) {
        g.lineStyle(2, COLOR_COUNTER_EDGE, 0.7);
      } else {
        g.lineStyle(1, COLOR_EDGE, 0.15);
      }

      g.beginPath();
      g.moveTo(topX, topY);
      g.lineTo(topX + TILE_W / 2, topY + TILE_H / 2);
      g.lineTo(topX, topY + TILE_H);
      g.lineTo(topX - TILE_W / 2, topY + TILE_H / 2);
      g.closePath();
      g.fillPath();
      g.strokePath();
    }

    getWorldBounds() {
      var minX = Infinity, minY = Infinity;
      var maxX = -Infinity, maxY = -Infinity;

      for (var gy = 0; gy < this.rows; gy++) {
        for (var gx = 0; gx < this.cols; gx++) {
          if (this.grid[gy][gx] < 0) continue;
          var p = IsoUtils.gridToScreen(gx, gy);
          if (p.x - TILE_W / 2 < minX) minX = p.x - TILE_W / 2;
          if (p.x + TILE_W / 2 > maxX) maxX = p.x + TILE_W / 2;
          if (p.y < minY) minY = p.y;
          if (p.y + TILE_H > maxY) maxY = p.y + TILE_H;
        }
      }

      return {
        x: minX, y: minY,
        width: maxX - minX, height: maxY - minY
      };
    }
  }

  return Tilemap;
})();
