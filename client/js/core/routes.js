(function() {
  'use strict';
  
  var routes = angular.module('blogApp.core.routes', ['ui.router']);
  
  /**
   * @ngDoc module
   * @description
   * 
   * Initializes routes and controllers.
   * Also configures html5 mode
   */
  routes.config([
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
        })
        .state('register', {
          url: '/userRegister',
          templateUrl: 'js/users/templates/register.html',
          controller: 'UserRegisterCtrl'
        })
        .state('login', {
          url: '/userLogin',
          templateUrl: 'js/users/templates/login.html',
          controller: 'UserLoginCtrl'
        })
        .state('logout', {
          url: '/userLogout',
          controller: 'UserLogoutCtrl'
        });
      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
    }
  ]);
})();