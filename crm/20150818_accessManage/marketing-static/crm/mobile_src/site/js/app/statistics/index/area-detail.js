define(function(require, exports, module) {
  var Base = require('../../base/index');
  var $ = Base.$;
  var Nav = require('../../nav/nav');
  var Iscroll = require('../../gallery/iscroll/api');
  var List = require('../../gallery/iscroll/list-api');
  var Template = require('../../gallery/template/main');
  var nav = new Nav({
    prev: {
      id:'J_prev',
      text: '<i class="icon iconfont">&#xe61f;</i>地区'
    },
    title: '业绩明细'
  });
  nav.init();

  $(function() {
    var $J_result_list = $('#J_result_list'),
      cache = {};

    function getTemplate() {
      if (!cache['template']) {
        cache['template'] = require('text!./area-detail-item.tpl');
      }
      return cache['template'];
    }

    var list = new List({
      loadDataContainer: $J_result_list,
      container: '#J_result_list',
      url: '/wx/orderStatistics/find/statisticsByCityID',
      buildParam: function() {
        var tmp = '';
        var params = Base.data.get('query_params_obj');
        var obj = Base.utils.mapQuery(location.search);
        if(obj.id || params.cityID){
          tmp+='&cityID='+obj.id || params.cityID;
        }
        if(params.date){
          tmp+='&selectDate='+params.date;
        }
        return '?size=' + list.size + '&current=' + list.current + tmp;
      },
      success: function(data) {
        Base.state.check(data, function(model) {
          if (!model.model) model.model = [];
          $.each(model.model,function(idx,mode){
            var tmp = mode.mfctyName;
            var len = tmp.length;
            if(tmp && len>0){
              if(len>10){
                mode._mfctyName = tmp.slice(0,10);
              }else{
                mode._mfctyName = tmp;
              }
            }
          });
          var render = Template.compile(getTemplate());
          list.appendData(render(model));
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

    $('#J_prev').on(Base.events.click,function(){
      history.back();
    });

    Base.pageLoaded();

  });

});
