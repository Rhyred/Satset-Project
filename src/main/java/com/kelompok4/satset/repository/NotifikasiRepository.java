package com.kelompok4.satset.repository;

import com.kelompok4.satset.model.Notifikasi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotifikasiRepository extends JpaRepository<Notifikasi, Long> {
    List<Notifikasi> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserIdAndIsReadFalse(Long userId);
}
