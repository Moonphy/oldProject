define(function(require,exports,module) {
	var Base = require('../../base/index');
	var $ = Base.$;
    var Nav = require('../../nav/nav');

    var nav = new Nav({
        prev:{
            text:'<a href="../factory/select.html"><i class="icon iconfont">&#xe61f;</i>选择厂</a>'
        },
        title:'新建汽修厂',
        op:{
            id:'J_save',
            text:'保存'
        }
    });
    nav.init();

	$(function () {

    var J_name = $('#J_name'),
        J_address = $('#J_address'),
        J_telman = $('#J_telman'),
        J_tel = $('#J_tel');

    function checkForm(){
        var name = $.trim(J_name.val());
        var address = $.trim(J_address.val());
        var telman = $.trim(J_telman.val());
        var tel = $.trim(J_tel.val());
        if(Base.check.null(name)){
            Base.msg.info('请输入厂家名啊，亲');
            return;
        }
        if(Base.check.null(address)){
            Base.msg.info('请输入地址啊，亲');
            return;
        }
        if(Base.check.null(telman)){
            Base.msg.info('请输入联系人啊，亲');
            return;
        }
        if(Base.check.null(tel)){
            Base.msg.info('请输入联系电话啊，亲');
            return;
        }
        var params = {
            "mfctyName":name,
            "address":address,
            "cactMan":telman,
            "cactTel":tel
        };
        return Base.utils.toQueryString(params);
    }

    $('#J_save').on(Base.events.click, function () {
        var params = checkForm();
        if(params==undefined) return;
        $.ajax({
            url:'/wx/customer/create/mfcty',
            type:'POST',
            data:params,
            success:function(data) {
                Base.state.check(data, function (model) {
                    Base.msg.success('新增成功！');
                    model = model[0];
                    $('#J_back').attr('href','task-add.html?id='+model.id+'&taskId=&custID='+model.id+'&factory='+encodeURI(model.mfctyName));
                    J_name.val('');
                    J_address.val('');
                    J_telman.val('');
                    J_tel.val('');
                });
            }
        });
    });

    Base.pageLoaded();
  });

});