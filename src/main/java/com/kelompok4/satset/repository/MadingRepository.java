package com.kelompok4.satset.repository;

import com.kelompok4.satset.model.Mading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MadingRepository extends JpaRepository<Mading, Long> {
    List<Mading> findByIsPublishedTrueOrderByCreatedAtDesc();
}
