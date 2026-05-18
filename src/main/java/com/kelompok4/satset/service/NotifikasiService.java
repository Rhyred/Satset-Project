package com.kelompok4.satset.service;

import com.kelompok4.satset.model.Notifikasi;
import com.kelompok4.satset.repository.NotifikasiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotifikasiService {

    private final NotifikasiRepository notifikasiRepository;

    public List<Notifikasi> getAll() {
        return notifikasiRepository.findAll();
    }

    public Optional<Notifikasi> getById(Long id) {
        return notifikasiRepository.findById(id);
    }

    public Notifikasi create(Notifikasi entity) {
        return notifikasiRepository.save(entity);
    }
}
