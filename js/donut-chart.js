var colorScheme = d3.schemeCategory20;

$('#donutChart').ready(function () {
    var data = [
        {name: "On Pricebook", value: 54.5},
        {name: "Off Pricebook", value: 35.5},
        {name: "Above Pricebook", value: 15.5}
    ];
    var donutText = "54.5%";

    var width = 400;
    var height = 150;
    var thickness = 35;
    var duration = 750;
    var legendItemHeight = 20;

    var radius = Math.min(width, height) / 2.2;
    // ensure the unfilled portion of the donut displays grey
    //var donutChartColors = [colorScheme[0], colorScheme[colorScheme.length - 1], colorScheme[1], colorScheme[2], colorScheme[3], colorScheme[4]];
    var colorScheme = d3.schemeCategory10;
;

    var donutLegendLabels = ["On Pricebook", "Off Pricebook", "Above Pricebook"];

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip tooltip-inner")
        .style("opacity", 0);

    var donutSVG = d3.select("#donut")
        .append('svg')
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height);

    var donutG = donutSVG.append('g')
    .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

    var arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);
    var path = donutG.selectAll('path')
        .data(pie(data))
        .attr('fill', colorScheme[0])
        .enter()
        .append("g")
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => colorScheme[i])
        .on("mouseover", function (d) {
            tooltip.html(d.value + "%")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .each(function(d, i) { this._current = i; });

    // donutG.append('text')
    //     .attr('text-anchor', 'middle')
    //     .attr('font-size', '1.5em')
    //     .attr('dy', '.35em')
    //     .text(donutText);

    var donutLegend = donutG
        .append("g")
        .selectAll(".legend")
        .data(donutLegendLabels)
        .enter();

    donutLegend.append("rect")
        .attr("class", "legend")
        .attr("x", function (d, i) {
            return 100;
        })
        .attr("y", function (d, i) {
            return (i * legendItemHeight) - 25;
        })
        .attr("fill", function (d, i) {
            return colorScheme[i];
        })
        .attr("width", 10)
        .attr("height", 10);

    donutLegend.append("text")
        .attr("class", "label")
        .attr("x", function (d, i) {
            return 115;
          })
        .attr("y", function (d, i) {
            return (i * legendItemHeight) - 15;
        })
        .attr("text-anchor", "start")
        .text(function (d, i) {
            return d;
        });

});
