package com.kelompok4.satset.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AntreanRequest {
    private String jenisSurat;
    private String keperluan;
    private Long kategoriId;
}
