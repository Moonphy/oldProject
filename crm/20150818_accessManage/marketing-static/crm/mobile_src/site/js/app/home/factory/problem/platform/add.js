define(function(require,exports,module) {
	var Base = require('../../../../base/index');
	var $ = Base.$;
	var Nav = require('../../../../nav/nav');
	var nav = new Nav({
    prev:{
      text:'<a href="list.html"><i class="icon iconfont">&#xe61f;</i>问题反馈</a>'
    },
		title:'新增问题反馈',
    op:{
    	id:'J_save',
      text:'保存'
    }
	});
	nav.init();

	$(function(){
		
    var J_type = $('#type');
    var J_desc = $('#desc');

    $.ajax({
        url:'/wx/platFormQuestion/getPlatType',
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
            })
        }
    });

    $('#J_save').on(Base.events.click, function () {
        var params = checkForm();
        if(params==undefined)
            return;
        $.ajax({
            url:'/wx/platFormQuestion/create',
            data:params,
            type:'POST',
            success: function (data) {
                Base.state.check(data, function () {
                    Base.msg.success('问题已提交，感谢反馈',1000,function(){
                      location.href="list.html";
                    });
                });
            }
        })
    });

    function checkForm(){
        var type = $.trim(J_type.val());
        var desc = $.trim(J_desc.val());
        if(type == '-1' || type == ''){
            Base.msg.info('请选择问题类型啊，亲');
            return;
        }
        if(desc == ''){
            Base.msg.info('请输入问题的具体描述啊，亲');
            return;
        }
        var params = {
            "content":desc,
            "platTypeID":type,
            "taskID": Base.data.get('curr_taskid')
        };
        return Base.utils.toQueryString(params);
    }

    Base.pageLoaded();
	});
});