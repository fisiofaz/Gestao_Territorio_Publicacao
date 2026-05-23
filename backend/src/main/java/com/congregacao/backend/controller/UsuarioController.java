package com.congregacao.backend.controller;

import com.congregacao.backend.model.Usuario;
import com.congregacao.backend.repository.UsuarioRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    // 🔥 LISTAR
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Usuario> listar() {
        return repository.findAll();
    }

    // 🔥 CRIAR
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Usuario criar(@RequestBody Usuario usuario) {
        return repository.save(usuario);
    }

    // 🔥 ATUALIZAR
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Usuario atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        usuario.setId(id);
        return repository.save(usuario);
    }

    // 🔥 DELETAR
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}