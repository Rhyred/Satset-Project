package com.satset.service;

import com.satset.model.LaporanUser;

import java.util.List;

public interface LaporanService {
    LaporanUser buatLaporan(Long userId, Long kategoriId, String judul, String deskripsi, String lampiranUrl);
    List<LaporanUser> getRiwayatLaporanUser(Long userId);
    List<LaporanUser> getAllLaporan();
    void updateStatusLaporan(Long laporanId, Long adminId, String status, String catatanAdmin);
}
