'use strict';

angular.module('nightlifeApp')

.controller('MainCtrl', function ($scope, $http, $rootScope, Auth) {
  $scope.yelp = function(location, term) {
  	if(location !== undefined && term !== undefined) {
	  	url = '/api/yelp?location=' + encodeURI(location) + '&term=' + encodeURI(term);
	  } else {
	  	url = 'api/yelp';
	  }
	  //json for local testing
	  // url='app/data.json';
    $http.get(url).success(function(data) {
			$scope.step = 2;
			//no parse needed for local testing
			$scope.data = JSON.parse(data);
			// $scope.data = data;
    	$scope.businesses = $scope.data.businesses;
    	for(var i=0;i<$scope.businesses.length;i++) {
    		$scope.businesses[i].going = $scope.getAttendance($scope.businesses[i].id);
    	}
    	$rootScope.businesses = $scope.businesses;
    	$rootScope.loadedSearch = true;
    	return $scope.businesses;
    });
  };
  $scope.resetSearch = function() {
  	$rootScope.loadedSearch = false;
  	$scope.step = 1;
  }
  $scope.getAttendance = function(eventId) {
  	var event = $scope.going.filter(function(obj) {
  		return obj.businessId === eventId;
  	});
  	if(event.length > 0) {
  		return event[0].attending;
  	} else {
  		return 0;
  	}
  };
  $scope.setAttendance = function(eventId, newGoing) {
  	var dateString = $scope.getDateString(new Date());
  	var dataId = dateString + eventId;
		var url = 'api/goings/' + dataId;
		var updated = {
	  	_id: dataId,
	  	businessId: eventId,
			attending: newGoing
		};
		$http.patch(url, updated).success(function() {
		}).error(function() {
	  	$http.post('api/goings', updated);
		});
  };
  $scope.attend = function(eventId, going, index) {
  	$scope.addPlans(eventId);
  	going = going += 1;
		$scope.businesses[index].going += 1;
		$scope.setAttendance(eventId, going);
  };
  $scope.cancel = function(eventId, going, index) {
  	$scope.cancelPlans(eventId);
  	going = going -= 1;
		$scope.businesses[index].going -= 1;
		$scope.setAttendance(eventId, going);
  };
  $scope.getPlans = function() {
		$scope.username = Auth.getCurrentUser().name;
  	if($scope.username !== undefined) {
  		var date = new Date();
  		var dateString = $scope.getDateString(date);
  		var planId = $scope.spinalCase(dateString + $scope.username);
  		$http.get('api/plans').success(function(data) {
  			var planObj = data.filter(function(plan) {
  				return plan._id === planId;
  			});
  			if(planObj.length === 0) {
  				$scope.plans = [];
  				var plan = {
  					_id: planId,
  					name: $scope.username,
  					date: dateString,
  					plans: []
  				};
  				$http.post('api/plans', plan);
  			} else {
  				$scope.plans = planObj[0].plans;
  			}
  		});
  	}
  };
  $scope.changePlans = function() {
  	var dateString = $scope.getDateString(new Date());
  	var planId = $scope.spinalCase(dateString + $scope.username);
  	var url = 'api/plans/' + planId;
  	var plan = {
  		_id: planId,
  		name: $scope.username,
  		date: dateString,
  		plans: $scope.plans
  	};
		$http.delete(url).success(function() {
  		$http.post('api/plans', plan).success(function() {
  		});
  	});
  };
  $scope.addPlans = function(eventId) {
  	$scope.plans.push(eventId);
  	$scope.changePlans();
  };
  $scope.cancelPlans = function(eventId) {
  	$scope.plans = $scope.plans.filter(function(event) {
  		return event !== eventId;
  	});
  	$scope.changePlans();
  };
  $scope.open = function(url) {
  	window.open(url);
  };
  $scope.pad = function(string, length) {
  	if(typeof string === 'number') {
  		string = string.toString();
  	}
  	if(string.length < length) {
  		while(string.length < length) {
  			string = '0' + string;
  		}
  		return string;
  	} else {
  		return string;
  	}
  };
  $scope.getDateString = function(date) {
  	var year = date.getFullYear();
  	var month = date.getMonth();
  	var day = date.getDate();
  	return year + $scope.pad(month, 2) + $scope.pad(day, 2);
  };
  $scope.spinalCase = function(str) {
  	return str.replace(/(?!\s|^)+([A-Z])/g, '-$1').toLowerCase().replace(/\s|_/g, '-').replace(/--/g, '-');
  };
 	$scope.username = Auth.getCurrentUser().name;
	$scope.user = Auth.getCurrentUser();
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
  Auth.isLoggedInAsync(function() {	
	  $scope.getPlans();
	});
});
