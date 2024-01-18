// Importa o modelo de Login
const { google } = require('googleapis');
const { getAuthSheets } = require('../utils/googleSheets');
const Login = require('../models/loginModel');

// Rota para a página inicial
exports.index = (req, res) => {
    if (req.session.user) {
        // Se o usuário estiver na sessão, renderiza a página 'login-logado'
        return res.render('login-logado');
    } else {
        // Se não houver usuário na sessão, renderiza a página 'login'
        return res.render('login');
    }
};

// Rota para o registro de usuários
exports.register = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.register();
    
        // Exibe os erros, se houverem
        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            return res.render('login', { errors: req.flash('errors') });
        }
        
        // Mensagem de sucesso, salva a sessão e redireciona de volta
        req.flash('success', 'Você foi cadastrado no sistema.'); 
        req.session.save(function() {
            return res.redirect('back');
        });
    } catch(e) {
        console.log(e);
        return res.render('404'); // Renderiza a página de erro 404 em caso de exceção
    }
};

// Rota para o processo de login
exports.login = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.login();

        // Exibe os erros, se houverem
        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            return res.render('login', { errors: req.flash('errors') });
        }

        // Mensagem de sucesso, define o usuário na sessão e exibe na console
        req.flash('success', 'Você entrou no sistema.');
        req.session.user = login.user;
        console.log('User in session:', req.session.user);

        req.session.save(async function () {
            // Obtém os dados da planilha no momento em que a página é renderizada
            const { getAuthSheets } = require("../utils/googleSheets");

            const { googleSheets, auth, spreadsheetsId } = await getAuthSheets();
            const getRows = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId: spreadsheetsId,
                range: "Sheet1",
            });

            const rowsData = getRows.data.values || [];
            return res.render('login-logado', { user: req.session.user, rowsData });
        });

    } catch (e) {
        console.log(e);
        return res.render('404'); // Renderiza a página de erro 404 em caso de exceção
    }
};

// Rota para o logout
exports.logout = function (req, res) {
    // Destrói a sessão inteira, removendo todas as variáveis, incluindo 'user'
    req.session.destroy(function(err) {
        if (err) {
            console.error(err);
            return res.render('404'); // ou outra resposta apropriada em caso de erro
        }

        res.redirect('/');
    });
};

