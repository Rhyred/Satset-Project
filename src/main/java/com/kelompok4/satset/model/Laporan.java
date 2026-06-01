package com.kelompok4.satset.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
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

    @Column(name = "user_id", insertable = false, updatable = false)
    private Long userId;

    @Column(name = "kategori_id", insertable = false, updatable = false)
    private Long kategoriId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User pelapor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kategori_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private KategoriLayanan kategori;
}
