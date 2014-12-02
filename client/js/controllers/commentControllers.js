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
  var commentCtrls = angular.module('blogApp.controllers.commentCtrls',
                                 ['lbServices']);
  
  /**
   * @ngDoc overview
   * @name CommentCtrl
   * @description
   *
   * Controller for CRUD methods of comments
   */
  commentCtrls.controller('CommentCtrl', CommentCtrl);
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

    // send POST request to add comment
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

    // xeditable calls this method to edit comment
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
        // if comment belongs to user do nothing,
        // if not, revert
        .then(function() {
          // all good
        }, function(err) {
          // on fail, update the client model to match the
          // server model
          vm.comments[index] = Comment.findById({id: id});
        });
    }

    // delete a comment and remove from screen
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