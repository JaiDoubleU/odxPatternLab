
$('#scrollableList').ready(function () {
    $('#scrollableList').DataTable( {
        responsive: true,
        scrollX   : true,
        scrollY   : 600,
        scroller  : true,
        colReorder: true,
        oLanguage: defaultDataTablesOLanguage,
        paging    : false,
        "ajax"    : "../../styleguide/data/empData.json",
        "sDom": defaultDataTablesSDom,
        columns   : [
            {
                className: "text-center",
                render   : function(data, type, row, meta) {
                    return (
                        '<div class="checkbox"><label><input type="checkbox"></label></div>'
                    );
                }
            },
            {
                render: function(data, type, row, meta) {
                    return (
                        row[0]
                    );
                }
            },
            {
                render: function(data, type, row, meta) {
                    return (
                        row[1]
                    );
                }
            },
            {
                render: function(data, type, row, meta) {
                    return (
                        row[2]
                    );
                }
            },
            {
                render: function(data, type, row, meta) {
                    return (
                        row[3]
                    );
                }
            },
            {
                render: function(data, type, row, meta) {
                    return (
                        row[4]
                    );
                }
            },
            {
                render: function(data, type, row, meta) {
                    return (
                        '<p class="text-right">' + row[5] + "</p>"
                    );
                }
            }
        ]
    } );
} );
