package com.satset.repository;

import com.satset.model.LaporanUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LaporanUserRepository extends JpaRepository<LaporanUser, Long> {
    List<LaporanUser> findByUser_IdUserOrderByCreatedAtDesc(Long userId);
    List<LaporanUser> findAllByOrderByCreatedAtDesc();
}
