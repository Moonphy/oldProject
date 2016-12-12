function change() {
    var pic = document.getElementById("imgPre"),
        file = document.getElementById("postbg");

    var ext=file.value.substring(file.value.lastIndexOf(".")+1).toLowerCase();

    if(ext!='png'&&ext!='jpg'&&ext!='jpeg'){
        alert("图片的格式必须为png或者jpg或者jpeg格式！");
        return;
    }

    html5Reader(file);
}

function html5Reader(file){
    var file = file.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e){
        var pic = document.getElementById("imgPre");
        pic.src=this.result;
    }
}

$(function(){

    /*var str = $('.goods_block .profile').text();
    var str_ = str.substr(0,30) + '...' ;
    $('.goods_block .profile').text(str_);*/

    //点赞控制
    $(".swiper-container").on("click",".bar",function() {

        var span = $(this).find("span");
        var num = parseInt(span.text());
        var n = num+1;

        $(this).stop().animate({width: '30px',height:'25px'}, 100, function () {
            $(this).animate({width: '20px',height:'20px'}, 100);
        });

        if(!$(this).hasClass("like")){
            $(this).addClass("like");
        }

        if(num>998){
            $(span).text(999+"+");
        }else{
            $(span).text(n);
        }
    });

    //下拉分类框
    $(".fenlei_btn").click(function(){
        $(".fenlei_li").slideToggle(200);
        $(this).toggleClass("active");
    });

    //头部背景与二维码
    $(".scan").click(function(){
        $(".popup_scan").show();
        $("#popup_header").show();
    });
    $(".close").click(function(){
        $(".popup_scan").hide();
    });

    $("#imgPre").click(function(){
        $("form").submit();
    });

});