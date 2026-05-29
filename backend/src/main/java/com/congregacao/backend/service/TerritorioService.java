package com.congregacao.backend.service;

import com.congregacao.backend.dto.TerritorioDTO;
import com.congregacao.backend.dto.TerritorioCreateDTO;
import com.congregacao.backend.exception.TerritorioNotFoundException;
import com.congregacao.backend.exception.TerritorioEmUsoException;
import com.congregacao.backend.exception.TerritorioDisponivelException;
import com.congregacao.backend.model.Publicador;
import com.congregacao.backend.model.StatusTerritorio;
import com.congregacao.backend.model.Territorio;
import com.congregacao.backend.repository.PublicadorRepository;
import com.congregacao.backend.repository.TerritorioRepository;
import com.congregacao.backend.specification.TerritorioSpecification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class TerritorioService {

    private final TerritorioRepository repository;
    private final PublicadorRepository publicadorRepository;

    public TerritorioService(TerritorioRepository repository,
                             PublicadorRepository publicadorRepository) {
        this.repository = repository;
        this.publicadorRepository = publicadorRepository;
    }

    // 🔥 LISTAR
    public Page<TerritorioDTO> listar(String busca, String status, Pageable pageable) {

        Specification<Territorio> spec = Specification.allOf(
                TerritorioSpecification.numeroContains(busca),
                TerritorioSpecification.statusEquals(status)
        );

        return repository.findAll(spec, pageable)
                .map(this::toDTO);
    }

    // 🔥 BUSCAR POR ID
    public TerritorioDTO buscarPorId(Long id) {
        Territorio t = repository.findById(id)
                .orElseThrow(() -> new TerritorioNotFoundException(id));

        return toDTO(t);
    }

    // 🔥 CRIAR
    public TerritorioDTO criar(TerritorioCreateDTO dto) {
        Territorio t = new Territorio();

        t.setNumero(dto.getNumero());
        t.setDescricao(dto.getDescricao());
        t.setMapaUrl(dto.getMapaUrl());
        t.setStatus(StatusTerritorio.DISPONIVEL);

        t = repository.save(t);

        return toDTO(t);
    }

    // 🔥 ATUALIZAR
    public TerritorioDTO atualizar(Long id, TerritorioCreateDTO dto) {
        Territorio t = repository.findById(id)
                .orElseThrow(() -> new TerritorioNotFoundException(id));

        t.setNumero(dto.getNumero());
        t.setDescricao(dto.getDescricao());
        t.setMapaUrl(dto.getMapaUrl());

        t = repository.save(t);

        return toDTO(t);
    }

    // 🔥 DELETAR (com regra)
    public void deletar(Long id) {
        Territorio t = repository.findById(id)
                .orElseThrow(() -> new TerritorioNotFoundException(id));

        if (t.getStatus() == StatusTerritorio.EM_USO) {
            throw new RuntimeException("Não é possível deletar território em uso");
        }

        repository.delete(t);
    }

    // 🔥 RETIRAR TERRITÓRIO
    @Transactional
    public TerritorioDTO retirar(Long territorioId, Long publicadorId) {

        Territorio t = repository.findById(territorioId)
                .orElseThrow(() -> new TerritorioNotFoundException(territorioId));

        // 🚨 REGRA: já está em uso
        if (t.getStatus() == StatusTerritorio.EM_USO) {
            throw new TerritorioEmUsoException();
        }

        Publicador p = publicadorRepository.findById(publicadorId)
                .orElseThrow(() -> new RuntimeException("Publicador não encontrado"));

        t.setResponsavel(p);
        t.setDataRetirada(LocalDate.now());
        t.setDataDevolucao(null);
        t.setStatus(StatusTerritorio.EM_USO);

        return toDTO(repository.save(t));
    }

    // 🔥 DEVOLVER TERRITÓRIO
    @Transactional
    public TerritorioDTO devolver(Long territorioId) {

        Territorio t = repository.findById(territorioId)
                .orElseThrow(() -> new TerritorioNotFoundException(territorioId));

        if (t.getStatus() == StatusTerritorio.DISPONIVEL) {
            throw new TerritorioDisponivelException();
        }

        t.setResponsavel(null);
        t.setDataDevolucao(LocalDate.now());
        t.setStatus(StatusTerritorio.DISPONIVEL);

        return toDTO(repository.save(t));
    }

    // 🔥 MAPPER ENTITY → DTO
    private TerritorioDTO toDTO(Territorio t) {

        String responsavel = t.getResponsavel() != null
                ? t.getResponsavel().getNome()
                : null;

        boolean atrasado = t.getStatus() == StatusTerritorio.EM_USO &&
                t.getDataRetirada() != null &&
                t.getDataRetirada().isBefore(LocalDate.now().minusDays(30));

        return new TerritorioDTO(
                t.getId(),
                t.getNumero(),
                t.getDescricao(),
                t.getMapaUrl(),
                t.getStatus(),
                responsavel,
                t.getDataRetirada(),
                t.getDataDevolucao(),
                atrasado
        );
    }
}