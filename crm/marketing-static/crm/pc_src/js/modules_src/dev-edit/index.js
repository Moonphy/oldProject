var devEdit = {};
var common = require('common');
var $ = common.jquery;
var laydate = require('laydate');
var layer = require('layer');

$(function(){
    //DOMS
    var user = $('#developUser'),
        userId =$('#developUserID'),
        mainUserId = $('#maintainUserID'),
        mainUser = $('#maintainUser'),
        developTime = $('#developTime'),
        maintainTime = $('#maintainTime'),
        tel = $('.J_tel');


    var _start = {
        elem: '#developTime',
        format: 'YYYY-MM-DD hh:mm:ss',
        istime:true,
        event: 'focus',
        choose: function(datas){
            _end.min = datas;
            _end.start = datas;
        }
    };
    var _end = {
        elem: '#maintainTime',
        format: 'YYYY-MM-DD hh:mm:ss',
        event: 'focus',
        istime:true,
        choose: function(datas){
            _start.max = datas;
        }
    };

    laydate(_start);
    laydate(_end);

    tel.on('mouseover', function () {
        layer.tips('联系电话不能修改，如需修改，请前往CRM账户管理！',this);
    });

    function getBaseFilterParams(){
        var t = $(".edit ul li input").serialize();
        return t==undefined? '':t;
    }

    $('#submitBtn').on('click',function(){
        var ops = getBaseFilterParams();
        edit(ops);
    });

    function edit(ops){
        if(ops==undefined){
            return;
        }
        if($.trim(userId.val())==''){
            if($.trim(user.val())==''){
                layer.tips('请填写开发人',user,{tips: 1});
            }else{
                layer.tips('请使用提示的开发人名称，不能使用提示列表之外的信息',user,{tips: 1});
            }
            return;
        }
        if($.trim(mainUserId.val())==''){
            if($.trim(mainUser.val())==''){
                layer.tips('请填写维护人',mainUser,{tips: 1});
            }else{
                layer.tips('请使用提示的维护人名称，不能使用提示列表之外的信息',mainUser,{tips: 1});
            }
            return;
        }
        if($.trim(developTime.val())==''){
            layer.tips('请选择开发时间',developTime,{tips: 1});
            return;
        }
        if($.trim(maintainTime.val())==''){
            layer.tips('请选择维护时间',maintainTime,{tips: 1});
            return;
        }

        $.ajax({
            url:'/base/maintain/update',
            type:'POST',
            data:ops,
            errorMsg:'抱歉，信息更新失败',
            callback:function(){
                layer.alert('信息更新成功！', function () {
                    window.location.href = window.location.href;
                });
            }
        })
    }

    listenChange('developUser',loadAccount);
    listenChange('maintainUser',loadAccount);

    function listenChange(inputId,changeCallback){
        function callback(){
            changeCallback.call(this);
        }
        var element = document.getElementById(inputId);
        if("\v"=="v") {
            element.onpropertychange = callback;
        }else{
            element.addEventListener("input",callback,false);
        }
    }
    var $searchResults = $('#searchResults');
    var $searchResultsList = $('#searchResults ul');

    function loadAccount(){
        var self = $(this);
        self.prev('input').val('');
        var dev = self.attr('id')=='developUser'?1:0;
        var key = self.val();
        $.ajax({
            url:'/find/byKey',
            global:false,
            data:'key='+encodeURIComponent(key),
            callback:function(model){
                $searchResultsList.empty();
                if(model.length>0){
                    $.each(model,function(idx,data){
                        var li = document.createElement('li');
                        li = $(li).text(data.userName).data('data'+dev,data);
                        $searchResultsList.append(li);
                    });
                    $searchResults.css({
                        top:self.position().top+36
                    });
                    $searchResults.show();
                }
            }
        })
    }

    $searchResults.on('click','li',function(){
        var data = $(this).data('data1');
        var dev = 1;
        if(data==undefined){
            dev = 0;
            data = $(this).data('data0');
        }
        if(dev){
            $('#developUserID').val(data.userID);
            $('#developUser').val(data.userName);
            $('#developTel').val(data.mp);
        }else{
            $('#maintainUserID').val(data.userID);
            $('#maintainUser').val(data.userName);
            $('#maintainTel').val(data.mp);
        }
    });

    $(document).on('click',function(){
        $('#searchResults').hide();
    });

});
module.exports = devEdit;
