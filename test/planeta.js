process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let Planeta = mongoose.model('Planetas');

chai.use(chaiHttp);
//Our parent block
describe('Planetas', () => {
    beforeEach((done) => { //Before each test we empty the database
        Planeta.deleteMany({}, (err) => { 
           done();           
        });        
    });

    describe('/GET url inexistente', () => {
      it('Quando houver uma requisição a uma rota inexistente Então retorna erro 404', (done) => {
        chai.request(server)
            .get('/planetasx')
            .end((err, res) => {
                  res.should.have.status(404);
                  res.body.should.have.property('url');
                  res.body.url.should.be.eql('/planetasx not found');
              done();
            });
      });
  });
  
  describe('/GET planeta', () => {
    it('Quando a lista de planetas for solicitada e estiver vazia Então retorna array vazio', (done) => {
      chai.request(server)
          .get('/planetas')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
            done();
          });
    });

     it('Quando a lista de planetas for solicitada e contiver um planeta Então retorna array com um planeta', (done) => {
            let planeta = new Planeta({
            nome: "Tatooine",
            terreno: "desértico",
            clima: "árido"
            });

            planeta.save((err, book) => {
                  chai.request(server)
                      .get('/planetas')
                      .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(1);
                        done();
                      });
            });
        });
    });

  describe('/GET planeta/search', () => {
    it('Quando uma busca de planetas for solicitada e estiver vazia Então retorna array vazio', (done) => {
      chai.request(server)
          .get('/planetas/search/tat')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
            done();
          });
    });

   it('Quando uma busca de planetas for solicitada e não achar planeta algum Então retorna array vazio', (done) => {
          let planeta = new Planeta({
          nome: "Tatooine",
          terreno: "desértico",
          clima: "árido"
          });

          planeta.save((err, book) => {
                chai.request(server)
                    .get('/planetas/search/yav')
                    .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('array');
                          res.body.length.should.be.eql(0);
                      done();
                    });
          });
      });

   it('Quando uma busca de planetas for solicitada e contiver um planeta Então retorna array com um planeta', (done) => {
          let planeta = new Planeta({
          nome: "Tatooine",
          terreno: "desértico",
          clima: "árido"
          });

          planeta.save((err, book) => {
                chai.request(server)
                    .get('/planetas/search/tat')
                    .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('array');
                          res.body.length.should.be.eql(1);
                      done();
                    });
          });
      });
  });

   describe('/POST planeta', () => {
      it('Quando os campos obrigatórios NÃO forem informados Então informar erro de campos requeridos', (done) => {
          let planeta = {
              nome: "Tatooine",
              terreno: "desértico",
          }
            chai.request(server)
            .post('/planetas')
            .send(planeta)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('errors');
                  res.body.errors.should.have.property('clima');
                  res.body.errors.clima.should.have.property('kind').eql('required');
              done();
            });
      });
      it('Quando os campos obrigatórios forem informados Então retornar planeta salvo', (done) => {
          let planeta = {
              nome: "Tatooine",
              terreno: "desértico",
              clima: "árido"
          }
            chai.request(server)
            .post('/planetas')
            .send(planeta)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('nome');
                  res.body.should.have.property('terreno');
                  res.body.should.have.property('clima');
                  res.body.should.have.property('aparicoes').eql(5);
              done();
            });
      });

      describe('/GET/:id planeta', () => {
        it('Quando for solicitado um planeta específico e o mesmo existir então responde com os dados do planeta', (done) => {
            let planeta = new Planeta({
              nome: "Tatooine",
              terreno: "desértico",
              clima: "árido"
            });

            planeta.save((err, book) => {
                chai.request(server)
              .get('/planetas/' + planeta.id)
              .send(planeta)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('nome');
                    res.body.should.have.property('terreno');
                    res.body.should.have.property('clima');
                    res.body.should.have.property('_id').eql(book.id);
                done();
              });
            });
          });
      });

      describe('/PUT/:id planeta', () => {
          it('Quando receber uma requisição de atualização de um planeta existente então atualiza os dados e retorna o planeta atualizado', (done) => {
               let planeta = new Planeta({
              nome: "Tatooine",
              terreno: "desértico",
              clima: "árido"
              });

              planeta.save((err, book) => {
                    chai.request(server)
                    .put('/planetas/' + planeta.id)
                    .send({
                      nome: "Yavin IV",
                      terreno: "floresta",
                      clima: "temperado, tropical"
                    })
                    .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('object');
                          res.body.should.have.property('terreno').eql("floresta");
                          res.body.should.have.property('clima').eql("temperado, tropical");
                          res.body.should.have.property('aparicoes').eql(1);
                      done();
                    });
              });
          });
      });
  });

   describe('/DELETE/:id planeta', () => {
      it('Quando receber uma requisição para apagar um planeta existente então responde com mensagem de sucesso', (done) => {
          let planeta = new Planeta({
              nome: "Tatooine",
              terreno: "desértico",
              clima: "árido"
              });

          planeta.save((err, book) => {
                chai.request(server)
                .delete('/planetas/' + planeta.id)
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('message').eql('Planeta successfully deleted');
                  done();
                });
          });
      });
    });
});