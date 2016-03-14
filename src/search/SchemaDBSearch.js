'use strict';
//service

// @ngInject

var SchemaDBSearch = function($resource, $http){

  var getValues = function(Inputlink) {
    console.log('making http request');
    console.log(Inputlink);
    return $http.get(Inputlink);
  };

  return {
    getValues: getValues
  };
};


module.exports = SchemaDBSearch;
