package com.kelompok4.satset.repository;

import com.kelompok4.satset.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByNik(String nik);
    Optional<User> findByEmail(String email);
}
