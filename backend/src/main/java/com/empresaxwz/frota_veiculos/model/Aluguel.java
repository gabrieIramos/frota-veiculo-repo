package com.empresaxwz.frota_veiculos.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aluguel {
    private Integer id;
    private Integer veiculoId;
    private String cliente;
    private LocalDate dataRetirada;
    private LocalDate dataDevolucao;
    private Double valor;
    private String observacoes;
    private String status;
    private Integer usuarioId;

    public Aluguel(Integer veiculoId, String cliente, LocalDate dataRetirada, LocalDate dataDevolucao, Double valor, String observacoes, String status, Integer usuarioId) {
        this.veiculoId = veiculoId;
        this.cliente = cliente;
        this.dataRetirada = dataRetirada;
        this.dataDevolucao = dataDevolucao;
        this.valor = valor;
        this.observacoes = observacoes;
        this.status = status;
        this.usuarioId = usuarioId;
    }
}

