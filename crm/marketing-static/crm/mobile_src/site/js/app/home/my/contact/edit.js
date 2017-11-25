define(function(require,exports,module) {

	var Base = require('../../../base/index');
	var $ = Base.$;
	var Nav = require('../../../nav/nav');
	var ContactType = require('./load-contact-type');
	var nav = new Nav({
    prev:{
    	id:'J_prev',
      text:'<i class="icon iconfont">&#xe61f;</i>详情'
    },
		title:'通讯录-修改',
    op:{
    	id:'J_save',
      text:'保存'
    }
	});
	nav.init();

	$(function(){
		var $type = $('#J_type');
    var model =Base.data.get('dt_model');
    $('#J_name').val(model.contactMan);
    $('#J_phone').val(model.phoneNo);
    $('#J_memo').val(model.memo);
    var $curr_id = model.contactID;
    var $curr_type = model.contactTypeName;

    //加载联系人类型，并自动选中现有类型
    ContactType.load($curr_type,$type);

    //返回按钮
    $('#J_prev').on(Base.events.click,function(){
        history.back();
    });

    //保存按钮
    $('#J_save').on(Base.events.click, function () {
        var params =checkForm();
        if(params==undefined){
            return;
        }
        $.ajax({
            url:'/wx/phone/update/userPhone',
            data:params,
            type:'POST',
            success: function (data) {
                Base.state.check(data,function(){
                    Base.msg.success('信息已更新',3000,function(){
                    	history.back();
                    });
                });
            }
        });
    });

    function checkForm(){
        var name = $('#J_name').val();
        var type = $('#J_type').val();
        var phone = $('#J_phone').val();
        var memo = $('#J_memo').val();
        if(Base.check.null(name)){
            Base.msg.info('名称不能为空啊，亲');
            return;
        }
        if(Base.check.null(type)){
            Base.msg.info('联系人类型没选呐，亲');
            return;
        }
        if(Base.check.null(phone)){
            Base.msg.info('电话号码不能为空啊，亲');
            return;
        }
        var params = {
            "contactID":$curr_id,
            "contactMan":name,
            "contactTypeID":type,
            "phoneNo":phone,
            "memo":memo
        };
        return Base.utils.toQueryString(params);
    }
    Base.pageLoaded();
	});
});	