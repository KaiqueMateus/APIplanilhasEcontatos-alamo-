// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Inicia o aplicativo Express
const express = require('express');
const { google } = require('googleapis');
const app = express();
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');
const path = require('path');
const mongoose = require('mongoose');
const { middlewareGlobal } = require('./src/middlewares/middlewares');
const helmet = require('helmet');
const routes = require('./routes');
const { async } = require('regenerator-runtime');
const { getAuthSheets } = require('./src/utils/googleSheets');

// Obtém a URL de conexão do MongoDB do arquivo .env
const mongoURI = process.env.CONNECTIONSTRING;

// Conecta ao MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Conexão com o MongoDB estabelecida com sucesso.');
        app.emit('pronto'); // Emite o evento 'pronto' após a conexão bem-sucedida
    })
    .catch(error => {
        console.error('Erro na conexão com o MongoDB:', error);
    });

// Aplica as configurações de segurança do Helmet
app.use(helmet());


app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net', 'stackpath.bootstrapcdn.com'],
        scriptSrcElem: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", 'stackpath.bootstrapcdn.com', 'fonts.googleapis.com'],
        fontSrc: ["'self'", 'fonts.gstatic.com'],
    }
}));



// Habilita o middleware para análise de dados no corpo da requisição
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define o caminho para os arquivos estáticos
app.use('/frontend', express.static(path.resolve(__dirname, 'frontend')));
app.use('/src', express.static(path.resolve(__dirname, 'src')));
app.use('/utils', express.static(path.resolve(__dirname, 'src', 'utils')));


// Configura o armazenamento de sessão no MongoDB
const sessionOptions = session({
    secret: 'abcdefghijklmnop',
    store: MongoStore.create({ mongoUrl: mongoURI}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionOptions);

// Rota para obter metadados da planilha
app.get("/metadata", async (req, res) => {
    const { googleSheets, auth, spreadsheetsId } = await getAuthSheets();

    try {
        const metadata = await googleSheets.spreadsheets.get({
            auth,
            spreadsheetId: spreadsheetsId
        });

        res.send(metadata.data);
    } catch (error) {
        console.error("Erro ao obter metadata:", error);
        res.status(500).send("Erro interno do servidor");
    }
});

// Rota para obter linhas da planilha
app.get('/getRows', async (req, res) => {
    const { googleSheets, auth, spreadsheetsId } = await getAuthSheets();

    try {
        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId: spreadsheetsId,
            range: "Sheet1",
            valueRenderOption: 'FORMATTED_VALUE',       
        });        

        const rowsData = getRows.data.values || [];
        res.render('login-logado', { user: req.session.user || {}, rowsData });
    } catch (error) {
        console.error("Erro ao obter os Rows:", error);
        res.status(500).send("Erro interno do servidor");
    }
});

app.get('/getLatestData', async (req, res) => {
    try {
        const { googleSheets, auth, spreadsheetsId } = await getAuthSheets();

        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId: spreadsheetsId,
            range: 'Sheet1',
        });

        const rowsData = getRows.data.value || [];
        res.json({ success: true, data: rowsData });
    } catch(error) {
        console.error('Erro ao obter os novos Rows', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor'});
    }
})


// Rota para obter linhas da planilha sem CSRF (para diagnóstico)
app.get('/getFilteredRowsWithoutCSRF', async (req, res) => {
    try {
        const { googleSheets, auth, spreadsheetsId } = await getAuthSheets();

        const response = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId: spreadsheetsId,
            range: 'Sheet1!A:G',
        });

        const values = response.data ? response.data.values : [];

        const headerRow = values[0];
        const columnIndexD = headerRow.indexOf('D');

        // Filtra as linhas onde a coluna 'D' não contém 'REALIZADO'
        const rowsFiltradas = values.slice(1).filter(row => {
            const valorD = row[columnIndexD];
            return valorD !== 'REALIZADO';
        });

        const filteredData = [headerRow, ...rowsFiltradas];

        res.json({ success: true, data: filteredData });

    } catch (error) {
        console.error('Erro ao obter os dados filtrados da planilha:', error);
        res.json({ success: false, error: 'Erro interno do servidor' });
    }
});




// Configura as visualizações (views) EJS
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');



app.use(sessionOptions);

// Habilita o uso do middleware Flash
app.use(flash());

// Evento 'pronto' é ouvido para iniciar o servidor
app.on('pronto', () => {
    app.listen(8080, () => {
      console.log('Acessar http://localhost:8080');
      console.log('Servidor executando na porta 8080');
    });
  });

// Middlewares
app.use(middlewareGlobal);
app.use('/', routes);
