/**
 * Created by zhiwen on 2015-5-27.
 * 微信支付
 */
 
(function($, win, G){
    
		var FN = G.FN = {

			Tips : function(isShow, msg){
				$('#ui_tips').display(isShow).text(msg||'');
				$('body').addClass('show-tips');
			},

			loadWxJDK : function(fn){
				var wcon = G.PD.get('wxconfig');
				// alert(wcon)
				if(!wcon) return;
				try{
					wcon = JSON.parse(wcon);
				}catch(e){}
				// alert(wcon.timestamp)
				var script = document.createElement('script');
				script.src = 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js';
				script.onload = function(e){
					  wx.config({
					    debug: false,
					    appId: wcon.appId,
					    timestamp: wcon.timestamp,
					    nonceStr: wcon.nonceStr,
					    signature: wcon.signature,
					    jsApiList: [
					    	'checkJsApi',
					    	// 'getLocation',
					        'onMenuShareAppMessage',
					        'chooseWXPay'
					      ]
					  });

					wx.ready(function () {
						if(fn) fn();
					});
					
				};
				$('body')[0].appendChild(script);
				FN.loadWxJDK = null;
			}
		};


		$(function(){
				var config = JSON.parse(G.PD.get('wxPayCfg'));

				var gofn = function(res){
					if(res instanceof String)
			    		res = JSON.pares(res);
			    	try{
			    		var params = [];
			    		for(var k in res){
			    			params.push(k+'='+res[k]);
			    		}
			    	}catch(e){}
			    	var uri = G.PD.get('callback');
			    	if(uri.indexOf('?') > -1){
			    		uri += '&'+ params.join('&');
			    	}else{
			    		uri += '?'+params.join('&');
			    	}
			    	setTimeout(function(){location.href = uri;}, 1000);
				    
				 // alert(G.PD.get('wxPayCfg'))
				}
				if(FN.loadWxJDK){
					// shareLock = true;
					FN.loadWxJDK(function(e){
						 // alert('loadWxJDK')
						wx.chooseWXPay({
							timestamp: config.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
						    nonceStr: config.nonceStr, // 支付签名随机串，不长于 32 位
						    package: config.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
						    signType: config.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						    paySign: config.paySign, // 支付签名
						    success: function (res) {
						    	gofn(res);
						        // alert('paysuccess:'+JSON.stringify(res))
						    },
						    cancel : function(res){
						     	gofn(res);
						    },
						    fail : function(res){
						    	alert('支付异常，请重新重试!');
						    	gofn(res);
						    	// alert(JSON.stringify(r))
						    }
						});
					});
				}else{
					//shareBack(true);
				}
			

		});

})(Zepto, window, Gaofen);