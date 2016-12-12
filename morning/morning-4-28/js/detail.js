$(function(){
    //购物数量加减
    var t = $("#text_box");
    $("#add").click(function () {
        t.val(parseInt(t.val()) + 1);
        if(t.val()>1){
            $("#cut").css("background-color"," #777777")
        }
    });

    $("#cut").click(function () {
        if(t.val() < 2){
            $("#cut").css("background-color"," #dbdbdb")
        }else{
            t.val(parseInt(t.val()) - 1)
        }
    });

    var symbol_word = $(".information_part3 label span").text();
    var reg = /(.*牛皮.*)$/g;

    if(symbol_word.match(reg)){
        $(".symbol").show();
    }

    $(".collection").toggle(
        function () {
            $(this).addClass("bookmarked").removeClass("cancel").text("取消收藏");
            $(this).children("input").attr("checked", "checked");
        },
        function () {
            $(this).addClass("cancel").removeClass("bookmarked").text("收藏该商品");
            $(this).children("input").removeAttr("checked");
        }
    );

    $(".like").click(function() {
        $(this).children().stop().animate({marginTop: '-10px'}, 100, function () {
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

    $('.other_color ul li:nth-child(10n)').css("margin-right","0");

    $('#add_cart').on('click', addProduct);
    function addProduct(event) {
        //$(document).scrollTop(0);
        $("html,body").animate({scrollTop: 0},150);
        var offset = $('.shopping-cart').offset(), flyer = $('<img class="u-flyer" src="images/cart2.jpg"/>');
        flyer.fly({
            start: {
                left: event.pageX-900,
                top: event.pageY-300
            },
            end: {
                left: offset.left+10,
                top: offset.top+15,
                width: 0,
                height: 0
            },
            onEnd: function () {
                //$("#msg").show().animate({ width: '250px' }, 200).fadeOut(1000);
                //$('#add_cart').css({"cursor":"default"},{"background":"#dbdbdb"});
            }
        });
    }

});