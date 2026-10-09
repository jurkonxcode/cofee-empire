# ARCHITECTURE.md — Coffee Empire

Versi: 0.1
Status: Draft
Terakhir diperbarui: 2026-10-09

## 1. Prinsip Arsitektur

1. Satu modul = satu tanggung jawab utama.
2. Tidak ada file JS > 400 baris.
3. Data konten dipisah dari logika (src/data vs src/systems).
4. Logika bisnis **tidak boleh** berada di scene Phaser atau UI.
5. Satu sumber kebenaran untuk state (`GameState`).
6. Komunikasi antar-sistem via `EventBus`, bukan import langsung
   antar dua sistem yang setara.
7. Tidak ada circular dependency.
8. UI (DOM) dan dunia (Phaser) dijembatani oleh `uiBridge.js`.
9. Tidak ada variabel global (`window.x = ...`).

## 2. Struktur Folder Final

/ (root)
├── index.html
├── style.css
├── README.md
├── GAME_DESIGN.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── FILE_REGISTRY.md
├── TECHNICAL_DECISIONS.md
│
├── src/
│   ├── main.js                  # Entry point
│   ├── config/
│   │   ├── gameConfig.js        # Konfigurasi Phaser
│   │   ├── constants.js         # Nilai konstanta global
│   │   └── palette.js           # Definisi warna
│   ├── core/
│   │   ├── EventBus.js
│   │   ├── GameState.js
│   │   └── Registry.js          # Akses sistem via key
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   ├── CafeScene.js
│   │   └── UIScene.js
│   ├── world/
│   │   ├── IsoUtils.js
│   │   ├── Tilemap.js
│   │   ├── CameraController.js
│   │   └── entities/
│   │       ├── Entity.js
│   │       ├── Customer.js
│   │       └── Furniture.js
│   ├── systems/
│   │   ├── TimeSystem.js
│   │   ├── EconomySystem.js
│   │   ├── CustomerSystem.js
│   │   ├── ProductSystem.js
│   │   ├── InventorySystem.js
│   │   ├── EmployeeSystem.js
│   │   ├── BuildSystem.js
│   │   ├── ResearchSystem.js
│   │   └── ExpansionSystem.js
│   ├── ui/
│   │   ├── uiBridge.js          # Jembatan DOM <-> Phaser
│   │   ├── HUD.js
│   │   ├── Panel.js             # Basis panel
│   │   ├── ShopPanel.js
│   │   ├── BuildPanel.js
│   │   ├── StaffPanel.js
│   │   ├── FinancePanel.js
│   │   └── SettingsPanel.js
│   ├── data/
│   │   ├── products.js
│   │   ├── recipes.js
│   │   ├── furniture.js
│   │   ├── upgrades.js
│   │   ├── employees.js
│   │   └── sprites.js           # Pixel art array
│   ├── services/
│   │   ├── StorageService.js    # Interface abstrak
│   │   ├── LocalStorageAdapter.js
│   │   └── SaveManager.js
│   └── utils/
│       ├── math.js
│       ├── id.js
│       ├── format.js            # Format uang, tanggal
│       └── pixelArt.js          # Render array -> canvas
│
├── assets/
│   ├── icons/                   # favicon, PWA
│   └── audio/                   # SFX, BGM (v0.4+)
│
└── tests/
    ├── index.html               # Test runner in-browser
    ├── test-runner.js
    ├── economy.test.js
    └── storage.test.js

## 3. Tanggung Jawab Modul

### src/main.js
- Import `gameConfig`, buat instance Phaser.Game.
- Inisialisasi `GameState` dan `EventBus`.
- **Tidak berisi logika game.**

### src/config/
- `gameConfig.js`: konfigurasi Phaser (scene, scale, physics).
- `constants.js`: TILE_W, TILE_H, nama event, dsb.
- `palette.js`: warna tunggal untuk seluruh game.

### src/core/
- `EventBus.js`: wrapper tipis di atas `Phaser.Events.EventEmitter`.
- `GameState.js`: satu objek state global + getter/setter aman.
- `Registry.js`: daftar sistem aktif untuk lookup aman (bukan global).

