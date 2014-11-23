'use strict';

var blogApp = angular.module('blogApp', [
  'lbServices',
  'ui.router',
  'ui.bootstrap',
  'blogControllers',
  'blogDirectives'
]);

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
      .state('postDetail', {
        url: '/Post/:id',
        templateUrl: 'js/blog/templates/detail.html',
        controller: 'PostDetailCtrl'
      })
      .state('postCreate', {
        url: '/Post/create',
        templateUrl: 'js/blog/templates/create.html',
        controller: 'PostCreateCtrl'
      });
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  }
]);
