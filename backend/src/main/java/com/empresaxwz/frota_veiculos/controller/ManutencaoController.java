package com.empresaxwz.frota_veiculos.controller;

import com.empresaxwz.frota_veiculos.model.Manutencao;
import com.empresaxwz.frota_veiculos.model.Veiculo;
import com.empresaxwz.frota_veiculos.service.ManutencaoService;
import com.empresaxwz.frota_veiculos.service.VeiculoService;
import com.empresaxwz.frota_veiculos.dto.ManutencaoRequestDTO;
import com.empresaxwz.frota_veiculos.dto.ManutencaoResponseDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manutencoes")
@CrossOrigin(origins = "*")
public class ManutencaoController {

    private final ManutencaoService manutencaoService;
    private final VeiculoService veiculoService;

    @Autowired
    public ManutencaoController(ManutencaoService manutencaoService, VeiculoService veiculoService) {
        this.manutencaoService = manutencaoService;
        this.veiculoService = veiculoService;
    }

    @PostMapping
    public ResponseEntity<ManutencaoResponseDTO> cadastrarManutencao(@Valid @RequestBody ManutencaoRequestDTO manutencaoDTO) {
        Manutencao manutencao = new Manutencao(
                manutencaoDTO.getVeiculoId(),
                manutencaoDTO.getTipo(),
                manutencaoDTO.getDataEntrada(),
                manutencaoDTO.getDataPrevistaSaida(),
                manutencaoDTO.getPreco(),
                manutencaoDTO.getDescricao(),
                manutencaoDTO.getOficina(),
                manutencaoDTO.getStatus(),
                manutencaoDTO.getUsuarioId()
        );
        try {
            Manutencao novaManutencao = manutencaoService.cadastrarManutencao(manutencao);
            Optional<Veiculo> veiculoOpt = veiculoService.consultarVeiculoPorId(novaManutencao.getVeiculoId());
            String veiculoModelo = veiculoOpt.map(Veiculo::getModelo).orElse("");
            String veiculoFabricante = veiculoOpt.map(Veiculo::getFabricante).orElse("");
            return ResponseEntity.status(HttpStatus.CREATED).body(ManutencaoResponseDTO.fromEntity(novaManutencao, veiculoModelo, veiculoFabricante));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ManutencaoResponseDTO>> listarTodasManutencoes(@RequestParam(required = false) Integer usuarioId) {
        List<Manutencao> manutencoes;
        
        if (usuarioId != null) {
            manutencoes = manutencaoService.listarManutencoesPorUsuario(usuarioId);
        } else {
            manutencoes = manutencaoService.listarTodasManutencoes();
        }

        List<ManutencaoResponseDTO> dtos = manutencoes.stream()
                .map(manutencao -> {
                    Optional<Veiculo> veiculoOpt = veiculoService.consultarVeiculoPorId(manutencao.getVeiculoId());
                    String veiculoModelo = veiculoOpt.map(Veiculo::getModelo).orElse("");
                    String veiculoFabricante = veiculoOpt.map(Veiculo::getFabricante).orElse("");
                    return ManutencaoResponseDTO.fromEntity(manutencao, veiculoModelo, veiculoFabricante);
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ManutencaoResponseDTO> consultarManutencaoPorId(@PathVariable Integer id) {
        Optional<Manutencao> manutencao = manutencaoService.consultarManutencaoPorId(id);
        if (manutencao.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Manutenção não encontrada com ID: " + id);
        }
        Manutencao m = manutencao.get();
        Optional<Veiculo> veiculoOpt = veiculoService.consultarVeiculoPorId(m.getVeiculoId());
        String veiculoModelo = veiculoOpt.map(Veiculo::getModelo).orElse("");
        String veiculoFabricante = veiculoOpt.map(Veiculo::getFabricante).orElse("");
        return ResponseEntity.ok(ManutencaoResponseDTO.fromEntity(m, veiculoModelo, veiculoFabricante));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ManutencaoResponseDTO> atualizarManutencao(@PathVariable Integer id, @Valid @RequestBody ManutencaoRequestDTO manutencaoDTO) {
        Manutencao manutencao = new Manutencao(
                id,
                manutencaoDTO.getVeiculoId(),
                manutencaoDTO.getTipo(),
                manutencaoDTO.getDataEntrada(),
                manutencaoDTO.getDataPrevistaSaida(),
                manutencaoDTO.getPreco(),
                manutencaoDTO.getDescricao(),
                manutencaoDTO.getOficina(),
                manutencaoDTO.getStatus(),
                manutencaoDTO.getUsuarioId()
        );
        try {
            Manutencao manutencaoAtualizada = manutencaoService.atualizarManutencao(id, manutencao);
            Optional<Veiculo> veiculoOpt = veiculoService.consultarVeiculoPorId(manutencaoAtualizada.getVeiculoId());
            String veiculoModelo = veiculoOpt.map(Veiculo::getModelo).orElse("");
            String veiculoFabricante = veiculoOpt.map(Veiculo::getFabricante).orElse("");
            return ResponseEntity.ok(ManutencaoResponseDTO.fromEntity(manutencaoAtualizada, veiculoModelo, veiculoFabricante));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar manutenção: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/finalizar")
    public ResponseEntity<ManutencaoResponseDTO> finalizarManutencao(@PathVariable Integer id) {
        try {
            Manutencao manutencao = manutencaoService.finalizarManutencao(id);
            Optional<Veiculo> veiculoOpt = veiculoService.consultarVeiculoPorId(manutencao.getVeiculoId());
            String veiculoModelo = veiculoOpt.map(Veiculo::getModelo).orElse("");
            String veiculoFabricante = veiculoOpt.map(Veiculo::getFabricante).orElse("");
            return ResponseEntity.ok(ManutencaoResponseDTO.fromEntity(manutencao, veiculoModelo, veiculoFabricante));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao finalizar manutenção: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirManutencao(@PathVariable Integer id) {
        try {
            manutencaoService.excluirManutencao(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao excluir manutenção: " + e.getMessage());
        }
    }
}

