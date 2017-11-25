var login = {};

var common = require('common')
var $ = common.jquery;
var layer = $.layer;

//当前模式，可选值：modal 弹出层登录 undefined 页面登录
var mode = $.utils.getqs('mode');

var form = $('#login-form');

form.on('submit', function () {
    doLogin();
    return false;
});

if(mode=='modal'){
    $('#tip').css({
        padding: '2px 20px',
        'font-size': '1.1em',
        color: '#df0007'
    }).text('你已经掉线，为了防止信息泄露，我们需要你再次确认你的登录信息：');
}

function doLogin(){
    var params = $.utils.json2query(form.serializeObject());
    if($.isEmpty(params)){return;}
    $.ajax({
        url:'/loginAsync?next='+encodeURI(params.next),
        data:params,
        type:'POST',
        callback:function(){
            if(mode=='modal'){
                window.parent.loginSuccess();
            }else{
                window.parent.goNext();
            }
        }
    });
}

module.exports = login;
