package com.kelompok4.satset.service;

import com.kelompok4.satset.model.TiketLayanan;
import com.kelompok4.satset.repository.TiketLayananRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TiketLayananService {

    private final TiketLayananRepository tiketLayananRepository;

    public List<TiketLayanan> getAllTiket() {
        return tiketLayananRepository.findAll();
    }

    public Optional<TiketLayanan> getTiketById(Long id) {
        return tiketLayananRepository.findById(id);
    }

    public TiketLayanan createTiket(TiketLayanan tiket) {
        tiket.setWaktuPengajuan(LocalDateTime.now());
        tiket.setStatusAntrian("MENUNGGU");
        // Generate random ticket number for mockup
        tiket.setNomorAntrian("A-" + String.format("%03d", (int)(Math.random() * 999) + 1));
        return tiketLayananRepository.save(tiket);
    }
}
