package com.congregacao.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.congregacao.backend.model.Territorio;
import com.congregacao.backend.service.TerritorioService;

@RestController
@RequestMapping("/territorios")
public class TerritorioController {

    private final TerritorioService service;

    public TerritorioController(TerritorioService service) {
        this.service = service;
    }

    @PostMapping
    public Territorio criar(@RequestBody Territorio t) {
        return service.criar(t);
    }

    @PostMapping("/{id}/retirar/{publicadorId}")
    public Territorio retirar(@PathVariable Long id, @PathVariable Long publicadorId) {
        return service.retirar(id, publicadorId);
    }

    @PostMapping("/{id}/devolver")
    public Territorio devolver(@PathVariable Long id) {
        return service.devolver(id);
    }
    
    @GetMapping
    public Page<Territorio> listar(
        @RequestParam(required = false) String busca,
        @RequestParam(defaultValue = "ALL") String status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "asc") String sort
    ) {
        return service.listar(busca, status, page, size, sort);
    }
}