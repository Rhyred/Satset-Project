package com.kelompok4.satset.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SatSetWebController {

    // Endpoint untuk memanggil halaman utama Thymeleaf
    @GetMapping("/dashboard")
    public String showDashboard() {
        return "dashboard"; 
        // Nama "dashboard" di atas harus sama dengan nama file dashboard.html 
        // yang ditaruh di folder src/main/resources/templates/
    }
}