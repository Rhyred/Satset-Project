package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.model.Notifikasi;
import com.kelompok4.satset.service.NotifikasiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifikasi")
@RequiredArgsConstructor
public class NotifikasiApiController {

    private final NotifikasiService notifikasiService;

    @GetMapping
    public ResponseEntity<List<Notifikasi>> getAll() {
        return ResponseEntity.ok(notifikasiService.getAll());
    }

    @PostMapping
    public ResponseEntity<Notifikasi> create(@RequestBody Notifikasi entity) {
        return ResponseEntity.ok(notifikasiService.create(entity));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notifikasi> getById(@PathVariable Long id) {
        return notifikasiService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
