package com.congregacao.backend.model;

import java.time.LocalDate;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;



@Getter
@Setter
@Entity
@Table(name = "territorios")
public class Territorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numero;
    
    @Column(length = 500)
    private String descricao;
    
    @Column(name = "mapa_url")
    private String mapaUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusTerritorio status = StatusTerritorio.DISPONIVEL;

    @ManyToOne
    @JoinColumn(name = "publicador_id")
    private Publicador responsavel;

    private LocalDate dataRetirada;
    
    private LocalDate dataDevolucao;
}