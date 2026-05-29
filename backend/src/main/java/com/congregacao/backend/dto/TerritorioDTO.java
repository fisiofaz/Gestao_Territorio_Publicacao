package com.congregacao.backend.dto;

import java.time.LocalDate;

import com.congregacao.backend.model.StatusTerritorio;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TerritorioDTO {

    private Long id;
    private String numero;
    private String descricao;
    private String mapaUrl;
    private StatusTerritorio status;
    private String responsavel;
    private LocalDate dataRetirada;
    private LocalDate dataDevolucao;
    private boolean atrasado;
}