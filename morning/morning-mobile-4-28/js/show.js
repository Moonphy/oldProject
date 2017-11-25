$(function() {

    /*//手指触屏控制切换
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
    });*/

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

    $(window).scroll(function () {
        var n = 0;
        var winHeight = $(window).height();

        if (n < 20) {
            var docTop = $(document).scrollTop();
            var contentHeight = $("#content").height();
            if (docTop + winHeight >= contentHeight - 10) {
                loadimg();
            }
        }
    });

});

function loadimg() {
    for (i = 0; i < 5; i++) {
        $("#content").append('<div class="main_visual"><a href="show_personal.html" class="show_header"><img src="images/show_header.jpg" alt=""/><div class="name"><b>萌萌哒小妹纸</b><br><span>5分钟前</span></div><div class="position"><span>广东</span><span>广州</span></div></a><div class="flicking_con con2"><a href="#">1</a><a href="#">2</a><a href="#">3</a><a href="#">4</a><a href="#">5</a></div><div id="main_image2" class="main_image"><ul><li><a href="show_detail.html" title=""><img src="images/examples/show_1.jpg" alt=""></a></li><li><a href="show_detail.html" title=""><img src="images/examples/show_1.jpg" alt=""></a></li><li><a href="show_detail.html" title=""><img src="images/examples/show_1.jpg" alt=""></a></li><li><a href="show_detail.html" title=""><img src="images/examples/show_1.jpg" alt=""></a></li><li><a href="show_detail.html" title=""><img src="images/examples/show_1.jpg" alt=""></a></li></ul></div><div class="bar2"><span>99</span></div><script>$("#main_image2").touchSlider({view : 1,range : 0.15,page : 1,flexible: true,speed: 300,paging: $(this).prev().children(),counter: function (e) {$(".con2 a").removeClass("on").eq(e.current - 1).addClass("on");}});</script></div>')
    }
    n += 5;
}
