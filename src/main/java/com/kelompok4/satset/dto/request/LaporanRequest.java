package com.kelompok4.satset.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LaporanRequest {
    private String judulLaporan;
    private String deskripsi;
    private String lampiranUrl;
    private Long kategoriId;
}
