define(function(require,exports,module) {
  var Base = require('../../base/index');
  var Datepicker = require('../../gallery/datepicker/api');
  var Moment = require('../../gallery/moment/main');
  var Iscroll = require('../../gallery/iscroll/api');
  var Template = require('../../gallery/template/main');
  var $ = Base.$;
  require('touch')($);
  var Nav = require('../../nav/nav');
  var Footer = require('../../footer/footer');

  var nav = new Nav({
    title:'任务',
    op:{
      text:'<a href="add.html"><i class="icon iconfont">&#xe637;</i></a>'
    }
  });
  var footer = new Footer;
  nav.init();
  footer.init();

  var List = require('../../gallery/iscroll/list-api');

  $(function(){

    Datepicker.init($);

    function getTemplate(){
      if(!cache['template']){
       cache['template'] = require('text!./list-item.tpl');
      }
      return cache['template'];
    }

    var $J_result_list = $('#J_result_list'),
        $J_search_in = $('#J_search_in'),
        $close = $('.icon2'),
        cache = {};

    $J_search_in.scroller('destroy').scroller({
      theme: 'sense-ui',
      lang: 'zh',
      preset: 'date',
      stepMinute: 5
    });

    var list = new List({
      loadDataContainer:$J_result_list,
      container:'#J_result_list',
      url:'/wx/task/find/list',
      buildParam:function(){
        return '?key='+ $.trim($J_search_in.val()) + '&size='+list.size+'&current='+list.current;
      },
      success:function(data){
        Base.state.check(data,function(model){
          if(model){
              if(!model.model) model.model=[];
              $.each(model.model,function(idx,mode){
                var date = Moment(mode.planTime);
                mode.time = date.format("HH:mm");
                mode.date = date.format("YYYY-MM-DD");
                mode.state = mode.state==3?'state done':mode.state==2?'state lost':'';
              });
              var render = Template.compile(getTemplate());
              list.appendData(render(model));
              if(Base.mobileDevice){
                $('#wrapper').off(Base.events.click,'.item a').on(Base.events.click,'.item a',function(e){
                    location.href=$(this).attr('href');
                });
              }
          }
        });//Base.state end
        return data.model;
      },
      container:'#J_result_list',
      search:false,
      loadedCallback:function(){
        console.log('数据加载完了');
        iscroll.scroll && iscroll.scroll.refresh();
        Base.pageLoaded();
      },
      canDel:true,
      delCallback:function(){
        var _self = $(this).parents('li.item');
        if(!confirm('删除任务时会删除该任务下的拜访信息以及相关的事故车信息，您确定删除吗？')){
          return;
        }
        $.ajax({
            url: '/wx/task/del/specifiTask',
            type: 'GET',
            data: 'taskID=' + _self.attr('data-id'),
            success: function (data) {
                Base.state.check(data, function () {
                    _self.remove();
                    iscroll.scroll && iscroll.scroll.refresh();
                });
            }
        });
      }
    });

    $J_search_in.on('change', function () {
        var val = $(this).val();
        list.settings.loadFirst = true;
        list.loadData();
        if(val){
            $close.show();
        }else{
            $close.hide();
        }
    });

    $close.on(Base.events.click,function(e){
        if(window._timeStamp && e.timeStamp - window._timeStamp<50){
          $J_search_in.val('');
          $J_search_in.trigger('change');
          $(this).hide();
        }else{
          window._timeStamp = e.timeStamp;
        }
    });


    //实例化iscroll
    var iscroll = new Iscroll({
      id:'#wrapper',
      pulldownAction:function(){
        list.refresh();
      },
      pullupAction:function(){
        var self = this;
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

    Base.pageLoaded();
  });
});
