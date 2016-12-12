var $ = require('jquery');
//全局ajax设置
$.ajaxSetup({
    dataType:'json',
    dataFilter:function(data, dataType){
        var self = this;
        //console.log(data,dataType);
        if(dataType=='json'){
            if(data.indexOf('<!DOCTYPE HTML>')!=-1){//json请求，但是返回了HTML
                if(data.indexOf('<strong>登录</strong>')!=-1){//用户掉线了
                    $.alert('请登录！！');
                    var loginModal = $.layer.open({
                        id:'loginModal',
                        type: 2,
                        title:' ',
                        shade:[0.8, '#111'],
                        shift:6,//晃动效果
                        scrollbar:false,
                        closeBtn:false,
                        move:false,
                        content: '/login-modal?mode=modal',
                        area:['550px','330px']
                    });
                    window.loginSuccess = function(){
                        $.layer.close(loginModal);
                        $.layer.msg('重新登录成功，正在恢复请求...',{icon: 1,time:1500});
                        $.ajax(self);//重新发送上一次的请求
                    }
                }else if(data.indexOf('404 ERROR')!=-1){//404
                    $.alert('抱歉，404错误！');
                }else if(data.indexOf('500 ERROR')!=-1){//500
                    $.alert('抱歉，500错误！');
                }
                return '#error';
            }else{
                data = JSON.parse(data);
                if(!data.success || data.errorCode!==0){
                    if(self.errorMsg){//用户自定义错误消息
                        $.alert(self.errorMsg+' 错误编码：'+data.errorCode,'e');
                    }else{
                        $.msg(data.msg || '服务器错误，错误编码：'+data.errorCode);
                    }
                }else{
                    return JSON.stringify(data);
                }
            }
        }else{
            return data;
        }
    },
    error: function(jqXHR, textStatus, errorMsg){ // 出错时默认的处理函数
        // jqXHR 是经过jQuery封装的XMLHttpRequest对象
        // textStatus 可能为： null、"timeout"、"error"、"abort"或"parsererror"
        // errorMsg 可能为： "Not Found"、"Internal Server Error"等
        // 提示形如：发送AJAX请求到"/index.html"时出错[404]：Not Found

        if(jqXHR.status===200){
            if(String(errorMsg).indexOf('SyntaxError: Unexpected token #')!==-1){
                //用户已经掉线，在dataFilter回调中已经存在处理，此处直接忽略
            }
        }else if(jqXHR.status==0){
            console && console.log('用户手动终止请求...');
        }else{
            $.alert('发送AJAX请求到"' + this.url + '"时出错[' + jqXHR.status + ']：' + errorMsg,'2',{});
        }
    },
    success:function(data){
        if(data && data!='#error'){//发生错误则不会回调callback
            this.callback.call(this,data.model);
        }
    }
});

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

module.exports = $;
