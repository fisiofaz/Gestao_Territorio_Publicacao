package com.congregacao.backend.exception;

public class TerritorioEmUsoException extends RuntimeException {
    public TerritorioEmUsoException() {
        super("Território já está em uso");
    }
}