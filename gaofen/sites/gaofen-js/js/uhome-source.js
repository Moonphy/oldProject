/*
 ****************** 用户中心脚本文件 *****************
 */
/* 
 *用户中心注册验证函数 
 */
var reg_validate = function(_val,fn){
	var fm = $(_val); //获取表单对象
	var fm_input = fm.find("input"); //获取输入框集合
	var fm_rd = fm.find(".rd"); //获取单选框集合
	var isbtn=false,
		iptindex=0,
		isemail=false,
		isuser=false,
		iscode=false;
	
	//提示信息
	var msg=[];
		msg={
			IS_EMAIL_TIP:'如：gaofen@gaofen.com',
			IS_EMAIL_NULL:'请填写邮箱地址',
			IS_EMAIL_ERROR:'请填写正确的邮箱地址，用于找回密码',
			IS_EMAIL_EXIST:'此邮箱已被注册',
			IS_PASSWORD_TIP:'6-15位字符，可由英文、数字及标点符号组成',
			IS_PASSWORD_NULL:'请设置密码',
			IS_PASSWORD_ERROR:'6-15位字符，可由英文、数字及标点符号组成',
			IS_CODE_TIP:'请输入图片中的字符，不区分大小写',
			IS_CODE_NULL:'请输入图片中的字符，不区分大小写',
			IS_CODE_ERROR:'验证码不正确，请检查',
			IS_USER_TIP:'4-15位字符，可由英文、中文及数字组成',
			IS_USER_NULL:'请填写昵称',
			IS_USER_ERROR:'4-15位字符，可由英文、中文及数字组成',
			IS_USER_ERROR1:'用户名包含敏感字符',
			IS_USER_ERROR2:'用户名包含敏感字符',
			IS_USER_ERROR3:'用户名已经存在',
			IS_USER_CONFIRM:'该昵称已被使用',
			IS_USER_NO_LEGAL:'用户名不合法',
			IS_USER_NO_ALLOW:'包含不允许注册的词语',
			IS_RESIDENCE_NULL:'请选择你的地域',
			IS_IDENTITY_NULL:'请选择您的身份',
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
			parent.find(".help-inline").remove();
			parent.append('<span class="help-inline">' + msg + '</span>');
			return false;
		}
		function checkInput(name){
			if(isbtn)
				fm.find(name).trigger("blur");
		}
		function len_str(s) {
			 var l = 0;
			 var a = s.split("");
			 for (var i=0;i<a.length;i++) {
			  if (a[i].charCodeAt(0)<299) {
			  	 l++;
			  	} else {
			   	l+=2;
			  }
			 }
			 return l;
		}
	//邮件验证
	fm.find("#regEmail").bind({
		'blur':function(){
			var $me=$(this);//当前对象
			var $parent = $(this).parents(".form-row"),
				v = $.trim($(this).val());
			if(v === isemail){
				if(isbtn){
					iptindex++;
					fm.find("#username").trigger("blur");
				}
				return;
			}
			if($me.val()==""){
				returnInfo(msg["IS_EMAIL_NULL"],$parent.removeClass("hints success").addClass("error"))
				checkInput("#username");
			}else if(isEmail($me.val()) && $me.val()!=""){
				returnInfo(msg["IS_EMAIL_ERROR"],$parent.removeClass("hints success").addClass("error"));
				checkInput("#username");
			}else{
				//检测邮箱是否已注册
				isemail = v
				var that = this;
				$.get('index.php?mod=user&do=checkName&type=1&username='+v,function (str) {
					if(str != 1 && str!=""){
						returnInfo(msg["IS_EMAIL_EXIST"],$parent.removeClass("hints success").addClass("error"));
						checkInput("#username");
						//return;
					}else{	
						isemail= isemail == v ? isemail : false;
						if(isbtn)	
							iptindex++;
						//console.log("isbtn:"+isbtn+"-----"+"iptindex:"+iptindex)				
						$parent.removeClass("hints error").addClass("success");
					}
					checkInput("#username");
				}); 

			}
			//console.log("isbtn:"+isbtn+"-----"+"iptindex:"+iptindex)

			return;
		},
		'focus':function(){
			var $me=$(this);//当前对象
			iptindex=0;
			if($me.val()==""){
				var $parent = $(this).parents(".form-row");
				returnInfo(msg["IS_EMAIL_TIP"],$parent.addClass("hints"))
				return;
			}
		}
	});
	//密码验证
	fm.find("#regPassword").bind({
		'blur':function(){
			var $me=$(this);//当前对象
			var $parent = $(this).parents(".form-row");
			if($me.val()==""){
				returnInfo(msg["IS_PASSWORD_NULL"],$parent.removeClass("hints success").addClass("error"))
				return;
			}else if($me.val().length<6 || $me.val().length>15){
				returnInfo(msg["IS_PASSWORD_ERROR"],$parent.removeClass("hints success").addClass("error"))
				return;
			}else{
				$parent.removeClass("hints error").addClass("success")
			}
		},
		'focus':function(){
			var $me=$(this);//当前对象
			if($me.val()==""){
				var $parent = $(this).parents(".form-row");
				returnInfo(msg["IS_PASSWORD_TIP"],$parent.addClass("hints"))
				return;
			}
		}
	});
	//昵称验证
	fm.find('#username').bind({
		'blur':function(){
			var $me=$(this);//当前对象
			var $parent = $(this).parents(".form-row"),
				v = $.trim($(this).val());
			if(v === isuser){
				if(isbtn){
					iptindex++;
					fm.find("#checkCode").trigger("blur");
				}
				return;
			}
			if($me.val()==""){
				returnInfo(msg["IS_USER_NULL"],$parent.removeClass("hints success").addClass("error"))
				checkInput("#checkCode");
				//return;
			}else if(len_str($me.val())<4 || len_str($me.val())>15){
				returnInfo(msg["IS_USER_ERROR"],$parent.removeClass("hints success").addClass("error"))
				checkInput("#checkCode");
			}else{
				isuser = v
				//检测用户名是否忆注册
				$.post('index.php?mod=user&do=checkName&type=2&username='+$me.val(),function (str) {
					if(str == -1){
						returnInfo(msg["IS_USER_ERROR1"],$parent.removeClass("hints success").addClass("error"))
						checkInput("#checkCode");
						//return;
					}else if(str == -2){
						returnInfo(msg["IS_USER_ERROR2"],$parent.removeClass("hints success").addClass("error"))
						checkInput("#checkCode");
						//return;
					}else if(str == -3){
						returnInfo(msg["IS_USER_ERROR3"],$parent.removeClass("hints success").addClass("error"))
						checkInput("#checkCode");
						//return;
					}else{
						isuser= isuser == v ? isuser : false;
						if(isbtn)	
							iptindex++;
						//console.log("isbtn:"+isbtn+"-----"+"iptindex:"+iptindex)				
						$parent.removeClass("hints error").addClass("success")
						checkInput("#checkCode");
					}					
				});	
			}
			//console.log("isbtn:"+isbtn+"-----"+"iptindex:"+iptindex)			
			return;
		},
		'focus':function(){
			var $me=$(this);//当前对象
			iptindex=0;
			if($me.val()==""){				
				var $parent = $(this).parents(".form-row");
				returnInfo(msg["IS_USER_TIP"],$parent.addClass("hints"))
				return;
			}
		}
	});
	//身份验证
	fm_rd.bind({
		click : function(){
			var ched =  $('input[name="status"]:checked').attr("checked");//得到status 组选中状态
			var $parent = $(this).parents(".form-row");			
			if(ched) {
				returnInfo("身份",$parent)
				$parent.removeClass("hints error").addClass("success")
			}else {
				returnInfo(msg["IS_IDENTITY_NULL"],$parent.removeClass("hints success").addClass("error"))
				return
			}
		},
		blur : function(){
			$(this).triggerHandler("click");
		}
	});
	//验证区域	
	fm.find("#resideprovince").bind({
		'blur' : function(){
			var $me=$(this);//当前对象
			var $parent = $(this).parents(".form-row");
			if($me.val() == ""){
				returnInfo(msg["IS_RESIDENCE_NULL"],$parent.removeClass("hints success").addClass("error"))
				return false;
			}			   
		},
		'change' : function(){
			var $parent = $(this).parents(".form-row");
			returnInfo("省份",$parent)
			$parent.removeClass("hints error").addClass("success")
			
		}
	});
	//验证码
	var codeAjax = null;
	fm.find("#checkCode").bind({
		'blur':function(){
			var $me=$(this);//当前对象
			var $parent = $(this).parents(".form-row");
			if( this.value == "" ){
				if(isbtn)
					isbtn=false;
				returnInfo(msg["IS_CODE_NULL"],$parent.removeClass("hints success").addClass("error"))
				//return;
			}else{
				if(codeAjax) codeAjax.abort();
				codeAjax = $.get('index.php?mod=user&do=checkCode&code='+this.value,function (msg) {
					codeAjax = null;
					if(msg != 'ok' && msg!=""){		
						if(isbtn)
							isbtn=false;			
						returnInfo("验证码不正确，请检查",$parent.removeClass("hints success").addClass("error"))
						//return;
					}else{
						iptindex++;
						$parent.removeClass("hints error").addClass("success");
						if(isbtn){
							var numError=$("#reg_form .error").length;  
							if(numError==0){
								isbtn=false;
								$("#reg_form input[type='submit']").addClass("hidden").before('<span id="span_submit" class="btn btn-disabled">处理中...</span>')
								fn();
							}else{
								return false;
							}
						}
						
					}
				}); 
			}
			//console.log("isbtn:"+isbtn+"-----"+"iptindex:"+iptindex)			
			return;
		},
		'focus':function(){
			var $me=$(this);//当前对象
			if($me.val()==""){
				var $parent = $(this).parents(".form-row");
				returnInfo(msg["IS_CODE_TIP"],$parent.addClass("hints"))
				return;
			}
		}
	});
	//用户协议 2011年12月21日 15:52:14
	fm.find("#user_agree").bind({
		'click' : function(){
			var ched = $("#user_agree").attr("checked");
			if(!ched){
				$("input[type='submit']").attr("disabled","disabled");
				$("input[type='submit']").removeClass("btn-primary");
				return;		
			}else{
				$("input[type='submit']").removeAttr("disabled","disabled");
				$("input[type='submit']").addClass("btn-primary");
			}
		},
		'focus' : function(){
			var ched = $("#user_agree").attr("checked");
			if(!ched){
				$("input[type='submit']").removeClass("btn-primary");
				return;			
			}
		}
	})
	$("#reg_form input[type='submit']").click(function(){			
		isbtn=true;
		iptindex=0;
		//var numError=$("#reg_form .error").length;  
		//var numSuccess=$("#reg_form .success").length; 
		//fm.find("input").trigger('blur');		
		fm.find("#regPassword").trigger("blur");
		fm.find(".rd").trigger('blur');
		fm.find("#resideprovince").trigger('blur');
		fm.find("#regEmail").trigger("blur");
		fm.find("#user_agree").trigger('focus');
        return false;  
	});
}

