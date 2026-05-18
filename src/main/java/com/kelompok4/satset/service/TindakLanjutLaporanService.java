package com.kelompok4.satset.service;

import com.kelompok4.satset.model.TindakLanjutLaporan;
import com.kelompok4.satset.repository.TindakLanjutLaporanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TindakLanjutLaporanService {

    private final TindakLanjutLaporanRepository tindakLanjutLaporanRepository;

    public List<TindakLanjutLaporan> getAll() {
        return tindakLanjutLaporanRepository.findAll();
    }

    public Optional<TindakLanjutLaporan> getById(Long id) {
        return tindakLanjutLaporanRepository.findById(id);
    }

    public TindakLanjutLaporan create(TindakLanjutLaporan entity) {
        return tindakLanjutLaporanRepository.save(entity);
    }
}
