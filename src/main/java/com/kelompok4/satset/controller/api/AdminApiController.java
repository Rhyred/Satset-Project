package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.model.Admin;
import com.kelompok4.satset.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class AdminApiController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<Admin>> getAll() {
        return ResponseEntity.ok(adminService.getAll());
    }

    @PostMapping
    public ResponseEntity<Admin> create(@RequestBody Admin entity) {
        return ResponseEntity.ok(adminService.create(entity));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getById(@PathVariable Long id) {
        return adminService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
