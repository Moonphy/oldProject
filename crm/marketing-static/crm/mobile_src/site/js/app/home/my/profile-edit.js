define(function(require,exports,module) {

	var Base = require('../../base/index');
	var $ = Base.$;
	var Nav = require('../../nav/nav');
	var Storage = require('../../storage/storage');

	var nav = new Nav({
		prev:{
            text:'<a href="profile.html"><i class="icon iconfont">&#xe61f;</i>返回</a>'
        },
		op:{
            id:'J_edit',
            text:'修改'
        },
		title:'修改个人信息'
	});
	nav.init();

	(function(){
        var J_dept = $('#J_dept');
        var J_name = $('#J_name');
        var J_phone = $('#J_phone');
        var J_email = $('#J_email');

        var J_model = Storage.getItem('J_model');
        if(J_model){
        	J_model = JSON.parse(J_model);
        	J_name.val(J_model.userName);
        	J_phone.val(J_model.mp);
        	J_email.val(J_model.email);
        }
        Base.pageLoaded();
        $.ajax({
           url:'/wx/user/find/depart',
            success: function (data) {
                Base.state.check(data, function (model) {
                    if(!model) model = [];
                    if(model.length>0){
                        var tmp = '';
                        $.each(model,function(idx,mode){
                            if(mode.deptId==J_model.deptId){
                                tmp += '<option value="'+mode.deptId+'" selected="selected">'+mode.deptName+'</option>';
                            }else{
                                tmp += '<option value="'+mode.deptId+'">'+mode.deptName+'</option>';
                            }
                        });
                        J_dept.append(tmp);
                    }
                });
            }
        });
        
        $('#J_edit').on(Base.events.click, function () {
            var params = checkForm();
            if(params==undefined) return;
            $.ajax({
                url:'/wx/user/edit/info',
                data:params,
                type:'POST',
                success: function (data) {
                    Base.state.check(data, function () {
                        Base.msg.success('修改成功');
                    });
                }
            });
        });

        function checkForm(){
            var name = J_name.val();
            var deptId = J_dept.val();
            var phone = J_phone.val();
            var email = J_email.val();
            if(Base.check.null(name)){
                Base.msg.info('姓名不能为空啊，亲');
                return;
            }
            if(Base.check.null(deptId) || deptId=='-1'){
                Base.msg.info('部门没选呐，亲');
                return;
            }
            if(Base.check.null(phone)){
                Base.msg.info('手机号码不能为空啊，亲');
                return;
            }
            if(Base.check.null(email)){
                Base.msg.info('邮箱不能为空啊，亲');
                return;
            }
            if(!Base.check.isEmail(email)){
                Base.msg.info('邮箱格式不对啊，亲');
                return;
            }
            var params = {
                "deptId":deptId,
                "email":email,
                "mp":phone,
                "userName":name
            };
            return Base.utils.toQueryString(params);
        }
	})();

});