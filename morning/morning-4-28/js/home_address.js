$(function(){
    $(".address_main").click(function () {
        $(this).addClass("selected").removeClass("unselected").siblings(".selected").removeClass("selected").addClass("unselected");
    });
    $(".add_address").click(function() {
        $(".new_address").show();
        $(".add_address").hide();
    });
    $("#address_submit").click(function() {
        $(".add_address").show();
    });

    $(".address_main:nth-child(3n+2)").addClass("address_main_margin");

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

    $(".edit_default").click(function () {
        var def = $(this).parent().siblings(".default");
        $(def).children().find(".default_address").empty();
        $(this).parent().addClass("default").siblings(".default").removeClass("default");
        $(this).parent().find(".username").append("<span class='default_address'>（默认收货地址）</span>");
    });

    $(".edit_address").click(function () {
        $(this).next().show();
        $(this).prev().css("display","none");
        $(this).css("display","none");
    });

    $(".address_select_edit1").citySelect({
        nodata:"none",
        required:false
    });
    $(".address_select_edit2").citySelect({
        nodata:"none",
        required:false
    });
    $(".address_select_new").citySelect({
        nodata:"none",
        required:false
    });

    $(".address_select select").change(function(){
        var provText = $(this).find("option:selected").val();
        console.log(provText);
    });

});