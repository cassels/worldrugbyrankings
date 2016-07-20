'use strict';

/**
 * @ngdoc directive
 * @name wrWebApp.directive:outcome
 * @description
 * # outcome
 */
angular.module('wrWebApp')
  .directive('outcome', function () {
    return {
			restrict: 'E',
			templateUrl: 'views/outcome.tmpl.html'
		};
  });
