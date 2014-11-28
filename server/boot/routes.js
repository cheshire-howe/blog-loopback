module.exports = function(app) {
  var router = app.loopback.Router();
  
  router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    app.models.user.login({
      email: email,
      password: password
    }, 'user', function(err, token) {
      if (err) {
        res.statusCode = 400;
        res.send({
          loginFailed: true
        });
      } else {
        token = token.toJSON();
        res.statusCode = 200;
        res.send({
          username: token.user.username,
          accessToken: token.id
        });
      }
    });
  });
  
  router.get('/logout', function(req, res) {
    var AccessToken = app.models.AccessToken;
    var token = new AccessToken({id: req.query.access_token});
    token.destroy();
    res.statusCode = 200;
    res.end();
  });
  
  app.use(router);
};