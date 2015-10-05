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


  describe('The pad function', function() {
    it('Should return a string', function() {
      expect(typeof scope.pad('3', 1)).toBe('string')
    });
    it('should work properly if a number is entered instead of a string', function() {
      expect(scope.pad(8, 5)).toBe('00008')
    });
    it('Should return a one letter string unchanged when length is 1', function() {
      expect(scope.pad('3', 1)).toBe('3');
    });
    it('Should pad a one letter string to a two letter string when length is 2', function() {
      expect(scope.pad('5', 2)).toBe('05');
    });
    it('Should pad a one letter string to a three letter string when length is 3', function() {
      expect(scope.pad('7', 3)).toBe('007');
    });
  });
  describe('The getDateString function', function() {
    it('Should return a date formatted YYYYMMDD given a date object', function() {
      expect(scope.getDateString(new Date('July 7, 1990'))).toBe('19900607');
    });
  });
  describe('The spinalCase function', function() {
    it('Should replace spaces with dashes', function() {
      expect(scope.spinalCase("Hello World")).toBe("hello-world")
    });
  });
});
