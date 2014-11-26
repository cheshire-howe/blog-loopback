/* global confirm */
'use strict';

angular.module('blogDirectives', [])

  .directive('ngReallyClick', [function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('click', function () {
          var message = attrs.ngReallyMessage;
          if (message && confirm(message)) {
            scope.$apply(attrs.ngReallyClick);
          }
        });
      }
    };
  }]);