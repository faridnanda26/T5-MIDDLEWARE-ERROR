# Tugas 5 - Middleware & Error Terpusat

## Identitas
- Nama : Farid Nanda Syauqi
- NIM  : F1D02310050

## Cara Menjalankan
1. Jalankan `npm install` untuk mengunduh seluruh dependensi.
2. Buat file `.env` di direktori utama lalu atur `API_KEY=rahasia123456` dan `PORT=3000`.
3. Jalankan server dengan perintah `npm run dev`.

## Struktur Proyek
```text
T5-MIDDLEWARE-ERROR/
├── screenshot/                 # Folder bukti pengujian API dan log server
│   ├── 201.png
│   ├── 204.png
│   ├── 401.png
│   ├── 404.png
│   ├── 409.png
│   ├── 422.png
│   ├── logger.png
│   ├── notFound.png
│   ├── put200.png
│   └── put404.png
├── src/
│   ├── controllers/
│   │   └── menu.controller.js  # Menangani permintaan HTTP, memanggil service layer, dan mengembalikan respon.
│   ├── data/
│   │   └── menu.data.js        # Mengelola simulasi penyimpanan data menu (array in-memory) dan operasi CRUD dasar.
│   ├── middleware/
│   │   ├── cekApiKey.js         # Memeriksa keberadaan dan keabsahan header x-api-key pada request.
│   │   ├── errorHandler.js     # Middleware penanganan error terpusat 4 parameter untuk memformat respon error JSON.
│   │   ├── logger.js           # Mencatat setiap transaksi request HTTP beserta durasi eksekusinya ke terminal.
│   │   └── validasi.js         # Higher-order middleware untuk memvalidasi request body menggunakan skema Joi.
│   ├── routes/
│   │   └── menu.routes.js      # Mengarahkan rute URL /menu ke middleware dan controller yang sesuai.
│   ├── services/
│   │   └── menu.service.js     # Mengatur logika bisnis aplikasi, termasuk validasi duplikasi data dan pelemparan AppError.
│   ├── utils/
│   │   └── AppError.js         # Custom class error turunan dari Error untuk membawa status HTTP dan kode error.
│   └── validators/
│       └── menu.validator.js   # Mendefinisikan skema aturan validasi struktur data Joi untuk resource menu.
├── index.js                    # Entry point utama aplikasi Express, inisialisasi middleware global dan penanganan rute.
├── package.json                # Berkas konfigurasi dependensi dan script eksekusi proyek.
└── requests.http               # Berkas pengujian endpoint API menggunakan REST Client.
```

## Endpoint
| Method | URL | Middleware | Status |
|---|---|---|---|
| `GET` | `/menu` | `logger` | 200 OK |
| `GET` | `/menu?kategori=minuman` | `logger` | 200 OK |
| `GET` | `/menu/:id` | `logger` | 200 OK / 404 NOT_FOUND |
| `POST` | `/menu` | `logger`, `cekApiKey`, `validasi` | 201 Created / 401 / 409 / 422 |
| `PUT` | `/menu/:id` | `logger`, `cekApiKey`, `validasi` | 200 OK / 401 / 404 / 409 / 422 |
| `DELETE` | `/menu/:id` | `logger`, `cekApiKey` | 204 No Content / 401 / 404 |

## Aturan Validasi, Aturan Bisnis, dan Kode Error

### Aturan Validasi (Joi)
- `nama`: string, 3–50 karakter, wajib diisi.
- `harga`: bilangan bulat, Rp 1.000–Rp 100.000, wajib diisi.
- `kategori`: string, salah satu dari `makanan`, `minuman`, `camilan`, wajib diisi.
- `tersedia`: boolean, opsional (default: `true`).

### Aturan Bisnis (Status 409)
- `nama` tidak boleh kembar (mengabaikan huruf besar/kecil), menghasilkan kode error `NAMA_DUPLIKAT`.
- **Alasan tempatnya di service, bukan di Joi:** Joi digunakan untuk validasi skema sintaksis/struktur payload request (stateless), sedangkan aturan duplikasi `nama` memerlukan pengecekan ke status data yang ada di database/storage (stateful check) yang merupakan tanggung jawab dari logika bisnis pada Service Layer.

