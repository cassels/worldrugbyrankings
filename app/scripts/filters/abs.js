'use strict';

/**
 * @ngdoc filter
 * @name wrWebApp.filter:abs
 * @function
 * @description
 * # abs
 * Filter in the wrWebApp.
 */
angular.module('wrWebApp')
  .filter('abs', function () {
    return function (input) {
      return Math.abs(input);
    };
  });
