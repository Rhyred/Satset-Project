    package com.kelompok4.satset.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "antrean_birokrasi")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class TiketLayanan extends BaseEntity {
    
    @Column(name = "nomor_antrian", nullable = false, unique = true)
    private String nomorAntrian;
    
    @Column(name = "jenis_surat", nullable = false)
    private String jenisSurat;
    
    @Column(name = "status_antrian", nullable = false)
    private String statusAntrian;
    
    @Column(name = "waktu_pengajuan")
    private LocalDateTime waktuPengajuan;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "kategori_id")
    private Long kategoriId;
}
