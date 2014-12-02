(function() {
  'use strict';
  
  angular.module('blogApp.services.utils', [])
    .factory('helpers', helpers);
  
  
  helpers.$inject = ['$rootScope'];
  
  function helpers($rootScope) {
    return {
      
      // every controller needs to know who is logged in
      getCurrentUser: function() {
        // loopback stores userId in localStorage, let's get it
        var userId = localStorage.getItem('$LoopBack$currentUserId') ?
          localStorage.getItem('$LoopBack$currentUserId') : '';
        // use the outcome to set the global isLoggedIn variable
        if(userId) $rootScope.isLoggedIn = true;
        else $rootScope.isLoggedIn = false;

        return userId;
      }
    };
  }
})();