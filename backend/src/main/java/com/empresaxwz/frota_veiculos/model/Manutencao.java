package com.empresaxwz.frota_veiculos.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Manutencao {
    private Integer id;
    private Integer veiculoId;
    private String tipo;
    private LocalDate dataEntrada;
    private LocalDate dataPrevistaSaida;
    private Double preco;
    private String descricao;
    private String oficina;
    private String status;
    private Integer usuarioId;

    public Manutencao(Integer veiculoId, String tipo, LocalDate dataEntrada, LocalDate dataPrevistaSaida, Double preco, String descricao, String oficina, String status, Integer usuarioId) {
        this.veiculoId = veiculoId;
        this.tipo = tipo;
        this.dataEntrada = dataEntrada;
        this.dataPrevistaSaida = dataPrevistaSaida;
        this.preco = preco;
        this.descricao = descricao;
        this.oficina = oficina;
        this.status = status;
        this.usuarioId = usuarioId;
    }
}

