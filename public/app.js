// Grab the articles as a json
$.getJSON('/articles', function(data) {
    for (var i=0; i<data.length; i++) {
        $('#articles').append('<p data-id="' + data[i]._id + '">' + data[i].headline + '<br />' + data[i].url + '</p>');
    }
});

// Whenever a p tag is clicked
$(document).on('click', 'p', function() {
    $('#comments').empty();
    var thisId = $(this).attr('data-id');

    // Make an ajax call for the Article and add the comment information when it's done
    $.ajax({
        method: 'GET',
        url: '/articles/' + thisId
    }).then(function(data) {
        $('#comments').append('<h2' + data.title + '</h2>');
        $('#comments').append('<input id="titleinput" name="title" >');
        $('#comments').append('<textarea id="bodyinput" name="body"></textarea>');
        $('#comments').append('<button data-id="' + data._id + '" id="savecomment">Save Comment</button>');

        // If there's a comment in the article
        if (data.comment) {
            // Place the title/body of the comment in the title input/body textarea
            $('#titleinput').val(data.comment.title);
            $('#bodyinput').val(data.comment.body);
        }
    });
});

// When a savecomment button is clicked
$(document).on('click', '#savecomment', function() {
    var thisId = $(this).attr('data-id');

    // Run a POST request to change the comment then empty the comments section when it's done
    $.ajax({
        method: "POST",
        url: '/articles/' + thisId,
        data: {
            title: $('#titleinput').val(),
            body: $('#bodyinput').val()
        }
    }).then(function(data) {
        $('#comments').empty();
    });

    // Remove values entered in the input and textarea for comments
    $('#titleinput').val('');
    $('#bodyinput').val('');
});