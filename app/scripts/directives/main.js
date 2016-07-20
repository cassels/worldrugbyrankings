'use strict';

/**
 * @ngdoc directive
 * @name wrWebApp.directive:main
 * @description
 * # main
 */
angular.module('wrWebApp')
  .directive('main', function () {
    return {
      templateUrl: 'views/main.tmpl.html',
      restrict: 'E'
    };
  });