### Daftar Kode Error
- `UNAUTHORIZED` (401): API Key tidak diisi atau nilai header `x-api-key` tidak sesuai.
- `NOT_FOUND` (404): Data menu dengan ID yang dicari tidak ditemukan.
- `ROUTE_NOT_FOUND` (404): Memanggil rute/URL yang tidak terdaftar pada server.
- `NAMA_DUPLIKAT` (409): Nama menu sudah terdaftar di sistem.
- `VALIDATION_ERROR` (422): Payload request body tidak memenuhi aturan skema Joi.
- `INTERNAL_ERROR` (500): Terjadi kesalahan tidak terduga pada sisi server.

## Pengujian
- `screenshot/201.png` - Pengujian endpoint POST /menu yang berhasil membuat data baru (201 Created).
- `screenshot/204.png` - Pengujian endpoint DELETE /menu/:id yang berhasil menghapus data (204 No Content).
- `screenshot/401.png` - Pengujian endpoint POST /menu tanpa menyertakan API Key yang valid (401 Unauthorized).
- `screenshot/404.png` - Pengujian request GET /menu/:id dengan ID yang tidak ditemukan (404 Not Found).
- `screenshot/409.png` - Pengujian endpoint POST /menu dengan nama menu yang sudah terdaftar (409 Nama Duplikat).
- `screenshot/422.png` - Pengujian endpoint POST /menu dengan data body yang melanggar aturan validasi Joi (422 Validation Error).
- `screenshot/500.png` - Pengujian endpoint POST /menu dengan membuat kesalahan dari server (500 Internal Error).
- `screenshot/logger.png` - Tampilan terminal server yang menunjukkan log aktivitas setiap request HTTP beserta waktu eksekusi.
- `screenshot/notFound.png` - Pengujian request ke URL yang tidak terdaftar di server (404 Route Not Found).
- `screenshot/put200.png` - Pengujian bonus endpoint PUT /menu/:id yang berhasil memperbarui data menu (200 OK).
- `screenshot/put404.png` - Pengujian bonus endpoint PUT /menu/:id dengan ID menu yang tidak ada (404 Not Found).

## Deklarasi Penggunaan AI

| Bagian | Alat AI | Dipakai untuk apa | Cara saya memeriksa hasilnya |
|--------|---------|-------------------|------------------------------|
| Arsitektur Express & Error Handling | Gemini | Refactoring penanganan error terpusat, middleware `validasi`, `logger`, dan penyelarasan 4 lapis | Menguji seluruh skenario sukses dan error di `requests.http` serta memastikan format JSON respon sesuai spesifikasi |
| Skema Joi & Validator | Gemini | Pembuatan skema validasi Joi untuk varian Kantin dan pemisahan skema update | Menguji payload tidak valid (harga < 1000, nama pendek) di `requests.http`, menghasilkan 422 VALIDATION_ERROR |

Pernyataan: Saya menggunakan AI pada bagian yang tertulis di tabel. Bagian lain saya kerjakan sendiri.

## Kesimpulan & Kendala

### Kesimpulan
Sebelum menerapkan error terpusat, penanganan error dilakukan secara manual di setiap controller menggunakan `res.status().json()`, yang menyebabkan duplikasi kode dan format respon error yang tidak konsisten. Setelah menerapkan error terpusat dengan `AppError` dan `errorHandler`, struktur kode menjadi lebih rapi (clean code), penanganan error menjadi konsisten di satu tempat, dan detail sensitif dari server error (500) dapat disembunyikan dari klien.

### Kendala & Solusi
- **Kendala:** Parameter `id` dari `req.params.id` bertipe string, sehingga perbandingan ketat (`===`) pada layer data sempat tidak menemukan data yang dicari.
- **Solusi:** Melakukan konversi `Number(id)` di layer data sebelum melakukan pencarian atau manipulasi array.
- **Kendala:** Fungsi `app.listen()` Express tidak menerima callback bertipe `(err, res)` layaknya modul HTTP standar Node.js.
- **Solusi:** Memisahkan penanganan error server listen menggunakan listener event `server.on('error', ...)` dan memindahkan validasi `process.env.API_KEY` ke bagian paling atas bootstrap aplikasi.