package com.kelompok4.satset.service;

import com.kelompok4.satset.model.Admin;
import com.kelompok4.satset.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    public List<Admin> getAll() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getById(Long id) {
        return adminRepository.findById(id);
    }

    public Admin create(Admin entity) {
        return adminRepository.save(entity);
    }
}
