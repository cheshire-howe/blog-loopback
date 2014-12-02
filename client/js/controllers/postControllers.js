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
  var postCtrls = angular.module('blogApp.controllers.postCtrls',
                                 ['lbServices']);
  
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
    vm.userId = '';
    vm.posts = [];
    vm.collapse = collapse;
    
    getCurrentUser();
    getPosts();

    // collapses bootstrap navbar 
    function collapse() {
      $rootScope.isCollapsed = true;
    }
    
    // gets current user info to set view permissions
    function getCurrentUser() {
      // loopback stores userId in localStorage, let's get it
      vm.userId = localStorage.getItem('$LoopBack$currentUserId') ?
        localStorage.getItem('$LoopBack$currentUserId') : '';
      // use the outcome to set the global isLoggedIn variable
      if(vm.userId) $rootScope.isLoggedIn = true;
      else $rootScope.isLoggedIn = false;
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
    vm.userId = '';
    vm.addPost = addPost;
    vm.newPost = vm.newPost || {};
    
    getCurrentUser();
    
    // gets current user info to set view permissions
    function getCurrentUser() {
      // loopback stores userId in localStorage, let's get it
      vm.userId = localStorage.getItem('$LoopBack$currentUserId') ?
        localStorage.getItem('$LoopBack$currentUserId') : '';
      // use the outcome to set the global isLoggedIn variable
      if(vm.userId) $rootScope.isLoggedIn = true;
      else $rootScope.isLoggedIn = false;
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
    }
  }

  /**
   * @ngDoc overview
   * @name PostDetailsCtrl
   * @module
   * @description
   *
   * Shows the details of a post and enable edit or delete
   * for the user who wrote it
   */
  postCtrls.controller('PostDetailCtrl', PostDetailCtrl);
  PostDetailCtrl.$inject = ['$rootScope', '$stateParams', '$state',
                            'Post', 'Comment', 'User'];
                            
  function PostDetailCtrl($rootScope, $stateParams, $state,
                          Post, Comment, User) {
    
    $state.transitionTo('postDetail.comments', $stateParams);
    var vm = this;
    vm.userId = '';
    vm.post = getPost();
    vm.deletePost = deletePost;
    
    getCurrentUser();
    
    // gets current user info to set view permissions
    function getCurrentUser() {
      // loopback stores userId in localStorage, let's get it
      vm.userId = localStorage.getItem('$LoopBack$currentUserId') ?
        localStorage.getItem('$LoopBack$currentUserId') : '';
      // use the outcome to set the global isLoggedIn variable
      if(vm.userId) $rootScope.isLoggedIn = true;
      else $rootScope.isLoggedIn = false;
    }

    // get the post in question
    function getPost() {
      var filter = {
        filter: {
          where: {id: $stateParams.id},
          include: {
            relation: 'user',
            scope: {
              fields: ['username']
            }
          }
        }
      };
      return Post.findOne(filter);
    }

    // delete this post and all related comments
    function deletePost() {
      Post
        .comments.destroyAll({
          id: vm.post.id
        })
        .$promise
        .then(function() {
          User
            .posts.destroyById(
              {
                id: vm.userId,
                fk: vm.post.id
              })
            .$promise
            .then(function() {
              $state.go('blog');
            });
        });
    }
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
    
    var vm = this;
    vm.userId = '';
    vm.newPost = getPost();
    vm.editPost = editPost;
    
    getCurrentUser();
    
    // gets current user info to set view permissions
    function getCurrentUser() {
      // loopback stores userId in localStorage, let's get it
      vm.userId = localStorage.getItem('$LoopBack$currentUserId') ?
        localStorage.getItem('$LoopBack$currentUserId') : '';
      // use the outcome to set the global isLoggedIn variable
      if(vm.userId) $rootScope.isLoggedIn = true;
      else $rootScope.isLoggedIn = false;
    }

    // get the post to be edited from db
    function getPost() {
      return Post.get({id: $stateParams.id});
    }

    // save edited changes with PUT request
    function editPost(data) {
      User
        .posts.updateById(
        {
          id: vm.userId,
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
    }
  }
})();