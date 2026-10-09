/**
 * Coffee Empire — GameState (M2.1)
 * Sumber kebenaran tunggal untuk state runtime.
 *
 * PENTING: Ini state runtime, BUKAN save permanen.
 * Sistem save/load (localStorage) direncanakan di M4.
 * State ini hilang setiap reload halaman sampai M4 selesai.
 *
 * Data yang disimpan (bentuk lengkap untuk M2):
 *   money              — uang pemain
 *   day                — hari game
 *   hour, minute       — waktu game (jam buka awal 08:00)
 *   servedCount        — total pelanggan dilayani (diisi di M2.3)
 *   upgradesPurchased  — daftar id upgrade yang sudah dibeli (M2.5)
 *
 * Hanya `money`, `day`, `hour`, `minute` yang dipakai di M2.1.
 * Key lain disiapkan sebagai bentuk skema agar M2.3/M2.5 tidak
 * perlu mengubah struktur.
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.GameState = (function () {
  'use strict';

  var DEFAULT_DATA = {
    money: 100,
    day: 1,
    hour: 8,
    minute: 0,
    servedCount: 0,
    upgradesPurchased: []
  };

  function cloneDefaults() {
    return {
      money: DEFAULT_DATA.money,
      day: DEFAULT_DATA.day,
      hour: DEFAULT_DATA.hour,
      minute: DEFAULT_DATA.minute,
      servedCount: DEFAULT_DATA.servedCount,
      upgradesPurchased: DEFAULT_DATA.upgradesPurchased.slice()
    };
  }

  function GameState(eventBus) {
    this.eventBus = eventBus || null;
    this.data = cloneDefaults();
  }

  GameState.prototype.get = function (key) {
    return this.data[key];
  };

  /**
   * Set nilai. Jika berubah, emit 'state:changed'.
   * Tidak emit jika nilai sama (menghindari spam event).
   */
  GameState.prototype.set = function (key, value) {
    if (this.data[key] === value) return this;
    this.data[key] = value;
    if (this.eventBus) {
      this.eventBus.emit('state:changed', { key: key, value: value });
    }
    return this;
  };

  /**
   * Snapshot ringan untuk debugging / save ke depannya.
   */
  GameState.prototype.snapshot = function () {
    return JSON.parse(JSON.stringify(this.data));
  };

  return GameState;
})();
