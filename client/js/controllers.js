'use strict';

var blogControllers = angular.module('blogControllers', []);

blogControllers.controller('PostCtrl', ['$scope', 'Post',
  function($scope, Post) {
    $scope.posts = Post.query();
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
      Post.delete({ id: id }, function() {
        $state.go('blog');
      });
    };
  }]);