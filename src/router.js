'use strict';

var router = function($routeProvider, $locationProvider) {
  'ngInject';

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('show', {
    templateUrl: 'show-apistat.html',
    controller: 'ApistatShowController'
  }).when('/', {
    templateUrl: 'search/search.html',
    controller: 'ApistatSearchController',
    reloadOnSearch: false
  });
};

module.exports = router;
