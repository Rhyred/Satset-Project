package com.kelompok4.satset.service;

import com.kelompok4.satset.exception.BadRequestException;
import com.kelompok4.satset.exception.ResourceNotFoundException;
import com.kelompok4.satset.model.Laporan;
import com.kelompok4.satset.model.User;
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
        return laporanRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Laporan> getLaporanByUserId(Long userId) {
        return laporanRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Laporan> getLaporanByStatus(String status) {
        return laporanRepository.findByStatusLaporan(status);
    }

    public Optional<Laporan> getLaporanById(Long id) {
        return laporanRepository.findById(id);
    }

    public Laporan createLaporan(Laporan laporan) {
        if (laporan.getJudulLaporan() == null || laporan.getJudulLaporan().isBlank()) {
            throw new BadRequestException("Judul laporan tidak boleh kosong");
        }
        if (laporan.getDeskripsi() == null || laporan.getDeskripsi().isBlank()) {
            throw new BadRequestException("Deskripsi tidak boleh kosong");
        }
        laporan.setStatusLaporan("DITERIMA");
        return laporanRepository.save(laporan);
    }

    public Laporan createLaporanForUser(String judulLaporan, String deskripsi, String lampiranUrl, Long kategoriId, User user) {
        if (judulLaporan == null || judulLaporan.isBlank()) {
            throw new BadRequestException("Judul laporan tidak boleh kosong");
        }
        if (deskripsi == null || deskripsi.isBlank()) {
            throw new BadRequestException("Deskripsi tidak boleh kosong");
        }
        Laporan laporan = new Laporan();
        laporan.setJudulLaporan(judulLaporan);
        laporan.setDeskripsi(deskripsi);
        laporan.setLampiranUrl(lampiranUrl);
        laporan.setStatusLaporan("DITERIMA");
        laporan.setPelapor(user);
        return laporanRepository.save(laporan);
    }

    public Laporan updateStatus(Long id, String status) {
        Laporan laporan = laporanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laporan", id));
        laporan.setStatusLaporan(status);
        return laporanRepository.save(laporan);
    }

    public void deleteLaporan(Long id) {
        if (!laporanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Laporan", id);
        }
        laporanRepository.deleteById(id);
    }
}
