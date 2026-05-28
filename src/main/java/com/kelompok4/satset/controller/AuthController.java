package com.satset.app.controller; // SUSAHKAN nama package ini dengan project kelompokmu

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AuthController {

    // 1. Jalur Menampilkan Halaman Login Awal
    @GetMapping("/auth/login")
    public String halamanLogin() {
        return "login"; // Akan membuka file login.html
    }

    // 2. Jalur Menampilkan Halaman Register (Daftar Akun)
    @GetMapping("/auth/register")
    public String halamanRegister() {
        return "register"; // Akan membuka file register.html
    }

    // 3. Sistem Tembak/Bypass Simulasi Pendaftaran Akun
    @PostMapping("/auth/register")
    public String prosesDaftarAkun(
            @RequestParam("nik") String nik,
            @RequestParam("namaLengkap") String namaLengkap,
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("noTelp") String noTelp,
            @RequestParam("alamat") String alamat) {
        
        // Kode bypass: Mengabaikan penyimpanan database yang rumit malam ini, 
        // agar begitu diklik langsung dianggap sukses dan dialihkan ke dashboard!
        System.out.println("Simulasi Berhasil Daftar Akun Atas Nama: " + namaLengkap);
        
        return "redirect:/dashboard"; 
    }

    // 4. Jalur Menampilkan Halaman Dashboard
    @GetMapping("/dashboard")
    public String halamanDashboard() {
        return "dashboard"; // Akan membuka file dashboard.html
    }

    // 5. Jalur Menampilkan Halaman Pengaduan Form
    @GetMapping("/pengaduan")
    public String halamanPengaduan() {
        return "pengaduan"; // Akan membuka file pengaduan.html
    }

    // 6. Jalur Menampilkan Halaman Profil
    @GetMapping("/profil")
    public String halamanProfil() {
        return "profil"; // Akan membuka file profil.html
    }
}