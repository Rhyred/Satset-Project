package com.satset.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "kategori_layanan")
public class KategoriLayanan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idKategori;

    @Column(nullable = false)
    private String namaKategori;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipeLayanan tipeLayanan;
}
