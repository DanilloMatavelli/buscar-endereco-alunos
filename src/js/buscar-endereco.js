const form = document.querySelector('#consultaForm');
const ufInput = document.querySelector('#uf');
const cidadeInput = document.querySelector('#cidade');
const logradouroInput = document.querySelector('#logradouro');
const resultContainer = document.querySelector('#result');

// Adicionar evento submit ao formulário de consulta assim que eu clicar no botão
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Capturar valores dos campos de formulario
    const uf = ufInput.value;
    const cidade = cidadeInput.value.trim();
    const logradouro = logradouroInput.value.trim();

    // Validação dos campos do formulário
    // Verificando se um estado foi selecionado
    if (uf === "") {
        await Swal.fire({
            icon: 'error',
            title: 'Campo obrigatório',
            text: 'Por favor, selecione um estado',
            confirmButtonColor: '#117000'
        });
        return;
    }

    // Verifica se a cidade tem pelo menos 3 caracteres
    if (cidade.length < 3) {
        await Swal.fire({
            icon: 'error',
            title: 'Campo Inválido',
            text: 'Cidade deve ter pelo menos 3 caracteres',
            confirmButtonColor: '#117000'
        });
        return;
    }

    // Verifica se o logradouro tem pelo menos 3 caracteres
    if (logradouro.length < 3) {
        await Swal.fire({
            icon: 'error',
            title: 'Campo Inválido',
            text: 'Logradouro deve ter pelo menos 3 caracteres',
            confirmButtonColor: '#117000'
        });
        return;
    }

    try {
        // Exibir alerta de carregamento durante a consulta
        Swal.fire({
            title: 'Consultando endereço...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Construir URL da API ViaCep com os parâmetros codificados
        // Codificar cidade e logradouro para evitar problemas
        const cidadeEncoded = encodeURIComponent(cidade);
        const logradouroEncoded = encodeURIComponent(logradouro);
        const url = `https://viacep.com.br/ws/${uf}/${cidadeEncoded}/${logradouroEncoded}/json/`;

        // Realizar consulta à API ViaCep e aguardar a resposta
        const data = await consultaViaCep(url);

        // Fechar indicador de carregamento após receber resposta
        Swal.close();

        // Limpar resultados anteriores
        resultContainer.innerHTML = '';

        // Verifica se a consulta retornou resultados
        if (data && data.length > 0) {
            // Criar tabela para exibir os resultados da consulta
            const table = document.createElement('table');
            table.className = 'results__table';

            // Criar cabeçalho da tabela
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            // Títulos das colunas
            const headers = ['CEP', 'Logradouro', 'Bairro'];

            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });

            // Adicionar linha de cabeçalho ao thead e thead à tabela
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Criar corpo da tabela (tbody) para os dados
            const tbody = document.createElement('tbody');

            // Popular a tabela com os dados retornados pela API
            // Iterar sobre os endereços retornados pela API
            data.forEach(item => {
                // Criar uma nova linha para cada endereço
                const row = document.createElement('tr');

                // Criar e preencher a célula do CEP
                const cellCep = document.createElement('td');
                cellCep.textContent = item.cep;
                row.appendChild(cellCep);

                // Criar e preencher a célula do Logradouro
                const cellLogradouro = document.createElement('td');
                cellLogradouro.textContent = item.logradouro;
                row.appendChild(cellLogradouro);

                // Criar e preencher a célula do Bairro
                const cellBairro = document.createElement('td');
                cellBairro.textContent = item.bairro;
                row.appendChild(cellBairro);

                // Adicionar linha completa ao corpo da tabela
                tbody.appendChild(row);
            });

            // Adicionar corpo da tabela e a tabela completa
            table.appendChild(tbody);
            resultContainer.appendChild(table);
        } else {
            // Caso nenhum resultado seja encontrado
            await Swal.fire({
                icon: 'info',
                title: 'Nenhum resultado encontrado',
                text: 'Não foram encontrados endereços com os critérios informados.',
                confirmButtonColor: '#117000'
            });
        }
    } catch (error) {
        // Tratamento de erro em caso de falha na consulta
        await Swal.fire({
            icon: 'error',
            title: 'Erro na consulta',
            text: 'Ocorreu um erro ao buscar os dados. Por favor, tente novamente.',
            confirmButtonColor: '#117000'
        });
    }
});

// Adicionar evento de clique de nova consulta
document.querySelector('#novaConsulta').addEventListener('click', async () => {
    // Limpar formulário e área de resultados
    form.reset();
    resultContainer.innerHTML = '';

    await Swal.fire({
        icon: 'success',
        title: 'Formulário limpo',
        text: 'Você pode realizar uma nova consulta agora.',
        confirmButtonColor: '#117000',
        timer: 4000,
        timerProgressBar: true
    });
});

//  Função para realizar a consulta à API ViaCep
const consultaViaCep = async (url) => {
    try {
        // Realizar a requisição HTTP GET para a API ViaCep
        const response = await fetch(url);

        // Verifica se a resposta da API foi bem-sucedida (200-299)
        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }

        // Converte a resposta da API (em formato JSON) para um
        return await response.json();
    }

    catch (error) {
        // Propaga o erro para ser tratado pelo código
        throw error;
    }
};