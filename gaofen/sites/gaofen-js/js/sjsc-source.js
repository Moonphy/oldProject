//把弹出对话框固定在屏幕正中间
var fixDialog = function(obj){
    var dom = document.documentElement || document.body;
    var dw = $(dom).width();
    var dh = $(window).height();
    var ui_dialog = $(obj);
    var u_w = ui_dialog.width();
    var u_h = ui_dialog.height();
    minX = 0;
    maxX = dw - u_w;
    centerX = maxX / 2;
    minY = 0;
    maxY = dh - u_h;
    //黄金比例垂直居中
    var hc =  dh * 0.5 - u_h / 2;
    centerY = (hc > 0) ?  hc : maxY / 2;
	ui_dialog.css({"position":"absolute","display":"block","left":centerX,"top":centerY,"z-index":10000});
}

//弹出层函数,context就是弹出对话框的#id值
var PopLayer  = function(context){
    var overLay_bg = "<div id='overLay' style='display: block; background: #818181; z-index: 130; position: absolute; margin: 0px; padding: 0px; top: 0px; left: 0px;'><iframe frameborder='0' style='position:absolute; top:0; left:0; width:100%; height:100%; filter:alpha(opacity=0); opacity=0;'></iframe></div>";
	
    var dom = document.documentElement;
	var dh;
    $("#pop_div").append($(overLay_bg));
	if(dom.scrollHeight>dom.clientHeight){
		dh = dom.scrollHeight;
	}
	else{
		dh = dom.clientHeight;	
	}
    $("#pop_div").find("#overLay").css({
        "width"  : dom.clientWidth,
        "height" : dh,
        "opacity" : 0.8
    })
    //关闭蒙层功能
	var cont = $(context);
    cont.find(".close_btn").bind(
        "click",function(){
			//跳转页面
			window.location = "http://www.gaofen.com/shitibuy";  
            $("#pop_div").css("display","none");
			cont.css("display","none");
			
        }
    );
    fixDialog(cont);
}
/**
* @create:   charry
* @rotatelist  订单添加
* @调用方式	 ord_amount()
*/
/*
var ord_amount=function(){
	var ms = $(".minus");
	var ps = $(".plus");
	var amount = $(".text-amount");	
	var total = $("#total");
	var oj_total =  $(".oj_total");
	var oj_pirce =  $(".tab_pirce").find("em");
		ms.css({"color":"#CCCCCC"})
	ps.click(function(){
		 if(parseInt(amount.val())>=998){
			alert("请确认您的购买数量！");	
		}else{
			ms.removeAttr("style")
			amount.val(parseInt(amount.val())+1);
			var price_val =parseInt(oj_pirce.html());
			var total_val=parseInt(amount.val())*price_val;
			oj_total.html(total_val);
			total.html(total_val);
		}
	});
	ms.click(function(){
		if(parseInt(amount.val())>1){
			amount.val(parseInt(amount.val())-1);
			var price_val =parseInt(oj_pirce.html());
		    var total_val=parseInt(amount.val())*price_val;
			oj_total.html(total_val);
			total.html(total_val);
		}else{
			//alert("最小购买量为1!");
			ms.css({"color":"#CCCCCC"})
			amount.attr("value",'1')
		}
		if(parseInt(amount.val())==1){
			ms.css({"color":"#CCCCCC"})
		}
		
	});
	amount.keyup(function(){
		if(parseInt(amount.val())>=1){
			ms.removeAttr("style")
			var price_val =parseInt(oj_pirce.html());
		    var total_val=parseInt(amount.val())*price_val;
			oj_total.html(total_val);
			total.html(total_val);
		}else{
			//alert("最小购买量为1！");
			ms.css({"color":"#CCCCCC"})
			amount.attr("value",'1')
			var price_val =parseInt(oj_pirce.html());
		    var total_val=parseInt(amount.val())*price_val;
			oj_total.html(total_val);
			total.html(total_val);
		}
		 if(parseInt(amount.val())>=999){
			alert("请确认您的购买数量！");	
		}
		
	});
		
}
*/
/**
* @create:   charry
* @rotatelist  收货信息验证
* @调用方式	reg_validate()
*/
var reg_validate = function(_val){
	var fm = $(_val); //获取表单对象
	var fm_input = fm.find("input"); //获取输入框集合
	var fm_rd = fm.find(".rd"); //获取单选框集合
	//提示信息
	var msg=[];
	msg={
		IS_USER_ERROR:'请填写收货人姓名',
		IS_USER_ERROR1:'用户名不能多于 20 个字符',
		IS_USER_ERROR2:'用户名包含敏感字符',
		IS_MOBILE_ERROR:'请填写手机号码',
		IS_MOBILE_ERROR1:'手机号须为11位数字',
		IS_MOBILE_ERROR2:'手机号须为11位数字',
		IS_RESIDENCE_ERROR:'请选择区域',
		IS_ADDESS_ERROR:'请填写详细地址'
		
	}
	//添加提示
	function returnInfo(msg,parent)
	{
		parent.find(".help-inline").remove();
		parent.append('<span class="help-inline">' + msg + '</span>');
	}
	//收货人
	fm.find('#slder_name').bind({
		'blur':function(){
			var $me=$(this);//当前对象
			var $parent = $(this).parents(".form-row");
			if($me.val()==""){
				returnInfo(msg["IS_USER_ERROR"],$parent.removeClass("hints success").addClass("error"))
				return;
			}else if($me.val().length>20){
				returnInfo(msg["IS_USER_ERROR1"],$parent.removeClass("hints success").addClass("error"))
				return;
			}else if(trim($me.val()).match(/<|"/ig)){
				returnInfo(msg["IS_USER_ERROR2"],$parent.removeClass("hints success").addClass("error"))
				return;
			}else{
				$parent.removeClass("hints error").addClass("success")
			}
		},
		'change' : function(){
			$(this).triggerHandler("blur");
		}
	});
	//验证手机	
	fm.find("#slder_phone").bind({
		'blur' : function(){
			var $me=$(this);//当前对象
			var $parent = $(this).parents(".form-row");
			if($me.val()==""){
				returnInfo(msg["IS_MOBILE_ERROR"],$parent.removeClass("hints success").addClass("error"))
				return;
			}else if($me.val().length>11){
				returnInfo(msg["IS_MOBILE_ERROR1"],$parent.removeClass("hints success").addClass("error"))
				return;
			}else if(!/^1[3|4|5|8][0-9]\d{4,8}$/.test($me.val())){
				returnInfo(msg["IS_MOBILE_ERROR2"],$parent.removeClass("hints success").addClass("error"))
				return;
			}else{
				$parent.removeClass("hints error").addClass("success")
			}	   
		},
		'change' : function(){
			$(this).triggerHandler("blur");
		}
	});	
	//验证区域	
	fm.find("#order_arae").bind({
		'blur' : function(){
			var $me=$(this);//当前对象
			var $parent = $(this).parents(".form-row");
			if($me.val()==""){
				returnInfo(msg["IS_RESIDENCE_ERROR"],$parent.removeClass("hints success").addClass("error"))
				return;
			}else{
				$parent.removeClass("hints error").addClass("success")
			}				   
		},
		'focus' : function(){
			var $me=$(this);//当前对象
			var $parent = $(this).parents(".form-row");
			if($me.val()==""){
				returnInfo(msg["IS_RESIDENCE_ERROR"],$parent.removeClass("hints success").addClass("error"))
				return;
			}else{
				$parent.removeClass("hints error").addClass("success")
			}
		},
		'change' : function(){
			$(this).triggerHandler("blur");
		}
	});
	//验证详细地址	
	fm.find("#address").bind({
		'blur' : function(){
			var $me=$(this);//当前对象
			var $parent = $(this).parents(".form-row");
			if($me.val()==""){
				returnInfo(msg["IS_ADDESS_ERROR"],$parent.removeClass("hints success").addClass("error"))
				return;
			}else{
				$parent.removeClass("hints error").addClass("success")
			}			   
		},
		'change' : function(){
			$(this).triggerHandler("blur");
		}
	});
	$("#order_add_info").submit(function(){
		//$('.btn-primary').attr("disabled","disabled");
		fm.find("input").trigger('blur');
		fm.find("#order_arae").trigger('blur');
		var numError=$("#order_add_info .error").length;  
		 if(numError>0){  
			//$('#ord_btn').removeAttr("disabled","disabled");
			//document.getElementById("ord_btn").removeAttribute("disabled")
           return false;   
        }else{ 
        	$("#ord_btn").addClass("hidden")
        	.before('<span class="btn btn-disabled">处理中...</span>')
        return true;   	
        //$("#order_add_info").submit();
        	//var url="http://cp1.wp.com/goods/order";        	
				//url=jsRequestUrl(url)
			/*var product_id = $('#product_id').val(); 
			var quantity = $('#quantity').val();
			var consignee = $('#slder_name').val();
			var area = $('#order_arae').val();
			var address = $('#address').val();
			var phone = $('#slder_phone').val();
			var note = $('#note').val();
			var data = {product_id : product_id, quantity : quantity, consignee : consignee, area : area, address : address, phone : phone, note : note};
			$.post(url, data, function(ret){
				if (ret.errno == '0') {
					$(".modal-backdrop,#modalTips").removeClass("hidden")
					$('#ord_btn').removeAttr("disabled");
				} else {
					alert('订单提交失败,'+ret.errno);
					 $('#ord_btn').removeAttr("disabled");
				}
			}, 'json');*/
        }
		//return false;
	})
	
	
	/*“立刻购买”按钮下加上跟踪标记
	(function(){
		var urlsearch = location.href.split('?');
		if(urlsearch.length > 1){
			var frm = $("#order_add_info"), url = frm.attr('action');
			frm.attr('action' , url+'?'+urlsearch[1]);					
		}
	})();
	*/
}

function trim(str) {
	return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
}
//URL添加随机数
function jsRequestUrl(url){
	if (url.indexOf('?') == -1) {
		url = url + '?__rnd='+Math.random();
	} else {
		url = url + '&__rnd='+Math.random();
	}
	return url;
}
/**
* @create:      charry
* @rotatelist  试卷商城在线客服
* @调用方式	
	gaofen_shop_server()
*/
function gaofen_shop_server(){	
	$("#fbHandle").click(function(){		
		var $me=$('.shop-fixed');
		if($me.hasClass("fb-hide")){
			$me.removeClass("fb-hide").animate({right:0});
			$me.find("i").attr("title","收缩");
		}else{
			$me.animate({right:-162},function(){
				$(this).addClass("fb-hide");
				$(this).find("i").attr("title","展开");
			});
		}
	});
	
}
$(function(){
	$("#fbHandle").click(function(){
		$(".tips").addClass("hidden");
		$(".action").removeClass('hidden');
		var $me=$('.feedback');
		if($me.hasClass("fb-hide")){
			$me.removeClass("fb-hide").animate({right:0});
			$me.find("i").attr("title","收缩");
		}else{
			$me.animate({right:-161},function(){
				$(this).addClass("fb-hide");
				$(this).find("i").attr("title","展开");
			});
		}
	});
})
function goodshop(_error,_rst){
	
	if(_error === '100019'){
		alert('请先登录！');
		location.href = 'http://my.gaofen.com/signin?fromurl='+location.href;
	}else if (_error == '0') {
		//$(".modal-backdrop,#modalTips").removeClass("hidden")
		//$('#ord_btn').removeAttr("disabled");
		//“立刻购买”按钮下加上跟踪标记
		var url_id=$("#product_id").val(), url = "http://www.gaofen.com/result/"+url_id+".htm",
			urlsearch = location.href.split('?');
		if(urlsearch.length > 1){
			url +='?'+urlsearch[1];					
		}

		window.location.href = url;
	}else if(_error == '1'){
		window.location.href=_rst;
	} else {
		alert('订单提交失败,'+_rst);
		 $('#ord_btn').removeAttr("disabled");
	}
}