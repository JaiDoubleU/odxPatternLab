
$('.nav-wizard').ready(function () {

    // on click listener on each of the items in the nav wizard
    $(".nav-wizard li.stage a").on("click", function() {
        var markBtn = $("#markAsBtn");

        var clickedCurrentStage = $(this).parent().hasClass("current");
        var clickedCompleteStage = $(this).parent().hasClass("complete");

        if (clickedCurrentStage) {
            markBtn.text("Mark Stage Complete");

            $(this).parent().siblings('.activate').not(".pull-right").removeClass("activate");
            $(this).parent().toggleClass("activate");

            markBtn.removeClass("btn-info");
            markBtn.addClass("btn-success");
        } else if (clickedCompleteStage) {
            markBtn.text("Mark as Current Stage");

            //$(this).parent().removeClass("complete");
            //$(this).parent().siblings('.complete').removeClass("complete");
            $(this).parent().siblings('.activate').not(".pull-right").removeClass("activate");
            $(this).parent().addClass("activate");

            markBtn.removeClass("btn-info");
            markBtn.addClass("btn-success");
        } else {
            markBtn.text("Mark as Current Stage"); 

            $(this).parent().siblings('.activate').not(".pull-right").removeClass("activate");
            $(this).parent().addClass("activate");

            markBtn.addClass("btn-success");
            markBtn.removeClass("btn-info");
        }
    });

    // on click listener on the "mark as" button
    $("#markAsBtn").on("click", function () {
        // has one of the stages been clicked?
        var hasActiveStage = $(this).parent().siblings('.activate').length > 0;
        var activateStage = $(this).parent().siblings('.activate').not(".pull-right");
        var currentStage = $(this).parent().siblings('.current').not(".pull-right");
        var nextStage = $(this).parent().siblings('.current').not(".pull-right").next();

        if (hasActiveStage) {
            var previousStages = $(this).parent().siblings('.activate').not(".pull-right").prevAll();
            var nextStages = $(this).parent().siblings('.activate').not(".pull-right").nextAll();

            if (currentStage === activateStage) {
                previousStages.addClass("complete");
                nextStages.removeClass("complete");
                nextStages.removeClass("current");

                nextStage.addClass("current");

                currentStage.removeClass('current');

                // mark the current and previous stages as complete and the next stage as current
                activateStage.removeClass("current");
                //activateStage.removeClass("activate");
                activateStage.addClass("complete");
            } else {
                // remove complete and current from all previous and next stages
                previousStages.removeClass("complete");
                nextStages.removeClass("current");
                nextStages.removeClass("complete");

                activateStage.removeClass('activate');
                activateStage.removeClass('complete');

                activateStage.addClass("current");
                previousStages.addClass("complete");

                currentStage.removeClass("current");
            }
        } else {
            currentStage.removeClass("current");
            currentStage.addClass("complete");
            nextStage.addClass("current");
        }

        // reset the button
        $(this).parent().removeClass('current');
        $(this).text("Mark Stage Complete");
        $(this).removeClass("btn-info");
        $(this).addClass("btn-success");
    });
});
