package com.empresaxwz.frota_veiculos.service;


import com.empresaxwz.frota_veiculos.model.Veiculo;
import com.empresaxwz.frota_veiculos.model.Moto;
import com.empresaxwz.frota_veiculos.model.Carro;
import com.empresaxwz.frota_veiculos.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;
import java.util.Optional;

@Service
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;

    @Autowired
    public VeiculoService(VeiculoRepository veiculoRepository) {
        this.veiculoRepository = veiculoRepository;
    }

    public void ValidarAnoVeiculo(int ano){

        int AnoMax = Year.now().getValue();
        AnoMax += 1;

        if (ano < 1850 || ano > AnoMax){
            throw new IllegalArgumentException("Ano do veiculo invalido. O ano deve estar entre 1850 e " + AnoMax );
        }
    }

    @Transactional
    public Veiculo cadastrarVeiculo(Veiculo veiculo) {

        ValidarAnoVeiculo(veiculo.getAno());

        if (veiculo.getPreco() <= 0) {
            throw new IllegalArgumentException("Preço do veículo deve ser positivo.");
        }
        if (veiculo.getFabricante() == null || veiculo.getFabricante().trim().isEmpty()) {
            throw new IllegalArgumentException("Fabricante do veículo é obrigatório.");
        }
        if (veiculo.getModelo() == null || veiculo.getModelo().trim().isEmpty()) {
            throw new IllegalArgumentException("Modelo do veículo é obrigatório.");
        }
        if (veiculo instanceof Carro carro) {
            if (carro.getQuantidade_portas() <= 0) {
                throw new IllegalArgumentException("Carro deve ter pelo menos uma porta.");
            }
            if (carro.getTipoCombustivel() == null) {
                throw new IllegalArgumentException("Tipo de combustível do carro é obrigatório.");
            }
        }
        if (veiculo instanceof Moto moto) {
            if (moto.getCilindrada() <= 0) {
                throw new IllegalArgumentException("Cilindrada da moto deve ser positiva.");
            }
        }

        return veiculoRepository.save(veiculo);
    }

    public List<Veiculo> listarTodosVeiculos() {
        return veiculoRepository.findAll();
    }

    public Optional<Veiculo> consultarVeiculoPorId(Integer id) {
        return veiculoRepository.findById(id);
    }

    @Transactional
    public Veiculo atualizarVeiculo(Integer id, Veiculo veiculoAtualizado) {
        Optional<Veiculo> veiculoExistente = veiculoRepository.findById(id);
        if (veiculoExistente.isEmpty()) {
            throw new IllegalArgumentException("Veículo com ID " + id + " não encontrado para atualização.");
        }
        ValidarAnoVeiculo(veiculoAtualizado.getAno());

        if (veiculoAtualizado.getPreco() <= 0) {
            throw new IllegalArgumentException("Preço do veículo deve ser positivo.");
        }
        if (veiculoAtualizado.getFabricante() == null || veiculoAtualizado.getFabricante().trim().isEmpty()) {
            throw new IllegalArgumentException("Fabricante do veículo é obrigatório.");
        }
        if (veiculoAtualizado.getModelo() == null || veiculoAtualizado.getModelo().trim().isEmpty()) {
            throw new IllegalArgumentException("Modelo do veículo é obrigatório.");
        }
        if (veiculoAtualizado instanceof Carro carro) {
            if (carro.getQuantidade_portas() <= 0) {
                throw new IllegalArgumentException("Carro deve ter pelo menos uma porta.");
            }
            if (carro.getTipoCombustivel() == null) {
                throw new IllegalArgumentException("Tipo de combustível do carro é obrigatório.");
            }
        }
        if (veiculoAtualizado instanceof Moto moto) {
            if (moto.getCilindrada() <= 0) {
                throw new IllegalArgumentException("Cilindrada da moto deve ser positiva.");
            }
        }

        veiculoAtualizado.setId(id);

        veiculoRepository.update(veiculoAtualizado);

        return veiculoAtualizado;
    }

    @Transactional
    public void excluirVeiculo(Integer id) {
        Optional<Veiculo> veiculoExistente = veiculoRepository.findById(id);
        if (veiculoExistente.isEmpty()) {
            throw new IllegalArgumentException("Veículo com ID " + id + " não encontrado para excluir.");
        }
        veiculoRepository.deleteById(id);
    }

    public List<Veiculo> consultarVeiculosPorCriterios(String tipo, String modelo, Integer ano, String fabricante, Double precoMinimo, Double precoMaximo) {  
        // System.out.println("Consultando veículos com critérios: " +
        //         "tipo=" + tipo + ", modelo=" + modelo + ", ano=" + ano +
        //         ", fabricante=" + fabricante + ", precoMinimo=" + precoMinimo +
        //         ", precoMaximo=" + precoMaximo);      
        return veiculoRepository.findByFiltro(tipo, modelo, ano, fabricante, precoMinimo, precoMaximo);
    }
}