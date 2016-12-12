
$(function(){
    //复选框
    $(".f_checkbox_normal").toggle(
        function () {
            $(this).addClass("checked").removeClass("unchecked");
            $(this).children("input").attr("checked", "checked");
        },
        function () {
            $(this).addClass("unchecked").removeClass("checked");
            $(this).children("input").removeAttr("checked");
        }
    );

    // 全选
    $(".allselect").toggle(
        function () {
            $(".cart_goods_body .f_checkbox_normal").each(function () {
                $(this).addClass("checked").removeClass("unchecked");
                $(this).children("input").attr("checked", "checked");
            })
        },
        function () {
            $(".cart_goods_body .f_checkbox_normal").each(function () {
                $(this).addClass("unchecked").removeClass("checked");
                $(this).children("input").removeAttr("checked");
            })
        }
    );
    $(".allselect").toggle(
        function () {
            $(this).addClass("checked_all");
            $(this).children("input").attr("checked", "checked");
        },
        function () {
            $(this).removeClass("checked_all");
            $(this).children("input").removeAttr("checked");
        }
    );
    $('.cart_wrap table:odd').css("background","#fcfcfc");

    //购物数量加减
    $(".add").click(function () {
        var n1 = parseInt($(this).prev().val());
        $(this).prev().val(n1 + 1);
        $(this).prevAll().removeAttr("disabled");
    });

    $(".cut").click(function () {
        var n2 = parseInt($(this).next().val());
        if(n2 < 2){
            $(this).attr("disabled", "true")
        }else{
            $(this).removeAttr("disabled");
            $(this).next().val(n2 - 1);
        }
    });

    //删除
    $(".good_del_btn").click(function () {
       $(this).parent().parent().remove();
    });

    $(".buy_btn").click(function () {
        $("form").submit();
    });
});