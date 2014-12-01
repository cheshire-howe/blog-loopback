'use strict';

var blogControllers = angular.module('blogControllers', []);

blogControllers.controller('PostCtrl', ['$rootScope',
                                        '$scope',
                                        'Post',
                                        'User',
  function($rootScope, $scope, Post, User) {
    User.getCurrent()
      .$promise
      .then(function() {
        $rootScope.isLoggedIn = true;
      }, function() {
        $rootScope.isLoggedIn = false;
      });
    
    $scope.collapse = function() {
      $rootScope.isCollapsed = true;
    };
    
    $scope.posts = [];
    var filter = {
      filter: {
        include: {
          relation: 'user',
          scope: {
            fields: ['username']
          }
        }
      }
    };
    Post
      .find(filter)
      .$promise
      .then(function(results) {
        $scope.posts = results;
      });
  }]);

blogControllers.controller('PostCreateCtrl', ['$rootScope',
                                              '$scope',
                                              '$state',
                                              'Post',
                                              'User',
  function($rootScope, $scope, $state, Post, User) {
    User.getCurrent()
      .$promise
      .then(function(user) {
        $rootScope.isLoggedIn = true;
        $scope.userId = user.id;
      }, function() {
        $rootScope.isLoggedIn = false;
      });
    
    $scope.addPost = function() {
      $scope.newPost.userId = $scope.userId;
      Post
        .create($scope.newPost)
        .$promise
        .then(function(post) {
          $scope.postForm.$setPristine();
          $state.go('blog');
        });
    };
  }]);

blogControllers.controller('PostDetailCtrl', ['$rootScope',
                                              '$scope',
                                              '$stateParams',
                                              '$state',
                                              'Post',
                                              'Comment',
                                              'User',
  function($rootScope, $scope, $stateParams, $state, Post, Comment, User) {
    User.getCurrent()
      .$promise
      .then(function(user) {
        $rootScope.isLoggedIn = true;
        $scope.userId = user.id;
      }, function() {
        $rootScope.isLoggedIn = false;
      });
    
    $scope.post = Post.findOne({
      filter: {
        where: {id: $stateParams.id},
        include: 'user'
      }
    }, function() {
      $scope.comments = Post.comments({
        id: $stateParams.id
      });
    });
    
    $scope.deletePost = function() {
      Post
        .comments.destroyAll({
          id: $scope.post.id
        })
        .$promise
        .then(function() {
          User
            .posts.destroyById(
              {
                id: $scope.userId,
                fk: $scope.post.id
              })
            .$promise
            .then(function() {
              $state.go('blog');
            });
        });
    };

    $scope.addComment = function() {
      Post
        .comments.create(
          { id: $scope.post.id },
          {
            content: $scope.newComment.content,
            userId: $scope.userId
          }
        )
        .$promise
        .then(function(comment) {
          $scope.newComment = '';
          $scope.commentForm.$setPristine();
          $scope.comments.push(comment);
        });
    };
    
    $scope.editComment = function(data, id, index) {
      User
        .comments.updateById(
        {
          fk: id,
          id: $scope.userId
        },
        {
          content: data
        })
        .$promise
        .then(function() {
          // all good
        }, function(err) {
          // on fail, update the client model to match the
          // server model
          $scope.comments[index] = Comment.findById({id: id});
        });
    };
    
    $scope.deleteComment = function(id, index) {
      User
        .comments.destroyById(
        {
          fk: id,
          id: $scope.userId
        })
        .$promise
        .then(function() {
          $scope.comments.splice(index, 1);
        });
    };
    
  }]);

blogControllers.controller('PostEditCtrl', ['$rootScope',
                                            '$scope',
                                            '$stateParams',
                                            '$state',
                                            'Post',
                                            'User',
  function($rootScope, $scope, $stateParams, $state, Post, User) {
    User.getCurrent()
      .$promise
      .then(function(user) {
        $rootScope.isLoggedIn = true;
        $scope.userId = user.id;
      }, function() {
        $rootScope.isLoggedIn = false;
      });
    
    $scope.newPost = Post.get({id: $stateParams.id});
    
    $scope.editPost = function(data) {
      User
        .posts.updateById(
        {
          id: $scope.userId,
          fk: $stateParams.id
        },
        {
          title: data.title,
          content: data.content
        })
        .$promise
        .then(function() {
          $state.go('postDetail', {id: $stateParams.id});
        });
      /*$scope.newPost.$save(function () {
        $state.go('postDetail', {id: $stateParams.id});
      });*/
    };
  }]);

blogControllers.controller('UserRegisterCtrl', ['$rootScope',
                                                '$scope',
                                                '$state',
                                                'User',
  function($rootScope, $scope, $state, User) {
    User.getCurrent()
      .$promise
      .then(function(user) {
        $rootScope.isLoggedIn = true;
        $scope.userId = user.id;
        $state.go('blog');
      }, function() {
        $rootScope.isLoggedIn = false;
      });
    
    $scope.register = function() {
      var user = {
        username: $scope.newUser.username,
        email: $scope.newUser.email,
        password: $scope.newUser.password
      };
      User
        .create(user)
        .$promise
        .then(function() {
          User.login(user, function() {
            $state.go('blog');
          });
        }, function(err) {
        console.log(err);
          $scope.error = err.data.error.message;
        });
    };
  }]);

blogControllers.controller('UserLoginCtrl', ['$rootScope',
                                             '$scope',
                                             '$state',
                                             'User',
  function($rootScope, $scope, $state, User) {
    User.getCurrent()
      .$promise
      .then(function(user) {
        $rootScope.isLoggedIn = true;
        $scope.userId = user.id;
        $state.go('blog');
      }, function() {
        $rootScope.isLoggedIn = false;
      });
    
    $scope.login = function() {
      User.login({
        email: $scope.user.email,
        password: $scope.user.password
      })
      .$promise
      .then(function() {
        $scope.loginFail = false;
        $state.go('blog');
      }, function(err) {
        $scope.loginFail = true;
      });
    };
  }]);

blogControllers.controller('UserLogoutCtrl', ['$state',
                                              'User',
  function($state, User) {
    User.logout()
      .$promise
      .then(function() {
        $state.go('blog');
      });
  }
]);
