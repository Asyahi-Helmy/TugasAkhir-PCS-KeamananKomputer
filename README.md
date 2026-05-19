# Sistem Penggajian & SDM (HRD Payroll)

Aplikasi berbasis web untuk manajemen absensi harian dan penggajian karyawan (HRD Payroll). 

Proyek ini dikembangkan untuk memenuhi tugas mata kuliah:
1. **Pemrograman Client Server**
2. **Keamanan Jaringan Komputer**

---

## ✨ Fitur Utama
Aplikasi ini memisahkan hak akses antara **Karyawan** dan **HRD/Manager** menggunakan arsitektur RESTful API.

- **Autentikasi & Otorisasi Aman (Keamanan Jaringan):** Dilengkapi dengan JWT (*JSON Web Tokens*) dan enkripsi *password* tingkat tinggi menggunakan `argon2`. Menerapkan *Role-Based Access Control* (RBAC) di mana Karyawan hanya bisa melihat datanya sendiri, sedangkan HRD dapat mengelola seluruh data.
- **Validasi Input:** Menggunakan `express-validator` untuk memastikan data yang masuk ke server aman dan terstruktur, mencegah serangan injeksi.
- **Sistem Absensi Harian:** Check-in absensi *real-time* dengan limitasi 1 kali sehari per *user*.
- **Manajemen Penggajian (CRUD):** Input otomatis kalkulasi gaji pokok, bonus, dan potongan hutang.
- **Dynamic SaaS Dashboard:** UI/UX modern menggunakan Vanilla JavaScript dengan sistem *Tab Navigation*, Filter Periode Bulan otomatis (*Data-Driven Dropdown*), dan *Summary Cards* (Rekapitulasi Data dinamis berdasarkan Role).
- **Interactive Alerts:** Menggunakan SweetAlert2 untuk notifikasi aksi yang elegan.

---

## 🛠️ Teknologi yang Digunakan
- **Frontend:** HTML5, CSS3 (Custom SaaS Design), Vanilla JavaScript (DOM Manipulation & Fetch API)
- **Backend:** Node.js, Express.js (v5)
- **Database:** MySQL / MariaDB
- **ORM:** Sequelize (dengan fitur Auto-Sync)
- **Security & Utilities:** Argon2 (Hashing), JWT (Otentikasi), Express Validator, CORS, Dotenv

---

## ⚙️ Persyaratan Sistem (Prerequisites)
Sebelum menjalankan aplikasi, pastikan sistem Anda sudah terinstal:
- [Node.js](https://nodejs.org/) (Versi 16 atau terbaru)
- MySQL Database (Bisa menggunakan Laragon atau XAMPP)
- Web Browser modern (Chrome/Edge/Firefox)

---

## 🚀 Langkah Instalasi & Menjalankan Aplikasi
**1. Clone Repository**
```bash
git clone https://github.com/Asyahi-Helmy/TugasAkhir-PCS-KeamananKomputer.git
cd TugasAkhir-PCS-KeamananKomputer
```

**2. Instalasi Dependencies (Backend)**
Buka terminal dan masuk ke direktori backend:

```Bash
cd backend
npm install argon2 cors dotenv express express-validator jsonwebtoken mysql2 sequelize
npm install -D nodemon
```

**3. Konfigurasi Database**

Buka Laragon/XAMPP dan jalankan layanan MySQL.

Buat database baru di DBMS Anda (misalnya: db_hrd_payroll).

**4. Konfigurasi Environment Variables (.env)**

Buat file baru bernama .env di dalam folder backend, lalu isi dengan konfigurasi berikut:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=db_hrd_payroll
PORT=3000
JWT_SECRET=rahasia_sup3r_4m4n?
```
(Sesuaikan DB_PASS jika MySQL Anda memiliki password, biarkan kosong jika default XAMPP/Laragon).

**5. Jalankan Server Backend**

Pastikan Anda masih berada di dalam folder backend, lalu jalankan server:

```Bash
npm run dev
```
Indikator sukses: Terminal akan menampilkan "Server jalan di: http://localhost:3000" dan "Database Sync Berhasil".

**6. Jalankan Frontend**

Buka folder frontend, lalu jalankan file index.html langsung ke browser, atau gunakan ekstensi Live Server di VS Code (http://127.0.0.1:5500).