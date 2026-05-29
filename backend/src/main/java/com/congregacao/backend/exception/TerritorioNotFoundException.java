package com.congregacao.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TerritorioNotFoundException extends RuntimeException {

    public TerritorioNotFoundException(Long id) {
        super("Território não encontrado: " + id);
    }
}