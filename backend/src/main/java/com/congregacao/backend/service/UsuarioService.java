package com.congregacao.backend.service;

import com.congregacao.backend.model.Usuario;
import com.congregacao.backend.repository.UsuarioRepository;
import com.congregacao.backend.specification.UsuarioSpecification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder encoder;

    public UsuarioService(UsuarioRepository repository, BCryptPasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    // 🔥 LISTAR
    public Page<Usuario> listar(String search, String role, Pageable pageable) {

    	Specification<Usuario> spec = Specification.allOf(
    	        UsuarioSpecification.emailContains(search),
    	        UsuarioSpecification.roleEquals(role)
    	);

        return repository.findAll(spec, pageable);
    }

    // 🔥 CRIAR
    public Usuario criar(Usuario usuario) {
        usuario.setSenha(encoder.encode(usuario.getSenha())); // 🔐 CRIPTOGRAFIA
        return repository.save(usuario);
    }

    // 🔥 ATUALIZAR
    public Usuario atualizar(Long id, Usuario usuario) {
        Usuario existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        existente.setEmail(usuario.getEmail());
        existente.setRole(usuario.getRole());

        // 🔥 Só atualiza senha se vier preenchida
        if (usuario.getSenha() != null && !usuario.getSenha().isBlank()) {
            existente.setSenha(encoder.encode(usuario.getSenha()));
        }

        return repository.save(existente);
    }

    // 🔥 DELETAR
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}