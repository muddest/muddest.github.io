$(document).ready(function() {
    $('#info').click(function(e) {
        e.preventDefault();
        $('#googleform').fadeIn(300);
    });
    $('#googleform').click(function() {
        $(this).fadeOut();
    });
});