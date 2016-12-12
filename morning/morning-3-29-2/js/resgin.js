// JavaScript Document


/*-------注册验证-----------*/
$().ready(function() {
	 $("#signupForm").validate({
		rules: {
			telphone:{
				required: true,
				rangelength:[11,11],
				digits: "只能输入整数"
				},
			password: {
				required: true,
				rangelength:[8,20]
				},
			confirm_password: {
				required: true,
				equalTo: "#password",   
				rangelength:[8,20]
				}
			},
			messages: {
				telphone:{
					required: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请输入手机号",
					rangelength: jQuery.format("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请输入正确的手机号")
				},
				password: {
					required: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请输入密码",
					rangelength: jQuery.format("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;密码在8~20个字符之间")
				},
				confirm_password: {
				required: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请输入确认密码",
				rangelength: jQuery.format("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;密码在8~20个字符之间"),
				equalTo: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;两次输入密码不一致",
                identifying_code:{
                    required: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请输入验证码",
                    rangelength: jQuery.format("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请输入验证码")
                }
			}
		}
	});
});
