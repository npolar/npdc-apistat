'use strict';
var PieChart = function() {
  'ngInject';
  var d3 = require('d3');

  return {
     PieChart: function (jsonData, explanation) {
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
    }
  };
};

module.exports = PieChart;
