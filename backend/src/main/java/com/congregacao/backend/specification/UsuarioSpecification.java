package com.congregacao.backend.specification;

import com.congregacao.backend.model.Usuario;
import org.springframework.data.jpa.domain.Specification;

public class UsuarioSpecification {

    public static Specification<Usuario> emailContains(String search) {
        return (root, query, cb) ->
                search == null ? null :
                cb.like(cb.lower(root.get("email")), "%" + search.toLowerCase() + "%");
    }

    public static Specification<Usuario> roleEquals(String role) {
        return (root, query, cb) ->
                role == null || role.equals("ALL") ? null :
                cb.equal(root.get("role"), role);
    }
}