define(function(require,exports,module) {
	var Base = require('../../base/index');
	var $ = Base.$;
	require('touch')($);
  var Nav = require('../../nav/nav');
  var Footer = require('../../footer/footer');
  var Iscroll = require('../../gallery/iscroll/api');
  var Template = require('../../gallery/template/main');
  var Moment = require('../../gallery/moment/main');

	var nav = new Nav({
		title:'拜访'
	});
	var footer = new Footer;
	
	nav.init();
	footer.init();

  var List = require('../../gallery/iscroll/list-api');

	$(function () {

    var $J_result_list = $('#J_result_list'),
      $J_search_in = $('#J_search_in'),
      $close = $('.icon2'),
      cache = {};

    function getTemplate(){
      if(!cache['template']){
       cache['template'] = require('text!./list-item.tpl');
      }
      return cache['template'];
    }

    var list = new List({
      loadDataContainer:$J_result_list,
      url:'/wx/task/find/mfctyNamelist',
      buildParam:function(){
        return '?key='+ $.trim($J_search_in.val())+'&size='+list.size+'&current='+list.current;
      },
      success:function(data){
        Base.state.check(data,function(model){
          if(model){
              if(!model.model){ model.model=[];}
              else{
                $.each(model.model,function(idx,mode){
                  var date = Moment(mode.planTime);
                  var name = mode.mfctyName;
                  mode.time = date.format("HH:mm");
                  mode.date = date.format("YYYY-MM-DD");
                  mode._mfctyName = name && name.length>8? name.slice(0,8):name;
                });
              }
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
      search:true,
      searchInId:'J_search_in',//搜索框
      searchClose:'.icon2',//关闭按钮
      searchCallback:function(){//搜索回调
        list.settings.loadFirst = true;
        list.loadData();
      },
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

   	var $J_accidentcar_remind = $('#J_accidentcar_remind');
    $.ajax({
        url:'/wx/accidentCarsRemain/remain',
        success: function (data) {
            Base.state.check(data, function (model) {
                if(model==1){
                    $J_accidentcar_remind.find('.my_icon')
                    .attr('class','my_icon clock2');
                }
            });
        }
    });

    $('.content .item').on(Base.events.over,function(e){
      $(this).addClass('active');
    }).on(Base.events.out,function(e){
      $(this).removeClass('active');
    });
    Base.pageLoaded();
  });

});
