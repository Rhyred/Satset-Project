package com.kelompok4.satset.controller;

import com.kelompok4.satset.service.ContactMessageService;
import com.kelompok4.satset.service.FeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class HomeController {
    
    private final FeatureService featureService;
    private final ContactMessageService contactMessageService;

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

    @GetMapping("/queue")
    public String queue() {
        return "queue";
    }

    @GetMapping("/mading")
    public String mading() {
        return "mading";
    }

    @GetMapping("/test-css")
    public String testCss() {
        return "test-css";
    }
}
