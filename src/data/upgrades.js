/**
 * Coffee Empire — Upgrade data (M2.5)
 * Data statis upgrade. Tidak ada logika di sini.
 *
 * Struktur:
 *   id          : string unik
 *   name        : nama tampilan
 *   price       : harga beli
 *   description : teks deskripsi
 *   effect      : objek { key: value } yang akan ditulis ke GameState
 */

window.CoffeeEmpire = window.CoffeeEmpire || {};
window.CoffeeEmpire.Data = window.CoffeeEmpire.Data || {};

window.CoffeeEmpire.Data.upgrades = {

  'mesin-espresso': {
    id: 'mesin-espresso',
    name: 'Mesin Espresso',
    price: 200,
    description: 'Mesin espresso cepat, waktu layanan lebih singkat.',
    effect: {
      serviceTimeMs: 2100
    }
  }

};
