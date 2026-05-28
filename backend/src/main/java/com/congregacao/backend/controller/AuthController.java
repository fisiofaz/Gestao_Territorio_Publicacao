package com.congregacao.backend.controller;

import com.congregacao.backend.dto.LoginDTO;
import com.congregacao.backend.model.Usuario;
import com.congregacao.backend.service.AuthService;
import com.congregacao.backend.service.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

	private final AuthService authService;
    private final JwtService jwtService;
    
    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        Usuario usuario = authService.login(dto);

        String token = jwtService.gerarToken(
           usuario.getEmail(),
           usuario.getRole().name()
         );

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", usuario.getEmail(),
                "role", usuario.getRole()
        ));
    }
    
 // 🔥 USUÁRIO LOGADO
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {

        if (auth == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(Map.of(
                "email", auth.getName(),
                "role", auth.getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority()
                        .replace("ROLE_", "")
        ));
    }
}