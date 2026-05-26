package com.congregacao.backend.model;

import java.time.LocalDate;



import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;



@Getter
@Setter
@Entity
public class Territorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numero;
    private String descricao;
    private String mapaUrl;

    @Enumerated(EnumType.STRING)
    private StatusTerritorio status;

    @ManyToOne
    private Publicador responsavel;

    private LocalDate dataRetirada;
    private LocalDate dataDevolucao;
}