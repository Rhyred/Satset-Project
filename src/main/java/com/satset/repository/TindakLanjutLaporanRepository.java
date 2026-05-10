package com.satset.repository;

import com.satset.model.TindakLanjutLaporan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TindakLanjutLaporanRepository extends JpaRepository<TindakLanjutLaporan, Long> {
    List<TindakLanjutLaporan> findByLaporanUser_IdOrderByIdTindakLanjutDesc(Long laporanId);
}
