/**
 * Created by zhiwen on 2015-10-19.
 * 微信record功能
 */
"use strict";

(function($, win, G){

	var template = {
		welcomepopup : ['<div class="popup" id="wpopup">',
					    '<div class="popup-wrap">',
					        '<div class="popup-content">',
					            '<p>{.content}</p>',
					            '<img src="http://file.gaofen.com/html/weixin/voice/img/doujihuascan.png" alt=""/>',
					        '</div>',
					        '<a class="close popup-btn" href="#">关闭</a>',
					        '<a class="turn popup-btn hidden" href="#">跳转</a>',
					    '</div>',
					'</div>'].join('')
	}

	var FN = G.FN = {

		_getValue:function(offset) {
	        var endstr = document.cookie.indexOf (";", offset);
	        if (endstr == -1) {
	            endstr = document.cookie.length;
	        }
	        return unescape(document.cookie.substring(offset, endstr));
	    },

 		getCookie : function(name){
			var arg = name + "=", alen = arg.length, clen = document.cookie.length, i = 0;
	        while (i < clen) {
	            var j = i + alen;
	            if (document.cookie.substring(i, j) == arg) {
	                return this._getValue(j);
	            }
	            i = document.cookie.indexOf(" ", i) + 1;
	            if (i == 0) break;
	        }
	        return "";
		 },

		// setCookie : function(name, value, expireMin) {
		// 	var exp  = new Date();    //new Date("December 31, 9998");
		// 	exp.setTime(exp.getTime() + expireMin*60*1000);
		// 	document.cookie = name + "="+ escape(value) +";expires="+ exp.toGMTString();
		// },

		//显示提示层，mustShow为必需显示
		popup : function(key, content, mustShow){
			if(localStorage.getItem(key) && mustShow !== true) return;
			if($.type(content) === "string") content = {'content' : content};
			var jqpop = $(G.util.parse(template.welcomepopup, content)).appendTo('body');
			jqpop.find('.close').on('click', function(e){
				e.preventDefault();
				jqpop.display(0);
			});
			if(mustShow !== true)localStorage.setItem(key, 1);
		},

		test : function(msg){
			$('.duration').text(msg || '');
		},

		Tips : function(isShow, msg){
			$('#ui_tips').display(isShow).text(msg||'');
			$('body').addClass('show-tips');
		},

		waiting : function(e){
			$('#ui_waiting').display(e);
		},

		loadWxJDK : function(fn, shareInfo){

			if(typeof wx === 'undefined'){

				setTimeout(function(){
					FN.loadWxJDK(fn, shareInfo);
				}, 50);
				return;
			}
			var wcon = G.PD.get('wxconfig');
			if(!wcon) return;
			try{
				wcon = JSON.parse(wcon);
			}catch(e){}

			//分享内容由
			var _shareInfo = G.PD.get('shareData');
			try{
				_shareInfo = JSON.parse(_shareInfo);
			}catch(e){}
			// var script = document.createElement('script');
			// script.src = 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js';
			// script.onload = function(e){
				var uri = _shareInfo.uri || location.href, uid = FN.getCookie('EV_BV_U') || 0;
				if(uri.indexOf('?') > -1){
					if(uri.indexOf('inviter_uid=')>-1){						
						uri = uri.replace(/inviter_uid=[a-zA-Z0-9]+/, 'inviter_uid='+uid);
					}else{
						uri += ('&inviter_uid='+uid);
					}					
				}else{
					uri += ('?inviter_uid='+uid);
				}
				var info = {
					    title: _shareInfo.title, // 分享标题
					    desc: _shareInfo.desc || _shareInfo.title, // 分享描述
					    link: uri, // 分享链接
					    imgUrl: _shareInfo.img, // 分享图标
					    success: function () { 
					        shareInfo.fn && shareInfo.fn();
					    },
					    cancel: function () { 
					        // 用户取消分享后执行的回调函数
					    }
					}
				wx.ready(function () {
					wx.onMenuShareAppMessage(info);
					wx.onMenuShareTimeline(info);
					if(fn) fn();
				});
				  wx.config({
				    debug: false,
				    appId: wcon.appId,
				    timestamp: wcon.timestamp,
				    nonceStr: wcon.nonceStr,
				    signature: wcon.signature,
				    jsApiList: [
				    	'checkJsApi',
				    	// 'getLocation',
				    	'onMenuShareTimeline',
				    	'onMenuShareAppMessage',
				        'startRecord',//开始录音接口
				        'stopRecord',//停止录音接口
				        'onVoiceRecordEnd',//监听录音自动停止接口
				        'playVoice',//播放语音接口
				        'pauseVoice',//暂停播放接口
				        'stopVoice',//停止播放接口
				        'onVoicePlayEnd',//监听语音播放完毕接口
				        'uploadVoice',//上传语音接口
				        'downloadVoice'//下载语音接口
				      ]
				  });
				
			// };
			// $('body')[0].appendChild(script);
			FN.loadWxJDK = null;
		}

	};

	/*---------------------- 播放录音 -----------*/
	var endfn = function(e, audioDom, dot){
		if(!audioDom){
			audioDom = e.target;
			$(e.target.nextElementSibling).display(0);
		}else{
			$(dot).display(0);
		}
		audioDom.parentNode.style.background = "#e5e5e5";
        audioDom.style.display = "none";
        try{
    		audioDom.parentElement.parentNode.previousElementSibling.style.backgroundPositionY = "-6px";
        }catch(e){}
    }

	var playVoice = function(audioDom, fn){
        var dot = audioDom.nextElementSibling;
        if(audioDom.paused){
            audioDom.play();
            audioDom.parentNode.style.background = "#ffffff";
            $(dot).display(1);
            try{
            	audioDom.parentElement.parentNode.previousElementSibling.style.backgroundPositionY = "0px";
            }catch(e){}
        }else{
            audioDom.pause();
            endfn('', audioDom, dot);
        }

        audioDom.removeEventListener('ended', endfn, false);
        audioDom.addEventListener('ended', endfn, false);
	};


	/*---------------- 播放录音结束 -----------*/
	G.actions.reg('play', function(evt, obj){
		var dom = $(obj.target);
		playVoice(dom.find('audio')[0]);
	}).reg('like', function(evt, obj){
		var dom = $(obj.target), id = obj.id, type = obj.type;
		if(!dom.hasClass('icon-like-hand')) return;
		dom.data('lock', 1);
		G.Ajax.send(G.PD.get('uri').dofav, {
			id : id,
			code: G.FN.Verify.code
		}, function(res){
			G.FN.Verify.code = '';
			dom.data('lock', 0);
			if($.type(res) !== 'object'){
        		res = JSON.parse(res);
        	}
        	if(res.errno == '0'){
        		var uid = FN.getCookie('EV_BV_U');
						// if(uid){				
						// 	FN.popup('like-'+uid, '感谢您的点赞！<br/>想要幸运奖30元吗？长按识别下方二维码即可');
						// }
        		if(type === 'view'){//详细页
        			dom.removeClass('icon-like-hand').text('已点赞');
        			return;
        		}
        		var parent = dom.parent();
						var total = parent.find('.total').text();
						parent.addClass('had-like')
						dom.removeClass('icon-like-hand')
						.text('已点赞')
						.parent().find('.total').text(Number(total)+1);
				
        	}else if(res.errno == '-10006'){
        		G.FN.Verify.show(1, function(code){
        			dom.trigger(G.eventType);
        		});
        	}else if(res.errno == '100001'){
        		location.href = G.PD.get('uri').login;
        	}else{
        		alert(res.err||'操作失败！');
        	}
		})
	});

	$(function(){


	  //验证码浮层
	  (function(){
	  	var verifyCode = $('#verifyCode'), verifyCodeMask = $('#verifyCodeMask'),
	  		iptDom = verifyCode.find('input.gfcmt-ipt'),
	  		tipDom = verifyCode.find('.gfcmt-tips'),
	  		imgDom = verifyCode.find('img'),
	  		clock = false,
	  		callback = '',
	  		urls = G.PD.get('uri');
	  	var Verify = {
	  		code: '',
	  		show: function(p, fn){
	  			if(p){
	  				Verify.changeCode();
	  			}
	  			verifyCode.display(p);
	  			verifyCodeMask.display(p);
	  			if(p){
	  				callback = fn || '';
	  			}
	  		},
	  		changeCode: function(){
	  			imgDom.attr('src', urls.captchaImg+'?'+(+new Date));
	  			iptDom.val('');
	  		}
	  	}
	  	var cancel = verifyCode.find('.gfcmt-btn-cancel'), 
	  	sub = verifyCode.find('.gfcmt-btn-submit');
	  	cancel.on('click', function(e){
	  		Verify.show(0);
	  	})
	  	iptDom.on('click', function(e){
	  		tipDom.display(0);
	  	})
	  	sub.on('click', function(e){
	  		if(clock === true) return;
	  		clock = true;
	  		var v = $.trim(iptDom.val());
	  		if(v){
						G.Ajax.send(urls.captchaCheck, {
							code : v
						}, function(res){
							clock = false;
							if($.type(res) !== 'object'){
				        		res = JSON.parse(res);
				        	}
							if(res.errno == '0'){
								Verify.show(0);
								Verify.code = v;
								callback && callback(v);
								callback = '';
							}else{
								tipDom.display(1);
								Verify.changeCode();
							}
						});
	  		}
	  	});
	  	imgDom.on('click', function(e){
	  		Verify.changeCode();
	  	})
	  	G.FN.Verify = Verify;
	  })();

		// (function(){
		// 	var uid = G.PD.get('welcomeID') || FN.getCookie('EV_BV_U'), content = G.PD.get('welcomeTips'),
		// 		mustShow = G.PD.get('mustShow');
		// 	if(uid && content){
		// 		FN.popup('welcome-'+uid, {
		// 			content : content
		// 		}, mustShow);
		// 	}
		// })();


		//模拟点击效果
		$('#nav-menu').on('tap', 'a', function(e){
			var target  = e.target.tagName.toLowerCase() === 'a' ? $(e.target) : $(e.target).closest('a');
			target.addClass('active');
			setTimeout(function(){target.removeClass('active')}, 500);
		});	

		// var wcon = JSON.parse(wcon);

		var shareInfo = { 
					// wxPageTitle : '中国豆娃好声音开唱中，你家豆娃参赛了吗？', // 分享标题
					// wxPageDesc : '中国豆娃好声音开唱中，你家豆娃参赛了吗？', // 分享描述
					// wxPageImg : 'http://file.gaofen.com/dou.jpg'// 分享图标
				};
				// alert(FN.getCookie('EV_BV_U'))
		switch(G.PD.get('router')){
			case 'index'://首页
				FN.loadWxJDK('', shareInfo);

				G.event();
				var page = 0, 
					loadding = false, allPage = 1000,//设一个无限大的数
					showLoad = function(p){
						loadding = p;
						$('#loading').display(p);
						if(p){
							// $('#moreList').display(false);
							G.Ajax.send(G.PD.get('uri').moresection, {
								page : ++page
							}, function(res){
								if($.type(res) !== 'object'){
					        		res = JSON.parse(res);
					        	}
								if(res.errno == '0'){
									var html = res.rst.html;									
									$('.main-wrap').append(res.rst.html);
									if(html == ''){//已没有数据时隐藏下拉
										allPage = page;
										$(window).unbind('scroll', nextPage);
									}
								}
								showLoad(false);
							});
						}else{
							// if(page < allPage){
							// 	$('#moreList').display(1);
							// }
						}
					};


				var nextPage = function(){
						if(allPage > page && loadding === false ){
							var scroll = $('body').scrollTop(), bh = $('html').height(), wh = $(window).height();
							if(scroll + wh + 100 > bh){
								showLoad(true);
							}
						}
				}
				if(allPage > page){	
					$(window).on('scroll', nextPage);

					/*--------第一次加载下一页----------*/
					// var touchY = '',
					// touchmove = function (e) {
			  //           var touch = e.touches[0];
			  //           touchY = touch.pageY-touchY;
			  //           e.preventDefault();
			  //       }, touchend = function(){
			  //      		if(touchY < -18){
			  //      			$('html')[0].removeEventListener('touchend', touchend);
			  //      			$('html')[0].removeEventListener('touchmove', touchmove);
			  //           	showLoad(true);
			  //           }
			  //       }
			  //       $('html')[0].addEventListener('touchstart', function (e) {
					// 	touchY = e.touches[0].pageY;
					// });
			  //       $('html')[0].addEventListener('touchmove', touchmove);
			  //       $('html')[0].addEventListener('touchend', touchend);
			        /*--------第一次加载下一页结束----------*/
				}
			break;
			case 'rank' : 

				// FN.loadWxJDK('', shareInfo);
				// G.event();
			case 'view' :
				// shareInfo.wxPageTitle = '中国豆娃好声音开唱中，请您为豆娃转身！';
				// shareInfo.wxPageDesc = '中国豆娃好声音开唱中，请您为豆娃转身！';
				FN.loadWxJDK('', shareInfo);
				G.event();
			break;
			case 'rule':
				FN.loadWxJDK('', shareInfo);
				// G.event();
				var lock = false, btn = $('#btn'), jqmsg = $('#msg');
				btn.on('click', function(e){
					e.preventDefault();
					$('#msg').display(0);
					if(lock) return;					
					var tel = $.trim($('#tel').val());
					if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(tel)){
						if(tel !== ''){
				    	$('#msg').display(1).find('span').text('请正确输入手机号');
				    }
						$('#tel').focus();
						return;
					}
					var guess = $.trim($('#guess').val())
					// if(guess === ''){
					// 	$('#msg').display(1).find('span').text('输入预测冠军姓名');
					// 	return;
					// }
					lock = true;
					G.Ajax.send(G.PD.get('uri').submitinfo, {
						phone : tel,
						guess: guess
					}, function(res){
						if($.type(res) !== 'object'){
			        		res = JSON.parse(res);
			        	}
			        	if(res.errno == '0'){
			        		btn.parent().append('<b>您已成功登记手机，如有疑问请主动联系微信客服</b>');
			        		$('#tel').remove();
			        		$('#guess').remove();
			        		$('#msg').remove();
			        		btn.remove();
			        	}else{
			        		$('#msg').display(1).find('span').text('提交失败');
			        	}
			        	lock = false;
					})
				});
			break;
			case 'record'://录音页面
				var localId, wxInit;
				var voice = G.PD.get('voice'), record_wrap = $('#record_wrap'),
					myaudio = record_wrap.find('#myaudio'),
					btn_recording = $('#btn-recording'),
					btn_reset = $('#btn-reset'),
					btn_comment = $('#btn-commit'),
					record_tips = $('#record_tips'),
					isRcorded = null,
					voiceStoped = true,
					vtxt = '还没生成录音作品';
				var setVoice = function(voiceObj){
						if(voiceObj.link){
							// record_wrap.find('#myaudio').attr('src', 'http://dev.record.gaofen.com/static/src/EricClapton-Layla.mp3'||voiceObj.link).parent().display(1);
							record_wrap.find('#myaudio').attr('src', voiceObj.link).parent().display(1);
							record_wrap.find('.duration').text(Math.ceil(voiceObj.times/1000)+" ''");
							record_wrap.find('.audio-wrap').show();
							if(isRcorded === null) {
								btn_recording.text('按住重新录音').display(1);
								record_tips.display(1);
								btn_comment.display(0);
								btn_reset.display(0);
							}else{
								btn_recording.display(0);
								record_tips.display(0);
								btn_comment.display(1);
								btn_reset.display(1);
							}
						}else{
							record_wrap.find('#myaudio').parent().display(0);
							record_wrap.find('.duration').text(vtxt);
							btn_recording.text('按住录音').display(1);
							record_tips.display(1);
							btn_comment.display(0);
							btn_reset.display(0);
						}
					};

					
					record_wrap.display(1);
					setVoice(voice);

				//防止出现”复制链接“
				var beforeReady = function(e){
					e.preventDefault();
				}				
				btn_recording.on('touchstart', beforeReady);
				

				FN.loadWxJDK(function(){
					btn_recording.unbind('touchstart', beforeReady);

					$('#myaudio_parent').on('tap', function(){
						var src = myaudio.attr('src');
						if(src === '#'){
							if(voiceStoped){
								wx.playVoice({
								    localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
								});
								voiceStoped = false;
							}else{
								wx.stopVoice({
									localId: localId // 需要停止的音频的本地ID，由stopRecord接口获得
								});
								voiceStoped = true;
							}
						}else{
							playVoice(myaudio[0]);
						}					
					});
					btn_reset.on('tap', function(){
						isRcorded = null;
						// playVoice(myaudio[0]);
						myaudio[0].pause();
						setVoice(voice);
						localId = '';
						touchTime = '';
					});


					var touchTime;
					//这个接口没有触发
					wx.onVoiceRecordEnd({
					    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
					    complete: function (res) {
					    	// alert('onVoiceRecordEnd')
					        localId = res.localId; 
					        // FN.test('超时。。。。。。。')
					    }
					});

					wx.onVoicePlayEnd({
					    success: function (res) {
					        voiceStoped = true;
					    }
					});

					var setTimer = null, recordTimer, cutRecord = false, 
					recordFn = function(){//计算录音时间
						var s = +new Date - touchTime;
						if(s > 1000*60){//60秒自动停止
							touchend();
							cutRecord = true;
						}else{
							FN.test('正在录音：'+ Math.ceil(s/1000)+"’’");
						}
					},
					startRecord = function(){//解决微信短录音bug
						FN.test('正在录音：1’’');
						btn_recording.text('').addClass('btn-recording');
						recordTimer = setInterval(recordFn, 1000);
						wx.startRecord();
					},
					touchend = function(){
						if(touchTime === '') return;
						btn_recording.removeClass('btn-recording');
						touchTime = +new Date - touchTime;
						if(touchTime <  100){
							clearTimeout(setTimer);
							touchTime = '';
							setTimer = null;
							return;
						}
						clearInterval(recordTimer);

						//不正常操作引起的时间超过允许值时处理
						// if(touchTime > 61000){
						// 	touchTime  = 8000;
						// }
						wx.stopRecord({
						    success: function (res) {
						    	// FN.test('success')
						        localId = res.localId;
						        if(touchTime > 1000){
						        	isRcorded = true;
						        	setVoice({
						        		link : '#',
						        		times : touchTime
						        	});
						        	// touchTime = '';
							    }else{						    	
							    	localId = '';
							    	setVoice(voice);
							    	FN.test('录音时间太短');
							    	touchTime = '';
							    }							    
						    }
						})
						touchcancel = false;
					};
					btn_recording[0].addEventListener('touchstart', function(e){
						e.preventDefault();		
						if(touchcancel) return;				
						touchTime = touchTime || (+new Date);
						setTimer = setTimeout(startRecord, 100);
					}, false);

					btn_recording[0].addEventListener('touchend', function(){						
						if(cutRecord === true){
							cutRecord = false;
							return;
						}
						touchend();
					}, false);


					//处理特殊机型，长按只触发touchcancel不触发touchend事件问题
					var  touchcancel = false;
					btn_recording[0].addEventListener('touchcancel', function(e){	
						touchcancel = true;	
						btn_recording.text('再按一次停止！');
					}, false);

					//保存录音
					btn_comment.on('tap', function(e){
						e.preventDefault();
						if(localId && touchTime){
							wx.uploadVoice({
							    localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
							    isShowProgressTips: 1, // 默认为1，显示进度提示
							    success: function (res) {
							        var serverId = res.serverId; // 返回音频的服务器端ID
							        // FN.test(G.PD.get('uri').upload)
							        G.Ajax.send(G.PD.get('uri').upload, {
							        	media_id : serverId, 
							        	sec : touchTime
							        }, function(res){
							        	if($.type(res) !== 'object'){
							        		res = JSON.parse(res);
							        	}
							        	if(res.errno == '0'){
							        		location.href = G.PD.get('uri').view;
							        	}else{

							        	}
							        });
							        touchTime = '';
							    }
							});
						}
					});
				},shareInfo);
			break;
		};

	});


})(Zepto, window, Gaofen);