package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.dto.response.ApiResponse;
import com.kelompok4.satset.model.Notifikasi;
import com.kelompok4.satset.model.User;
import com.kelompok4.satset.service.NotifikasiService;
import jakarta.servlet.http.HttpSession;
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

    @GetMapping("/my")
    public ResponseEntity<List<Notifikasi>> getMyNotifikasi(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(notifikasiService.getByUserId(user.getId()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body(ApiResponse.error("Belum login"));
        return ResponseEntity.ok(ApiResponse.success(notifikasiService.getUnreadCount(user.getId())));
    }

    @PostMapping
    public ResponseEntity<Notifikasi> create(@RequestBody Notifikasi entity) {
        return ResponseEntity.ok(notifikasiService.create(entity));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notifikasi>> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Notifikasi dibaca", notifikasiService.markAsRead(id)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notifikasi> getById(@PathVariable Long id) {
        return notifikasiService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        notifikasiService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Notifikasi dihapus", null));
    }
}
