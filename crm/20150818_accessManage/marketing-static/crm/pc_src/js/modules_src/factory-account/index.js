var factoryAccount;
var common = require('common');
var tpl = require('tpl');
var pagination = require('pagination');
var $ = common.jquery;
var listtpl = require('./src/list-tpl');


var list = $('#list');
var saveBtn = $('#savebtn');
var orgId = $.utils.getqs('id') || 0;

$.layer.config({
    skin: 'layui-layer-molv'
});

if($.isEmpty(orgId)){
    $.keyNotFound();
    return;
}

load(0);

function load(page){
    page = page===undefined?0:page;
    $.ajax({
        url:'/org/find/userlist',
        data:'orgID='+encodeURIComponent(orgId)+'&current='+encodeURIComponent(page)+'&size=1000',
        callback:function(data){
            if(!data || !data.model || data.model.length<=0){
                saveBtn.hide('fade');
            }
            tpl(listtpl).render(data, function (render) {
                list.empty().append(render.replace(/undefined/g,'')
                    .replace(/null/g,''));
            });
            pagination.init({
                target:'.pager1',
                total:data.total,
                eachCount:data.size,
                currentPage:data.current,
                callback:load
            });
        }
    })
}

//判断输入的信息是否已经在数据库中存在
list.on('change','input', function () {
    var self = $(this);
    var userId = self.parents('tr').find('input[name="userID"]').val();
    var val = self.val();
    if($.isEmpty(val)){
       return;
    }
    $.ajax({
        url:'/org/find/accountIsExist',
        data:'loginKey='+encodeURIComponent(val)+'&userID='+encodeURIComponent(userId),
        callback: function (isExist) {
            if(isExist){//已经存在
                $.layer.tips('此账号已存在，请重新填写',self);
                self.addClass('error');
            }else{
                self.removeClass('error');
            }
        }
    });
});

list.on('click','.reset', function () {
    var self = $(this);
    var tr = self.parents('tr');
    var userId = self.data('id');
    var mobile = tr.find('input')[0];
    $.layer.loadPlugin('ext',function(layer){
        var mobileNo = mobile.value;
        layer.prompt({
            value: /^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/.test(mobileNo)?mobileNo:'',
            maxlength: 11,
            title: '请输入接收密码手机号',
            btn:['确定填写并发送','取消操作']
        },function (value, index, elem) {
            $.ajax({
                url:'/org/edit/resetPwd',
                type:'POST',
                data:'tel='+encodeURI(value)+'&userID='+encodeURI(userId),
                callback: function () {
                    $.alert('请求已受理，短信可能会有延迟，请告知耐心等候！','s');
                },
                error: function (e) {
                    $.alert('请求发送失败，请稍后重试，'+ e.statusText,'e');
                }
            });
            $.layer.close(index);
        });
        $('.layui-layer-content').prepend('<p><i class="star">*</i>请填写用来接收账号密码的手机号：</p>')
            .append('<p>注：登录账号和密码信息将会以短信的形式</p>' +
            '<p>发送到填写的手机号上请谨慎操作！！！</p>');
    });
});

var tip;
list.on('focus','.J_no', function () {
    tip = $.layer.tips('手机账号和邮箱账号原则上是二选一的！',this,{tips: [1, '#56A6CB']});
});
list.on('blur','.J_no', function () {
    $.layer.close(tip);
});


saveBtn.on('click', function () {
    update();
});

//批量更新账户信息
function update(){
    var params = validateParams();
    if(!params || params===undefined) return;
    $.ajax({
        url:'/org/edit/batchUser',
        type:'POST',
        data:"users="+JSON.stringify(params),
        callback:function(){
            $.alert('账号信息已更新','s');
        },
        error:function(e){
            $.alert('请求发送失败，请稍后重试，'+ e.statusText,'e');
        }
    });
}

function buildParams(){
    var trs = list.find('tr');
    var users = [];
    $.each(trs,function (idx,tr) {
        var inputs = $(tr).find('input');
        var user = {};
        $.each(inputs,function (idx,input) {
            user[input.name] = input.value;
        });
        users.push(user);
    });
    return users;
}

function validateParams(){
    var errors = $('input.error');
    if(errors.length>0){
        $.layer.tips('此账号已存在，请重新填写',errors[0]);
        return;
    }
    var users = buildParams();
    users.forEach(function (user,i) {
        if(user.loginEmail!='' && !/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(user.loginEmail)){
            $.layer.tips('邮箱格式错误！',$(list.find('tr')[i]).find('input')[1],
                {tips: 1});
            users = false;
        }
        if(user.loginMobile!='' && !/^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/.test(user.loginMobile)){
            $.layer.tips('手机号码格式错误！',$(list.find('tr')[i]).find('input')[0],
                {tips: 1});
            users = false;
        }
        if(user.isChild!=1){
            if(user.loginMobile!='' && user.loginEmail!='') {
                $.layer.tips('主账号只能存在手机账号或者邮箱账号，两者不能同时存在，请删除其中一个！', list.find('tr')[i],
                    {tips: 1});
                users = false;
            }
        }
    });
    return users;
}

module.exports = factoryAccount;
