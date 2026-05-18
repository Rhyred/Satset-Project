# script to generate missing entities
$dir = "d:\Kuliah\Semester 4\Pemograman Berorientasi Objek\SatsetController\src\main\java\com\kelompok4\satset"

# 1. Update Laporan and TiketLayanan to add relationships
$laporanPath = "$dir\model\Laporan.java"
$laporanContent = Get-Content $laporanPath
$laporanContent = $laporanContent -replace 'private String statusLaporan;', "private String statusLaporan;`n`n    @Column(name = `"user_id`")`n    private Long userId;`n`n    @Column(name = `"kategori_id`")`n    private Long kategoriId;"
Set-Content -Path $laporanPath -Value $laporanContent

$tiketPath = "$dir\model\TiketLayanan.java"
$tiketContent = Get-Content $tiketPath
$tiketContent = $tiketContent -replace 'private LocalDateTime waktuPengajuan;', "private LocalDateTime waktuPengajuan;`n`n    @Column(name = `"user_id`")`n    private Long userId;`n`n    @Column(name = `"kategori_id`")`n    private Long kategoriId;"
Set-Content -Path $tiketPath -Value $tiketContent


# 2. Generate New Models
$adminModel = @"
package com.kelompok4.satset.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admin")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Admin extends BaseEntity {
    @Column(nullable = false)
    private String nama;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
}
"@
Set-Content -Path "$dir\model\Admin.java" -Value $adminModel

$kategoriModel = @"
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
"@
Set-Content -Path "$dir\model\KategoriLayanan.java" -Value $kategoriModel

$tindakModel = @"
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
"@
Set-Content -Path "$dir\model\TindakLanjutLaporan.java" -Value $tindakModel

$notifModel = @"
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
"@
Set-Content -Path "$dir\model\Notifikasi.java" -Value $notifModel

# 3. Generate Repositories
$repos = @(
    @("Admin", "AdminRepository"),
    @("KategoriLayanan", "KategoriLayananRepository"),
    @("TindakLanjutLaporan", "TindakLanjutLaporanRepository"),
    @("Notifikasi", "NotifikasiRepository")
)

foreach ($repo in $repos) {
    $modelName = $repo[0]
    $repoName = $repo[1]
    
    $repoContent = @"
package com.kelompok4.satset.repository;

import com.kelompok4.satset.model.$modelName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface $repoName extends JpaRepository<$modelName, Long> {
}
"@
    Set-Content -Path "$dir\repository\$repoName.java" -Value $repoContent
}

# 4. Generate Services
$services = @(
    @("Admin", "AdminService", "AdminRepository"),
    @("KategoriLayanan", "KategoriLayananService", "KategoriLayananRepository"),
    @("TindakLanjutLaporan", "TindakLanjutLaporanService", "TindakLanjutLaporanRepository"),
    @("Notifikasi", "NotifikasiService", "NotifikasiRepository")
)

foreach ($svc in $services) {
    $modelName = $svc[0]
    $serviceName = $svc[1]
    $repoName = $svc[2]
    $repoVar = $repoName.Substring(0,1).ToLower() + $repoName.Substring(1)
    
    $svcContent = @"
package com.kelompok4.satset.service;

import com.kelompok4.satset.model.$modelName;
import com.kelompok4.satset.repository.$repoName;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class $serviceName {

    private final $repoName $repoVar;

    public List<$modelName> getAll() {
        return ${repoVar}.findAll();
    }

    public Optional<$modelName> getById(Long id) {
        return ${repoVar}.findById(id);
    }

    public $modelName create($modelName entity) {
        return ${repoVar}.save(entity);
    }
}
"@
    Set-Content -Path "$dir\service\$serviceName.java" -Value $svcContent
}

# 5. Generate API Controllers
$controllers = @(
    @("Admin", "AdminApiController", "AdminService", "admins"),
    @("KategoriLayanan", "KategoriLayananApiController", "KategoriLayananService", "kategori"),
    @("TindakLanjutLaporan", "TindakLanjutLaporanApiController", "TindakLanjutLaporanService", "tindak-lanjut"),
    @("Notifikasi", "NotifikasiApiController", "NotifikasiService", "notifikasi")
)

foreach ($ctrl in $controllers) {
    $modelName = $ctrl[0]
    $ctrlName = $ctrl[1]
    $svcName = $ctrl[2]
    $svcVar = $svcName.Substring(0,1).ToLower() + $svcName.Substring(1)
    $path = $ctrl[3]
    
    $ctrlContent = @"
package com.kelompok4.satset.controller.api;

import com.kelompok4.satset.model.$modelName;
import com.kelompok4.satset.service.$svcName;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/$path")
@RequiredArgsConstructor
public class $ctrlName {

    private final $svcName $svcVar;

    @GetMapping
    public ResponseEntity<List<$modelName>> getAll() {
        return ResponseEntity.ok(${svcVar}.getAll());
    }

    @PostMapping
    public ResponseEntity<$modelName> create(@RequestBody $modelName entity) {
        return ResponseEntity.ok(${svcVar}.create(entity));
    }

    @GetMapping("/{id}")
    public ResponseEntity<$modelName> getById(@PathVariable Long id) {
        return ${svcVar}.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
"@
    Set-Content -Path "$dir\controller\api\$ctrlName.java" -Value $ctrlContent
}

Write-Host "Backend generation complete"
