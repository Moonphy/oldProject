/*
 * cust_new
 * https://github.com/johnkim/cust_new
 *
 * Copyright (c) 2015 dreamstu
 * Licensed under the MIT license.
 */

var cust_new = {};
var common = require('common');
var $ = common.jquery;
var layer = $.layer;
var moment = require('moment');
var laydate = require('laydate');
var _ = require('underscore');
require('suggest')($);
require('tagsinput')($);
$(function(){

    //若是从其他页面进来修改信息的，则提示信息
    var from = $.utils.getqs('from') || '';
    var cookie = document.cookie.match(/(?:^|;)\s*memot=(\d)/);
    if(from=='memo'){
        if(!(cookie&&cookie[1])){
            var d=new Date();
            d.setTime(d.getTime()+30*24*3600*1000);
            document.cookie="memot=1; expires="+d.toGMTString()+"; path=/";
            $.msg('编辑并保存好用户信息，直接关闭本页面（选项卡）即可！')
        }
        $('#backbtn').hide();//隐藏返回按钮
    }

    var mp = $('#mp'),
        email = $('#email'),
        mfctyName = $('#mfctyName'),
        address = $('#address'),
        cactMan = $('#cactMan'),
        cactTel = $('#cactTel'),
        createTime = $('#createTime');

    $('.autobtn').on('click',function(){
        var mfctyId = $.trim($('#mfctyId').val());
        if(mfctyId=='') return;
        $.ajax({
            url:'/customer/orgInfo?mfctyId='+encodeURIComponent(mfctyId),
            callback:function(model){
                var need = ['loginMobile','loginEmail','orgName','address','contactPerson','contactMobile','createTime'];
                var obj = [mp,email,mfctyName,address,cactMan,cactTel,createTime];
                $.each(obj,function(idx,o){
                    if(idx==obj.length-1){
                        var date = new Date(model[need[idx]]);
                        model[need[idx]] = moment(date).format('YYYY-MM-DD HH:mm:ss');
                    }
                    o.val(model[need[idx]]);
                });
            }
        });
    });

    function getVal(obj,name){
        return obj[name];
    }
    function setVal(obj,val){
        return obj.val(val);
    }

    var _start = {
        elem: '#createTime',
        format: 'YYYY-MM-DD hh:mm:ss',
        event: 'focus',
        istime:true
    };
    laydate(_start);


    $('#submitBtn').on('click',function(){
        document.getElementById("form").submit();
    });

    $.ajax({
        url:'/base/city',
        errorMsg:'抱歉，拉取城市信息失败',
        callback:function(citysModel){
            var citys = new Array();
            $.each(citysModel,function(idx,model){
                citys.push(new Array(model.cityCode,model.cityName,model.pingying,model.shouzimu));
            });
            $('#xianxia').tagsInput({
                defaultText:'输入城市',
                width:'58%',
                height:'30px',
                onChange: function(elem, elem_tags)
                {
                    var all = $('#xianxia').getAllTags();
                    $('#hidden').empty();
                    $.each(all,function(idx,tag){
                        var obj = _.findWhere(citysModel,{'cityName':tag});
                        $('#hidden').append('<input type="checkbox" name="offlines" value="'+obj.cityId+'" checked/>');
                    });
                }
            });
            $("#xianxia_tag").suggest(citys,{
                /*hot_list:citys,*/
                attachObject:'#suggest'
            });

            var cityIds = null;
            //若为编辑页面，则自动加载现有的线下采购模式
            if($('#id').length>0){
                $.ajax({
                    url:'/customer/offlineBuy?custId='+$('#id').val(),
                    type:'GET',
                    async:false
                }).success(function(model){
                    if(model && model.length>0){
                        cityIds = _.pluck(model,'cityId');//拿出所有城市id
                        var needAdd = '';
                        $.each(cityIds,function(idx,id){
                            var city = _.findWhere(citysModel,{'cityId':id});//查找城市id对应的城市名称，并用,分隔
                            if(city!=undefined){
                                needAdd+=city.cityName+',';
                            }
                        });
                        $('#xianxia').importTags(needAdd);//添加标签
                    }
                });
            }
        }
    });
    //$('#xianxia').importTags('北京市,上海市');
});

module.exports = cust_new;
