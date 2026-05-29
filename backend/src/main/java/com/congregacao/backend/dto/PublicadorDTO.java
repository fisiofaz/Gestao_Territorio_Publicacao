package com.congregacao.backend.dto;

public class PublicadorDTO {

    private Long id;
    private String nome;
    private String telefone;

    public PublicadorDTO() {}

    public PublicadorDTO(Long id, String nome, String telefone) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getTelefone() {
        return telefone;
    }
}