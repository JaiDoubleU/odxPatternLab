var adWidth = 155;
var adHeight = 155;
var adCenter = [adWidth / 3, adHeight / 3];
var adInnerRadius = 30;
var adOuterRadius = 50;

var adData = [
    [0, 54],
    [0, 42],
    [1, 0] // need last one to have a start value > 0, end value == 0
];
var adColor = d3.scaleOrdinal(d3.schemeCategory20);

var pie = d3.pie()
    .value(function (d) {
        return d[0];
    })
    .sort(null);

var svg = d3.select('#animatedDonutChart')
    .attr('width', adWidth)
    .attr('height', adHeight)
    .append('g')
    .attr('transform', 'translate(' + adCenter[0] + ', ' + adCenter[1] + ')');

var arc = d3.arc()
    .innerRadius(adInnerRadius)
    .outerRadius(adOuterRadius);

var hoverArc = d3.arc()
    .innerRadius(adInnerRadius)
    .outerRadius(adOuterRadius + 10);

var path = svg.datum(adData).selectAll('path')
    .data(pie)
    .enter().append('path')
    .attr('fill', function (d, i) {
        return adColor(i);
    })
    .attr('d', arc)
    // set wedge opacity to 0 if it has mass on load (only the last wedge has mass to account for transition in
    .style('opacity', function (d) {
        return d.data[0] === 0 ? 1 : 0;
    })
    .each(function (d) {
        this._current = d;
    })
    .on('mouseover', function (d, i) {

        d3.select(this)
            .transition()
            .duration(500)
            .ease('elastic')
            .attr('transform', function (d) {
                var dist = 10;
                d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                var x = Math.sin(d.midAngle) * dist;
                var y = -Math.cos(d.midAngle) * dist;
                return 'translate(' + x + ',' + y + ')';
            });
    }).on('mouseout', function (d, i) {
        d3.select(this)
            .transition()
            .duration(500)
            .ease('bounce')
            .attr('transform', 'translate(0,0)')
    });




// new values for transitions
pie.value(function (d) {
    return d[1];
});

path = path.data(pie);
path.transition().duration(1000).attrTween('d', arcTween);

function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function (t) {
        return arc(i(t));
    };
}
