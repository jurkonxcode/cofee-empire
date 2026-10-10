/**
 * Coffee Empire — GameState (M2.5)
 * Sumber kebenaran tunggal untuk state runtime.
 * BUKAN save permanen (save/load dijadwalkan M4).
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
    upgradesPurchased: [],
    serviceTimeMs: 3000
  };

  function cloneDefaults() {
    return {
      money: DEFAULT_DATA.money,
      day: DEFAULT_DATA.day,
      hour: DEFAULT_DATA.hour,
      minute: DEFAULT_DATA.minute,
      servedCount: DEFAULT_DATA.servedCount,
      upgradesPurchased: DEFAULT_DATA.upgradesPurchased.slice(),
      serviceTimeMs: DEFAULT_DATA.serviceTimeMs
    };
  }

  function GameState(eventBus) {
    this.eventBus = eventBus || null;
    this.data = cloneDefaults();
  }

  GameState.prototype.get = function (key) {
    return this.data[key];
  };

  GameState.prototype.set = function (key, value) {
    if (this.data[key] === value) return this;
    this.data[key] = value;
    if (this.eventBus) {
      this.eventBus.emit('state:changed', { key: key, value: value });
    }
    return this;
  };

  GameState.prototype.snapshot = function () {
    return JSON.parse(JSON.stringify(this.data));
  };

  return GameState;
})();
