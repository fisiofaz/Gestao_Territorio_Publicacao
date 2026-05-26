package com.congregacao.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.congregacao.backend.model.Territorio;

public interface TerritorioRepository extends 
	JpaRepository<Territorio, Long>, 
	JpaSpecificationExecutor<Territorio> {
}