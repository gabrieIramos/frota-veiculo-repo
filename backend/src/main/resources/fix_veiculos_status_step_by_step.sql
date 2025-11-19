-- Passo 1: Verificar quais status existem atualmente
SELECT DISTINCT status FROM veiculos;

-- Passo 2: Atualizar todos os registros para usar os novos valores de status
-- (Execute estes comandos baseado nos valores que apareceram no passo 1)

-- Se existir 'ATIVO' ou variações, converte para 'DISPONÍVEL'
UPDATE veiculos SET status = 'DISPONÍVEL' 
WHERE UPPER(status) = 'ATIVO' 
   OR status = 'ativo' 
   OR status = 'Ativo'
   OR UPPER(TRIM(status)) = 'ATIVO';

-- Se existir 'INATIVO' ou variações, converte para 'INDISPONÍVEL'
UPDATE veiculos SET status = 'INDISPONÍVEL' 
WHERE UPPER(status) = 'INATIVO' 
   OR status = 'inativo' 
   OR status = 'Inativo'
   OR UPPER(TRIM(status)) = 'INATIVO';

-- Se existir 'DISPONIVEL' (sem acento), converte para 'DISPONÍVEL'
UPDATE veiculos SET status = 'DISPONÍVEL' 
WHERE UPPER(REPLACE(status, 'Í', 'I')) = 'DISPONIVEL'
   AND status != 'DISPONÍVEL';

-- Se existir 'MANUTENCAO' (sem acento), converte para 'MANUTENÇÃO'
UPDATE veiculos SET status = 'MANUTENÇÃO' 
WHERE UPPER(REPLACE(status, 'Ã', 'A')) = 'MANUTENCAO'
   OR UPPER(REPLACE(status, 'Ç', 'C')) = 'MANUTENCAO'
   AND status != 'MANUTENÇÃO';

-- Se existir 'INDISPONIVEL' (sem acento), converte para 'INDISPONÍVEL'
UPDATE veiculos SET status = 'INDISPONÍVEL' 
WHERE UPPER(REPLACE(status, 'Í', 'I')) = 'INDISPONIVEL'
   AND status != 'INDISPONÍVEL';

-- Passo 3: Remover o constraint antigo
ALTER TABLE veiculos DROP CONSTRAINT IF EXISTS veiculos_status_check;

-- Passo 4: Adicionar o novo constraint
ALTER TABLE veiculos ADD CONSTRAINT veiculos_status_check 
CHECK (status IN ('DISPONÍVEL', 'ALUGADO', 'MANUTENÇÃO', 'INDISPONÍVEL'));

