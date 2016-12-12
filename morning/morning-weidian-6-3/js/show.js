$(function() {

    //手指触屏控制切换
    $("#main_image1").touchSlider({
        view : 1,
        range : 0.15,
        page : 1,
        flexible: true,
        speed: 300,
        paging: $(this).prev().children(),
        counter: function (e) {
            $('.con1 a').removeClass("on").eq(e.current - 1).addClass("on");
        }
    });

    $("#main_image2").touchSlider({
        view : 1,
        range : 0.15,
        page : 1,
        flexible: true,
        speed: 300,
        paging: $(this).prev().children(),
        counter: function (e) {
            $('.con2 a').removeClass("on").eq(e.current - 1).addClass("on");
        }
    });

    //点赞控制
    $(".bar2").click(function () {

        var span = $(this).find("span");
        var num = parseInt(span.text());
        var n = num + 1;

        $(this).stop().animate({width: '45px', height: '25px'}, 100, function () {
            $(this).animate({width: '35px', height: '20px'}, 100);
        });

        if (!$(this).hasClass("like")) {
            $(this).addClass("like");
        }

        if (num > 998) {
            $(span).text(999 + "+");
        } else {
            $(span).text(n);
        }
    });
});