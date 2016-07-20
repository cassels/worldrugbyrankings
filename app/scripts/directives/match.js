'use strict';

/**
 * @ngdoc directive
 * @name wrWebApp.directive:match
 * @description
 * # match
 */
angular.module('wrWebApp')
  .directive('match', function () {
    return {
      templateUrl: 'views/match.tmpl.html',
      restrict: 'E',
    };
  });
