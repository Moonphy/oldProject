
$(function(){

    //动态修改海报宽高
    var mW=$(".main_image").width();
    var height=mW*(360/750);
    $(".main_visual").css("height",height);
    $(".main_image ul li").css("height",height);
    $(".main_image ul li img").css("height",height);

    //海报轮播控制
    $(".main_image").touchSlider({
        flexible : true,
        speed : 200,
        btn_prev : $("#btn_prev"),
        btn_next : $("#btn_next"),
        paging : $(".flicking_con a"),
        counter : function (e){
            $(".flicking_con a").removeClass("on").eq(e.current-1).addClass("on");
        }
    });

    $(".main_image").bind("dragstart", function() {
        $dragBln = true;
    });

    timer = setInterval(function(){
        $("#btn_next").click();
    }, 3000);


    $(".main_image").bind("touchstart",function(){
        clearInterval(timer);
    }).bind("touchend", function(){
        timer = setInterval(function(){
            $("#btn_next").click();
        }, 3000);
    });

    //点赞控制
    $(".waterfall_class").on("click",".bar",function() {

        var span = $(this).find("span");
        var num = parseInt(span.text());
        var n = num+1;

        $(this).stop().animate({width: '30px',height:'25px'}, 100, function () {
            $(this).animate({width: '20px',height:'20px'}, 100);
        });

        if(!$(this).hasClass("like")){
            $(this).addClass("like");
        }

        if(num>998){
            $(span).text(999+"+");
        }else{
            $(span).text(n);
        }
    });

    //nav点中背景
    $("nav ul li a").click(function () {
        $(this).addClass("selected").siblings(".selected").removeClass("selected");
    });
    $(".close_btn").click(function () {
        $(".app").fadeOut();
    });

});
