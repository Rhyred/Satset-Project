package com.kelompok4.satset.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalLaporan;
    private long laporanDiterima;
    private long laporanDiproses;
    private long laporanSelesai;
    private long laporanDitolak;
    private long totalAntrean;
    private long antreanMenunggu;
    private long antreanSelesai;
    private long totalMading;
    private long totalNotifikasi;
}
