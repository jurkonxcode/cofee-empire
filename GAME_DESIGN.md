# GAME_DESIGN.md — Coffee Empire

Versi: 0.1
Status: Draft (menunggu approval)
Terakhir diperbarui: 2026-10-09

## 1. Visi

Coffee Empire adalah game simulasi manajemen perusahaan kopi
berbasis browser dengan visual isometrik 2.5D. Pemain memulai
dari satu kedai kecil dan berkembang menjadi jaringan kopi
internasional. Game menyasar sesi pendek (5–15 menit) di HP
maupun sesi panjang di desktop.

## 2. Pilar Desain

1. **Terbaca dalam 10 detik.** UI dan dunia harus langsung
   dipahami tanpa tutorial panjang.
2. **Satu tangan, satu jempol.** Kontrol utama dirancang
   untuk layar sentuh HP (drag, tap, pinch).
3. **Keputusan bermakna.** Setiap rupiah dan setiap menit
   pemain punya konsekuensi ekonomi.
4. **Ramah sesi pendek.** Auto-save, tidak ada punishment
   kehilangan progres.
5. **Orisinalitas.** Tidak ada aset, nama, UI, atau mekanik
   yang menyalin game lain secara langsung.

## 3. Gameplay Loop

### Loop mikro (detik–menit)
1. Pelanggan masuk kedai.
2. Pelanggan memilih produk (dipengaruhi harga, kualitas,
   reputasi, dan stok).
3. Pelanggan antre di kasir.
4. Barista memproses pesanan (durasi produksi).
5. Pelanggan membayar dan pergi.
6. Uang bertambah, reputasi berubah.

### Loop meso (menit–jam)
1. Pemain memantau pendapatan harian.
2. Belanja bahan baku, upgrade mesin, atur harga.
3. Rekrut barista/kasir untuk melepas bottleneck.
4. Buka menu baru dari hasil riset.

### Loop makro (jam–minggu)
1. Buka cabang baru di kota berbeda.
2. Bangun brand, hadapi kompetitor.
3. Ekspansi internasional.
4. Capai milestone perusahaan.

## 4. Sistem Inti

| Sistem              | Tanggung Jawab                                        | Prioritas |
|---------------------|-------------------------------------------------------|-----------|
| TimeSystem          | Jam game, hari, minggu, bulan                         | MVP       |
| EconomySystem       | Uang, pendapatan, biaya, laba                         | MVP       |
| CustomerSystem      | Spawn, perilaku, keputusan beli                        | MVP       |
| ProductSystem       | Produk, resep, harga, kualitas                         | MVP       |
| InventorySystem     | Stok bahan, pemasok, restock                          | v0.2      |
| EmployeeSystem      | Rekrut, jadwal, produktivitas, gaji                    | v0.3      |
| BuildSystem         | Penempatan furnitur & mesin di dunia                  | v0.3      |
| ResearchSystem      | Unlock teknologi & produk baru                         | v0.4      |
| ExpansionSystem     | Multi-cabang & lokasi                                 | v0.5      |
| MarketingSystem     | Iklan, reputasi, kampanye                             | v0.5      |

## 5. Ekonomi (Model Sederhana v1)

Pendapatan harian =
    Σ (harga_jual_i × jumlah_terjual_i)

Biaya harian =
    Σ (gaji_karyawan) + sewa_harian + bahan_terpakai + upkeep

Laba harian = Pendapatan − Biaya

Reputasi (0–100) memengaruhi:
- Spawn rate pelanggan: +X% per 10 reputasi
- Toleransi harga: pelanggan mau bayar lebih jika reputasi tinggi
- Unlock: beberapa produk butuh reputasi minimum

Rumus lengkap akan ditulis di `src/systems/EconomySystem.js`
dan diuji di `tests/economy.test.js`.

## 6. Progresi

- **Level pemain** dari total laba kumulatif.
- **Unlock** produk, furnitur, area kedai, cabang, fitur UI.
- **Skill poin** (opsional, ditinjau ulang pada v0.4).

## 7. UI (High-Level)

Semua elemen UI berada di **DOM/HTML di luar canvas**:
- HUD atas: uang, reputasi, jam game, tombol menu.
- Panel bawah: navigasi tab (Shop, Build, Staff, Finance).
- Modal: pembelian, konfirmasi, laporan.
- Canvas: **hanya dunia isometrik**, tanpa UI game.

Alasan: kontrol CSS di HP lebih andal daripada UI canvas.

## 8. Arah Visual

- **Gaya:** pixel art retro modern, 16×16 px per tile.
- **Grid:** isometrik, tile 64×32 (2:1).
- **Palet:** coklat kopi, krem, hijau pastel, aksen oranye.
- **Sumber aset awal:** array JS (lihat `src/data/sprites.js`),
  tanpa file PNG eksternal untuk prototipe.
- **Aset akhir (opsional):** PNG spritesheet di `assets/`.

## 9. Audio

- SFX ringan: bel pintu, mesin espresso, kasir, koin.
- Musik latar loop 1–2 track di v0.4.
- Semua via Web Audio API, volume di kontrol pengaturan.

## 10. Platform

- Browser desktop modern (Chrome/Firefox/Safari).
- Browser HP Android/iOS, target minimum: Samsung A36 5G.
- Rasio aspek: 9:16 hingga 21:9 (adaptif).
- Orientasi: portrait & landscape (canvas resize).

## 11. Bahasa

- UI game: Bahasa Indonesia terlebih dahulu, Inggris menyusul.
- Kode & komentar: Inggris.
- Dokumen proyek: Indonesia (prosa) + istilah teknis Inggris.

## 12. Out of Scope v1

- Multiplayer.
- Cloud save (disiapkan interface, implementasi nanti).
- Voice-over.
- Mod support.
