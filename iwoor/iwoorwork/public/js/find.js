$(function(){


    $(".website").hover(function(){
        var btn = $(this).find(".btn-attend-normal");
        if(btn.length>0){
            btn.removeClass("btn-attend-normal");
            btn.addClass("btn-attend-hover");
        }

    },function(){
        var btn = $(this).find(".btn-attend-hover");
        if(btn.length>0){
            btn.removeClass("btn-attend-hover");
            btn.addClass("btn-attend-normal");
        }

    });


});