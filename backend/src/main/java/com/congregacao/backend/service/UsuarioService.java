package com.congregacao.backend.service;

import com.congregacao.backend.model.Usuario;
import com.congregacao.backend.repository.UsuarioRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder encoder;

    public UsuarioService(UsuarioRepository repository, BCryptPasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    // 🔥 LISTAR
    public List<Usuario> listar() {
        return repository.findAll();
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