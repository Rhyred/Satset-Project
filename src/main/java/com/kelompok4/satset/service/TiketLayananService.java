package com.kelompok4.satset.service;

import com.kelompok4.satset.exception.BadRequestException;
import com.kelompok4.satset.exception.ResourceNotFoundException;
import com.kelompok4.satset.model.TiketLayanan;
import com.kelompok4.satset.model.User;
import com.kelompok4.satset.repository.TiketLayananRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TiketLayananService {

    private final TiketLayananRepository tiketLayananRepository;

    public List<TiketLayanan> getAllTiket() {
        return tiketLayananRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<TiketLayanan> getTiketByUserId(Long userId) {
        return tiketLayananRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<TiketLayanan> getTiketByStatus(String status) {
        return tiketLayananRepository.findByStatusAntrian(status);
    }

    public Optional<TiketLayanan> getTiketById(Long id) {
        return tiketLayananRepository.findById(id);
    }

    public TiketLayanan createTiket(TiketLayanan tiket) {
        tiket.setWaktuPengajuan(LocalDateTime.now());
        tiket.setStatusAntrian("MENUNGGU");
        tiket.setNomorAntrian(generateNomorAntrian());
        return tiketLayananRepository.save(tiket);
    }

    public TiketLayanan createTiketForUser(String jenisSurat, User user) {
        if (jenisSurat == null || jenisSurat.isBlank()) {
            throw new BadRequestException("Jenis surat tidak boleh kosong");
        }
        TiketLayanan tiket = new TiketLayanan();
        tiket.setJenisSurat(jenisSurat);
        tiket.setWaktuPengajuan(LocalDateTime.now());
        tiket.setStatusAntrian("MENUNGGU");
        tiket.setNomorAntrian(generateNomorAntrian());
        tiket.setPemohon(user);
        return tiketLayananRepository.save(tiket);
    }

    public TiketLayanan updateStatus(Long id, String status) {
        TiketLayanan tiket = tiketLayananRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tiket Layanan", id));
        tiket.setStatusAntrian(status);
        return tiketLayananRepository.save(tiket);
    }

    public void deleteTiket(Long id) {
        if (!tiketLayananRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tiket Layanan", id);
        }
        tiketLayananRepository.deleteById(id);
    }

    private String generateNomorAntrian() {
        String prefix = "A-" + LocalDate.now().format(DateTimeFormatter.ofPattern("ddMM")) + "-";
        long count = tiketLayananRepository.count() + 1;
        return prefix + String.format("%03d", count);
    }
}
