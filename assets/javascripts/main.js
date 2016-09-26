$(document).ready(function() {
    var distanceToSearchField = $('.searchevents').offset().top;

    $(document).scroll(function() {
        if ($(document).scrollTop() > distanceToSearchField) {
            $('.searchevents').addClass('fixed');
        } else {
            $('.searchevents').removeClass('fixed');
        }
    });
});