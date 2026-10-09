/**
 * Coffee Empire — EventBus (M2.1)
 * Event bus global sederhana. Pola UMD/IIFE, tanpa dependensi eksternal.
 *
 * Tanggung jawab: distribusi event antar-sistem tanpa membuat
 * sistem saling import (mencegah circular dependency).
 *
 * Pemakaian:
 *   var bus = new window.CoffeeEmpire.EventBus();
 *   bus.on('time:tick', function (payload) { ... });
 *   bus.emit('time:tick', { minute: 5 });
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.EventBus = (function () {
  'use strict';

  function EventBus() {
    this._listeners = Object.create(null);
  }

  /**
   * Mendaftarkan listener untuk satu event.
   * Return `this` untuk chaining.
   */
  EventBus.prototype.on = function (eventName, callback, context) {
    if (typeof callback !== 'function') return this;
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [];
    }
    this._listeners[eventName].push({
      fn: callback,
      ctx: context || null
    });
    return this;
  };

  /**
   * Menghapus listener.
   * - Tanpa argumen callback: hapus semua listener untuk event ini.
   * - Dengan callback: hapus yang cocok.
   */
  EventBus.prototype.off = function (eventName, callback, context) {
    var list = this._listeners[eventName];
    if (!list) return this;

    if (typeof callback !== 'function') {
      delete this._listeners[eventName];
      return this;
    }

    var ctx = context || null;
    this._listeners[eventName] = list.filter(function (l) {
      return !(l.fn === callback && l.ctx === ctx);
    });

    if (this._listeners[eventName].length === 0) {
      delete this._listeners[eventName];
    }
    return this;
  };

  /**
   * Mengirim event ke semua listener.
   * Error di satu listener tidak menghentikan listener lain.
   */
  EventBus.prototype.emit = function (eventName, payload) {
    var list = this._listeners[eventName];
    if (!list || list.length === 0) return this;

    // Iterasi atas salinan agar listener yang menambah/menghapus
    // listener lain tidak mengganggu loop.
    var copy = list.slice();
    for (var i = 0; i < copy.length; i++) {
      try {
        copy[i].fn.call(copy[i].ctx, payload);
      } catch (err) {
        if (typeof console !== 'undefined' && console.error) {
          console.error(
            '[EventBus] listener error untuk "' + eventName + '":',
            err
          );
        }
      }
    }
    return this;
  };

  return EventBus;
})();
