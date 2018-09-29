var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  mongoose = require('mongoose'),
  Task = require('./api/models/PlanetaModel'), //created model loading here
  bodyParser = require('body-parser');
  
  mongoose.set('useFindAndModify', false);

  // mongoose instance connection url connection
  mongoose.Promise = global.Promise;
  //mongoose.connect('mongodb://localhost/DesafioDB', { useNewUrlParser: true }); 

  mongoose.connect('mongodb://desafiousr:#desafio1@ds119273.mlab.com:19273/heroku_5865vkzv', { useNewUrlParser: true }); 



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/PlanetaRoutes'); //importing route
routes(app); //register the route

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

const server = app.listen(port);


console.log('Desafio B2W StarWars iniciado na porta ' + port);

module.exports = server;