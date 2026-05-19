package com.congregacao.backend.repository;

import com.congregacao.backend.model.Publicador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublicadorRepository extends JpaRepository<Publicador, Long> {
}