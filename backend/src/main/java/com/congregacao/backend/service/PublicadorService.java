package com.congregacao.backend.service;

import com.congregacao.backend.model.Publicador;
import com.congregacao.backend.repository.PublicadorRepository;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.stereotype.Service;

import java.util.List;


@EnableMethodSecurity
@Service
public class PublicadorService {

    private final PublicadorRepository repository;

    public PublicadorService(PublicadorRepository repository) {
        this.repository = repository;
    }

    public List<Publicador> listar() {
        return repository.findAll();
    }

    public Publicador salvar(Publicador publicador) {
        return repository.save(publicador);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }

    public Publicador atualizar(Long id, Publicador dados) {
        Publicador p = repository.findById(id).orElseThrow();
        p.setNome(dados.getNome());
        p.setTelefone(dados.getTelefone());
        return repository.save(p);
    }
}