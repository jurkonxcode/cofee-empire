/**
 * Coffee Empire — Entry Point (M0).
 * Membuat Phaser.Game dengan konfigurasi lengkap dari gameConfig.
 * Tidak memutasi gameConfig, tidak ada logika game di file ini.
 */

import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig.js';

let game = null;

try {
  game = new Phaser.Game(gameConfig);
  window.__COFFEE_EMPIRE_GAME__ = game;
} catch (err) {
  const msg = (err && err.message) ? err.message : 'Gagal membuat Phaser.Game';
  if (window.__COFFEE_EMPIRE__) {
    window.__COFFEE_EMPIRE__.showError(msg);
  }
  // Lempar ulang agar tetap tercatat di console.
  throw err;
}

export default game;
