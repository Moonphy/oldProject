var createAccount = {};
var common = require('common');
var $ = common.jquery;
var layer = require('layer');
var loadcity = require('loadcity');

if(location.pathname.indexOf('base/account/find')!=-1 && ($.isEmpty(params) || $.isEmpty(params.id))){
    $.keyNotFound();
    return;
}

$(function() {
    var mp = $('#mp'),
        email = $('#email'),
        mfctyName = $('#mfctyName'),
        address = $('#address'),
        cactMan = $('#cactMan'),
        cactTel = $('#cactTel'),
        createTime = $('#createTime'),
        dutyId = $('#dutyId'),
        province = $('#Province'),
        city = $('#City'),
        areaId = $('#areaId'),
        loginPwd = $('#loginPwd'),
        reloginPwd = $('#reloginPwd'),
        submitBtn = $('#submitBtn'),
        goList = $('#goList'),
        delBtn = $('#delBtn'),
        resetPwdBtn = $('#resetPwdBtn'),
        backBtn = $('#backBtn'),
        backUrl = '/mobile/account/index.do';
        form = $('#form');


    var emptytpl ='<option value="-1">请先选择上一级</option>';

    function loadDept(target,id){
        $.ajax({
            url:'/base/duty/find',
            type:'GET',
            errorMsg:'职位信息加载失败',
            callback:function(models){
                if(models.length==0) return;
                var tmp = '';
                $.each(models,function(idx,mode){
                    if (mode.dutyID == id)
                        tmp+='<option value="'+mode.dutyID+'" selected="selected">'+mode.dutyName+'</option>';
                    else
                        tmp+='<option value="'+mode.dutyID+'">'+mode.dutyName+'</option>';
                });
                target.empty().append(tmp);
            }
        });
    }

    //加载职位
    loadDept(dutyId,params.dutyID);
    //初始化省份
    loadcity.loadProvince(province,params.provinceID!=''?params.provinceID:undefined);
    if(params.provinceID && params.cityId && params.areaId){
        loadcity.loadCity(city,params.provinceID,params.cityId);
        loadcity.loadArea(areaId,params.cityId,params.areaId,null);
    }

    province.on('change',function(){
        var val = province.val();
        city.find(':not(:first)').remove();
        areaId.find(':not(:first)').remove();
        if(val){
            loadcity.loadCity(city,val);
        }
    });
    city.on('change', function () {
        var val = city.val();
        if(val) {
            areaId.find(':not(:first)').remove();
            loadcity.loadArea(areaId, val);
        }
    });

    goList.on('click',function(){
       window.location.href='/base/account/find/all';
    });

    delBtn.on('click',function(){
        layer.confirm('你确定删除此账户？',{icon: 3, title:'提示'},function(index){
            $.ajax({
                url:'/base/account/del',
                data:'id='+encodeURIComponent(params.id),
                type:'POST',
                errorMsg:'抱歉，删除失败！',
                callback: function () {
                    $.alert('删除成功！','s', function () {
                        layer.close(index);
                        location.href=document.referrer;
                    });
                }
            });
        });
    });

    resetPwdBtn.on('click',function(){
        layer.confirm('你确定重置此账户密码？',{icon: 3, title:'提示'},function(index){
            $.ajax({
                url:'/base/account/reset',
                data:'id='+encodeURIComponent(params.id),
                errorMsg:'抱歉，重置失败！',
                callback: function () {
                    $.alert('重置完成，初始密码为c123456！','s', function () {
                        layer.close(index);
                        location.href=backUrl;
                    });
                }
            });
        });
    });

});

module.exports = createAccount;
