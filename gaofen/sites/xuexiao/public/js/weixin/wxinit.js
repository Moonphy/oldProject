/*!16-12-2015 16:02 weixin-config-js */
/**
 * 微信JSJDK 初始化
 *调用方式：
	1.一般页面调用(默认初始化分享功能)：
		加载此文件，然后GWX.wxready();
		全局变量：
			shareData = {
				//初始化配置
				appId: '',
			    timestamp: '',
			    nonceStr: '',
			    signature: '',
				//分享功能属性
				title: '', // 分享标题
			    desc: '', // 分享描述
			    link: '', // 分享链接
			    imgUrl: ' // 分享图标
		    }
		
	2.Gaofen框架页面调用
		GWX.wxready(config);
*/

(function(){

	var WX = {

		// isJDK : function(config, fn){
		// 	var self = this;
		// 	if(typeof wx === 'undefined'){
		// 		var script = document.createElement('script');
		// 		script.src = 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js';
		// 		script.onload = function(e){
		// 			var uri = _shareInfo.uri || location.href, uid = FN.getCookie('EV_BV_U') || 0;
		// 			self.wxready(config, fn);
		// 		};
		// 		$('body')[0].appendChild(script);
		// 	}else{
		// 		this.wxready(config, fn);
		// 	}
		// },

		/*	调用方式：

			一般页面调用：
				加载此文件，然后GWX.wxready();
				
			Gaofen框架页面调用
				GWX.wxready(config);

		*/

		wxready : function(config, fn, initFn){
			var _shareInfo;
			try{
				var pd = Gaofen.PD.get('wxconfig');
				if(typeof pd === 'object'){					
					_shareInfo = pd;
				}else{
					_shareInfo = JSON.parse(pd);
				}				
			}catch(e){}

			// alert(Gaofen.PD.get('wxconfig'))

			if(!_shareInfo &&  typeof shareData !== 'undefined'){
				_shareInfo = shareData;
			}

			if(_shareInfo && typeof wx !== 'undefined'){
			    wx.config({
				    debug: config.debug || false,
				    appId: _shareInfo.appId,
				    timestamp: _shareInfo.timestamp,
				    nonceStr: _shareInfo.nonceStr,
				    signature: _shareInfo.signature,
				    jsApiList: [
				    	'checkJsApi',
				    	'getLocation',
				    	'onMenuShareTimeline',
				    	'onMenuShareQQ',
				    	'onMenuShareAppMessage',
				        'startRecord',//开始录音接口
				        'stopRecord',//停止录音接口
				        'onVoiceRecordEnd',//监听录音自动停止接口
				        'playVoice',//播放语音接口
				        'pauseVoice',//暂停播放接口
				        'stopVoice',//停止播放接口
				        'onVoicePlayEnd',//监听语音播放完毕接口
				        'uploadVoice',//上传语音接口
				        'downloadVoice',//下载语音接口
				        'chooseImage',
				        'previewImage',
				        'uploadImage'
				      ]
			    });
			    wx.error(function(res){			    				    		
		    		setTimeout(function(){
		    			var wxerror = document.getElementById('wxerror');
		    			if(wxerror){
		    				wxerror.style.display = 'block';
		    			}
		    		}, 100);			    		
			    });	
			    wx.ready(function () {			    	
					var _config = config;
					if(!config){
						config = _shareInfo;
					}
					if(initFn){
						initFn(config);
					}else{
						wx.onMenuShareAppMessage(config);
						wx.onMenuShareTimeline(config);
						wx.onMenuShareQQ(config);
					}
					if(fn) fn();
				});
			}
		}
	}

	window.GWX = WX;

})();
