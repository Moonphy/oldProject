var couponList;
var common = require('common');
var $ = common.jquery;
var layer = require('layer');
var laydate = require('laydate');
var tpl = require('tpl');
var moment = require('moment');
var listtpl = require('./src/list-tpl');
var list = $('#list');

var id = $.utils.getqs('id');
if($.isEmpty(id)){
    $.keyNotFound();
    return;
}

var dataformat = 'YYYY-MM-DD HH:mm:ss';
var keys = ['mfctyName','orgID','contactPerson','address','contactMobile','auditTime'];

query();
function query(){
    $.ajax({
        url:'/coupon/find/specif',
        data:'orgID='+encodeURIComponent(id),
        errorMsg:'抱歉，拉取数据失败！',
        callback: function (data) {
            //汽修厂基础信息
            keys.forEach(function(key){
              document.querySelector('#'+key).innerHTML = data[key];
            });
            //清空优惠券信息
            list.empty();
            //优惠券信息
            tpl(listtpl).render(data, function (render) {
                list.append(render.replace(/undefined/g,'').replace(/null/g,''));
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
                                //$('#time'+(idx-1)).val(moment(datas).subtract(60,'days').format(dataformat)).removeClass('error');
                            }
                        };
                        _start.choose = function (datas) {
                            _end.min = datas;
                            _end.start = datas;
                            $('#'+id).val(moment(datas).add(60,'days').format(dataformat)).removeClass('error');
                        };
                        laydate(_start);
                        laydate(_end);
                        _start = {};
                    }
                });
            });
        }
    });
}


var resetBtn = $('#resetBtn');
var submitBtn = $('#submitBtn');

resetBtn.on('click', function () {
  var unuseds = list.find('input.unused');
  if(unuseds.length<=0){
    $.alert('优惠券信息已经重置，不需要再次重置。','w');
    return;
  }
  var arr = [];
  $.each(unuseds,function(idx,unused){
    unused = $(unused);
    if(parseInt(unused.data('old'))>0){
      arr.push('flag');//纯属给arr增加长度，无其他意义
    }
  });
  if(arr.length>0 || unuseds.length<list.find('tr').length){
    $.alert('此用户存在未使用的优惠券，不能重置优惠券信息。','w');
    return;
  }
    // $('.unused').each(function (idx,input) {
    //     input = $(input);
    //     input.val(input.data('reset'));
    // });
    // var startMo = moment();
    // var start = startMo.format(dataformat);
    // var endMo = startMo.add(60,'days');
    // var end = endMo.format(dataformat);
    // list.find('.time').each(function (idx,time) {
    //     var self = $(time);
    //     if(idx%2==0) {
    //         self.val(start);
    //     }else{
    //         self.val(end);
    //     }
    // });
  layer.confirm('你确定要重置此汽修厂的所有优惠券信息吗？',{icon: 3, title:'提示'},function(){
    $.ajax({
        url:'/coupon/edit/resetCoupon',
        data:'orgID='+encodeURIComponent(id),
        errorMsg:'抱歉，重置失败！',
        callback: function () {
            $.alert('已完成重置！','s',{
              end:function(){
                query();
              }
            });
        }
    });
  });

});


list.on('blur','input',function(){
  var self = $(this);
  var tr = self.parents('tr');
  var input = $(tr.find('.unused')).val();
  if(input==0)return;
  setTimeout(function(){
    if($.isEmpty(self.val())){
      layer.tips('不能为空',self);
      self.addClass('error');
    }else{
      self.removeClass('error');
    }
  },500);
});

list.on('change','input.unused',function(){
  var self = $(this);
  if(parseInt(self.data('old'))===0){
    var tr = self.parents('tr');
    var times = tr.find('.time');
    $.each(times,function(idx,time){
      if(parseInt(self.val())!=0){
        if($.isEmpty($(time).val())){
          $(time).addClass('error');
        }
      }else{
        $(time).removeClass('error').val('');
      }

    });
  }
});

submitBtn.on('click',function(){
  var unuseds = list.find('input.unused');
  if(unuseds.length<=0){
    $.alert('没有信息需要保存。','w');
    return;
  }

  var errors = list.find('input.error');
  if(errors.length>0){
    layer.tips('不能为空',errors[0]);
    return;
  }
  var trs = list.find('tr');
  var arr = [];
  $.each(trs,function(idx,tr){
    var obj = {};
    var tds = $(tr).find('td');
    $.each(tds,function(jdx,td){
      td = $(td);
      var cls = td.attr('class');
      if(cls!==undefined){
        var input = td.find('input');
        if(input.length==1){
          var val = input[0].value;
          obj[cls] = val;
        }else{
          obj[cls] = td.text();
        }
      }
    });
    arr.push(obj);
  });
  if(arr.length<=0) return;
  $.ajax({
      url:'/coupon/edit/coupon',
      type:'POST',
      data:'orgID='+encodeURIComponent(id)+'&totoalCoupons='+JSON.stringify(arr),
      errorMsg:'抱歉，修改失败！',
      callback: function () {
          $.alert('已完成修改！','s',{
            end:function(){
              query();
            }
          });
      }
  });
});

list.on('blur','.unused', function () {
    var self = $(this);
    var val = parseInt(self.val());
    var min = parseInt(self.attr('min'));
    var max = parseInt(self.attr('max'));
    if(!/\d/.test(val) || val>max || val<min){
        layer.tips('只能输入'+min+'到'+max+'之间的数字',self);
        self.val(min).trigger('change');//触发change事件以更新时间选择的提示状态
        return;
    }
});


module.exports = couponList;
