'use strict';

describe('Directive: outcome', function () {

  // load the directive's module
  beforeEach(module('wrWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<outcome></outcome>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the outcome directive');
  }));
});
