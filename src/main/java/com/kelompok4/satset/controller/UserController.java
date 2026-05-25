package com.kelompok4.satset.controller;

import com.kelompok4.satset.model.User;
import com.kelompok4.satset.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@Controller
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public String getAllUsers(Model model) {
        List<User> listUsers = userRepository.findAll();
        model.addAttribute("dataUsers", listUsers);
        return "daftar-user"; 
    }
}