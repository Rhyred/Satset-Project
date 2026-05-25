package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.dto.request.LoginRequest;
import com.kelompok4.satset.dto.request.RegisterRequest;
import com.kelompok4.satset.dto.response.ApiResponse;
import com.kelompok4.satset.dto.response.UserResponse;
import com.kelompok4.satset.model.User;
import com.kelompok4.satset.service.AuthService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthApiController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(@RequestBody LoginRequest request, HttpSession session) {
        User user = authService.login(request);
        session.setAttribute("user", user);
        session.setAttribute("userId", user.getId());
        session.setAttribute("userRole", user.getRole());
        return ResponseEntity.ok(ApiResponse.success("Login berhasil", authService.toResponse(user)));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registrasi berhasil", authService.toResponse(user)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(ApiResponse.success("Logout berhasil", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Belum login"));
        }
        return ResponseEntity.ok(ApiResponse.success(authService.toResponse(user)));
    }
}
