'use strict';

var ApistatSearchController = function($scope, $controller, Dataset, npdcAppConfig, SchemaDBSearch) {
  'ngInject';
  var d3 = require('d3');
  //Initalize visualisation choice
  $scope.keysV = ['bar plot', 'pie chart'];

  $controller('NpolarBaseController', {
    $scope: $scope
  });
  $scope.resource = Dataset;

  //var base = 'https://apptest.data.npolar.no:3000';
  var base = 'https://api.npolar.no';

  //Initialize parameter array
  $scope.keys = [];


     var link = base + '/service/_ids.json?callback=JSON_CALLBACK';
     SchemaDBSearch.getValues(link).then(
       function(results) {
        // on success

         $scope.keysS = (results.data.ids).map(function(el) {
                  return el.replace('-api','');
         });
        });


     //Get schema
    $scope.submit = function() {
      //Reset error msg
      $scope.apistat_err = null;
      //Reset select menu variables
      $scope.keys = [];
      //Remove these variables from list
      var remove_arr = ["id", "rev", "collection", "schema", "created", "updated", "_id", "_rev", "_deleted"];

       var schema = $scope.schema2;


       //Fetch input variables one by one
       schema.map( function(schema) {


         //First get the schema name from api_service
         var link = base +'/service/'+schema+'-api.json?callback=JSON_CALLBACK';

         SchemaDBSearch.getValues(link).then( function(results) {
           var new_schema = results.data.accepts["application/json"];

           //If new schema link contains .json in the end it must be removed
           var new_schema2 = new_schema.replace(".json","");

           //Get schema from input
           var link2 = new_schema2 +'?callback=JSON_CALLBACK&format=json';


           SchemaDBSearch.getValues(link2)
             //on success
             .then( function(results) {
              //on success

               var keys2 = Object.keys(results.data.properties);



               (keys2).map(function(el) {
                        if (remove_arr.indexOf(el) < 0) {
                         console.log(el);
                         ($scope.keys).push(schema + ' - ' + el);
                       }
               });

             }) //on failure
             .catch(function(fallback){
               $scope.apistat_err = "Could not find the variables.";

             });

       });
      });
    };

       //Choose parameters and visualisation
       $scope.submit_vars = function(){

          //Fetch scope vars -var 0 only
          //Need to strip off database name first
          //Vars2 is the variable
          console.log($scope.vars[0]);

          var vars2 = ($scope.vars[0]).split(" - ");
          //var varsV = $scope.varsV;



          var link = base + '/' + $scope.schema2 + '/?q=&fields=' + vars2[1] + '&limit=5000&callback=JSON_CALLBACK';

          SchemaDBSearch.getValues(link).then( function(results) {
              var prop = vars2[1];
              var data2 = [];

              var res = results.data.feed.entries;
              console.log(res);

               //data2 holds the array with all values of the variable
              for (var i=0; i<res.length; i++) {
                  //Push the variable onto an array
                  data2.push(res[i][prop]);
              }


              //Count values in array..accumulate values
              var u = {}, a = [];
              for(var j = 0, l = data2.length; j < l; ++j){
                    if(u.hasOwnProperty(data2[j])) {
                       u[data2[j]]++;
                       continue;
                    }
                    a.push(data2[j]);
                    u[data2[j]] = 1;
              }

              //Get values
              var values = [];
              for(var key in u) {
                  values.push(u[key]);
              }

              //Find maximum value, get height of bar plot (scale)
             // var arrayMax = Function.prototype.apply.bind(Math.max, null);
             //var maximum = arrayMax(values);
             // var scale = 1000/maximum;

              //data now holds the number of (all) possible outcomes from data2
              var outcomes = a;

              //Reset DOM from div tag in case you want another variable
              var node = document.getElementById("chart");
              if (node && node.hasChildNodes()) {
                  node.innerHTML = '';
              }

              console.log("utfallsrom");
              console.log(outcomes);
              console.log(values);

              //Create a json doc from the variables, values are counts,
              //outcomes are possible values
              var jsonData = [];

              //If undefined is a value, it must be set as a string
              var undef = outcomes.indexOf(undefined);
              outcomes[undef] = 'undefined';

              for (var k = 0; k < values.length; k++) {
                    var jsonObj = {};
                   jsonObj.outcome =  outcomes[k];
                   jsonObj.count = values[k];
                   jsonData.push(jsonObj);
              }

              console.log("jsonObj and jsonData");
              console.log(jsonData);
              //Get json object
              //var jsonData = JSON.stringify(jsonObj);


              //Choose type of visualisation
              switch($scope.varsV[0]) {
                case "pie chart": {
                      //  create_pie_chart(outcomes, jsonData, $scope.explanation);
                      create_pie_chart(jsonData, $scope.explanation);
                        break;
               } case "bar plot": {
                        create_bar_plot(jsonData, $scope.name_y_axis, $scope.name_x_axis, $scope.explanation);
                        break;
               } default: {
                        create_bar_plot(jsonData, $scope.name_y_axis, $scope.name_x_axis, $scope.explanation);
                      }
              }

          }); //vars_res

       }; //submit_vars

       function create_pie_chart(jsonData, explanation) {

                var width = 960,
                height = 500,
                radius = Math.min(width, height) / 2;

            //The number of colors to display with the pie chart
            var color = d3.scale.ordinal()
                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00",
                  "#96abc5", "#8589a6", "#756888", "#63486b", "#a75d56", "#d8743c", "#f58c00"]);


            var arc = d3.svg.arc()
                .outerRadius(radius - 10)
                .innerRadius(0);

            var labelArc = d3.svg.arc()
                .outerRadius(radius - 40)
                .innerRadius(radius - 40);


            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d.count; });

            var svg = d3.select(".chart").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

              var g = svg.selectAll(".arc")
                  .data(pie(jsonData))
                .enter().append("g")
                  .attr("class", "arc");

              g.append("path")
                  .attr("d", arc)
                  .style("fill", function(d) { return color(d.data.outcome); });

              g.append("text")
                  .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
                  .attr("dy", ".35em")
                  .text(function(d) { return d.data.outcome; });
          //  });

       /*     function type(d) {
              d.count = +d.count;
              return d;
            } */
        }

        //Create bar plot
       function create_bar_plot(jsonData, y_axis_text, x_axis_text, explanation) {

             console.log('create_bar_plot');

             var margin = {top: 20, right: 20, bottom: 30, left: 40},
                  width = 960 - margin.left - margin.right,
                  height = 500 - margin.top - margin.bottom;

              var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

              var y = d3.scale.linear()
                  .range([height, 0]);

              var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom");

              var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  .ticks(10, "%");

              var svg = d3.select(".chart").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                console.log("domains:");
                console.log(jsonData);

                x.domain(jsonData.map(function(d) { console.log(d.outcome); return d.outcome; }));
                y.domain([0, d3.max(jsonData, function(d) { console.log(d.count); return d.count; })]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                  .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(y_axis_text);

                svg.selectAll(".bar")
                    .data(jsonData)
                  .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.outcome); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.count); })
                    .attr("height", function(d) { return height - y(d.count); });


        /*      function type(d) {
                d.count = +d.countr;
                return d;
              } */

       }


};

module.exports = ApistatSearchController;
