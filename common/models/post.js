module.exports = function(Post) {
  // return all Posts with the username of the author
  Post.findAll = function(cb) {
    Post.find({
      include: {
        relation: 'user',
        scope: {
          fields: ['username']
        }
      }
    }, cb);
  };
  Post.remoteMethod('findAll', {
    returns: {arg: 'posts', type: 'array'},
    http: {path: '/findAll', verb: 'get'}
  });
  
  // return one Post with the username of the author
  Post.findSingle = function(id, cb) {
    return Post.findOne({
      where: {id: id},
      include: {
        relation: 'user',
        scope: {
          fields: ['username']
        }
      }
    }, cb);
  };
  Post.remoteMethod('findSingle', {
    accepts: [
      {arg: 'id', type: 'string', required: true}
    ],
    returns: {arg: 'post', type: 'object'},
    http: {path: '/:id/findSingle', verb: 'get'}
  });
};
