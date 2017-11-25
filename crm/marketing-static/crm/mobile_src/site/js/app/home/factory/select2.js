define(function(require,exports,module) {
  var Base = require('../../base/index');
  var Datepicker = require('../../gallery/datepicker/api');
  var Moment = require('../../gallery/moment/main');
  var Iscroll = require('../../gallery/iscroll/api');
  var Template = require('../../gallery/template/main');
  var $ = Base.$;
  var Nav = require('../../nav/nav');

  var nav = new Nav({
    title:'选择汽修厂',
    prev:{
      text:'<a href="../task/add.html"><i class="icon iconfont">&#xe61f;</i>新增任务</a>'
    }
  });
  nav.init();

  var List = require('../../gallery/iscroll/list-api');

  $(function(){

    Datepicker.init($);

    function getTemplate(){
      if(!cache['template']){
       cache['template'] = require('text!./select-list-item.tpl');
      }
      return cache['template'];
    }


    var $Nav = $('#J_nav'),
        triggers = $('.J_trigger');

    $Nav.on(Base.events.click,'.J_trigger',function(){
        var _self = $(this);
        if(!_self.hasClass('J_t1')){
          location.href='select.html';
        }
        triggers.removeClass('active');
        _self.addClass('active');
    });

    var $J_result_list = $('#J_result_list'),
      $J_search_in = $('#J_search_in'),
      $close = $('.icon2'),
      cache = {};

    var list1 = new List({
      loadDataContainer:$J_result_list,
      container:'#J_result_list',
      url:'/wx/task/search/mainMfcty',
      buildParam:function(){
        return '?key='+ $.trim($J_search_in.val()) + '&size='+list1.size+'&current='+list1.current;
      },
      success:function(data){
        Base.state.check(data,function(model){
          if(model){
              if(!model.model) model.model=[];
              $.each(model.model,function(idx,mode){
                mode.taskId = '';
                mode.factoryName = mode.mfctyName;
                mode.custID = mode.id;
                mode.id = mode.mfctyID;
              });
              var render = Template.compile(getTemplate());
              list1.appendData(render(model));
              if(Base.mobileDevice){
                $('#wrapper').off(Base.events.click,'.item a').on(Base.events.click,'.item a',function(e){
                    location.href=$(this).attr('href');
                });
              }
          }
        });//Base.state end
        return data.model;
      },
      search:true,
      searchInId:'J_search_in',
      searchClose:'.search .icon2',
      searchCallback:function(){
        list1.settings.loadFirst = true;
        list1.loadData();
      },
      loadedCallback:function(){
        console.log('数据加载完了');
        iscroll1.scroll && iscroll1.scroll.refresh();
      },
      canDel:false
    });

    //实例化iscroll
    var iscroll1 = new Iscroll({
      id:'#wrapper',
      pulldownAction:function(){
        list1.refresh();
      },
      pullupAction:function(){
        var self = this;
        list1.loadNext(function(){
          self.refresh();
        });
      }
    });
    iscroll1.initialize();
    list1.initialize();//加载第一页数据

    $('#scroller').on(Base.events.over,'li.item',function(){
      $(this).css({
        background:'#ddd'
      });
    }).on(Base.events.out,'li.item',function(){
      $(this).css({
        background:'#fff'
      });
    });
    Base.data.set('curr_factory_ismain',true);
    Base.pageLoaded();
  });
});
