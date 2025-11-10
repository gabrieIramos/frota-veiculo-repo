package com.empresaxwz.frota_veiculos.controller;

import com.empresaxwz.frota_veiculos.dto.AuthResponseDTO;
import com.empresaxwz.frota_veiculos.dto.LoginRequestDTO;
import com.empresaxwz.frota_veiculos.dto.RegisterRequestDTO;
import com.empresaxwz.frota_veiculos.model.Usuario;
import com.empresaxwz.frota_veiculos.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService usuarioService;

    @Autowired
    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> registrar(@Valid @RequestBody RegisterRequestDTO registerDTO) {
        try {
            Usuario usuario = new Usuario(
                    registerDTO.getNome(),
                    registerDTO.getEmail(),
                    registerDTO.getSenha(),
                    registerDTO.getEmpresa()
            );

            Usuario novoUsuario = usuarioService.cadastrarUsuario(usuario);

            AuthResponseDTO response = new AuthResponseDTO(
                    novoUsuario.getId(),
                    novoUsuario.getNome(),
                    novoUsuario.getEmail(),
                    novoUsuario.getEmpresa(),
                    "Cadastro realizado com sucesso!"
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginDTO) {
        Optional<Usuario> usuarioOpt = usuarioService.autenticar(loginDTO.getEmail(), loginDTO.getSenha());

        if (usuarioOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha inválidos");
        }

        Usuario usuario = usuarioOpt.get();

        AuthResponseDTO response = new AuthResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getEmpresa(),
                "Login realizado com sucesso!"
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<AuthResponseDTO> buscarUsuario(@PathVariable Integer id) {
        Optional<Usuario> usuarioOpt = usuarioService.buscarPorId(id);

        if (usuarioOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }

        Usuario usuario = usuarioOpt.get();

        AuthResponseDTO response = new AuthResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getEmpresa()
        );

        return ResponseEntity.ok(response);
    }
}
