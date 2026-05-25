package com.kelompok4.satset.service;

import com.kelompok4.satset.model.User;
import com.kelompok4.satset.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByNik(String nik) {
        return userRepository.findByNik(nik);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setNamaLengkap(userDetails.getNamaLengkap());
        user.setNoTelepon(userDetails.getNoTelepon());
        user.setAlamat(userDetails.getAlamat());
        if (userDetails.getEmail() != null && !userDetails.getEmail().isEmpty()) {
            user.setEmail(userDetails.getEmail());
        }
        return userRepository.save(user);
    }
}
