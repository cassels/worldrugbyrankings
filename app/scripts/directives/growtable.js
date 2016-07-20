/* global $: false */
'use strict';

/**
 * @ngdoc directive
 * @name wrWebApp.directive:rankings
 * @description
 * # rankings
 */
angular.module('wrWebApp')
  .directive('growtable', [function () {
    return {
			restrict: 'E',
      transclude: true,
			templateUrl: 'views/growtable.tmpl.html',
      link: function(scope, element) {
        var isCollapsed = true;
        var tableWrap = $(element).find('.tableWrap');
        scope.text = 'see more';
        scope.toggle = function() {
          var height = tableWrap.find('table').height();
          if (!isCollapsed) {
            height = (tableWrap.find('table > tbody tr').height() * 15) + tableWrap.find('table > thead').height();
          }
          tableWrap.height(height);
          isCollapsed = !isCollapsed;
          this.text = ((isCollapsed) ? 'see more' : 'see less');
        };
      }
		};
  }]);
