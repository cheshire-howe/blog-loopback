(function() {
  'use strict';
  
  var core = angular.module('blogApp.core.config', ['xeditable']);

  /**
   * @ngDoc module
   * @description
   *
   * Sets up css for xeditable angular plugin
   */
  core.run(['editableOptions', function(editableOptions) {
    editableOptions.theme = 'bs3';
  }]);

})();