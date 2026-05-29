package com.congregacao.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.congregacao.backend.dto.PublicadorCreateDTO;
import com.congregacao.backend.dto.PublicadorDTO;
import com.congregacao.backend.exception.PublicadorNotFoundException;
import com.congregacao.backend.model.Publicador;
import com.congregacao.backend.repository.PublicadorRepository;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;


@Service
public class PublicadorService {

    private final PublicadorRepository repository;

    public PublicadorService(PublicadorRepository repository) {
        this.repository = repository;
    }

    // 🔥 LISTAR
    public List<PublicadorDTO> listar(String busca, Pageable pageable) {
    	
    	Page<Publicador> page;

        if (busca != null && !busca.isBlank()) {
            page = repository.findByNomeContainingIgnoreCase(busca, pageable);
        } else {
            page = repository.findAll(pageable);
        }
    	
    	return repository.findAll(pageable)
                .stream()
                .map(p -> new PublicadorDTO(
                        p.getId(),
                        p.getNome(),
                        p.getTelefone()
                ))
                .collect(Collectors.toList());
    }

    // 🔥 BUSCAR POR ID
    public PublicadorDTO buscarPorId(Long id) {
        Publicador p = repository.findById(id)
        		.orElseThrow(() -> new PublicadorNotFoundException(id));

        return new PublicadorDTO(
                p.getId(),
                p.getNome(),
                p.getTelefone()
        );
    }

    // 🔥 CRIAR
    public PublicadorDTO criar(PublicadorCreateDTO dto) {
        Publicador p = new Publicador();
        p.setNome(dto.getNome());
        p.setTelefone(dto.getTelefone());

        p = repository.save(p);

        return new PublicadorDTO(
                p.getId(),
                p.getNome(),
                p.getTelefone()
        );
    }

    // 🔥 ATUALIZAR
    public PublicadorDTO atualizar(Long id, PublicadorCreateDTO dto) {
        Publicador p = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicador não encontrado"));

        p.setNome(dto.getNome());
        p.setTelefone(dto.getTelefone());

        p = repository.save(p);

        return new PublicadorDTO(
                p.getId(),
                p.getNome(),
                p.getTelefone()
        );
    }

    // 🔥 DELETAR
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}