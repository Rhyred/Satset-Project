<div align="center">

# 🏛️ SATSET
### Sistem Administrasi Terpadu & Sentralisasi Elektronik

**Platform GovTech modern untuk transparansi dan kemudahan akses layanan publik digital.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org)

</div>

---

## 📌 Deskripsi Project

**SATSET** hadir untuk menjawab permasalahan umum dalam layanan administrasi publik:

| Masalah | Solusi SATSET |
|---|---|
| Warga tidak tahu status laporannya | Service Timeline 7-langkah real-time |
| Antrean fisik panjang dan tidak pasti | Antrean Digital dengan estimasi waktu |
| Tidak ada panduan tindakan untuk warga | Smart Citizen Guidance (NextActionCard) |
| Pengumuman instansi tidak terpusat | Mading Digital resmi |
| Admin sulit memantau kinerja layanan | Dashboard SLA & metrik terpadu |

---

## ✨ Fitur Utama

### 👤 Sisi Warga
- **📋 Pengaduan Masyarakat (E-Report)** — Pelaporan infrastruktur, fasilitas umum, dengan pelacakan status transparan
- **🎟️ Antrean Digital (E-Queue)** — Tiket digital dengan progress bar real-time dan estimasi waktu
- **🧭 Smart Citizen Guidance** — Kartu panduan dinamis yang secara otomatis memberi tahu langkah selanjutnya
- **🔔 Notifikasi Terpadu** — Pemberitahuan pembaruan status laporan & antrean
- **📰 Mading Digital** — Papan pengumuman resmi instansi
- **🖨️ Cetak Dokumen** — Bukti laporan & tiket antrean siap cetak (PDF)

### 🔧 Sisi Admin
- **📊 Dashboard Kinerja** — Grafik distribusi status laporan & antrean (Chart.js)
- **⏱️ Metrik SLA** — Rata-rata waktu penyelesaian, tingkat keberhasilan, laporan aktif
- **📝 Manajemen Laporan** — Verifikasi, penugasan, dan tindak lanjut laporan warga
- **📣 Manajemen Mading** — Penerbitan dan pengelolaan pengumuman resmi

---

## 🛠️ Teknologi

