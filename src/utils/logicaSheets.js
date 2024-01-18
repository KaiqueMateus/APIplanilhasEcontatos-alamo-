async function obterDadosEAtualizarTabela() {
    try {
        console.log('Chamando obterDadosEAtualizarTabela');

        const filtros = {
            filtroD: 'REALIZADO',
            filtroE: 'APROVADO',
            filtroF: 'APROVADO',
            filtroG: 'ATIVO',
        };

        const response = await fetch('/getFilteredRows', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filtros),
        });

        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        console.log('Dados obtidos:', data);

        if (data.success) {
            const rowsFiltradas = data.data;
            const tabela = document.querySelector('#tabela');

            console.log('Chamando atualizarTabela');
            atualizarTabela(tabela, rowsFiltradas);
        } else {
            console.error('Erro ao obter os dados do servidor:', data.error);
        }
    } catch (error) {
        console.error(`Erro ao obter os dados da planilha e atualizar a tabela ${error}`);
    }
}


function atualizarTabela(tabela, data) {
    const tableHeaders = tabela.querySelector('thead');
    const tbody = tabela.querySelector('tbody');

    // Limpa o conteúdo existente
    tableHeaders.innerHTML = '';
    tbody.innerHTML = '';

    if (data.length > 0) {
        const headerRow = document.createElement('tr');
        data[0].forEach(cell => {
            const th = document.createElement('th');
            th.textContent = cell;
            headerRow.appendChild(th);
        });
        tableHeaders.appendChild(headerRow);

        for (let i = 1; i < data.length; i++) {
            const rowData = data[i];
            const tr = document.createElement('tr');

            rowData.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        }
    } else {
        console.error('Nenhum dado disponível.');
    }
}

document.addEventListener("DOMContentLoaded", obterDadosEAtualizarTabela);
