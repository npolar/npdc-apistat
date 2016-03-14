'use strict';

var router = function($routeProvider, $locationProvider) {
  'ngInject';

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/:id', {
    templateUrl: 'show/show-apistat.html',
    controller: 'ApistatShowController'
  }).when('/', {
    templateUrl: 'search/search.html',
    controller: 'ApistatSearchController',
    reloadOnSearch: false
  });
};

module.exports = router;
