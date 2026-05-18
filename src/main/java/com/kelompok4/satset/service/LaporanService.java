package com.kelompok4.satset.service;

import com.kelompok4.satset.model.Laporan;
import com.kelompok4.satset.repository.LaporanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LaporanService {

    private final LaporanRepository laporanRepository;

    public List<Laporan> getAllLaporan() {
        return laporanRepository.findAll();
    }

    public Optional<Laporan> getLaporanById(Long id) {
        return laporanRepository.findById(id);
    }

    public Laporan createLaporan(Laporan laporan) {
        laporan.setStatusLaporan("DITERIMA");
        return laporanRepository.save(laporan);
    }
}
