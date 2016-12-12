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
            text:'修改',
            id:'J_edit'
        },
		title:'修改密码'
	});
	nav.init();

	(function(){
        $(function(){
            var $oldpwd = $('#J_oldpwd'),
            $pwd = $('#J_pwd'),
            $repwd = $('#J_repwd');

            $('#J_edit').on(Base.events.click, function () {
                var params = checkForm();
                if(params!=undefined){
                    $.ajax({
                        url:'/wx/user/edit/pwd',
                        data:params,
                        success:function(data){
                            Base.state.check(data,function(){
                                Base.msg.success('密码修改成功！',2000,function(){
                                    location.replace('../login.html');
                                });
                            });
                        }
                    });
                }
            });

            function checkForm(){
                var oldpwd = $oldpwd.val();
                var pwd = $pwd.val();
                var repwd = $repwd.val();

                if(Base.check.null(oldpwd)){
                    Base.msg.info('旧密码不能为空啊，亲');
                    return;
                }
                if(Base.check.null(pwd)){
                    Base.msg.info('新密码类型没选呐，亲');
                    return;
                }
                if(Base.check.null(repwd)){
                    Base.msg.info('请重复输入新密码啊，亲');
                    return;
                }
                if(pwd!=repwd){
                    Base.msg.info('两次新密码输入不一致啊，亲');
                    return;
                }
                var params = {
                    "oldPwd":oldpwd,
                    "newPwd":pwd
                };
                return Base.utils.toQueryString(params);
            }
            Base.pageLoaded();
        });
	})();

});