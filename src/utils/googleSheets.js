// Importa a biblioteca 'googleapis'
const { google } = require('googleapis');

// Função assíncrona para obter a autenticação e a instância do serviço Google Sheets
async function getAuthSheets() {
    // Cria uma instância de autenticação usando o arquivo de credenciais 'credentials.json'
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json", // Substitua pelo caminho correto do seu arquivo de credenciais
        scopes: "https://www.googleapis.com/auth/spreadsheets" // Escopo necessário para operações com planilhas
    });

    // Obtém um cliente autenticado
    const client = await auth.getClient();

    // Cria uma instância do serviço Google Sheets usando a versão v4
    const googleSheets = google.sheets({
        version: "v4",
        auth: client
    });

    // Identificador da planilha
    const spreadsheetsId = "15XiRVV58PMf52S_exBmXtzZXiSev9hrIqSaw9u4tV8s";

    // Retorna um objeto contendo as instâncias de autenticação, cliente e Google Sheets, além do ID da planilha
    return {
        auth,
        client,
        googleSheets,
        spreadsheetsId
    };
}

// Exporta a função para ser utilizada em outros módulos
module.exports = { getAuthSheets };
