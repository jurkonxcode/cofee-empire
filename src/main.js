/**
 * Coffee Empire — DIAGNOSTIC main.js
 * Versi sementara tanpa import. Tujuan: memverifikasi bahwa
 * main.js sendiri dapat dimuat oleh browser.
 * Jika versi ini berhasil tampil, maka masalah ada di salah satu
 * file yang sebelumnya di-import (gameConfig.js, BootScene.js,
 * atau constants.js).
 */

console.log('[Coffee Empire] main.js berhasil dimuat.');

// Tulis pesan di DOM supaya terlihat di HP (tanpa perlu DevTools).
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('boot-error');
  if (el) el.style.display = 'none';

  var box = document.createElement('div');
  box.style.cssText =
    'position:fixed;inset:0;display:flex;align-items:center;' +
    'justify-content:center;background:#1a1410;color:#f5e6d3;' +
    'font-family:system-ui,sans-serif;text-align:center;padding:24px;z-index:9999;';
  box.innerHTML =
    '<div>' +
    '<strong style="font-size:20px">main.js berhasil dimuat</strong>' +
    '<p style="margin-top:12px;color:#a68457;font-size:13px">' +
    'Jika pesan ini terlihat, main.js sendiri baik.<br>' +
    'Masalah ada di salah satu file yang di-import.' +
    '</p>' +
    '</div>';
  document.body.appendChild(box);

  if (window.__COFFEE_EMPIRE__) {
    window.__COFFEE_EMPIRE__.markBooted();
  }
});

export default null;
