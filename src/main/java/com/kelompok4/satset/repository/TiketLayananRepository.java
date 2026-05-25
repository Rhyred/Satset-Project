package com.kelompok4.satset.repository;

import com.kelompok4.satset.model.TiketLayanan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TiketLayananRepository extends JpaRepository<TiketLayanan, Long> {
    Optional<TiketLayanan> findByNomorAntrian(String nomorAntrian);
}
