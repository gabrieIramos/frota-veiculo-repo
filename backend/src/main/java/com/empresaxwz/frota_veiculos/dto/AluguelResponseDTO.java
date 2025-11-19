package com.empresaxwz.frota_veiculos.dto;

import com.empresaxwz.frota_veiculos.model.Aluguel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AluguelResponseDTO {
    private Integer id;
    private Integer veiculoId;
    private String veiculoModelo;
    private String veiculoFabricante;
    private String cliente;
    private LocalDate dataRetirada;
    private LocalDate dataDevolucao;
    private Double valor;
    private String observacoes;
    private String status;
    private Integer usuarioId;

    public static AluguelResponseDTO fromEntity(Aluguel aluguel, String veiculoModelo, String veiculoFabricante) {
        if (aluguel == null) {
            return null;
        }
        AluguelResponseDTO dto = new AluguelResponseDTO();
        dto.setId(aluguel.getId());
        dto.setVeiculoId(aluguel.getVeiculoId());
        dto.setVeiculoModelo(veiculoModelo);
        dto.setVeiculoFabricante(veiculoFabricante);
        dto.setCliente(aluguel.getCliente());
        dto.setDataRetirada(aluguel.getDataRetirada());
        dto.setDataDevolucao(aluguel.getDataDevolucao());
        dto.setValor(aluguel.getValor());
        dto.setObservacoes(aluguel.getObservacoes());
        dto.setStatus(aluguel.getStatus());
        dto.setUsuarioId(aluguel.getUsuarioId());
        return dto;
    }
}

