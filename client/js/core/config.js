(function() {
  'use strict';
  
  /**
   * @ngDoc module
   * @description
   *
   * Configuration file
   */
  angular.module('blogApp.core.config', ['xeditable'])

  // sets xeditable to bootstrap 3 theme
  .run(['editableOptions', function(editableOptions) {
    editableOptions.theme = 'bs3';
  }]);

})();