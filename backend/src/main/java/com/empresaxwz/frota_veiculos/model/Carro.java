package com.empresaxwz.frota_veiculos.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Carro extends Veiculo {
    private int quantidade_portas;
    private TipoCombustivel tipoCombustivel;

    public Carro(Integer id, String modelo, String fabricante, int ano, double preco, int quantidade_portas, TipoCombustivel tipo_combustivel) {
        super(id, modelo, fabricante, ano, preco);
        this.quantidade_portas = quantidade_portas;
        this.tipoCombustivel = tipo_combustivel;
    }

    public Carro(String modelo, String fabricante, int ano, double preco, int quantidade_portas, TipoCombustivel tipo_combustivel) {
        super(modelo, fabricante, ano, preco);
        this.quantidade_portas = quantidade_portas;
        this.tipoCombustivel = tipo_combustivel;
    }
}