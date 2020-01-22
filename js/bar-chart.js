$('#barChart').ready(function () {
    var barChartSvg = d3.select("#barChart").append("svg");

    var defaultHeight = 150;
    var defaultWidth = 400;

    var margin = {
        top: 10,
        right: 0,
        bottom: 20,
        left: 40
    };

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var now = new Date();
    var last = new Date();
    last.setMonth(last.getMonth() - 1);
    var prior = new Date();
    prior.setMonth(prior.getMonth() - 2);

    var thisMonth = months[now.getMonth()]; // getMonth method returns the month of the date (0-January :: 11-December)
    var thisYear = now.getFullYear();
    var lastMonth = months[now.getMonth() - 1];
    var lastYear = last.getFullYear();

    var priorMonth = months[now.getMonth() - 2];
    var priorYear = prior.getFullYear();
    var total = 'Total';
    var transition = d3.transition().duration(1000).ease(d3.easeExp);
    var width = defaultWidth - margin.left - margin.right;
    var height = defaultHeight - margin.top - margin.bottom;
    var g = barChartSvg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
    var x1 = d3.scaleBand().padding(0.05);
    var y = d3.scaleLinear().rangeRound([height, 0]);
    var colors = d3.schemeCategory10;

    var colorMap = new Map();
    colorMap.set("This Month", colors[0]); //"#3182bd");
    colorMap.set("Last Month", colors[1]); //"#6baed6");
    colorMap.set("Prior Month", colors[2]); //"#6baed6");

    // Define a div for the tooltip
   var tooltip = d3.select("body").append("div")
       .attr("class", "tooltip tooltip-inner")
       .style("opacity", 0);

    d3.csv("../../styleguide/data/barChartData.csv", function (d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
        return d;
    }, function (error, data) {
        if (error) throw error;

        var keys = data.columns.slice(1);
        // var keys = [previousMonth,lastMonth, thisMonth];

        x0.domain(data.map(function (d) {
            return d.State;
        }));
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, function (d) {
            return d3.max(keys, function (key) {
                return d[key];
            });
        })]).nice();



         var xAxis = g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0).ticks(null, "s"));

        var leftLabel = g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()))
            .attr("dy", "-3em")
            .attr("dx", "-10em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .attr("transform", "rotate(270)")
            .text("Days to Process");

        var yAxis = g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("class", "barContainer")
                // .attr("y", function (d) { return 0; }) //y(d.value)
                .attr("transform", function (d) { return "translate(" + x0(d.State) + ",0)"; })
                .selectAll("rect")
                .data(function (d) {
                    return keys.map(function (key) {
                        return {
                            key: key,
                            value: d[key]
                        };
                    });
                }).enter()
                    .append("rect")
                    .attr("class", "bar")
                    .on("mouseover", function (d) {
                            var translatedKey;
                            var translatedYear;
                            if (d.key == 'Prior Month') {
                                translatedKey = priorMonth;
                                translatedYear = priorYear;
                            } else if (d.key == 'Last Month') {
                                translatedKey = lastMonth;
                                translatedYear = lastYear;
                            } else {
                                translatedKey = thisMonth;
                                translatedYear = thisYear;
                            }
                            tooltip.html("<strong>" + translatedKey + " " + translatedYear + "</strong>: " + d.value + " Days")
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
                    .attr("x", function (d) { return x1(d.key); })
                    .attr("y", function (d) { return height; })
                    .attr("height", 0).transition(transition)
                        .attr("y", function (d) {
                            return y(d.value);
                        })
                        .attr("height", function (d) {
                            return height - y(d.value);
                        })
                    .attr("width", x1.bandwidth())
                    .attr("fill", function (d) { return colorMap.get(d.key); });



            // var bars = svg.selectAll(".bar")
            //     .data(data)
            //    .transition(transition)
            //        .attr("height", function (d) {
            //            return height - y(d.value);
            //        });
    });
});
