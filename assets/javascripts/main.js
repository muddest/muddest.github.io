$(document).ready(function() {

    $('.show-google-form').click(function(e) {
        e.preventDefault();
        $('.tipus').trigger('click');
    });

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

    $('#organizer-link').click(function() {
        $('#organizerform').fadeIn();
        $('body').addClass('hideoverflow');
    });

    $('#closeorganizerform').click(function() {
        $('#organizerform').fadeOut();
        $('body').removeClass('hideoverflow');
    });

    $('#organizerform').click(function(e) {
        if($('#organizerform').is(':visible')) {
            $('#organizerform').fadeOut();
            $('body').removeClass('hideoverflow');
        }
    });

    $('.about-us-link').click(function(e) {
        e.preventDefault();
        //var toAbout = $('.about-intro').offset().top;
        //$('html, body').animate({scrollTop:toAbout}, 'fast');
        $('body').addClass('hideoverflow');
        $('#about').fadeIn(300);
    });

    $('#about, #about .close').click(function() {
        $('body').removeClass('hideoverflow');
        $('#about').fadeOut(200);
    })
});