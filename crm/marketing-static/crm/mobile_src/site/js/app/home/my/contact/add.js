define(function(require,exports,module) {
	var Base = require('../../../base/index');
	var $ = Base.$;
	var Nav = require('../../../nav/nav');
	var Iscroll = require('../../../gallery/iscroll/api');
  var Template = require('../../../gallery/template/main');
  var ContactType = require('./load-contact-type');
	var nav = new Nav({
    prev:{
      text:'<a href="list.html"><i class="icon iconfont">&#xe61f;</i>通讯录</a>'
    },
		title:'新建联系人',
    op:{
    	id:'J_save',
      text:'保存'
    }
	});
	nav.init();

	$(function(){
    var J_name = $('#J_name');
    var J_type = $('#type');
    var J_phone = $('#J_phone');
    var J_memo = $('#J_memo');

    //加载联系人类型，并自动选中现有类型
    ContactType.load('',J_type);

    $('#J_save').on(Base.events.click,function(){
        var params = checkForm();
        if(params==undefined){
            return;
        }
        $.ajax({
            url:'/wx/phone/create/userPhone',
            data:params,
            type:'POST',
            success:function(data){
                Base.state.check(data,function(){
                    J_name.val('');
                    J_phone.val('');
                    J_memo.val('');
                    Base.msg.success('信息已保存');
                });
            }
        })
    });

    function checkForm(){
        var name = J_name.val();
        var type = J_type.val();
        var phone = J_phone.val();
        var memo = J_memo.val();
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