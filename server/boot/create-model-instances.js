var debug = require('debug')('boot:create-model-instances');

module.exports = function(app) {
  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  
  User.create([
    {username: 'Josh', email: 'josh@gmail.com', password: 'foobar'},
    {username: 'Chris', email: 'chris@gmail.com', password: 'foobar'},
    {username: 'Jill', email: 'jill@gmail.com', password: 'foobar'}
  ], function(err, users) {
    if (err) return debug('%j', err);
    debug(users);
    // create post 1 and make josh the author
    users[0].posts.create({
      id: "1",
      title: "A New Post",
      content: "A long time ago, on a server far, far away...."
    }, function(err, post) {
      if (err) return debug(err);
      debug(post);
      // add a comment
      post.comments.create({
        content: "Great!",
        postId: post.id,
        userId: users[1].id
      });
    });
    
    // create admin role
    Role.create({
      name: 'admin'
    }, function(err, role) {
      if (err) return debug(err);
      debug(role);
      // make josh an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id
      }, function(err, principal) {
        if (err) return debug(err);
        debug(principal);
      });
    });
  });
};