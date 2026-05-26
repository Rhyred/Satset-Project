package com.kelompok4.satset.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MadingRequest {
    private String judul;
    private String konten;
    private String jenisInformasi;
    private Boolean isPublished;
}
