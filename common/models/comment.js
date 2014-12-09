module.exports = function(Comment) {
  Comment.getCommentsByPost = function(postId, cb) {
    Comment.find({
      where: {postId: postId},
      include: {
        relation: 'user',
        scope: {
          fields: ['username']
        }
      }
    }, cb);
  };
  Comment.remoteMethod('getCommentsByPost', {
    accepts: [
      {arg: 'postId', type: 'string', required: true}
    ],
    returns: {arg: 'comments', type: 'object'},
    http: {path: '/:postId/getCommentsByPost', verb: 'get'}
  })
};
