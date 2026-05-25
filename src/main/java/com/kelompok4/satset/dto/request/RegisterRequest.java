package com.kelompok4.satset.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String nik;
    private String namaLengkap;
    private String username;
    private String email;
    private String password;
    private String noTelepon;
    private String alamat;
}
