$(function(){

    //删除
    $(".good_del_btn").click(function () {
        $(this).parent().parent().remove();
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


    $("#content .add_radio").click(function () {
        $("#content .add_radio").each(function () {
            $(this).addClass("unselected").removeClass("selected");
            $(this).children("input").removeAttr("checked");
            $(this).text("设为默认");
        });
        $(this).addClass("selected").removeClass("unselected");
        $(this).children("input").attr("checked", "checked");
        if($(this).hasClass('selected')){
            $(this).text("默认地址");
        }else{
            $(this).text("设为默认");
        }
    });

    //删除
    $(".add_del_btn").click(function () {
        $(this).parent().parent().parent().parent().remove();
    });

    $(".delivery_address input[type='radio']").change(function () {
        $("form").submit();
    });

    $(".buy_btn").click(function () {
        $("form").submit();
    });
});