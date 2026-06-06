package com.kelompok4.satset.service;

import com.kelompok4.satset.exception.BadRequestException;
import com.kelompok4.satset.exception.ResourceNotFoundException;
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
        if (mading.getJudul() == null || mading.getJudul().isBlank()) {
            throw new BadRequestException("Judul mading tidak boleh kosong");
        }
        if (mading.getKonten() == null || mading.getKonten().isBlank()) {
            throw new BadRequestException("Konten mading tidak boleh kosong");
        }
        if (mading.getIsPublished() == null) {
            mading.setIsPublished(true);
        }
        return madingRepository.save(mading);
    }

    public Mading updateMading(Long id, Mading updated) {
        Mading mading = madingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mading", id));
        if (updated.getJudul() != null) mading.setJudul(updated.getJudul());
        if (updated.getKonten() != null) mading.setKonten(updated.getKonten());
        if (updated.getJenisInformasi() != null) mading.setJenisInformasi(updated.getJenisInformasi());
        if (updated.getIsPublished() != null) mading.setIsPublished(updated.getIsPublished());
        return madingRepository.save(mading);
    }

    public void deleteMading(Long id) {
        if (!madingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Mading", id);
        }
        madingRepository.deleteById(id);
    }
}
