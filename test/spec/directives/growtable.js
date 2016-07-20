'use strict';

describe('Directive: rankings', function () {

  // load the directive's module
  beforeEach(module('wrWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<rankings></rankings>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the rankings directive');
  }));
});
