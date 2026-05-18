package com.kelompok4.satset.repository;

import com.kelompok4.satset.model.Laporan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LaporanRepository extends JpaRepository<Laporan, Long> {
    List<Laporan> findByStatusLaporan(String statusLaporan);
}
