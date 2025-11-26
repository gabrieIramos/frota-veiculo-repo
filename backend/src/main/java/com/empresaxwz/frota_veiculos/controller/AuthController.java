package com.empresaxwz.frota_veiculos.controller;

import com.empresaxwz.frota_veiculos.dto.AuthResponseDTO;
import com.empresaxwz.frota_veiculos.dto.LoginRequestDTO;
import com.empresaxwz.frota_veiculos.dto.RegisterRequestDTO;
import com.empresaxwz.frota_veiculos.model.Usuario;
import com.empresaxwz.frota_veiculos.service.UsuarioService;
import com.empresaxwz.frota_veiculos.util.JwtUtil;
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
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(UsuarioService usuarioService, JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
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

            String token = jwtUtil.generateToken(novoUsuario.getId(), novoUsuario.getEmail());

            AuthResponseDTO response = new AuthResponseDTO(
                    novoUsuario.getId(),
                    novoUsuario.getNome(),
                    novoUsuario.getEmail(),
                    novoUsuario.getEmpresa()
            );
            response.setToken(token);
            response.setMensagem("Cadastro realizado com sucesso!");

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

        String token = jwtUtil.generateToken(usuario.getId(), usuario.getEmail());

        AuthResponseDTO response = new AuthResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getEmpresa()
        );
        response.setToken(token);
        response.setMensagem("Login realizado com sucesso!");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<AuthResponseDTO> validateToken(@RequestHeader(name = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token ausente ou inválido");
        }

        String token = authorization.substring(7);
        try {
            var claims = jwtUtil.validateAndGetClaims(token);
            Integer usuarioId = Integer.valueOf(claims.getSubject());

            Optional<Usuario> usuarioOpt = usuarioService.buscarPorId(usuarioId);
            if (usuarioOpt.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado");
            }

            Usuario usuario = usuarioOpt.get();
            AuthResponseDTO response = new AuthResponseDTO(
                    usuario.getId(),
                    usuario.getNome(),
                    usuario.getEmail(),
                    usuario.getEmpresa()
            );
            response.setMensagem("Sessão válida");
            response.setToken(token);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado");
        }
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
