(function() {
  'use strict';
  
  /**
   * @ngDoc module
   * @description
   * 
   * Initializes routes and controllers.
   * Also configures html5 mode
   */
  angular.module('blogApp.core.routes', ['ui.router'])
    .config(routeConfig);
    
  
  routeConfig.$inject =  ['$stateProvider', '$urlRouterProvider',
                          '$locationProvider'];
  
  function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('blog', {
        url: '/',
        templateUrl: 'js/blog/templates/posts.html',
        controller: 'PostCtrl',
        controllerAs: 'Posts'
      })
      .state('postCreate', {
        url: '/Post/create',
        templateUrl: 'js/blog/templates/create.html',
        controller: 'PostCreateCtrl',
        controllerAs: 'PostCreate'
      })
      .state('postDetail', {
        url: '/Post/:id',
        resolve: {
          id: ['$stateParams', function($stateParams) {
            return $stateParams.id;
          }]
        },
        views: {
          '' : {
            templateUrl: 'js/blog/templates/detail.html'
          },
          'singlePost@postDetail': {
            templateUrl: 'js/blog/templates/partials/singlePost.html',
            controller: 'PostDetailCtrl',
            controllerAs: 'PostDetail'
          },
          'comments@postDetail': {
            templateUrl: 'js/blog/templates/partials/comments.html',
            controller: 'CommentCtrl',
            controllerAs: 'Comments'
          }
        }
      })
      .state('postEdit', {
        url: '/Post/:id/edit',
        templateUrl: 'js/blog/templates/edit.html',
        controller: 'PostEditCtrl',
        controllerAs: 'PostEdit'
      })
      .state('register', {
        url: '/userRegister',
        templateUrl: 'js/users/templates/register.html',
        controller: 'UserRegisterCtrl',
        controllerAs: 'Register'
      })
      .state('login', {
        url: '/userLogin',
        templateUrl: 'js/users/templates/login.html',
        controller: 'UserLoginCtrl',
        controllerAs: 'Login'
      })
      .state('logout', {
        url: '/userLogout',
        controller: 'UserLogoutCtrl'
      });
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  }
})();