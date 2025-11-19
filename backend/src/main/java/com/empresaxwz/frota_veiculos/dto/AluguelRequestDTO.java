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
public class AluguelRequestDTO {
    @NotNull(message = "ID do veículo é obrigatório.")
    private Integer veiculoId;

    @NotBlank(message = "Cliente é obrigatório.")
    private String cliente;

    @NotNull(message = "Data de retirada é obrigatória.")
    private LocalDate dataRetirada;

    @NotNull(message = "Data de devolução é obrigatória.")
    private LocalDate dataDevolucao;

    @NotNull(message = "Valor é obrigatório.")
    @Min(value = 0, message = "Valor deve ser positivo.")
    private Double valor;

    private String observacoes;

    @NotBlank(message = "Status é obrigatório.")
    private String status;

    @NotNull(message = "ID do usuário é obrigatório.")
    private Integer usuarioId;
}

