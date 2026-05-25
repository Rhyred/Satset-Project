package com.kelompok4.satset.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "laporan_user")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Laporan extends BaseEntity {
    
    @Column(name = "judul_laporan", nullable = false)
    private String judulLaporan;
    
    @Column(nullable = false, length = 2000)
    private String deskripsi;
    
    @Column(name = "lampiran_url")
    private String lampiranUrl;
    
    @Column(name = "status_laporan", nullable = false)
    private String statusLaporan;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "kategori_id")
    private Long kategoriId;
}
