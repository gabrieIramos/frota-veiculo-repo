package com.empresaxwz.frota_veiculos.repository;

import com.empresaxwz.frota_veiculos.model.Veiculo;
import com.empresaxwz.frota_veiculos.model.Moto;
import com.empresaxwz.frota_veiculos.model.Carro;
import com.empresaxwz.frota_veiculos.model.TipoCombustivel;
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
public class VeiculoRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public VeiculoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private RowMapper<Veiculo> veiculoRowMapper = new RowMapper<Veiculo>() {
        @Override
        public Veiculo mapRow(ResultSet rs, int rowNum) throws SQLException {
            Integer id = rs.getInt("id");
            String modelo = rs.getString("modelo");
            String fabricante = rs.getString("fabricante");
            int ano = rs.getInt("ano");
            double preco = rs.getDouble("preco");
            String tipoVeiculo = rs.getString("tipo_veiculo");

            if ("CARRO".equalsIgnoreCase(tipoVeiculo)) {
                int quantidadePortas = rs.getInt("quantidade_portas");
                String tipoCombustivelStr = rs.getString("tipo_combustivel");

                TipoCombustivel tipoCombustivel = null;
                if (tipoCombustivelStr != null) {
                    try {
                        tipoCombustivel = TipoCombustivel.valueOf(tipoCombustivelStr.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        System.err.println("Valor inválido para TipoCombustivel: " + tipoCombustivelStr);
                    }
                }

                return new Carro(id, modelo, fabricante, ano, preco, quantidadePortas, tipoCombustivel);
            } else if ("MOTO".equalsIgnoreCase(tipoVeiculo)) {

                int cilindrada = rs.getInt("cilindrada");
                return new Moto(id, modelo, fabricante, ano, preco, cilindrada);
            }

            return null;
        }
    };

    @Transactional
    public Veiculo save(Veiculo veiculo) {
        String sqlVeiculo = "INSERT INTO veiculos (modelo, fabricante, ano, preco, tipo_veiculo) VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sqlVeiculo, new String[]{"id"});
            ps.setString(1, veiculo.getModelo());
            ps.setString(2, veiculo.getFabricante());
            ps.setInt(3, veiculo.getAno());
            ps.setDouble(4, veiculo.getPreco());
            if (veiculo instanceof Carro) {
                ps.setString(5, "CARRO");
            } else if (veiculo instanceof Moto) {
                ps.setString(5, "MOTO");
            } else {
                throw new IllegalArgumentException("Tipo de veículo desconhecido para salvar.");
            }
            return ps;
        }, keyHolder);

        Integer veiculoId = keyHolder.getKey().intValue();
        veiculo.setId(veiculoId);


        if (veiculo instanceof Carro carro) {
            String sqlCarro = "INSERT INTO carros (veiculo_id, quantidade_portas, tipo_combustivel) VALUES (?, ?, ?)";

            jdbcTemplate.update(sqlCarro,
                    veiculoId,
                    carro.getQuantidade_portas(),
                    carro.getTipoCombustivel().name());

        } else if (veiculo instanceof Moto moto) {
            String sqlMoto = "INSERT INTO motos (veiculo_id, cilindrada) VALUES (?, ?)";

            jdbcTemplate.update(sqlMoto,
                    veiculoId,
                    moto.getCilindrada());

        }
        return veiculo;
    }

    @Transactional
    public Optional<Veiculo> findById(Integer id) {
        String sql = "SELECT v.id, v.modelo, v.fabricante, v.ano, v.preco, v.tipo_veiculo, " +
                "c.quantidade_portas, c.tipo_combustivel, " +
                "m.cilindrada " +
                "FROM veiculos v " +
                "LEFT JOIN carros c ON v.id = c.veiculo_id " +
                "LEFT JOIN motos m ON v.id = m.veiculo_id " +
                "WHERE v.id = ?";
        List<Veiculo> resultados = jdbcTemplate.query(sql, veiculoRowMapper, id);
        return resultados.stream().findFirst();
    }

    public List<Veiculo> findAll() {
        String sql = "SELECT v.id, v.modelo, v.fabricante, v.ano, v.preco, v.tipo_veiculo, " +
                "c.quantidade_portas, c.tipo_combustivel, " +
                "m.cilindrada " +
                "FROM veiculos v " +
                "LEFT JOIN carros c ON v.id = c.veiculo_id " +
                "LEFT JOIN motos m ON v.id = m.veiculo_id";
        return jdbcTemplate.query(sql, veiculoRowMapper);
    }

    @Transactional
    public void update(Veiculo veiculo) {
        String sqlVeiculo = "UPDATE veiculos SET modelo = ?, fabricante = ?, ano = ?,  preco = ?, tipo_veiculo = ? WHERE id = ?";
        int updatedRows = jdbcTemplate.update(sqlVeiculo,
                veiculo.getModelo(),
                veiculo.getFabricante(),
                veiculo.getAno(),
                veiculo.getPreco(),
                (veiculo instanceof Carro ? "CARRO" : "MOTO"),
                veiculo.getId());

        if (veiculo instanceof Carro carro) {
            String sqlCarro = "UPDATE carros SET quantidade_portas = ?, tipo_combustivel = ? WHERE veiculo_id = ?";
            jdbcTemplate.update(sqlCarro,
                    carro.getQuantidade_portas(),
                    carro.getTipoCombustivel().name(),
                    veiculo.getId());
        } else if (veiculo instanceof Moto moto) {
            String sqlMoto = "UPDATE motos SET cilindrada = ? WHERE veiculo_id = ?";
            jdbcTemplate.update(sqlMoto,
                    moto.getCilindrada(),
                    veiculo.getId());
        }
        return;
    }

    @Transactional
    public void deleteById(Integer id) {
        String sql = "DELETE FROM veiculos WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public List<Veiculo> findByFiltro(String tipo, String modelo, Integer ano, String fabricante, Double preco_minimo, Double preco_maximo) {
        StringBuilder sqlBuilder = new StringBuilder(
                "SELECT v.id, v.modelo, v.fabricante, v.ano, v.preco, v.tipo_veiculo, " +
                        "c.quantidade_portas, c.tipo_combustivel, " +
                        "m.cilindrada " +
                        "FROM veiculos v " +
                        "LEFT JOIN carros c ON v.id = c.veiculo_id " +
                        "LEFT JOIN motos m ON v.id = m.veiculo_id " +
                        "WHERE 1=1"
        );
        List<Object> params = new java.util.ArrayList<>();

        if (tipo != null && !tipo.isEmpty()) {
            sqlBuilder.append(" AND v.tipo_veiculo = ?");
            params.add(tipo.toUpperCase());
        }
        if (modelo != null && !modelo.isEmpty()) {
            sqlBuilder.append(" AND v.modelo ILIKE ?");
            params.add("%" + modelo + "%");
        }
        if (ano != null) {
            sqlBuilder.append(" AND v.ano = ?");
            params.add(ano);
        }
        if (fabricante != null && !fabricante.isEmpty()) {
            sqlBuilder.append(" AND v.fabricante ILIKE ?");
            params.add("%" + fabricante + "%");            
        }
        if (preco_minimo != null && preco_minimo > 0) {
            sqlBuilder.append(" AND v.preco >= ?");
            params.add(preco_minimo);
        }
        if (preco_maximo != null && preco_maximo > 0) {
            sqlBuilder.append(" AND v.preco <= ?");
            params.add(preco_maximo);
        }
        return jdbcTemplate.query(sqlBuilder.toString(), veiculoRowMapper, params.toArray());
    }
}