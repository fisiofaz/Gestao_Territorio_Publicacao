package com.congregacao.backend.service;

import com.congregacao.backend.dto.UsuarioDTO;
import com.congregacao.backend.dto.UsuarioCreateDTO;
import com.congregacao.backend.exception.ResourceNotFoundException;
import com.congregacao.backend.model.Role;
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
    public Page<UsuarioDTO> listar(String search, String role, Pageable pageable) {

        Specification<Usuario> spec = Specification.allOf(
                UsuarioSpecification.emailContains(search),
                UsuarioSpecification.roleEquals(role)
        );

        return repository.findAll(spec, pageable)
                .map(u -> new UsuarioDTO(
                        u.getId(),
                        u.getEmail(),
                        u.getRole().name()
                ));
    }

    // 🔥 CRIAR
    public UsuarioDTO criar(UsuarioCreateDTO dto) {

        Usuario usuario = new Usuario();
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(encoder.encode(dto.getSenha()));
        usuario.setRole(Role.valueOf(dto.getRole()));

        Usuario salvo = repository.save(usuario);

        return new UsuarioDTO(
                salvo.getId(),
                salvo.getEmail(),
                salvo.getRole().name()
        );
    }

    // 🔥 ATUALIZAR
    public UsuarioDTO atualizar(Long id, UsuarioCreateDTO dto) {

        Usuario existente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        existente.setEmail(dto.getEmail());
        existente.setRole(Role.valueOf(dto.getRole()));

        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            existente.setSenha(encoder.encode(dto.getSenha()));
        }

        Usuario atualizado = repository.save(existente);

        return new UsuarioDTO(
                atualizado.getId(),
                atualizado.getEmail(),
                atualizado.getRole().name()
        );
    }

    // 🔥 DELETAR
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}