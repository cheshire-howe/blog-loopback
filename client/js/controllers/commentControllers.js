(function() {
  'use strict';

  /**
   * @ngDoc overview
   * @name CommentCtrl
   * @description
   *
   * Controller for CRUD methods of comments
   *
   * This controller handles all the methods of comments and hooks
   * into the comments.html view which is a child of postDetail
   */
  angular.module('blogApp.controllers.commentCtrls', ['lbServices'])
    .controller('CommentCtrl', CommentCtrl);
  
  
  CommentCtrl.$inject = ['$stateParams', 'Post', 'Comment', 'User'];
  
  function CommentCtrl($stateParams, Post, Comment, User) {
    
    var vm = this;
    vm.userId = localStorage.getItem('$LoopBack$currentUserId');
    vm.comments = getComments();
    vm.addComment = addComment;
    vm.editComment = editComment;
    vm.deleteComment = deleteComment;
    
    // get all comments for this post
    function getComments() {
      return Post.comments({
        id: $stateParams.id
      });
    }

    // adds a comment through the post model
    function addComment() {
      Post
        .comments.create(
          { id: $stateParams.id },
          {
            content: vm.newComment.content,
            userId: vm.userId
          }
        )
        .$promise
        // reset the comment form and add new comment to list
        .then(function(comment) {
          vm.newComment = '';
          vm.commentForm.$setPristine();
          vm.comments.push(comment);
        });
    }

    // xeditable calls this method to edit comment through the
    // current user
    function editComment(data, id, index) {
      User
        .comments.updateById(
        {
          fk: id,
          id: vm.userId
        },
        {
          content: data
        })
        .$promise
        .then(function() {
          // comment belongs to user so do nothing,
        }, function(err) {
          // on fail(404), update the client model to match the server model
          vm.comments[index] = Comment.findById({id: id});
        });
    }

    // delete a comment through the current user and remove from screen
    function deleteComment(id, index) {
      User
        .comments.destroyById(
        {
          fk: id,
          id: vm.userId
        })
        .$promise
        .then(function() {
          vm.comments.splice(index, 1);
        });
    }
  }
  
})();