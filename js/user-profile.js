
function validate() {
    console.error($('#userId').value);
    if (!$('#userId').text() || !$('#companyName').text()) {
        console.error('those fields are rquired');
        return false;
    }
    return true;
}

function toggleEditability(formId, button, isEditable) {
    var btnName = button.attr("name");
    var relatedBtns = $("button[name='" + btnName + "']");
    if (isEditable) {
        relatedBtns.toggleClass('hide');


        $('#' + formId).removeAttr('disabled');
        $('#' + formId + ' .form-control').removeAttr('disabled');
        $('#' + formId + ' input[type="checkbox"]').removeAttr('disabled');
    } else {
        relatedBtns.toggleClass('hide');

        $('#' + formId).attr('disabled', 'disabled');
        $('#' + formId + ' .form-control').attr('disabled', 'disabled');
        $('#' + formId + 'input[type="checkbox"]').attr('disabled', 'disabled');
    }
    return false;
}

$("#addEditAccountSaveBtn").click(function () {
    //$("#addEditAccountModal").modal({
    //    backdrop: 'static',
    //    keyboard: false
    //});

});
