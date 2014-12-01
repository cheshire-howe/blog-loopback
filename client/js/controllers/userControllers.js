(function() {
  'use strict';
  
  var userCtrls = angular.module('blogApp.controllers.userCtrls', ['lbServices']);
  
  userCtrls.controller('UserRegisterCtrl', UserRegisterCtrl);
  UserRegisterCtrl.$inject = ['$rootScope', '$scope', '$state',
                              'User'];
  
  function UserRegisterCtrl($rootScope, $scope, $state, User) {
    User.getCurrent()
      .$promise
      .then(function(user) {
        $rootScope.isLoggedIn = true;
        $scope.userId = user.id;
        $state.go('blog');
      }, function() {
        $rootScope.isLoggedIn = false;
      });

    $scope.register = function() {
      var user = {
        username: $scope.newUser.username,
        email: $scope.newUser.email,
        password: $scope.newUser.password
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
          $scope.error = err.data.error.message;
        });
    };
  }

  userCtrls.controller('UserLoginCtrl', UserLoginCtrl);
  UserLoginCtrl.$inject = ['$rootScope', '$scope', '$state',
                           'User'];
  
  function UserLoginCtrl($rootScope, $scope, $state, User) {
    User.getCurrent()
      .$promise
      .then(function(user) {
        $rootScope.isLoggedIn = true;
        $scope.userId = user.id;
        $state.go('blog');
      }, function() {
        $rootScope.isLoggedIn = false;
      });

    $scope.login = function() {
      User.login({
        email: $scope.user.email,
        password: $scope.user.password
      })
      .$promise
      .then(function() {
        $scope.loginFail = false;
        $state.go('blog');
      }, function(err) {
        $scope.loginFail = true;
      });
    };
  }

  userCtrls.controller('UserLogoutCtrl', UserLogoutCtrl);
  UserLogoutCtrl.$inject = ['$state', 'User'];
  
  function UserLogoutCtrl($state, User) {
    User.logout()
      .$promise
      .then(function() {
        $state.go('blog');
      });
  }
  
})();