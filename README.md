# GudangMitra - Platform Dropshipping dan Reseller Cerdas

## Deskripsi
GudangMitra adalah platform dropshipping dan reseller cerdas yang menghubungkan supplier dan reseller menggunakan teknologi analisis data. Platform ini menyediakan berbagai fitur untuk membantu reseller memilih produk optimal, menghitung profit secara otomatis, dan melakukan transaksi yang aman melalui sistem escrow dengan database terpusat Supabase.

---

## Tautan Resmi
| Item | URL |
| :--- | :--- |
| **Source Code** | [GitHub Repository](https://github.com/FESALFARENDIKA/GudangMitra) |
| **Live Demo** | [https://my-gudang-mitra.netlify.app/](https://my-gudang-mitra.netlify.app/) |

---

## Fitur Utama
| No | Fitur | Deskripsi |
| :--- | :--- | :--- |
| 1 | **Smart Product Recommendation** | Rekomendasi produk berdasarkan kategori dan popularitas pasar. |
| 2 | **AI Rekomendasi Produk Laris** | Analisis tren pasar menggunakan skor AI untuk menentukan potensi produk viral. |
| 3 | **Smart Supplier Ranking** | Pemeringkatan supplier berdasarkan metrik performa, kualitas, dan rating pengguna. |
| 4 | **Smart Validation Order** | Validasi otomatis terhadap stok, kredibilitas supplier, harga, dan alamat sebelum pesanan diproses. |
| 5 | **Analisis Margin Otomatis** | Kalkulasi keuntungan secara langsung berdasarkan database harga modal dan harga jual. |
| 6 | **Auto Profit Calculator** | Simulasi laba bersih secara real-time dengan variabel biaya pengiriman dan layanan. |
| 7 | **Monitoring Transaksi (Escrow)** | Manajemen transaksi aktif mulai dari tahap pemrosesan hingga pengiriman resi. |
| 8 | **Mini Academy** | Modul edukasi strategi bisnis dropshipping yang tersinkronisasi secara cloud. |
| 9 | **Sistem Garansi (Escrow)** | Protokol keamanan transaksi di mana dana hanya akan diteruskan ke supplier setelah produk dikirim. |
| 10 | **Validasi Produk (Admin)** | Kontrol kualitas di mana Admin melakukan moderasi terhadap produk supplier sebelum ditayangkan. |

---

## Metodologi Sistem (Use Case)
| No | Lingkup | Aktor | Use Case | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Sistem Utama | Pengguna | Autentikasi | Integrasi dengan Supabase Auth untuk keamanan akses. |
| 2 | Sistem Supplier | Supplier | Manajemen Produk | Pengunggahan produk baru untuk dievaluasi oleh sistem. |
| 3 | Sistem Supplier | Supplier | Pemrosesan Pesanan | Pembaruan status logistik pesanan menjadi dikirim (Shipped). |
| 4 | Sistem Reseller | Reseller | Eksplorasi Produk | Akses katalog produk yang telah divalidasi oleh administrator. |
| 5 | Sistem Reseller | Reseller | Validasi Pesanan | Pemeriksaan kepatuhan parameter order sebelum transfer dana. |
| 6 | Sistem Reseller | Reseller | Pengajuan Order | Registrasi transaksi ke dalam brankas keamanan Escrow. |
| 7 | Sistem Reseller | Reseller | Materi Edukasi | Akses kurikulum pengembangan bisnis digital. |
| 8 | Sistem Admin | Admin | Moderasi Produk | Evaluasi dan persetujuan produk supplier untuk publikasi. |
| 9 | Sistem Admin | Admin | Pengawasan Platform | Monitoring aktivitas pengguna dan kesehatan ekosistem bisnis. |
| 10 | Keamanan | Sistem | Proteksi RLS | Penerapan Row Level Security pada setiap transaksi database. |

---

## Tumpukan Teknologi (Tech Stack)
| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Struktur** | HTML5 | Implementasi markup semantik untuk SEO dan aksesibilitas. |
| **Gaya Visual** | CSS3 | Desain modern menggunakan CSS Variables dan Flexbox/Grid (Vanilla). |
| **Logika** | JavaScript | Pemrograman asinkron ES6+ untuk antarmuka yang reaktif. |
| **Backend** | Supabase | Solusi infrastruktur cloud (PostgreSQL, Auth, dan API). |
| **Deployment** | GitHub Pages | Lingkungan produksi untuk hosting statis dan akses publik. |

---

## Arsitektur Berkas
```text
GudangMitra/
├── index.html                 # Halaman utama dan navigasi
├── login.html                 # Antarmuka autentikasi pengguna
├── dashboard-reseller.html    # Ruang kerja pengguna reseller
├── dashboard-supplier.html    # Ruang kerja pengguna supplier
├── dashboard-admin.html       # Panel kontrol administrator
├── css/
│   └── style.css              # Definisi gaya global dan variabel desain
├── js/
│   ├── supabase-config.js     # Konfigurasi koneksi cloud database
│   ├── app.js                 # Logika administrasi dan cek otoritas
│   ├── auth.js                # Pengaturan pendaftaran dan masuk sistem
│   ├── reseller.js            # Fungsionalitas operasional reseller
│   ├── supplier.js            # Manajemen inventori dan order supplier
│   └── admin.js               # Pengaturan moderasi dan data platform
├── supabase-reset.sql         # Skema basis data relasional
└── README.md                  # Dokumentasi teknis proyek
```

---

## Akun Demonstrasi
| Peran (Role) | Alamat Surel (Email) | Kata Sandi (Password) |
| :--- | :--- | :--- |
| **Admin** | `admin@gudangmitra.com` | `adminpassword123` |
| **Reseller** | `reseller@demo.com` | `demo123` |
| **Supplier** | `supplier@demo.com` | `demo123` |

---

## Laporan Pengujian Sistem

### 1. Pengujian Fungsionalitas
| Kode | Skenario Uji | Hasil yang Diharapkan | Status |
| :--- | :--- | :--- | :--- |
| F-01 | Autentikasi Pengguna | Pengguna diarahkan ke dashboard sesuai dengan role masing-masing. | **Berhasil** |
| F-02 | Penambahan Produk | Penambahan item oleh supplier tersimpan dengan status 'Pending'. | **Berhasil** |
| F-03 | Moderasi Admin | Perubahan status produk dari Admin terefleksi ke seluruh sistem. | **Berhasil** |
| F-04 | Validasi Transaksi | Sistem memblokir pengajuan order jika parameter stok tidak terpenuhi. | **Berhasil** |
| F-05 | Pemotongan Stok | Qty produk di database berkurang secara otomatis saat order dibuat. | **Berhasil** |

### 2. Pengujian Keamanan dan Performa
| Kode | Aspek Pengujian | Hasil Observasi | Status |
| :--- | :--- | :--- | :--- |
| S-01 | **Keamanan Akses** | Firewall internal melakukan redirect otomatis bagi akses tanpa sesi aktif. | **Pass** |
| S-02 | **Integritas Data** | Row Level Security (RLS) mencegah akses data antar pengguna berbeda. | **Pass** |
| P-01 | **Efisiensi Memuat** | Kecepatan memuat halaman di bawah 1 detik dengan optimasi aset. | **Pass** |
| P-02 | **Sinkronisasi Data** | Latensi penulisan data ke cloud database berada pada level minimal. | **Pass** |

---

## Petunjuk Instalasi

### Jalankan Secara Lokal
1.  Lakukan kloning repositori: `git clone https://github.com/FESALFARENDIKA/GudangMitra.git`
2.  Buka berkas `index.html` menggunakan lingkungan server lokal (seperti Laragon, XAMPP, atau Live Server).
3.  **Integrasi Database**: Sangat disarankan untuk menjalankan skrip `supabase-reset.sql` pada SQL Editor di dashboard Supabase Anda untuk sinkronisasi skema data terbaru.

---

## Lisensi
Proyek ini dilisensikan di bawah MIT License.
**Hak Cipta 2026 GudangMitra. Seluruh hak cipta dilindungi undang-undang.**
