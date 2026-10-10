/**
 * Coffee Empire — EconomySystem (M2.3)
 * Menerima event customer:served, menambah uang, emit
 * economy:money-changed.
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
        reason: 'unknown-product',
        payload: payload
      });
      return;
    }

    var margin = product.sellPrice - product.costPerCup;
    if (!Number.isFinite(margin) || margin <= 0) {
      this.eventBus.emit('economy:error', {
        reason: 'invalid-margin',
        payload: payload
      });
      return;
    }

    var total = this.gameState.get('money') + margin;
    this.gameState.set('money', total);
    this.gameState.set('servedCount', this.gameState.get('servedCount') + 1);

    this.eventBus.emit('economy:money-changed', {
      delta: margin,
      total: total,
      productId: productId,
      margin: margin
    });
  };

  EconomySystem.prototype.getMoney = function () {
    return this.gameState.get('money');
  };

  EconomySystem.prototype.getServedCount = function () {
    return this.gameState.get('servedCount');
  };

  return EconomySystem;
})();
