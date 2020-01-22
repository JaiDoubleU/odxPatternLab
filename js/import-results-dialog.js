$('#fileImportResultsDialog').ready(function () {
    $('.collapse').on('show.bs.collapse', function() {
        var toggle = $('[data-target="#' + this.id + '"]');
        if (toggle) {
            var parent = toggle.attr('data-parent');
            if (parent) {
                $(parent).find('.collapse.in').collapse('hide');
            }
        }
    });

    $('#fileImportResults .list-group-item').on('click', function () {
        $(this).parent().find('.fa-minus-square').toggleClass('fa-plus-square fa-minus-square');
        $(this).find('.far').toggleClass('fa-plus-square fa-minus-square');
    });
});
