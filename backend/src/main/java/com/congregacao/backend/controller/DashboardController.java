package com.congregacao.backend.controller;

import com.congregacao.backend.repository.PublicadorRepository;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin
public class DashboardController {

    private final PublicadorRepository publicadorRepo;
   
    public DashboardController(
        PublicadorRepository publicadorRepo
    ) {
        this.publicadorRepo = publicadorRepo;
    }

    @GetMapping
    public Map<String, Object> getDashboard() {

        long totalPublicadores = publicadorRepo.count();
        

        return Map.of(
            "publicadores", totalPublicadores
        );
    }
}