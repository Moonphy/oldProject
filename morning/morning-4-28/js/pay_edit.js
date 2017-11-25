$(function(){
    $(".address_main").click(function () {
        $(this).addClass("selected").removeClass("unselected").siblings(".selected").removeClass("selected").addClass("unselected");
    });
    $(".style1").click(function () {
        $(this).addClass("selected").removeClass("unselected").siblings(".selected").removeClass("selected").addClass("unselected");
    });
    $(".information1").click(function () {
        $(this).addClass("selected").removeClass("unselected").siblings(".selected").removeClass("selected").addClass("unselected");
    });

    $(".add_address").click(function() {
        $(".new_address").show();
        $(".add_address").hide();
    });
    $("#address_submit").click(function() {
        $(".add_address").show();
    });
    $(".address_delete_btn").click(function() {
        $(this).parent().remove();
    });
    $(".address_big").citySelect({
        prov:"广东",
        city:"广州",
        dist:"白云区",
        nodata:"none"
    });

    $(".edit_default").click(function () {
        var def = $(this).parent().siblings(".default");
        $(def).children().find(".default_address").empty();
        $(this).parent().addClass("default").siblings(".default").removeClass("default");
        $(this).parent().find(".name").append("<span class='default_address'>（默认收货地址）</span>");
    });

    $(".edit_address").click(function () {
        $(this).next().show();
        $(this).prev().css("display","none");
        $(this).css("display","none");
    });

});