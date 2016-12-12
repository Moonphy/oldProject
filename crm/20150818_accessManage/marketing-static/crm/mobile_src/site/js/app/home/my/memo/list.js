define(function(require,exports,module) {
  var Base = require('../../../base/index');
  var Datepicker = require('../../../gallery/datepicker/api');
  var Moment = require('../../../gallery/moment/main');
  var Iscroll = require('../../../gallery/iscroll/api');
  var Template = require('../../../gallery/template/main');
  var $ = Base.$;
  require('touch')($);
  var Nav = require('../../../nav/nav');

  var nav = new Nav({
    prev:{
      text:'<a href="../my.html"><i class="icon iconfont">&#xe61f;</i>我</a>'
    },
    title:'备忘录',
    op:{
      text:'<a href="add.html"><i class="icon iconfont">&#xe637;</i></a>'
    }
  });
  nav.init();

  var Memo = require('../../../gallery/iscroll/list-api');

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

    var memo = new Memo({
      loadDataContainer:$J_result_list,
      container:'#J_result_list',
      url:'/wx/memorandum/find/memorandumList',
      buildParam:function(){
        return '?key='+ $.trim($J_search_in.val()) + '&size='+memo.size+'&current='+memo.current;
      },
      success:function(data){
        Base.state.check(data,function(model){
          if(model){
              if(!model.model) model.model=[];
              $.each(model.model,function(idx,mode){
                mode.time = Moment(mode.planTime).format('HH:mm');
                mode.date = Moment(mode.planTime).format('YYYY-MM-DD');
              });
              var render = Template.compile(getTemplate());
              memo.appendData(render(model));
              if(Base.mobileDevice){
                $('#wrapper').off(Base.events.click,'.item a').on(Base.events.click,'.item a',function(e){
                    location.href=$(this).attr('href');
                });
              }
          }
        });//Base.state end
        return data.model;
      },
      loadedCallback:function(){
        console.log('数据加载完了');
        iscroll.scroll && iscroll.scroll.refresh();
        Base.pageLoaded();
      },
      canDel:true,
      delCallback:function(){
        var _self = $(this).parents('li.item');
        $.ajax({
            url: '/wx/memorandum/del',
            type: 'POST',
            data: 'noteID=' + _self.attr('data-id'),
            success: function (data) {
                Base.state.check(data, function () {
                    _self.remove();
                });
            }
        });
      }
    });

    $J_search_in.scroller('destroy').scroller({
        preset: 'date',
        stepMinute: 5,
        theme: 'sense-ui',
        lang: 'zh'
    });

    $J_search_in.on('change',function(){
        memo.settings.loadFirst = true;
        memo.loadData.call(memo);
        if($(this).val()){
            $close.show();
        }else{
            $close.hide();
        }
    });

    $close.on(Base.events.click, function (e) {
        if(window._timeStamp && e.timeStamp - window._timeStamp<50){
          $J_search_in.val('').trigger('change');
        }else{
          window._timeStamp = e.timeStamp;
        }
    });

    //实例化iscroll
    var iscroll = new Iscroll({
      id:'#wrapper',
      pulldownAction:function(){
        memo.refresh();
      },
      pullupAction:function(){
        var self = this;
        memo.loadNext(function(){
          self.refresh();
        });
      }
    });
    iscroll.initialize();

    memo.initialize();//加载第一页数据

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
