$.ajax({
    url: "https://randomuser.me/api/",
    type: "GET",
    success: function(response){
        var imageUrl = response.results[0]['picture']['large'];
        $('#userImage1').attr('src', imageUrl);
    }
});
