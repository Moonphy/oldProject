define(function(require,exports,module) {
	var Base = require('../../../base/index');
	var $ = Base.$;
	var Nav = require('../../../nav/nav');
	var Iscroll = require('../../../gallery/iscroll/api');
  var Template = require('../../../gallery/template/main');
  var Moment = require('../../../gallery/moment/main');
	var nav = new Nav({
    prev:{
      text:'<a href="../my.html"><i class="icon iconfont">&#xe61f;</i>我</a>'
    },
		title:'问题与建议',
    op:{
      text:'<a href="add.html"><i class="icon iconfont">&#xe637;</i></a>'
    }
	});
	nav.init();

  var List = require('../../../gallery/iscroll/list-api');

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
      url:'/wx/marketFeedBack/find/marketFeedBackList',
      buildParam:function(){
        return '?size='+list.size+'&current='+list.current;
      },
      success:function(data){
        Base.state.check(data,function(model){
          if(model){
              if(!model.model) model.model=[];
              $.each(model.model,function(idx,model){
                model.createDate = Moment(model.createTime).format('YYYY-MM-DD');
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
      loadedCallback:function(){
        console.log('数据加载完了');
        iscroll.scroll && iscroll.scroll.refresh();
      },
      canDel:true,
      delCallback:function(){
        var _self = $(this).parents('li.item');
        $.ajax({
            url: '/wx/marketFeedBack/del',
            type: 'POST',
            data: 'feedBackID=' + _self.attr('data-id'),
            success: function (data) {
                Base.state.check(data, function () {
                    _self.remove();
                });
            }
        });
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