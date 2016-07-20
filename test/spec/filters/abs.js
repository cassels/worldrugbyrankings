'use strict';

describe('Filter: abs', function () {

  // load the filter's module
  beforeEach(module('wrWebApp'));

  // initialize a new instance of the filter before each test
  var abs;
  beforeEach(inject(function ($filter) {
    abs = $filter('abs');
  }));

  it('should return the input prefixed with "abs filter:"', function () {
    var text = 'angularjs';
    expect(abs(text)).toBe('abs filter: ' + text);
  });

});
