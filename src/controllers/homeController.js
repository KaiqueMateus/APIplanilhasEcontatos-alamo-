// homeController.js
const { ContatoClass } = require('../models/contatoModel');

// homeController.js
exports.index = async (req, res) => {
    const contatos = await ContatoClass.buscaContatos();
    res.render('index.ejs', { contatos }); 
};
