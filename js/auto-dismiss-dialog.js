// constants for standard duration pariods (i.e. the amount of time that the dialog is visible before being auto dismissed).
var DEFAULT_WAIT_DURATION = 100;

// contstant representing the amount of time to wait after click before the dialog begins to slide in.
var ALERT_DIALOG_SHOW_DELAY = 100;
var ALERT_DIALOG_DISPLAY_DURATION = 2500;


function showAlertDialog(type, message, autoDismiss, classname) {
    var icon;
    if (type == 'info') {
        icon = 'fa-info fa-inverse ';
    } else if (type == 'success') {
        icon = 'fa-check-circle';
    } else if (type == 'warning') {
        icon = 'fa-question-square';
    } else if (type == 'danger') {
        icon = 'fa-exclamation-triangle';
    }

    var htmlAlert = '<div style="display: block; position: fixed; z-index: 2000; top: 2px; width: 97.5%;" class="slide-in-top alert alert-with-arrow alert-' + type +' ' +classname + '"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><span class="icon"> <i class="fas fa-fw ' + icon + '"></i></span>' + message + '</div>';
    $(".alert-messages").prepend(htmlAlert);
    if(autoDismiss) {
        $(".alert-messages .alert").hide().fadeIn(ALERT_DIALOG_SHOW_DELAY).delay(ALERT_DIALOG_DISPLAY_DURATION).fadeOut(ALERT_DIALOG_SHOW_DELAY, function () {
            $(this).remove();
        });
    }  else {
        $(".alert-messages .alert").hide().fadeIn(ALERT_DIALOG_SHOW_DELAY);
    }
}
