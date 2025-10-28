DROP TABLE IF EXISTS motos CASCADE;
DROP TABLE IF EXISTS carros CASCADE;
DROP TABLE IF EXISTS veiculos CASCADE;

CREATE TABLE veiculos (
    id SERIAL PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100) NOT NULL,
    ano INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    tipo_veiculo VARCHAR(10) NOT NULL CHECK (tipo_veiculo IN ('CARRO', 'MOTO'))
);

CREATE TABLE carros (
    veiculo_id INT PRIMARY KEY REFERENCES veiculos(id) ON DELETE CASCADE,
    quantidade_portas INT NOT NULL,
    tipo_combustivel VARCHAR(20) NOT NULL CHECK (tipo_combustivel IN ('GASOLINA', 'ETANOL', 'DIESEL', 'FLEX'))
);

CREATE TABLE motos (
    veiculo_id INT PRIMARY KEY REFERENCES veiculos(id) ON DELETE CASCADE,
    cilindrada INT NOT NULL
);
