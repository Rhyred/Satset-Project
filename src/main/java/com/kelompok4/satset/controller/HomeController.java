package com.kelompok4.satset.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    @GetMapping("/")
    @ResponseBody
    public String home() {
        return "<h1>Halo Geysss welcome to the jungle awokaowkoawk </h1><p>Ngoding Disini fronend ya geys yaa, sambil tes auto reload  .</p>";
    }
}