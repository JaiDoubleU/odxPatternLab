
//     // Define margins, dimensions, and some line colors
//     var margins = {
//         top: 40,
//         right: 120,
//         bottom: 30,
//         left: 40
//     };

// var width = 800 - margin.left - margin.right;
// var height = 400 - margin.top - margin.bottom;

// // Define the scales and tell D3 how to draw the line
// var x = d3.scaleLinear().domain([1910, 2010]).range([0, width]);
// var y = d3.scaleLinear().domain([0, 40000000]).range([height, 0]);
// var line = d3.line().x(d => x(d.year)).y(d => y(d.population));

// var chart = d3.select('#line-graph').append('g')
//     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// var tooltip = d3.select('#tooltip');
// var tooltipLine = chart.append('line');

// // Add the axes and a title
// var xAxis = d3.axisBottom(x).tickFormat(d3.format('.4'));
// var yAxis = d3.axisLeft(y).tickFormat(d3.format('.2s'));
// chart.append('g').call(yAxis);
// chart.append('g').attr('transform', 'translate(0,' + height + ')').call(xAxis);
// chart.append('text').html('State Population Over Time').attr('x', 200);

// // Load the data and draw a chart
// var states, tipBox;
// d3.json('../../styleguide/data/statePopulationsData.json', d => {
//     states = d;

//     chart.selectAll()
//         .data(states).enter()
//         .append('path')
//         .attr('fill', 'none')
//         .attr('stroke', d => d.color)
//         .attr('stroke-width', 2)
//         .datum(d => d.history)
//         .attr('d', line);

//     chart.selectAll()
//         .data(states).enter()
//         .append('text')
//         .html(d => d.name)
//         .attr('fill', d => d.color)
//         .attr('alignment-baseline', 'middle')
//         .attr('x', width)
//         .attr('dx', '.5em')
//         .attr('y', d => y(d.currentPopulation));

//     tipBox = chart.append('rect')
//         .attr('width', width)
//         .attr('height', height)
//         .attr('opacity', 0)
//         .on('mousemove', drawTooltip)
//         .on('mouseout', removeTooltip);
// })

// function removeTooltip() {
//     if (tooltip) tooltip.style('display', 'none');
//     if (tooltipLine) tooltipLine.attr('stroke', 'none');
// }

// function drawTooltip() {
//     var year = Math.floor((x.invert(d3.mouse(tipBox.node())[0]) + 5) / 10) * 10;

//     states.sort((a, b) => {
//         return b.history.find(h => h.year == year).population - a.history.find(h => h.year == year).population;
//     })

//     tooltipLine.attr('stroke', 'black')
//         .attr('x1', x(year))
//         .attr('x2', x(year))
//         .attr('y1', 0)
//         .attr('y2', height);

//     tooltip.html(year)
//         .style('display', 'inline-block')
//         .style('position', 'absolute')
//         .style('left', d3.event.pageX)
//         .style('top', -1 * d3.event.pageY)
//         .selectAll()
//         .data(states).enter()
//         .append('div')
//         .style('color', d => d.color)
//         .html(d => d.name + ': ' + d.history.find(h => h.year == year).population + ', x - ' + d3.event.pageX);
// }






