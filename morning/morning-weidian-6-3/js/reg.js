
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数

function sendMessage() {
    curCount = count;
    $("#btnSendCode").attr("disabled", "true").css({"background":"#e081aa"});//锁死按钮
    InterValObj = window.setInterval(SetRemainTime, 1000);
    $.ajax({
        type: "POST",
        dataType: "text",
        url: 'Login',
        data: "dealType=" + dealType +"&uid=" + uid + "&code=" + code,
        error: function (XMLHttpRequest, textStatus, errorThrown) { },
        success: function (msg){ }
    });
}

function SetRemainTime() {
    if (curCount == 0) {
        window.clearInterval(InterValObj);//停止计时器
        $("#btnSendCode").removeAttr("disabled").css({"background":"#df3d82"}).val("重新发送验证码");//启用按钮
    }
    else {
        curCount--;
        $("#btnSendCode").val(  "重新获取" + "（" + curCount + "s）");
    }
}


$(function () {

    if($("#telphone,#new_phone").val() == ""){
        $("#btnSendCode").attr("disabled", "true").css({"background":"#e081aa"});
    }

    $("#telphone,#new_phone").keyup(function () {
        if(!$(this).val().match(/^1[3-9]\d{9}$/)){
            $("#btnSendCode").attr("disabled", "true").css({"background":"#e081aa"});
        }else{
            $("#btnSendCode").removeAttr("disabled").css({"background":"#df3d82"});
        }
    });

});