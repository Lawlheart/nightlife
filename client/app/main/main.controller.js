'use strict';

angular.module('nightlifeApp')

.controller('MainCtrl', function ($scope, $http, $rootScope, Auth) {
	$scope.username = Auth.getCurrentUser().name;
	$scope.user = Auth.getCurrentUser();
	console.log($scope.username, $scope.user)
	$scope.isLoggedIn = Auth.isLoggedIn;
	var url;
	$scope.step = 1;
	$http.get('api/goings').success(function(data) {
		$scope.going = data;
	});
	if($rootScope.loadedSearch) {
		$scope.businesses = $rootScope.businesses;
		$scope.step = 2;
	}
	console.log($scope.user)
  $scope.yelp = function(location, term) {
  	if(location !== undefined && term !== undefined) {
	  	url = '/api/yelp?location=' + location + '&term=' + term;
	  } else {
	  	url = 'api/yelp';
	  }
	  console.log(url);
	  url='app/data.json';
    $http.get(url).success(function(data) {
			$scope.step = 2;
			// $scope.data = JSON.parse(data);
			$scope.data = data;
			console.log(data, typeof data, typeof $scope.data);
    	$scope.businesses = $scope.data.businesses;
    	for(var i=0;i<$scope.businesses.length;i++) {
    		$scope.businesses[i].going = $scope.getAttendance($scope.businesses[i].id);
    	}
    	$rootScope.businesses = $scope.businesses;
    	$rootScope.loadedSearch = true;
    	return $scope.businesses;
    });
  };
  $scope.getAttendance = function(event_id) {
  	var event = $scope.going.filter(function(obj, index) {
  		return obj._id === event_id;
  	});
  	if(event.length > 0) {
  		return event[0].attending
  	} else {
  		return 0
  	}
  }
  $scope.attend = function(event_id, going, index) {
  	$scope.businesses[index].attending = true;
		var url = 'api/goings/' + event_id;
		var updated = {
			_id: event_id,
			attending: going += 1
		}
		console.log(updated)
		$scope.businesses[index].going += 1;
		$http.patch(url, updated).success(function(data) {
			console.log(data);
		}).error(function(message) {
			console.log(message)
	  	$http.post('api/goings', {
	  		_id: event_id,
	  		attending: 1
	  	});
  	$scope.businesses[index].going = 1;
		})

  }
  $scope.cancel = function(event_id, going, index) {
  	$scope.businesses[index].attending = false;
  	var url = 'api/goings/' + event_id;
		var updated = {
			_id: event_id,
			attending: going -= 1
		}
		$scope.businesses[index].going -= 1;
		$http.patch(url, updated).success(function(data) {
			console.log(data);
		});
  }
});
