'use strict';
var BarPlot = function() {
  'ngInject';
  var d3 = require('d3');

  return {
     BarPlot: function (jsonData, y_axis_text, x_axis_text, explanation) {

             var margin = {top: 20, right: 20, bottom: 30, left: 40},
                  width = 960 - margin.left - margin.right,
                  height = 500 - margin.top - margin.bottom;

              var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);

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
    }
  };
};

module.exports = BarPlot;
