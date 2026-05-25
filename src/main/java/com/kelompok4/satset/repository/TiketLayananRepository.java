package com.kelompok4.satset.repository;

import com.kelompok4.satset.model.TiketLayanan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TiketLayananRepository extends JpaRepository<TiketLayanan, Long> {
    Optional<TiketLayanan> findByNomorAntrian(String nomorAntrian);
    List<TiketLayanan> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<TiketLayanan> findByStatusAntrian(String statusAntrian);
    List<TiketLayanan> findAllByOrderByCreatedAtDesc();
    long countByStatusAntrian(String statusAntrian);
    long countByNomorAntrianStartingWith(String prefix);
}
