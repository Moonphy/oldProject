$(function() {

    //手指触屏控制切换
    var swiper1 = new Swiper('.main_image', {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        spaceBetween: 10
    });
    var swiper2 = new Swiper('.same_main_image', {
        slidesPerView: 3,
        spaceBetween: 10
    });
    var swiper3 = new Swiper('.personal_main_image', {
        slidesPerView: 4,
        spaceBetween: 2
    });

});