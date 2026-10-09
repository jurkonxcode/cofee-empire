# TECHNICAL_DECISIONS.md — Coffee Empire

Versi: 0.1
Status: Draft
Terakhir diperbarui: 2026-10-09

Setiap entri memakai format ADR ringkas:
ID · Judul · Status · Konteks · Keputusan · Alternatif · Dampak

---

## TD-001 · Bahasa & Ekosistem Runtime

Status: Diterima
Konteks: Pemain di HP, pengembang di HP, target web.
Keputusan: JavaScript ES Modules murni, tanpa transpile.
Alternatif:
- TypeScript + build (butuh build step).
- CoffeeScript / Elm (ekosistem kecil).
Dampak: Tidak ada type safety; digantikan JSDoc + konvensi.

---

## TD-002 · Framework Game

Status: Diterima
Konteks: Butuh render 2D isometrik, sprite, kamera.
Keputusan: Phaser 3.80+ (via CDN).
Alternatif:
- PixiJS (lebih low-level, perlu lebih banyak kerja).
- Canvas murni (lambat berkembang).
Dampak: Bundle besar (~1.2 MB gzip) tapi sekali load,
          di-cache browser.

---

## TD-003 · Build Step

Status: Diterima
Konteks: Pengembangan dari GitHub Web di HP.
Keputusan: **Tidak ada build step** pada v1.
- Phaser diimpor via `<script type="importmap">` dari
  `https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.esm.js`.
- Kode `src/*.js` di-load sebagai ES Modules native browser.
Alternatif:
- Vite + GitHub Actions (build di CI).
- Parcel (butuh node lokal).
Dampak:
- Positif: edit → commit → live, cepat, dari HP.
- Negatif: tidak bisa tree-shake, tidak bisa pakai npm
  package yang hanya ESM Node.
Migrasi: Jika nanti butuh TS/bundler, siapkan
         `vite.config.js` di v0.6 tanpa mengubah struktur.

---

## TD-004 · Hosting

Status: Diterima
Keputusan: GitHub Pages (branch `main`, folder `/`).
Alternatif: Netlify, Vercel, Cloudflare Pages.
Dampak: URL `https://<user>.github.io/<repo>/`.
         Perlu memperhatikan base path relatif
         (gunakan path relatif di HTML, bukan absolut).

---

## TD-005 · Penyimpanan Progres

Status: Diterima
Keputusan: `localStorage`, namespace `coffee-empire:save:v1`,
           dengan abstraksi `StorageService`.
Alternatif:
- IndexedDB (lebih besar, lebih rumit).
- Supabase (butuh akun, network).
Dampak: Batas ~5 MB per origin. Cukup untuk save JSON.
        Interface siap untuk adapter cloud di v0.6.

---

## TD-006 · Strategi Auto-Save

Status: Diterima
Keputusan:
- Auto-save tiap 60 detik game.
- Save saat `document.visibilitychange` (tab disembunyikan).
- Save manual via tombol di Settings.
Alternatif: Hanya manual.
Dampak: HP lock / browser crash tetap aman.

---

## TD-007 · UI Layer

Status: Diterima
Keputusan: 100% UI di DOM/HTML/CSS, Phaser hanya render dunia.
Alternatif: Semua di Phaser (satu canvas).
Dampak:
- Positif: aksesibilitas, layout CSS, mudah di-debug.
- Negatif: dua sistem koordinat (canvas vs DOM) —
  dijembatani lewat `uiBridge`.
- Positif: tidak ada konflik pointer di HP.

---

## TD-008 · Pixel Art

Status: Diterima
Keputusan: Pixel art 16×16 disimpan sebagai array JS di
           `src/data/sprites.js`. Render via `pixelArt.js`.
Alternatif:
- PNG spritesheet (butuh file gambar).
- SVG (tidak "pixel" secara alami).
Dampak:
- Positif: 0 file gambar, mudah diedit dari HP.
- Negatif: file JS bisa membengkak jika sprite banyak.
  Solusi: migrasi ke PNG pada v0.5 saat sprite > 40.

---

## TD-009 · Isometrik

Status: Diterima
Keputusan: Tile 64×32 (2:1), rumus:
    screenX = (gx - gy) * TILE_W / 2
    screenY = (gx + gy) * TILE_H / 2
Depth sort: `gx + gy`, tie-breaker `gy`.
Alternatif: Tile 32×16 (lebih retro tapi detail terbatas).
Dampak: 64×32 = standar industri isometrik, kompatibel
        dengan banyak tileaset publik bila migrasi nanti.

---

## TD-010 · Testing

Status: Diterima
Keputusan: Test in-browser via `tests/index.html`
           memakai `uvu` (CDN). CI menyusul v0.2.
Alternatif:
- Vitest + Actions (butuh build).
- Tidak ada test (risiko tinggi di ekonomi).
Dampak: Test mudah dijalankan dari HP dengan buka URL.

---

## TD-011 · Event Bus

Status: Diterima
Keputusan: Satu EventBus global (wrapper Phaser.Events).
           Topik memakai format `namespace:subjek:aksi`.
Alternatif: Callback langsung antar-sistem.
Dampak: Menghindari circular dep; debug event lebih mudah.

---

## TD-012 · Bentuk State

Status: Diterima
Keputusan: Satu `GameState` (objek plain, serializable JSON).
           Hanya Systems yang boleh mutasi.
Alternatif: State tersebar per sistem.
Dampak: Save/load trivial; sulit untuk partial state —
        tercakup di serialize() per sistem.

---

## TD-013 · Migrasi Save

Status: Diterima
Keputusan: Setiap save menyimpan `version`. SaveManager
           menjalankan migrasi bertahap v(n) -> v(n+1).
Alternatif: Selalu reset saat versi berubah (buruk).
Dampak: Butuh disiplin menulis migrasi tiap rilis besar.

---

## TD-014 · Aset Audio

Status: Ditunda (v0.4)
Konteks: Butuh file audio di `assets/audio/`.
Keputusan (sementara): Tidak ada audio hingga v0.4.
Dampak: Fokus gameplay dulu.

---

## TD-015 · Git & Versioning

Status: Diterima
Keputusan:
- Branch utama: `main`.
- Tag rilis: `v0.x.y` di akhir tiap milestone.
- Commit message format: `[M0] ...` dengan prefix milestone.
Alternatif: Gitflow (overhead untuk solo dev).
Dampak: Sejarah mudah dibaca dari log GitHub di HP.

---

## Risiko Teknis yang Perlu Diantisipasi

1. **Performa isometrik di HP mid-range.**
   Mitigasi: batas ~200 tile terlihat, culling, hindari
   shader berat, sprite kecil (16×16).
2. **Ukuran Phaser via CDN.**
   Mitigasi: cache by browser, tidak reload setiap navigasi.
   Jika jadi masalah, migrasi ke build + tree-shake.
3. **Debug tanpa DevTools lengkap di HP.**
   Mitigasi: on-screen debug overlay (FPS, log 10 terakhir)
   yang bisa dinyalakan dari Settings.
4. **Save terlalu besar (> 5 MB).**
   Mitigasi: hanya simpan delta state, hindari riwayat
   transaksi tak terbatas, pangkas `dailyHistory` > 90 hari.
5. **Circular dependency ES Modules.**
   Mitigasi: disiplin mengikuti `ARCHITECTURE.md`,
   gunakan Registry & EventBus untuk lookup.
6. **Path absolut di GitHub Pages subfolder.**
   Mitigasi: seluruh path di HTML/CSS/JS bersifat **relatif**.
