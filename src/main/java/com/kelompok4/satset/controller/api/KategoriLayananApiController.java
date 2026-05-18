package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.model.KategoriLayanan;
import com.kelompok4.satset.service.KategoriLayananService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kategori")
@RequiredArgsConstructor
public class KategoriLayananApiController {

    private final KategoriLayananService kategoriLayananService;

    @GetMapping
    public ResponseEntity<List<KategoriLayanan>> getAll() {
        return ResponseEntity.ok(kategoriLayananService.getAll());
    }

    @PostMapping
    public ResponseEntity<KategoriLayanan> create(@RequestBody KategoriLayanan entity) {
        return ResponseEntity.ok(kategoriLayananService.create(entity));
    }

    @GetMapping("/{id}")
    public ResponseEntity<KategoriLayanan> getById(@PathVariable Long id) {
        return kategoriLayananService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