### src/scenes/
- `BootScene.js`: preload aset minimal, inisialisasi sistem.
- `MenuScene.js`: menu utama (Play, Continue, Settings).
- `CafeScene.js`: render isometrik kedai, entity, kamera.
- `UIScene.js`: **tidak merender UI** — hanya menyalakan `uiBridge`
  saat DOM siap. Semua UI nyata ada di HTML.

### src/world/
- `IsoUtils.js`: konversi grid <-> screen.
- `Tilemap.js`: definisi peta, layer, collision.
- `CameraController.js`: drag, pinch zoom, batas peta.
- `entities/*`: kelas entity dasar & turunannya.

### src/systems/
Murni logika. Setiap sistem:
- Punya `init(deps)`, `update(dt)`, `serialize()`, `deserialize()`.
- Berkomunikasi lewat `EventBus`.
- **Tidak menyentuh Phaser GameObjects secara langsung.**

### src/ui/
- `uiBridge.js`: satu-satunya file yang boleh menyentuh DOM **dan**
  sistem game.
- Panel lain murni DOM manipulation, menerima callback dari bridge.

### src/data/
- Data statis (produk, furnitur, upgrade).
- Bentuk: array objek dengan id unik.
- **Tidak berisi logika.**

### src/services/
- `StorageService.js`: interface `{ load(), save(), clear() }`.
- `LocalStorageAdapter.js`: implementasi konkret.
- `SaveManager.js`: auto-save, migrasi versi, validasi.

### src/utils/
- Pure functions, tanpa state, tanpa dependensi sistem lain.

## 4. Alur Data

    [DOM / UI Panel]
         |  (user action)
         v
    [uiBridge] --emit event--> [EventBus]
                                    |
                                    v
                             [Systems (Economy, Customer, ...)]
                                    |
                          (mutate state, emit event)
                                    v
                             [GameState]
                                    |
                     (emit event 'state:changed')
                                    |
                     +--------------+--------------+
                     v                             v
              [uiBridge -> DOM]              [Scenes -> render]

Aturan penting:
- UI **tidak** mengubah `GameState` langsung.
- Scene **tidak** mengubah `GameState` langsung.
- Hanya **Systems** yang mengubah `GameState`.
- Perubahan state dipublikasikan lewat `EventBus`.

## 5. Aturan Dependensi

Impor yang **diizinkan** (arah panah):

    data  ->  utils
    utils ->  core
    core  ->  services
    systems -> core, data, utils, services
    world -> core, utils, data
    scenes -> core, world, systems (hanya init/update)
    ui    -> core, systems (via bridge), data
    main  -> semuanya (hanya entry)

Yang **dilarang**:
- systems -> scenes
- systems -> ui
- ui -> scenes (langsung; harus via bridge/event)
- data -> systems
- utils -> systems

## 6. Komunikasi antar-Sistem

Contoh topik `EventBus` (namespace:subjek:aksi):

- `time:tick`
- `time:day-ended`
- `time:week-ended`
- `economy:money-changed`      payload: { delta, total }
- `economy:transaction`        payload: { type, amount, note }
- `customer:spawned`           payload: { customerId }
- `customer:served`            payload: { customerId, productId, price }
- `customer:left-unhappy`      payload: { customerId, reason }
- `product:unlocked`           payload: { productId }
- `cafe:upgraded`              payload: { cafeId, upgradeId }
- `save:requested`
- `save:completed`
- `state:changed`

## 7. Bentuk GameState (v1)

```js
{
  version: 1,
  meta: {
    createdAt: <epoch>,
    lastSavedAt: <epoch>,
    playtimeSeconds: 0
  },
  player: { name: "Player", money: 500, reputation: 10, level: 1 },
  time:   { day: 1, hour: 8, minute: 0 },
  world:  { currentLocationId: "cafe-1" },
  cafe:   {
    id: "cafe-1",
    name: "Kedai Pertama",
    furniture: [],   // { id, type, gx, gy, rot }
    staff: [],
    inventory: {}
  },
  products: { unlockedIds: ["kopi-hitam"], prices: { "kopi-hitam": 15 } },
  economy:  { dailyHistory: [], cumulativeProfit: 0 },
  settings: { sfxVolume: 0.7, musicVolume: 0.5, locale: "id" }
}
