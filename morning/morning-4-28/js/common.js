
$(function(){

    $('#nav').live('mouseleave',function () {
        $(this).children().children().find("button").css("display","none");
    });
    $('#nav #main-menu .selected').prev().css("background-image","none");

    $('#searchKeyword').click(function () {
        $(this).next().css("display","block");
    });
    
    $('.search button,.search input:submit').click(function () {
        if($('#searchKeyword').val()){
            $(this).parent().submit();
        }else{
            alert("请输入搜索条件");
            return false;
        }
    });

    var num = parseInt($('.cart_logo i').text());
    var n = 99;
    if(num>99){
        $('.cart_logo i').text(n);
    }

    $(".shopping-cart").live('mouseover',function () {
        $(".popup_cart").css("display","block");
    });


    $(".f_radio").click(function () {
        $(this).addClass("selected").removeClass("unselected").siblings(".selected").removeClass("selected").addClass("unselected");
    });
    $(".information_part2 .selected").click(function () {
        $(this).removeClass("selected").addClass("unselected");
    });

    $(".classify_color ul li").click(function () {
        $(this).addClass("selected_color").removeClass("unselected_color").siblings("li").removeClass("selected_color").addClass("unselected_color");
    });

    $(".style_information div").click(function () {
        $(this).addClass("selected").removeClass("unselected").siblings(".selected").removeClass("selected").addClass("unselected");
    });

    $(".js-over-show").mouseover(function(){
        return false;
    });
    $("body").mouseover(function(){
        $(".js-over-show").hide();
    });
    $(".cart_cover").mouseover(function(){
        $(".popup_cart").css('display','none');
    });

    $("#toTop").scrolltotop(1000);
    /*$(window).scroll(function(){
        if($(document).scrollTop()==0){
            $("#toTop").hide();
        }else{
            $("#toTop").show().animate({marginTop: "100px"},200);
        }
    });
    $("#toTop").click(function(){
        $("html,body").animate({scrollTop: 0},"slow");
        $("#toTop").animate({marginTop: "-1000px"},"normal");
    });*/

    $('.cart_show').ckSlide({
        autoPlay: true,
        dir: 'Y',
        isAnimate: true
    });

});