package com.empresaxwz.frota_veiculos.controller;

import com.empresaxwz.frota_veiculos.model.Aluguel;
import com.empresaxwz.frota_veiculos.model.Veiculo;
import com.empresaxwz.frota_veiculos.service.AluguelService;
import com.empresaxwz.frota_veiculos.service.VeiculoService;
import com.empresaxwz.frota_veiculos.dto.AluguelRequestDTO;
import com.empresaxwz.frota_veiculos.dto.AluguelResponseDTO;
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
@RequestMapping("/api/alugueis")
@CrossOrigin(origins = "*")
public class AluguelController {

    private final AluguelService aluguelService;
    private final VeiculoService veiculoService;

    @Autowired
    public AluguelController(AluguelService aluguelService, VeiculoService veiculoService) {
        this.aluguelService = aluguelService;
        this.veiculoService = veiculoService;
    }

    @PostMapping
    public ResponseEntity<AluguelResponseDTO> cadastrarAluguel(@Valid @RequestBody AluguelRequestDTO aluguelDTO) {
        Aluguel aluguel = new Aluguel(
                aluguelDTO.getVeiculoId(),
                aluguelDTO.getCliente(),
                aluguelDTO.getDataRetirada(),
                aluguelDTO.getDataDevolucao(),
                aluguelDTO.getValor(),
                aluguelDTO.getObservacoes(),
                aluguelDTO.getStatus(),
                aluguelDTO.getUsuarioId()
        );
        try {
            Aluguel novoAluguel = aluguelService.cadastrarAluguel(aluguel);
            Optional<Veiculo> veiculoOpt = veiculoService.consultarVeiculoPorId(novoAluguel.getVeiculoId());
            String veiculoModelo = veiculoOpt.map(Veiculo::getModelo).orElse("");
            String veiculoFabricante = veiculoOpt.map(Veiculo::getFabricante).orElse("");
            return ResponseEntity.status(HttpStatus.CREATED).body(AluguelResponseDTO.fromEntity(novoAluguel, veiculoModelo, veiculoFabricante));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<AluguelResponseDTO>> listarTodosAlugueis(@RequestParam(required = false) Integer usuarioId) {
        List<Aluguel> alugueis;
        
        if (usuarioId != null) {
            alugueis = aluguelService.listarAlugueisPorUsuario(usuarioId);
        } else {
            alugueis = aluguelService.listarTodosAlugueis();
        }

        List<AluguelResponseDTO> dtos = alugueis.stream()
                .map(aluguel -> {
                    Optional<Veiculo> veiculoOpt = veiculoService.consultarVeiculoPorId(aluguel.getVeiculoId());
                    String veiculoModelo = veiculoOpt.map(Veiculo::getModelo).orElse("");
                    String veiculoFabricante = veiculoOpt.map(Veiculo::getFabricante).orElse("");
                    return AluguelResponseDTO.fromEntity(aluguel, veiculoModelo, veiculoFabricante);
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AluguelResponseDTO> consultarAluguelPorId(@PathVariable Integer id) {
        Optional<Aluguel> aluguel = aluguelService.consultarAluguelPorId(id);
        if (aluguel.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluguel não encontrado com ID: " + id);
        }
        Aluguel a = aluguel.get();
        Optional<Veiculo> veiculoOpt = veiculoService.consultarVeiculoPorId(a.getVeiculoId());
        String veiculoModelo = veiculoOpt.map(Veiculo::getModelo).orElse("");
        String veiculoFabricante = veiculoOpt.map(Veiculo::getFabricante).orElse("");
        return ResponseEntity.ok(AluguelResponseDTO.fromEntity(a, veiculoModelo, veiculoFabricante));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AluguelResponseDTO> atualizarAluguel(@PathVariable Integer id, @Valid @RequestBody AluguelRequestDTO aluguelDTO) {
        Aluguel aluguel = new Aluguel(
                id,
                aluguelDTO.getVeiculoId(),
                aluguelDTO.getCliente(),
                aluguelDTO.getDataRetirada(),
                aluguelDTO.getDataDevolucao(),
                aluguelDTO.getValor(),
                aluguelDTO.getObservacoes(),
                aluguelDTO.getStatus(),
                aluguelDTO.getUsuarioId()
        );
        try {
            Aluguel aluguelAtualizado = aluguelService.atualizarAluguel(id, aluguel);
            Optional<Veiculo> veiculoOpt = veiculoService.consultarVeiculoPorId(aluguelAtualizado.getVeiculoId());
            String veiculoModelo = veiculoOpt.map(Veiculo::getModelo).orElse("");
            String veiculoFabricante = veiculoOpt.map(Veiculo::getFabricante).orElse("");
            return ResponseEntity.ok(AluguelResponseDTO.fromEntity(aluguelAtualizado, veiculoModelo, veiculoFabricante));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar aluguel: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/finalizar")
    public ResponseEntity<AluguelResponseDTO> finalizarAluguel(@PathVariable Integer id) {
        try {
            Aluguel aluguel = aluguelService.finalizarAluguel(id);
            Optional<Veiculo> veiculoOpt = veiculoService.consultarVeiculoPorId(aluguel.getVeiculoId());
            String veiculoModelo = veiculoOpt.map(Veiculo::getModelo).orElse("");
            String veiculoFabricante = veiculoOpt.map(Veiculo::getFabricante).orElse("");
            return ResponseEntity.ok(AluguelResponseDTO.fromEntity(aluguel, veiculoModelo, veiculoFabricante));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao finalizar aluguel: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirAluguel(@PathVariable Integer id) {
        try {
            aluguelService.excluirAluguel(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao excluir aluguel: " + e.getMessage());
        }
    }
}

