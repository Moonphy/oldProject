define(function(require, exports, module) {
  var Base = require('../../base/index');
  var $ = Base.$;
  var Nav = require('../../nav/nav');
  var Iscroll = require('../../gallery/iscroll/api');
  var List = require('../../gallery/iscroll/list-api');
  var Template = require('../../gallery/template/main');
  var nav = new Nav({
    prev: {
      text: '<a href="index.html"><i class="icon iconfont">&#xe61f;</i>统计</a>'
    },
    title: '地区业绩',
    op: {
      text: '<a href="search.html">搜索</a>'
    }
  });
  nav.init();

  $(function() {
    var $J_result_list = $('#J_result_list'),
      cache = {};

    function getTemplate() {
      if (!cache['template']) {
        cache['template'] = require('text!./area-list-item.tpl');
      }
      return cache['template'];
    }

    var list = new List({
      loadDataContainer: $J_result_list,
      container: '#J_result_list',
      url: '/wx/orderStatistics/find/statisticsGroupCity',
      buildParam: function() {
        var tmp = '';
        if(document.referrer.indexOf('search.html')!=-1){//从搜索页面过来的才执行带参数查询
          var params = Base.data.get('query_params_obj');
          if(params.provinceID){
            tmp+='&provinceID='+params.provinceID;
          }
          if(params.cityID){
            tmp+='&cityID='+params.cityID;
          }
          if(params.areaID){
            tmp+='&areaID='+params.areaID;
          }
          if(params.date){
            tmp+='&selectDate='+params.date;
          }
        }else{
          Base.data.set('query_params_obj',undefined);
        }
        return '?size=' + list.size + '&current=' + list.current + tmp;
      },
      success: function(data) {
        Base.state.check(data, function(model) {
          if (!model.model) model.model = [];
          var render = Template.compile(getTemplate());
          list.appendData(render(model));
          $('#wrapper').off(Base.events.click, '#scroller li.item').on(Base.events.click, '#scroller li.item', function(e) {
            location.href = $(this).attr('data-href');
          });
          Base.pageLoaded();
        }); //Base.state end
        return data.model;
      },
      search: false,
      loadedCallback: function() {
        console.log('数据加载完了');
        iscroll.scroll && iscroll.scroll.refresh();
        Base.pageLoaded();
      },
      canDel: false
    });

    //实例化iscroll
    var iscroll = new Iscroll({
      id: '#wrapper',
      pulldownAction: function() {
        list.refresh();
      },
      pullupAction: function() {
        var self = this;
        list.loadNext(function() {
          self.refresh();
        });
      }
    });
    iscroll.initialize();
    list.initialize(); //加载第一页数据

     $J_result_list.on(Base.events.over,'li.item',function(){
      $(this).css({
        background:'#ddd'
      });
    }).on(Base.events.out,'li.item',function(){
      $(this).css({
        background:'#fff'
      });
    });

  });

});
