package com.empresaxwz.frota_veiculos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManutencaoRequestDTO {
    @NotNull(message = "ID do veículo é obrigatório.")
    private Integer veiculoId;

    @NotBlank(message = "Tipo é obrigatório.")
    private String tipo;

    @NotNull(message = "Data de entrada é obrigatória.")
    private LocalDate dataEntrada;

    @NotNull(message = "Data prevista de saída é obrigatória.")
    private LocalDate dataPrevistaSaida;

    @NotNull(message = "Preço é obrigatório.")
    @Min(value = 0, message = "Preço deve ser positivo.")
    private Double preco;

    private String descricao;

    @NotBlank(message = "Oficina é obrigatória.")
    private String oficina;

    @NotBlank(message = "Status é obrigatório.")
    private String status;

    @NotNull(message = "ID do usuário é obrigatório.")
    private Integer usuarioId;
}

