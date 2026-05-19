package com.congregacao.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.congregacao.backend.dto.LoginDTO;
import com.congregacao.backend.model.Usuario;
import com.congregacao.backend.repository.UsuarioRepository;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository repository;

    public Usuario login(LoginDTO dto) {
        Usuario user = repository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!user.getSenha().equals(dto.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        return user;
    }
}