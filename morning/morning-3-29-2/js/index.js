
var adTimer ;

function setAdTimer(){
    if(adTimer){
        clearInterval(adTimer);
    }
    adTimer = setInterval(play_ad,5000);
}

function getCurrent(){
    var ads = $(".ck-slide ul li");
    var current = 0;

    ads.each(function(index,data){
        if($(data).hasClass("current")){
            current = index;
        }
    });
    return current;
}

function prev(){
    var n =  getCurrent()-1;
    if(n<0){
        n = $(".ck-slide ul li").length-1;
    }
    setAdTimer();
    play_ad(n);
}

function next(){
    setAdTimer();
    play_ad();
}

function play_ad(n){
    var ads = $(".ck-slide ul li");
    var current = getCurrent();

    var next;

    if(n){
        next = n;
    }else{
        if(current==ads.length-1){
            next = 0
        }else{
            next = current+1;
        }
    }

    ads.fadeOut();
    ads.removeClass('current');
    ads.addClass('normal');
    var currentLi = $(".ck-slide ul li:eq(".concat(next,")"));
    currentLi.fadeIn();
    currentLi.removeClass('normal');
    currentLi.addClass('current');
}
$(function(){

    if($(".ck-slide ul").length>0){
        setAdTimer();
        $('.ck-prev').click(prev);
        $('.ck-next').click(next);
    }

});
