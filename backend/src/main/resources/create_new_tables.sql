CREATE TABLE IF NOT EXISTS alugueis (
    id SERIAL PRIMARY KEY,
    veiculo_id INT NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    cliente VARCHAR(100) NOT NULL,
    data_retirada DATE NOT NULL,
    data_devolucao DATE NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    observacoes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'FINALIZADO', 'ATRASADO')),
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS manutencoes (
    id SERIAL PRIMARY KEY,
    veiculo_id INT NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    data_entrada DATE NOT NULL,
    data_prevista_saida DATE NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    oficina VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'EM_ANDAMENTO' CHECK (status IN ('EM_ANDAMENTO', 'FINALIZADA')),
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
);

