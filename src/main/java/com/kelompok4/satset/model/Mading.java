package com.kelompok4.satset.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mading_digital")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Mading extends BaseEntity {
    
    @Column(nullable = false)
    private String judul;
    
    @Column(nullable = false, length = 3000)
    private String konten;
    
    @Column(name = "jenis_informasi", nullable = false)
    private String jenisInformasi;
    
    @Column(name = "is_published")
    private Boolean isPublished = true;
}
