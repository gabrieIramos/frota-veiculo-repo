const API_BASE_URL = 'http://localhost:8080/api/veiculos';


const veiculoForm = document.getElementById('veiculo-form');
const veiculoIdInput = document.getElementById('veiculo-id');
const tipoVeiculoSelect = document.getElementById('tipoVeiculo');
const camposCarroDiv = document.getElementById('campos-carro');
const camposMotoDiv = document.getElementById('campos-moto');
const veiculosTableBody = document.querySelector('#veiculos-table tbody');
const btnSalvar = document.getElementById('btn-salvar');
const btnLimpar = document.getElementById('btn-limpar');
const filtroModeloInput = document.getElementById('filtro-modelo');
const filtroAnoInput = document.getElementById('filtro-ano');
const filtroTipoSelect = document.getElementById('filtro-tipo');
const btnFiltrar = document.getElementById('btn-filtrar');
const btnLimparFiltros = document.getElementById('btn-limpar-filtros');
const filtroFabricanteInput = document.getElementById('filtro-fabricante');
const filtroPrecoMinimoInput = document.getElementById('filtro-preco-min');
const filtroPrecoMaximoInput = document.getElementById('filtro-preco-max');


const detalhesModal = document.getElementById('detalhes-modal');
const detalhesConteudoDiv = document.getElementById('detalhes-conteudo');
const closeButton = document.querySelector('.close-button');

const formMessageStatus = document.getElementById('formMessageStatus');


function toggleCamposVeiculo() {
    const tipo = tipoVeiculoSelect.value;
    camposCarroDiv.style.display = 'none';
    camposMotoDiv.style.display = 'none';


    document.getElementById('quantidadePortas').value = '';
    document.getElementById('tipoCombustivel').value = '';
    document.getElementById('cilindrada').value = '';

    if (tipo === 'CARRO') {
        camposCarroDiv.style.display = 'block';
    } else if (tipo === 'MOTO') {
        camposMotoDiv.style.display = 'block';
    }
}


function limparFormulario() {
    veiculoForm.reset();
    veiculoIdInput.value = '';
    btnSalvar.textContent = 'Salvar Veículo';
    toggleCamposVeiculo();
    clearErrorMessages();
}


function exibirMensagem(mensagem, tipo = 'info') {
    clearErrorMessages();
        formMessageStatus.textContent = mensagem;
        formMessageStatus.className = tipo;
}


async function carregarVeiculos(filtros = {}) {
    veiculosTableBody.innerHTML = '<tr><td colspan="7">Carregando veículos...</td></tr>';

    let url = API_BASE_URL;
    const params = new URLSearchParams();

    if (filtros.modelo) params.append('modelo', filtros.modelo);
    if (filtros.ano) params.append('ano', filtros.ano);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.fabricante) params.append('fabricante', filtros.fabricante);
    if (filtros.precoMinimo) params.append('precoMinimo', filtros.precoMinimo);
    if (filtros.precoMaximo) params.append('precoMaximo', filtros.precoMaximo);
    

    if (params.toString()) {
        url += `/search?${params.toString()}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao carregar veículos: ${response.statusText}`);
        }
        const veiculos = await response.json();

        veiculosTableBody.innerHTML = '';

        if (veiculos.length === 0) {
            veiculosTableBody.innerHTML = '<tr><td colspan="7">Nenhum veículo encontrado.</td></tr>';
            return;
        }

        veiculos.forEach(veiculo => {
            const row = veiculosTableBody.insertRow();
            row.insertCell(0).textContent = veiculo.id;
            row.insertCell(1).textContent = veiculo.tipoVeiculo;
            row.insertCell(2).textContent = veiculo.modelo;
            row.insertCell(3).textContent = veiculo.fabricante;
            row.insertCell(4).textContent = veiculo.ano;
            row.insertCell(5).textContent = `R$ ${veiculo.preco.toFixed(2)}`;

            const acoesCell = row.insertCell(6);
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.classList.add('btn-acao');
            btnEditar.onclick = () => carregarVeiculoParaEdicao(veiculo.id);
            acoesCell.appendChild(btnEditar);

            const btnDetalhes = document.createElement('button');
            btnDetalhes.textContent = 'Detalhes';
            btnDetalhes.classList.add('btn-acao');
            btnDetalhes.onclick = () => exibirDetalhesModal(veiculo.id);
            acoesCell.appendChild(btnDetalhes);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.classList.add('btn-acao', 'btn-excluir');
            btnExcluir.onclick = () => excluirVeiculo(veiculo.id);
            acoesCell.appendChild(btnExcluir);
        });
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        veiculosTableBody.innerHTML = `<tr><td colspan="7">Erro ao carregar veículos: ${error.message}</td></tr>`;
    }
}

