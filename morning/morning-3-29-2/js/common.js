
/*function showPopup(id){
    var mask = $(".mask");
    var popup = $("#" + id);
    if(mask.length==0){
        mask = $('<div class="mask"></div>');
        $("body").append(mask);
    }
    mask.show();
    if(popup.find("div.close_button").length==0){
        var close = $('<div class="close_button"></div>');
        popup.append(close);
    }
    popup.show();
}

function hidePopup(id){
    var mask = $(".mask");
    var popup = $("#" + id);
    mask.hide();
    popup.hide();
}*/

$(function(){

    /*$(".login_btn").click(function(){
        showPopup("popup_login")
    });
    $("#popup_login .close_button").click(function () {
        hidePopup("popup_login");
    });
    $(".register_btn").click(function(){
        showPopup("popup_register")
    });
    $("#popup_register .close_button").click(function () {
        hidePopup("popup_register");
    });*/

    $(".shopping-cart").click(function () {
        $(".popup_cart").show();
    });

    $(".f_radio").click(function () {
        $(this).addClass("selected").removeClass("unselected").siblings(".selected").removeClass("selected").addClass("unselected");
    });
    $(".classify_color ul li").click(function () {
        $(this).addClass("selected_color").removeClass("unselected_color").siblings("li").removeClass("selected_color").addClass("unselected_color");
    });

    $('.sec_menu').mouseenter(function () {
        $('#popup_subdivision').fadeIn(500);
    });
    $('#popup_subdivision').mouseleave(function () {
        $('#popup_subdivision').fadeOut(500);
    });
    /*$('.sec_menu').mouseenter(function(){
        $('#popup_subdivision').fadeTo(0,0.8).stop().animate({'height':'1300px'},3000);
    });
    $('#popup_subdivision').mouseleave(function(){
        $('#popup_subdivision').stop().animate({'height':'0px'},3000);
    });*/

    /*$(".sec_classify_1").click(function () {
        $(".popup_sec_classify_1").show();
        $(".popup_sec_classify_2").hide();
    });
    $(".sec_classify_2").click(function () {
        $(".popup_sec_classify_2").show();
        $(".popup_sec_classify_1").hide();
    });*/


    $(".js-over-show").mouseover(function(){
        return false;
    });
    $("body").mouseover(function(){
        $(".js-over-show").hide();
    });
    $(".cart_cover").mouseover(function(){
        $(".popup_cart").css('display','none');
    });


    /*$(".cart_up").hover(function(){
        $(".cart_show_good").slideUp(2000);
    });
    $(".cart_down").hover(function(){
        $(".cart_show_good").slideDown(2000);
    });*/

    /*$(".img_like").toggle(
        function(){
            $(this).addClass("img_like2");
        },
        function () {
            $(this).removeClass("img_like2");
        }
    );*/

    //to-top
    $(window).scroll(function(){
        if($(document).scrollTop()==0){
            $("#scrolltop").hide();
        }else{
            $("#scrolltop").show();
        }
    });
    $(".to-top").click(function(){
        $(document).scrollTop(0);
        //$(document).slideUp("slow");
        $("#scrolltop").hide();
    });

    //shopping-cart-show
    $.fn.ckSlide = function(opts){
        opts = $.extend({}, $.fn.ckSlide.opts, opts);
        this.each(function(){
            var slidewrap = $(this).find('.cart_show_good');
            var slide = slidewrap.find('.good');
            var count = slide.length;
            var that = this;
            var index = 0;
            var time = null;
            $(this).data('opts', opts);
            // next
            $(this).parent().find('.cart_up').on('click', function(){
                if(opts['isAnimate'] == true){
                    return;
                }

                var old = index;
                if(index >= count - 1){
                    index = 0;
                }else{
                    index++;
                }
                change.call(that, index, old);
            });
            // prev
            $(this).parent().find('.cart_down').on('click', function(){
                if(opts['isAnimate'] == true){
                    return;
                }

                var old = index;
                if(index <= 0){
                    index = count - 1;
                }else{
                    index--;
                }
                change.call(that, index, old);
            });


            // focus clean auto play
            $(this).on('mouseover', function(){
                if(opts.autoPlay){
                    clearInterval(time);
                }
            });
            //  leave
            $(this).on('mouseleave', function(){
                if(opts.autoPlay){
                    startAtuoPlay();
                }
            });
            startAtuoPlay();
            // auto play
            function startAtuoPlay(){
                if(opts.autoPlay){
                    time  = setInterval(function(){
                        var old = index;
                        if(index >= count - 1){
                            index = 0;
                        }else{
                            index++;
                        }
                        change.call(that, index, old);
                    }, 4000);
                }
            }
            // dir
            switch(opts.dir){
                case "Y":
                    opts['height'] = $(this).height();
                    slidewrap.css({
                        'height':count * opts['height']
                    });
                    slide.css({
                        'position':'relative'
                    });
                    slidewrap.wrap('<div class="ck-slide-dir"></div>');
                    slide.show();
                    break;
            }
        });
    };
    function change(show, hide){
        var opts = $(this).data('opts');
        if(opts.dir == 'Y'){
            var Y = show * opts['height'];
            $(this).find('.cart_show_good').stop().animate({'margin-top':-Y}, function(){opts['isAnimate'] = false;});
            opts['isAnimate'] = true
        }else{
            $(this).find('.cart_show_good .good').eq(hide).stop().animate({opacity:0});
            $(this).find('.cart_show_good .good').eq(show).show().css({opacity:0}).stop().animate({opacity:1});
        }
    }
    $.fn.ckSlide.opts = {
        autoPlay: true,
        dir: 'Y',
        isAnimate: true
    };
    $('.cart_show').ckSlide({
        autoPlay: true,
        dir: 'Y',
        isAnimate: true
    });

});