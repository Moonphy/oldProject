define(function(require, exports, module) {
  var Base = require('../../base/index');
  var $ = Base.$;
  var Nav = require('../../nav/nav');
  var Datepicker = require('../../gallery/datepicker/api');
  var LoadArea = require('../../home/area/load');
  var nav = new Nav({
    prev: {
      id: 'J_prev',
      text: '<i class="icon iconfont">&#xe61f;</i>地区业绩'
    },
    title: '搜索'
  });
  nav.init();

  $(function() {
    Datepicker.init($);
    LoadArea({}, $, Base);

    var J_date = $('#J_date'),
    J_sheng = $('#J_sheng'),
    J_sheng_id = $('#J_sheng').find('.value').find('span'),
    J_shi = $('#J_shi'),
    J_shi_id = $('#J_shi').find('.value').find('span');
    J_qu = $('#J_qu'),
    J_qu_id = $('#J_qu_id');

    J_date.scroller('destroy').scroller({
      theme: 'sense-ui',
      lang: 'zh',
      preset: 'date',
      stepMinute: 5
    });

    $('#J_prev').on(Base.events.click, function() {
      history.back();
    });

    $('#clearTime').on(Base.events.click,function(){
      J_date.val('');
    });

    $('#clearArea').on(Base.events.click,function(){
      J_sheng_id.text('请选择').data('id',undefined);
      J_shi_id.text('请选择').data('id',undefined);
      J_qu_id.text('请选择').data('id',undefined);
    });

    $('#submit').on(Base.events.click,function(){
      var obj = {
        date:J_date.val(),
        cityID:J_shi_id.data('id'),
        cityName:J_shi_id.text(),
        areaID:J_qu_id.data('id'),
        areaName:J_qu_id.text(),
        provinceID:J_sheng_id.data('id'),
        provinceName:J_sheng_id.text()
      };
      Base.data.set('query_params_obj',obj);
      location.href="area.html";
    });

    //初始化
    var params = Base.data.get('query_params_obj');
    if(params.provinceID){
      J_sheng_id.data('id',params.provinceID);
      J_sheng_id.text(params.provinceName);
    }
    if(params.cityID){
      J_shi_id.data('id',params.cityID);
      J_shi_id.text(params.cityName);
    }
    if(params.areaID){
      J_qu_id.data('id',params.areaID);
      J_qu_id.text(params.areaName);
    }
    if(params.date){
      J_date.val(params.date);
    } 
    
    $('#buttons').on(Base.events.over,'button',function(){
      $(this).addClass('active');
    }).on(Base.events.out,'button',function(){
      $(this).removeClass('active');
    });

    Base.pageLoaded();

  });

});
