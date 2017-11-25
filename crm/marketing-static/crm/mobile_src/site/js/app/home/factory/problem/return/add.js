define(function(require,exports,module) {
	var Base = require('../../../../base/index');
	var $ = Base.$;
	var Nav = require('../../../../nav/nav');
    var DatePicker = require('../../../../gallery/datepicker/api');
	var nav = new Nav({
    prev:{
      text:'<a href="list.html"><i class="icon iconfont">&#xe61f;</i>退货问题</a>'
    },
		title:'新增退货问题',
    op:{
    	id:'J_save',
      text:'保存'
    }
	});
	nav.init();

	$(function(){
		DatePicker.init($);

    var currTaskId = Base.data.get('curr_taskid');
    if (Base.check.null(currTaskId)) {
        Base.msg.info('未检测到当前TASKID，请返回！', 2000);
    }
    $('#J_date').scroller('destroy').scroller({
      theme: 'sense-ui',
      lang: 'zh',
      preset: 'datetime',
      stepMinute: 5
    });
    changeSeconds([$('#J_date')]);
    function changeSeconds(selectors) {
        $.each(selectors, function (idx, selector) {
          selector.on('change', function () {
            $(this).val($(this).val() + ':' + new Date().getSeconds());
          });
        });
    }

    var J_type = $('#J_type'),
        J_date = $('#J_date'),
        J_no = $('#J_no'),
        J_desc = $('#J_desc');

    $.ajax({
        url:'/wx/returnGoodsQuestion/getQuestionType',
        success: function (data) {
            Base.state.check(data, function (model) {
                if(!model) model =[];
                if(model.length>0){
                    var tmp = '';
                    $.each(model,function(idx,mode){
                        tmp+='<option value="{{value}}">{{text}}</option>'.replace('{{value}}',mode.typeID)
                            .replace('{{text}}',mode.typeName);
                    });
                    J_type.append(tmp);
                }
            });
        }
    });


    $('#J_save').on(Base.events.click, function () {
        var params = checkForm();
        if(params==undefined)
            return;
        $.ajax({
          url:'/wx/returnGoodsQuestion/create',
          data:params,
          type:'POST',
          success: function (data) {
            Base.state.check(data, function () {
              Base.msg.success('问题已提交，感谢反馈',2000,function(){
                location.href="list.html";
              });
            });
          }
        })
    });

    function checkForm(){
      var date = $.trim(J_date.val());
      var no = $.trim(J_no.val());
      var type = $.trim(J_type.val());
      var desc = $.trim(J_desc.val());
      if(Base.check.null(date)){
          Base.msg.info('请选择退货日期啊，亲');
          return;
      }
      if(Base.check.null(no)){
          Base.msg.info('请输入订单号啊，亲');
          return;
      }
      if(Base.check.null(type) || type=='-1'){
          Base.msg.info('请选择问题类型啊，亲');
          return;
      }
      if(Base.check.null(desc)){
          Base.msg.info('请输入具体描述啊，亲');
          return;
      }
      var params = {
          "returnTypeID":type,
          "returnGoodsTime":date,
          "orderNo":no,
          "content":desc,
          "TaskID": Base.data.get('curr_taskid')
      };
      return Base.utils.toQueryString(params);
    }
    Base.pageLoaded();
	});
});