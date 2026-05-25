package com.kelompok4.satset.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notifikasi")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Notifikasi extends BaseEntity {
    @Column(nullable = false)
    private String pesan;
    
    @Column(name = "is_read")
    private Boolean isRead = false;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
}
