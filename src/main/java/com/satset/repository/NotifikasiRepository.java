package com.satset.repository;

import com.satset.model.Notifikasi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotifikasiRepository extends JpaRepository<Notifikasi, Long> {
    List<Notifikasi> findByUser_IdUserOrderByIdNotifikasiDesc(Long userId);
}
