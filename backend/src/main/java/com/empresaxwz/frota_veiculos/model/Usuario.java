package com.empresaxwz.frota_veiculos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    private Integer id;
    private String nome;
    private String email;
    private String senha; // Hash da senha
    private String empresa;

    public Usuario(String nome, String email, String senha, String empresa) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.empresa = empresa;
    }
}
