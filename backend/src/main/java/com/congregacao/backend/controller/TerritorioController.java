package com.congregacao.backend.controller;

import com.congregacao.backend.dto.TerritorioCreateDTO;
import com.congregacao.backend.dto.TerritorioDTO;
import com.congregacao.backend.service.TerritorioService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/territorios")
@CrossOrigin
public class TerritorioController {

    private final TerritorioService service;

    public TerritorioController(TerritorioService service) {
        this.service = service;
    }

    // 🔥 LISTAR
    @GetMapping
    public Page<TerritorioDTO> listar(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) String status,
            Pageable pageable
    ) {
        return service.listar(busca, status, pageable);
    }

    // 🔥 BUSCAR POR ID
    @GetMapping("/{id}")
    public TerritorioDTO buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    // 🔥 CRIAR
    @PostMapping
    public TerritorioDTO criar(@Valid @RequestBody TerritorioCreateDTO dto) {
        return service.criar(dto);
    }

    // 🔥 ATUALIZAR
    @PutMapping("/{id}")
    public TerritorioDTO atualizar(
            @PathVariable Long id,
            @Valid @RequestBody TerritorioCreateDTO dto
    ) {
        return service.atualizar(id, dto);
    }

    // 🔥 DELETAR
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    // 🔥 RETIRAR
    @PostMapping("/{id}/retirar/{publicadorId}")
    public void retirar(
            @PathVariable Long id,
            @PathVariable Long publicadorId
    ) {
        service.retirar(id, publicadorId);
    }

    // 🔥 DEVOLVER
    @PostMapping("/{id}/devolver")
    public void devolver(@PathVariable Long id) {
        service.devolver(id);
    }
}