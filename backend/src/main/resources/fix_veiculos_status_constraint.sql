ALTER TABLE veiculos DROP CONSTRAINT IF EXISTS veiculos_status_check;

ALTER TABLE veiculos ADD CONSTRAINT veiculos_status_check 
CHECK (status IN ('DISPONÍVEL', 'ALUGADO', 'MANUTENÇÃO', 'INDISPONÍVEL'));

