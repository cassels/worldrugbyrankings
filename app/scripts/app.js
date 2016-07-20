'use strict';

/**
 * @ngdoc overview
 * @name wrWebApp
 * @description
 * # wrWebApp
 *
 * Main module of the application.
 */
angular
  .module('wrWebApp', [
    'ngAnimate',
    'ngAria',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngTagsInput',
    'angular.filter',
    'ui.bootstrap'
  ])
  .filter('startFrom', function() {
		return function(input, start) {
			if (input) {
				start = +start; //parse to int
				return input.slice(start);
			}
			return input;
		};
	})
  .filter('ceil', function() {
		return function(input) {
			return Math.ceil(input) || 0;
		};
	})
  .filter('pointDiff', function($filter) {
		return function(input, fraction) {
			var output = $filter('number')(input, fraction);
			if (output > 0){
				return '+' + output;
			}
      return output;
		};
	});
