package com.satset.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "laporan_user")
public class LaporanUser extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_kategori", nullable = false)
    private KategoriLayanan kategoriLayanan;

    @Column(nullable = false)
    private String judulLaporan;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String deskripsi;

    private String lampiranUrl;

    @Column(nullable = false)
    private String statusLaporan;
}
