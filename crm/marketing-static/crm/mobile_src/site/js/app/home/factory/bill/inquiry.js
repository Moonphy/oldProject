define(function(require,exports,module) {
	var Base = require('../../../base/index');
	var $ = Base.$;
	var Nav = require('../../../nav/nav');
	var Iscroll = require('../../../gallery/iscroll/api');
  var Template = require('../../../gallery/template/main');
  var Moment = require('../../../gallery/moment/main');
  var Datepicker = require('../../../gallery/datepicker/api');
  var LoadArea = require('../../area/load');
  var BillStatus = require('../../bill/state');
	var nav = new Nav({
    prev:{
      id:'J_prev',
      text:'<i class="icon iconfont">&#xe61f;</i>返回'
    },
		title:'查看询价及订单'
	});
	nav.init();

  var List = require('../../../gallery/iscroll/list-api');

	$(function () {
    Datepicker.init($);
   	var custId =Base.data.get('curr_id');
    var queryStr = custId?('&custID='+custId):('');

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

    var list = new List({
      loadDataContainer:$J_result_list,
      container:'#J_result_list',
      url:'/wx/billOfDocument/find/inquirySheetList',
      buildParam:function(){
        var tmp = queryStr;
        if(!custId){
            tmp+='&provinceID='+ ($('#J_sheng').find('.value').find('span').attr('data-id') || '')
            +'&cityID='+ ($('#J_shi').find('.value').find('span').attr('data-id') || '');
        }
        return '?queryTime='+ $.trim($J_search_in.val()) + tmp + '&size='+list.size+'&current='+list.current;
      },
      success:function(data){
        Base.state.check(data,function(model){
          if(model){
              if(!model.model) model.model=[];
              $.each(model.model,function(idx,mode){
                if(!custId) {
                  //0(保存)、1(已提交或发布)、2(已审核)、3(审核失败)、4(配货中)、5(取消订单)、6(交易成功)、7(交易失败（拒收等）)
                  var len = (mode.mfctyName + "").length;
                  mode.shotMfctyName = len > 10 ? (mode.mfctyName + "").slice(0, 10) : mode.mfctyName;
                }else{
                  mode.shotMfctyName = Moment(mode.publishTime).format('YYYY-MM-DD');
                }
                mode.state = BillStatus.inquiry[mode.status] || '未知';
                mode.value = mode.brandSystem;
                mode.id = mode.inquiryID;
              });
              var render = Template.compile(getTemplate());
              list.appendData(render(model));

              $('#wrapper').off(Base.events.click,'tr td.item').on(Base.events.click,'tr td.item',function(e){
                  location.href='inquiry-detail.html?id='+$(this).parents('tr').attr('id');
              });
          }
        });//Base.state end
        return data.model;
      },
      container:'#J_result_list',
      search:false,
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

    //选择参数
    var $Params = $('#J_params'),
        $Pannels = $('.J_params_pannel'),
        $Jmask = $('#J-mask'),
        $triggers = $('.J_params_trigger');
    $Params.on(Base.events.click,'.J_params_trigger',function() {
        var _self = $(this);
        if (_self.hasClass('J_t1')) {
            $Pannels.eq(0).show();
            $Pannels.eq(1).hide();
        } else {
            $Pannels.eq(1).show();
            $Pannels.eq(0).hide();
        }
        $triggers.removeClass('active');
        _self.addClass('active');
        $Jmask.show();
    });

    if(custId){
      $('#J_params .right').hide();
      $('#J_params .line').hide();
      $('#J_params .left').css({
        width:'100%'
      });
      $('.col1').text('日期');
    }else{
      $('.col1').text('厂名');
    }

    $Params.show();

     var $Nav = $('#J_nav'),
        $Head = $('.head');
    $Nav.on(Base.events.click,'.J_trigger',function(){
      var _self = $(this);
        if(!_self.hasClass('J_t1')){
          location.href="order.html";
        }
    });

    //加载城市选择列表
    LoadArea({},$,Base);

    //时间选择
    var a = $('#J_search_in').scroller('destroy').scroller({
        theme: 'sense-ui',
        lang: 'zh',
        preset: 'date',
        stepMinute: 5
    });

    var $close = $('.icon2');
    var $inpt = $('#J_search_in');

    //输入框改变事件处理
    $inpt.on('change',function(){
        reLoad();
        if($(this).val()){
            $close.show();
        }else{
            $close.hide();
        }
        $Pannels.hide();
        $Jmask.hide();
    });
    //改变 地区 事件处理
    $('#J_qu_id').on('DOMNodeInserted', function (e) {
        var text = $(e.target).text();
        if(text!='请选择'){
            reLoad();
            $Pannels.hide();
            $Jmask.hide();
        }
    });

    function reLoad(){
      list.settings.loadFirst = true;
      list.loadData();
    };

    //删除按钮事件处理
    $close.on(Base.events.click, function () {
        $inpt.val('').trigger('change');
    });

    //取消按钮事件处理
    $('.J_cancel').on(Base.events.click, function () {
        $Pannels.hide();
        $Jmask.hide();
    });
    //清空按钮事件处理
    $('#J_clear').on(Base.events.click, function () {
        $('#J_sheng').find('.value').find('span').attr('data-id','').text('请选择');
        $('#J_shi').find('.value').find('span').attr('data-id','').text('请选择');
        $('#J_qu_id').attr('data-id','').text('请选择');
        $Pannels.hide();
        $Jmask.hide();
        reLoad();
    });
    //返回按钮事件处理
    $('#J_prev').on("click", function () {
      if(custId){
        var url = Base.data.get('curr_factory_url');
        if(url){
          location.href = url;
        }else{
          history.back();
        }
      }else{
        location.href="../../home/my.html";
      }
    });

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
