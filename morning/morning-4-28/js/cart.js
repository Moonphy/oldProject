
$(function(){
    //复选框
    $(".f_checkbox_normal").toggle(
        function () {
            $(this).addClass("checked");
            $(this).children("input").attr("checked", "checked");
        },
        function () {
            $(this).removeClass("checked");
            $(this).children("input").removeAttr("checked");
        }
    );

    // 全选
    $(".cart_goods_title .allselect").toggle(
        function () {
            $(".cart_goods_body .f_checkbox_normal").each(function () {
                $(this).addClass("checked");
                $(this).children("input").attr("checked", "checked");
            })
        },
        function () {
            $(".cart_goods_body .f_checkbox_normal").each(function () {
                $(this).removeClass("checked");
                $(this).children("input").attr("checked", "checked");
            })
        }
    );
    $(".allselect").toggle(
        function () {
            $(".allselect").addClass("checked");
            $(".allselect").children("input").attr("checked", "checked");
        },
        function () {
            $(".allselect").removeClass("checked");
            $(".allselect").children("input").removeAttr("checked");
        }
    );
    $('.cart_wrap table:odd').css("background","#fcfcfc");
    //$('.cart_wrap table:even').css("background","#f2f2f2");

    //购物数量加减
    $(".add").click(function () {
        var n1 = parseInt($(this).prev().val());
        $(this).prev().val(n1 + 1);
        $(this).prevAll(".cut").removeAttr("disabled").css("background-color"," #ff3b3c");
    });

    $(".cut").click(function () {
        var n2 = parseInt($(this).next().val());
        if(n2 < 2){
            $(this).attr("disabled", "true").css("background-color"," #ff8888");
        }else{
            $(".cut").removeAttr("disabled");
            $(this).next().val(n2 - 1);
        }
    });

});