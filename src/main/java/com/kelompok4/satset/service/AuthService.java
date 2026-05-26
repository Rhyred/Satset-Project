package com.kelompok4.satset.service;

import com.kelompok4.satset.dto.request.LoginRequest;
import com.kelompok4.satset.dto.request.RegisterRequest;
import com.kelompok4.satset.dto.response.UserResponse;
import com.kelompok4.satset.exception.BadRequestException;
import com.kelompok4.satset.exception.UnauthorizedException;
import com.kelompok4.satset.model.User;
import com.kelompok4.satset.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public User login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("Email tidak boleh kosong");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password tidak boleh kosong");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Email atau password salah"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new UnauthorizedException("Email atau password salah");
        }

        return user;
    }

    public User register(RegisterRequest request) {
        if (request.getNik() == null || request.getNik().isBlank()) {
            throw new BadRequestException("NIK tidak boleh kosong");
        }
        if (request.getNamaLengkap() == null || request.getNamaLengkap().isBlank()) {
            throw new BadRequestException("Nama lengkap tidak boleh kosong");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("Email tidak boleh kosong");
        }
        if (request.getPassword() == null || request.getPassword().length() < 4) {
            throw new BadRequestException("Password minimal 4 karakter");
        }
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new BadRequestException("Username tidak boleh kosong");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email sudah terdaftar");
        }
        if (userRepository.findByNik(request.getNik()).isPresent()) {
            throw new BadRequestException("NIK sudah terdaftar");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BadRequestException("Username sudah digunakan");
        }

        User user = new User();
        user.setNik(request.getNik());
        user.setNamaLengkap(request.getNamaLengkap());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole("USER");
        user.setNoTelepon(request.getNoTelepon());
        user.setAlamat(request.getAlamat());

        return userRepository.save(user);
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .nik(user.getNik())
                .namaLengkap(user.getNamaLengkap())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .noTelepon(user.getNoTelepon())
                .alamat(user.getAlamat())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
