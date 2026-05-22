package com.congregacao.backend.controller;

import com.congregacao.backend.dto.LoginDTO;
import com.congregacao.backend.model.Usuario;
import com.congregacao.backend.repository.UsuarioRepository;
import com.congregacao.backend.service.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
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
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {

        Optional<Usuario> user = usuarioRepository.findByEmail(dto.getEmail());

        if (user.isPresent() && user.get().getSenha().equals(dto.getSenha())) {

            Usuario usuario = user.get();

            String token = jwtService.gerarToken(
            	    usuario.getEmail(),
            	    usuario.getRole()
            );

            return ResponseEntity.ok(Map.of(
                "token", token,
                "email", usuario.getEmail(),
                "role", usuario.getRole()
            ));
        }

        return ResponseEntity.status(401).body("Credenciais inválidas");
    }
}