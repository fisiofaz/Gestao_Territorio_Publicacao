package com.congregacao.backend.controller;

import com.congregacao.backend.dto.PublicadorCreateDTO;
import com.congregacao.backend.dto.PublicadorDTO;
import com.congregacao.backend.model.Publicador;
import com.congregacao.backend.repository.PublicadorRepository;
import com.congregacao.backend.service.PublicadorService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/publicadores")
@CrossOrigin
public class PublicadorController {

    private final PublicadorService service;
    private final PublicadorRepository repository;

    public PublicadorController(PublicadorService service, PublicadorRepository repository) {
        this.service = service;
        this.repository = repository;
    }
    
    // 🔥 LISTAR
    public Page<PublicadorDTO> listar(String busca, Pageable pageable) {

        Page<Publicador> page;

        if (busca != null && !busca.isBlank()) {
            page = repository.findByNomeContainingIgnoreCase(busca, pageable);
        } else {
            page = repository.findAll(pageable);
        }

        return page.map(p -> new PublicadorDTO(
                p.getId(),
                p.getNome(),
                p.getTelefone()
        ));
    }
    
    // 🔥 BUSCAR POR ID
    @GetMapping("/{id}")
    public PublicadorDTO buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    // 🔥 CRIAR
    @PostMapping
    public PublicadorDTO criar(@Valid @RequestBody PublicadorCreateDTO dto) {
        return service.criar(dto);
    }

    // 🔥 ATUALIZAR
    @PutMapping("/{id}")
    public PublicadorDTO atualizar(
            @PathVariable Long id,
            @Valid @RequestBody PublicadorCreateDTO dto
    ) {
        return service.atualizar(id, dto);
    }

    // 🔥 DELETAR
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}