async function handleSubmitVeiculo(event) {
    event.preventDefault();

    clearErrorMessages();

    const id = veiculoIdInput.value;
    const tipoVeiculo = tipoVeiculoSelect.value;
    const modelo = document.getElementById('modelo').value;
    const fabricante = document.getElementById('fabricante').value;

    const ano = parseInt(document.getElementById('ano').value);
    const preco = parseFloat(document.getElementById('preco').value.replace(',', '').replace('.', ''));

    let dadosVeiculo = {
        modelo,
        fabricante,
        ano,
        preco
    };

    let endpoint = '';
    let method = '';

    //EDITAR VEICULOS
    if (id) {
        dadosVeiculo.id = parseInt(id);
        method = 'PUT';
        if (tipoVeiculo === 'CARRO') {
            endpoint = `${API_BASE_URL}/carros/${id}`;
            dadosVeiculo.quantidadePortas = parseInt(document.getElementById('quantidadePortas').value);
            dadosVeiculo.tipoCombustivel = document.getElementById('tipoCombustivel').value.toUpperCase();
        } else if (tipoVeiculo === 'MOTO') {
            endpoint = `${API_BASE_URL}/motos/${id}`;
            dadosVeiculo.cilindrada = parseInt(document.getElementById('cilindrada').value);
        }
    } else { // CADASTRAR
        method = 'POST';
        if (tipoVeiculo === 'CARRO') {
            endpoint = `${API_BASE_URL}/carros`;
            dadosVeiculo.quantidadePortas = parseInt(document.getElementById('quantidadePortas').value);
            dadosVeiculo.tipoCombustivel = document.getElementById('tipoCombustivel').value.toUpperCase();
        } else if (tipoVeiculo === 'MOTO') {
            endpoint = `${API_BASE_URL}/motos`;
            dadosVeiculo.cilindrada = parseInt(document.getElementById('cilindrada').value);
        } else {
            exibirMensagem('Selecione um tipo de veículo para cadastrar.', 'erro');
            return;
        }
    }

    if (tipoVeiculo === 'CARRO' && (isNaN(dadosVeiculo.quantidadePortas) || !dadosVeiculo.tipoCombustivel)) {
        exibirMensagem('Preencha todos os campos obrigatórios para o carro.', 'erro');
        return;
    }
    if (tipoVeiculo === 'MOTO' && isNaN(dadosVeiculo.cilindrada)) {
        exibirMensagem('Preencha todos os campos obrigatórios para a moto.', 'erro');
        return;
    }
    if (isNaN(dadosVeiculo.ano) || isNaN(dadosVeiculo.preco)) {
         exibirMensagem('Ano e Preço devem ser números válidos.', 'erro');
         return;
    }

    if (!dadosVeiculo.modelo || !dadosVeiculo.fabricante){
        exibirMensagem('Modelo e Fabricante devem ser preenchidos', 'erro')
    }

    try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosVeiculo)
            });

            const data = await response.json();

            if (!response.ok) {

                if (response.status === 400 && data.errors) {
                    let allErrorMessages = [];
                    data.errors.forEach(error => {
                        allErrorMessages.push(error.defaultMessage);
                    });
                    exibirMensagem("Houve os seguintes erros de validação:\n- " + allErrorMessages.join("\n- "), 'erro');

                } else if (data.message) {

                    exibirMensagem(`Erro na operação: ${data.message}`, 'erro');
                } else {

                    exibirMensagem(`Erro desconhecido do servidor: ${response.statusText}`, 'erro');
                }
                return; 
            }

            exibirMensagem(`Veículo ${id ? 'atualizado' : 'cadastrado'} com sucesso!`, 'sucesso');
            limparFormulario();
            carregarVeiculos();
        } catch (error) {

            console.error(`Erro de comunicação ou inesperado:`, error);
            exibirMensagem(`Erro de comunicação: ${error.message}. Verifique sua conexão ou tente novamente.`, 'erro');
        }
}


