package com.satset.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "tindak_lanjut_laporan")
public class TindakLanjutLaporan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTindakLanjut;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_laporan", nullable = false)
    private LaporanUser laporanUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_admin", nullable = false)
    private Admin admin;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String catatanAdmin;

    @Column(nullable = false)
    private LocalDateTime waktuTindak;
}
