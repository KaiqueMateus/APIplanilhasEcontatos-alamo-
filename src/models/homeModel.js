const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: String
});

module.exports = mongoose.model('Home', HomeSchema);