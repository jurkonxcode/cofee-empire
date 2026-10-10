/**
 * Coffee Empire — EconomySystem (M2.5)
 * Tambah: tryBuyUpgrade(upgradeId, upgradesData) -> boolean.
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.EconomySystem = (function () {
  'use strict';

  function EconomySystem(gameState, eventBus, products) {
    this.gameState = gameState;
    this.eventBus = eventBus;
    this.products = products;

    var self = this;
    this.eventBus.on('customer:served', function (payload) {
      self._onCustomerServed(payload);
    });
  }

  EconomySystem.prototype._onCustomerServed = function (payload) {
    var productId = (payload && payload.productId)
      ? payload.productId
      : window.CoffeeEmpire.Data.defaultProductId;

    var product = this.products[productId];
    if (!product) {
      this.eventBus.emit('economy:error', {
        reason: 'unknown-product', payload: payload
      });
      return;
    }

    var margin = product.sellPrice - product.costPerCup;
    if (!Number.isFinite(margin) || margin <= 0) {
      this.eventBus.emit('economy:error', {
        reason: 'invalid-margin', payload: payload
      });
      return;
    }

    var total = this.gameState.get('money') + margin;
    this.gameState.set('money', total);
    this.gameState.set('servedCount', this.gameState.get('servedCount') + 1);

    this.eventBus.emit('economy:money-changed', {
      delta: margin, total: total,
      productId: productId, margin: margin, reason: 'sale'
    });
  };

  EconomySystem.prototype.tryBuyUpgrade = function (upgradeId, upgradesData) {
    if (!upgradesData || !upgradesData[upgradeId]) {
      this.eventBus.emit('economy:upgrade-failed', { reason: 'unknown-upgrade' });
      return false;
    }
    var upgrade = upgradesData[upgradeId];
    var owned = this.gameState.get('upgradesPurchased');
    if (owned.indexOf(upgradeId) >= 0) {
      this.eventBus.emit('economy:upgrade-failed', { reason: 'already-owned' });
      return false;
    }
    var money = this.gameState.get('money');
    if (money < upgrade.price) {
      this.eventBus.emit('economy:upgrade-failed', { reason: 'insufficient-money' });
      return false;
    }

    this.gameState.set('money', money - upgrade.price);

    var newOwned = owned.slice();
    newOwned.push(upgradeId);
    this.gameState.set('upgradesPurchased', newOwned);

    if (upgrade.effect) {
      for (var key in upgrade.effect) {
        if (Object.prototype.hasOwnProperty.call(upgrade.effect, key)) {
          this.gameState.set(key, upgrade.effect[key]);
        }
      }
    }

    this.eventBus.emit('economy:money-changed', {
      delta: -upgrade.price,
      total: money - upgrade.price,
      reason: 'upgrade',
      upgradeId: upgradeId
    });
    this.eventBus.emit('economy:upgraded', { upgradeId: upgradeId });
    return true;
  };

  EconomySystem.prototype.getMoney = function () {
    return this.gameState.get('money');
  };

  EconomySystem.prototype.getServedCount = function () {
    return this.gameState.get('servedCount');
  };

  return EconomySystem;
})();
