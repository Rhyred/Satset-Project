package com.satset.repository;

import com.satset.model.AntrianBirokrasi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AntrianBirokrasiRepository extends JpaRepository<AntrianBirokrasi, Long> {
    List<AntrianBirokrasi> findByUser_IdUserOrderByWaktuPengajuanDesc(Long userId);
}
