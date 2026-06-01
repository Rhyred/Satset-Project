package com.kelompok4.satset.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "kategori_layanan")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class KategoriLayanan extends BaseEntity {
    @Column(name = "nama_kategori", nullable = false)
    private String namaKategori;
    
    @Column(nullable = false) // BIROKRASI, PENGADUAN
    private String tipe;
}
