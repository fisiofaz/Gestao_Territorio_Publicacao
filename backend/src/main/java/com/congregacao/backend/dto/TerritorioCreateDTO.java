package com.congregacao.backend.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TerritorioCreateDTO {

    @NotBlank(message = "Número é obrigatório")
    private String numero;

    private String descricao;

    private String mapaUrl;
}