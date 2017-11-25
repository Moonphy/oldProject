var vip100Edit;
var common = require('common');
var $ = common.jquery;
var layer = require('layer');
var laydate = require('laydate');
var moment = require('moment');

var id = $.utils.getqs("id");
if($.isEmpty(id)){
    $.keyNotFound();
    return;
}


var startTime = $('#startTime');
var endTime = $('#endTime');
var submitBtn = $('#submitBtn');
var deleteBtn = $('#deleteBtn');
var setVipBtn = $('#setVipBtn');
var isVip = $('#isVip');

var _start = {
    elem: '#startTime',
    format: 'YYYY-MM-DD hh:mm:ss',
    istime:true,
    event: 'focus',
    choose: function(datas){
        _end.min = datas;
        _end.start = datas;
    }
};
var _end = {
    elem: '#endTime',
    format: 'YYYY-MM-DD hh:mm:ss',
    event: 'focus',
    istime:true,
    choose: function(datas){
        _start.max = datas;
    }
};

laydate(_start);
laydate(_end);

initalize();

var keys = ['mfctyName','orgID','contactPerson','address','contactMobile','auditTime','isVip','startTime','endTime'];

function initalize(){
    $.ajax({
        url:'/vip/find/specif',
        data:'orgID='+id,
        callback: function (model) {
            keys.forEach(function (key) {
                if(key=='isVip'){
                    var vip = model[key]
                    $('#'+key).text(vip?'是':'否');
                }else if(key.indexOf('Time')!=-1){
                    var end = model[key];
                    if(key=='endTime'){
                        update(end);
                    }
                    $('#'+key).val(end);
                }else{
                    $('#'+key).text(model[key]);
                }

            });
        }
    });
}

submitBtn.on('click', function () {
    var start = startTime.val();
    var end = endTime.val();
    if($.isEmpty(start)){
        layer.tips('生效时间不能为空',startTime);
        return;
    }
    if($.isEmpty(end)){
        layer.tips('结束时间不能为空',endTime);
        return;
    }
    if(moment(end).diff(moment(start))<=0){
        layer.tips('结束时间不能小于或等于开始时间',endTime);
        return;
    }
    $.ajax({
        url:'/vip/edit/specif',
        type:'POST',
        data:'orgID='+id+'&startTime='+encodeURIComponent(start)+'&endTime='+encodeURIComponent(end),
        callback: function (model) {
            $.alert('修改成功！','s');
            update(end);
        }
    });
});

deleteBtn.on('click', function () {
    layer.confirm('是否确认删除VIP用户？',{icon: 3, title:'提示'},function(index){
        $.ajax({
            url:'/vip/del/specif',
            data:'orgID='+encodeURIComponent(id),
            errorMsg:'抱歉，删除失败！',
            callback: function () {
                $.alert('删除成功！','s');
                startTime.val('');
                endTime.val('');
                isVip.text('否');
                deleteBtn.hide('fade');
                submitBtn.hide('fade');
                setVipBtn.show('fade');
            }
        });
    });
});

setVipBtn.on('click', function () {
    var start = startTime.val();
    var end = endTime.val();
    if($.isEmpty(start)){
        layer.tips('生效时间不能为空',startTime);
        return;
    }
    if($.isEmpty(end)){
        layer.tips('结束时间不能为空',endTime);
        return;
    }
    layer.confirm('是否确认设置为VIP用户？',{icon: 3, title:'提示'},function(index){
        $.ajax({
            url:'/vip/set',
            type:'POST',
            data:'orgID='+id+'&startTime='+encodeURIComponent(start)+'&endTime='+encodeURIComponent(end),
            errorMsg:'抱歉，设置失败！',
            callback: function () {
                $.alert('设置成功！','s');
                update(end);
            }
        });
    });
});

function update(time){
    //如果是数字，说明是比现在还早（过期了），如果是NaN，说明比现在还晚（生效）
    var jx = moment(time).diff(moment());
    var isNumber = jx<=0;
    if(!time || isNumber){//没有时间，或者 是数字
        isVip.text(isNumber?'是(已过期)':'否');
        if(time){
            submitBtn.show();
            setVipBtn.hide();
            deleteBtn.show();
        }else{//非vip
            setVipBtn.show();
            submitBtn.hide();
            deleteBtn.hide();
        }
    }else{
        isVip.text('是(未过期)');
        submitBtn.show();
        deleteBtn.show();
        setVipBtn.hide();
    }
}


module.exports = vip100Edit;
