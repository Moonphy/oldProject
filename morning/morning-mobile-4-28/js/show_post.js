$(function() {

    $(".add_img").click(function () {
        $("#content1").hide();
        $("#content2").show();

    });

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
    $(".allselect").toggle(
        function () {
            $(this).parent().parent().find(".cart_goods_body .f_checkbox_normal").each(function () {
                $(this).addClass("checked");
                $(this).children("input").attr("checked", "checked");
            })
        },
        function () {
            $(this).parent().parent().find(".cart_goods_body .f_checkbox_normal").each(function () {
                $(this).removeClass("checked");
                $(this).children("input").attr("checked", "checked");
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

    $(".sub_content2").click(function () {
        $("#content2 form").submit();
    });

    /*var swiper = new Swiper('.swiper-container', {
        //scrollbar: '.swiper-scrollbar',
        //scrollbarHide: true,
        slidesPerView: 'auto',
        //centeredSlides: true,
        spaceBetween: 10
        //grabCursor: true
    });*/

    //var Scroll = new iScroll('wrapper',{hScrollbar:false, vScrollbar:false});
});
