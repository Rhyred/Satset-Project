package com.kelompok4.satset.service;

import com.kelompok4.satset.dto.response.DashboardStatsResponse;
import com.kelompok4.satset.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final LaporanRepository laporanRepository;
    private final TiketLayananRepository tiketLayananRepository;
    private final MadingRepository madingRepository;
    private final NotifikasiRepository notifikasiRepository;

    public DashboardStatsResponse getStats() {
        return DashboardStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalLaporan(laporanRepository.count())
                .laporanDiterima(laporanRepository.countByStatusLaporan("DITERIMA"))
                .laporanDiproses(laporanRepository.countByStatusLaporan("DIPROSES"))
                .laporanSelesai(laporanRepository.countByStatusLaporan("SELESAI"))
                .laporanDitolak(laporanRepository.countByStatusLaporan("DITOLAK"))
                .totalAntrean(tiketLayananRepository.count())
                .antreanMenunggu(tiketLayananRepository.countByStatusAntrian("MENUNGGU"))
                .antreanSelesai(tiketLayananRepository.countByStatusAntrian("SELESAI"))
                .totalMading(madingRepository.count())
                .totalNotifikasi(notifikasiRepository.count())
                .build();
    }
}
