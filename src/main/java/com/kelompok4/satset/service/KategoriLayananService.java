package com.kelompok4.satset.service;

import com.kelompok4.satset.model.KategoriLayanan;
import com.kelompok4.satset.repository.KategoriLayananRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class KategoriLayananService {

    private final KategoriLayananRepository kategoriLayananRepository;

    public List<KategoriLayanan> getAll() {
        return kategoriLayananRepository.findAll();
    }

    public Optional<KategoriLayanan> getById(Long id) {
        return kategoriLayananRepository.findById(id);
    }

    public KategoriLayanan create(KategoriLayanan entity) {
        return kategoriLayananRepository.save(entity);
    }
}
