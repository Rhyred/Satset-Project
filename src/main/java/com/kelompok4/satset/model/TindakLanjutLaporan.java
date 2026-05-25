package com.kelompok4.satset.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
    
    @Column(name = "laporan_id", nullable = false)
    private Long laporanId;
    
    @Column(name = "admin_id", nullable = false)
    private Long adminId;
}
