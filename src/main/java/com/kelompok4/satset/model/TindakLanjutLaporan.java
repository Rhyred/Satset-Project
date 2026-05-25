package com.kelompok4.satset.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tindak_lanjut_laporan")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class TindakLanjutLaporan extends BaseEntity {
    @Column(name = "catatan_admin", nullable = false, length = 2000)
    private String catatanAdmin;
    
    @Column(name = "waktu_tindak")
    private LocalDateTime waktuTindak;
    
    @Column(name = "laporan_id", insertable = false, updatable = false)
    private Long laporanId;
    
    @Column(name = "admin_id", insertable = false, updatable = false)
    private Long adminId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "laporan_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Laporan laporan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User admin;
}
