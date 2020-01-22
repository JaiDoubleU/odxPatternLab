function showNoRowsSelectedAlert() {
    setTimeout(function() {
        $('#simpleFormAlertDialog').addClass('in slide-in-top');
        setTimeout(function() {
        $('#simpleFormAlertDialog').removeClass('in slide-in-top');
        $('#simpleFormAlertDialog').addClass('slide-out-top');
        }, DEFAULT_WAIT_DURATION);
        $('#simpleFormAlertDialog').removeClass('slide-out-top');
    }, SHOW_ANIMATION_DURATION);
}

function showSuccessAlert() {
    setTimeout(function() {
        $('#simpleFormSuccessDialog').addClass('in slide-in-top');
        setTimeout(function() {
        $('#simpleFormSuccessDialog').removeClass('in slide-in-top');
        $('#simpleFormSuccessDialog').addClass('slide-out-top');
        }, DEFAULT_WAIT_DURATION);
        $('#simpleFormSuccessDialog').removeClass('slide-out-top');
    }, SHOW_ANIMATION_DURATION);
}

function setFieldValue(checkbox, input) {
    if(checkbox.is(':checked')) {
        input.val('');
        input.attr("placeholder", "clear values");
    } else {
        input.val('');
        input.attr("placeholder", "");
    }
}

function showBatchUpdateModal() {
    if($('.checkthis:checkbox:checked').length == 0) {
        showAlertDialog('warning','<strong>No rows selected.</strong> Please select one or more rows to perform the batch update on.', true);
        //showNoRowsSelectedAlert() ;
    } else {
        $('#batchUpdateModal').modal('show');
    }
    return false;
}

$("#batchUpdateModal").on("hide.bs.modal", function () {
    // showSuccessAlert();
    showAlertDialog('success', '<strong>Success!</strong> Your updates were successfully applied.', true);

});
