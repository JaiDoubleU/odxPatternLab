function setGlobalSearchPlaceholder(text) {
    $('#globalSearch').attr('placeholder', text);
    showNavbarFeedback('info', 'placeholder was set successfully');
}
function showNavbarFeedback(feedbackType, feedbackMessage) {
        $('#message').html('<div id="navbarAlert"class="alert alert-' +feedbackType +' fade hide"><button type="button" class="close close-alert" data-dismiss="alert" aria-hidden="true">×</button>' +feedbackMessage +'</div>');
        var alertDialog = $('#navbarAlert');
        setTimeout(function () {
            alertDialog.removeClass('hide').addClass('slide-in-top');
            setTimeout(function () {
                alertDialog.removeClass('slide-in-top');
                alertDialog.addClass('slide-out-top');
            }, MED_WAIT_DURATION);
            alertDialog.removeClass('slide-out-top');
        }, SHOW_ANIMATION_DURATION);
}