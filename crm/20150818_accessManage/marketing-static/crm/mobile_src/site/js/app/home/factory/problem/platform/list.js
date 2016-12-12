define(function(require,exports,module) {
    var Base = require('../../../../base/index');
    var $ = Base.$;
    var Nav = require('../../../../nav/nav');
    var Iscroll = require('../../../../gallery/iscroll/api');
  var Template = require('../../../../gallery/template/main');
  var Moment = require('../../../../gallery/moment/main');
  var Icon = require('../../../problem/icon');
    var nav = new Nav({
      prev:{
        id:'J_prev',
        text:'<i class="icon iconfont">&#xe61f;</i>返回'
      },
      title:'平台问题',
      op:{
        text:'<a href="add.html"><i class="icon iconfont">&#xe637;</i></a>'
      }
    });
    nav.init();

  var List = require('../../../../gallery/iscroll/list-api');

    $(function () {
    
    var $J_result_list = $('#J_result_list'),
        cache = {};

    function getTemplate(){
      if(!cache['template']){
       cache['template'] = require('text!./list-item.tpl');
      }
      return cache['template'];
    }

    var list = new List({
      loadDataContainer:$J_result_list,
      url:'/wx/visit/platFormList',
      buildParam:function(){
        return '?taskID='+ Base.data.get('curr_taskid')+'&size='+list.size+'&current='+list.current;
      },
      success:function(data){
        Base.state.check(data,function(model){
          if(model){
              if(!model) model=[];
              $.each(model,function(idx,mode){
                  mode.icon = Icon.get(mode.platTypeID);
                  mode.createDate = Moment(mode.createTime).format('YYYY-MM-DD');
              });
              var render = Template.compile(getTemplate());
              list.appendData(render(data));
              if(Base.mobileDevice){
                $('#wrapper').off(Base.events.click,'.item a').on(Base.events.click,'.item a',function(e){
                    location.href=$(this).attr('href');
                });
              }
          }
        });//Base.state end
        return data;
      },
      container:'#J_result_list',
      loadedCallback:function(){
        console.log('数据加载完了');
        iscroll.scroll && iscroll.scroll.refresh();
      },
      canDel:false
    });
    
    //实例化iscroll
    var iscroll = new Iscroll({
      id:'#wrapper',
      pulldownAction:function(){
        list.refresh();
      },
      pullupAction:function(){
        var self = this;
        list.nomore = true;
        list.loadNext(function(){
          self.refresh();
        });
      }
    });
    iscroll.initialize();

    list.initialize();//加载第一页数据

    $J_result_list.on(Base.events.over,'li.item',function(){
      $(this).css({
        background:'#ddd'
      });
    }).on(Base.events.out,'li.item',function(){
      $(this).css({
        background:'#fff'
      });
    });

    $('#J_prev').on('click', function () {
      var url = Base.data.get('curr_factory_url');
      if(url){
        location.href = url;
      }else{
        history.back();
      }
    });

    Base.pageLoaded();

  });

});