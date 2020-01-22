var DISPLAY_TIME = 15;
$("#sessionTimeOutDialog")
    .on("show.bs.modal", function () {
        $(this)
            .find(".modal-body #timeOutCountdown")
            .text(DISPLAY_TIME);
    })
    .on("shown.bs.modal", function () {
        var countdownTimer = setInterval(
            function (timedAlert) {
                var spanElt = timedAlert.find(".modal-body span"),
                    timeLeft = parseInt(spanElt.text());
                $(".modal-body #timeOutCountdown").text(--timeLeft);
                if (timeLeft <= 0) timedAlert.modal("hide");
            },
            1000,
            $(this)
        );
        $(this).data("countdownTimer", countdownTimer);
    })
    .on("hidden.bs.modal", function () {
        clearInterval($(this).data("countdownTimer"));
    });
