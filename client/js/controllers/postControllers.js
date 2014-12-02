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
  angular.module('blogApp.controllers.postCtrls', ['lbServices'])
  
    .controller('PostCtrl', PostCtrl)
    .controller('PostCreateCtrl', PostCreateCtrl)
    .controller('PostDetailCtrl', PostDetailCtrl)
    .controller('PostEditCtrl', PostEditCtrl);
  
  /**
   * @ngDoc overview
   * @name PostCtrl
   * @description
   *
   * This lists all the posts in the database
   */
  PostCtrl.$inject = ['$rootScope', 'Post', 'User'];

  function PostCtrl($rootScope, Post, User) {
    
    // declare variables in this scope
    var vm = this;
    vm.userId = $rootScope.utils.getCurrentUser();
    vm.posts = [];
    vm.collapse = collapse;
    
    getPosts();

    // collapses bootstrap navbar 
    function collapse() {
      $rootScope.isCollapsed = true;
    }

    // gets an array of posts
    function getPosts() {
      Post
        // remote method that returns `posts` array with username
        .findAll()
        .$promise
        .then(function(results) {
          vm.posts = results.posts;
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
  PostCreateCtrl.$inject = ['$rootScope', '$state', 'Post', 'User'];
  
  function PostCreateCtrl($rootScope, $state, Post, User) {
    
    // declare variables in scope
    var vm = this;
    vm.userId = $rootScope.utils.getCurrentUser();
    vm.addPost = addPost;
    vm.newPost = vm.newPost || {};

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
   * @description
   *
   * Shows the details of a post and enable edit or delete
   * for the user who wrote it
   */
  PostDetailCtrl.$inject = ['$rootScope', '$stateParams', '$state',
                            'Post', 'User'];
                            
  function PostDetailCtrl($rootScope, $stateParams, $state,
                          Post, User) {
    
    $state.transitionTo('postDetail.comments', $stateParams);
    var vm = this;
    vm.userId = $rootScope.utils.getCurrentUser();
    vm.post = {};
    vm.deletePost = deletePost;

    getPost();
    
    // get the post in question
    function getPost() {
      Post
        // call remote method to protect user's email
        .findSingle({id: $stateParams.id})
        .$promise
        .then(function(result) {
          vm.post = result.post;
        });
    }

    // delete this post and all related comments
    function deletePost() {
      Post
        // try to destroy all comments first. Backend is set up so
        // that if a user who is not the owner of this post tries
        // to delete all comments this will fail, causing the entire
        // function to fail
        .comments.destroyAll({
          id: vm.post.id
        })
        .$promise
        .then(function() {
          User
            // on successful destruction of comments, the post can now
            // be removed from the database through the owning user
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
   * @name PostEditCtrl
   * @description
   *
   * Methods for editing a post
   */
  PostEditCtrl.$inject = ['$rootScope', '$scope', '$stateParams',
                          '$state', 'Post', 'User'];

  function PostEditCtrl($rootScope, $scope, $stateParams, $state, Post, User) {
    
    var vm = this;
    vm.userId = $rootScope.utils.getCurrentUser();
    vm.newPost = {};
    vm.editPost = editPost;
    
    getPost();

    // get the post to be edited from db
    function getPost() {
      Post
        // call remote method to protect user's email
        .findSingle({id: $stateParams.id})
        .$promise
        .then(function(result) {
          vm.newPost = result.post;
        });
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