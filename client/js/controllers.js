'use strict';

var blogControllers = angular.module('blogControllers', []);

blogControllers.controller('PostCtrl', ['$scope', 'Post',
  function($scope, Post) {
    $scope.posts = [];
    Post
      .find()
      .$promise
      .then(function(results) {
        $scope.posts = results;
      });
  }]);

blogControllers.controller('PostCreateCtrl', ['$scope', '$state', 'Post',
  function($scope, $state, Post) {
    $scope.addPost = function() {
      Post
        .create($scope.newPost)
        .$promise
        .then(function(post) {
          $scope.postForm.$setPristine();
          $state.go('blog');
        });
    };
  }]);

blogControllers.controller('PostDetailCtrl', ['$scope',
                                              '$stateParams',
                                              '$state',
                                              'Post',
  function($scope, $stateParams, $state, Post) {
    $scope.post = Post.get({id: $stateParams.id});
    
    $scope.deletePost = function(id) {
      Post
        .deleteById({ id: id })
        .$promise
        .then(function() {
          $state.go('blog');
        });
    };
  }]);

blogControllers.controller('PostEditCtrl', ['$scope',
                                            '$stateParams',
                                            '$state',
                                            'Post',
  function($scope, $stateParams, $state, Post) {
    $scope.newPost = Post.get({id: $stateParams.id});
    
    $scope.editPost = function() {
      $scope.newPost.$save(function () {
        $state.go('blog');
      });
    };
  }]);
