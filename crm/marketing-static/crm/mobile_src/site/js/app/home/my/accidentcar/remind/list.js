define(function(require, exports, module) {
  var Base = require('../../../../base/index');
  var $ = Base.$;
  var Datepicker = require('../../../../gallery/datepicker/api');
  var Nav = require('../../../../nav/nav');
  var Template = require('../../../../gallery/template/main');
  var prevHtml = '<a href="../../my.html"><i class="icon iconfont">&#xe61f;</i>我</a>';
  var nav = new Nav({
    prev: {
      id: 'J_prev',
      text: prevHtml
    },
    title: '事故车提醒',
    op: {
      id: 'J_more',
      text: '更多'
    }
  });
  nav.init();

  $(function() {
    Datepicker.init($);
    $title = $('#navbar').find('.title'),
      $J_search = $('#J_search'),
      $closeIcon = $('.search .icon2'),
      $J_prev_text = prevHtml,
      $J_list = $('#J_list'),
      $J_more = $('#J_more'),
      $J_prev = $('#J_prev'),
      $J_search_in = $('#J_search_in'),
      $car = $('.car'),
      cache = {};

    function getTemplate() {
      if (!cache['template']) {
        cache['template'] = require('text!./list-item.tpl');
      }
      return cache['template'];
    };

    var load = function(key) {
      if (key == undefined) key = '';
      $.ajax({
        url: '/wx/accidentCarsRemain/find/RemainList',
        data: 'key=' + key + '&size=1000',
        success: function(data) {
          Base.state.check(data, function(model) {
            if (!model.model) model.model = [];
            //template render
            var render = Template.compile(getTemplate());
            $J_list.html(render(model));
          });
        }
      });
    }

    load();

    $J_more.on(Base.events.click, function() {
      var _self = $(this);
      $J_search.show();
      _self.hide();
      $title.text('事故车历史');
      $J_prev.html('<i class="icon iconfont">&#xe61f;</i>返回').off(Base.events.click).on(Base.events.click, function() {
        $(this).html($J_prev_text);
        $J_search.hide();
        _self.show();
        $title.text('事故车提醒');
      });
    });

    $J_list.on(Base.events.click, '.car', function(e) {
      changeState(this);
    });

    var changeState = function($car) {
      $car = $($car);
      var id = $car.attr('data-id');
      var state = $car.find('.remind-icon');
      if (!id || id == undefined || id == '') return;
      if (state.hasClass('active') && window.confirm('确定将该条事故车提醒状态更改为已读吗？')) {
        $.ajax({
          url: '/wx/accidentCarsRemain/read',
          data: 'accidentCarID=' + id,
          success: function(data) {
            Base.state.check(data, function() {
              $car.find('.remind-icon').removeClass('active').addClass('complete');
            });
          }
        });
      }
    }

    $J_search_in.scroller('destroy').scroller({
      preset: 'date',
      stepMinute: 5,
      theme: 'sense-ui',
      lang: 'zh'
    });

    $J_search_in.on('change', function() {
      var val = $(this).val();
      load(val);
      if (val) {
        $closeIcon.show();
      } else {
        $closeIcon.hide();
      }
    });

    $closeIcon.on(Base.events.click, function() {
      $J_search_in.val('');
      $J_search_in.trigger('change');
      $(this).hide();
    });

    Base.pageLoaded();

  });

});
