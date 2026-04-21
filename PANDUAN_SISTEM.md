# Panduan Operasional Sistem GudangMitra

Dokumen ini menjelaskan alur kerja terintegrasi dan rincian fungsionalitas dari platform GudangMitra untuk setiap peran pengguna.

---

## 1. Alur Kerja Sistem (Workflow)

Sistem GudangMitra bekerja dalam siklus tertutup yang melibatkan tiga entitas utama untuk memastikan keamanan dan kualitas transaksi.

### Tahap 1: Inisialisasi dan Registrasi
Pengguna mendaftarkan diri melalui halaman autentikasi dengan memilih salah satu peran khusus: Reseller, Supplier, atau Admin. Identitas pengguna disimpan secara aman di Supabase Auth dan dipetakan ke dalam tabel profil di database PostgreSQL.

### Tahap 2: Manajemen Inventori (Supplier)
Supplier mengunggah produk ke platform. Pada tahap ini, produk akan berstatus 'Pending'. Produk tersebut belum dapat dilihat oleh Reseller untuk memastikan standar kualitas platform terjaga.

### Tahap 3: Moderasi dan Kurasi (Admin)
Administrator memeriksa daftar produk yang masuk. Admin memiliki wewenang untuk menyetujui (Approve) atau menolak (Reject) produk. Hanya produk yang disetujui yang akan didistribusikan ke katalog global Reseller.

### Tahap 4: Distribusi dan Pemasaran (Reseller)
Reseller mengeksplorasi produk yang telah divalidasi. Sebelum melakukan transaksi, Reseller menggunakan fitur kalkulator profit dan validasi otomatis untuk memastikan parameter pesanan (stok, harga, dan alamat) telah akurat.

### Tahap 5: Transaksi dan Penjaminan (Escrow)
Saat pesanan dibuat, dana dianggap masuk ke sistem Escrow. Status pesanan berubah menjadi 'Paid Escrow'. Supplier akan menerima notifikasi order masuk dan segera memproses pengiriman.

### Tahap 6: Logistik dan Penyelesaian
Supplier memperbarui status menjadi 'Shipped' setelah barang dikirim. Pesanan dianggap selesai setelah melewati proses validasi akhir, dan siklus transaksi ditutup dengan pemutakhiran data performa pada masing-masing dashboard.

---

## 2. Penjelasan Fitur Berdasarkan Peran

### Dashboard Reseller
Fitur yang dirancang untuk mendukung efisiensi agen dalam menjual produk tanpa stok fisik.

*   **Smart Product Recommendation**: Katalog dinamis yang menampilkan produk berdasarkan kategori pilihan dan popularitas database.
*   **AI Rekomendasi Produk Laris**: Sistem scoring yang mendeteksi produk dengan potensi penjualan tinggi berdasarkan parameter tren di sistem.
*   **Smart Supplier Ranking**: Daftar supplier berprestasi yang diurutkan berdasarkan rating, kecepatan pengiriman, dan kualitas produk.
*   **Profit Calculator**: Alat simulasi untuk menghitung keuntungan bersih setelah dikurangi harga modal, biaya admin, dan ongkos kirim.
*   **Smart Validation Order**: Fitur pre-order yang secara otomatis memvalidasi ketersediaan stok dan kelengkapan data sebelum pembayaran dilakukan.
*   **Transaksi Aktif**: Panel pemantauan status pesanan di sistem Escrow (Proses, Dikirim, Selesai).
*   **Mini Academy**: Modul pembelajaran terintegrasi untuk meningkatkan keahlian bisnis digital reseller.

### Dashboard Supplier
Fitur yang berfokus pada manajemen stok dan efisiensi pengiriman barang.

*   **Manajemen Produk**: Antarmuka untuk menambah, mengedit, dan memantau status validasi produk di pasar.
*   **Order Masuk**: Panel notifikasi real-time untuk setiap pesanan yang telah dibayar oleh reseller melalui sistem Escrow.
*   **Pengiriman Resi**: Sistem pembaruan status logistik yang memicu notifikasi pengiriman kepada pihak reseller.
*   **Statistik Supplier**: Ringkasan performa yang mencakup total produk tervalidasi dan jumlah pesanan yang perlu diproses.

### Dashboard Admin
Pusat kendali operasional platform untuk menjaga kesehatan ekosistem.

*   **Moderasi Validasi**: Panel persetujuan produk supplier untuk menjaga kualitas katalog di sisi reseller.
*   **Manajemen Pengguna**: Monitoring daftar seluruh aktor yang terdaftar dalam sistem (Admin, Supplier, Reseller).
*   **Overview Performa**: Visualisasi data statistik pertumbuhan pengguna dan aktivitas transaksi platform secara makro.

---

## 3. Infrastruktur Keamanan
Aplikasi ini berjalan dengan memanfaatkan **PostgreSQL Row Level Security (RLS)**, yang memastikan bahwa:
1. Supplier hanya dapat melihat dan mengelola produk milik mereka sendiri.
2. Reseller hanya dapat melihat riwayat transaksi pribadi mereka.
3. Seluruh data sensitif hanya dapat diakses melalui token autentikasi yang valid.
