# GudangMitra - Platform Dropshipping dan Reseller Cerdas

## Deskripsi

GudangMitra adalah platform dropshipping dan reseller cerdas yang menghubungkan supplier dan reseller dengan teknologi AI. Platform ini menyediakan fitur-fitur smart untuk membantu reseller memilih produk terbaik, menghitung profit otomatis, dan melakukan transaksi yang aman dengan sistem escrow.

### Links

| Item | URL |
|------|-----|
| Source Code | [GitHub Repository](https://github.com/FESALFARENDIKA/GudangMitra) |
| Live Demo | [https://fesalfarendika.github.io/GudangMitra](https://fesalfarendika.github.io/GudangMitra) |

---

## Fitur Unggulan

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 1 | Smart Product Recommendation | Rekomendasi produk personal berdasarkan preferensi dan riwayat penjualan |
| 2 | AI Rekomendasi Produk Laris | Analisis tren pasar menggunakan AI untuk produk viral |
| 3 | Smart Supplier Ranking | Peringkat supplier berdasarkan performa, kualitas, dan kepuasan |
| 4 | Smart Validation Order | Validasi otomatis sebelum order (stok, supplier, harga, alamat) |
| 5 | Analisis Margin Otomatis | Hitung keuntungan otomatis dengan pertimbangan semua biaya |
| 6 | Auto Profit Calculator | Simulasi keuntungan real-time sebelum menjual |
| 7 | Dashboard Performa Reseller | Monitoring penjualan, profit, dan performa bisnis |
| 8 | Mini Academy | Modul edukasi bisnis dropshipping untuk reseller |
| 9 | Sistem Garansi (Escrow) | Keamanan transaksi dengan sistem escrow |
| 10 | Validasi Produk | Memastikan kualitas produk sebelum dijual ke reseller |

Catatan: Semua fitur dapat diakses tanpa biaya membership bulanan.

---

## Use Case Diagram

| No | Boundary | Aktor | Use Case | Relasi | Keterangan |
|----|----------|-------|----------|--------|------------|
| 1 | System | Supplier, Reseller, Admin | Login | - | Akses awal sistem |
| 2 | Supplier System | Supplier | Validasi Produk | include Login | Memastikan produk layak |
| 3 | Supplier System | Supplier | Lihat Ranking Supplier | extend Validasi Produk | Melihat performa supplier |
| 4 | Reseller System | Reseller | Smart Product Recommendation | include Login | Rekomendasi produk personal |
| 5 | Reseller System | Reseller | AI Rekomendasi Produk Laris | extend Smart Product Recommendation | Rekomendasi berbasis tren |
| 6 | Reseller System | Reseller | Smart Supplier Ranking | include Login | Memilih supplier terbaik |
| 7 | Reseller System | Reseller | Smart Validation Order | include Login | Validasi sebelum order |
| 8 | Reseller System | Reseller | Analisis Margin Otomatis | include Login | Hitung keuntungan otomatis |
| 9 | Reseller System | Reseller | Auto Profit Calculator | extend Analisis Margin Otomatis | Simulasi profit |
| 10 | Reseller System | Reseller | Dashboard Performa Reseller | include Login | Monitoring penjualan |
| 11 | Reseller System | Reseller | Mini Academy | include Login | Edukasi bisnis |
| 12 | System Security | Supplier, Reseller | Sistem Garansi (Escrow) | include Smart Validation Order | Keamanan transaksi |
| 13 | System Quality | Supplier, Admin | Monitoring Validasi Produk | include Validasi Produk | Kontrol kualitas |

---

## Tech Stack

| Teknologi | Keterangan |
|-----------|------------|
| HTML5 | Struktur halaman |
| CSS3 | Styling dan animasi (Vanilla CSS) |
| JavaScript (ES6+) | Logika aplikasi |
| LocalStorage | Penyimpanan data lokal |
| GitHub Pages | Hosting dan deployment gratis |

---

## Struktur File

```
GudangMitra/
├── index.html                 # Landing page
├── login.html                 # Halaman login dan register
├── dashboard-reseller.html    # Dashboard reseller
├── dashboard-supplier.html    # Dashboard supplier
├── dashboard-admin.html       # Dashboard admin
├── css/
│   └── style.css              # Semua styling
├── js/
│   ├── app.js                 # Core app logic
│   ├── auth.js                # Authentication
│   ├── reseller.js            # Reseller features
│   ├── supplier.js            # Supplier features
│   └── admin.js               # Admin features
└── README.md                  # Dokumentasi
```

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Reseller | reseller@demo.com | demo123 |
| Supplier | supplier@demo.com | demo123 |
| Admin | admin@demo.com | demo123 |

---

## Aktor Sistem

| Aktor | Hak Akses |
|-------|-----------|
| Reseller | Smart Recommendation, AI Trending, Supplier Ranking, Validation Order, Margin Analysis, Profit Calculator, Dashboard Performa, Mini Academy, Sistem Garansi |
| Supplier | Validasi Produk, Lihat Ranking, Order Masuk, Monitoring Validasi |
| Admin | User Management, Validasi Produk, Monitoring Sistem, Overview Platform |

---

## Pengujian Kualitas Aplikasi

### 1. Functionality Testing

| No | Test Case | Langkah Pengujian | Expected Result | Actual Result | Status |
|----|-----------|-------------------|-----------------|---------------|--------|
| F-01 | Login Reseller | Input email reseller@demo.com dan password demo123, klik Login | Redirect ke dashboard reseller | Berhasil redirect ke dashboard-reseller.html | Pass |
| F-02 | Login Supplier | Input email supplier@demo.com dan password demo123, klik Login | Redirect ke dashboard supplier | Berhasil redirect ke dashboard-supplier.html | Pass |
| F-03 | Login Admin | Input email admin@demo.com dan password demo123, klik Login | Redirect ke dashboard admin | Berhasil redirect ke dashboard-admin.html | Pass |
| F-04 | Login Gagal | Input email dan password salah | Muncul toast error | Toast error muncul | Pass |
| F-05 | Register User Baru | Isi form register dengan data valid | Registrasi berhasil, switch ke tab login | Toast sukses muncul, form beralih ke login | Pass |
| F-06 | Register Validasi Password | Input password tidak sama dengan konfirmasi | Muncul toast error | Toast error tampil | Pass |
| F-07 | Smart Recommendation | Buka menu Smart Recommendation di dashboard reseller | Menampilkan grid produk rekomendasi | Grid produk tampil dengan 8 produk | Pass |
| F-08 | Filter Produk | Klik tab filter (Fashion, Beauty, Makanan) | Produk terfilter sesuai kategori | Produk terfilter dengan benar | Pass |
| F-09 | AI Rekomendasi | Buka menu Produk Laris AI | Menampilkan trend score dan ranking | Chart dan ranking list tampil | Pass |
| F-10 | Supplier Ranking | Buka menu Ranking Supplier | Menampilkan daftar supplier terurut | 8 supplier tampil terurut berdasarkan rating | Pass |
| F-11 | Validation Order | Pilih produk, isi qty dan alamat | Validasi 5 checklist berjalan otomatis | Semua checklist tervalidasi berurutan | Pass |
| F-12 | Submit Order | Klik Submit Order setelah validasi | Toast sukses muncul | Toast berhasil tampil | Pass |
| F-13 | Analisis Margin | Buka menu Analisis Margin | Tabel margin produk tampil | Tabel dengan 8 produk dan margin persen | Pass |
| F-14 | Profit Calculator | Input harga modal, jual, qty | Kalkulasi otomatis real-time | Profit per unit, total revenue, total profit tampil | Pass |
| F-15 | Sistem Garansi | Buka menu Sistem Garansi | Menampilkan escrow timeline dan transaksi | Timeline 5 step dan 3 transaksi aktif tampil | Pass |
| F-16 | Dashboard Performa | Buka menu Performa Saya | Menampilkan stats dan target | Stats card dan progress bar tampil | Pass |
| F-17 | Mini Academy | Buka menu Mini Academy | Menampilkan 6 course card | 6 course card dengan detail tampil | Pass |
| F-18 | Validasi Produk (Supplier) | Klik Validasi pada produk pending | Status berubah ke Valid | Badge berubah menjadi Valid | Pass |
| F-19 | Approve Produk (Admin) | Klik Approve pada produk pending | Status berubah ke Approved | Badge berubah menjadi Approved | Pass |
| F-20 | Logout | Klik tombol logout | Redirect ke login page | Redirect ke login.html, localStorage cleared | Pass |

### 2. Usability Testing

| No | Aspek | Kriteria | Hasil | Status |
|----|-------|----------|-------|--------|
| U-01 | Navigation | Menu sidebar mudah dipahami dan diakses | Semua menu memiliki icon dan label jelas | Pass |
| U-02 | Feedback | Sistem memberikan feedback untuk setiap aksi | Toast notification untuk setiap aksi penting | Pass |
| U-03 | Consistency | Desain konsisten di semua halaman | Warna, font, dan layout konsisten | Pass |
| U-04 | Error Prevention | Form memiliki validasi input | Validasi email, password, dan field wajib | Pass |
| U-05 | Learnability | User baru mudah memahami alur | Demo accounts dan label intuitif tersedia | Pass |

### 3. Compatibility Testing

| No | Browser atau Device | Versi | Hasil | Status |
|----|---------------------|-------|-------|--------|
| C-01 | Google Chrome | 120+ | Semua fitur berfungsi normal | Pass |
| C-02 | Mozilla Firefox | 115+ | Semua fitur berfungsi normal | Pass |
| C-03 | Microsoft Edge | 120+ | Semua fitur berfungsi normal | Pass |
| C-04 | Safari | 17+ | Semua fitur berfungsi normal | Pass |
| C-05 | Mobile Chrome (Android) | Latest | Responsive layout berfungsi | Pass |
| C-06 | Mobile Safari (iOS) | Latest | Responsive layout berfungsi | Pass |

### 4. Performance Testing

| No | Aspek | Metrik | Target | Hasil | Status |
|----|-------|--------|--------|-------|--------|
| P-01 | Page Load Time | First Contentful Paint | Kurang dari 2 detik | Sekitar 0.5 detik (static HTML) | Pass |
| P-02 | File Size | Total assets | Kurang dari 500KB | Sekitar 85KB (CSS+JS) | Pass |
| P-03 | Interactivity | Time to Interactive | Kurang dari 3 detik | Sekitar 0.8 detik | Pass |
| P-04 | Animation | Frame Rate | 60fps | 60fps smooth | Pass |

### 5. Security Testing

| No | Aspek | Pengujian | Hasil | Status |
|----|-------|-----------|-------|--------|
| S-01 | Authentication | Login tanpa credentials | Akses ditolak, redirect ke login | Pass |
| S-02 | Authorization | Akses dashboard tanpa login | Redirect ke login page | Pass |
| S-03 | Input Validation | Input XSS pada form | Input sanitized, tidak ada execution | Pass |
| S-04 | Data Protection | Password storage | Tersimpan di localStorage (demo only) | Demo |

### 6. Responsive Design Testing

| No | Breakpoint | Resolusi | Layout | Status |
|----|-----------|----------|--------|--------|
| R-01 | Desktop | 1200px ke atas | Full layout, sidebar dan main | Pass |
| R-02 | Tablet | 768px sampai 1024px | Sidebar collapsed, grid adjustment | Pass |
| R-03 | Mobile | Kurang dari 768px | Single column, hamburger menu | Pass |

---

## Cara Menjalankan

### Lokal (Laragon atau XAMPP)

1. Clone repository ke folder www:
   ```
   git clone https://github.com/FESALFARENDIKA/GudangMitra.git
   ```
2. Buka browser dan akses: http://localhost/GudangMitra

### GitHub Pages

1. Push repository ke GitHub
2. Buka Settings lalu Pages
3. Pilih branch main dan folder root
4. Akses via URL yang diberikan

---

## Lisensi

Project ini dilisensikan di bawah MIT License.

---

Hak Cipta 2026 GudangMitra. All rights reserved.
