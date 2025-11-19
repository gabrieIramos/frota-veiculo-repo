UPDATE veiculos SET status = 'DISPONÍVEL' WHERE status = 'DISPONIVEL' OR status = 'disponivel' OR status = 'Disponível' OR status = 'Disponivel';
UPDATE veiculos SET status = 'ALUGADO' WHERE status = 'alugado' OR status = 'Alugado';
UPDATE veiculos SET status = 'MANUTENÇÃO' WHERE status = 'MANUTENCAO' OR status = 'manutenção' OR status = 'Manutenção' OR status = 'manutencao' OR status = 'Manutencao' OR status = 'EM_MANUTENCAO' OR status = 'EM_MANUTENÇÃO' OR status = 'EM MANUTENÇÃO';
UPDATE veiculos SET status = 'INDISPONÍVEL' WHERE status = 'INDISPONIVEL' OR status = 'indisponível' OR status = 'Indisponível' OR status = 'indisponivel' OR status = 'Indisponivel' OR status = 'INATIVO' OR status = 'inativo' OR status = 'Inativo';
UPDATE veiculos SET status = 'DISPONÍVEL' WHERE status = 'ATIVO' OR status = 'ativo' OR status = 'Ativo';

ALTER TABLE veiculos DROP CONSTRAINT IF EXISTS veiculos_status_check;

ALTER TABLE veiculos ADD CONSTRAINT veiculos_status_check 
CHECK (status IN ('DISPONÍVEL', 'ALUGADO', 'MANUTENÇÃO', 'INDISPONÍVEL'));

