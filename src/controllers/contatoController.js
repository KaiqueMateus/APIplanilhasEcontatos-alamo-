// contatoController.js
const { contatoModel, ContatoClass } = require('../models/contatoModel');

exports.index = (req, res) => {
    res.render('contato', {
        contato: {}
    });
}

exports.register = async (req, res) => {
    try {
        const Contato = new ContatoClass(req.body);
        await Contato.register();
        console.log(Contato);

        if (Contato.errors.length > 0) {
            req.flash('errors', Contato.errors);
            req.session.save(() => res.redirect(`/contato/index/${Contato.Contato._id}`));
            return;
        }

        req.flash('success', 'Contato registrado com sucesso.');
        req.session.save(() => res.redirect('back'));
        return;

    } catch (e) {
        console.log(e);
        return res.render('404');
    }
}

exports.editIndex = async function(req, res) {
    if (!req.params.id) return res.render('404');
    
    const contato = await ContatoClass.buscaPorId(req.params.id);

    if (!contato) return res.render('404');

    res.render('contato', {
        contato: contato
    })
}

exports.edit = async function(req, res) {
 try {
    if(!req.params.id) return res.render('404');

    const Contato = new ContatoClass(req.body)

    await Contato.edit(req.params.id);

    if (Contato.errors.length > 0) {
        req.flash('errors', Contato.errors);
        req.session.save(() => res.redirect(`/contato/index/${Contato.Contato._id}`));
        return;
    }

    req.flash('success', 'Contato editado com sucesso.');
    req.session.save(() => res.redirect('back'));
    return;
    } catch (e) {
        console.log(e);
        res.render('404');
    }
}

exports.delete = async function(req, res) {
    if (!req.params.id) return res.render('404');
    
    const contato = await ContatoClass.delete(req.params.id); 

    if (!contato) return res.render('404');

    req.flash('success', 'Contato apagado com sucesso.');
    req.session.save(() => res.redirect('back'));
    return;
}
