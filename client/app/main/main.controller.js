'use strict';

angular.module('nightlifeApp')

.controller('MainCtrl', function ($scope, $http, $rootScope, Auth) {
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
  $scope.yelp = function(location, term) {
  	if(location !== undefined && term !== undefined) {
	  	url = '/api/yelp?location=' + location + '&term=' + term;
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
  $scope.getAttendance = function(eventId) {
  	var event = $scope.going.filter(function(obj) {
  		return obj._id === eventId;
  	});
  	if(event.length > 0) {
  		return event[0].attending;
  	} else {
  		return 0;
  	}
  };
  $scope.attend = function(eventId, going, index) {
  	$scope.addPlans(eventId);
		var url = 'api/goings/' + eventId;
		var updated = {
			_id: eventId,
			attending: going += 1
		};
		$scope.businesses[index].going += 1;
		$http.patch(url, updated).success(function(data) {
		}).error(function(message) {
	  	$http.post('api/goings', {
	  		_id: eventId,
	  		attending: 1
	  	});
  		$scope.businesses[index].going = 1;
		});
  };
  $scope.cancel = function(eventId, going, index) {
  	$scope.cancelPlans(eventId);
  	var url = 'api/goings/' + eventId;
		var updated = {
			_id: eventId,
			attending: going -= 1
		};
		$scope.businesses[index].going -= 1;
		$http.patch(url, updated).success(function(data) {
			console.log(data);
		});
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
  $scope.changePlans = function(eventId, newPlans) {
  	var dateString = $scope.getDateString(new Date());
  	var planId = $scope.spinalCase(dateString + $scope.username);
  	var url = 'api/plans/' + planId;
  	var plan = {
  		_id: planId,
  		name: $scope.username,
  		date: dateString,
  		plans: $scope.plans
  	};
		$http.delete(url).success(function(delMess) {
  		$http.post('api/plans', plan).success(function(postMess) {
  		});
  	});
  }
  $scope.addPlans = function(eventId) {
  	$scope.plans.push(eventId);
  	$scope.changePlans(eventId, $scope.plans);
  };
  $scope.cancelPlans = function(eventId) {
  	$scope.plans = $scope.plans.filter(function(event) {
  		return event !== eventId;
  	});
  	$scope.changePlans(eventId, $scope.plans);
  };
  $scope.getPlans = function() {
		$scope.username = Auth.getCurrentUser().name;
  	console.log('username: ', $scope.username);
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
  			console.log($scope.plans);
  		});
  	}
  };
  $scope.spinalCase = function(str) {
  	return str.replace(/(?!\s|^)+([A-Z])/g, '-$1').toLowerCase().replace(/\s|_/g, '-').replace(/--/g, '-');
  };
  $scope.getPlans();
  $rootScope.$on('$routeChangeStart', function() {
  	setTimeout(function() {
	  	$scope.getPlans();
  	}, 1000);
  });
});
