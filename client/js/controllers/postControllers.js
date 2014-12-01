(function() {
  'use strict';

  /**
   * @ngDoc overview
   * @name blogApp.postCtrls
   * @module
   * @description
   *
   * These are the controllers for blog posts
   */
  var postCtrls = angular.module('blogApp.controllers.postCtrls', ['lbServices']);
  
  /**
   * @ngDoc overview
   * @name PostCtrl
   * @description
   *
   * This lists all the posts in the database
   */
  postCtrls.controller('PostCtrl', PostCtrl);
  PostCtrl.$inject = ['$rootScope', 'Post', 'User'];

  function PostCtrl($rootScope, Post, User) {
    
    // declare variables in this scope
    var vm = this;
    vm.posts = [];
    vm.collapse = collapse;
    vm.userId = '';
    
    getCurrentUser();
    getPosts();

    // collapses bootstrap navbar 
    function collapse() {
      $rootScope.isCollapsed = true;
    };
    
    // gets current user info to set view permissions
    function getCurrentUser() {
      User.getCurrent()
        .$promise
        .then(function(user) {
          $rootScope.isLoggedIn = true;
          vm.userId = user.id;
        }, function() {
          $rootScope.isLoggedIn = false;
        });
    }

    // gets an array of posts
    function getPosts() {
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
          vm.posts = results;
        });
    }
    
  }

  /**
   * @ngDoc overview
   * @name PostCreateCtrl
   * @description
   *
   * Creation of a post is made possible
   */
  postCtrls.controller('PostCreateCtrl', PostCreateCtrl);
  PostCreateCtrl.$inject = ['$rootScope', '$state',
                            'Post', 'User'];
  function PostCreateCtrl($rootScope, $state, Post, User) {
    
    // declare variables in scope
    var vm = this;
    vm.addPost = addPost;
    vm.newPost = vm.newPost || {};
    
    getCurrentUser();
    
    // gets current user info to set view permissions
    function getCurrentUser() {
      User.getCurrent()
        .$promise
        .then(function(user) {
          $rootScope.isLoggedIn = true;
          vm.userId = user.id;
        }, function() {
          $rootScope.isLoggedIn = false;
        });
    }

    // add the post to the database
    function addPost() {
      vm.newPost.userId = vm.userId;
      Post
        .create(vm.newPost)
        .$promise
        .then(function(post) {
          vm.postForm.$setPristine();
          $state.go('blog');
        });
    };
  }

  /**
   * @ngDoc overview
   * @name PostDetailsCtrl
   * @module
   * @description
   *
   * Shows the details of a post
   * Comment CRUD actions are in this controller, but this will
   * be refactored into comment ctrls
   */
  postCtrls.controller('PostDetailCtrl', PostDetailCtrl);
  PostDetailCtrl.$inject = ['$rootScope', '$scope', '$stateParams',
                            '$state', 'Post', 'Comment', 'User',];
                            
  function PostDetailCtrl($rootScope, $scope, $stateParams,
                          $state, Post, Comment, User) {
    User.getCurrent()
      .$promise
      .then(function(user) {
        $rootScope.isLoggedIn = true;
        $scope.userId = user.id;
      }, function() {
        $rootScope.isLoggedIn = false;
      });

    // get the post in question, callback to get comments
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

    // delete this post
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

    // send POST request to add comment
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
        // reset the comment form and add new comment to list
        .then(function(comment) {
          $scope.newComment = '';
          $scope.commentForm.$setPristine();
          $scope.comments.push(comment);
        });
    };

    // xeditable calls this method to edit comment
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
        // if comment belongs to user do nothing,
        // if not, revert
        .then(function() {
          // all good
        }, function(err) {
          // on fail, update the client model to match the
          // server model
          $scope.comments[index] = Comment.findById({id: id});
        });
    };

    // delete a comment and remove from screen
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

  }
  
  /**
   * @ngDoc overview
   * @name PostCtrl
   * @module
   * @description
   *
   * Methods for editing a post
   */
  postCtrls.controller('PostEditCtrl', PostEditCtrl);
  PostEditCtrl.$inject = ['$rootScope', '$scope', '$stateParams',
                          '$state', 'Post', 'User'];

  function PostEditCtrl($rootScope, $scope, $stateParams, $state, Post, User) {
    User.getCurrent()
      .$promise
      .then(function(user) {
        $rootScope.isLoggedIn = true;
        $scope.userId = user.id;
      }, function() {
        $rootScope.isLoggedIn = false;
      });

    // get the post to be edited from db
    $scope.newPost = Post.get({id: $stateParams.id});

    // save edited changes with PUT request
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
    };
  }
})();