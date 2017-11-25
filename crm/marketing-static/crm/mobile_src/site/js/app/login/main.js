define(function(require,exports,module){
	var base = require('../base/index');
	var $ = base.$;
	var login = {
		initialize:function(){
			var J_username = $('#J_username'),
				J_password = $('#J_password'),
			/*J_remember = $('#J_remember'),
			 J_autologin = $('#J_autologin'),*/
				J_loginbtn = $('#J_loginbtn');

			J_loginbtn.on(base.events.click,function(){
				var loginName = J_username.val();
				var password = J_password.val();
				if(base.check.null(loginName)){
					base.msg.info('请输入登录名',800,function(){
						J_username.focus();
					});
				}else if(base.check.null(password)){
					base.msg.info('请输入登录密码',800,function(){
						J_password.focus();
					});
				}else{
					var query = base.utils.mapQuery(window.location.search);
					var openId = String(query.openId).split('.htm')[0];
					var params = {"loginName":loginName,"loginPwd":password,"openId":openId};
					base.setAjaxStart('登录中，请稍后...');
					$.ajax({
						url:'/wx/base/login',
						type:'POST',
						data: base.utils.toQueryString(params),
						success: function(data){
							base.state.check(data,function(model){
								base.data.set('user',model);
								if(model.areaId>0){
									location.replace("html/home/my.html");
								}else{
									location.replace("my/selcity.html");
								}
							},function(msg){
								base.msg.info(msg+"，请检查是否输入有误",1000);
							});
						}
					});
				}
			});
			base.pageLoaded();
		}
	};
	module.exports = login;
});