package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.model.TindakLanjutLaporan;
import com.kelompok4.satset.service.TindakLanjutLaporanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tindak-lanjut")
@RequiredArgsConstructor
public class TindakLanjutLaporanApiController {

    private final TindakLanjutLaporanService tindakLanjutLaporanService;

    @GetMapping
    public ResponseEntity<List<TindakLanjutLaporan>> getAll() {
        return ResponseEntity.ok(tindakLanjutLaporanService.getAll());
    }

    @PostMapping
    public ResponseEntity<TindakLanjutLaporan> create(@RequestBody TindakLanjutLaporan entity) {
        return ResponseEntity.ok(tindakLanjutLaporanService.create(entity));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TindakLanjutLaporan> getById(@PathVariable Long id) {
        return tindakLanjutLaporanService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
