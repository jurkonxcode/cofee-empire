/**
 * Coffee Empire — Product data (M2.3, extended)
 * Data statis produk. Tidak ada logika di sini.
 *
 * Struktur dibuat forward-compatible untuk M3+:
 *   - `id`           : string, kunci unik (WAJIB)
 *   - `name`         : nama tampilan (WAJIB)
 *   - `sellPrice`    : harga jual per cangkir (WAJIB, dibaca M2.3)
 *   - `costPerCup`   : biaya bahan per cangkir (WAJIB, dibaca M2.3)
 *   - `category`     : kategori produk (dipakai M3 untuk filter menu)
 *   - `enabled`      : boolean, produk tersedia untuk dijual (M3+)
 *   - `unlockLevel`  : level pemain minimum untuk unlock (M3+)
 *   - `description`  : teks deskripsi (M3+ untuk tooltip / menu)
 *   - `recipe`       : daftar bahan + jumlah (M3+ untuk sistem stok)
 *
 * Field yang belum dipakai M2.3 diberi komentar "M3+" agar jelas.
 *
 * PENTING:
 * - `window.CoffeeEmpire.Data.products` HARUS tetap berupa object map
 *   yang di-key oleh `id`. Jangan diubah menjadi array.
 * - `window.CoffeeEmpire.Data.defaultProductId` HARUS tetap ada.
 *   CustomerSystem M2.3 membacanya untuk menentukan produk default.
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};

window.CoffeeEmpire.Data = window.CoffeeEmpire.Data || {};

/**
 * Map produk: key = id, value = objek produk.
 * Urutan tampilan di menu ditentukan field `order` (M3+).
 */
window.CoffeeEmpire.Data.products = {

  'kopi-hitam': {
    id: 'kopi-hitam',
    name: 'Kopi Hitam',
    sellPrice: 25,
    costPerCup: 5,

    // M3+: untuk sistem menu, stok, unlock
    category: 'kopi',
    enabled: true,
    unlockLevel: 1,
    order: 1,
    description: 'Kopi hitam klasik tanpa tambahan.',
    recipe: [
      { ingredientId: 'biji-kopi', qty: 1 },
      { ingredientId: 'air',       qty: 1 }
    ]
  }

  // Produk baru ditambahkan di sini pada M3+, contoh:
  //
  // 'kopi-susu': {
  //   id: 'kopi-susu',
  //   name: 'Kopi Susu',
  //   sellPrice: 35,
  //   costPerCup: 10,
  //   category: 'kopi',
  //   enabled: false,
  //   unlockLevel: 2,
  //   order: 2,
  //   description: 'Kopi dengan susu segar.',
  //   recipe: [
  //     { ingredientId: 'biji-kopi', qty: 1 },
  //     { ingredientId: 'susu',      qty: 1 },
  //     { ingredientId: 'air',       qty: 1 }
  //   ]
  // }

};

/**
 * Produk default yang dipakai sistem saat tidak ada produk spesifik
 * diminta (contoh: CustomerSystem M2.3).
 */
window.CoffeeEmpire.Data.defaultProductId = 'kopi-hitam';

/**
 * Helper opsional. Tidak mengganti akses langsung `products[id]`.
 * Semua helper mengembalikan nilai baru; tidak memodifikasi data.
 */
window.CoffeeEmpire.Data.getProduct = function (id) {
  if (!id) return null;
  return window.CoffeeEmpire.Data.products[id] || null;
};

window.CoffeeEmpire.Data.getAllProducts = function () {
  var map = window.CoffeeEmpire.Data.products;
  var list = [];
  for (var id in map) {
    if (Object.prototype.hasOwnProperty.call(map, id)) {
      list.push(map[id]);
    }
  }
  // Urutkan berdasarkan `order`, fallback ke id.
  list.sort(function (a, b) {
    var ao = (typeof a.order === 'number') ? a.order : 9999;
    var bo = (typeof b.order === 'number') ? b.order : 9999;
    if (ao !== bo) return ao - bo;
    return String(a.id).localeCompare(String(b.id));
  });
  return list;
};

window.CoffeeEmpire.Data.getEnabledProducts = function () {
  return window.CoffeeEmpire.Data.getAllProducts().filter(function (p) {
    return p.enabled !== false;
  });
};
