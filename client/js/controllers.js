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
    Post
      .find()
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
    
    $scope.post = Post.get({id: $stateParams.id});
    
    function getComments() {
      $scope.comments = Post.prototype$__get__comments({
        id: $stateParams.id
      });
    }
    getComments();
    
    $scope.deletePost = function(id) {
      Post
        .deleteById({ id: id })
        .$promise
        .then(function() {
          $state.go('blog');
        });
    };

    $scope.addComment = function() {
      Post
        .prototype$__create__comments(
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
          getComments();
        });
    };
    
    $scope.editComment = function(data, id) {
      Post
        .prototype$__updateById__comments(
        {
          fk: id,
          id: $scope.post.id
        },
        {
          content: data,
          userId: $scope.userId
        });
    };
    
    $scope.deleteComment = function(id) {
      Post
        .prototype$__destroyById__comments(
        {
          fk: id,
          id: $scope.post.id
        })
        .$promise
        .then(function() {
          getComments();
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
    
    $scope.editPost = function() {
      $scope.newPost.$save(function () {
        $state.go('postDetail', {id: $stateParams.id});
      });
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
        $rootScope.isLoggedIn = true;
        $state.go('blog');
      }, function(err) {
        $scope.loginFail = true;
      });
    };
  }]);
