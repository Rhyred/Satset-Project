package com.satset.service.impl;

import com.satset.model.AntrianBirokrasi;
import com.satset.model.KategoriLayanan;
import com.satset.model.User;
import com.satset.repository.AntrianBirokrasiRepository;
import com.satset.repository.KategoriLayananRepository;
import com.satset.repository.UserRepository;
import com.satset.service.AntrianService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AntrianServiceImpl implements AntrianService {

    private final AntrianBirokrasiRepository antrianRepository;
    private final UserRepository userRepository;
    private final KategoriLayananRepository kategoriRepository;

    @Override
    public AntrianBirokrasi ambilAntrian(Long userId, Long kategoriId, String jenisSurat) {
        User user = userRepository.findById(userId).orElseThrow();
        KategoriLayanan kategori = kategoriRepository.findById(kategoriId).orElseThrow();

        AntrianBirokrasi antrian = new AntrianBirokrasi();
        antrian.setUser(user);
        antrian.setKategoriLayanan(kategori);
        antrian.setJenisSurat(jenisSurat);
        antrian.setStatusAntrian("MENUNGGU");
        antrian.setWaktuPengajuan(LocalDateTime.now());
        
        // Simple logic for queue number
        String prefix = kategori.getNamaKategori().toUpperCase().substring(0, 3);
        String randomSuffix = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        antrian.setNomorAntrian(prefix + "-" + randomSuffix);

        return antrianRepository.save(antrian);
    }

    @Override
    public List<AntrianBirokrasi> getRiwayatAntrianUser(Long userId) {
        return antrianRepository.findByUser_IdUserOrderByWaktuPengajuanDesc(userId);
    }
}
