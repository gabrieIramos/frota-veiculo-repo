-- Script seguro para corrigir o status dos veículos
-- Execute este script passo a passo

-- 1. Primeiro, veja quais status existem atualmente
SELECT DISTINCT status, COUNT(*) as total FROM veiculos GROUP BY status;

-- 2. Atualizar status 'ATIVO' para 'DISPONÍVEL'
UPDATE veiculos SET status = 'DISPONÍVEL' WHERE status = 'ATIVO';

-- 3. Atualizar status 'INATIVO' para 'INDISPONÍVEL'  
UPDATE veiculos SET status = 'INDISPONÍVEL' WHERE status = 'INATIVO';

-- 4. Garantir que todos os status estão corretos (case-insensitive)
UPDATE veiculos SET status = 'DISPONÍVEL' WHERE UPPER(status) = 'DISPONÍVEL' OR UPPER(status) = 'DISPONIVEL';
UPDATE veiculos SET status = 'ALUGADO' WHERE UPPER(status) = 'ALUGADO';
UPDATE veiculos SET status = 'MANUTENÇÃO' WHERE UPPER(status) = 'MANUTENÇÃO' OR UPPER(status) = 'MANUTENCAO';
UPDATE veiculos SET status = 'INDISPONÍVEL' WHERE UPPER(status) = 'INDISPONÍVEL' OR UPPER(status) = 'INDISPONIVEL';

-- 5. Remover o constraint antigo
ALTER TABLE veiculos DROP CONSTRAINT IF EXISTS veiculos_status_check;

-- 6. Adicionar o novo constraint
ALTER TABLE veiculos ADD CONSTRAINT veiculos_status_check 
CHECK (status IN ('DISPONÍVEL', 'ALUGADO', 'MANUTENÇÃO', 'INDISPONÍVEL'));

