package com.congregacao.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class PublicadorCreateDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;

    public String getNome() {
        return nome;
    }

    public String getTelefone() {
        return telefone;
    }
}