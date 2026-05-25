package com.kelompok4.satset.repository;

import com.kelompok4.satset.model.TindakLanjutLaporan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TindakLanjutLaporanRepository extends JpaRepository<TindakLanjutLaporan, Long> {
}
