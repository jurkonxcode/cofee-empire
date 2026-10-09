# ROADMAP.md — Coffee Empire

Versi: 0.3
Status: Aktif
Terakhir diperbarui: 2026-10-09

Legenda: ✅ selesai · 🟡 dalam proses · ⬜ belum · ❌ dibatalkan

## M0 — Fondasi & Publikasi
Status: ✅ Selesai
Deliverable:
- ✅ Skeleton Phaser + GitHub Pages.
- ✅ index.html dengan CSS inline + loader script.
- ✅ src/main.js self-contained (UMD/IIFE).
- ✅ Layar coklat dengan judul + versi + placeholder.
Catatan aktual: awalnya direncanakan ESM + import map; ganti ke
UMD karena import map gagal di environment pengguna.

## M0.1 — Ketajaman & Cache-Busting
Status: ✅ Selesai
Deliverable:
- ✅ setResolution(DPR) pada semua objek Text.
- ✅ ASSET_VERSION + query ?v= pada main.js.
- ✅ Perbandingan visual teks lebih tajam.
Catatan: pengujian HP terkonfirmasi.

## M1 — Dunia Isometrik + Kamera
Status: ✅ Selesai dan teruji di perangkat
Deliverable:
- ✅ src/world/IsoUtils.js — konversi grid <-> screen.
- ✅ src/world/Tilemap.js — grid 8x8, render diamond, bounds.
- ✅ src/world/CameraController.js rev 2 — drag + pinch + clamp.
- ✅ src/main.js — integrasi tilemap + kamera + overlay.
- ✅ index.html — loader sequential untuk 3 file world + main.
- ✅ Cache-busting ?v=0.2.0.
Pengujian manual (terkonfirmasi di Samsung A36):
- ✅ Drag (1 jari) berfungsi.
- ✅ Pinch zoom (2 jari) berfungsi.
- ✅ Rotasi portrait <-> landscape berfungsi.
Belum diverifikasi khusus:
- ⬜ Uji clamp batas peta pada zoom ekstrem (0.5x, 2.5x).
- ⬜ Uji performa HP panas setelah 5 menit.

## M2 — Playable Loop
Status: ⬜ Belum dimulai
Target: Pelanggan muncul otomatis, antre, beli kopi, bayar, pergi.
Uang bertambah. Minimal satu upgrade bisa dibeli.

Deliverable (rencana):
- ⬜ src/core/EventBus.js
- ⬜ src/core/GameState.js
- ⬜ src/systems/TimeSystem.js
- ⬜ src/systems/EconomySystem.js
- ⬜ src/systems/ProductSystem.js
- ⬜ src/systems/CustomerSystem.js
- ⬜ src/world/entities/Customer.js
- ⬜ src/data/products.js (minimal 1 produk: Kopi Hitam)
- ⬜ src/data/upgrades.js (minimal 1 upgrade)
- ⬜ src/ui/HUD.js (tampilan uang + tombol beli)
- ⬜ Update index.html (loader + ASSET_VERSION bump)
- ⬜ Update src/main.js (integrasi sistem)

Kriteria selesai:
- Pelanggan spawn otomatis (bukan manual).
- Transaksi berhasil -> uang bertambah.
- Pemain bisa beli minimal 1 upgrade dari uang penjualan.

## M3 — UI HUD & Panel Dasar
Status: ⬜ Belum dimulai
Deliverable (rencana):
- ⬜ uiBridge.js, HUD lanjutan, ShopPanel, FinancePanel, SettingsPanel.

## M4 — Save / Load
Status: ⬜ Belum dimulai
Deliverable (rencana):
- ⬜ StorageService.js, LocalStorageAdapter.js, SaveManager.js.
- ⬜ tests/index.html + unit test ekonomi & storage.
Kriteria: tutup tab, buka lagi -> progres tetap.

## M5 — Build Mode
Status: ⬜ Belum dimulai
Target: penempatan furnitur di dunia isometrik.

## M6 — Karyawan & Jadwal
Status: ⬜ Belum dimulai

## M7 — Produk & Resep Lanjutan
Status: ⬜ Belum dimulai

## M8 — Multi-Cabang
Status: ⬜ Belum dimulai

## M9 — Riset, Branding, Kompetitor
Status: ⬜ Belum dimulai

## M10 — Polish & Rilis v1.0
Status: ⬜ Belum dimulai
Deliverable (rencana):
- ⬜ Audio, animasi, PWA, lokalisasi id/en.

## Utang Teknis yang Tercatat

1. Dokumen lama di `src/config/`, `src/scenes/`, `style.css` belum
   dihapus. Bisa dihapus pada milestone berikutnya setelah konfirmasi.
2. Pengujian clamp pada zoom ekstrem (0.5x, 2.5x) belum dilakukan.
3. Performa HP setelah 5 menit bermain belum diukur.

## Aturan Rilis
- Setiap milestone -> 1 tag Git (v0.x.y).
- Rilis hanya setelah kriteria selesai diverifikasi manual di HP.
