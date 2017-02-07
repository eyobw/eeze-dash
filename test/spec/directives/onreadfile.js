'use strict';

describe('Directive: onReadFile', function () {

  // load the directive's module
  beforeEach(module('eezeDashApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<on-read-file></on-read-file>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the onReadFile directive');
  }));
});
