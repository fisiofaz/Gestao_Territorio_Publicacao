package com.congregacao.backend.exception;

public class TerritorioDisponivelException extends RuntimeException {
    public TerritorioDisponivelException() {
        super("Território já está disponível");
    }
}