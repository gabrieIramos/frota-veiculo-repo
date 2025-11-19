package com.empresaxwz.frota_veiculos.repository;

import com.empresaxwz.frota_veiculos.model.Manutencao;
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
public class ManutencaoRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ManutencaoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private RowMapper<Manutencao> manutencaoRowMapper = new RowMapper<Manutencao>() {
        @Override
        public Manutencao mapRow(ResultSet rs, int rowNum) throws SQLException {
            Manutencao manutencao = new Manutencao();
            manutencao.setId(rs.getInt("id"));
            manutencao.setVeiculoId(rs.getInt("veiculo_id"));
            manutencao.setTipo(rs.getString("tipo"));
            Date dataEntrada = rs.getDate("data_entrada");
            if (dataEntrada != null) {
                manutencao.setDataEntrada(dataEntrada.toLocalDate());
            }
            Date dataPrevistaSaida = rs.getDate("data_prevista_saida");
            if (dataPrevistaSaida != null) {
                manutencao.setDataPrevistaSaida(dataPrevistaSaida.toLocalDate());
            }
            manutencao.setPreco(rs.getDouble("preco"));
            manutencao.setDescricao(rs.getString("descricao"));
            manutencao.setOficina(rs.getString("oficina"));
            manutencao.setStatus(rs.getString("status"));
            manutencao.setUsuarioId(rs.getInt("usuario_id"));
            return manutencao;
        }
    };

    @Transactional
    public Manutencao save(Manutencao manutencao) {
        String sql = "INSERT INTO manutencoes (veiculo_id, tipo, data_entrada, data_prevista_saida, preco, descricao, oficina, status, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
            ps.setInt(1, manutencao.getVeiculoId());
            ps.setString(2, manutencao.getTipo());
            ps.setDate(3, Date.valueOf(manutencao.getDataEntrada()));
            ps.setDate(4, Date.valueOf(manutencao.getDataPrevistaSaida()));
            ps.setDouble(5, manutencao.getPreco());
            ps.setString(6, manutencao.getDescricao());
            ps.setString(7, manutencao.getOficina());
            ps.setString(8, manutencao.getStatus());
            ps.setInt(9, manutencao.getUsuarioId());
            return ps;
        }, keyHolder);

        Integer manutencaoId = keyHolder.getKey() != null ? keyHolder.getKey().intValue() : null;
        if (manutencaoId == null) {
            throw new RuntimeException("Erro ao obter ID da manutenção criada");
        }
        manutencao.setId(manutencaoId);
        return manutencao;
    }

    public List<Manutencao> findAll() {
        String sql = "SELECT * FROM manutencoes ORDER BY data_entrada DESC";
        return jdbcTemplate.query(sql, manutencaoRowMapper);
    }

    public List<Manutencao> findByUsuarioId(Integer usuarioId) {
        String sql = "SELECT * FROM manutencoes WHERE usuario_id = ? ORDER BY data_entrada DESC";
        return jdbcTemplate.query(sql, manutencaoRowMapper, usuarioId);
    }

    public Optional<Manutencao> findById(Integer id) {
        String sql = "SELECT * FROM manutencoes WHERE id = ?";
        List<Manutencao> resultados = jdbcTemplate.query(sql, manutencaoRowMapper, id);
        return resultados.stream().findFirst();
    }

    @Transactional
    public void update(Manutencao manutencao) {
        String sql = "UPDATE manutencoes SET veiculo_id = ?, tipo = ?, data_entrada = ?, data_prevista_saida = ?, preco = ?, descricao = ?, oficina = ?, status = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                manutencao.getVeiculoId(),
                manutencao.getTipo(),
                Date.valueOf(manutencao.getDataEntrada()),
                Date.valueOf(manutencao.getDataPrevistaSaida()),
                manutencao.getPreco(),
                manutencao.getDescricao(),
                manutencao.getOficina(),
                manutencao.getStatus(),
                manutencao.getId());
    }

    @Transactional
    public void deleteById(Integer id) {
        String sql = "DELETE FROM manutencoes WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}

