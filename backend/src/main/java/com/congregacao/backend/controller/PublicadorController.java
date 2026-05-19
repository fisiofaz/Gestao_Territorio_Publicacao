package com.congregacao.backend.controller;

import com.congregacao.backend.model.Publicador;
import com.congregacao.backend.service.PublicadorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/publicadores")
@CrossOrigin(origins = "*") // permite React acessar
public class PublicadorController {

    private final PublicadorService service;

    public PublicadorController(PublicadorService service) {
        this.service = service;
    }

    @GetMapping
    public List<Publicador> listar() {
        return service.listar();
    }

    @PostMapping
    public Publicador criar(@RequestBody Publicador publicador) {
        return service.salvar(publicador);
    }

    @PutMapping("/{id}")
    public Publicador atualizar(@PathVariable Long id, @RequestBody Publicador publicador) {
        return service.atualizar(id, publicador);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}