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
    }
}
