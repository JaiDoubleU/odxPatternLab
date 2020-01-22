$('#worldMap').ready(function () {
    var format = d3.format(",");

    // Set tooltips
    var worldMapTooltip = d3.tip()
        .attr('class', 'd3-tip e')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong style='color:white'>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong style='color:white'>Population: </strong><span class='details'>" + format(d.population) + "</span>";
        });

    var margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        width = $('#worldMap ').width() - margin.left - margin.right,
        height = $('#worldMap').height() - margin.top - margin.bottom;

    var scheme = d3.schemeSpectral[11].reverse();
    var color = d3.scaleThreshold()
        .domain([5000000, 10000000, 20000000, 40000000, 60000000, 100000000, 200000000, 300000000, 500000000])
        .range([scheme[0], scheme[1], scheme[2], scheme[3], scheme[5], scheme[6], scheme[7], scheme[9], scheme[10]]);

    var path = d3.geoPath();

    var worldMapSvg = d3.select("#worldMap")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append('g')
        .attr('class', 'map');

    var projection = d3.geoMercator()
        .scale(110)
        .translate([width / 2.5, height / 2]);

    var path = d3.geoPath().projection(projection);

    worldMapSvg.call(worldMapTooltip);

    queue()
        .defer(d3.json, "//s3-us-west-2.amazonaws.com/s.cdpn.io/317356/world-countries.json")
        .defer(d3.tsv, "//s3-us-west-2.amazonaws.com/s.cdpn.io/317356/world-population.tsv")
        .await(ready);

    function ready(error, data, population) {
        var populationById = {};

        population.forEach(function (d) {
            populationById[d.id] = +d.population;
        });
        data.features.forEach(function (d) {
            d.population = populationById[d.id]
        });

        worldMapSvg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(data.features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function (d) {
                return color(populationById[d.id]);
            })
            .style('stroke', 'black')
            .style('stroke-width', 1.5)
            .style("opacity", 0.8)
            // tooltips
            .style("stroke", "black")
            .style('stroke-width', 0.3)
            .on('mouseover', function (d) {
                worldMapTooltip.show(d);

                d3.select(this)
                    .style("opacity", 1)
                    .style("fill", "#43A047");
            })
            .on('mouseout', function (d) {
                worldMapTooltip.hide(d);

                d3.select(this)
                    .style("opacity", 1)
                    .style("fill", color(populationById[d.id]));
            });

        worldMapSvg.append("path")
            .datum(topojson.mesh(data.features, function (a, b) {
                return a.id !== b.id;
            }))
            .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
            .attr("class", "names")
            .attr("d", path);
    }
});
