'use strict';

var blogApp = angular.module('blogApp', [
  'lbServices',
  'ui.router',
  'ui.bootstrap',
  'xeditable',
  'blogControllers',
  'blogDirectives'
]);

blogApp.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

blogApp.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('blog', {
        url: '/',
        templateUrl: 'js/blog/templates/posts.html',
        controller: 'PostCtrl'
      })
      .state('postCreate', {
        url: '/Post/create',
        templateUrl: 'js/blog/templates/create.html',
        controller: 'PostCreateCtrl'
      })
      .state('postDetail', {
        url: '/Post/:id',
        templateUrl: 'js/blog/templates/detail.html',
        controller: 'PostDetailCtrl'
      })
      .state('postEdit', {
        url: '/Post/:id/edit',
        templateUrl: 'js/blog/templates/edit.html',
        controller: 'PostEditCtrl'
      });
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  }
]);
