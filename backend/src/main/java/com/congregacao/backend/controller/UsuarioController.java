package com.congregacao.backend.controller;

import com.congregacao.backend.model.Usuario;
import com.congregacao.backend.service.UsuarioService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin
public class UsuarioController {

	private final UsuarioService service;

	public UsuarioController(UsuarioService service) {
	    this.service = service;
	}
	
    // 🔥 LISTAR
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Usuario> listar() {
        return service.listar();
    }

    // 🔥 CRIAR
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Usuario criar(@RequestBody Usuario usuario) {
        return service.criar(usuario);
    }

    // 🔥 ATUALIZAR
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Usuario atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        return service.atualizar(id, usuario);
    }

    // 🔥 DELETAR
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletar(@PathVariable Long id) {
    	service.deletar(id);
    }
}