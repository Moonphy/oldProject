
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

function getRoot(){
    var url = window.location.href;
    var url = url.replace(/(.*[\/]).*/,"$1");
    return url;
}

function play_ad(){
    var ads = $("#right-part .ad li");
    var numbers = $("#right-part .ad .dot div");
    var current = 0;

    numbers.each(function(index,data){
        if($(data).hasClass("current")){
            current = index;
        }
    });


    var next;
    if(current==2){
        next = 0
    }else{
        next = current+1;
    }

    ads.hide();
    $("#right-part .ad li:eq(".concat(next,")")).show();

    numbers.each(function(index,data){
        if(next==index){
            $(data).removeClass("normal");
            $(data).addClass("current");
        }else if(current==index){
            $(data).removeClass("current");
            $(data).addClass("normal");
        }
    });
}

$(function(){

    $(".folder_add,.folder_new .add").click(function(){
        hidePopup("popup_shortcut");
        showPopup("popup-new-folder");
    });

    $("#popup-new-folder .button").click(function(){
        hidePopup("popup-new-folder");
    });

    $(".category_menu").click(function(){
        $("#popup_category").show();
    });

    $("#system_icon .plus").click(function(){
        $("#popup_shortcut").show();
    });


    $("#popup-message .next").click(function(){
        hidePopup("popup-message");
        showPopup("popup-message-detail");
    });

    $("#system_icon .message").click(function(){
        showPopup("popup-message");
    });

    $("#system_icon .notice").click(function(){
        showPopup("popup-notice");
    });

    $("#system_icon .user_name").mouseover(function(){
        $("#popup_userinfo").show();
        return false;
    });

    $("#popup_category .header div").mouseover(function(){
        $(this).parent().find("div").removeClass("selected");
        $(this).addClass("selected");
        var detail = $("#popup_category").find(".detail");
        detail.find("div").hide();
        var clsName = $(this).attr("select");
        detail.find("div.".concat(clsName)).show();
    });

    $(".js-over-show").mouseover(function(){
        return false;
    });

    $("body").mouseover(function(){
        $(".js-over-show").hide();
    });


    $(".close_button").live('click',function(){
        var id = $(this).parent().attr("id");
        hidePopup(id);
    });


    $("a.invite-friend").click(function(){
        showPopup("popup-invite")
    });

    $("#popup-invite .button").click(function () {
        hidePopup("popup-invite");
    });

    $("li#websites").hover(function(){
        $(this).find(".button").show();
    },function(){
        $(this).find(".button").hide();
    });

    $("#gsearch").click(function(){
        var url = getRoot();
        window.location.href = url.concat("search_website.html");
    });

    $("#question-input .button").click(function(){
        showPopup("popup-new-question");
    });

    $("#popup-new-question .button").click(function(){
        hidePopup("popup-new-question");
    });


    $(".goto-login,.btn-login").click(function(){
        hidePopup("popup-register-ok");
        hidePopup("popup-register");
        hidePopup("popup-forget-password");
        showPopup("popup-login");
    });

    $(".btn-register,.goto-register").click(function(){
        hidePopup("popup-login");
        showPopup("popup-register");
    });


    $(".btn-email-register").click(function(){
        var email = $("input[type='email']").val();

        $.post("/reg/email",{email:email},function(data){
            $("#popup-register-ok span.email").text(data.email);
            $("#popup-register-ok a.finish-register").attr('href',data.server);

            hidePopup("popup-register");
            showPopup("popup-register-ok");
        });

    });

    $(".forget-password").click(function(){
        hidePopup("popup-login");
        showPopup("popup-forget-password");
    });

    $("#filter-search-group .combo").click(function(){
        $("#panel-type-select").show();
    });

    $("#panel-type-select").click(function(){
        $("#panel-type-select").hide();
        return false;
    });

    $("ul#websites li").hover(function(){
        $(this).find(".btn-gather").show();
    },function(){
        $(this).find(".btn-gather").hide();
    });


    $(".btn-gather").click(function(){
        showPopup("popup-gather");
    });

    $("#popup-gather .select").click(function(){
        $(".panel-search").show();
    });

    $(".panel-search li .text").click(function(){
        $(".panel-search").hide();
    });

    $(".share_website").click(function(){
        showPopup("popup-share");
    });

    $(".btn-confirm-to-next").click(function(){
        hidePopup("popup-share");
        showPopup("popup-gather");
    });

    $(".fun-site").hover(function(){
        $(this).find(".btn-gather").show();
    },function(){
        $(this).find(".btn-gather").hide();
    });

    if($("#right-part .ad").length>0){
        setInterval(play_ad,3000);
    }

    $(".btn-send-email").click(function(){
        var url = getRoot();
        window.location.href = url.concat("forget_password.html");
    });

    $("#guess .subject").mouseover(function () {
        $("#guess .subject").removeClass("selected");
        $(this).addClass("selected");
    });

    $(window).scroll(function(){
        if($(document).scrollTop()==0){
            $("#to-top").hide();
        }else{
            $("#to-top").show();
        }
    });
    $("#to-top").click(function(){
        $(document).scrollTop(0);
        //$(document).slideUp("slow");
        $("#to-top").hide();
    });


    $("div.qq").click(function(){
        window.location.href='http://www.iwoor.com/auth/qq';
    });

    $("div.weibo").click(function(){
        window.location.href='http://www.iwoor.com/auth/weibo';
    });

    $("div.douban").click(function(){
        window.location.href='http://www.iwoor.com/auth/douban';
    });

    $("div.renren").click(function(){
        window.location.href='http://www.iwoor.com/auth/renren';
    });
});