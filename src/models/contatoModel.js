const mongoose = require('mongoose');
const validator = require('validator');

const contatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome : { type: String, required: false, default: ''},
    email : { type: String, required: false, default: ''},
    criadoEm : { type: Date, default: Date.now}
});

const contatoModel = mongoose.model('contato', contatoSchema);

class contato {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.contato = null;
    }
}

contato.prototype.register = async function() {
    this.valida();
    if(this.errors.length > 0) return;
    this.contato = await contatoModel.create(this.body);
}

contato.prototype.valida = function() {
    // Limpando o objeto
    this.cleanUp();
    
    // Validação de campos
    // O e-mail precisa ser válido
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');
    if (!this.body.nome) this.errors.push('Nome é um campo obrigatório!');
    if (!this.body.email && this.body.telefone) this.errors.push('Cadastre um contato para ser enviado: email ou telefone.');

    // Verifica se a propriedade 'password' existe antes de validar o comprimento
    if (this.body.password && (this.body.password.length < 3 || this.body.password.length > 20)) {
        this.errors.push('A senha precisa ter entre 3 e 20 caracteres.');
    }
}


contato.prototype.cleanUp = function() {

    for(let key in this.body) {
        // Se qualquer coisa que não é uma string, ele vira uma string vazia
        if (typeof this.body[key] != 'string') {
            this.body[key] = ''
        }
    }
    // Pegando os dados do body
    this.body = {
        nome : this.body.nome,
        sobrenome : this.body.sobrenome,
        email : this.body.email,
    }
}

contato.prototype.edit = async function(id) {
    if (typeof id !== 'string') return;
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await contatoModel.findByIdAndUpdate(id, this.body, { new: true });
}

// Métodos estáticos
contato.buscaPorId = async function(id) {
    if (typeof id !== 'string') return;
    const contato = await contatoModel.findById(id);
    return contato;
};

contato.buscaContatos = async function() {
    const contatos = await contatoModel.find().sort({ criadoEm: -1 });
    return contatos;
};

contato.delete = async function(id) {
    if (typeof id !== 'string') return;
    const contatos = await contatoModel.findOneAndDelete({_id: id});
    return contatos;
};

module.exports = {
    contatoModel,
    ContatoClass: contato
}
