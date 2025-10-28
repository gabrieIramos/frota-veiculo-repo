package com.empresaxwz.frota_veiculos.dto;

import com.empresaxwz.frota_veiculos.model.TipoCombustivel;
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
public class CarroRequestDTO extends VeiculoRequestDTO {

    @NotNull(message = "Quantidade de portas é obrigatória.")
    @Min(value = 1, message = "Carro deve ter pelo menos uma porta.")
    @Max(value = 100, message = "A quantidade de portas deve ser inferior a 100")
    private Integer quantidadePortas;

    @NotNull(message = "Tipo de combustível é obrigatório.")
    private TipoCombustivel tipoCombustivel;
}
