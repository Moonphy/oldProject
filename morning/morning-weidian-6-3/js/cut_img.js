$(function(){

    var w = $(window).width();
    var h = $(window).height();
    $('.cutbox').crop({
        w:w>h?h:w,
        h:h,
        r:(w-30)*0.5,
        res:'',
        callback:function(ret){
            //alert(ret);
            localStorage.setItem("new_avatar",ret);
            sessionStorage.setItem('edit_avatar',true);
            window.location.replace("personal_edit.html");
        }
    });

});
