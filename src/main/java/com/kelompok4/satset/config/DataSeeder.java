package com.kelompok4.satset.config;

import com.kelompok4.satset.model.*;
import com.kelompok4.satset.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final KategoriLayananRepository kategoriLayananRepository;
    private final MadingRepository madingRepository;
    private final LaporanRepository laporanRepository;
    private final TiketLayananRepository tiketLayananRepository;
    private final TindakLanjutLaporanRepository tindakLanjutLaporanRepository;

    @Override
    public void run(String... args) {
        // Seed Admin if not exists
        if (userRepository.findByEmail("admin@satset.id").isEmpty()) {
            User admin = new User();
            admin.setNik("3273000000000001");
            admin.setNamaLengkap("Administrator SatSet");
            admin.setUsername("admin");
            admin.setEmail("admin@satset.id");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            admin.setNoTelepon("081200000001");
            admin.setAlamat("Kantor Kelurahan SatSet");
            userRepository.save(admin);
        }

        // Seed demo User if not exists
        if (userRepository.findByEmail("warga@satset.id").isEmpty()) {
            User warga = new User();
            warga.setNik("3273010101010001");
            warga.setNamaLengkap("Warga Teladan");
            warga.setUsername("warga");
            warga.setEmail("warga@satset.id");
            warga.setPassword("warga123");
            warga.setRole("USER");
            warga.setNoTelepon("081200000002");
            warga.setAlamat("Jl. Contoh No. 1, Bandung");
            userRepository.save(warga);
        }

        // Seed Alsani (New Admin Demo)
        if (userRepository.findByEmail("alsani@satset.id").isEmpty()) {
            User alsani = new User();
            alsani.setNik("3273010101010002");
            alsani.setNamaLengkap("Alsani");
            alsani.setUsername("alsani");
            alsani.setEmail("alsani@satset.id");
            alsani.setPassword("password123");
            alsani.setRole("ADMIN");
            alsani.setNoTelepon("081200000003");
            alsani.setAlamat("Bandung");
            userRepository.save(alsani);
        }

        // Seed Budi (New Warga Demo)
        if (userRepository.findByEmail("budi@satset.id").isEmpty()) {
            User budi = new User();
            budi.setNik("3273010101010003");
            budi.setNamaLengkap("Budiman");
            budi.setUsername("budi");
            budi.setEmail("budi@satset.id");
            budi.setPassword("budi123");
            budi.setRole("USER");
            budi.setNoTelepon("081200000004");
            budi.setAlamat("Jakarta");
            userRepository.save(budi);
        }

        // Seed Kategori Layanan if empty
        if (kategoriLayananRepository.count() == 0) {
            KategoriLayanan birokrasi = new KategoriLayanan();
            birokrasi.setNamaKategori("Pelayanan Kependudukan");
            birokrasi.setTipe("BIROKRASI");
            kategoriLayananRepository.save(birokrasi);

            KategoriLayanan pengaduan = new KategoriLayanan();
            pengaduan.setNamaKategori("Pengaduan Fasilitas Publik");
            pengaduan.setTipe("PENGADUAN");
            kategoriLayananRepository.save(pengaduan);

            KategoriLayanan perizinan = new KategoriLayanan();
            perizinan.setNamaKategori("Layanan Perizinan");
            perizinan.setTipe("BIROKRASI");
            kategoriLayananRepository.save(perizinan);
        }

        // Seed Mading if empty
        if (madingRepository.count() == 0) {
            Mading m1 = new Mading();
            m1.setJudul("Jadwal Pelayanan Hari Libur Nasional");
            m1.setKonten("Diberitahukan kepada seluruh warga bahwa pelayanan kantor kelurahan pada tanggal 1 Juni 2026 ditiadakan sehubungan dengan Hari Lahir Pancasila. Pelayanan akan kembali normal pada tanggal 2 Juni 2026.");
            m1.setJenisInformasi("PENTING");
            m1.setIsPublished(true);
            madingRepository.save(m1);

            Mading m2 = new Mading();
            m2.setJudul("Program Vaksinasi Gratis di Puskesmas");
            m2.setKonten("Puskesmas Kelurahan SatSet mengadakan program vaksinasi gratis untuk warga yang belum mendapatkan vaksin booster. Kegiatan berlangsung setiap hari Sabtu mulai pukul 08.00 - 12.00 WIB. Silakan bawa KTP dan kartu vaksin sebelumnya.");
            m2.setJenisInformasi("INFO_WARGA");
            m2.setIsPublished(true);
            madingRepository.save(m2);

            Mading m3 = new Mading();
            m3.setJudul("Pengumuman: Sistem Antrean Online Baru");
            m3.setKonten("Mulai bulan ini, seluruh layanan administrasi kependudukan di kantor kelurahan akan menggunakan sistem antrean online melalui aplikasi SATSET Super-App. Warga dapat mengambil nomor antrean dari rumah dan datang sesuai jadwal yang ditentukan.");
            m3.setJenisInformasi("PENGUMUMAN");
            m3.setIsPublished(true);
            madingRepository.save(m3);
        }

        // Get admin and warga objects for foreign key references
        User adminUser = userRepository.findByEmail("admin@satset.id").orElse(null);
        User wargaUser = userRepository.findByEmail("warga@satset.id").orElse(null);
        KategoriLayanan birokrasiCat = kategoriLayananRepository.findAll().stream().filter(c -> "BIROKRASI".equals(c.getTipe())).findFirst().orElse(null);
        KategoriLayanan pengaduanCat = kategoriLayananRepository.findAll().stream().filter(c -> "PENGADUAN".equals(c.getTipe())).findFirst().orElse(null);

        // Seed Laporan and TindakLanjut if not already present
        boolean hasDemoLaporan = laporanRepository.findAll().stream()
                .anyMatch(l -> "Jalan Berlubang di Jl. Sudirman".equals(l.getJudulLaporan()));
        if (!hasDemoLaporan && wargaUser != null && pengaduanCat != null) {
            // Laporan 1: Selesai
            Laporan l1 = new Laporan();
            l1.setJudulLaporan("Jalan Berlubang di Jl. Sudirman");
            l1.setDeskripsi("Ada lubang yang cukup besar di tengah jalan Sudirman depan ruko No. 42. Sangat membahayakan pengendara motor saat malam hari.");
            l1.setStatusLaporan("SELESAI");
            l1.setPelapor(wargaUser);
            l1.setKategori(pengaduanCat);
            l1 = laporanRepository.save(l1);

            TindakLanjutLaporan t1_1 = new TindakLanjutLaporan();
            t1_1.setCatatanAdmin("Laporan diterima dan diteruskan ke Dinas Pekerjaan Umum.");
            t1_1.setWaktuTindak(java.time.LocalDateTime.now().minusDays(2));
            t1_1.setLaporan(l1);
            t1_1.setAdmin(adminUser);
            tindakLanjutLaporanRepository.save(t1_1);

            TindakLanjutLaporan t1_2 = new TindakLanjutLaporan();
            t1_2.setCatatanAdmin("Petugas mulai menambal lubang jalan menggunakan aspal.");
            t1_2.setWaktuTindak(java.time.LocalDateTime.now().minusDays(1));
            t1_2.setLaporan(l1);
            t1_2.setAdmin(adminUser);
            tindakLanjutLaporanRepository.save(t1_2);

            TindakLanjutLaporan t1_3 = new TindakLanjutLaporan();
            t1_3.setCatatanAdmin("Jalan selesai diperbaiki dan sudah rata kembali.");
            t1_3.setWaktuTindak(java.time.LocalDateTime.now());
            t1_3.setLaporan(l1);
            t1_3.setAdmin(adminUser);
            tindakLanjutLaporanRepository.save(t1_3);

            // Laporan 2: Diproses
            Laporan l2 = new Laporan();
            l2.setJudulLaporan("Lampu Penerangan Jalan Padam");
            l2.setDeskripsi("Lampu jalan di RT 03/RW 04 mati total sejak 3 hari lalu. Kondisi lingkungan menjadi sangat gelap saat malam.");
            l2.setStatusLaporan("DIPROSES");
            l2.setPelapor(wargaUser);
            l2.setKategori(pengaduanCat);
            l2 = laporanRepository.save(l2);

            TindakLanjutLaporan t2_1 = new TindakLanjutLaporan();
            t2_1.setCatatanAdmin("Laporan dikonfirmasi. Koordinasi dengan PLN sedang berjalan.");
            t2_1.setWaktuTindak(java.time.LocalDateTime.now().minusHours(12));
            t2_1.setLaporan(l2);
            t2_1.setAdmin(adminUser);
            tindakLanjutLaporanRepository.save(t2_1);

            // Laporan 3: Baru (Diterima)
            Laporan l3 = new Laporan();
            l3.setJudulLaporan("Tumpukan Sampah Liar di Gang Damai");
            l3.setDeskripsi("Ada warga luar yang membuang tumpukan sampah plastik di pojok gang sehingga menimbulkan bau tidak sedap.");
            l3.setStatusLaporan("DITERIMA");
            l3.setPelapor(wargaUser);
            l3.setKategori(pengaduanCat);
            laporanRepository.save(l3);
        }

        // Seed TiketLayanan if specific demo ticket is not present
        if (tiketLayananRepository.findByNomorAntrian("A-2505-001").isEmpty() && wargaUser != null && birokrasiCat != null) {
            // Tiket 1: Selesai
            TiketLayanan tik1 = new TiketLayanan();
            tik1.setNomorAntrian("A-2505-001");
            tik1.setJenisSurat("Pelayanan Kependudukan - Pembuatan Kartu Keluarga");
            tik1.setStatusAntrian("SELESAI");
            tik1.setWaktuPengajuan(java.time.LocalDateTime.now().minusDays(1));
            tik1.setPemohon(wargaUser);
            tik1.setKategori(birokrasiCat);
            tiketLayananRepository.save(tik1);

            // Tiket 2: Dipanggil
            TiketLayanan tik2 = new TiketLayanan();
            tik2.setNomorAntrian("A-2505-002");
            tik2.setJenisSurat("Pelayanan Kependudukan - Perekaman KTP-el");
            tik2.setStatusAntrian("DIPANGGIL");
            tik2.setWaktuPengajuan(java.time.LocalDateTime.now());
            tik2.setPemohon(wargaUser);
            tik2.setKategori(birokrasiCat);
            tiketLayananRepository.save(tik2);

            // Tiket 3: Menunggu
            TiketLayanan tik3 = new TiketLayanan();
            tik3.setNomorAntrian("B-2505-001");
            tik3.setJenisSurat("Layanan Perizinan - Surat Keterangan Usaha (SKU)");
            tik3.setStatusAntrian("MENUNGGU");
            tik3.setWaktuPengajuan(java.time.LocalDateTime.now().plusHours(2));
            tik3.setPemohon(wargaUser);
            tik3.setKategori(birokrasiCat);
            tiketLayananRepository.save(tik3);
        }
    }
}
