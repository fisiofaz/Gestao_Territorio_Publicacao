package com.congregacao.backend.controller;

import com.congregacao.backend.dto.LoginDTO;
import com.congregacao.backend.model.Usuario;
import com.congregacao.backend.repository.UsuarioRepository;
import com.congregacao.backend.service.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public String login(@RequestBody LoginDTO dto) {

        Optional<Usuario> user = usuarioRepository.findByEmail(dto.getEmail());

        if (user.isPresent() && user.get().getSenha().equals(dto.getSenha())) {
            return jwtService.gerarToken(dto.getSenha());
        }

        throw new RuntimeException("Credenciais inválidas");
    }
}