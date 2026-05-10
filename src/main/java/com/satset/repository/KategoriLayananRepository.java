package com.satset.repository;

import com.satset.model.KategoriLayanan;
import com.satset.model.TipeLayanan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KategoriLayananRepository extends JpaRepository<KategoriLayanan, Long> {
    List<KategoriLayanan> findByTipeLayanan(TipeLayanan tipeLayanan);
}
