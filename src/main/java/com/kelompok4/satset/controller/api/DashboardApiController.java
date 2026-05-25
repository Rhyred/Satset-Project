package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.dto.response.ApiResponse;
import com.kelompok4.satset.dto.response.DashboardStatsResponse;
import com.kelompok4.satset.model.Laporan;
import com.kelompok4.satset.model.TiketLayanan;
import com.kelompok4.satset.service.DashboardService;
import com.kelompok4.satset.service.LaporanService;
import com.kelompok4.satset.service.TiketLayananService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardApiController {

    private final DashboardService dashboardService;
    private final LaporanService laporanService;
    private final TiketLayananService tiketLayananService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStats()));
    }

    @GetMapping("/laporan-terbaru")
    public ResponseEntity<ApiResponse<List<Laporan>>> getLaporanTerbaru() {
        List<Laporan> all = laporanService.getAllLaporan();
        List<Laporan> recent = all.size() > 10 ? all.subList(0, 10) : all;
        return ResponseEntity.ok(ApiResponse.success(recent));
    }

    @GetMapping("/antrean-aktif")
    public ResponseEntity<ApiResponse<List<TiketLayanan>>> getAntreanAktif() {
        return ResponseEntity.ok(ApiResponse.success(tiketLayananService.getTiketByStatus("MENUNGGU")));
    }
}
