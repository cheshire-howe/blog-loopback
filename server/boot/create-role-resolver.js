var debug = require('debug')('boot:create-role-resolver');

module.exports = function(app) {
  var Role = app.models.Role;
  Role.registerResolver('postAuthor', function(role, context, cb) {
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }
    
    if (context.modelName !== 'Post') {
      // the target model is not a Post
      return reject();
    }
    
    var userId = context.accessToken.userId;
    if (!userId) {
      return reject(); // do not allow anonymous
    }
    // if the userId is not the Post.userId, reject
    context.model.findById(context.modelId, function(err, post) {
      if (err || !post) {
        return reject();
      }
      
      if (post.userId.toString() !== userId.toString()) {
        return cb(null, false);
      } else {
        return cb(null, true);
      }
    });
  });
  
  Role.registerResolver('commentAuthor', function(role, context, cb) {
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }
    
    if (context.modelName !== 'Post') {
      // the target model is not a Post
      return reject();
    }
    
    var userId = context.accessToken.userId;
    if (!userId) {
      return reject(); // do not allow anonymous
    }
    // if the userId is not the Post.userId, reject
    context.model.findById(context.modelId, function(err, post) {
      if (err || !post) {
        return reject();
      }
      
      var Comment = app.models.Comment;
      Comment.count({
        postId: post.id,
        userId: userId
      }, function(err, count) {
        if (err) {
          debug(err);
          return cb(null, false);
        }
        cb(null, count > 0);
      })
      
    });
  });
  
};