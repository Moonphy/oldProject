/* 
 *@file input_ui.js
 *@author wenlianlong
 *@info 用户中心注册验证函数（优化）
 *@data 2012-07-19
 */
 var reg_validate = function(ns){
	var fm = $(ns); //获取表单对象
	var fm_input = fm.find("input"); //获取输入框集合
	var fm_rd = fm.find(".rd"); //获取单选框集合
	
	//提示信息
	var msg=[];
		msg={
			IS_EMAIL_NULL:'请填写电子邮箱，可用来取回密码',
			IS_EMAIL_ERROR:'请检查邮箱拼写，示例：my@site.com',
			IS_EMAIL_EXIST:'邮箱已被注册过，是否需要<a href="index.php?mod=user&do=findPwd" style=" text-decoration:underline; color:#FF0000;">取回密码</a>?',
			IS_EMAIL_CHINESECHAR:'请输入英文(a-z,A-Z)或数字（0-9）',
			IS_EMAIL_ALLANGLE:'邮箱不能为全角，请切换半角',
			IS_EMAIL_ILLEGAL:'邮箱不能使用非法字符',
			IS_PASSWORD_NULL:'请填写一个方便你记忆的密码',
			IS_PASSWORD_CONFIRM:'请再次填写密码',
			IS_CODE_NULL:'请填写如图显示的四位验证码',
			IS_CODE_ERROR:'验证码不正确，请检查',
			IS_USER_NULL:'请填写用户名， 长度为3 到 15 个字符',
			IS_USER_ERROR1:'用户名不能少于 3 个字符',
			IS_USER_ERROR2:'用户名不能多于 15 个字符',
			IS_USER_ERROR3:'用户名包含敏感字符',
			IS_USER_CONFIRM:'抱歉，用户名已被占用，请换一个试试',
			IS_USER_NO_LEGAL:'用户名不合法',
			IS_USER_NO_ALLOW:'包含不允许注册的词语',
			IS_RESIDENCE_NULL:'请选择你的居住地',
			IS_IDENTITY_NULL:'请选择你的身份',
			IS_DEAL_CHECK:'请先阅读《用户协议》'
			
		}
		//验证邮件
		function isEmail(email){
			if(!/.+@.+\.[a-zA-Z]{2,4}$/.test(email)){
				return true;
			}else{
				return false;
			}
		}
		//过滤非法字符
		function trim(str) {
			return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
		}	
		//是否含有中文（也包含日文和韩文）  
		function isChineseChar(str){     
		   var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;  
		   return reg.test(str);  
		}
		//是否含有全角符号的函数  
		function isFullwidthChar(str){  
		   var reg = /[\uFF00-\uFFEF]/;  
		   return reg.test(str);  
		} 
		//过滤非法字符
		function isIllegalChar(str){
			var reg=/[`~!#$%^&*()_+<>?:"{},\/;'[\]]/im;
			return reg.test(str);
		}
		//添加提示
		function returnInfo(msg,parent)
		{
			parent.append('<span class="help_text">' + msg + '</span>');
			parent.parent().addClass("error");	
		}
	//inpu输入框操作
	fm_input.blur(function(){
		var $me=$(this);//当前对象
		var $parent = $(this).parent();
		$parent.find(".help_text").remove();//删除当前提示内容
		$parent.find(".icon_sure").remove();//删除当前验证成功图标
		//验证邮箱
		if($me.is("#regEmail"))
		{
			if($me.val()=="")
			{
				returnInfo(msg["IS_EMAIL_NULL"],$parent);
				return;
			}
			else if(isEmail($me.val()) && $me.val()!="")
			{
				returnInfo(msg["IS_EMAIL_ERROR"],$parent);
				return;
			}else if(isChineseChar($me.val()) && $me.val()!=""){
				returnInfo(msg["IS_EMAIL_CHINESECHAR"],$parent);
				return;
			}else if(isFullwidthChar($me.val()) && $me.val()!=""){
				returnInfo(msg["IS_EMAIL_ALLANGLE"],$parent);
				return;
			}else if(isIllegalChar($me.val()) && $me.val()!=""){
				returnInfo(msg["IS_EMAIL_ILLEGAL"],$parent);
				return;
			}else{
				$parent.parent().removeClass("error");
				$parent.append('<i class="icon_sure ml5"></i>');
			}
			//检测邮箱是否已注册
			$.get('index.php?mod=user&do=checkName&type=1&username='+this.value,function (str) {
				if(str != 1 && str!=""){
					returnInfo(msg["IS_EMAIL_EXIST"],$parent);
					return;
				}else{
					$parent.find(".icon_sure").remove();
					$parent.parent().removeClass("error");
					$parent.append('<i class="icon_sure ml5"></i>');
					email_check = true;
				}
			}); 
		}
		//验证密码
		if($me.is("#regPassword"))
		{
			if($me.val()==""){
				returnInfo(msg["IS_PASSWORD_NULL"],$parent);		
				return;
			}
			if($me.val()!="")
			{
				$parent.parent().removeClass("error");
				$parent.append('<i class="icon_sure ml5"></i>');
				pword_check = true;
			}
		}
		//验证重复密码
		if($me.is("#confirm_password"))
		{
			if($me.val()==""){
				returnInfo(msg["IS_PASSWORD_CONFIRM"],$parent);		
				return;
			}
			if($me.val()!="")
			{
				$parent.parent().removeClass("error");
				$parent.append('<i class="icon_sure ml5"></i>');
			}
		}
		//验证码
		if($me.is("#checkCode"))
		{
			if($me.val()=="")
			{
				returnInfo(msg["IS_CODE_NULL"],$parent);
				return;
			}
			if($me.val().length>0)
			{
				$parent.parent().removeClass("error");
			}
			$.get('index.php?mod=user&do=checkCode&code='+$me.val(),function (str) {
				if(str != 'ok' && str!=""){					
					returnInfo(msg["IS_CODE_ERROR"],$parent);
					return;
				}else{
					$parent.find(".icon_sure").remove();
					$parent.parent().removeClass("error");
					$parent.append('<i class="icon_sure ml5"></i>');
					ccode_check = true;
				}
			});
		}		
	});
		//验证用户名
		$("#username",fm).bind({
			"blur":function(){
				var $me=$(this);//当前对象
				var $parent = $(this).parent();
				$parent.find(".help_text").remove();//删除当前提示内容
				$parent.find(".icon_sure").remove();//删除当前验证成功图标
				if($me.val()==""){
					returnInfo(msg["IS_USER_NULL"],$parent);
					return;
				}else if($me.val()!="" && $me.val().length<3)
				{
					returnInfo(msg["IS_USER_ERROR1"],$parent);
					return;
				}
				else if($me.val()!="" && $me.val().length>15)
				{
					returnInfo(msg["IS_USER_ERROR2"],$parent);
					return;
				}
				else if($me.val()!="" && trim($me.val()).match(/<|"/ig))
				{
					returnInfo(msg["IS_USER_ERROR3"],$parent);
					return;
				}
				else{
					$parent.parent().removeClass("error");
					$parent.append('<i class="icon_sure ml5"></i>');
				}
				//检测用户名是否忆注册
				$.post('index.php?mod=user&do=checkName&type=2&username='+$me.val(),function (str) {
					if(str > 0){
						$me.parent().parent().removeClass("error");
						uname_check = true;
					}else if(str == -1){
						returnInfo(msg["IS_USER_NO_LEGAL"],$parent);
						return;
					}else if(str == -2){
						returnInfo(msg["IS_USER_NO_ALLOW"],$parent);
						return;
					}else if(str == -3){
						returnInfo(msg["IS_USER_CONFIRM"],$parent);
						return;
					}
				});	
				},'change' : function(){
					$(this).triggerHandler("blur");
			}
		});
		//居住地
		$("#resideprovince",fm).bind("blur focus change",function(){
				var $parent = $(this).parent();
				$parent.find(".help_text").remove();
				$parent.find(".icon_sure").remove();
				if($(this).val() == ""){
					returnInfo(msg["IS_RESIDENCE_NULL"],$parent);
					return;
				}else
				{
					$parent.parent().removeClass("error");
					$parent.append('<i class="icon_sure ml5"></i>');
					place_check=true;
				}
		});
		//身份验证
		fm_rd.bind({
		click : function(){
			var ched =  $('input[name="status"]:checked').attr("checked");//得到status 组选中状态
			var $parent = $(this).parent().parent();			
			if(ched) {
				$parent.find(".help_text").remove();
				$parent.parent().removeClass("error");
				id_check = true;
				return;
			}
			else {
				$parent.find(".help_text").html(msg["IS_IDENTITY_NULL"]);
				$parent.parent().addClass("error");
			}
		},
		blur : function(){
			$(this).triggerHandler("click");
		}
	});
	
		//用户协议
		$("#user_agree",fm).bind("click focus",function(){
			var ched = $("#user_agree").attr("checked");
			var $parent = $(this).parent().parent();
			if(!ched){
				$('#register').attr("disabled","disabled");
				returnInfo(msg["IS_DEAL_CHECK"],$parent);	
				return;
				agree_check = false;
			}else{
				$('#register').removeAttr("disabled","disabled");
				$parent.find(".help_text").remove();
				$parent.parent().removeClass("error");
				agree_check = true;
			}
		});
		//提交操作
		$('#register').click(function(){
			fm.find("input").trigger('blur');
			fm.find(".rd").trigger('blur');
			fm.find("#username").trigger('blur');
			fm.find("#resideprovince").trigger('blur');
			fm.find("#user_agree").trigger('focus');
			var numError = $(".error").length;			
			if(numError > 0) {  
			   return false;  
			}
			else {
				$('#reg_form').submit();
			}	
		});
 }