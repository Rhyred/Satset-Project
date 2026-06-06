package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.dto.response.ApiResponse;
import com.kelompok4.satset.model.TiketLayanan;
import com.kelompok4.satset.model.User;
import com.kelompok4.satset.service.TiketLayananService;
import jakarta.servlet.http.HttpSession;
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

    @GetMapping("/my")
    public ResponseEntity<List<TiketLayanan>> getMyTiket(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(tiketLayananService.getTiketByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TiketLayanan>> createTiket(@RequestBody TiketLayanan tiket, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            tiket.setPemohon(user);
        }
        TiketLayanan created = tiketLayananService.createTiket(tiket);
        return ResponseEntity.ok(ApiResponse.success("Antrean berhasil diajukan", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TiketLayanan> getTiketById(@PathVariable Long id) {
        return tiketLayananService.getTiketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TiketLayanan>> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String status = body.get("status");
        TiketLayanan updated = tiketLayananService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Status antrean diperbarui", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTiket(@PathVariable Long id) {
        tiketLayananService.deleteTiket(id);
        return ResponseEntity.ok(ApiResponse.success("Tiket berhasil dihapus", null));
    }
}
