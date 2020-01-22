
// Initialize the paginated list datatable
$('#paginatedList').ready(function () {
    $('#paginatedList').DataTable( {
        responsive: true,
        colReorder: true,
        oLanguage: defaultDataTablesOLanguage,
        "lengthMenu": defaultDataTablesLengthMenu,
        "ajax"    : "../../styleguide/data/empData.json",
        "sDom": defaultDataTablesSDom
    } );
});
