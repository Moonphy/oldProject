var eggsRuleEdit;
var common = require('common');
var $ = common.jquery;
var layer = require('layer');
var laydate = require('laydate');
var moment = require('moment');
var tpl = require('tpl');
var listtpl = require('./src/list-tpl');
var list = $('#list');

var id = $.utils.getqs('id');
if($.isEmpty(id)){
    $.keyNotFound();
    return;
}

function load(){
	$.ajax({
        url:'/hitEgg/find/user/list',
        data:'current=0&size=1000&orgId='+id,
        errorMsg:'抱歉，拉取数据失败！',
        callback: function (data) {
            list.empty();
            tpl(listtpl).render(data, function (render) {
                list.append(render.replace(/undefined/g,'').replace(/null/g,''));
            });
            var _start;
            list.find('.time').each(function (idx,time) {
                var self = $(time);
                var id = 'time'+idx;
                self.attr('id',id);
                if(idx%2==0){
                    _start = {
                        elem: '#'+id,
                        format: 'YYYY-MM-DD hh:mm:ss',
                        event: 'focus',
                        istime:true
                    };
                }else{
                    var _end = {
                        elem: '#'+id,
                        format: 'YYYY-MM-DD hh:mm:ss',
                        event: 'focus',
                        istime:true,
                        choose: function(datas){
                            _start.max = datas;
                            //$('#time'+(idx-1)).val(moment(datas).subtract(30,'days').format(dataformat)).removeClass('error');
                        }
                    };
                    _start.choose = function (datas) {
                        _end.min = datas;
                        _end.start = datas;
                        $('#'+id).val(moment(datas).add(30,'days').format(dataformat)).removeClass('error');
                    };
                    laydate(_start);
                    laydate(_end);
                    _start = {};
                }
            });
        }
    });
}
load();

var dataformat = 'YYYY-MM-DD HH:mm:ss';

$('#backbtn').on('click',function(){
    window.history.back();
});

$('#list').on('click','.savebtn',function(){
    var tr = $(this).parents('tr');
    var uid = tr.data('id');
    var ratio = tr.find('.ratio');
    var start = tr.find('.start');
    var end = tr.find('.end');
    var ruleLevel = tr.find('.ruleLevel');

    var max = parseInt(ratio.attr('max'));
    var min = parseInt(ratio.attr('min'));
    if($.isEmpty(id)){
        layer.tips('id丢失！不能提交，请刷新重试',tr);
        return;
    }
    if($.isEmpty(ratio.val())){
        layer.tips('不能为空',ratio);
        return;
    }
    if(isNaN(ratio.val())){
        layer.tips('请输入'+min+'至'+ratio.attr('max')+'的数字',ratio);
        return;
    }
    if(ratio.val()>max || ratio.val()<min){
        layer.tips('只能输入'+min+'至'+ratio.attr('max')+'之间的数字',ratio);
        return;
    }
    if($.isEmpty(start.val())){
        layer.tips('不能为空',start);
        return;
    }
    if($.isEmpty(end.val())){
        layer.tips('不能为空',end);
        return;
    }
    $.ajax({
        url:'/hitEgg/edit/user',
        type:'POST',
        data:{
            userId:uid,
            ratio:ratio.val(),
            startTime:start.val(),
            endTime:end.val(),
            ruleLevel:ruleLevel.val()
        },
        errorMsg:'抱歉，保存数据失败，请重试！',
        callback: function (data) {
            $.alert('已保存！','s',{
                end:function(){
                    load();
                }
            });
        }
    });
});

module.exports = eggsRuleEdit;
