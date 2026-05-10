package com.satset.service;

import com.satset.model.AntrianBirokrasi;

import java.util.List;

public interface AntrianService {
    AntrianBirokrasi ambilAntrian(Long userId, Long kategoriId, String jenisSurat);
    List<AntrianBirokrasi> getRiwayatAntrianUser(Long userId);
}
