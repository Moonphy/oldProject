$(function(){
    $("li.fan").hover(function(){
       $(this).find(".close").show();
    },function(){
       $(this).find(".close").hide();
    });
});