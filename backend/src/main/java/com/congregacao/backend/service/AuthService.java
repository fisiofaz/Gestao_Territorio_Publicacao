package com.congregacao.backend.service;

import com.congregacao.backend.dto.LoginDTO;
import com.congregacao.backend.exception.ResourceNotFoundException;
import com.congregacao.backend.exception.UnauthorizedException;
import com.congregacao.backend.model.Usuario;
import com.congregacao.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    
	private final UsuarioRepository repository;
    private final BCryptPasswordEncoder encoder;
    
    public AuthService(UsuarioRepository repository, BCryptPasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public Usuario login(LoginDTO dto) {

        Usuario user = repository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (!encoder.matches(dto.getSenha(), user.getSenha())) {
            throw new UnauthorizedException("Senha inválida");
        }

        return user;
    }
}