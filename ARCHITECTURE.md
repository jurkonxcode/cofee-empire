# ARCHITECTURE.md — Coffee Empire

Versi: 0.3
Status: Aktif
Terakhir diperbarui: 2026-10-09
Perubahan v0.3:
- Arsitektur disesuaikan dengan implementasi aktual: UMD/IIFE, bukan ESM.
- Script dimuat berurutan via <script> klasik; tidak ada import map.
- Namespace global: window.CoffeeEmpire.
- Cache-busting aset via query ?v=ASSET_VERSION.
- Catatan file lama yang tidak lagi dipakai (config/, scenes/, style.css).

## 1. Prinsip Arsitektur

1. Satu modul = satu tanggung jawab utama.
2. Modul berupa IIFE yang menempel ke namespace `window.CoffeeEmpire`.
3. Data konten dipisah dari logika.
4. Logika bisnis tidak berada di scene atau UI.
5. Satu sumber kebenaran state (`GameState`) — belum dibuat, dijadwalkan M2.
6. Komunikasi antar-sistem via `EventBus` — belum dibuat, dijadwalkan M2.
7. Tidak ada variabel global yang bocor ke `window` di luar namespace
   `window.CoffeeEmpire`.
8. Urutan pemuatan script bersifat sequential dan ditentukan di
   `index.html`.

## 2. Struktur Repo Aktual (M1 / v0.2.0)

/ (root)
├── index.html                    [AKTIF] — HTML + CSS inline + loader script
├── README.md                     [AKTIF] — dokumentasi ringkas
├── GAME_DESIGN.md                [AKTIF] — dokumen desain
├── ARCHITECTURE.md               [AKTIF] — dokumen ini
├── ROADMAP.md                    [AKTIF]
├── FILE_REGISTRY.md              [AKTIF]
├── TECHNICAL_DECISIONS.md        [AKTIF]
├── .gitignore                    [AKTIF]
│
├── src/
│   ├── main.js                   [AKTIF] — entry point, BootScene
│   │
│   ├── world/                    [AKTIF] — modul dunia isometrik
│   │   ├── IsoUtils.js           [AKTIF] — grid <-> screen
│   │   ├── Tilemap.js            [AKTIF] — render diamond 8x8
│   │   └── CameraController.js   [AKTIF, rev 2] — drag + pinch + clamp
│   │
│   ├── config/                   [TIDAK DIPAKAI sejak M0]
│   │   ├── constants.js
│   │   └── gameConfig.js
│   │
│   └── scenes/                   [TIDAK DIPAKAI sejak M0]
│       └── BootScene.js
│
└── style.css                     [TIDAK DIPAKAI — CSS inline di index.html]

## 3. Pola Modul — UMD/IIFE

Setiap modul punya bentuk:

    window.CoffeeEmpire = window.CoffeeEmpire || {};
    window.CoffeeEmpire.NamaModul = (function () {
      'use strict';
      // ... kode privat ...
      return { /* API publik */ };
    })();

Keuntungan:
- Tidak butuh bundler.
- Tidak butuh import map.
- Bisa dimuat sebagai <script> klasik.
- Bekerja di semua browser modern tanpa polyfill.

Batas:
- Tidak ada tree-shaking (semua modul dimuat utuh).
- Urutan pemuatan harus dijaga manual di index.html.
- Tidak ada type checking (JSDoc + konvensi sebagai ganti).

## 4. Urutan Pemuatan Script (index.html)

Urutan WAJIB, karena ada dependensi:

1. <script> inline: konstanta ASSET_VERSION, helper showBootError,
   inisialisasi namespace window.CoffeeEmpire.
2. <script src> Phaser UMD 3.80.1 dari CDN.
   → mengekspos window.Phaser.
3. <script> inline: loader sequential. Memuat berurutan:
   a. src/world/IsoUtils.js
   b. src/world/Tilemap.js       (butuh IsoUtils)
   c. src/world/CameraController.js (butuh Phaser)
   d. src/main.js               (butuh semua di atas)

Loader sequential memakai onload chaining agar dependensi dijamin
tersedia sebelum modul berikutnya dieksekusi.

## 5. Semantik Antar-Modul

- Modul menempel ke `window.CoffeeEmpire.<NamaModul>`.
- Modul publik: objek/kelas dengan API eksplisit.
- Modul tidak boleh menempelkan API baru ke `window` secara langsung.
- Modul boleh mengakses modul lain via `window.CoffeeEmpire.X`, dengan
  catatan modul tersebut sudah dimuat lebih dulu.

## 6. Alur Data (Aktual M1)

    [index.html]
      -> ASSET_VERSION, showBootError, window.CoffeeEmpire = {}
      -> Phaser UMD (window.Phaser)
      -> IsoUtils  -> window.CoffeeEmpire.IsoUtils
      -> Tilemap   -> window.CoffeeEmpire.Tilemap
      -> CameraController -> window.CoffeeEmpire.CameraController
      -> main.js   -> Phaser.Game + BootScene

    BootScene.create():
      - Instantiate Tilemap -> render 8x8
      - Hitung bounds
      - Center kamera
      - Instantiate CameraController (drag + pinch + clamp)

Belum ada EventBus. Belum ada GameState. Belum ada ekonomi.
Komunikasi antar-modul masih langsung (di main.js).

## 7. Cache-Busting Aset

- Konstanta `ASSET_VERSION` di `index.html` (inline script).
- Semua file lokal yang dimuat loader diberi suffix `?v=ASSET_VERSION`.
- Kapan dinaikkan: setiap perubahan salah satu file:
  - `src/main.js`
  - `src/world/IsoUtils.js`
  - `src/world/Tilemap.js`
  - `src/world/CameraController.js`
- Kapan tidak perlu: perubahan pada HTML/CSS inline/`.md`.
- Tidak memakai timestamp acak (agar tidak memaksa unduh ulang
  setiap kunjungan).

Catatan: `index.html` sendiri tidak diberi query version. GitHub Pages
meng-cache HTML untuk durasi singkat; cukup refresh browser.

## 8. Target Arsitektur (Belum Diimplementasikan)

Modul berikut direncanakan tetapi BELUM ADA:

- src/core/EventBus.js
- src/core/GameState.js
- src/systems/TimeSystem.js
- src/systems/EconomySystem.js
- src/systems/ProductSystem.js
- src/systems/CustomerSystem.js
- src/world/entities/Customer.js
- src/ui/HUD.js
- src/ui/uiBridge.js
- src/services/StorageService.js
- src/services/LocalStorageAdapter.js
- src/services/SaveManager.js

Semua akan mengikuti pola UMD/IIFE dan namespace `window.CoffeeEmpire`.

## 9. Aturan Dependensi

Diizinkan:
- main.js -> semua modul world, sistem masa depan
- world/* -> IsoUtils, Phaser
- systems/* -> GameState, EventBus, data
- ui/* -> EventBus, GameState (via bridge)
- data/* -> hanya utils murni

Dilarang:
- world/* -> scenes/* (scene bukan modul, mereka di main.js)
- systems/* -> Phaser GameObjects secara langsung
- main.js berisi logika bisnis (hanya init)

## 10. Aturan Bergaya

- Kode & komentar: Bahasa Inggris.
- Dokumen proyek: Bahasa Indonesia + istilah teknis Inggris.
- Setiap file diawali komentar header: nama, milestone, dependensi.
- 'use strict' di setiap IIFE.
- Tidak ada `var` di luar lingkup IIFE.
- Gunakan `class` untuk entitas dengan state, fungsi untuk utilitas.
