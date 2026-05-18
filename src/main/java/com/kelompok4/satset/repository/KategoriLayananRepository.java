package com.kelompok4.satset.repository;

import com.kelompok4.satset.model.KategoriLayanan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KategoriLayananRepository extends JpaRepository<KategoriLayanan, Long> {
}
