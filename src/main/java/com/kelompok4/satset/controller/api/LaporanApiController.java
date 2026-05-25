package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.dto.response.ApiResponse;
import com.kelompok4.satset.model.Laporan;
import com.kelompok4.satset.model.User;
import com.kelompok4.satset.service.LaporanService;
import com.kelompok4.satset.service.TindakLanjutLaporanService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laporan")
@RequiredArgsConstructor
public class LaporanApiController {

    private final LaporanService laporanService;
    private final TindakLanjutLaporanService tindakLanjutLaporanService;

    @GetMapping
    public ResponseEntity<List<Laporan>> getAllLaporan() {
        return ResponseEntity.ok(laporanService.getAllLaporan());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Laporan>> getLaporanByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(laporanService.getLaporanByUserId(userId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Laporan>> getMyLaporan(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(laporanService.getLaporanByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Laporan>> createLaporan(@RequestBody Laporan laporan, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            laporan.setPelapor(user);
        }
        Laporan created = laporanService.createLaporan(laporan);
        return ResponseEntity.ok(ApiResponse.success("Laporan berhasil dikirim", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Laporan> getLaporanById(@PathVariable Long id) {
        return laporanService.getLaporanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Laporan>> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body, HttpSession session) {
        String status = body.get("status");
        String catatan = body.get("catatan");
        
        Laporan updated = laporanService.updateStatus(id, status);
        
        if (catatan != null && !catatan.isBlank()) {
            User admin = (User) session.getAttribute("user");
            com.kelompok4.satset.model.TindakLanjutLaporan tindakLanjut = new com.kelompok4.satset.model.TindakLanjutLaporan();
            tindakLanjut.setLaporan(updated);
            tindakLanjut.setCatatanAdmin(catatan);
            tindakLanjut.setWaktuTindak(java.time.LocalDateTime.now());
            if (admin != null) {
                tindakLanjut.setAdmin(admin);
            }
            tindakLanjutLaporanService.create(tindakLanjut);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Status laporan diperbarui", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteLaporan(@PathVariable Long id) {
        laporanService.deleteLaporan(id);
        return ResponseEntity.ok(ApiResponse.success("Laporan berhasil dihapus", null));
    }
}
