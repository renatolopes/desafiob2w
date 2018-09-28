'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PlanetaSchema = new Schema({
  nome: {
    type: String,
    required: 'Por favor, informe o nome do planeta'
  },
  clima: {
    type: String,
    required: 'Por favor, informe o clima do planeta'
  },
  terreno: {
    type: String,
    required: 'Por favor, informe o terreno do planeta'
  },
  aparicoes: {
    type: Number,
  }
});

module.exports = mongoose.model('Planetas', PlanetaSchema);