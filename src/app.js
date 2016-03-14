'use strict';
var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;
var angular = require('angular');


var npdcApistatApp = angular.module('npdcApistatApp', ['npdcCommon']);

npdcApistatApp.controller('ApistatShowController', require('./show/ApistatShowController'));
npdcApistatApp.controller('ApistatSearchController', require('./search/ApistatSearchController'));
npdcApistatApp.factory('SchemaDBSearch', require('./search/SchemaDBSearch'));



// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/', 'resource': 'NpolarApi'},
  {'path': '/user', 'resource': 'User'},
  {'path': '/dataset', 'resource': 'Dataset' },
  {'path': '/apistat', 'resource': 'Apistat' }
];

resources.forEach(service => {
  // Expressive DI syntax is needed here
  npdcApistatApp.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
  return NpolarApiResource.resource(service);
  }]);
});

// Routing
npdcApistatApp.config(require('./router'));

npdcApistatApp.config(($httpProvider, npolarApiConfig) => {
  var autoconfig = new AutoConfig("test");
  angular.extend(npolarApiConfig, autoconfig, { resources });
  console.debug("npolarApiConfig", npolarApiConfig);

  $httpProvider.interceptors.push('npolarApiInterceptor');
});

npdcApistatApp.run(($http, npdcAppConfig, NpolarTranslate, NpolarLang) => {
  NpolarTranslate.loadBundles('npdc-apistats');
  npdcAppConfig.toolbarTitle = 'Apistats';
});
