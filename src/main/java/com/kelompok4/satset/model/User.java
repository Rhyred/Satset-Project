package com.kelompok4.satset.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users") 
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Long id;

    @Column(name = "nik")
    private String nik;

    @Column(name = "nama_lengkap")
    private String namaLengkap;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "role")
    private String role;

    // --- CONSTRUCTOR KOSONG (WAJIB BAGI HIBERNATE) ---
    public User() {
    }

    // --- GETTER AND SETTER MANUAL ---
    public Long getId() { 
        return id; 
    }
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getNik() { 
        return nik; 
    }
    public void setNik(String nik) { 
        this.nik = nik; 
    }

    public String getNamaLengkap() { 
        return namaLengkap; 
    }
    public void setNamaLengkap(String namaLengkap) { 
        this.namaLengkap = namaLengkap; 
    }

    public String getUsername() { 
        return username; 
    }
    public void setUsername(String username) { 
        this.username = username; 
    }

    public String getPassword() { 
        return password; 
    }
    public void setPassword(String password) { 
        this.password = password; 
    }

    public String getEmail() { 
        return email; 
    }
    public void setEmail(String email) { 
        this.email = email; 
    }

    public String getRole() { 
        return role; 
    }
    public void setRole(String role) { 
        this.role = role; 
    }
}