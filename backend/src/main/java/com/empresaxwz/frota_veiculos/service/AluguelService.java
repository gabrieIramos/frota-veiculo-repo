package com.empresaxwz.frota_veiculos.service;

import com.empresaxwz.frota_veiculos.model.Aluguel;
import com.empresaxwz.frota_veiculos.model.Veiculo;
import com.empresaxwz.frota_veiculos.repository.AluguelRepository;
import com.empresaxwz.frota_veiculos.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AluguelService {

    private final AluguelRepository aluguelRepository;
    private final VeiculoRepository veiculoRepository;

    @Autowired
    public AluguelService(AluguelRepository aluguelRepository, VeiculoRepository veiculoRepository) {
        this.aluguelRepository = aluguelRepository;
        this.veiculoRepository = veiculoRepository;
    }

    private void validarStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status do aluguel é obrigatório.");
        }
        if (!status.equals("ATIVO") && !status.equals("FINALIZADO") && !status.equals("ATRASADO")) {
            throw new IllegalArgumentException("Status deve ser ATIVO, FINALIZADO ou ATRASADO.");
        }
    }

    @Transactional
    public Aluguel cadastrarAluguel(Aluguel aluguel) {
        if (aluguel.getDataRetirada() == null) {
            throw new IllegalArgumentException("Data de retirada é obrigatória.");
        }
        if (aluguel.getDataDevolucao() == null) {
            throw new IllegalArgumentException("Data de devolução é obrigatória.");
        }
        if (aluguel.getDataDevolucao().isBefore(aluguel.getDataRetirada())) {
            throw new IllegalArgumentException("Data de devolução deve ser posterior à data de retirada.");
        }
        if (aluguel.getValor() <= 0) {
            throw new IllegalArgumentException("Valor do aluguel deve ser positivo.");
        }
        if (aluguel.getCliente() == null || aluguel.getCliente().trim().isEmpty()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }
        validarStatus(aluguel.getStatus());

        Optional<Veiculo> veiculoOpt = veiculoRepository.findById(aluguel.getVeiculoId());
        if (veiculoOpt.isEmpty()) {
            throw new IllegalArgumentException("Veículo não encontrado.");
        }

        Veiculo veiculo = veiculoOpt.get();
        if (!veiculo.getStatus().equals("DISPONÍVEL")) {
            throw new IllegalArgumentException("Veículo não está disponível para aluguel.");
        }

        Aluguel novoAluguel = aluguelRepository.save(aluguel);

        veiculo.setStatus("ALUGADO");
        veiculoRepository.update(veiculo);

        return novoAluguel;
    }

    public List<Aluguel> listarTodosAlugueis() {
        return aluguelRepository.findAll();
    }

    public List<Aluguel> listarAlugueisPorUsuario(Integer usuarioId) {
        return aluguelRepository.findByUsuarioId(usuarioId);
    }

    public Optional<Aluguel> consultarAluguelPorId(Integer id) {
        return aluguelRepository.findById(id);
    }

    @Transactional
    public Aluguel atualizarAluguel(Integer id, Aluguel aluguelAtualizado) {
        Optional<Aluguel> aluguelExistente = aluguelRepository.findById(id);
        if (aluguelExistente.isEmpty()) {
            throw new IllegalArgumentException("Aluguel com ID " + id + " não encontrado para atualização.");
        }

        if (aluguelAtualizado.getDataRetirada() == null) {
            throw new IllegalArgumentException("Data de retirada é obrigatória.");
        }
        if (aluguelAtualizado.getDataDevolucao() == null) {
            throw new IllegalArgumentException("Data de devolução é obrigatória.");
        }
        if (aluguelAtualizado.getDataDevolucao().isBefore(aluguelAtualizado.getDataRetirada())) {
            throw new IllegalArgumentException("Data de devolução deve ser posterior à data de retirada.");
        }
        if (aluguelAtualizado.getValor() <= 0) {
            throw new IllegalArgumentException("Valor do aluguel deve ser positivo.");
        }
        validarStatus(aluguelAtualizado.getStatus());

        aluguelAtualizado.setId(id);
        aluguelRepository.update(aluguelAtualizado);

        atualizarStatusAluguel(aluguelAtualizado);

        return aluguelAtualizado;
    }

    @Transactional
    public void excluirAluguel(Integer id) {
        Optional<Aluguel> aluguelExistente = aluguelRepository.findById(id);
        if (aluguelExistente.isEmpty()) {
            throw new IllegalArgumentException("Aluguel com ID " + id + " não encontrado para excluir.");
        }

        Aluguel aluguel = aluguelExistente.get();
        if (aluguel.getStatus().equals("ATIVO")) {
            Optional<Veiculo> veiculoOpt = veiculoRepository.findById(aluguel.getVeiculoId());
            if (veiculoOpt.isPresent()) {
                Veiculo veiculo = veiculoOpt.get();
                veiculo.setStatus("DISPONÍVEL");
                veiculoRepository.update(veiculo);
            }
        }

        aluguelRepository.deleteById(id);
    }

    @Transactional
    public Aluguel finalizarAluguel(Integer id) {
        Optional<Aluguel> aluguelOpt = aluguelRepository.findById(id);
        if (aluguelOpt.isEmpty()) {
            throw new IllegalArgumentException("Aluguel não encontrado.");
        }

        Aluguel aluguel = aluguelOpt.get();
        if (aluguel.getStatus().equals("FINALIZADO")) {
            throw new IllegalArgumentException("Aluguel já está finalizado.");
        }

        aluguel.setStatus("FINALIZADO");
        aluguelRepository.update(aluguel);

        Optional<Veiculo> veiculoOpt = veiculoRepository.findById(aluguel.getVeiculoId());
        if (veiculoOpt.isPresent()) {
            Veiculo veiculo = veiculoOpt.get();
            veiculo.setStatus("DISPONÍVEL");
            veiculoRepository.update(veiculo);
        }

        return aluguel;
    }

    private void atualizarStatusAluguel(Aluguel aluguel) {
        if (aluguel.getStatus().equals("ATIVO")) {
            if (aluguel.getDataDevolucao().isBefore(LocalDate.now())) {
                aluguel.setStatus("ATRASADO");
                aluguelRepository.update(aluguel);
            }
        }
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void atualizarAlugueisAtrasados() {
        List<Aluguel> alugueisAtrasados = aluguelRepository.findAlugueisAtrasados();
        for (Aluguel aluguel : alugueisAtrasados) {
            aluguel.setStatus("ATRASADO");
            aluguelRepository.update(aluguel);
        }
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void finalizarAlugueisVencidos() {
        List<Aluguel> alugueisParaFinalizar = aluguelRepository.findAlugueisParaFinalizar();
        for (Aluguel aluguel : alugueisParaFinalizar) {
            if (aluguel.getDataDevolucao().isBefore(LocalDate.now()) || aluguel.getDataDevolucao().equals(LocalDate.now())) {
                Optional<Veiculo> veiculoOpt = veiculoRepository.findById(aluguel.getVeiculoId());
                if (veiculoOpt.isPresent()) {
                    Veiculo veiculo = veiculoOpt.get();
                    veiculo.setStatus("DISPONÍVEL");
                    veiculoRepository.update(veiculo);
                }
            }
        }
    }
}

