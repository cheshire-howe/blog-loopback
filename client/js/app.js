'use strict';

var blogApp = angular.module('blogApp', [
  'lbServices',
  'ui.router',
  'ui.bootstrap',
  'blogControllers'
]);

blogApp.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('blog', {
        url: '',
        templateUrl: 'js/blog/templates/blog.html',
        controller: 'BlogCtrl'
      })
      .state('postCreate', {
        url: '/Post/create',
        templateUrl: 'js/blog/templates/create.html',
        controller: 'PostCreateCtrl'
      });
    $urlRouterProvider.otherwise('blog');
  }
]);
