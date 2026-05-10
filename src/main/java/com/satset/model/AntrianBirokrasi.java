package com.satset.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "antrian_birokrasi")
public class AntrianBirokrasi extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_kategori", nullable = false)
    private KategoriLayanan kategoriLayanan;

    @Column(nullable = false)
    private String nomorAntrian;

    @Column(nullable = false)
    private String jenisSurat;

    @Column(nullable = false)
    private String statusAntrian;

    @Column(nullable = false)
    private LocalDateTime waktuPengajuan;
}
