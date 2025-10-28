package com.empresaxwz.frota_veiculos.dto;

import com.empresaxwz.frota_veiculos.model.TipoCombustivel;
import com.empresaxwz.frota_veiculos.model.Veiculo;
import com.empresaxwz.frota_veiculos.model.Carro;
import com.empresaxwz.frota_veiculos.model.Moto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class VeiculoResponseDTO {
    private Integer id;
    private String modelo;
    private String fabricante;
    private int ano;
    private double preco;
    private String tipoVeiculo;

    private Integer quantidadePortas;
    private TipoCombustivel tipoCombustivel;

    private Integer cilindrada;


    public static VeiculoResponseDTO fromEntity(Veiculo veiculo) {
        if (veiculo == null) {
            return null;
        }
        VeiculoResponseDTO dto = new VeiculoResponseDTO();
        dto.setId(veiculo.getId());
        dto.setModelo(veiculo.getModelo());
        dto.setFabricante(veiculo.getFabricante());
        dto.setAno(veiculo.getAno());
        dto.setPreco(veiculo.getPreco());

        if (veiculo instanceof Carro carro) {

            dto.setTipoVeiculo("CARRO");
            dto.setQuantidadePortas(carro.getQuantidade_portas());
            dto.setTipoCombustivel(carro.getTipoCombustivel());

        } else if (veiculo instanceof Moto moto) {

            dto.setTipoVeiculo("MOTO");
            dto.setCilindrada(moto.getCilindrada());
        }
        return dto;
    }
}
