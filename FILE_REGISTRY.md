# FILE_REGISTRY.md — Coffee Empire

Versi: 0.3
Status: Aktif
Terakhir diperbarui: 2026-10-09

Legenda status:
  [AKTIF]        — dipakai dan berjalan
  [TIDAK PAKAI]  — ada di repo tetapi tidak direferensikan
  [RENCANA]      — belum dibuat, dijadwalkan
  [M0] / [M1] / dst — milestone pembuatan

## Root

| File                  | Fungsi                                        | Status        | M   |
|-----------------------|-----------------------------------------------|---------------|-----|
| index.html            | HTML, CSS inline, loader script sequential    | [AKTIF]       | M0+ |
| README.md             | Ringkasan proyek & cara menjalankan           | [AKTIF]       | M0  |
| GAME_DESIGN.md        | Dokumen desain (visi, loop, sistem)           | [AKTIF]       | -   |
| ARCHITECTURE.md       | Dokumen arsitektur (v0.3)                     | [AKTIF]       | -   |
| ROADMAP.md            | Rencana milestone                             | [AKTIF]       | -   |
| FILE_REGISTRY.md      | Daftar file (dokumen ini)                     | [AKTIF]       | -   |
| TECHNICAL_DECISIONS.md| Keputusan teknis (v0.3)                       | [AKTIF]       | -   |
| .gitignore            | Abaikan file tidak perlu (OS, editor, log)    | [AKTIF]       | M0  |
| style.css             | Styling (tetapi sekarang CSS inline di HTML)  | [TIDAK PAKAI] | M0  |

## src/

| File                                | Fungsi                                  | Depends on                    | Status        | M   |
|-------------------------------------|-----------------------------------------|-------------------------------|---------------|-----|
| src/main.js                         | Entry point, BootScene, init tilemap+cc | Phaser, IsoUtils, Tilemap, CC | [AKTIF]       | M0+ |
| src/world/IsoUtils.js               | Konversi grid <-> screen, konstanta tile| (murni)                       | [AKTIF]       | M1  |
| src/world/Tilemap.js                | Grid 8x8 + render diamond + bounds      | IsoUtils                      | [AKTIF]       | M1  |
| src/world/CameraController.js       | Drag + pinch + clamp + resize (rev 2)   | Phaser                        | [AKTIF]       | M1  |
| src/config/constants.js             | Konstanta lama (VERSION, TILE_W, dst)   | (murni)                       | [TIDAK PAKAI] | M0  |
| src/config/gameConfig.js            | Konfigurasi Phaser lama                 | constants (dulu)              | [TIDAK PAKAI] | M0  |
| src/scenes/BootScene.js             | BootScene lama (versi ESM)              | Phaser                        | [TIDAK PAKAI] | M0  |

## Modul yang Direncanakan (Belum Dibuat)

| File                                | Fungsi                             | Dijadwalkan |
|-------------------------------------|------------------------------------|:---:|
| src/core/EventBus.js                | Event bus global                   | M2  |
| src/core/GameState.js               | Sumber kebenaran state             | M2  |
| src/systems/TimeSystem.js           | Jam/hari game                      | M2  |
| src/systems/EconomySystem.js        | Uang, transaksi                    | M2  |
| src/systems/ProductSystem.js        | Produk, harga                      | M2  |
| src/systems/CustomerSystem.js       | Spawn & lifecycle customer         | M2  |
| src/world/entities/Customer.js      | Entitas pelanggan                  | M2  |
| src/data/products.js                | Daftar produk                      | M2  |
| src/data/upgrades.js                | Daftar upgrade                     | M2  |
| src/ui/HUD.js                       | HUD uang                           | M2  |
| src/ui/uiBridge.js                  | Jembatan DOM <-> event             | M3  |
| src/services/StorageService.js      | Interface save/load                | M4  |
| src/services/LocalStorageAdapter.js | Implementasi localStorage          | M4  |
| src/services/SaveManager.js         | Auto-save, migrasi save            | M4  |
| tests/index.html                    | Test runner in-browser             | M4  |
| tests/economy.test.js               | Unit test ekonomi                  | M4  |
| tests/storage.test.js               | Unit test save                     | M4  |
| assets/tiles/                       | Tile isometrik (aset asli)         | M5+ |
| assets/audio/                       | SFX, BGM                           | M9  |

## Catatan

- `src/config/`, `src/scenes/`, dan `style.css` adalah sisa dari
  iterasi M0 yang memakai ESM. Pada M0.1, arsitektur beralih
  ke self-contained `main.js`. Pada M1, modul `world/` dibuat
  terpisah. File lama tidak dihapus agar history commit tetap
  jelas; bisa dihapus pada milestone berikutnya jika disetujui.
- Semua modul baru mengikuti pola UMD/IIFE dan namespace
  `window.CoffeeEmpire`.
