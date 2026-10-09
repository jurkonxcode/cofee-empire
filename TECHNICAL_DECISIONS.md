# TECHNICAL_DECISIONS.md — Coffee Empire

Versi: 0.3
Status: Aktif
Terakhir diperbarui: 2026-10-09
Perubahan v0.3:
- TD-002 diperbarui: Phaser UMD, bukan ESM.
- TD-003 diperbarui: tanpa import map, memakai script sequential loader.
- TD-008 masih berlaku (isometrik 2.5D modern, bukan pixel art).
- TD-019 (baru): namespace window.CoffeeEmpire.
- TD-020 (baru): strategi cache-busting ?v=.
- TD-021 (baru): menghapus asumsi ESM dari dokumen.

Catatan: keputusan-keputusan di bawah hanya mencerminkan yang benar-
benar dipakai di repo. Tidak ada keputusan fiktif.

## TD-001 · Bahasa & Ekosistem Runtime
Status: Diterima
Keputusan: JavaScript vanilla, tanpa transpile.
Kode & komentar: Inggris.
Dokumen proyek: Indonesia + istilah teknis Inggris.

## TD-002 · Framework Game (REVISI v0.3)
Status: Diterima
Keputusan: Phaser 3.80.1, build UMD, via CDN jsDelivr.
URL: https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js
Mengekspos: window.Phaser
Alasan perubahan dari v0.2: percobaan awal memakai phaser.esm.min.js
+ import map GAGAL di environment pengguna (browser tidak resolve
import map). Diuji, tidak berhasil, akhirnya memakai UMD.
Dampak: file bundle lebih besar (~1.2 MB), di-cache browser.

## TD-003 · Build Step & Loader (REVISI v0.3)
Status: Diterima
Keputusan:
- Tidak ada build step.
- Tidak ada import map.
- Script lokal dimuat sebagai <script> klasik.
- Loader sequential via inline script di index.html memakai
  document.createElement + onload chaining.
- Urutan: IsoUtils -> Tilemap -> CameraController -> main.js.
Alasan perubahan dari v0.2: import map tidak terbukti berfungsi
pada setup pengguna. Pendekatan script klasik lebih tahan banting.
Dampak: tidak ada tree-shaking, urutan manual, tetapi berjalan
di semua browser modern.

## TD-004 · Hosting
Status: Diterima
Keputusan: GitHub Pages, branch `main`, folder `/`.
Path: relatif (`./src/...`), bukan absolut.
Alasan: kompatibel dengan GitHub Pages subfolder (`/<repo>/`).

## TD-005 · Penyimpanan Progres
Status: Diterima (belum diimplementasikan)
Keputusan: localStorage, namespace `coffee-empire:save:v1`,
dengan abstraksi StorageService.
Dijadwalkan: M4.
Alasan: interface memudahkan migrasi ke cloud save di masa depan.

## TD-006 · Strategi Auto-Save
Status: Diterima (belum diimplementasikan)
Keputusan: auto-save 60 detik + save saat visibilitychange + manual.
Dijadwalkan: M4.

## TD-007 · UI Layer
Status: Diterima
Keputusan: UI utama di DOM/HTML/CSS, Phaser hanya render dunia.
Untuk M1, teks overlay memakai Phaser Text dengan setScrollFactor(0).
UI panel kompleks akan memakai DOM di M2+.
Alasan: layout CSS lebih andal di HP; aksesibilitas lebih baik.

## TD-008 · Visual & Aset
Status: Diterima
Keputusan:
- Gaya akhir: isometrik 2.5D modern dengan aset orisinal.
- M1: placeholder geometris (diamond warna).
- Aset final: SVG/PNG di `assets/` (dijadwalkan milestone visual).
Palet: coklat kopi, krem, hijau pastel, aksen oranye.
Alasan: memvalidasi gameplay dulu sebelum produksi aset.

## TD-009 · Isometrik
Status: Diterima
Keputusan: tile 64x32 (2:1).
Rumus:
  screenX = (gx - gy) * TILE_W / 2
  screenY = (gx + gy) * TILE_H / 2
Depth sort: gx + gy.
Alasan: standar industri, kompatibel dengan banyak tileset publik.

## TD-010 · Testing
Status: Diterima (belum diimplementasikan)
Keputusan: test in-browser via tests/index.html, uvu via CDN.
Dijadwalkan: M4 bersama StorageService.
Selama M0-M1, verifikasi via pengujian manual di HP.

## TD-011 · Event Bus
Status: Diterima (belum diimplementasikan)
Keputusan: satu EventBus global dengan topik `namespace:subjek:aksi`.
Dijadwalkan: M2.

