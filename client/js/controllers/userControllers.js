(function() {
  'use strict';
  
  /**
   * @ngDoc overview
   * @name blogApp.userCtrls
   * @module
   * @description
   *
   * These are the controllers for registering, logging in
   * and logging out users
   */
  angular.module('blogApp.controllers.userCtrls', ['lbServices'])
  
    .controller('UserRegisterCtrl', UserRegisterCtrl)
    .controller('UserLoginCtrl', UserLoginCtrl)
    .controller('UserLogoutCtrl', UserLogoutCtrl);
  
  /**
   * @ngDoc overview
   * @name UserRegisterCtrl
   * @description
   *
   * Register a new user
   */
  UserRegisterCtrl.$inject = ['$rootScope', '$state', 'User'];
  
  function UserRegisterCtrl($rootScope, $state, User) {
    
    var vm = this;
    vm.userId = $rootScope.utils.getCurrentUser();
    vm.newUser = {};
    vm.error = '';
    vm.register = register;

    function register() {
      var user = {
        username: vm.newUser.username,
        email: vm.newUser.email,
        password: vm.newUser.password
      };
      User
        .create(user)
        .$promise
        .then(function() {
          User.login(user, function() {
            $state.go('blog');
          });
        }, function(err) {
        console.log(err);
          vm.error = err.data.error.message;
        });
    }
  }

  /**
   * @ngDoc overview
   * @name UserLoginCtrl
   * @description
   *
   * Login an existing user
   */
  UserLoginCtrl.$inject = ['$rootScope', '$state', 'User'];
  
  function UserLoginCtrl($rootScope, $state, User) {
    
    var vm = this;
    vm.userId = $rootScope.utils.getCurrentUser();
    vm.user = {};
    vm.loginFail = false;
    vm.login = login;

    function login() {
      User.login({
        email: vm.user.email,
        password: vm.user.password
      })
      .$promise
      .then(function() {
        vm.loginFail = false;
        $state.go('blog');
      }, function(err) {
        vm.loginFail = true;
      });
    }
  }

  /**
   * @ngDoc overview
   * @name UserLogoutCtrl
   * @description
   *
   * Logout a currently logged in user
   */
  UserLogoutCtrl.$inject = ['$state', 'User'];
  
  function UserLogoutCtrl($state, User) {
    User.logout()
      .$promise
      .then(function() {
        $state.go('blog');
      });
  }
  
})();