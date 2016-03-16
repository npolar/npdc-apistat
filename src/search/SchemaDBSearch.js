'use strict';
//service

// @ngInject

var SchemaDBSearch = function($resource, $http){

  var getValues = function(Inputlink) {
    return $http.jsonp(Inputlink);
  };

  return {
    getValues: getValues
  };
};


module.exports = SchemaDBSearch;
