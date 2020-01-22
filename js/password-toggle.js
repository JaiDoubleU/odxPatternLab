$('#toggle-password-field').ready(function () {
    $(".toggle-password").click(function () {
        $(this).find(".glyphicon").toggleClass("glyphicon-eye-close glyphicon-eye-open");
        if ($(this).find(".btnText").text() == "Show Password") {
            $(this).find(".btnText").text("Hide Password");
        } else {
            $(this).find(".btnText").text("Show Password");
        }

        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });
});
