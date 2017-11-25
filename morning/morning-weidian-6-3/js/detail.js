$(function(){

    //动态修改海报宽高
    var mW=$(".main_image ul li img").width();
    var mH=$(".main_image ul li img").height();
    //var height=mW*(360/750);
    if(mW>mH){
        $(".main_visual").css("height",mH);
        $(".main_image").css("height",mH);
        $(".main_image ul li").css("height",mH);
        $(".main_image ul li img").css("height",mH);
    }else{
        $(".main_visual").css("height","300px");
        $(".main_image").css("height","300px");
        $(".main_image ul li").css("height","300px");
        $(".main_image ul li img").css("height","300px");
    }

    //手指触屏控制切换
    $(".main_image").touchSlider({
        flexible : true,
        speed : 300,
        btn_prev : $("#btn_prev"),
        btn_next : $("#btn_next"),
        paging : $(".flicking_con a"),
        counter : function (e){
            $(".flicking_con a").removeClass("on").eq(e.current-1).addClass("on");
        }
    });

    //点赞控制
    $(".bar2").click(function () {

        var span = $(this).find("span");
        var num = parseInt(span.text());
        var n = num+1;

        $(this).stop().animate({width: '45px',height:'25px'}, 100, function () {
            $(this).animate({width: '35px',height:'20px'}, 100);
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

    $(".bar1").click(function () {
        $(this).stop().animate({width: '45px',height:'25px'}, 100, function () {
            $(this).animate({width: '35px',height:'20px'}, 100);
        });
        $(this).toggleClass("favorite");
    });

    $(".share").click(function () {
        $(".popup_share").show();
    });
    $(".popup_close").click(function () {
        $(".popup_share").hide();
    });

    //购物数量加减
    $(".add").click(function () {
        var n1 = parseInt($(this).prev().val());
        $(this).prev().val(n1 + 1);
        $(this).prevAll().removeAttr("disabled");
    });

    $(".cut").click(function () {
        var n2 = parseInt($(this).next().val());
        if(n2 < 2){
            $(".cut").attr("disabled", "true")
        }else{
            $(".cut").removeAttr("disabled");
            $(this).next().val(n2 - 1);
        }
    });

    //切换选购页
    $(".add_cart_btn").click(function () {
        $("html,body").animate({scrollTop: 0}, 0);
        $("#add_content").slideDown(300);
        $("#add_content .button").css("z-index","10");
    });

    //切换选购页
    $(".buy_btn").click(function () {
        $("html,body").animate({scrollTop: 0}, 0);
        $("#buy_content").slideDown(300);
        $("#buy_content .button").css("z-index","10");
    });

    $(".add_cart").click(function () {
        alert("已加入购物车");
    });

    //关闭弹出框
    $(".popup_form_close").click(function () {
        $("#buy_content,#add_content").fadeOut(0,1);
    });

    //其它颜色点中背景
    $(".other_color ul li").click(function () {
        $(this).addClass("selected").siblings(".selected").removeClass("selected");
    });

});