| Layer | Teknologi |
|---|---|
| **Frontend** | React 18, TypeScript 5, Vite, Framer Motion, Lucide Icons |
| **Styling** | Vanilla CSS (Design System dengan CSS Variables), Mobile-First |
| **State** | React Context API (AuthContext, ToastContext) |
| **Charts** | Chart.js + react-chartjs-2 |
| **Backend** | Java 17, Spring Boot 3, Spring Security, JWT Authentication |
| **ORM** | Hibernate / Spring Data JPA |
| **Database** | PostgreSQL 15 |
| **Build Tools** | Maven (Backend), Vite (Frontend) |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────┐
│  Browser (React + TS + Vite)│
│  Port: 5173 (dev)           │
└────────────┬────────────────┘
             │ HTTP REST (JSON)
             │ /api/**  →  Vite Proxy
             ▼
┌─────────────────────────────┐
│  Spring Boot Application    │
│  Port: 8080                 │
│  Spring Security + JWT      │
└────────────┬────────────────┘
             │ Hibernate / JPA
             ▼
┌─────────────────────────────┐
│  PostgreSQL 15              │
│  Database: satset_db        │
└─────────────────────────────┘
```

---

## 📂 Struktur Folder

```text
satset-project/
├── README.md
│
├── frontend/                          # React + TypeScript App
│   ├── src/
│   │   ├── components/                # Reusable UI Components
│   │   │   ├── ServiceTimeline.tsx    # 7-step visual tracker
│   │   │   ├── NextActionCard.tsx     # Smart citizen guidance card
│   │   │   ├── QueueProgressCard.tsx  # Live queue progress bar
│   │   │   └── EmptyState.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx        # Global authentication state
│   │   │   └── ToastContext.tsx       # Notification toast system
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Citizen Command Center
│   │   │   ├── ReportFeed.tsx        # Laporan & Pengaduan
│   │   │   ├── Queue.tsx             # Antrean Digital
│   │   │   ├── Notifications.tsx     # Notifikasi
│   │   │   ├── Mading.tsx            # Mading Digital
│   │   │   ├── Account.tsx           # Profil Warga
│   │   │   ├── AdminDashboard.tsx    # Dashboard Admin
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── styles/
│   │   │   ├── tokens.css            # Design system (CSS Variables)
│   │   │   ├── base.css              # Reset & typography
│   │   │   ├── components.css        # Reusable class utilities
│   │   │   ├── layout.css            # Page layout & grid
│   │   │   └── print.css             # Print / PDF styles
│   │   └── types/
│   │       └── index.ts              # Strict TypeScript interfaces
│   ├── vite.config.ts
│   └── package.json
│
└── backend/                           # Spring Boot Application
    └── src/main/java/.../satset/
        ├── controllers/               # REST API Endpoints
        ├── models/                    # JPA Entity classes
        ├── repositories/             # Spring Data JPA repositories
        ├── services/                 # Business logic layer
        ├── dto/                      # Request/Response DTOs
        └── security/                 # JWT filter, auth config
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js v18+
- Java JDK 17+
- PostgreSQL 15+ (running di `localhost:5432`)
- Maven 3.8+

### 1. Setup Database
```sql
-- Jalankan di PostgreSQL client (psql / DBeaver / pgAdmin)
CREATE DATABASE satset_db;
```
> Spring Boot akan otomatis membuat skema tabel via Hibernate DDL auto.

### 2. Konfigurasi Backend
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/satset_db
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
```

### 3. Jalankan Backend
```bash
cd backend
mvn spring-boot:run
# Backend berjalan di http://localhost:8080
```

### 4. Jalankan Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend berjalan di http://localhost:5173
```
> Semua request `/api/**` secara otomatis di-proxy ke backend melalui konfigurasi Vite.

---

## 📡 API Endpoint Utama

### Auth
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/auth/login` | Login warga / admin |
| `POST` | `/api/auth/register` | Pendaftaran warga baru |

### Laporan & Pengaduan
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/laporan` | Daftar semua laporan |
| `POST` | `/api/laporan` | Buat laporan baru |
| `PUT` | `/api/laporan/{id}/status` | Update status laporan (Admin) |
| `POST` | `/api/laporan/{id}/tindak-lanjut` | Tambah tanggapan petugas (Admin) |

### Antrean Digital
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/antrean` | Daftar antrean |
| `POST` | `/api/antrean` | Ambil nomor antrean baru |
| `PUT` | `/api/antrean/{id}/status` | Update status antrean (Admin) |

### Notifikasi
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/notifikasi/my` | Notifikasi milik pengguna yang login |
| `PUT` | `/api/notifikasi/{id}/read` | Tandai notifikasi sudah dibaca |

### Mading Digital
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/mading` | Daftar mading yang dipublikasikan |
| `POST` | `/api/mading` | Buat mading baru (Admin) |
| `DELETE` | `/api/mading/{id}` | Hapus mading (Admin) |

---

## 📊 Evaluasi Produk

| Aspek | Skor | Catatan |
|-------|------|---------|
| Arsitektur | ⭐⭐⭐⭐½ | Client-Server separation jelas, REST API terstandar |
| Kualitas UX | ⭐⭐⭐⭐⭐ | Smart Guidance, Service Timeline, animasi GovTech-grade |
| Kualitas Frontend | ⭐⭐⭐⭐½ | TypeScript strict, Design System konsisten |
| Kualitas Backend | ⭐⭐⭐⭐ | Spring Security + JWT sudah solid |
| Kesiapan Portofolio | ⭐⭐⭐⭐⭐ | Siap GitHub, Presentasi Dosen, Interview |

---

## 👥 Kontributor

Dikembangkan sebagai **Capstone Project** Mata Kuliah Pemrograman Berorientasi Objek.

**Tim Pengembang SATSET**

---

<div align="center">
  <em>"Pelayanan Publik yang Cepat, Tepat, dan Transparan."</em>
  <br/><br/>
  <strong>SATSET © 2024 – Platform GovTech untuk Warga Indonesia</strong>
</div>
