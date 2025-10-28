package com.empresaxwz.frota_veiculos.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MotoRequestDTO extends VeiculoRequestDTO {

    @NotNull(message = "Cilindrada é obrigatória.")
    @Min(value = 1, message = "Cilindrada da moto deve ser positiva.")
    @Max(value = 10000, message = "Cilindrada deve ser inferior a 10000")
    private Integer cilindrada;
}
