package com.congregacao.backend.controller;

import com.congregacao.backend.dto.UsuarioDTO;
import com.congregacao.backend.dto.UsuarioCreateDTO;
import com.congregacao.backend.service.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.*;

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
	public Page<UsuarioDTO> listar(
	        @RequestParam(required = false) String search,
	        @RequestParam(required = false) String role,
	        Pageable pageable
	) {
		return service.listar(search, role, pageable);
	}

    // 🔥 CRIAR
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioDTO criar( @RequestBody @Valid UsuarioCreateDTO dto) {
        return service.criar(dto);
    }

    // 🔥 ATUALIZAR
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioDTO atualizar(@PathVariable Long id, @RequestBody @Valid UsuarioCreateDTO dto) {
        return service.atualizar(id, dto);
    }

    // 🔥 DELETAR
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletar(@PathVariable Long id) {
    	service.deletar(id);
    }
}