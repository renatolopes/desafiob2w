'use strict';


var mongoose = require('mongoose'),
http = require("http"),
Planeta = mongoose.model('Planetas');

var request = require("request");

exports.list = function(req, res) {
  Planeta.find({}, function(err, planeta) {
    if (err)
      res.send(err);
    res.json(planeta);
  });
};


exports.create = function(req, res) {
  var novoPlaneta = new Planeta(req.body);

  novoPlaneta.aparicoes = null;

    var options = { method: 'GET',
      url: 'http://swapi.co/api/planets/',
      qs: { search: novoPlaneta.nome },
      headers: { } 
    };

    request(options, function (error, response, body) {
      if (error) {
        throw new Error(error);
      }

      if(body && response.statusCode == 200 && response.headers['content-type'] == "application/json"){
        var jsonResponse = JSON.parse(body);
        if(jsonResponse.count == 1){
          novoPlaneta.aparicoes = jsonResponse.results[0].films.length;
        }
      }

        novoPlaneta.save(function(err, planeta) {
          if (err)
            res.send(err);
          res.json(planeta);
        });
    });
};


exports.read = function(req, res) {
  Planeta.findById(req.params.idPlaneta).lean().exec(function(err, planeta) {
    if (err)
      res.send(err);

      res.json(planeta);
  });
};

exports.search = function(req, res) {
  console.log(req.params.termoBusca);
  Planeta.find({nome: { "$regex": req.params.termoBusca, "$options": "i" } }).lean().exec(function(err, planetas) {
    if (err)
      res.send(err);

    res.json(planetas);
  });
};


exports.update = function(req, res) {
    req.body.aparicoes = null;

    var options = { method: 'GET',
      url: 'http://swapi.co/api/planets/',
      qs: { search: req.body.nome },
      headers: { } 
    };

    request(options, function (error, response, body) {
      if (error) {
        throw new Error(error);
      }

      if(body && response.statusCode == 200 && response.headers['content-type'] == "application/json"){
        var jsonResponse = JSON.parse(body);
        if(jsonResponse.count == 1){
          req.body.aparicoes = jsonResponse.results[0].films.length;
        }
      }

         Planeta.findOneAndUpdate({_id: req.params.idPlaneta}, req.body, {new: true}, function(err, planeta) {
          if (err)
            res.send(err);
          res.json(planeta);
        });
    });
};


exports.delete = function(req, res) {
  Planeta.remove({
    _id: req.params.idPlaneta
  }, function(err, planeta) {
    if (err)
      res.send(err);
    res.json({ message: 'Planeta successfully deleted' });
  });
};
