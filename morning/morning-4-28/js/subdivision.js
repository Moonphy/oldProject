
$(function(){

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

    $(".sec_classify div ul li").click(function () {
        if($(this).hasClass("selected")){
            $(this).removeClass("selected").addClass("unselected");
        }else{
            $(this).addClass("selected").removeClass("unselected");
        }
    });

    $(".classify_sex li").click(function () {
        $(this).removeClass("selected");
        $(this).addClass("selected_t").siblings(".selected_t").removeClass("selected_t");
    });

    var dn = $(".down_button").data("names");
    $(".down_button").text("更多选项(" + dn + ") ▼");

    $(".down_button").click(function(){

        $(".hide").slideToggle(200);
        $(this).toggleClass("active");
        if($(this).hasClass("active")){
            $(".down_button").text("收起 ▲");
        }else{
            $(".down_button").text("更多选项(" + dn + ") ▼");
        }
    });
});