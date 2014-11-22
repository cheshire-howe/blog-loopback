/* jshint expr: true */
/* global beforeEach */
var should = require('chai').should();
var supertest = require('supertest');
var app = require('../server/server');
var api = supertest(app);

describe('Blog post api', function() {
  describe('blog post', function() {
    
    var url = '/api/Posts';
    
    it('should return a status code of 200 on GET /api/Posts', function(done) {
      api.get(url)
        .expect(200, done);
    });
    
    it('should return a json array', function(done) {
      api.get(url)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });
    
    it('should return 422 on bad POST request', function(done) {
      api.post(url)
        .send({ name: "Josh", isa: "guy"})
        .expect(422, done);
    });
    /*
    it('should return 201 on successful POST', function(done) {
      api.post(url)
        .send({ title: "Blog", content: "Post"})
        .expect(200, done);
    });
    */
  });
  
  describe('comment on blog post', function() {
    
  });
});