function isUndefined(variable) {
	return typeof variable == 'undefined' ? true : false;
}

function showdistrict(container, elems, totallevel, changelevel) {
	var cont = $("#"+container);
	var getdid = function(elem) {
		var op = elem.find("option:selected");
		return op.eq['did'] || op.attr('did') || '0';
	};
	var pid = changelevel >= 1 && elems[0] && $("#"+elems[0]) ? getdid($("#"+elems[0])) : 0;
	var cid = changelevel >= 2 && elems[1] && $("#"+elems[1]) ? getdid($("#"+elems[1])) : 0;
	var did = changelevel >= 3 && elems[2] && $("#"+elems[2]) ? getdid($("#"+elems[2])) : 0;
	var coid = changelevel >= 4 && elems[3] && $("#"+elems[3]) ? getdid($("#"+elems[3])) : 0;
	var geturl = APP_URL+"index.php?mod=common&do=showdistrict&op=district&container="+container
		+"&province="+elems[0]+"&city="+elems[1]+"&district="+elems[2]+"&community="+elems[3]
		+"&pid="+pid + "&cid="+cid+"&did="+did+"&coid="+coid+'&level='+totallevel+'&handlekey='+container+'&inajax=1'+(isUndefined(changelevel) ? '&showdefault=1' : '');
	//console.log(geturl)
	/*$.get(geturl,function(msg){
			var value = $(msg).find("root").text();
			if(value){
				cont.html($(msg).find("root").text());	
				$("#residedistrictbox #resideprovince").attr("tabindex","9");
				$("#residedistrictbox #residecity").attr("tabindex","10");
				$("#residedistrictbox #residedist").attr("tabindex","11");	
				$("#residedistrictbox #residecommunity").attr("tabindex","11");
			}
		}
	);
	*/
	
}

function showFirstDistrict(){
	var geturl = APP_URL+"index.php?mod=common&do=showdistrict&first=1";
	$.get(geturl,function(msg){
			$("#residedistrictbox").html($(msg).find("root").text());
			$("#residedistrictbox #resideprovince").attr("tabindex","9");
			$("#residedistrictbox #residecity").attr("tabindex","10");
			$("#residedistrictbox #residedist").attr("tabindex","11");				  
		}
	);
	
}


var addcss=function(){
	$(".sub_menu dd a").each(function(i){
		$(".sub_menu dd a").eq(i).click(function(){
			$(".sub_menu dd a").removeClass("selected");
			$(".sub_menu dd a").eq(i).addClass("selected");	
		})
	})
}

function trim(str) {
	return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
}
