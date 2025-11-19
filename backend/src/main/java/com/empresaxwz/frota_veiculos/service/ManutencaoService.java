package com.empresaxwz.frota_veiculos.service;

import com.empresaxwz.frota_veiculos.model.Manutencao;
import com.empresaxwz.frota_veiculos.model.Veiculo;
import com.empresaxwz.frota_veiculos.repository.ManutencaoRepository;
import com.empresaxwz.frota_veiculos.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ManutencaoService {

    private final ManutencaoRepository manutencaoRepository;
    private final VeiculoRepository veiculoRepository;

    @Autowired
    public ManutencaoService(ManutencaoRepository manutencaoRepository, VeiculoRepository veiculoRepository) {
        this.manutencaoRepository = manutencaoRepository;
        this.veiculoRepository = veiculoRepository;
    }

    private void validarStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status da manutenção é obrigatório.");
        }
        if (!status.equals("EM_ANDAMENTO") && !status.equals("FINALIZADA")) {
            throw new IllegalArgumentException("Status deve ser EM_ANDAMENTO ou FINALIZADA.");
        }
    }

    @Transactional
    public Manutencao cadastrarManutencao(Manutencao manutencao) {
        if (manutencao.getDataEntrada() == null) {
            throw new IllegalArgumentException("Data de entrada é obrigatória.");
        }
        if (manutencao.getDataPrevistaSaida() == null) {
            throw new IllegalArgumentException("Data prevista de saída é obrigatória.");
        }
        if (manutencao.getDataPrevistaSaida().isBefore(manutencao.getDataEntrada())) {
            throw new IllegalArgumentException("Data prevista de saída deve ser posterior à data de entrada.");
        }
        if (manutencao.getPreco() <= 0) {
            throw new IllegalArgumentException("Preço da manutenção deve ser positivo.");
        }
        if (manutencao.getTipo() == null || manutencao.getTipo().trim().isEmpty()) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }
        if (manutencao.getOficina() == null || manutencao.getOficina().trim().isEmpty()) {
            throw new IllegalArgumentException("Oficina é obrigatória.");
        }
        validarStatus(manutencao.getStatus());

        Optional<Veiculo> veiculoOpt = veiculoRepository.findById(manutencao.getVeiculoId());
        if (veiculoOpt.isEmpty()) {
            throw new IllegalArgumentException("Veículo não encontrado.");
        }

        Veiculo veiculo = veiculoOpt.get();
        if (manutencao.getStatus().equals("EM_ANDAMENTO")) {
            veiculo.setStatus("MANUTENÇÃO");
            veiculoRepository.update(veiculo);
        }

        return manutencaoRepository.save(manutencao);
    }

    public List<Manutencao> listarTodasManutencoes() {
        return manutencaoRepository.findAll();
    }

    public List<Manutencao> listarManutencoesPorUsuario(Integer usuarioId) {
        return manutencaoRepository.findByUsuarioId(usuarioId);
    }

    public Optional<Manutencao> consultarManutencaoPorId(Integer id) {
        return manutencaoRepository.findById(id);
    }

    @Transactional
    public Manutencao atualizarManutencao(Integer id, Manutencao manutencaoAtualizada) {
        Optional<Manutencao> manutencaoExistente = manutencaoRepository.findById(id);
        if (manutencaoExistente.isEmpty()) {
            throw new IllegalArgumentException("Manutenção com ID " + id + " não encontrada para atualização.");
        }

        if (manutencaoAtualizada.getDataEntrada() == null) {
            throw new IllegalArgumentException("Data de entrada é obrigatória.");
        }
        if (manutencaoAtualizada.getDataPrevistaSaida() == null) {
            throw new IllegalArgumentException("Data prevista de saída é obrigatória.");
        }
        if (manutencaoAtualizada.getDataPrevistaSaida().isBefore(manutencaoAtualizada.getDataEntrada())) {
            throw new IllegalArgumentException("Data prevista de saída deve ser posterior à data de entrada.");
        }
        if (manutencaoAtualizada.getPreco() <= 0) {
            throw new IllegalArgumentException("Preço da manutenção deve ser positivo.");
        }
        validarStatus(manutencaoAtualizada.getStatus());

        Manutencao manutencaoAnterior = manutencaoExistente.get();
        manutencaoAtualizada.setId(id);
        manutencaoRepository.update(manutencaoAtualizada);

        Optional<Veiculo> veiculoOpt = veiculoRepository.findById(manutencaoAtualizada.getVeiculoId());
        if (veiculoOpt.isPresent()) {
            Veiculo veiculo = veiculoOpt.get();
            if (manutencaoAtualizada.getStatus().equals("FINALIZADA") && manutencaoAnterior.getStatus().equals("EM_ANDAMENTO")) {
                veiculo.setStatus("DISPONÍVEL");
                veiculoRepository.update(veiculo);
            } else if (manutencaoAtualizada.getStatus().equals("EM_ANDAMENTO") && !manutencaoAnterior.getStatus().equals("EM_ANDAMENTO")) {
                veiculo.setStatus("MANUTENÇÃO");
                veiculoRepository.update(veiculo);
            }
        }

        return manutencaoAtualizada;
    }

    @Transactional
    public void excluirManutencao(Integer id) {
        Optional<Manutencao> manutencaoExistente = manutencaoRepository.findById(id);
        if (manutencaoExistente.isEmpty()) {
            throw new IllegalArgumentException("Manutenção com ID " + id + " não encontrada para excluir.");
        }

        Manutencao manutencao = manutencaoExistente.get();
        if (manutencao.getStatus().equals("EM_ANDAMENTO")) {
            Optional<Veiculo> veiculoOpt = veiculoRepository.findById(manutencao.getVeiculoId());
            if (veiculoOpt.isPresent()) {
                Veiculo veiculo = veiculoOpt.get();
                veiculo.setStatus("DISPONÍVEL");
                veiculoRepository.update(veiculo);
            }
        }

        manutencaoRepository.deleteById(id);
    }

    @Transactional
    public Manutencao finalizarManutencao(Integer id) {
        Optional<Manutencao> manutencaoOpt = manutencaoRepository.findById(id);
        if (manutencaoOpt.isEmpty()) {
            throw new IllegalArgumentException("Manutenção não encontrada.");
        }

        Manutencao manutencao = manutencaoOpt.get();
        if (manutencao.getStatus().equals("FINALIZADA")) {
            throw new IllegalArgumentException("Manutenção já está finalizada.");
        }

        manutencao.setStatus("FINALIZADA");
        manutencaoRepository.update(manutencao);

        Optional<Veiculo> veiculoOpt = veiculoRepository.findById(manutencao.getVeiculoId());
        if (veiculoOpt.isPresent()) {
            Veiculo veiculo = veiculoOpt.get();
            veiculo.setStatus("DISPONÍVEL");
            veiculoRepository.update(veiculo);
        }

        return manutencao;
    }
}

