package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.model.ContactMessage;
import com.kelompok4.satset.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ContactMessageApiController {
    
    private final ContactMessageService contactMessageService;
    
    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(contactMessageService.getAllMessages());
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<ContactMessage>> getUnreadMessages() {
        return ResponseEntity.ok(contactMessageService.getUnreadMessages());
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = Map.of(
            "total", contactMessageService.getTotalMessages(),
            "unread", contactMessageService.getUnreadCount()
        );
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ContactMessage> getMessageById(@PathVariable Long id) {
        return contactMessageService.getMessageById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> submitMessage(@RequestBody ContactMessage message) {
        try {
            ContactMessage saved = contactMessageService.saveMessage(message);
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Message sent successfully",
                "id", saved.getId()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> error = Map.of(
                "success", false,
                "message", "Failed to send message: " + e.getMessage()
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<ContactMessage> markAsRead(@PathVariable Long id) {
        try {
            ContactMessage message = contactMessageService.markAsRead(id);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        contactMessageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
