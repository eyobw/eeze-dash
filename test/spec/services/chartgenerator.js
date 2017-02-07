'use strict';

describe('Service: chartGenerator', function () {

  // load the service's module
  beforeEach(module('eezeDashApp'));

  // instantiate service
  var chartGenerator;
  beforeEach(inject(function (_chartGenerator_) {
    chartGenerator = _chartGenerator_;
  }));

  it('should do something', function () {
    expect(!!chartGenerator).toBe(true);
  });

});
