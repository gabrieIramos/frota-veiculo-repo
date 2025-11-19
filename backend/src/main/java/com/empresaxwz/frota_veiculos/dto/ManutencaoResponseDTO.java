package com.empresaxwz.frota_veiculos.dto;

import com.empresaxwz.frota_veiculos.model.Manutencao;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManutencaoResponseDTO {
    private Integer id;
    private Integer veiculoId;
    private String veiculoModelo;
    private String veiculoFabricante;
    private String tipo;
    private LocalDate dataEntrada;
    private LocalDate dataPrevistaSaida;
    private Double preco;
    private String descricao;
    private String oficina;
    private String status;
    private Integer usuarioId;

    public static ManutencaoResponseDTO fromEntity(Manutencao manutencao, String veiculoModelo, String veiculoFabricante) {
        if (manutencao == null) {
            return null;
        }
        ManutencaoResponseDTO dto = new ManutencaoResponseDTO();
        dto.setId(manutencao.getId());
        dto.setVeiculoId(manutencao.getVeiculoId());
        dto.setVeiculoModelo(veiculoModelo);
        dto.setVeiculoFabricante(veiculoFabricante);
        dto.setTipo(manutencao.getTipo());
        dto.setDataEntrada(manutencao.getDataEntrada());
        dto.setDataPrevistaSaida(manutencao.getDataPrevistaSaida());
        dto.setPreco(manutencao.getPreco());
        dto.setDescricao(manutencao.getDescricao());
        dto.setOficina(manutencao.getOficina());
        dto.setStatus(manutencao.getStatus());
        dto.setUsuarioId(manutencao.getUsuarioId());
        return dto;
    }
}

