

$(function(){

    $('.goods_little_block_img').hover(
        function(){
            $(this).find('p').slideDown();
        },
        function () {
            $(this).find('p').slideUp();
        }
    );

    $(".waterfall_class").on("mouseenter mouseleave",".goods_little_block_img",function(event){
        if(event.type == "mouseenter"){
            $(this).find('p').slideDown();
        }else if(event.type == "mouseleave"){
            $(this).find('p').stop(true).slideUp();
        }
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

    $(".checkins button").click(function() {
        var p = $(this).next();
        var span = p.find("span");
        var num = parseInt(span.text());

        var n = num+1;
        $(span).text(n);
    });


    var phone = $("#phone").text();
    var mphone =phone.substr(3,4);
    var lphone = phone.replace(mphone,"****");
    $("#phone").text(lphone);

    var phone2 = $("#phone2").text();
    var mphone2 =phone2.substr(3,4);
    var lphone2 = phone2.replace(mphone2,"****");
    $("#phone2").text(lphone2);




    $(".user_home_list button").click(function() {
        var pos = $("#footer").offset().top;
        $("html,body").animate({scrollTop: pos}, 1000);
        $(".chat_thread form textarea").focus();
    });


    $(".collection").toggle(
        function () {
            $(this).addClass("cancel").removeClass("bookmarked").text("收藏该商品");
            $(this).children("input").removeAttr("checked");
        },
        function () {
            $(this).addClass("bookmarked").removeClass("cancel").text("取消收藏");
            $(this).children("input").attr("checked", "checked");
        }
    );
});