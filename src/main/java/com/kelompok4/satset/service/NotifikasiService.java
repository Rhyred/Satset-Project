package com.kelompok4.satset.service;

import com.kelompok4.satset.exception.ResourceNotFoundException;
import com.kelompok4.satset.model.Notifikasi;
import com.kelompok4.satset.model.User;
import com.kelompok4.satset.repository.NotifikasiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotifikasiService {

    private final NotifikasiRepository notifikasiRepository;

    public List<Notifikasi> getAll() {
        return notifikasiRepository.findAll();
    }

    public List<Notifikasi> getByUserId(Long userId) {
        return notifikasiRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notifikasiRepository.countByUserIdAndIsReadFalse(userId);
    }

    public Optional<Notifikasi> getById(Long id) {
        return notifikasiRepository.findById(id);
    }

    public Notifikasi create(Notifikasi entity) {
        return notifikasiRepository.save(entity);
    }

    public Notifikasi createForUser(String pesan, User user) {
        Notifikasi notif = new Notifikasi();
        notif.setPesan(pesan);
        notif.setIsRead(false);
        notif.setUser(user);
        return notifikasiRepository.save(notif);
    }

    public Notifikasi markAsRead(Long id) {
        Notifikasi notif = notifikasiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notifikasi", id));
        notif.setIsRead(true);
        return notifikasiRepository.save(notif);
    }

    public void delete(Long id) {
        if (!notifikasiRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notifikasi", id);
        }
        notifikasiRepository.deleteById(id);
    }
}
