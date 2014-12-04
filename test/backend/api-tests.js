/* jshint expr: true */
/* global beforeEach */
var should = require('chai').should();
var supertest = require('supertest');
var app = require('../../server/server');
var api = supertest(app);

describe('Blog post api', function() {
  describe('blog post', function() {
    
    var url = '/api/Posts';
    
    it('should return 200 on GET /api/Posts/findAll', function(done) {
      api.get(url + '/findAll')
        .expect(200, done);
    });

    it('should return 401 on GET /api/Posts', function(done) {
      api.get(url)
        .expect(401, done);
    });
    
    it('should return a json object', function(done) {
      api.get(url)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);
          done();
        });
    });
    
    it('should return 401 on any unauthorized POST request', function(done) {
      api.post(url)
        .send({ name: "Josh", isa: "guy"})
        .expect(401, done);
    });
    
    it('should return 401 on POST attempt', function(done) {
      api.post(url)
        .send({ id: 25, title: "Blog", content: "Post"})
        .expect(401, done);
    });
    
    it('should return 401 on DELETE attempt', function(done) {
      api.delete(url + '/25')
        .expect(401, done);
    });
    
  });
  
  describe('comments on blog posts', function() {
    
    var url = '/api/Posts/1/comments';
    
    it('should not be a public api', function(done) {
      api.get('/api/Comments')
        .expect(401, done);
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
    it('should return 401 on any POST request', function(done) {
      api.post(url)
        .send({ name: "Comment" })
        .expect(401, done);
    });
    
    it('should return 404 when postId does not exist', function(done) {
      api.get('/api/Posts/2/comments')
        .expect(404, done);
    });
    
  });
});