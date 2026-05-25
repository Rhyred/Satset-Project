package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.model.Mading;
import com.kelompok4.satset.service.MadingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mading")
@RequiredArgsConstructor
public class MadingApiController {

    private final MadingService madingService;

    @GetMapping
    public ResponseEntity<List<Mading>> getPublishedMading() {
        return ResponseEntity.ok(madingService.getPublishedMading());
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Mading>> getAllMading() {
        return ResponseEntity.ok(madingService.getAllMading());
    }

    @PostMapping
    public ResponseEntity<Mading> createMading(@RequestBody Mading mading) {
        return ResponseEntity.ok(madingService.createMading(mading));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mading> getMadingById(@PathVariable Long id) {
        return madingService.getMadingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
