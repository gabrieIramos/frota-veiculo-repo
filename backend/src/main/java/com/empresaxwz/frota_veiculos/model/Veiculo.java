package com.empresaxwz.frota_veiculos.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Veiculo {
    private Integer id;
    private String modelo;
    private String fabricante;
    private int ano;
    private double preco;

    public Veiculo(String modelo, String fabricante, int ano, double preco) {
        this.modelo = modelo;
        this.fabricante = fabricante;
        this.ano = ano;
        this.preco = preco;
    }

}
