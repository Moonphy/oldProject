



$(function() {

    autosize($('textarea'));

    var h = $(window).height();
    var ulh= h - 125;

    $("ul").height(ulh);

    $("#gallery").focus(function () {
        $(".cart_goods_body").fadeOut();
    });
    $("#gallery").blur(function () {
        $(".cart_goods_body").fadeIn();
    })

});