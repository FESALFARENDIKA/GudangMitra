# GudangMitra 📦

GudangMitra adalah platform revolusioner **B2B Dropship & Grosir** yang menghubungkan Supplier Tangan Pertama dengan Jutaan Reseller di seluruh Indonesia menggunakan sistem keamanan tinggi (Escrow) dan infrastruktur Cloud Database Supabase.

✨ **Status Live / Demo:** _(Deployed via Netlify/GitHub - Tambahkan Link Disini)_

---

## 🔑 Akun Demo (Credentials)

Gunakan akun berikut untuk menguji coba fitur masing-masing role:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@gudangmitra.com` | `adminpassword123` |
| **Supplier** | `supplier@demo.com` | `demo123` |
| **Reseller** | `reseller@demo.com` | `demo123` |

---

## ⚡ Fitur Unggulan

GudangMitra memiliki 3 entitas pengguna (Role) yang saling terhubung secara _Real-time_ melalui Supabase:

### 1. 🏭 Dashboard Supplier 
*   **Katalog Terpusat:** Supplier dapat menambahkan / mengunggah produk dengan foto dan mengatur harga modal (Cost).
*   **Manajemen Escrow:** Menerima orderan dari ribuan reseller, dan memproses order ("Kirim Resi") dengan jaminan uang aman di Brankas Escrow.
*   **Sistem Monitoring:** Melihat total order aktif dan grafik konversi penjualan.

### 2. 🛒 Dashboard Reseller
*   **Tanpa Stok Barang:** Menganalisis jutaan produk Supplier secara langsung tanpa perlu modal kulakan.
*   **Profit Calculator:** Kalkulasi presisi margin keuntungan sebelum mendistribusikan barang ke end-consumer.
*   **Live Tracking Order:** Panel "Transaksi" memberikan kepastian bahwa pesanan sedang diproses dan dipacking oleh Supplier.

### 3. ⚙️ Dashboard Admin (Pusat Kendali)
*   **Gatekeeper Kualitas:** Semua produk yang baru diposting Supplier secara otomatis tertahan di tab "Pendeng Review". Admin wajib mengklik *Approve* agar produk masuk ke pasar luas.
*   **Verifikasi Pengguna:** Memantau pengguna baru.
*   **Monitoring Keseluruhan:** Panel pengawasan makro terhadap ekonomi ekosistem GudangMitra.

---

## 🛠️ Stack Teknologi

GudangMitra tidak menggunakan backend server tradisional (NodeJS/Express), melainkan **Supabase (Backend-as-a-Service)**:

*   **Frontend**: HTML5, CSS3 Variables, Vanilla JavaScript.
*   **Database**: PostgreSQL via **Supabase Database**.
*   **Authentication**: Supabase Auth (Email & Password), Row Level Security (RLS).
*   **Storage API**: _(Optional support for future image handling)_

---

## 🚀 Panduan Setup Lokal

Karena GudangMitra berjalan fully on-cloud (BaaS), setup di komputer Anda sangatlah mudah:

1. **Clone Repositori Web**
   ```bash
   git clone https://github.com/[username]/gudangmitra.git
   ```
2. **Jalankan via Local Server**
   Buka folder proyek menggunakan ekstensi **Live Server** di VSCode, XAMPP, atau Laragon. Tidak ada `npm install` yang diwajibkan!
3. **Konfigurasi Database (Supabase-reset.sql)**
   *   Buat Project baru di [Supabase](https://supabase.com/).
   *   Matikan fungsi *Confirm Email* di `Authentication > Providers > Email` agar pendaftaran instan masuk tanpa verifikasi SMTP.
   *   Copy kode rahasia (`anonKey` & `URL`) Supabase Anda dan *replace* di dalam file `js/supabase-config.js`.
   *   Buka dashboard SQL Supabase Anda, *Copy + Paste* seluruh instruksi dari file `supabase-reset.sql`, lalu tekan RUN. Database dan Data Dummy akan *auto-seeded* (Terisi otomatis).

---

## 📝 Catatan Penting
*   Tidak ada logika autentikasi *Demo Bypass*. Semua pengguna yang mendaftar memicu pembuatan Row Level di PostgreSQL database nyata.
*   Jika peran Role tidak sesuai, modifikasi secara manual dari *Table Editor* di Supabase -> Table `users`.

***

*Dibuat untuk memajukan UKM Reseller & Dropshipper Indonesia ©️ GudangMitra 2026*
