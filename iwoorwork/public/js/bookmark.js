function showBookmark(){
    var mask = $(".mask");
    if(mask.length==0){
        mask = $('<div class="mask"></div>');
        $("body").append(mask);
    }
    mask.show();
    $(".bookmark-pointer").show();
}

function hideBookmark(){
    $(".bookmark-pointer").hide();
    var mask = $(".mask");
    mask.hide();
}

$(function(){
    $(".btn-install").hover(function(){
        showBookmark();
    },function(){
        hideBookmark();
    });
});