'use strict';
module.exports = function(app) {
  var desafio = require('../controllers/planetaController');

  app.route('/planetas')
    .get(desafio.list)
    .post(desafio.create);

app.route('/planetas/search/:termoBusca')
    .get(desafio.search);

  app.route('/planetas/:idPlaneta')
    .get(desafio.read)
    .put(desafio.update)
    .delete(desafio.delete);
};