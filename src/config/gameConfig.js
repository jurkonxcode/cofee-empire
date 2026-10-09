/**
 * Coffee Empire — Phaser.Game configuration (M0).
 * Konfigurasi lengkap, termasuk daftar scene.
 * Tidak ada logika game di file ini.
 *
 * Dependency direction:
 *   main.js -> gameConfig.js -> BootScene.js -> constants.js
 * Tidak ada siklus.
 */

import Phaser from 'phaser';
import { VERSION, COLOR_BG } from './constants.js';
import { BootScene } from '../scenes/BootScene.js';

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: COLOR_BG,

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  render: {
    antialias: true,
    pixelArt: false
  },

  // Konfigurasi scene lengkap: BootScene didaftarkan di sini,
  // bukan dimutasi dari main.js.
  scene: [BootScene]
};

export { VERSION };
