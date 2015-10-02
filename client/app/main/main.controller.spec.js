'use strict';

describe('Controller: MainCtrl', function () {
  //Karma setup
    // load the controller's module
    beforeEach(module('nightlifeApp'));

    var MainCtrl,
        scope,
        $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/api/things')
        .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

      scope = $rootScope.$new();
      MainCtrl = $controller('MainCtrl', {
        $scope: scope
      });
    }));

    it('should attach a list of things to the scope', function () {
      $httpBackend.flush();
      expect(scope.awesomeThings.length).toBe(4);
    });

  describe('The yelp function', function() {
    it('should return something', function() {
      expect(scope.yelp(5)).toBe(5);
    });
  })

});
