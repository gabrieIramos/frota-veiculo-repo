package com.empresaxwz.frota_veiculos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private Integer usuarioId;
    private String nome;
    private String email;
    private String empresa;
    private String mensagem;

    public AuthResponseDTO(Integer usuarioId, String nome, String email, String empresa) {
        this.usuarioId = usuarioId;
        this.nome = nome;
        this.email = email;
        this.empresa = empresa;
    }
}
