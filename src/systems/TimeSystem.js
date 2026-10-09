/**
 * Coffee Empire — TimeSystem (M2.1)
 * Menggerakkan jam game berdasarkan delta waktu nyata.
 *
 * Rasio waktu:
 *   1 detik nyata = 5 menit game
 *   -> 1 menit game = 200 ms nyata
 *   -> 1 jam game   = 12 detik nyata
 *   -> 1 hari game  = 4,8 menit nyata
 *
 * Event yang dipancarkan:
 *   time:minute-changed  { day, hour, minute }
 *   time:hour-changed    { day, hour }
 *   time:day-changed     { day }
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.TimeSystem = (function () {
  'use strict';

  var GAME_MINUTES_PER_REAL_SECOND = 5;
  var MS_PER_GAME_MINUTE = 1000 / GAME_MINUTES_PER_REAL_SECOND; // 200 ms

  function TimeSystem(gameState, eventBus) {
    this.gameState = gameState;
    this.eventBus = eventBus;
    this._accumulatorMs = 0;
  }

  /**
   * Dipanggil setiap frame dengan delta waktu (ms).
   * Delta sudah di-clamp oleh caller (main.js).
   */
  TimeSystem.prototype.update = function (deltaMs) {
    if (!(deltaMs > 0)) return;
    this._accumulatorMs += deltaMs;

    // while, bukan if: kalau delta sangat besar (mis. 500 ms),
    // kita majukan beberapa menit game sekaligus.
    while (this._accumulatorMs >= MS_PER_GAME_MINUTE) {
      this._accumulatorMs -= MS_PER_GAME_MINUTE;
      this._advanceMinute();
    }
  };

  TimeSystem.prototype._advanceMinute = function () {
    var gs = this.gameState;
    var day = gs.get('day');
    var hour = gs.get('hour');
    var minute = gs.get('minute') + 1;

    if (minute >= 60) {
      minute = 0;
      hour += 1;

      if (hour >= 24) {
        hour = 0;
        day += 1;
        this.eventBus.emit('time:day-changed', { day: day });
      }

      this.eventBus.emit('time:hour-changed', { day: day, hour: hour });
    }

    gs.set('day', day);
    gs.set('hour', hour);
    gs.set('minute', minute);

    this.eventBus.emit('time:minute-changed', {
      day: day,
      hour: hour,
      minute: minute
    });
  };

  /**
   * Format HH:MM untuk keperluan tampilan / debug.
   */
  TimeSystem.prototype.formatTime = function () {
    var h = this.gameState.get('hour');
    var m = this.gameState.get('minute');
    var hh = (h < 10 ? '0' : '') + h;
    var mm = (m < 10 ? '0' : '') + m;
    return hh + ':' + mm;
  };

  TimeSystem.prototype.formatDay = function () {
    return 'Day ' + this.gameState.get('day');
  };

  return TimeSystem;
})();
