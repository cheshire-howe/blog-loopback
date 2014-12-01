(function() {
  'use strict';

  angular.module('blogApp', [
    'blogApp.core.config',
    'blogApp.core.routes',
    'blogApp.controllers.postCtrls',
    'blogApp.controllers.userCtrls',
    'blogApp.directives',
    'ui.bootstrap'
  ]);
})();
