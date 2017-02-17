/**
 * Created by Administrator on 2016-12-23.
 */

$(function () {
    var headerSlide = $('.header-slide');
    if( headerSlide && headerSlide.length > 0){
        $(".link-treasury").on('mouseenter', function () {
            $(".header-slide").slideDown();
        });
        $(".header-slide").on('mouseleave', function () {
            $(this).slideUp();
        });
        var headerSwipe = new swipePC('#topSlide', {
            "size": 6,
            "scrollTime": 1000,
            "auto": false,
            "loop": false
        });
    }

});