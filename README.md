# Desafio B2W - Star Wars API

API Rest em NODE.js que permite as operações de CRUD de um planeta e carrega a quantidade de aparições da "Star Wars API (swapi.co)".

## Base URL
https://desafiob2w.herokuapp.com/

## Endpoints
* GET '/planetas/' - Retorna todos os planetas cadastrados
* GET '/planetas/search/:termoBusca' - Retorna todos os planetas cadastrados com a expressão informada no nome
* POST '/planetas/' - Cadastra um planeta
* GET '/planetas/:idPlaneta' - Retorna as informações de um planeta cadastrado
* PUT '/planetas/:idPlaneta' - Atualiza as informações de um planeta cadastrado
* DELETE '/planetas/:idPlaneta' - Apaga um planeta

## Objeto planeta
```js
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
  aparicoes: { //Mantido pelas informações do swapi
    type: Number,
  }
```
## Exemplos

* https://desafiob2w.herokuapp.com/planetas
* https://desafiob2w.herokuapp.com/planetas/search/Tatoo

## Testes
Os testes podem ser executados com o comando npm test.


