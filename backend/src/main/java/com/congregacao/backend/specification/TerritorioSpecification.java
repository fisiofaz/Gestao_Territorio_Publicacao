package com.congregacao.backend.specification;

import com.congregacao.backend.model.StatusTerritorio;
import com.congregacao.backend.model.Territorio;
import org.springframework.data.jpa.domain.Specification;

public class TerritorioSpecification {

    public static Specification<Territorio> numeroContains(String busca) {
        return (root, query, cb) ->
                busca == null || busca.isBlank()
                        ? null
                        : cb.like(
                            cb.lower(root.get("numero")),
                            "%" + busca.toLowerCase() + "%"
                        );
    }

    public static Specification<Territorio> statusEquals(String status) {
        return (root, query, cb) ->
                status == null || status.equals("ALL")
                        ? null
                        : cb.equal(
                            root.get("status"),
                            StatusTerritorio.valueOf(status)
                        );
    }
}