async function carregarVeiculoParaEdicao(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Veículo não encontrado com ID: ${id}`);
        }
        const veiculo = await response.json();

        veiculoIdInput.value = veiculo.id;
        tipoVeiculoSelect.value = veiculo.tipoVeiculo;
        document.getElementById('modelo').value = veiculo.modelo;
        document.getElementById('fabricante').value = veiculo.fabricante;
        document.getElementById('ano').value = veiculo.ano;
        document.getElementById('preco').value = veiculo.preco;

        toggleCamposVeiculo();
        if (veiculo.tipoVeiculo === 'CARRO') {
            document.getElementById('quantidadePortas').value = veiculo.quantidadePortas;
            document.getElementById('tipoCombustivel').value = veiculo.tipoCombustivel.toUpperCase();
        } else if (veiculo.tipoVeiculo === 'MOTO') {
            document.getElementById('cilindrada').value = veiculo.cilindrada;
        }

        btnSalvar.textContent = 'Atualizar Veículo';
        document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Erro ao carregar veículo para edição:', error);
        exibirMensagem(`Erro ao carregar veículo para edição: ${error.message}`, 'erro');
    }
}


async function excluirVeiculo(id) {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao excluir veículo: ${response.statusText}`);
        }

        exibirMensagem('Veículo excluído com sucesso!', 'sucesso');
        carregarVeiculos();
    } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        exibirMensagem(`Erro ao excluir veículo: ${error.message}`, 'erro');
    }
}

async function exibirDetalhesModal(id) {
    detalhesConteudoDiv.innerHTML = 'Carregando detalhes...';
    detalhesModal.style.display = 'block';

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Veículo não encontrado com ID: ${id}`);
        }
        const veiculo = await response.json();

        let htmlDetalhes = `
            <p><strong>ID:</strong> ${veiculo.id}</p>
            <p><strong>Tipo:</strong> ${veiculo.tipoVeiculo}</p>
            <p><strong>Modelo:</strong> ${veiculo.modelo}</p>
            <p><strong>Fabricante:</strong> ${veiculo.fabricante}</p>
            <p><strong>Ano:</strong> ${veiculo.ano}</p>
            <p><strong>Preço:</strong> R$ ${veiculo.preco.toFixed(2)}</p>
        `;

        if (veiculo.tipoVeiculo === 'CARRO') {
            htmlDetalhes += `
                <p><strong>Quantidade de Portas:</strong> ${veiculo.quantidadePortas}</p>
                <p><strong>Tipo de Combustível:</strong> ${veiculo.tipoCombustivel}</p>
            `;
        } else if (veiculo.tipoVeiculo === 'MOTO') {
            htmlDetalhes += `
                <p><strong>Cilindrada:</strong> ${veiculo.cilindrada}cc</p>
            `;
        }

        detalhesConteudoDiv.innerHTML = htmlDetalhes;
    } catch (error) {
        console.error('Erro ao buscar detalhes do veículo:', error);
        detalhesConteudoDiv.innerHTML = `<p>Erro ao carregar detalhes: ${error.message}</p>`;
    }
}

function clearErrorMessages() {
    formMessageStatus.textContent = '';
    formMessageStatus.className = '';
}




document.addEventListener('DOMContentLoaded', () => {
    carregarVeiculos();


    tipoVeiculoSelect.addEventListener('change', toggleCamposVeiculo);


    veiculoForm.addEventListener('submit', handleSubmitVeiculo);


    btnLimpar.addEventListener('click', limparFormulario);


    btnFiltrar.addEventListener('click', () => {
        const filtros = {
            modelo: filtroModeloInput.value,
            ano: filtroAnoInput.value ? parseInt(filtroAnoInput.value) : null,
            tipo: filtroTipoSelect.value,
            fabricante: filtroFabricanteInput.value,
            precoMinimo: filtroPrecoMinimoInput.value ? parseFloat(filtroPrecoMinimoInput.value) : null,
            precoMaximo: filtroPrecoMaximoInput.value ? parseFloat(filtroPrecoMaximoInput.value) : null
        };
        carregarVeiculos(filtros);
    });

    btnLimparFiltros.addEventListener('click', () => {
        filtroModeloInput.value = '';
        filtroAnoInput.value = '';
        filtroTipoSelect.value = '';
        filtroFabricanteInput.value = '';
        filtroPrecoMaximoInput.value = '';
        filtroPrecoMinimoInput.value = '';

        carregarVeiculos();
    });

    closeButton.addEventListener('click', () => {
        detalhesModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === detalhesModal) {
            detalhesModal.style.display = 'none';
        }
    });
});