define(function(require,exports,module) {
	var Base = require('../../../base/index');
  var $ =Base.$;
  require('touch')($);
	var Nav = require('../../../nav/nav');
	var Iscroll = require('../../../gallery/iscroll/api');
  var Template = require('../../../gallery/template/main');
	var nav = new Nav({
    prev:{
      text:'<a href="../my.html"><i class="icon iconfont">&#xe61f;</i>我</a>'
    },
		title:'通讯录',
    op:{
      text:'<a href="add.html"><i class="icon iconfont">&#xe63b;</i></a>'
    }
	});
	nav.init();

  var Contact = require('../../../gallery/iscroll/list-api');

	$(function () {

   	var $J_result_list = $('#J_result_list'),
        $searchIn = $('#J_search_in'),
        isPublic = '0',
        cache = {};

    function getTemplate(){
      if(!cache['template']){
       cache['template'] = require('text!./list-item.tpl');
      }
      return cache['template'];
    }

    var contact = new Contact({
      loadDataContainer:$J_result_list,
      url:'/wx/phone/find/own/all',
      buildParam:function(){
        return '?key='+ $.trim($searchIn.val()) + '&size='+contact.size+'&current='+contact.current;
      },
      success:function(data){
        Base.state.check(data,function(model){
          if(model){
              if(!model.model) model.model=[];
              model.isPublic = isPublic;
              var render = Template.compile(getTemplate());
              contact.appendData(render(model));
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
      search:true,
      searchInId:'J_search_in',
      searchClose:'.search .icon2',
      searchCallback:function(){
        contact.settings.loadFirst = true;
        contact.loadData();
      },
      loadedCallback:function(){
        console.log('数据加载完了');
        iscroll.scroll && iscroll.scroll.refresh();
        Base.pageLoaded();
      },
      canDel:true,
      delCallback:function(){
        if(!confirm('您确定删除此联系人信息吗？')){
          return;
        }
        var _self = $(this).parents('li.item');
        $.ajax({
            url: '/wx/phone/del/userPhone',
            type: 'POST',
            data: 'contactID=' + _self.attr('data-id'),
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
        contact.refresh();
      },
      pullupAction:function(){
        var self = this;
        contact.loadNext(function(){
          self.refresh();
        });
      }
    });
    iscroll.initialize();

    contact.initialize();//加载第一页数据

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
