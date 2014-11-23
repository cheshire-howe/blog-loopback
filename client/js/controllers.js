'use strict';

var blogControllers = angular.module('blogControllers', []);

blogControllers.controller('BlogCtrl', ['$scope', 'Post',
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