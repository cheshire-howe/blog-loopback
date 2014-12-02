(function() {
  'use strict';
  
  /**
   * @ngDoc module
   * @description
   *
   * Configuration file
   */
  angular.module('blogApp.core.config', ['xeditable'])
    .run(coreConfig);
  
  
  coreConfig.$inject = ['$rootScope', 'editableOptions', 'helpers'];
  
  function coreConfig($rootScope, editableOptions, helpers) {
    
    // sets xeditable to bootstrap 3 theme
    editableOptions.theme = 'bs3';
    
    // global helpers
    $rootScope.utils = helpers;
  }

})();