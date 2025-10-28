# Sistema de Gerenciamento de Frotas

Este é um sistema de gerenciamento de frotas de veiculos desenvolvido para cadastrar, listar, buscar, atualizar e excluir veículos (carros e motos). O projeto é dividido em uma aplicação *backend* com Spring Boot e um *frontend* interativo em HTML, CSS e JavaScript.

## 👨🏻‍💻 Tecnologias Utilizadas

### Backend
* *Java 17*
* *Spring Boot (3.3.12)*
* *PostgreSQL*: Banco de dados relacional.
* *Maven*: Gerenciamento de dependências e construção de projetos.
* *Lombok*: Para reduzir o código (getters, setters, construtores, etc.)

### Frontend
* *HTML*: Estrutura da página.
* *CSS*: Estilização e layout responsivo.
* *JavaScript: Interação com o usuário e comunicação com o backend via **Fetch API*.

## 🏗 Arquitetura e Estrutura do Projeto

O projeto segue uma arquitetura multicamadas e é dividido em duas aplicações:

* *Backend (API RESTful):*
    * **controller**: Receber as requisições HTTP, mapear os endpoints e levar as chamadas para a camada de serviço. Utiliza @RestController para expor uma API REST e @CrossOrigin para gerenciar permissões de CORS (Liberado para todos).
    * **service**: Contém a lógica de negócio da aplicação. Realiza validações e orquestra as operações entre o controller e o repositório, garantindo a integridade dos dados e a consistência das regras. Utiliza @Transactional para garantir atomicidade das operações no banco de dados.
    * **repository**: Interage diretamente com o banco de dados Postgres utilizando JdbcTemplate. É responsável pelas operações de CRUD (Create, Read, Update, Delete) e consultas customizadas, mapeando os resultados para os objetos.
    * **model**: Classes que representam as entidades do domínio (Veiculo, Carro, Moto, TipoCombustivel). A herança é utilizada para modelar a relação entre Veículo e seus subtipos.
    * **dto**: Classes que definem o contrato de dados para as requisições (CarroRequestDTO, MotoRequestDTO) e respostas (VeiculoResponseDTO) da API. Garantem um fluxo de dados claro e seguro entre frontend e backend.

* *Frontend (Interface do Usuário):*
    * **index.html**: A página principal que contém o formulário de cadastro/edição, filtros e a tabela de exibição de veículos.
    * **css/style.css**: Arquivo de estilos para a interface.
    * **js/script.js**: Contém toda a lógica JavaScript para interagir com a API backend (cadastrar, listar, filtrar, editar, excluir veículos) e manipular dinamicamente o DOM.

## 📋 Pré-requisitos

Antes de iniciar o projeto, certifique-se de ter instalado:

* *Java Development Kit (JDK) 17* ou superior.
* *Maven*
* *PostgreSQL*


## ⚙ Configuração do Banco de Dados

1.  Certifique-se de ter o PostgreSQL instalado e rodando.
2.  Crie um banco de dados chamado frota (ou o nome que preferir).
    ```sql
    CREATE DATABASE frota;

3.  Execute o script sql para criar as tabelas veiculos, carro e moto.
    ```sql
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
    

4.  Atualize as configurações do banco de dados no arquivo src/main/resources/application.properties caso seu usuário ou senha do PostgreSQL sejam diferentes do padrão:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/frota
    spring.datasource.username=postgres
    spring.datasource.password=admin
    

## ▶ Como Rodar o Projeto

### Backend (Spring Boot)

1.  Navegue até a pasta raiz do projeto (frota-veiculos) no seu terminal.
2.  Compile e execute a aplicação Spring Boot:
    ```bash
    mvn spring-boot:run
O backend será iniciado em http://localhost:8080.

    
    

### Frontend

O frontend é servido diretamente pelo Spring Boot como conteúdo estático.

1.  Após o backend estar rodando, abra seu navegador.
2.  Acesse a URL:
    
    http://localhost:8080/index.html
    

## 🌐 Endpoints da API (Backend)

Todos os endpoints estão sob a base /api/veiculos.

* **POST /api/veiculos/carros**: Cadastra um novo carro.
    * *Exemplo (JSON):*
        ```json
        {
          "modelo": "Civic",
          "fabricante": "Honda",
          "ano": 2022,
          "preco": 95000.00,
          "quantidadePortas": 4,
          "tipoCombustivel": "FLEX"
        }
        
* **POST /api/veiculos/motos**: Cadastra uma nova moto.
    * *Exemplo (JSON):*
        ```json
        {
          "modelo": "CB 500F",
          "fabricante": "Honda",
          "ano": 2023,
          "preco": 42000.00,
          "cilindrada": 500
        }
        
* **GET /api/veiculos**: Lista todos os veículos cadastrados.
* **GET /api/veiculos/{id}**: Consulta um veículo específico pelo ID.
* **GET /api/veiculos/search**: Busca veículos por critérios (tipo, modelo, ano).
    * *Exemplo:* /api/veiculos/search?tipo=CARRO&modelo=Civic&ano=2022
    
* **PUT /api/veiculos/carros/{id}**: Atualiza os dados de um carro existente.
    * *Exemplo (JSON):*
        ```json
        {
          "modelo": "Civic Turbo",
          "fabricante": "Honda",
          "ano": 2024,
          "preco": 120000.00,
          "quantidadePortas": 4,
          "tipoCombustivel": "GASOLINA"
        }
        
* **PUT /api/veiculos/motos/{id}**: Atualiza os dados de uma moto existente.
    * *Request Body Exemplo (JSON):*
        ```json
        {
          "modelo": "Ninja 650",
          "fabricante": "Kawasaki",
          "ano": 2023,
          "preco": 55000.00,
          "cilindrada": 650
        }
