var initGoodsReceiptDataTable = function() {
    var goodsReceiptList = $('#goodsReceiptLineItemsList').DataTable( {
        responsive: true,
        colReorder: true,
        "order": [[ 0, 'asc' ]],
        oLanguage: defaultDataTablesOLanguage,
        columns: [
            {
                "class": "text-nowrap",
                data: 'lineNumber',
                "width": "1%"
            },
            {
                "class": "text-nowrap",
                data: 'productName'
            },
            {
                "class": "text-nowrap",
                data: 'poLine'
            },
            {
                "class": "text-nowrap",
                data: 'quantity'
            },
            {
                "class": "text-nowrap",
                data: 'units'
            }
        ],
        "lengthMenu": defaultDataTablesLengthMenu,
        "ajax": "../../styleguide/data/goodsReceiptData.json",
        "sDom": defaultDataTablesSDom,
//            "sDom": '<"row" <"col-xs-6 text-left"l><"col-xs-6 text-right"f>>r<"table-responsive"t><"row" <"col-xs-6 text-left"i><"col-xs-6 text-right"p>><"clear">'
    });
};
