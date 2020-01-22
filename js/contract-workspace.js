$("#contWorkspaceCurrencyDropdownMenu").ready(function () {
    $.ajax({
        url: "../../styleguide/data/currencies.json",
        type: "GET",
        success: function (response) {
            var responseData = response;
            $.each(responseData, function (i, obj) {
                var menuItem = '<li onclick="$(\'#currencyCodeDisplay\').html(\' ' + obj.code + ' \')"><a id="' + obj.number + ' href="#nogo">' + obj.code + '   <small class="text-muted">(' + obj.name + ')</small></a></li>';
                $(menuItem).appendTo('#contWorkspaceCurrencyDropdownMenu');
            });
        }
    });
});

function openTeamModal() {
    $('#contract-workspace-modal-title').html("Manage Team");
    $('#contract-workspace-modal').modal();
    $('[data-toggle="popover"]').popover();
}

function openCreatePriceBookModal() {
    $('#new-pricebook-modal').modal();
}

function openAddCommentModal() {
    $('#add-comment-modal').modal();
}