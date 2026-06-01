package com.kelompok4.satset.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping(value = {
        "/",
        "/login",
        "/register",
        "/queue",
        "/reports",
        "/mading",
        "/account",
        "/notifikasi",
        "/admin",
        "/users"
    })
    public String forwardToSPA() {
        return "forward:/index.html";
    }
}

