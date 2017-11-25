

$(function(){

    $(window).load(function () {
        $('#loading').show();
        $('.goods_waterfall').show().miniWaterfall();
        $('#loading').hide();
    });

    $('.goods_little_block_img').hover(
        function(){
            $(this).find('p').stop(true).slideDown();
        },
        function () {
            $(this).find('p').stop(true).slideUp();
        }
    );

    $(".waterfall_class").on("mouseenter mouseleave",".goods_little_block_img",function(event){
        if(event.type == "mouseenter"){
            $(this).find('p').slideDown();
        }else if(event.type == "mouseleave"){
            $(this).find('p').stop(true).slideUp();
        }
    });


    $(".like").click(function() {
        $(this).stop().animate({marginTop: '-10px'}, 100, function () {
            $(this).animate({marginTop: '0px'}, 100, function () {
                $(this).animate({marginTop: '-10px'}, 100, function () {
                    $(this).animate({marginTop: '0px'}, 100)
                });
            });
        });
        var p = $(this).next();
        var span = p.find("span");
        var num = parseInt(span.text());

        var n = num+1;
        $(span).text(n);
    });
    $(".waterfall_class").on("click",".like",function() {
        $(this).stop().animate({marginTop: '-10px'}, 100, function () {
            $(this).animate({marginTop: '0px'}, 100, function () {
                $(this).animate({marginTop: '-10px'}, 100, function () {
                    $(this).animate({marginTop: '0px'}, 100)
                });
            });
        });
        var p = $(this).next();
        var span = p.find("span");
        var num = parseInt(span.text());

        var n = num+1;
        $(span).text(n);
    });


    $(".main_visual").hover(function(){
        $("#btn_prev,#btn_next").fadeIn()
    },function(){
        $("#btn_prev,#btn_next").fadeOut()
    });

    $dragBln = false;

    $(".main_image").touchSlider({
        flexible : true,
        speed : 300,
        btn_prev : $("#btn_prev"),
        btn_next : $("#btn_next"),
        //paging : $(".flicking_con a"),
        counter : function (e){
            $(".flicking_con a").removeClass("on").eq(e.current-1).addClass("on");
        }
    });


    timer = setInterval(function(){
        $("#btn_next").click();
    }, 5000);

    $(".main_visual").hover(function(){
        clearInterval(timer);
    },function(){
        timer = setInterval(function(){
            $("#btn_next").click();
        },5000);
    });

});