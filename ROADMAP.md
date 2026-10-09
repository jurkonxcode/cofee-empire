
---

# 3. `ROADMAP.md`

```markdown
# ROADMAP.md — Coffee Empire

Versi: 0.1
Status: Draft
Terakhir diperbarui: 2026-10-09

Skala estimasi: "hari kerja" diasumsikan 1–3 jam/hari dari HP.

## M0 — Fondasi & Publikasi (2–4 hari)

Tujuan: game kosong yang bisa dibuka via GitHub Pages.

Deliverable:
- [ ] Struktur folder sesuai `ARCHITECTURE.md`.
- [ ] `index.html` memuat Phaser via import map.
- [ ] `src/main.js` membuat game dengan 1 scene kosong.
- [ ] `style.css` dasar, `canvas` fullscreen.
- [ ] GitHub Pages aktif, URL publik.

Kriteria selesai:
- Buka URL di Samsung A36 -> layar hitam dengan teks versi.

## M1 — Dunia Isometrik + Kamera (3–5 hari)

Deliverable:
- [ ] `IsoUtils.js` (grid <-> screen) + unit test.
- [ ] `Tilemap.js` dengan peta kecil 8×8.
- [ ] Render tile isometrik 64×32.
- [ ] `CameraController.js`: drag & pinch zoom.
- [ ] `sprites.js` pixel art 16×16 (2–3 sprite).

Kriteria selesai:
- Bisa geser & zoom peta lancar di HP.

## M2 — Vertical Slice (5–7 hari)

Deliverable:
- [ ] `TimeSystem` (1 hari = 120 detik, 1 jam = 5 detik).
- [ ] `EconomySystem` dasar (money, transaksi).
- [ ] `CustomerSystem`: spawn 1 customer per beberapa detik.
- [ ] `Customer` entity: masuk -> antre -> pergi.
- [ ] `ProductSystem`: 1 produk (Kopi Hitam) dengan harga.
- [ ] Transaksi berhasil -> `economy:money-changed`.

Kriteria selesai:
- Customer datang, "beli" kopi, uang bertambah, customer pergi.

## M3 — UI HUD & Panel Dasar (5–7 hari)

Deliverable:
- [ ] `uiBridge.js` sebagai jembatan DOM <-> EventBus.
- [ ] HUD atas: uang, reputasi, jam.
- [ ] `ShopPanel`: beli furnitur dasar.
- [ ] `FinancePanel`: ringkasan harian.
- [ ] `SettingsPanel`: reset save, volume SFX.

Kriteria selesai:
- Semua UI bisa ditekan di HP, tidak ada yang tertutup canvas.

## M4 — Save / Load (3–5 hari)

Deliverable:
- [ ] `StorageService` interface + `LocalStorageAdapter`.
- [ ] `SaveManager`: auto-save 60 detik + manual.
- [ ] Migrasi versi (placeholder v1 -> v1).
- [ ] Load saat boot.
- [ ] Test `storage.test.js`.

Kriteria selesai:
- Tutup tab, buka lagi -> progres tetap.

## M5 — Build Mode (7–10 hari)

Deliverable:
- [ ] `BuildSystem`: preview penempatan, validasi tile.
- [ ] Simpan furnitur ke `GameState.cafe.furniture`.
- [ ] Furniture memengaruhi kapasitas customer / kualitas.

## M6 — Karyawan & Jadwal (7–10 hari)

Deliverable:
- [ ] `EmployeeSystem`: rekrut, gaji harian, produktivitas.
- [ ] `StaffPanel`.
- [ ] Bottleneck: tanpa barista, customer tidak dilayani.

## M7 — Produk & Resep Lanjutan (5–7 hari)

Deliverable:
- [ ] 6+ produk di `data/products.js`.
- [ ] `InventorySystem`: stok bahan, restock harian.
- [ ] Harga bisa diatur pemain; demand merespons.

## M8 — Multi-Cabang (10–14 hari)

Deliverable:
- [ ] `ExpansionSystem`: beli cabang baru.
- [ ] Scene bisa berganti lokasi.
- [ ] Manajer cabang (auto-manage saat pemain di cabang lain).

## M9 — Riset, Branding, Kompetitor (10–14 hari)

Deliverable:
- [ ] `ResearchSystem`: unlock teknologi & produk.
- [ ] `MarketingSystem`: kampanye, reputasi.
- [ ] Kompetitor dengan harga sendiri.

## M10 — Polish & Rilis (10–14 hari)

Deliverable:
- [ ] Audio SFX + BGM.
- [ ] Animasi halus (transisi panel, fade).
- [ ] PWA manifest + ikon -> bisa di-install di HP.
- [ ] Lokalisasi id/en.
- [ ] Halaman "About" & kredit.

## Setelah v1.0

- Cloud save (Supabase) via adapter baru.
- Leaderboard opsional.
- Mod / konten buatan pemain (jauh).

## Aturan Rilis

- Setiap milestone = 1 tag Git (`v0.1.0`, `v0.2.0`, dst.).
- Rilis hanya jika seluruh item deliverable tercentang
  DAN kriteria selesai diverifikasi manual di HP.
