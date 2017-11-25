define(function(require, exports, module) {
  var Base = require('../../base/index');
  var $ = Base.$;
  var Nav = require('../../nav/nav');
  var Datepicker = require('../../gallery/datepicker/api');
  var LoadArea = require('../../home/area/load');
  var nav = new Nav({
    prev: {
      text: '<a href="index.html"><i class="icon iconfont">&#xe61f;</i>指标</a>'
    },
    title: '统计',
    op: {
      text: '<a href="all.html">客户汇总<i class="icon iconfont">&#xe61e;</i></a>'
    }
  });
  nav.init();
  $(function() {

    Datepicker.init($);

    var J_date_start = $('#J_date_start'),
      J_date_end = $('#J_date_end'),
      J_sheng = $('#J_sheng'),
      J_sheng_id = $('#J_sheng').find('.value').find('span'),
      J_shi = $('#J_shi'),
      J_shi_id = $('#J_shi').find('.value').find('span');
      J_qu = $('#J_qu'),
      J_qu_id = $('#J_qu_id');

    var dds = $('#dds'),
      ddje = $('#ddje'),
      jhs = $('#jhs'),
      tds = $('#tds'),
      tdje = $('#tdje'),
      zcs = $('#zcs'),
      jhs = $('#jhs'),
      hys = $('#hys'),
      jykhlcl = $('#jykhlcl'),
      J_params_pannel = $('#J_params_pannel'),
      trigger = $('#trigger');

    J_date_start.scroller('destroy').scroller({
      theme: 'sense-ui',
      lang: 'zh',
      preset: 'date',
      stepMinute: 5
    });
    J_date_end.scroller('destroy').scroller({
      theme: 'sense-ui',
      lang: 'zh',
      preset: 'date',
      stepMinute: 5
    });

    $('#close').on(Base.events.click, function() {
      J_params_pannel.toggle();
    });
    trigger.on(Base.events.click, function() {
      J_params_pannel.toggle();
    });
    $('#clearTime').on(Base.events.click, function() {
      J_date_start.val('');
      J_date_end.val('');
    });

    $('#clearArea').on(Base.events.click, function() {
      J_sheng_id.text('请选择').data('id', '');
      J_shi_id.text('请选择').data('id', '');
      J_qu_id.text('请选择').data('id', '');
    });

    function load() {
      var tmp = 'areaID='+(J_qu_id.data('id') || '') +'&cityID='+(J_shi_id.data('id') || '')+'&provinceID='+(J_sheng_id.data('id') || '')+'&start='+J_date_start.val()+'&end='+J_date_end.val();
      $.ajax({
        url: '/wx/orderStatistics/find/orderAndReturn',
        data:tmp,
        success: function(data) {
          Base.state.check(data, function(model) {
            dds.text(model.statisticsOrderEntity.orderNum);
            ddje.text(model.statisticsOrderEntity.totalOrder);
            tds.text(model.statisticsReturnEntity.totalChargebackNum);
            tdje.text(model.statisticsReturnEntity.totalChargeback);

            zcs.text(model.statisticsOrderEntity.dateRangeRegisterNum);
            jhs.text(model.statisticsOrderEntity.sensitizeNum);
            hys.text(model.statisticsOrderEntity.activateNum);
            jykhlcl.text(model.statisticsOrderEntity.tradeStayRatio);

            Base.pageLoaded();
          });
        }
      });
    }

    load();

    $('#submit').on(Base.events.click,function(){
      J_params_pannel.hide();
      load();
    });
    
    LoadArea({}, $, Base);

  });
});
