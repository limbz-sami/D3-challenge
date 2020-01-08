// @TODO: YOUR CODE HERE!
var svgWidth = 810;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 20,
    bottom: 80,
    left: 40
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//create svg wrapper and append svg group
var svg = d3.select("#scatter")
    .append('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body")
.append("div")
.attr("class", "d3-tip")


d3.csv("data/data.csv").then(function (AcsData) {

    //cast data as numbers
    AcsData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //scale functions
    var xScale = d3.scaleLinear()
        .domain([8, (d3.max(AcsData, d => d.poverty)+2)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([3, (d3.max(AcsData, d => d.healthcare)+2)])
        .range([height, 0]);

    //axis functions
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(AcsData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "10")
        .attr("class", "stateCircle")

    circlesGroup.append("text")
    

    //Tooltip initialization
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return(`${d.state}<br>Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}%`);
      });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this)
    })

        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    chartGroup.append("text")
    .attr("class", "stateText")
    .selectAll("tspan")
    .data(AcsData)
    .enter()
    .append('tspan')
    .attr("x", function(data){
        return xScale(data.poverty)
    })
    .attr("y", function(data){
        return yScale(data.healthcare -0.2)
    })
    .text(function(data){
        return data.abbr
    });


    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 4)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("In Poverty (%)");

}).catch(function (error) {
    console.log(error);
});
