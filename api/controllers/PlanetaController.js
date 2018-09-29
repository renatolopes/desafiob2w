'use strict';


var mongoose = require('mongoose'),
http = require("http"),
Planeta = mongoose.model('Planetas');

var request = require("request");

exports.list = function(req, res) {
  Planeta.find({}, function(err, planeta) {
    if (err){
      res.send(err);
    }
    res.json(planeta);
  });
};

exports.getAparicoes = function(planeta, callback){
  planeta.aparicoes = null;

  var options = { method: 'GET',
    url: 'http://swapi.co/api/planets/',
    qs: { search: planeta.nome },
    headers: { } 
  };

  request(options, function (error, response, body) {
    if (error) {
      console.log("Erro ao recuperar quantidade de aparições") 
      console.log(new Error(error));
    }

    if(body && response.statusCode == 200 && response.headers['content-type'] == "application/json"){
      var jsonResponse = JSON.parse(body);
      if(jsonResponse.count == 1){
        planeta.aparicoes = jsonResponse.results[0].films.length;
      }
    }

    callback(planeta);
  });

}

exports.create = function(req, res) {
  var novoPlaneta = new Planeta(req.body);

  exports.getAparicoes(novoPlaneta, function(novoPlaneta){
    novoPlaneta.save(function(err, planeta) {
        if (err){
          res.send(err);
        }
        res.json(planeta);
      });
  });
};


exports.read = function(req, res) {
  Planeta.findById(req.params.idPlaneta).lean().exec(function(err, planeta) {
    if (err){
      res.send(err);
    }
    res.json(planeta);
  });
};

exports.search = function(req, res) {
  Planeta.find({nome: { "$regex": req.params.termoBusca, "$options": "i" } }).lean().exec(function(err, planetas) {
    if (err){
      res.send(err);
    }

    res.json(planetas);
  });
};


exports.update = function(req, res) {
  var planeta = req.body;

  exports.getAparicoes(planeta, function(planeta){
    Planeta.findOneAndUpdate({_id: req.params.idPlaneta}, req.body, {new: true}, function(err, planetaAtualizado) {
        if (err){
          res.send(err);
        }
        res.json(planetaAtualizado);
      });
  });
};


exports.delete = function(req, res) {
  Planeta.deleteOne({
    _id: req.params.idPlaneta
  }, function(err, planeta) {
    if (err){
      res.send(err);
    }
    res.json({ message: 'Planeta successfully deleted' });
  });
};
