package com.congregacao.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.congregacao.backend.model.Publicador;
import com.congregacao.backend.model.StatusTerritorio;
import com.congregacao.backend.model.Territorio;
import com.congregacao.backend.repository.PublicadorRepository;
import com.congregacao.backend.repository.TerritorioRepository;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;

@Service
public class TerritorioService {

    private final TerritorioRepository repository;
    private final PublicadorRepository publicadorRepository;

    public TerritorioService(TerritorioRepository repository,
                             PublicadorRepository publicadorRepository) {
        this.repository = repository;
        this.publicadorRepository = publicadorRepository;
    }

    public List<Territorio> listar() {
        return repository.findAll();
    }

    public Territorio criar(Territorio t) {
        t.setStatus(StatusTerritorio.DISPONIVEL);
        return repository.save(t);
    }

    // 🔥 RETIRAR
    public Territorio retirar(Long territorioId, Long publicadorId) {
        Territorio t = repository.findById(territorioId)
                .orElseThrow(() -> new RuntimeException("Território não encontrado"));

        if (t.getStatus() == StatusTerritorio.EM_USO) {
            throw new RuntimeException("Território já está em uso");
        }

        Publicador p = publicadorRepository.findById(publicadorId)
                .orElseThrow(() -> new RuntimeException("Publicador não encontrado"));

        t.setResponsavel(p);
        t.setStatus(StatusTerritorio.EM_USO);
        t.setDataRetirada(LocalDate.now());

        return repository.save(t);
    }

    // 🔥 DEVOLVER
    public Territorio devolver(Long id) {
        Territorio t = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Território não encontrado"));

        t.setResponsavel(null);
        t.setStatus(StatusTerritorio.DISPONIVEL);
        t.setDataDevolucao(LocalDate.now());

        return repository.save(t);
    }

    public Page<Territorio> listar(
        String busca,
        String status,
        int page,
        int size,
        String sort
    ) {

        Sort ordenacao = Sort.by("numero").ascending();

        if ("desc".equalsIgnoreCase(sort)) {
            ordenacao = Sort.by("numero").descending();
        }

        Pageable pageable = PageRequest.of(page, size, ordenacao);

        Specification<Territorio> spec = (root, query, cb) -> {
            var predicates = cb.conjunction();

            // 🔍 BUSCA (numero ou descricao)
            if (busca != null && !busca.isEmpty()) {
                var like = "%" + busca.toLowerCase() + "%";

                predicates = cb.and(predicates,
                    cb.or(
                        cb.like(cb.lower(root.get("numero")), like),
                        cb.like(cb.lower(root.get("descricao")), like)
                    )
                );
            }

            // 🎯 FILTRO STATUS
            if (status != null && !status.equals("ALL")) {
                predicates = cb.and(predicates,
                    cb.equal(root.get("status"), StatusTerritorio.valueOf(status))
                );
            }

            return predicates;
        };

        return repository.findAll(spec, pageable);
    }
}