DROP TABLE IF EXISTS motos CASCADE;
DROP TABLE IF EXISTS carros CASCADE;
DROP TABLE IF EXISTS veiculos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    empresa VARCHAR(100) NOT NULL
);

CREATE TABLE veiculos (
    id SERIAL PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100) NOT NULL,
    ano INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO')),
    tipo_veiculo VARCHAR(10) NOT NULL CHECK (tipo_veiculo IN ('CARRO', 'MOTO'))
);

CREATE TABLE carros (
    veiculo_id INT PRIMARY KEY REFERENCES veiculos(id) ON DELETE CASCADE,
    quantidade_portas INT NOT NULL CHECK (quantidade_portas >= 1 AND quantidade_portas <= 8),
    tipo_combustivel VARCHAR(20) NOT NULL CHECK (tipo_combustivel IN ('GASOLINA', 'ETANOL', 'DIESEL', 'FLEX'))
);

CREATE TABLE motos (
    veiculo_id INT PRIMARY KEY REFERENCES veiculos(id) ON DELETE CASCADE,
    cilindrada INT NOT NULL
);
