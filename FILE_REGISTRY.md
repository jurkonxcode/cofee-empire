# FILE_REGISTRY.md — Coffee Empire

Versi: 0.1
Status: Draft
Terakhir diperbarui: 2026-10-09

Legenda status: ⬜ belum dibuat · 🟨 draft · 🟩 selesai & ditest

## Root

| File                 | Tanggung Jawab                              | Dependensi utama | Status |
|----------------------|---------------------------------------------|------------------|--------|
| index.html           | Dokumen, import map, mount canvas + DOM UI  | main.js, style   | ⬜     |
| style.css            | Layout responsif, tema warna, HUD, panel    | -                | ⬜     |
| README.md            | Ringkasan proyek, cara jalankan             | docs             | ⬜     |
| GAME_DESIGN.md       | Dokumen desain                              | -                | 🟨     |
| ARCHITECTURE.md      | Dokumen arsitektur                          | -                | 🟨     |
| ROADMAP.md           | Rencana pengembangan                        | -                | 🟨     |
| FILE_REGISTRY.md     | Daftar file (dokumen ini)                   | -                | 🟨     |
| TECHNICAL_DECISIONS  | Keputusan teknis                            | -                | 🟨     |

## src/

### Entry
| File          | Tanggung Jawab                       | Dependensi                              | Status |
|---------------|--------------------------------------|-----------------------------------------|--------|
| main.js       | Buat Phaser.Game, init core & scenes | config, core, scenes, ui/uiBridge       | ⬜     |

### src/config/
| File          | Tanggung Jawab                       | Dependensi | Status |
|---------------|--------------------------------------|------------|--------|
| gameConfig.js | Konfigurasi Phaser.Game              | constants  | ⬜     |
| constants.js  | TILE_W, TILE_H, nama event, versi    | -          | ⬜     |
| palette.js    | Palet warna                          | -          | ⬜     |

### src/core/
| File          | Tanggung Jawab                       | Dependensi | Status |
|---------------|--------------------------------------|------------|--------|
| EventBus.js   | Wrapper event emitter                | Phaser     | ⬜     |
| GameState.js  | Objek state tunggal + get/set        | EventBus   | ⬜     |
| Registry.js   | Lookup sistem aktif                  | -          | ⬜     |

### src/scenes/
| File            | Tanggung Jawab                     | Dependensi           | Status |
|-----------------|------------------------------------|----------------------|--------|
| BootScene.js    | Init sistem, preload minimal       | core, systems        | ⬜     |
| MenuScene.js    | Menu utama                         | core, ui/uiBridge    | ⬜     |
| CafeScene.js    | Render dunia, entity, kamera       | world, systems       | ⬜     |
| UIScene.js      | Aktifkan uiBridge                  | ui/uiBridge          | ⬜     |

### src/world/
| File                 | Tanggung Jawab                    | Dependensi           | Status |
|----------------------|-----------------------------------|----------------------|--------|
| IsoUtils.js          | Konversi grid <-> screen          | utils/math           | ⬜     |
| Tilemap.js           | Definisi peta & layer             | data, IsoUtils       | ⬜     |
| CameraController.js  | Drag, pinch, clamp                | Phaser               | ⬜     |
| entities/Entity.js   | Basis entity                      | core                 | ⬜     |
| entities/Customer.js | Perilaku customer                 | Entity, core         | ⬜     |
| entities/Furniture.js| Objek furnitur di dunia           | Entity, data         | ⬜     |

### src/systems/
| File                    | Tanggung Jawab                 | Dependensi              | Status |
|-------------------------|--------------------------------|-------------------------|--------|
| TimeSystem.js           | Jam/hari/minggu game           | core, constants         | ⬜     |
| EconomySystem.js        | Uang, transaksi, laba          | core, data              | ⬜     |
| CustomerSystem.js       | Spawn & lifecycle customer     | core, data, Economy     | ⬜     |
| ProductSystem.js        | Produk & harga                 | core, data              | ⬜     |
| InventorySystem.js      | Stok bahan                     | core, data              | ⬜     |
| EmployeeSystem.js       | Karyawan & jadwal              | core, data              | ⬜     |
| BuildSystem.js          | Penempatan furnitur            | core, data, world       | ⬜     |
| ResearchSystem.js       | Unlock teknologi               | core, data              | ⬜     |
| ExpansionSystem.js      | Multi cabang                   | core, data              | ⬜     |

### src/ui/
| File               | Tanggung Jawab                          | Dependensi              | Status |
|--------------------|-----------------------------------------|-------------------------|--------|
| uiBridge.js        | Satu-satunya jembatan DOM <-> EventBus  | core, systems           | ⬜     |
| HUD.js             | HUD atas                                | uiBridge                | ⬜     |
| Panel.js           | Basis panel (show/hide, drag)           | -                       | ⬜     |
| ShopPanel.js       | Beli barang                             | uiBridge, data          | ⬜     |
| BuildPanel.js      | Mode build                              | uiBridge, systems/Build | ⬜     |
| StaffPanel.js      | Rekrut & kelola staff                   | uiBridge, data          | ⬜     |
| FinancePanel.js    | Laporan keuangan                        | uiBridge, systems       | ⬜     |
| SettingsPanel.js   | Volume, save, reset                     | uiBridge, services      | ⬜     |

### src/data/
| File           | Tanggung Jawab                       | Dependensi | Status |
|----------------|--------------------------------------|------------|--------|
| products.js    | Daftar produk & atribut              | -          | ⬜     |
| recipes.js     | Resep (bahan + waktu produksi)       | products   | ⬜     |
| furniture.js   | Daftar furnitur + efek gameplay      | -          | ⬜     |
| upgrades.js    | Daftar upgrade                       | -          | ⬜     |
| employees.js   | Role karyawan & gaji                 | -          | ⬜     |
| sprites.js     | Array pixel art                      | palette    | ⬜     |

### src/services/
| File                    | Tanggung Jawab                   | Dependensi      | Status |
|-------------------------|----------------------------------|-----------------|--------|
| StorageService.js       | Interface abstrak load/save      | -               | ⬜     |
| LocalStorageAdapter.js  | Implementasi localStorage        | StorageService  | ⬜     |
| SaveManager.js          | Auto-save, migrasi, validasi     | StorageService  | ⬜     |

### src/utils/
| File          | Tanggung Jawab                       | Dependensi | Status |
|---------------|--------------------------------------|------------|--------|
| math.js       | clamp, lerp, randomInt, dsb.         | -          | ⬜     |
| id.js         | Generator id unik                    | -          | ⬜     |
| format.js     | Format uang, tanggal, waktu          | -          | ⬜     |
| pixelArt.js   | Render array pixel ke canvas         | palette    | ⬜     |

## assets/
| File                  | Tanggung Jawab              | Status |
|-----------------------|-----------------------------|--------|
| icons/favicon.svg     | Ikon tab                    | ⬜     |
| icons/pwa-192.png     | Ikon PWA (v1.0)             | ⬜     |
| audio/*               | SFX, BGM (v0.4+)            | ⬜     |

## tests/
| File              | Tanggung Jawab                | Status |
|-------------------|-------------------------------|--------|
| index.html        | Runner in-browser             | ⬜     |
| test-runner.js    | Load & tampilkan hasil        | ⬜     |
| economy.test.js   | Unit test EconomySystem       | ⬜     |
| storage.test.js   | Unit test SaveManager         | ⬜     |
