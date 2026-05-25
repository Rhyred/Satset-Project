package com.kelompok4.satset.service;

import com.kelompok4.satset.model.Mading;
import com.kelompok4.satset.repository.MadingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MadingService {

    private final MadingRepository madingRepository;

    public List<Mading> getPublishedMading() {
        return madingRepository.findByIsPublishedTrueOrderByCreatedAtDesc();
    }
    
    public List<Mading> getAllMading() {
        return madingRepository.findAll();
    }

    public Optional<Mading> getMadingById(Long id) {
        return madingRepository.findById(id);
    }

    public Mading createMading(Mading mading) {
        return madingRepository.save(mading);
    }
}
