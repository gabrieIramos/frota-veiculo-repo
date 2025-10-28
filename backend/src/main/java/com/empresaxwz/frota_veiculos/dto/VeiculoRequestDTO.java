package com.empresaxwz.frota_veiculos.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Value;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VeiculoRequestDTO {
    @NotBlank(message = "Modelo é obrigatório.")
    private String modelo;

    @NotBlank(message = "Fabricante é obrigatório.")
    private String fabricante;

    @Min(value = 1850, message = "Ano deve ser posterior a 1850.")
    @NotNull(message = "Ano é obrigatório.")
    @Max(value = 9999, message = "Ano Invalido.")
    private Integer ano;

    @NotNull(message = "Preço é obrigatório.")
    @Min(value = 0, message = "Preço deve ser positivo.")
    @Max(value = 999999999, message = "Preço máximo excedido (limite de 999.999.999,99).")
    private Double preco;
}
