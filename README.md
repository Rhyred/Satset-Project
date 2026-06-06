<div align="center">

# 🏛️ SATSET
### Sistem Administrasi Terpadu & Sentralisasi Elektronik

**Platform digital hybrid untuk layanan warga dan manajemen admin dengan antrean elektronik, pelaporan masyarakat, notifikasi, dashboard kinerja, dan mading digital.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org)

</div>

---

## 📌 Deskripsi Proyek

**SATSET** adalah aplikasi manajemen layanan publik yang menggabungkan:
- Pelaporan masyarakat terpusat (E-Report)
- Antrean digital untuk layanan instansi
- Notifikasi status dan update
- Mading pengumuman resmi
- Dashboard admin untuk monitoring kinerja layanan

Proyek ini dibangun sebagai aplikasi full-stack:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Java Spring Boot
- **Database**: PostgreSQL

---

## ✨ Fitur Utama

### 👤 Warga
- Sistem pelaporan masyarakat dengan pembuatan dan pelacakan status laporan
- Antrean digital dengan nomor antrean dan progress
- Notifikasi pembaruan laporan, antrean, dan pengumuman
- Mading digital untuk pengumuman instansi
- Dashboard ringkas untuk melihat status layanan

### 🔧 Admin
- Dashboard kinerja untuk memantau jumlah laporan, antrean, dan metrik lainnya
- Manajemen laporan: verifikasi, penugasan, dan update status
- Pengelolaan mading/pengumuman resmi
- Visualisasi data menggunakan grafik

---

## 🛠️ Stack Teknologi

| Layer | Teknologi |
|---|---|
| Frontend | React 18, TypeScript 5, Vite, Tailwind CSS, Framer Motion |
| State | React Context API (`AuthContext`, `ToastContext`) |
| Visualisasi | Chart.js, react-chartjs-2 |
| Backend | Java 17, Spring Boot 3.2.5, Spring Web, Spring Data JPA, Thymeleaf |
| Database | PostgreSQL 15 |
| Build | Maven, Vite |

---

## 📁 Struktur Proyek

```text
Satset-Project/
├── README.md
├── package.json           # Root npm scripts untuk dev dan build
├── pom.xml                # Maven Spring Boot project
├── mvnw, mvnw.cmd         # Maven wrapper
├── run-mvnw.js            # Helper menjalankan Maven dari script npm root
├── frontend/              # React + TypeScript aplikasi
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/    # Reusable UI component
│       ├── context/       # AuthContext, ToastContext
│       ├── hooks/         # Hook custom
│       ├── layouts/       # Layout halaman
│       ├── pages/         # Halaman aplikasi
│       ├── routes/        # Routing dan proteksi halaman
│       ├── services/      # API service wrapper
│       ├── styles/        # CSS design system
│       ├── types/         # TypeScript interface/tipe
│       └── utils/         # Utility helper
└── src/main/              # Spring Boot backend
    ├── java/              # Sumber kode backend
    │   └── com/
    └── resources/         # Konfigurasi, template, static assets
```

---

## 🚀 Persiapan dan Jalankan

### Prasyarat
- Node.js v18+
- Java JDK 17+
- PostgreSQL 15+
- Maven (opsional, karena wrapper tersedia)

### 1. Setup Database

Buat database PostgreSQL:

```sql
CREATE DATABASE satset_db;
```

### 2. Konfigurasi Backend

Edit `src/main/resources/application.properties` jika diperlukan:

```properties
spring.datasource.url=jdbc:postgresql://127.0.0.1:5432/satset_db
spring.datasource.username=postgres
spring.datasource.password=123159
```

### 3. Install Dependensi Frontend

```bash
cd frontend
npm install
```

### 4. Jalankan Backend

Dari direktori root:

```bash
./mvnw spring-boot:run
```

Atau jika menggunakan Windows PowerShell:

```powershell
./mvnw.cmd spring-boot:run
```

Alternatif menggunakan script npm root:

```bash
npm run dev:backend
```

Backend tersedia di `http://localhost:8080`.

### 5. Jalankan Frontend

```bash
cd frontend
npm run dev
```

Frontend tersedia di `http://localhost:5173`.

> Jika `concurrently` terpasang, root script `npm run dev` dapat menjalankan backend dan frontend bersamaan.

---

## 📦 Skrip Penting

| Perintah | Deskripsi |
|---|---|
| `npm run dev:frontend` | Jalankan frontend React |
| `npm run dev:backend` | Jalankan backend Spring Boot |
| `npm run build:frontend` | Build frontend production |
| `npm run build:backend` | Build backend Maven tanpa test |
| `npm run build` | Build frontend lalu backend |
| `npm run lint` (frontend) | Periksa kode React/TypeScript |

---

## 📌 Konfigurasi Backend yang Digunakan

Lokasi: `src/main/resources/application.properties`

Pengaturan koneksi database default saat ini:

```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://127.0.0.1:5432/satset_db
spring.datasource.username=postgres
spring.datasource.password=123159
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

---

## 📡 API dan Routing Umum

Backend menyediakan endpoint REST, sedangkan frontend menggunakan React dan routing client-side.

Contoh endpoint yang umum digunakan:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/laporan`
- `POST /api/laporan`
- `PUT /api/laporan/{id}/status`
- `GET /api/antrean`
- `POST /api/antrean`

---

## 🧩 Catatan Pengembangan

- `frontend/src/context/` berisi context untuk autentikasi dan toast.
- `frontend/src/services/` mengelola panggilan API ke backend.
- `frontend/src/pages/` menampung halaman utama seperti `Home`, `Queue`, `ReportFeed`, `AdminDashboard`, `Notifications`, dan `Account`.
- `spring.jpa.hibernate.ddl-auto=update` memudahkan sinkronisasi model ke database saat pengembangan tetapi tidak direkomendasikan di produksi.

---

## 📌 Referensi Struktur Frontend

- `frontend/src/pages/` — halaman aplikasi utama
- `frontend/src/components/` — komponen UI reusable
- `frontend/src/routes/` — proteksi route dan router utama
- `frontend/src/styles/` — token, layout, komponen, dan print style
- `frontend/src/types/` — tipe TypeScript

---

## 📌 Lisensi
Proyek mengikuti lisensi yang ditentukan di file `LICENSE`.
