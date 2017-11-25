$(function(){

    $(window).scroll(function(){
        if($(document).scrollTop()<=0){
            $("#toTop").hide();
        }else{
            $("#toTop").show();
        }
    });

    $("#toTop").click(function () {
        $("html,body").animate({scrollTop: 0}, 800);
    });

    var num = parseInt($('footer a i span').text());
    var n = "99+";
    if(num>99){
        $('footer .cart i span').text(n);
    }

    var hw = $("#header").width();
    var sw = hw*0.8;
    $("header .search").click(function () {
        $("html,body").animate({scrollTop: 0}, 10);
        $(".popup_search").stop().css("display","block").animate({'width':sw},300);
        $(".form_content").fadeIn(300);
    });

    $(".f_radio").click(function () {
        $(this).addClass("selected").removeClass("unselected").siblings(".selected").removeClass("selected").addClass("unselected");
    });

});