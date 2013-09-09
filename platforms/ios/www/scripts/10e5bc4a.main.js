var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, true);
    },

    onDeviceReady: function() {
        angular.element(document).ready(function() {
            angular.bootstrap(document);
        });
    },
};
var QH = angular.module('quehambre', ['ajoslin.mobile-navigate']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/search', {
        templateUrl: 'partials/search.html',
        controller: SearchCtrl
      }).
      when('/search/:addressId', {
        templateUrl: 'partials/spots-list.html',
        controller: SpotsListCtrl
      }).
      when('/spots/:id', {
        templateUrl: 'partials/spot.html',
        controller: SpotCtrl
      }).
      otherwise({
        redirectTo: '/search'
      });
}]);

QH.factory('Spots', function($http) {
  var struct = {
    results: [],
    current: {}
  };

  $http.get('http://www.quehambre.cl/api2/data/search', { params: {
    lat: -33397968,
    lon: -70581037,
    coupons: false,
    count: 40
  }})
    .success(function(data) {
      _.each(data.data.page, function(p) {
        struct.results.push(p);
      });
    });

  return struct;
});

function SearchCtrl($scope, $navigate) {
  $scope.search = function() {
    $navigate.go('/search/5');
  };
};

function SpotsListCtrl($scope, Spots, $navigate) {
  $scope.spots = Spots.results;

  $scope.selectSpot = function(spot) {
    Spots.current = spot;
    $navigate.go("/spots/" + spot.id);
  };
};

function SpotCtrl($scope, $http, Spots) {
  $scope.spot = Spots.current;

  $http.get('http://www.quehambre.cl/api2/data/menu/' + $scope.spot.menu_uri)
    .success(function(data) {
      $scope.menu = data.data;
    });
}
