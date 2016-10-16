$(document).ready(function() {
    $(document).on('click', '.tipus', function(e) {
        e.preventDefault();
        $('#googleform').fadeIn(300);
        $('body').addClass('hideoverflow');
    });

    $('#googleform').click(function() {
        $(this).fadeOut();
        $('body').removeClass('hideoverflow');
    });

    $('#closegoogleform').click(function() {
        $('#googleform').fadeOut();
        $('body').removeClass('hideoverflow');
    });

    

    $("#sharebutton").mouseover(function() {
        $(this).addClass('visible');
    }).mouseout(function() {
        $(this).removeClass('visible');
    });
    
});