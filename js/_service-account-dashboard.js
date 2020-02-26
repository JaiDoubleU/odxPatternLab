// // Based on reusable chart pattern from https://bost.ocks.org/mike/chart/
// var expenditureGaugeWidth = 200;
// var expenditureGaugeHeight = 140;
//     function expenditureGaugeChart() {
//         margin = {
//                 top: 15,
//                 right: 20,
//                 bottom: 5,
//                 left: 20
//             },
//             width = expenditureGaugeWidth,
//             height = expenditureGaugeHeight,
//             arcMin = -Math.PI / 2,
//             arcMax = Math.PI / 2,
//             innerRadius = 60,
//             outerRadius = 80,
//             dataDomain = [0, 50, 100],
//             labelPad = 10,
//             dataValue = function (d) {
//                 return +d;
//             },
//             colorScale = d3.scaleOrdinal(),
//             arcScale = d3.scaleOrdinal(),
//             colorOptions = d3.schemeCategory20c,
//             arc = d3.arc();

//         function chart(selection) {
//             selection.each(function (data) {
//                 // Convert data to standard representation greedily;
//                 // this is needed for nondeterministic accessors.
//                 data = data.map(function (d, i) {
//                     return dataValue(d);
//                 });
//                 arcScale = d3.scaleLinear().domain(dataDomain).range([arcMin, 0, arcMax]);
//                 colorScale = d3.scaleLinear().domain(dataDomain).range(colorOptions);
//                 arc = d3.arc().innerRadius(innerRadius)
//                     .outerRadius(outerRadius)
//                     .startAngle(arcMin);

//                 // Select the svg element, if it exists.
//                 var svg = d3.select(this).selectAll("svg").data([data]);

//                 // Otherwise, create the skeletal chart.
//                 var gEnter = svg.enter().append("svg").append("g");
//                 var arcGEnter = gEnter.append("g").attr("class", "arc");
//                 arcGEnter.append("path").attr("class", "bg-arc");
//                 arcGEnter.append("path").attr("class", "data-arc")
//                     .datum({
//                         endAngle: arcMin,
//                         startAngle: arcMin,
//                         score: dataDomain[0]
//                     })
//                     .attr("d", arc)
//                     .style("fill", colorScale(dataDomain[0]))
//                     .each(function (d) {
//                         this._current = d;
//                     });
//                 arcGEnter.append("text").attr("class", "arc-label");

//                 // Optional show lines dividing the arc into sections
//                 // arcGEnter.selectAll(".lines").data(arcScale.ticks(5).map(function (d) {
//                 //         return {
//                 //             score: d
//                 //         };
//                 //     })).enter()
//                 //     .append("path")
//                 //     .attr("class", "lines");

//                 // Optional show numeric values
//                 //arcGEnter.selectAll(".ticks").data(arcScale.ticks(10))
//                 //    .enter().append("text")
//                 //    .attr("class", "ticks");

//                 // Update the outer dimensions.
//                 var svg = selection.select("svg");
//                 svg.attr("width", width).attr("height", height);
//                 // Update the inner dimensions.
//                 var g = svg.select("g")
//                     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//                 var arcG = svg.select("g.arc")
//                     .attr("transform", "translate(" +
//                         ((width - margin.left - margin.right) / 2) + "," +
//                         ((height * (2 / 3)) + ")"));

//                 svg.select("g.arc .bg-arc")
//                     .datum({
//                         endAngle: arcMax
//                     })
//                     .style("fill", "#ddd")
//                     .attr("d", arc);

//                 function arcTween(a) {
//                     var i = d3.interpolate(this._current, a);
//                     this._current = i(0);
//                     return function (t) {
//                         return arc(i(t));
//                     };
//                 }

//                 var dataArc = svg.select("g.arc .data-arc")
//                     .datum({
//                         score: data[0],
//                         startAngle: arcMin,
//                         endAngle: arcScale(data[0])
//                     })
//                     .transition()
//                     .duration(750)
//                     .style("fill", function (d) {
//                         return colorScale(d.score);
//                     })
//                     .style("opacity", function (d) {
//                         return d.score < dataDomain[0] ? 0 : 1;
//                     })
//                     .attrTween("d", arcTween);

//                 var arcBox = svg.select("g.arc .bg-arc").node().getBBox();
//                 svg.select("text.arc-label")
//                     .datum({
//                         score: data[0]
//                     })
//                     .attr("x", (arcBox.width / 2) + arcBox.x)
//                     .attr("y", -15)
//                     .style("alignment-baseline", "central")
//                     .style("text-anchor", "middle")
//                     .style("font-size", "20px")
//                     .text(function (d) {
//                         return d3.format(".1f")(d.score) + '%';
//                     });

//                 svg.append("text")
//                     .attr("class", "small text-muted")
//                     .attr("text-anchor", "bottom")
//                     .attr("color", "#777777")
//                     .attr("x", 30)
//                     .attr("y", 130)
//                     .text("When Max Spend is Known");

//                 var markerLine = d3.radialLine()
//                     .angle(function (d) {
//                         return arcScale(d);
//                     })
//                     .radius(function (d, i) {
//                         return innerRadius + ((i % 2) * ((outerRadius - innerRadius)));
//                     });

