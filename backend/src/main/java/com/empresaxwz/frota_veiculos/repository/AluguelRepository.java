package com.empresaxwz.frota_veiculos.repository;

import com.empresaxwz.frota_veiculos.model.Aluguel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.*;
import java.util.List;
import java.util.Optional;

@Repository
public class AluguelRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public AluguelRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private RowMapper<Aluguel> aluguelRowMapper = new RowMapper<Aluguel>() {
        @Override
        public Aluguel mapRow(ResultSet rs, int rowNum) throws SQLException {
            Aluguel aluguel = new Aluguel();
            aluguel.setId(rs.getInt("id"));
            aluguel.setVeiculoId(rs.getInt("veiculo_id"));
            aluguel.setCliente(rs.getString("cliente"));
            Date dataRetirada = rs.getDate("data_retirada");
            if (dataRetirada != null) {
                aluguel.setDataRetirada(dataRetirada.toLocalDate());
            }
            Date dataDevolucao = rs.getDate("data_devolucao");
            if (dataDevolucao != null) {
                aluguel.setDataDevolucao(dataDevolucao.toLocalDate());
            }
            aluguel.setValor(rs.getDouble("valor"));
            aluguel.setObservacoes(rs.getString("observacoes"));
            aluguel.setStatus(rs.getString("status"));
            aluguel.setUsuarioId(rs.getInt("usuario_id"));
            return aluguel;
        }
    };

    @Transactional
    public Aluguel save(Aluguel aluguel) {
        String sql = "INSERT INTO alugueis (veiculo_id, cliente, data_retirada, data_devolucao, valor, observacoes, status, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
            ps.setInt(1, aluguel.getVeiculoId());
            ps.setString(2, aluguel.getCliente());
            ps.setDate(3, Date.valueOf(aluguel.getDataRetirada()));
            ps.setDate(4, Date.valueOf(aluguel.getDataDevolucao()));
            ps.setDouble(5, aluguel.getValor());
            ps.setString(6, aluguel.getObservacoes());
            ps.setString(7, aluguel.getStatus());
            ps.setInt(8, aluguel.getUsuarioId());
            return ps;
        }, keyHolder);

        Integer aluguelId = keyHolder.getKey() != null ? keyHolder.getKey().intValue() : null;
        if (aluguelId == null) {
            throw new RuntimeException("Erro ao obter ID do aluguel criado");
        }
        aluguel.setId(aluguelId);
        return aluguel;
    }

    public List<Aluguel> findAll() {
        String sql = "SELECT * FROM alugueis ORDER BY data_retirada DESC";
        return jdbcTemplate.query(sql, aluguelRowMapper);
    }

    public List<Aluguel> findByUsuarioId(Integer usuarioId) {
        String sql = "SELECT * FROM alugueis WHERE usuario_id = ? ORDER BY data_retirada DESC";
        return jdbcTemplate.query(sql, aluguelRowMapper, usuarioId);
    }

    public Optional<Aluguel> findById(Integer id) {
        String sql = "SELECT * FROM alugueis WHERE id = ?";
        List<Aluguel> resultados = jdbcTemplate.query(sql, aluguelRowMapper, id);
        return resultados.stream().findFirst();
    }

    @Transactional
    public void update(Aluguel aluguel) {
        String sql = "UPDATE alugueis SET veiculo_id = ?, cliente = ?, data_retirada = ?, data_devolucao = ?, valor = ?, observacoes = ?, status = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                aluguel.getVeiculoId(),
                aluguel.getCliente(),
                Date.valueOf(aluguel.getDataRetirada()),
                Date.valueOf(aluguel.getDataDevolucao()),
                aluguel.getValor(),
                aluguel.getObservacoes(),
                aluguel.getStatus(),
                aluguel.getId());
    }

    @Transactional
    public void deleteById(Integer id) {
        String sql = "DELETE FROM alugueis WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public List<Aluguel> findAlugueisAtrasados() {
        String sql = "SELECT * FROM alugueis WHERE status = 'ATIVO' AND data_devolucao < CURRENT_DATE";
        return jdbcTemplate.query(sql, aluguelRowMapper);
    }

    public List<Aluguel> findAlugueisParaFinalizar() {
        String sql = "SELECT * FROM alugueis WHERE status = 'ATIVO' AND data_devolucao <= CURRENT_DATE";
        return jdbcTemplate.query(sql, aluguelRowMapper);
    }
}