var createLineChart = function (window, d3) {
        var colorScheme = d3.schemeCategory10;

    var lineChartSvg, data, x, y, xAxis, yAxis, dim, chartWrapper, line, path, margin = {},
    width, height;

    var updateDimensions = function () {
        margin.top = 50;
        margin.right = 100;
        margin.left = 50;
        margin.bottom = 50;

        if(window.innerHeight < 400) {
            height = window.innerHeight - margin.top - margin.bottom;
        } else {
            height = 400 - margin.top - margin.bottom;
        }
        width = (window.innerWidth - 30) - margin.left - margin.right;
    };

    // set dimensions
    updateDimensions();

    lineChartSvg = d3.select("#line-chart");

    var parse = d3.timeParse("%Y-%m");
    var bisectDate = d3.bisector(function (d) {
            return d.date;
        }).left;


    // Scales and axes. Note the inverted domain for the y-scale: bigger is up!
        x = d3.scaleTime().range([0, (width - 5)]),
        y = d3.scaleLinear().range([(height), 0]),
        xAxis = d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%b %Y")),
        yAxis = d3.axisLeft(y)
                .tickArguments(4)
                .tickFormat(d3.format("$.0f"));

    // An area generator, for the light fill.
    var area = d3
        .area()
        .curve(d3.curveMonotoneX)
        .x(function (d) {
            return x(d.date);
        })
        .y0(height)
        .y1(function (d) {
            return y(d.price);
        });

    // A line generator, for the dark stroke.
        line = d3.line()
        .curve(d3.curveMonotoneX)
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.price);
        });

    d3.csv("https://s3-us-west-2.amazonaws.com/s.cdpn.io/317356/line-data.csv",
        function (error, data) {
            // format the data
            data.forEach(function (d) {
                d = type(d);
            });

            // Filter each of the symbols
            var elam = data.filter(function (d) {
                return d.symbol == "ELAM";
            });

            var wbsc = data.filter(function (d) {
                return d.symbol == "WBSC";
            });

            var apex = data.filter(function (d) {
                return d.symbol == "APEX";
            });

            var dwi = data.filter(function (d) {
                return d.symbol == "DWI";
            });

            var trx = data.filter(function (d) {
                return d.symbol == "TRX";
            });

            // Compute the minimum and maximum date, and the maximum price.
            x.domain([apex[0].date, apex[apex.length - 1].date]);
            y.domain([0, d3.max(apex, function (d) {
                return d.price;
            })]).nice();

            // Create the lineChartSvg element with the desired dimensions and margin.
            lineChartSvg = d3.select("svg#line-chart")
                .attr("width", width)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr(
                    "transform",
                    "translate(" + margin.left + "," + margin.top + ")"
                );

            // Add the clip path.
            lineChartSvg.append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            // Add the x-axis.
            lineChartSvg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);


            // Add the y-axis.
            lineChartSvg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(0,0)")
                .call(yAxis);

            var colors = d3.scaleOrdinal(d3.schemeCategory10);

            lineChartSvg.selectAll(".line")
                .data([apex, elam, wbsc, dwi, trx])
                .enter()
                .append("path")
                .attr("class", "line")
                .style("stroke", function (d, i) {
                    return colorScheme[i];
                })
                .attr("clip-path", "url(#clip)")
                .attr("d", function (d) {
                    return line(d);
                });

            // append the legend
            var legend_keys = ["apex", "elam", "wbsc", "dwi", "trx"]

            var lineLegend = lineChartSvg.selectAll(".lineLegend").data(legend_keys)
                .enter().append("g")
                .attr("class", "lineLegend")
                .attr("transform", function (d, i) {
                    return "translate(" + i * 100 + "," + -25 + ")";
                });

            lineLegend.append("text").text(function (d) {
                    return d.toUpperCase();
                })
                .attr("transform", "translate(15,9)"); //align texts with boxes

            lineLegend.append("rect")
                .attr("fill", function (d, i) {
                    return colors(i);
                })
                .attr("width", 10)
                .attr("height", 10);

            /* Add 'curtain' rectangle to hide entire graph */
            var curtain = lineChartSvg
                .append("rect")
                .attr("x", -1 * width)
                .attr("y", -1 * height)
                .attr("height", height)
                .attr("width", width)
                .attr("class", "curtain")
                .attr("transform", "rotate(180)")
                .style("fill", "#ffffff");

            /* Optionally add a guideline */
            var guideline = lineChartSvg
                .append("line")
                .attr("stroke", "#333")
                .attr("stroke-width", 0)
                .attr("class", "guide")
                .attr("x1", 1)
                .attr("y1", 1)
                .attr("x2", 1)
                .attr("y2", height);

            /* Create a shared transition for anything we're animating */
            var t = lineChartSvg
                .transition()
                .delay(500)
                .duration(1000)
                .ease(d3.easeLinear)
                .on("end", function () {
                    d3.select("line.guide")
                        .transition()
                        .style("opacity", 0)
                        .remove();
                });

            t.select("rect.curtain").attr("width", 0);
            t.select("line.guide").attr("transform", "translate(" + width + ", 0)");
        }
    );

    // Parse dates and numbers. We assume values are sorted by date.
    function type(d) {
        var timeParse = d3.timeParse("%Y-%m");
        var parse = d3.timeParse("%Y-%m");
        d.date = parse(d.date);
        d.price = +d.price;
        return d;
    }
    return lineChartSvg;
};

$('#line-chart').ready(function () {
    var lineChartSvg = createLineChart(window, d3);

    window.addEventListener('resize', function () {
        lineChartSvg.selectAll("*").remove();
        lineChartSvg = createLineChart(window, d3)
    });
});
