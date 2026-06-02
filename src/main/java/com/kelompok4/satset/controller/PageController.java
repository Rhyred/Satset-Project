package com.kelompok4.satset.controller;

import com.kelompok4.satset.model.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @GetMapping("/")
    public String homePage(HttpSession session, Model model) {
        addUserToModel(session, model, "/");
        return "home";
    }

    @GetMapping("/queue")
    public String queuePage(HttpSession session, Model model) {
        addUserToModel(session, model, "/queue");
        return "queue";
    }

    @GetMapping("/reports")
    public String reportsPage(HttpSession session, Model model) {
        addUserToModel(session, model, "/reports");
        return "report-feed";
    }

    @GetMapping("/mading")
    public String madingPage(HttpSession session, Model model) {
        addUserToModel(session, model, "/mading");
        return "mading";
    }

    @GetMapping("/account")
    public String accountPage(HttpSession session, Model model) {
        addUserToModel(session, model, "/account");
        return "account";
    }

    @GetMapping("/notifikasi")
    public String notifikasiPage(HttpSession session, Model model) {
        addUserToModel(session, model, "/notifikasi");
        return "notifikasi";
    }

    @GetMapping("/admin")
    public String adminDashboard(HttpSession session, Model model) {
        User user = (User) session.getAttribute("user");
        if (user == null || !"ADMIN".equals(user.getRole())) {
            return "redirect:/";
        }
        addUserToModel(session, model, "/admin");
        return "admin/dashboard";
    }

    private void addUserToModel(HttpSession session, Model model, String currentUri) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("currentUser", user);
            model.addAttribute("isAdmin", "ADMIN".equals(user.getRole()));
        }
        model.addAttribute("currentUri", currentUri);
    }
}
