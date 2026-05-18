package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.model.Laporan;
import com.kelompok4.satset.service.LaporanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laporan")
@RequiredArgsConstructor
public class LaporanApiController {

    private final LaporanService laporanService;

    @GetMapping
    public ResponseEntity<List<Laporan>> getAllLaporan() {
        return ResponseEntity.ok(laporanService.getAllLaporan());
    }

    @PostMapping
    public ResponseEntity<Laporan> createLaporan(@RequestBody Laporan laporan) {
        return ResponseEntity.ok(laporanService.createLaporan(laporan));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Laporan> getLaporanById(@PathVariable Long id) {
        return laporanService.getLaporanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
