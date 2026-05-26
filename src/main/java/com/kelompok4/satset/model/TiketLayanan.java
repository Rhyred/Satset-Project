package com.kelompok4.satset.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

import jakarta.persistence.*;
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

    @Column(name = "user_id", insertable = false, updatable = false)
    private Long userId;

    @Column(name = "kategori_id", insertable = false, updatable = false)
    private Long kategoriId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User pemohon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kategori_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private KategoriLayanan kategori;
}