## TD-012 · Bentuk State
Status: Diterima (belum diimplementasikan)
Keputusan: satu GameState (plain object, serializable JSON).
Dijadwalkan: M2.

## TD-013 · Migrasi Save
Status: Diterima (belum diimplementasikan)
Keputusan: setiap save menyimpan `version`, migrasi bertahap.
Dijadwalkan: M4.

## TD-014 · Aset Audio
Status: Ditunda (v0.4+).

## TD-015 · Git & Versioning
Status: Diterima
Keputusan:
- Branch utama: `main`.
- Commit prefix milestone: `[M0]`, `[M1]`, dst.
- Tag rilis: `v0.x.y` di akhir milestone.

## TD-016 · Ruang Lingkup M0
Status: Selesai
Keputusan: M0 membuat skeleton minimal:
- index.html, style.css (akhirnya tidak dipakai), README.md, .gitignore.
- src/main.js, src/config/gameConfig.js, src/config/constants.js.
- src/scenes/BootScene.js.
Catatan aktual: config/, scenes/, style.css akhirnya tidak dipakai
karena iterasi M0 berubah ke self-contained main.js.

## TD-017 · Lisensi & Privasi Repo
Status: Diterima
Keputusan:
- Repository: privat (sampai diputuskan lain).
- Lisensi publik: TIDAK ditambahkan otomatis.
- Nama "Coffee Empire": nama kerja.

## TD-018 · Bahasa
Status: Diterima
Keputusan:
- Dokumen proyek: Indonesia + istilah teknis Inggris.
- Kode & komentar: Inggris.
- UI game: Indonesia (Inggris menyusul).

## TD-019 · Namespace Global (BARU v0.3)
Status: Diterima
Keputusan: satu namespace global, `window.CoffeeEmpire`.
- Setiap modul menempel sebagai properti: `window.CoffeeEmpire.NamaModul`.
- Tidak ada variabel global di luar namespace ini.
- Hanya satu helper error yang menempel ke `window`
  (`window.showBootError`), karena dipakai oleh handler `onerror`
  di HTML yang tidak punya akses ke namespace saat itu.
- `window.Phaser` disediakan oleh Phaser UMD (bukan buatan kita).
- `window.__COFFEE_EMPIRE_GAME__` disediakan untuk debugging manual.

Alasan: menghindari tabrakan nama, memudahkan debugging,
memudahkan pemisahan tanggung jawab.

## TD-020 · Cache-Busting Aset (BARU v0.3)
Status: Diterima
Keputusan: query string `?v=ASSET_VERSION` pada setiap file lokal
yang dimuat loader.
- ASSET_VERSION didefinisikan sekali di inline script index.html.
- Naikkan setiap perubahan di:
  src/main.js, src/world/IsoUtils.js, src/world/Tilemap.js,
  src/world/CameraController.js.
- Tidak naikkan untuk perubahan HTML/CSS inline/dokumen .md.
- Tidak memakai timestamp (agar cache tidak selalu di-bust).

Alasan: Chrome Android agresif men-cache JS/CSS. GitHub Pages
tidak bisa mengirim header Cache-Control kustom. Query version
adalah cara yang andal dan didukung GitHub Pages.

## TD-021 · Penghapusan Asumsi ESM (BARU v0.3)
Status: Diterima
Keputusan: dokumen v0.2 masih menyebut ESM + import map. Pada v0.3,
semua referensi ke ESM dihapus. Arsitektur aktual memakai UMD/IIFE.

## Risiko Teknis yang Masih Berlaku

1. Performa isometrik di HP mid-range (belum diuji dengan banyak tile).
   Mitigasi: culling dan batas tile, uji di milestone lanjutan.
2. Ukuran Phaser via CDN (~1.2 MB).
   Mitigasi: cache browser; tidak reload setiap navigasi.
3. Debug tanpa DevTools lengkap.
   Mitigasi: helper `showBootError` di index.html; pesan error
   informatif di layar.
4. Circular dependency namespace.
   Mitigasi: urutan script dijaga manual; modul bawah tidak
   mengakses modul atas.
5. Cache browser agresif.
   Mitigasi: TD-020.

## Risiko yang Sudah Teratasi

- Import map gagal (teratasi dengan beralih ke UMD/IIFE).
- Layar kosong setelah BootScene (teratasi dengan ES6 class extends
  Phaser.Scene).
- Clamp kamera tidak memperhitungkan zoom (teratasi di rev 2
  CameraController).
