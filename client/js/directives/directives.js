/* global confirm */
(function() {
  'use strict';

  angular.module('blogApp.directives', [])

    .directive('compareTo', [function() {
      return {
        require: "ngModel",
        scope: {
          otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

          ngModel.$validators.compareTo = function(modelValue) {
            return modelValue === scope.otherModelValue;
          };

          scope.$watch("otherModelValue", function() {
            ngModel.$validate();
          });
        }
      };
    }])

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
  
})();