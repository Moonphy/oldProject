define(function(require,exports,module) {
	var Base = require('../../../base/index');
	var $ = Base.$;
	var Nav = require('../../../nav/nav');
  var Datepicker = require('../../../gallery/datepicker/api');
	var nav = new Nav({
    prev:{
      text:'<a href="list.html"><i class="icon iconfont">&#xe61f;</i>备忘录</a>'
    },
		title:'新增备忘录',
    op:{
    	id:'J_save',
      text:'保存'
    }
	});
	nav.init();

	$(function(){
    
    Datepicker.init($);

    var $date = $('#date');
    var $desc = $('#desc');
    $date.scroller('destroy').scroller({
        preset: 'datetime',
        stepMinute: 5,
        theme: 'sense-ui',
        lang: 'zh'
    });
    changeSeconds([$date]);

    function changeSeconds(selectors) {
        $.each(selectors, function (idx, selector) {
            selector.on('change', function () {
                $(this).val($(this).val() + ':' + new Date().getSeconds());
            });
        });
    }

    function checkForm(){
        var time = $.trim($date.val()),
            content = $.trim($desc.val());

        if(Base.check.null(time)){
            Base.msg.info('请选择时间，亲');
            return;
        }
        if(Base.check.null(content)){
            Base.msg.info('请输入备忘具体事项，亲');
            return;
        }
        var params = {
            "planTime":time,
            "content":content
        };
        return Base.utils.toQueryString(params);
    }

    $('#J_save').on(Base.events.click, function () {
        var params = checkForm();
        if(params==undefined) return;
        $.ajax({
            url:'/wx/memorandum/create',
            data:params,
            type:'POST',
            success: function (data) {
                Base.state.check(data, function () {
                    Base.msg.success('已保存，感谢使用',1000, function () {
                        location.href="list.html";
                    });
                });
            }
        });
    });

    Base.pageLoaded();
	});
});