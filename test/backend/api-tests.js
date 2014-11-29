/* jshint expr: true */
/* global beforeEach */
var should = require('chai').should();
var supertest = require('supertest');
var app = require('../../server/server');
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
    
    it('should return 401 on any unauthorized POST request', function(done) {
      api.post(url)
        .send({ name: "Josh", isa: "guy"})
        .expect(401, done);
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
    
    var url = '/api/Posts/1/comments';
    
    it('should not be a public api', function(done) {
      api.get('/api/Comments')
        .expect(404, done);
    });
    
    it('should be nested in Posts', function(done) {
      api.get(url)
        .expect(200, done);
    });
    /*
    it('should return 200 on successful POST request', function(done) {
      api.post(url)
        .send({ content: "Comment" })
        .expect(200, done);
    });
    */
    it('should return 422 on bad data input', function(done) {
      api.post(url)
        .send({ name: "Comment" })
        .expect(422, done);
    });
    
    it('should return 404 when postId does not exist', function(done) {
      api.get('/api/Posts/2/comments')
        .expect(404, done);
    });
    
  });
});