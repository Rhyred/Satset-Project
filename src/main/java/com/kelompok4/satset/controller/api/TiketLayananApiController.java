package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.model.TiketLayanan;
import com.kelompok4.satset.service.TiketLayananService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/antrean")
@RequiredArgsConstructor
public class TiketLayananApiController {

    private final TiketLayananService tiketLayananService;

    @GetMapping
    public ResponseEntity<List<TiketLayanan>> getAllTiket() {
        return ResponseEntity.ok(tiketLayananService.getAllTiket());
    }

    @PostMapping
    public ResponseEntity<TiketLayanan> createTiket(@RequestBody TiketLayanan tiket) {
        return ResponseEntity.ok(tiketLayananService.createTiket(tiket));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TiketLayanan> getTiketById(@PathVariable Long id) {
        return tiketLayananService.getTiketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
