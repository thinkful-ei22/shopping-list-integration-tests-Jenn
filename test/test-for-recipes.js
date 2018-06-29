'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server.js');
const expect = chai.expect;
chai.use(chaiHttp);

describe('GET request', function(){
  it('should list items on GET', function(){
    return chai.request(app)
      .get('/recipes')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(1);
          
        const expectedKeys =['id', 'name', 'ingredients'];
        res.body.forEach(function(item){
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });
});

describe('POST request', function(){
  it('should post a new recipe', function(){
    const newRecipe = {name: 'coffee', ingredients: ['water', 'coffee']};
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(res){
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'name', 'ingredients');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newRecipe, {id: res.body.id}));
      });
  });
});

it('should update items on PUT', function() {
  const updateData = {
    name: 'foo',
    ingredients: ['bar','buzz']
  };
  return chai.request(app)
  // first have to get so we have an idea of object to update
    .get('/recipes')
    .then(function(res) {
      updateData.id = res.body[0].id;
      return chai.request(app)
        .put(`/recipes/${updateData.id}`)
        .send(updateData);
    })
    .then(function(res) {
      expect(res).to.have.status(204);
    //   expect(res).to.be.json;
    //   expect(res.body).to.be.a('object');
    //   expect(res.body).to.deep.equal(updateData);
    });
});

it('should delete items on DELETE', function() {
  return chai.request(app)
    .get('/recipes')
    .then(function(res) {
      return chai.request(app)
        .delete(`/recipes/${res.body[0].id}`);
    })
    .then(function(res) {
      expect(res).to.have.status(204);
    });
});
