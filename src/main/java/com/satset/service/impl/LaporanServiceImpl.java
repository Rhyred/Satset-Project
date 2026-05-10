package com.satset.service.impl;

import com.satset.model.Admin;
import com.satset.model.KategoriLayanan;
import com.satset.model.LaporanUser;
import com.satset.model.TindakLanjutLaporan;
import com.satset.model.User;
import com.satset.repository.AdminRepository;
import com.satset.repository.KategoriLayananRepository;
import com.satset.repository.LaporanUserRepository;
import com.satset.repository.TindakLanjutLaporanRepository;
import com.satset.repository.UserRepository;
import com.satset.service.LaporanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LaporanServiceImpl implements LaporanService {

    private final LaporanUserRepository laporanRepository;
    private final TindakLanjutLaporanRepository tindakLanjutRepository;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final KategoriLayananRepository kategoriRepository;

    @Override
    public LaporanUser buatLaporan(Long userId, Long kategoriId, String judul, String deskripsi, String lampiranUrl) {
        User user = userRepository.findById(userId).orElseThrow();
        KategoriLayanan kategori = kategoriRepository.findById(kategoriId).orElseThrow();

        LaporanUser laporan = new LaporanUser();
        laporan.setUser(user);
        laporan.setKategoriLayanan(kategori);
        laporan.setJudulLaporan(judul);
        laporan.setDeskripsi(deskripsi);
        laporan.setLampiranUrl(lampiranUrl);
        laporan.setStatusLaporan("MENUNGGU");

        return laporanRepository.save(laporan);
    }

    @Override
    public List<LaporanUser> getRiwayatLaporanUser(Long userId) {
        return laporanRepository.findByUser_IdUserOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<LaporanUser> getAllLaporan() {
        return laporanRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public void updateStatusLaporan(Long laporanId, Long adminId, String status, String catatanAdmin) {
        LaporanUser laporan = laporanRepository.findById(laporanId).orElseThrow();
        Admin admin = adminRepository.findById(adminId).orElseThrow();

        laporan.setStatusLaporan(status);
        laporanRepository.save(laporan);

        TindakLanjutLaporan tindakLanjut = new TindakLanjutLaporan();
        tindakLanjut.setLaporanUser(laporan);
        tindakLanjut.setAdmin(admin);
        tindakLanjut.setCatatanAdmin(catatanAdmin);
        tindakLanjut.setWaktuTindak(LocalDateTime.now());
        
        tindakLanjutRepository.save(tindakLanjut);
    }
}
