package com.congregacao.backend.exception;

public class PublicadorNotFoundException extends RuntimeException {

    public PublicadorNotFoundException(Long id) {
        super("Publicador não encontrado com ID: " + id);
    }
}