package com.satset.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String home() {
        return "home";
    }

    @GetMapping("/reports")
    public String reports() {
        return "report-feed";
    }

    @GetMapping("/account")
    public String account() {
        return "account";
    }
}