//                 arcG.selectAll(".lines")
//                     .attr("d", function (d) {
//                         return markerLine([d.score, d.score]);
//                     })
//                     .style("fill", "none")
//                     .style("stroke-width", 2.5)
//                     .style("stroke", "#fff");

//                 arcG.selectAll(".ticks")
//                     .style("font-size", "12px")
//                     .style("text-anchor", "middle")
//                     .attr("x", function (d) {
//                         return Math.cos(arcScale(d) + arcMin) * (outerRadius + labelPad);
//                     })
//                     .attr("y", function (d) {
//                         var yVal = Math.sin(arcScale(d) + arcMin) * (outerRadius + labelPad);
//                         return yVal < -1 ? yVal : -7;
//                     }).text(function (d) {
//                         return d;
//                     });
//             });
//         }

//         chart.margin = function (_) {
//             if (!arguments.length) return margin;
//             margin = _;
//             return chart;
//         };

//         chart.width = function (_) {
//             if (!arguments.length) return width;
//             width = _;
//             return chart;
//         };

//         chart.height = function (_) {
//             if (!arguments.length) return height;
//             height = _;
//             return chart;
//         };

//         chart.innerRadius = function (_) {
//             if (!arguments.length) return innerRadius;
//             innerRadius = _;
//             return chart;
//         };

//         chart.outerRadius = function (_) {
//             if (!arguments.length) return outerRadius;
//             outerRadius = _;
//             return chart;
//         };

//         chart.dataDomain = function (_) {
//             if (!arguments.length) return dataDomain;
//             dataDomain = _;
//             return chart;
//         };

//         chart.colorOptions = function (_) {
//             if (!arguments.length) return colorOptions;
//             colorOptions = _;
//             return chart;
//         };

//         chart.labelPad = function (_) {
//             if (!arguments.length) return labelPad;
//             labelPad = _;
//             return chart;
//         };

//         return chart;
//     }

//     function randNumberBounds(min, max) {
//         min = Math.ceil(min);
//         max = Math.floor(max);
//         return Math.floor(Math.random() * (max - min)) + min;
//     }
// $('#afe2539ExpenditureChart').ready(function () {

//     (function () {
//         var gauge = expenditureGaugeChart()
//             .width(expenditureGaugeWidth)
//             .height(expenditureGaugeHeight)
//             .innerRadius(50)
//             .outerRadius(80);

//         d3.select("#afe2539ExpenditureChart").datum([randNumberBounds(0, 100)]).call(gauge);

//         // resize based on the width of the gague
//         function resize() {
//             var gWidth = Math.min(d3.select("#afe2539ExpenditureChart").node().offsetWidth, 260);
//             gauge.width(gWidth).innerRadius(gWidth / 4).outerRadius((gWidth / 4) + 40);
//             d3.select("#afe2539ExpenditureChart").call(gauge);
//         }

//         //resize(chartId);
//         //window.addEventListener("resize", resize);

//         // var button = document.getElementById("random");
//         // button.addEventListener("click", function () {
//         //     d3.select("#expenditureChart").datum([randNumberBounds(0, 100)]).call(gauge);
//         // });
//     })();
// });

// $('#afe8795ExpenditureChart').ready(function () {
//     (function () {
//         var gauge = expenditureGaugeChart()
//             .width(expenditureGaugeWidth)
//             .height(expenditureGaugeHeight)
//             .innerRadius(50)
//             .outerRadius(80);

//         d3.select("#afe8795ExpenditureChart").datum([randNumberBounds(0, 100)]).call(gauge);

//         // resize based on the width of the gague
//         function resize() {
//             var gWidth = Math.min(d3.select("#afe8795ExpenditureChart").node().offsetWidth, 260);
//             gauge.width(gWidth).innerRadius(gWidth / 4).outerRadius((gWidth / 4) + 40);
//             d3.select("#afe8795ExpenditureChart").call(gauge);
//         }

//         //resize(chartId);
//         //window.addEventListener("resize", resize);

//         // var button = document.getElementById("random");
//         // button.addEventListener("click", function () {
//         //     d3.select("#expenditureChart").datum([randNumberBounds(0, 100)]).call(gauge);
//         // });
//     })();
// });

// $('#afe88215ExpenditureChart').ready(function () {
//     (function () {
//         var gauge = expenditureGaugeChart()
//             .width(expenditureGaugeWidth)
//             .height(expenditureGaugeHeight)
//             .innerRadius(50)
//             .outerRadius(80);

//         d3.select("#afe88215ExpenditureChart").datum([randNumberBounds(0, 100)]).call(gauge);

//         // resize based on the width of the gague
//         function resize() {
//             var gWidth = Math.min(d3.select("#afe88215ExpenditureChart").node().offsetWidth, 260);
//             gauge.width(gWidth).innerRadius(gWidth / 4).outerRadius((gWidth / 4) + 40);
//             d3.select("#afe88215ExpenditureChart").call(gauge);
//         }

//         //resize(chartId);
//         //window.addEventListener("resize", resize);

//         // var button = document.getElementById("random");
//         // button.addEventListener("click", function () {
//         //     d3.select("#expenditureChart").datum([randNumberBounds(0, 100)]).call(gauge);
//         // });
//     })();
// });
