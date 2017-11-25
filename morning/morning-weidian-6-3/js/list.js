
$(function(){

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

    //var hw = $(document).width();
    //var sw = hw*0.8;
    $(".search").click(function () {
        $("html,body").animate({scrollTop: 0}, 10);
        //$("#header").stop().css("display","block").animate({'width':hw},300);
        $(".form_content").fadeIn(300);
    });
    $(".back").click(function () {
        $(".form_content").fadeOut(300);
    });

    //nav点中背景
    $("nav ul li a").click(function () {
        $(this).addClass("selected").siblings(".selected").removeClass("selected");
    });

});