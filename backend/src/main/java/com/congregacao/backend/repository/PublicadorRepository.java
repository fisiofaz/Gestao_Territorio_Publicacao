package com.congregacao.backend.repository;

import com.congregacao.backend.model.Publicador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PublicadorRepository extends JpaRepository<Publicador, Long> {
	Page<Publicador> findByNomeContainingIgnoreCase(String nome, Pageable pageable);
}