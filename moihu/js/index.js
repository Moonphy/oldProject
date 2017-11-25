

function showPopup(id){
    var mask = $(".mask");
    var popup = $("#" + id);
    if(mask.length==0){
        mask = $('<div class="mask"></div>');
        $("body").append(mask);
    }
    mask.show();
    if(popup.find("div.close_button").length==0){
        var close = $('<div class="close_button"></div>');
        popup.append(close);
    }
    popup.show();
}

function hidePopup(id){
    var mask = $(".mask");
    var popup = $("#" + id);
    mask.hide();
    popup.hide();
}


$(function(){
    $(".classification").click(function () {
        $("#popup_classification").css("display",'block')
            .find('ul li').each(function (i) {
                $(this).click(function () {
                    text = $(this).text();
                    $('#searchList').text(text);
                });
            });
    });
    $(".calculate_input2").click(function () {
        $("#popup_house_type").css("display",'block')
            .find('ul li').each(function (i) {
                $(this).click(function () {
                    text = $(this).text();
                    $('#houseType').text(text);
                });
            });
    });

    $("#header .nav_out .nav .nav_bar .anli").mouseover(function () {
        $("#popup_anli").show();
        return false;
    });
    $("#_common_header .nav_out .nav .nav_bar .anli").mouseover(function () {
        $("#popup_anli").show();
        return false;
    });
    $("#_experience_header .nav_out .nav .nav_bar .anli").mouseover(function () {
        $("#popup_anli").show();
        return false;
    });
    $("#popup_anli ul li a").click(function () {
        $("#popup_anli").hide();
    });
    $(".user .user_name").click(function(){
        $("#popup_user").show();
    });
    $(".user .news").click(function(){
        $("#popup_news").show();
    });
    $(".btn1").click(function(){
        showPopup("popup_budget")
    });
    $("#popup_budget .close_button").click(function () {
        hidePopup("popup_budget");
    });
    $("#popup_budget .popup_budget_left .wrapper .choose").click(function(){
        $("#popup_choose").show();
        $("#popup_second_choose").hide();
    });

    $("li[fang_type]").mouseover(function(){
        $("#popup_second_choose").show();
        $("#popup_second_choose ul").hide();
        var fang_type = $(this).attr("fang_type");
        $("#popup_second_choose ul." + fang_type).show();
    });

    $("#popup_second_choose li").click(function(){
        var li = $(this);
        var clsName = li.parent().attr('class');
        var p = $("li[fang_type='" + clsName +"']");

        $("#fangType").text(p.text());
        $("#fangDetail").text(li.text());
    });

    $("#popup_budget").mouseover(function () {
        $(".js-over-show").hide();
    });

    $(".f_radio").click(function () {
        $(this).addClass("selected").removeClass("unselected").siblings(".selected").removeClass("selected").addClass("unselected");
    });
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

    $(".f_checkbox_more4").toggle(function () {
            var label = $(this);
            var input = label.children('input');
            if(input.val()==0){
                $(".f_checkbox_more4").each(function (index,item) {
                    $(item).removeClass("checked");
                    $(item).children("input").removeAttr("checked");
                });
                label.addClass("checked");
                label.children("input").attr("checked", "checked");
            }else{
                var styleUnlimit = $("input[type='checkbox'][value='0']").parent();
                if(styleUnlimit.hasClass('checked')){
                    styleUnlimit.removeClass("checked");
                    styleUnlimit.children("input").removeAttr("checked");
                }
                if($(".f_checkbox_more4 input[checked]").length<4){
                    label.addClass("checked");
                    label.children("input").attr("checked", "checked");
                }else{
                    alert("风格选择最多只有4项！");
                }
            }
        },
        function () {
            $(this).removeClass("checked");
            $(this).children("input").removeAttr("checked");
        }
    );


    $("#budget_details_main #main_right .header_right").mouseover(function(){
        $("#popup_budget_sort").show();
        return false;
    });

    $("#products .zhucai").mouseover(function(){
        $("#popup_zhucai").show();
        return false;
    });

    $("#products .jiaju").mouseover(function(){
        $("#popup_jiaju").show();
        return false;
    });
    $("#product_classification ul .cfli1").mouseover(function(){
        $(".popup_zhucai").show();
        return false;
    });

    $("#product_classification ul .cfli2").mouseover(function(){
        $(".popup_jiaju").show();
        return false;
    });
    $("#product_classification ul .cfli3").mouseover(function(){
        $(".popup_jiashi").show();
        return false;
    });

    $("#product_classification ul .cfli4").mouseover(function(){
        $(".popup_jiadian").show();
        return false;
    });

    $(".js-over-show").mouseover(function(){
        return false;
    });
    $("body").mouseover(function(){
        $(".js-over-show").hide();
    });

    $(".block .little_block_part4 .part4_right .sales").click(function(){
        $("#list1").show();
        $("#list2").hide();
    });
    $(".block .little_block_part4 .part4_right .collection").click(function(){
        $("#list2").show();
        $("#list1").hide();
    });
    $(".other_spec .spec .t1").mouseover(function () {
        $("#spc.s1").show();
        return false;
    });
    $(".other_spec .spec .t2").mouseover(function () {
        $("#spc.s2").show();
        return false;
    });
    $(".other_spec .spec .t3").mouseover(function () {
        $("#spc.s3").show();
        return false;
    });
    $(".other_spec .spec .t4").mouseover(function () {
        $("#spc.s4").show();
        return false;
    });
    $(".other_spec .spec .t5").mouseover(function () {
        $("#spc.s5").show();
        return false;
    });
    $(".other_spec .spec .t6").mouseover(function () {
        $("#spc.s6").show();
        return false;
    });
    $(".other_spec .spec .t7").mouseover(function () {
        $("#spc.s7").show();
        return false;
    });
    $(".other_spec .spec .t8").mouseover(function () {
        $("#spc.s8").show();
        return false;
    });
    $(".other_spec .spec .t9").mouseover(function () {
        $("#spc.s9").show();
        return false;
    });
    $(".other_spec .spec .t10").mouseover(function () {
        $("#spc.s10").show();
        return false;
    });
    $(".other_spec .spec .t11").mouseover(function () {
        $("#spc.s11").show();
        return false;
    });
    $(".other_spec .spec .t12").mouseover(function () {
        $("#spc.s12").show();
        return false;
    });

    $(".condition1_caizhi").click(function(){
        $("#popup_condition_caizhi").show();
    });
    $(".condition2_chicun").click(function(){
        $("#popup_condition_chicun").show();
    });
    $(".condition3_fengge").click(function(){
        $("#popup_condition_fengge").show();
    });
    $(".condition_zhucai").click(function(){
        $("#popup_condition_zhucai").show();
    });
    $(".condition_jiaju").click(function(){
        $("#popup_condition_jiaju").show();
    });
    $(".condition_jiashi").click(function(){
        $("#popup_condition_jiashi").show();
    });
    $(".condition_jiadian").click(function(){
        $("#popup_condition_jiadian").show();
    });
    //special_details.jade
    $(".img_like").toggle(
        function(){
            $(this).addClass("img_like2");
        },
        function () {
            $(this).removeClass("img_like2");
        }
    );

    //case_post
    $(".case_post_step1_btn").click(function(){
        $(".step2_initial").show();
        $(".step1").hide();
    });
    $(".step2_initial_btn").click(function(){
        $(".step2").show();
        $(".step2_initial").hide();
    });
    $(".step2_btn").click(function(){
        $(".step3").show();
        $(".step2").hide();
    });
    //case_post_step2.jade
    $(".little_img .img div").toggle(
        function(){
            $(this).removeClass("img_des");
            $(this).addClass("img_selected");
        },
        function () {
            $(this).removeClass("img_selected");
            $(this).addClass("img_des");
        }
    );
    $(".add_new").click(function(){
        showPopup("popup_case_release_step2")
    });
    $("#popup_case_release_step2 .close_button").click(function () {
        hidePopup("popup_case_release_step2");
    });
    //case_post_step3
    $(".step3_release_btn").click(function(){
        showPopup("popup_case_release")
    });
    $("#popup_case_release .close_button").click(function () {
        hidePopup("popup_case_release");
    });


    //common
    $(window).scroll(function(){
        if($(document).scrollTop()==0){
            $("#right_part").hide();
        }else{
            $("#right_part").show();
        }
    });
    $(".to-top").click(function(){
        $(document).scrollTop(0);
        //$(document).slideUp("slow");
        $("#right_part").hide();
    });

    var ie6 = /msie 6/i.test(navigator.userAgent), dv = $('.products-top'), st;
    dv.attr('otop', dv.offset().top); //存储原来的距离顶部的距离
    $(window).scroll(function () {
        st = Math.max(document.body.scrollTop || document.documentElement.scrollTop);
        if (st >= parseInt(dv.attr('otop'))) {
            if (ie6) {//IE6不支持fixed属性，所以只能靠设置position为absolute和top实现此效果
                dv.css({ position: 'absolute', top: st });
            }
            else if (dv.css('position') != 'fixed') dv.css({ 'position': 'fixed', top: 0 });
        } else if (dv.css('position') != 'static') dv.css({ 'position': 'absolute',top: st });
    });
});