var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
  .range([0, width]);

x.ticks(d3.time.hours, 1);
x.tickFormat('%I %p');

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(20)

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("svg#hourly_volume")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv('/data/volume_by_hour.tsv', function(error, data) {

  var now = new Date();
  var offset = (now.getTimezoneOffset() * 60000);
  var dates = data.map(function(d) { return new Date(parseInt(d.hour) * 1000.0 - offset); })
  console.log(dates);

  x.domain([d3.min(dates), d3.max(dates)]);
  y.domain([0, d3.max(data, function(d) { return d.count; })]);

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
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(new Date(parseInt(d.hour) * 1000.0 - offset)); })
      .attr("width", '2')
      .attr("y", function(d) { return y(d.count); })
      .attr("height", function(d) { return height - y(d.count); });

});
