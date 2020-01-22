$('#chartingColorPalette').ready(function () {
    var colorsListStart = "<ul class='sg-colors'>";
    var colorsListEnd = "</ul>";

    //$('#chartingColorPalette').append(colorsListStart);
    var ul = "<ul id='palette0' class='sg-colors'>";

    d3.schemeCategory20c.map(function (color, index, array) {
        ul += "<li><span class='sg-swatch' style='background-color: " +color +"'></span><span class='sg-label'><small>" +color +"</small></span></li>";

        if ((index%4) === 3) {
            ul += "</ul>";
            ul += "<ul id = 'palette " + index + "' class='sg-colors'>";
        }
    });
    ul+="</ul>";

    $('#chartingColorPalette').append(ul);
});
