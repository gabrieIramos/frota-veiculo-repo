package com.empresaxwz.frota_veiculos.controller;


import com.empresaxwz.frota_veiculos.model.Veiculo;
import com.empresaxwz.frota_veiculos.model.Carro;
import com.empresaxwz.frota_veiculos.model.Moto;
import com.empresaxwz.frota_veiculos.service.VeiculoService;
import com.empresaxwz.frota_veiculos.dto.CarroRequestDTO;
import com.empresaxwz.frota_veiculos.dto.MotoRequestDTO;
import com.empresaxwz.frota_veiculos.dto.VeiculoResponseDTO;
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
@RequestMapping("/api/veiculos")
@CrossOrigin(origins = "*")
public class VeiculoController {

    private final VeiculoService veiculoService;

    @Autowired
    public VeiculoController(VeiculoService veiculoService) {
        this.veiculoService = veiculoService;
    }


    @PostMapping("/carros")
    public ResponseEntity<VeiculoResponseDTO> cadastrarCarro(@Valid @RequestBody CarroRequestDTO carroDTO) {

        Carro carro = new Carro(
                carroDTO.getModelo(),
                carroDTO.getFabricante(),
                carroDTO.getAno(),
                carroDTO.getPreco(),
                carroDTO.getQuantidadePortas(),
                carroDTO.getTipoCombustivel()
        );
        try {
            Carro novoCarro = (Carro) veiculoService.cadastrarVeiculo(carro);

            return ResponseEntity.status(HttpStatus.CREATED).body(VeiculoResponseDTO.fromEntity(novoCarro));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/motos")
    public ResponseEntity<VeiculoResponseDTO> cadastrarMoto(@Valid @RequestBody MotoRequestDTO motoDTO) {
        Moto moto = new Moto(
                motoDTO.getModelo(),
                motoDTO.getFabricante(),
                motoDTO.getAno(),
                motoDTO.getPreco(),
                motoDTO.getCilindrada()
        );
        try {
            Moto novaMoto = (Moto) veiculoService.cadastrarVeiculo(moto);
            return ResponseEntity.status(HttpStatus.CREATED).body(VeiculoResponseDTO.fromEntity(novaMoto));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<VeiculoResponseDTO>> listarTodosVeiculos() {
        List<Veiculo> veiculos = veiculoService.listarTodosVeiculos();

        List<VeiculoResponseDTO> dtos = veiculos.stream()
                .map(VeiculoResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VeiculoResponseDTO> consultarVeiculoPorId(@PathVariable Integer id) {
        Optional<Veiculo> veiculo = veiculoService.consultarVeiculoPorId(id);
        return veiculo.map(v -> ResponseEntity.ok(VeiculoResponseDTO.fromEntity(v)))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado com ID: " + id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<VeiculoResponseDTO>> consultarVeiculosPorCriterios(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String modelo,
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) String fabricante,
            @RequestParam(required = false) Double precoMinimo,
            @RequestParam(required = false) Double precoMaximo) {

        List<Veiculo> veiculos = veiculoService.consultarVeiculosPorCriterios(tipo, modelo, ano, fabricante, precoMinimo, precoMaximo);
        List<VeiculoResponseDTO> dtos = veiculos.stream()
                .map(VeiculoResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/carros/{id}")
    public ResponseEntity<VeiculoResponseDTO> atualizarCarro(@PathVariable Integer id, @Valid @RequestBody CarroRequestDTO carroDTO) {
        Carro carro = new Carro(
                id,
                carroDTO.getModelo(),
                carroDTO.getFabricante(),
                carroDTO.getAno(),
                carroDTO.getPreco(),
                carroDTO.getQuantidadePortas(),
                carroDTO.getTipoCombustivel()
        );
        try {
            Veiculo veiculoAtualizado = veiculoService.atualizarVeiculo(id, carro);
            return ResponseEntity.ok(VeiculoResponseDTO.fromEntity(veiculoAtualizado));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar veículo: " + e.getMessage());
        }
    }

    @PutMapping("/motos/{id}")
    public ResponseEntity<VeiculoResponseDTO> atualizarMoto(@PathVariable Integer id, @Valid @RequestBody MotoRequestDTO motoDTO) {
                Moto moto = new Moto(
                id,
                motoDTO.getModelo(),
                motoDTO.getFabricante(),
                motoDTO.getAno(),
                motoDTO.getPreco(),
                motoDTO.getCilindrada()
        );
        try {
            Veiculo veiculoAtualizado = veiculoService.atualizarVeiculo(id, moto);
            return ResponseEntity.ok(VeiculoResponseDTO.fromEntity(veiculoAtualizado));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar veículo: " + e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirVeiculo(@PathVariable Integer id) {
        try {
            veiculoService.excluirVeiculo(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao excluir veículo: " + e.getMessage());
        }
    }
}