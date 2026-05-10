package com.satset.controller;

import com.satset.model.AntrianBirokrasi;
import com.satset.model.CommunityFeed;
import com.satset.model.LaporanUser;
import com.satset.service.AntrianService;
import com.satset.service.FeedService;
import com.satset.service.LaporanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApiController {

    private final AntrianService antrianService;
    private final LaporanService laporanService;
    private final FeedService feedService;

    @PostMapping("/tickets/bureaucracy")
    public ResponseEntity<AntrianBirokrasi> ambilAntrian(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        Long kategoriId = Long.valueOf(payload.get("kategoriId").toString());
        String jenisSurat = payload.get("jenisSurat").toString();
        
        AntrianBirokrasi antrian = antrianService.ambilAntrian(userId, kategoriId, jenisSurat);
        return ResponseEntity.ok(antrian);
    }

    @PostMapping("/tickets/complaints")
    public ResponseEntity<LaporanUser> buatLaporan(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        Long kategoriId = Long.valueOf(payload.get("kategoriId").toString());
        String judul = payload.get("judul").toString();
        String deskripsi = payload.get("deskripsi").toString();
        String lampiranUrl = payload.get("lampiranUrl") != null ? payload.get("lampiranUrl").toString() : null;

        LaporanUser laporan = laporanService.buatLaporan(userId, kategoriId, judul, deskripsi, lampiranUrl);
        return ResponseEntity.ok(laporan);
    }

    @GetMapping("/pengajuan/{userId}")
    public ResponseEntity<List<LaporanUser>> getRiwayatPengajuan(@PathVariable Long userId) {
        return ResponseEntity.ok(laporanService.getRiwayatLaporanUser(userId));
    }

    @PutMapping("/tickets/{id}/resolve")
    public ResponseEntity<String> resolveTicket(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Long adminId = Long.valueOf(payload.get("adminId").toString());
        String status = payload.get("status").toString();
        String catatan = payload.get("catatan").toString();

        laporanService.updateStatusLaporan(id, adminId, status, catatan);
        return ResponseEntity.ok("Success");
    }

    @GetMapping("/feed")
    public ResponseEntity<List<CommunityFeed>> getFeeds() {
        return ResponseEntity.ok(feedService.getAllFeed());
    }
}
