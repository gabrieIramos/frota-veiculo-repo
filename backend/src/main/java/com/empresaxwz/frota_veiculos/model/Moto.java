package com.empresaxwz.frota_veiculos.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Moto extends Veiculo {
    private int cilindrada;

    public Moto(Integer id, String modelo, String fabricante, int ano, double preco, int cilindrada) {
        super(id, modelo, fabricante, ano, preco);
        this.cilindrada = cilindrada;
    }

    public Moto(String modelo, String fabricante, int ano, double preco, int cilindrada) {
        super(modelo, fabricante, ano, preco);
        this.cilindrada = cilindrada;
    }
}