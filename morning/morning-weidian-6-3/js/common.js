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



    $(".f_radio").click(function () {
        $(this).addClass("selected").removeClass("unselected").siblings(".selected").removeClass("selected").addClass("unselected");
    });

});