/**
 * Coffee Empire — CameraController (M1, rev 2)
 * Menangani drag (pan) dan pinch (zoom) pada kamera Phaser.
 * Mendukung mouse (desktop) dan touch (HP) via sistem pointer Phaser.
 *
 * Perbaikan rev 2:
 * - _clampScroll() memakai formula BaseCamera.clampX/clampY yang benar
 *   (memperhitungkan zoom dan semantik scrollX/scrollY sebagai jarak
 *   viewport, bukan koordinat dunia).
 * - _clampScroll() dipanggil setelah pinch zoom selesai.
 * - Event resize memicu re-clamp.
 *
 * Bergantung pada: Phaser (window.Phaser) sudah dimuat lebih dulu.
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.CameraController = (function () {
  'use strict';

  var MIN_ZOOM = 0.5;
  var MAX_ZOOM = 2.5;

  class CameraController {
    constructor(scene, options) {
      options = options || {};
      this.scene = scene;
      this.camera = scene.cameras.main;
      this.minZoom = options.minZoom || MIN_ZOOM;
      this.maxZoom = options.maxZoom || MAX_ZOOM;
      this.bounds = options.bounds || null;

      this._dragging = false;
      this._lastX = 0;
      this._lastY = 0;
      this._pinchStartDist = 0;
      this._pinchStartZoom = 1;

      // Aktifkan pointer kedua (multi-touch) untuk pinch.
      scene.input.addPointer(1);

      this._onDown = this._onPointerDown.bind(this);
      this._onMove = this._onPointerMove.bind(this);
      this._onUp = this._onPointerUp.bind(this);
      this._onResize = this._handleResize.bind(this);

      scene.input.on('pointerdown', this._onDown);
      scene.input.on('pointermove', this._onMove);
      scene.input.on('pointerup', this._onUp);
      scene.input.on('pointerupoutside', this._onUp);

      // Re-clamp saat layar berubah orientasi / ukuran.
      scene.scale.on('resize', this._onResize);

      this._applyZoomLimits();
    }

    _applyZoomLimits() {
      var z = this.camera.zoom;
      if (z < this.minZoom) this.camera.setZoom(this.minZoom);
      if (z > this.maxZoom) this.camera.setZoom(this.maxZoom);
    }

    _onPointerDown(pointer) {
      var p1 = this.scene.input.pointer1;
      var p2 = this.scene.input.pointer2;

      if (p1.isDown && p2.isDown) {
        this._pinchStartDist = Phaser.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);
        this._pinchStartZoom = this.camera.zoom;
        this._dragging = false;
      } else {
        this._dragging = true;
        this._lastX = pointer.x;
        this._lastY = pointer.y;
      }
    }

    _onPointerMove(pointer) {
      var p1 = this.scene.input.pointer1;
      var p2 = this.scene.input.pointer2;

      // --- Pinch zoom ---
      if (p1.isDown && p2.isDown) {
        var dist = Phaser.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);
        if (this._pinchStartDist > 0) {
          var ratio = dist / this._pinchStartDist;
          var newZoom = this._pinchStartZoom * ratio;
          newZoom = Phaser.Math.Clamp(newZoom, this.minZoom, this.maxZoom);
          this.camera.setZoom(newZoom);
          this._clampScroll();   // ← PERBAIKAN: clamp setelah zoom
        }
        this._dragging = false;
        return;
      }

      // --- Drag (pan) ---
      if (this._dragging && pointer.isDown) {
        var dx = pointer.x - this._lastX;
        var dy = pointer.y - this._lastY;
        // Sesuaikan dengan zoom: 1px layar = 1/zoom px dunia.
        this.camera.scrollX -= dx / this.camera.zoom;
        this.camera.scrollY -= dy / this.camera.zoom;
        this._lastX = pointer.x;
        this._lastY = pointer.y;
        this._clampScroll();
      }
    }

    _onPointerUp(pointer) {
      var p1 = this.scene.input.pointer1;
      var p2 = this.scene.input.pointer2;
      if (!p1.isDown && !p2.isDown) {
        this._dragging = false;
      }
      if (!p1.isDown || !p2.isDown) {
        this._pinchStartDist = 0;
      }
    }

    _handleResize() {
      // Camera.width/height diperbarui otomatis oleh Phaser Scale Manager
      // sebelum event ini. Tinggal re-clamp berdasarkan dimensi baru.
      this._clampScroll();
    }

    /**
     * Membatasi scrollX/scrollY agar world view tidak keluar dari bounds.
     *
     * Formula mengikuti BaseCamera.clampX / clampY:
     *   halfW      = camera.width / 2
     *   halfViewW  = halfW / zoom
     *   scrollX ∈ [halfViewW - halfW, worldWidth - halfW - halfViewW]
     *
     * Jika rentang tidak valid (peta lebih kecil dari viewport),
     * posisikan peta di tengah viewport.
     */
    _clampScroll() {
      if (!this.bounds) return;
      var cam = this.camera;

      var halfW = cam.width / 2;
      var halfH = cam.height / 2;
      var halfViewW = halfW / cam.zoom;
      var halfViewH = halfH / cam.zoom;

      var minScrollX = halfViewW - halfW;
      var maxScrollX = this.bounds.x + this.bounds.width - halfW - halfViewW;
      var minScrollY = halfViewH - halfH;
      var maxScrollY = this.bounds.y + this.bounds.height - halfH - halfViewH;

      // X axis
      if (minScrollX > maxScrollX) {
        // Peta lebih kecil dari viewport → center horizontal
        cam.scrollX = this.bounds.x + this.bounds.width / 2 - halfW;
      } else {
        cam.scrollX = Phaser.Math.Clamp(cam.scrollX, minScrollX, maxScrollX);
      }

      // Y axis
      if (minScrollY > maxScrollY) {
        // Peta lebih kecil dari viewport → center vertikal
        cam.scrollY = this.bounds.y + this.bounds.height / 2 - halfH;
      } else {
        cam.scrollY = Phaser.Math.Clamp(cam.scrollY, minScrollY, maxScrollY);
      }
    }

    centerOnWorldPoint(worldX, worldY) {
      this.camera.centerOn(worldX, worldY);
      this._clampScroll();
    }
  }

  return CameraController;
})();
