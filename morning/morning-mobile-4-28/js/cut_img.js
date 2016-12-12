$(function(){

    var w = $(window).width();
    var h = $(window).height();
    $('.cutbox').crop({
        w:w>h?h:w,
        h:h,
        r:(w-30)*0.5,
        res:'',
        callback:function(ret){
            upAvatar(ret);
        }
    });

});

function upAvatar(ret){
    layer.open({type:2,shadeClose:false,content:'上传中'});
    var url = "/index.php?s=/Users/Config/uploadAvatarData/session_id/rqs2n2t4j3j0m3rqpaq45hvem7/w/400.html";
    $.post(url,{data:ret},function(msg){
        layer.closeAll();
        if(msg.status){
            window.location.replace(U('Wap/Index/index',['ra','1']));
        }else{
            alert('保存头像失败！');
        }
    });
}