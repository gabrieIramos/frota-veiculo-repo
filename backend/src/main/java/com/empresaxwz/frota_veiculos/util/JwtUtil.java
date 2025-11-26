package com.empresaxwz.frota_veiculos.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expirationMillis;

    public JwtUtil(@Value("${jwt.secret:default_secret_change_me}") String secret,
                   @Value("${jwt.expiration.seconds:3600}") long expirationSeconds) {
        // Use provided secret bytes (if default used in properties it's insecure)
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMillis = expirationSeconds * 1000L;
    }

    public String generateToken(Integer usuarioId, String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .setSubject(usuarioId.toString())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .claim("email", email)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validateAndGetClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
