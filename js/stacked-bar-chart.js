
var initStackedBarChart = {
    draw: function (config) {
        var parentWidth = $('#horizontal-stacked-bar ').parent().width();
        var parentHeight = $('#horizontal-stacked-bar ').parent().height();
        if (parentHeight < 300) {
            parentHeight = 300;
        }

        (me = this),
            (domEle = config.element),
            (stackKey = config.key),
            (data = config.data),
            colors = ["#9ecae1", "#fdae6b", "#a1d99b"];
            margin = {
                top: 50,
                right: 35,
                bottom: 65,
                left: 35
            },
            tooltip = d3.select("body").append("div").attr("class", "tooltip tooltip-inner").style("opacity", 0),
            parseDate = d3.timeParse("%m %Y"),
            formatTime = d3.timeFormat("%b %Y"),

            width = parentWidth - margin.left - margin.right,
            height = parentHeight - margin.top - margin.bottom,
            xScale = d3.scaleLinear().rangeRound([0, width]),
            yScale = d3.scaleBand().rangeRound([height, 0]).padding(0.4),
            xAxis = d3.axisBottom(xScale),
            yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%b")),
            stackedBarSVG = d3.select("#" + domEle).append("svg")
                .attr('id', 'stackedBarChart')
                .attr("width", width)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            legspacing = 15,
            labels = ["AvgDaysToSubmit", "AvgDaysToCodeVerify", "AvgDaysToApprove"];
            var legend = stackedBarSVG
                .append("g")
                .selectAll(".legend")
                .data(labels)
                .enter();

            legend
                .append("rect")
                .attr("class", "legend")
                .attr("x", function(d, i) {
                    return i * 150;
                })
                .attr("y", function(d, i) {
                    return -28;
                })
                .attr("fill", function(d, i) {
                    return colors[i];
                })
                .attr("width", 10)
                .attr("height", 10);

            legend
                .append("text")
                .attr("class", "label")
                .attr("x", function(d, i) {
                    return i * 150 + legspacing;
                })
                .attr("y", function(d, i) {
                    return -20;
                })
                .attr("text-anchor", "start")
                .text(function(d, i) {
                    if (labels[i] == "AvgDaysToApprove") {
                        return "Days to Approve";
                    } else if (labels[i] == "AvgDaysToSubmit") {
                        return "Days to Submit";
                    } else {
                        return "Days to Code Verify";
                    }
                    return "";
                });

        var stack = d3.stack()
            .keys(stackKey)
            .order(d3.stackOrder)
            .offset(d3.stackOffsetNone);

        var layers = stack(data);
        data.sort(function (a, b) {
            return b.amount - a.amount;
        });
        yScale.domain(data.map(function (d) {
            return parseDate(d.date);
        }));
        xScale.domain([0, d3.max(layers[layers.length - 1], function (d) {
            return d[0] + d[1] - 40;
        })]).nice();

        var layer = stackedBarSVG.selectAll(".layer")
            .data(layers)
            .enter().append("g")
            .attr("class", "layer")
            .style("fill", function (d, i) {
                return colors[i];
            });

        layer.selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("y", function (d) {
                return yScale(parseDate(d.data.date));
            })
            .attr("x", function (d) {
                return xScale(d[0]);
            })
            .attr("height", yScale.bandwidth())
            .attr("width", function (d) {
                return xScale(d[1]) - xScale(d[0])
            })
            .on("click", function (d) {
                tooltip.html("<div class='text-left'><strong>" + formatTime(parseDate(d.data.date)) + " Averages:</strong></div>" + "<div class='text-left'>Service Date to Submit: " + d.data.AvgDaysToSubmit + " days</div><div class='text-left'>Submit to Code Verify: " + d.data.AvgDaysToCodeVerify + " days</div><div  class='text-left'>Code Verify to Aprove " + d.data.AvgDaysToApprove + " days</div>")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                tooltip.transition()
                    .duration(50)
                    .style("opacity", 1.0);
            })
            .on("mouseover", function (d) {
                d3.select(this).style("cursor", "pointer");
                tooltip.html("<div class='text-left'><strong>" + formatTime(parseDate(d.data.date)) + " Averages:</strong></div>" + "<div class='text-left'>Service Date to Submit: " + d.data.AvgDaysToSubmit + " days</div><div class='text-left'>Submit to Code Verify: " + d.data.AvgDaysToCodeVerify + " days</div><div  class='text-left'>Code Verify to Aprove " + d.data.AvgDaysToApprove + " days</div>")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                tooltip.transition()
                    .duration(50)
                    .style("opacity", 1.0);
            })
            .on("mouseout", function (d) {
                d3.select(this).style("cursor", "default");
                tooltip.transition()
                    .duration(50)
                    .style("opacity", 0);
            });

        stackedBarSVG.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        stackedBarSVG.append("g")
            .append("text")
            .attr("class", "axis axis--x small")
            .attr("transform", "translate(0," + height + ")")
            .attr("y", 9)
            .attr("dy", "1.91em")
            .attr("dx", "50%")
            .style("text-anchor", "end")
            .text("Time (in days)");

        stackedBarSVG.append("g")
            .append("text")
            .attr("class", "axis axis--x small")
            .attr("transform", "translate(0," + height + ")")
            .attr("y", 9)
            .attr("dy", "4em")
            .attr("dx", "30%")
            .style("text-anchor", "end")
            .text(" Avg Days to Verify: 8.2");

        stackedBarSVG.append("g")
            .append("text")
            .attr("class", "axis axis--x small")
            .attr("transform", "translate(0," + height + ")")
            .attr("y", 9)
            .attr("dy", "4em")
            .attr("dx", "75%")
            .style("text-anchor", "end")
            .text(" Avg Days to Approve: 8.7");

        stackedBarSVG.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(0,0)")
            .call(yAxis);

        stackedBarSVG.append("g")
            .append("text")
            .selectAll(".legend")
            .data(labels)
            .enter();
    }
}

function getDate(offset) {
    var theDate = moment().subtract(offset, "months").format("MM YYYY");
    return  theDate;
}

var data = [
    {
        date: getDate(7),
        total: 40,
        AvgDaysToSubmit: 28,
        AvgDaysToCodeVerify: 4,
        AvgDaysToApprove: 8
    },
    {
        date: getDate(6),
        total: 45,
        AvgDaysToSubmit: 26,
        AvgDaysToCodeVerify: 7,
        AvgDaysToApprove: 12
    },
    {
        date: getDate(5),
        total: 46,
        AvgDaysToSubmit: 29,
        AvgDaysToCodeVerify: 9,
        AvgDaysToApprove: 8
    },
    {
        date: getDate(4),
        total: 38,
        AvgDaysToSubmit: 20,
        AvgDaysToCodeVerify: 9,
        AvgDaysToApprove: 9
    },
    {
        date: getDate(3),
        total: 42,
        AvgDaysToSubmit: 26,
        AvgDaysToCodeVerify: 12,
        AvgDaysToApprove: 4
    },
    {
        date: getDate(2),
        total: 48,
        AvgDaysToSubmit: 27,
        AvgDaysToCodeVerify: 9,
        AvgDaysToApprove: 10
    },
    {
        date: getDate(1),
        total: 38,
        AvgDaysToSubmit: 20,
        AvgDaysToCodeVerify: 8,
        AvgDaysToApprove: 10
    }
];
var key = ["AvgDaysToSubmit", "AvgDaysToCodeVerify", "AvgDaysToApprove"];

initStackedBarChart.draw({
    data: data,
    key: key,
    element: 'horizontal-stacked-bar'
});
