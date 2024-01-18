const express = require('express');
const route = express.Router();

const loginController = require('./src/controllers/loginController');
const homeController = require('./src/controllers/homeController');
const contatoController = require('./src/controllers/contatoController');

const { loginRequired } = require('./src/middlewares/middlewares');

//Rotas da Home
route.get('/', homeController.index);
route.get('/contato/index', loginRequired, contatoController.index);

// Rotas de login
route.get('/login/index', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

// Rotas para atualização de dados da planilha


//Rotas de contato
route.get('/contato/index', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired, contatoController.register);
route.get('/contato/index/:id', loginRequired, contatoController.editIndex);
route.post('/contato/edit/:id', loginRequired, contatoController.edit);
route.get('/contato/delete/:id', loginRequired, contatoController.delete);

module.exports = route;