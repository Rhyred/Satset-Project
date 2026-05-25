package com.kelompok4.satset.dto.response;

import com.kelompok4.satset.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String nik;
    private String namaLengkap;
    private String username;
    private String email;
    private String role;
    private String noTelepon;
    private String alamat;
    private LocalDateTime createdAt;
}
