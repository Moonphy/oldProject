/**
 * Created by zhiwen on 2016-01-20.
 * 贺卡
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
		},

	/*---------------------- 播放录音 -----------*/
	endfn = function(e, audioDom, dot){
		if(!audioDom){
			audioDom = e.target;
			$(e.target.nextElementSibling).find('span').removeClass('play');
		}else{
			// $(dot).display(0);
		}
		
    },

	playVoice = function(audioDom, fn){
        var dot = audioDom.nextElementSibling;
        if(audioDom.paused){
            audioDom.play();
            $(dot).find('span').addClass('play');
        }else{
            audioDom.pause();
            $(dot).find('span').removeClass('play');
            endfn('', audioDom, dot);
        }

        audioDom.removeEventListener('ended', endfn, false);
        audioDom.addEventListener('ended', endfn, false);
	},


    //头像上方显示随机气泡     
    popupTips = function (allPage, allItems){
    	var silders = $('#silder ul li');
    	var tips = ['聪明又伶俐','有缘即是福','身体棒棒哒','年年考高分'], timer = 2500, setTimer = null, page = 1, allPage = allPage || 2, allItems = allItems || 20;
        return {
        	getTips : function(){
        		var len = tips.length;
        		return tips[Math.floor(Math.random(1)*4)];
        	},
        	getIndex : function(){
            	var fristIndex = page - 1, overItem = allItems % 10;
        		if(overItem === 0){
        			overItem = 10;
        		}
            	if(fristIndex > 0 ){
            		fristIndex = 10 * (fristIndex);
            		if(page < allPage){
            			return fristIndex + Math.floor(Math.random(1)*10);
            		}else{
						return fristIndex + Math.floor(Math.random(1)*overItem);
            		}
            	}else{	
            		if(fristIndex === 0 && allItems > 10) overItem = 10;              		
            		return Math.floor(Math.random(1)*overItem);
            	}
            },
            run : function(_page, _allPage, _allItems, isHide){
            	if(_page !== undefined) page = _page;
            	if(_allPage !== undefined) allPage = _allPage;
            	if(_allItems !== undefined) allItems = _allItems;

            	var text = this.getTips(), 
            		index = this.getIndex();
            	this.display(1, text, silders.eq(index), isHide);	                	
            },

            display : function(p, text, dom, isHide){
            	clearTimeout(setTimer);

            	var self = this;
            	if(p){
            		var offset = dom.offset(), top = offset.top;
            		// if(top > 400){
            		// 	top = top - 129;
            		// }
            		// // if(isHide === 'hide'){
            		// // 	p = false;
            		// // }
            		// $('#popupTips').text(text).offset({
            		// 	top : top -25,
            		// 	left : offset.left  + 18
            		// }).display(p);
            		$('#popupTips').text(text).css({'top':top - $('.show-hongbao').offset().top - 25, 'left': offset.left}).display(p);
            		setTimer = setTimeout(function(){
            			self.run();
            			} , timer);
            	}else{
            		$('#popupTips').display(0);
            	}
            }
        }
    },
                

	/*---------------- 播放录音结束 -----------*/

	FN = {
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
			$('.duration').html(msg || '');
		},

		Tips : function(isShow, msg){
			$('#ui_tips').display(isShow).text(msg||'');
			$('body').addClass('show-tips');
		},

		longTap : function(dom, uri){
			var longer = 400, _long = null, 
			longfn = function(e){
           		// location.href = uri || '#';
           	   dom.addClass("scale-big");
	           dom.addClass('active').parent().find('.ui-tips').css({'visibility':'hidden'});
               return true;
	       	};
	       	dom.on('touchend', longfn);
	       	return;

	        dom.on('touchstart', function(e){
	           _long = setTimeout(longfn, longer);
	           dom.addClass('active').parent().find('.ui-tips').css({'visibility':'hidden'});
	           e.preventDefault();
	        }).on('touchend', function(e){
               clearTimeout(_long);
               dom.removeClass("active").parent().find('.ui-tips').css({'visibility':'visible'});
           })
		},

		getImage : function(isrc, fn){					
	        var Img = new Image();  
	        Img.onload = function (){
	            fn && fn();
	        }
	        Img.src = isrc;
	    },

	    loadImage : function(imgs){
	    	$.each(imgs, function(i, item){
	    		var jq = $(item).find('img'), src = jq.attr('_src');
	    		if(src){
	    			jq.attr('src', src);
	    			jq.removeAttr('_src');
	    		}
	    	});
	    }
	},

	weixinReadyCallback;

	$(function(){
		var router = G.PD.get('router');
		switch(router){
			case 'index':
				FN.longTap($('#touchStrart'), G.PD.get('link').loginLink);
				break;
			case 'index2':
				FN.longTap($('#touchStrart'), G.PD.get('link').loginLink);
				var indexBg = $(".index-bg");
				FN.getImage(indexBg.attr('src'), function(){
					var img_head_h = indexBg.height();
	                var _h = 0 - img_head_h / 2;
	                $(".user-wrap").animate({marginTop: _h}, 'fast');
				});

				// $('.greeting').animate({height: "18.8rem"}, 2000);
	   //          $('.greetings').animate({height: "19rem"}, 2000);
	   				// $('.greeting').css('height', '18.8rem');
	   				// $('.greetings').css('height', '19rem');
			break;
			case 'makeCard':
				if(G.PD.get('isEnd') === 'true'){//活动已结果
					$('#houdongEnd').display(1);
					return;
				}
				// var _shareInfo = G.PD.get('wxconfig');
				// if(!_shareInfo) return;
				var localId, wxInit,voice = G.PD.get('voice'), record_wrap = $('#record_wrap'),
				myaudio = record_wrap.find('#myaudio'),
				myaudio_parent = $('#myaudio_parent'),
				btn_recording = $('#btn-recording'),
				btn_reset = $('#btn-reset'),
				btn_comment = $('#btn-commit'),
				btn_cancel = $('#btn-cancel'),
				record_tips = $('#record_tips'),
				isRcorded = null,
				voiceStoped = true,
				vtxt = '让您的孩子<br>说句元宵的吉祥话吧';
				var setVoice = function(voiceObj){
						if(voiceObj.link){
							// record_wrap.find('#myaudio').attr('src', 'http://dev.record.gaofen.com/static/src/EricClapton-Layla.mp3'||voiceObj.link).parent().display(1);
							record_wrap.find('#myaudio').attr('src', voiceObj.link).parent().display(1);
							FN.test(vtxt);
							record_wrap.find('.audio-wrap').show();
							if(isRcorded === null) {
								btn_recording.text('按住重新录音').display(1);
								record_tips.display(1);
								btn_comment.display(0);
								btn_reset.display(0);
								btn_cancel.display(1);
								record_wrap.find('#record_time').display(0);
								$('#recordTxtTip').display(1);
							}else{
								record_wrap.find('#record_time').display(1).text(Math.ceil(voiceObj.times/1000)+" ''");
								btn_recording.display(0);
								record_tips.display(0);
								btn_comment.display(1);
								btn_reset.display(1);
								btn_cancel.display(0);
								$('#recordTxtTip').display(0);
								setRecordBtn(false);
								// myaudio_parent.on('tap', listenFn);
							}
						}else{
							record_wrap.find('#myaudio').parent().display(1);
							if(vtxt) FN.test(vtxt);
							btn_recording.text('按住录音').display(1);
							record_tips.display(1);
							btn_comment.display(0);
							btn_reset.display(0);
							btn_cancel.display(1);
							record_wrap.find('#record_time').display(0);
							$('#recordTxtTip').display(1);
						}
					};

					
					record_wrap.display(1);
					setVoice({});

				//防止出现”复制链接“
				var beforeReady = function(e){
					e.preventDefault();
				}				
				myaudio_parent.on('touchstart', beforeReady);



				var setTimer = null, recordTimer, cutRecord = false, touchTime,
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
						myaudio_parent.addClass('active');
						wx.startRecord();
					},
					touchend = function(){
						myaudio_parent.removeClass('active');
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
					},

				setRecordBtn = function(isAdd){


					myaudio_parent[isAdd ? 'unbind' : 'on']('tap', listenFn);

					var _event = isAdd ? 'addEventListener' :  'removeEventListener';

					myaudio_parent[0][_event]('touchstart', recordFnStart, false);

					myaudio_parent[0][_event]('touchend', recordFnEnd, false);
					//处理特殊机型，长按只触发touchcancel不触发touchend事件问题
					myaudio_parent[0][_event]('touchcancel', recordFnCancel, false);


				},

				resetFN = function(){
					isRcorded = null;
					myaudio[0].pause();
					setVoice({});
					localId = '';
					touchTime = '';
					setRecordBtn(true);
				},

				listenFn = function(){
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

					myaudio_parent.find('span').addClass('play');

				},
				recordFnStart = function(e){
					e.preventDefault();		
					if(touchcancel) return;				
					touchTime = touchTime || (+new Date);
					setTimer = setTimeout(startRecord, 100);
				},
				recordFnEnd = function(){				
					if(cutRecord === true){
						cutRecord = false;
						return;
					}
					touchend();
				},
				touchcancel = false,
				recordFnCancel = function(e){	
					touchcancel = true;	
					btn_recording.text('再按一次停止！');
				};
				

				weixinReadyCallback = function(){
					myaudio_parent.unbind('touchstart', beforeReady);

					btn_reset.on('tap', resetFN);
					
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
					    	myaudio_parent.find('span').removeClass('play');
					        voiceStoped = true;
					    }
					});

					setRecordBtn(true);

					//保存录音
					var saveLock = false;
					btn_comment.on('tap', function(e){
						e.preventDefault();
						if(saveLock) return;
						saveLock = true;
						if(localId && touchTime){
							btn_reset.unbind('tap');
							wx.uploadVoice({
							    localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
							    isShowProgressTips: 1, // 默认为1，显示进度提示
							    success: function (res) {
							        var serverId = res.serverId; // 返回音频的服务器端ID
							        // FN.test(G.PD.get('uri').upload)
							        G.Ajax.send(G.PD.get('link').saveLink, {
							        	media_id : serverId, 
							        	sec : touchTime
							        }, function(res){
							        	if($.type(res) !== 'object'){
							        		res = JSON.parse(res);
							        	}
							        	if(res.errno == '0'){
							        		resetFN = function(e){
							        			e.preventDefault();
							        		}
							        		location.href = G.PD.get('link').shareLink;
							        	}else{
							        		saveLock = false;
							        		btn_reset.on('tap', resetFN);
							        		alert(res.err);
							        	}
							        },'post');
							        touchTime = '';
							    }
							});
						}
					});
				};

			break;
			case 'shareCard':
				$(".btn-share").on('tap', function () {
					if(G.PD.get('isEnd') === 'true'){//活动已结果
						$('#houdongEnd').display(1);
						return;
					}
	                $('.share-tips').toggleClass('hidden');
	            });
	            $('#hongbao_lists').find('.mask-btn').on('tap', function(e){
                	e.preventDefault();
                	$('#hongbao_lists').display(0);
                })
                $('.share-tips').on('tap', function(e){
                	$(this).display(0);
                })
			case 'card':

				var myaudio = $('#myaudio'), config = G.PD.get();

            	$('#cardUserhead, .audio-wrap').on('tap', function(e){
            		playVoice(myaudio[0]);
            	});
				if(router === 'card'){//看别人的卡
					if(G.PD.get('isEnd') === 'true'){//活动已结果
						$('#houdongEnd').display(1);
						return;
					}
					setTimeout(function(){$('#cardUserhead').trigger('tap')}, 500);
					if(config.favStatus === 'true'){
						if(config.redpackStatus === ''){//发了红包时不显示发红包按钮,空才显示
							if(config.drawStatus !== ''){//已点赞
								// $('#hongbaoLayer button').last().display(0);
							}
						}
						if(config.drawStatus === ''){//发了红包未领奖
							$('#lingHongbao').display(1);
						}
					}
					var hongbaoResult = $('#hongbaoResult');
					hongbaoResult.find('a.mask-btn').on('tap', function(e){
						hongbaoResult.display(0);
					})
				} else {//看自己的卡
					if(config.isEnd !== 'true'){//活动未结束
						if(config.drawStatus === ''){//录了音未领奖
							$('#lingHongbao').display(1);
						}
						var hongbaoResult = $('#hongbaoResult');
						hongbaoResult.find('a.mask-btn').on('tap', function(e){
							hongbaoResult.display(0);
						})
					}
				}

				// 测试数据
				// var ul = $('#silder').find('ul'), lis = ul.find('li').eq(0);
				// for(var i=0;i<20;i++)
				// 	ul.append(lis.clone())


				var silderPopup;
				FN.getImage($('.index-bg').attr('src'), function(e){
					var img_head_h = $(".index-bg").height();
	                var _h = img_head_h / 4 * 3;
	                $(".user-wrap").animate({marginTop: -_h}, 'fast');
	                var len = $('#silder ul li').length;
	                if($('#silder').length) {
    	                silderPopup = popupTips(Math.ceil(len / 10), len);
    	                silderPopup.run();
    	            }
				});

				// var h = 0, gh = 0;
				// var animateFN = function(){
				// 	var v = Number($('.greeting').height().replace('.rem', '')), isChange = false;
				// 	if(v < 18.8){

				// 		h = h+0.1;
				// 		$('.greeting').css('height', h+'rem');
				// 		isChange = true;
				// 	}
				// 	if(gh < 19){
				// 		gh = gh+0.1;
				// 		$('.greetings').css('height', gh+'rem');
				// 		isChange = true;	
				// 	}
				// 	if(isChange){
				// 		// requestAnimationFrame(animateFN);
				// 	}
				// }
				// animateFN();
					
	   				// $('.greeting').css('height', '18.8rem');
	   				// $('.greetings').css('height', '19rem');

				// $('.greeting').eq(1).animate({height: "18.8rem"}, 2000);
	   //          $('.greetings').eq(1).animate({height: "19rem"}, 2000);



	            var silder = $('#silder'), ul = silder.find('ul'), lis = ul.children(), len = lis.length;
	            if(len > 10){
					var avatar_w = lis.eq(0).width();
		            $(".avatar-groups li").height(avatar_w);
		            var _a_h = avatar_w * 2 +1;
		            silder.height( _a_h);
		            lis.height(avatar_w);
		            var lineNum = 5, doubleNum = lineNum * 2, ishtml = [],
		            	lines = Math.ceil(len / doubleNum), isparent = silder.parent().find('.dot-groups');
		            ul.height(_a_h * lines);
		            for(var i=0;i<lines;i++){
		            	if(i === 0){
		            		ishtml.push('<i class="dot active"></i>');
		            	}else{
		            		ishtml.push('<i class="dot"></i>');
		            	}            	
		            }
		            isparent.html(ishtml.join(''));

	                var index = 0, timer = 2500, setTimer = null,  bs = isparent.find('i'),
	                	run  = function(direction, auto, nindex){
		                    var px = '';
		                    if(nindex !== undefined){
		                        px = screen.width*-1*nindex;
		                        bs.eq(index).removeClass('active');
		                        bs.eq(nindex).addClass('active');
		                        index = nindex;
		                    }else{

		                        if(direction === 'left'){
		                            if(index < lines -1){
		                                bs.eq(index).removeClass('active');
		                                bs.eq(++index).addClass('active');
		                                px = _a_h*-1*index;
		                            }else{
		                                if(auto){
		                                    run('right', true);
		                                }
		                            }
		                        }else{
		                            if(index > 0){
		                                bs.eq(index).removeClass('active');
		                                bs.eq(--index).addClass('active');
		                                px = _a_h*-1*index;
		                            }else{
		                                if(auto){
		                                    run('left', true);
		                                }
		                            }
		                        }

		                    }


		                    if(px !== ''){
		                    	silderPopup.display(0);
		                        ul.animate({'marginTop':px, complete:(function(){
		                        	getCurrentImgs();
		                        	setTimeout(function(){silderPopup.run(index+1);}, 800);
		                        })()},"600", 'ease-in');
		                    }
	                	};

	                silder.on('swipeLeft', function(){
	                    run('left');
	                });

	                silder.on('swipeRight', function(){
	                    run('right');
	                });
	             }else{
	             	if(len > 0){
	             		var avatar_w = lis.eq(0).width();
	             		lis.height(avatar_w);
	             	}
	             }


            	var getCurrentImgs = function(){  
            		var index = silder.parent().find('.dot-groups i.active').index();
            		if(index <= 0) index = 0;      		
        			var imgs = [], large = (index +1) *  10, start = index * 10;
                	$.each(lis, function(i, item){
                		if(i >= start && i < large){
                			imgs.push(item);
                		}
                	})
                 	FN.loadImage(imgs);
            	};

	            getCurrentImgs();

	            //设置亲友团列表高度
	            (function(){
	            	var lis = silder.find('li');
	            		var img = lis.eq(0).find('img');
	             	// img.on('load', function(e){
	             		FN.getImage(img.attr('src'), function(e){
	             			var h = lis.eq(0).height();
							if(len > 5){	             		
			             		silder.height(h*2+1);
			             	}else{
			             		silder.height(h+1);
			             	}
						});
	             	// })
	            })()

                /*--------------- silder 结束-------------*/

                $('#toMakepage').on('tap', function(e){
                	e.preventDefault();
                	location.href = G.PD.get('link').indexLink;
                });


                G.event({eventType:'touchend', pd:false, sp:false});
                var redpackDefault = G.PD.get('redpackDefault');
                var redpackAmount = G.PD.get('redpackAmount');

                G.actions.reg('giveHongbao', function(evt, obj){
                	if(config.drawStatus !== '' && config.redpackStatus !== ''){//发了红包又领过奖，显示领奖结果              		
                		$('#hongbaoResult').display(1).find('p.'+config.drawStatus).display(1);
                	}else{
                		if(config.favStatus === 'true' && config.drawStatus === ''){//已点赞或者发红包了可以抽奖
                			$('#lingHongbao').display(1);
                		}else{//发红包或者点赞
                			$('#hongbaoLayer').display(1);
                		}
                	}
                }).reg('randomhb', function(evt, obj){
                    var ran,  //随机数
                        num, i = 1;
                      
                    num = redpackAmount.map(function(c) {
                        return [-50*i, c];
                    });

                    do {
                        ran = parseInt(Math.random()*4);
                    } while(num[ran][1] == redpackDefault);
                    num = num[ran];

                    $(".amount.dynamic2").text(num[1]);
                    $(".num-con")
                        .css({"transition": "all 0.3s"})
                        .css({"transform": "translateY(-250px)"});

                    setTimeout(function() {
                        redpackDefault = num[1];
                        $(".amount.dynamic1").text(num[1]);
                        setTimeout(function() {
                            $(".num-con")
                                .css({"transition": null})
                                .css({"transform": "translateY(0px)"});
                        }, 1);
                    }, 300);

                }).reg('givehb', function(evt, obj){
                	var dom = $(obj.target), coin = 0;
                    if ('undefined' === typeof obj.coin) {
                        coin = redpackDefault;
                    }

                	if(coin == 0 && config.favStatus === 'true' && config.drawStatus !== ''){//已点赞并抽奖后直接显示抽奖结果
						$('#hongbaoLayer').display(0);
						$('#hongbaoResult').display(1).find('p.'+config.drawStatus).display(1);
						return;
					}
					dom.data('lock', 1);
					location.href = G.PD.get('link').payLink+'?amount='+coin;
                }).reg('linghb', function(evt, obj){
                	var dom = $(obj.target);
					dom.data('lock', 1);
					G.Ajax.send(G.PD.get('link').drawAction, {}, function(res){
						if($.type(res) !== 'object'){
					        res = JSON.parse(res);
					    }
					    $('#lingHongbao').display(0);
						if(res.errno == '0'){
							G.PD.set({'drawStatus':res.rst.drawStatus});
							$('#hongbaoResult').display(1).find('p.'+res.rst.drawStatus).display(1);
						}else{
							alert(res.err);
						}	
					});
                }).reg('support', function(evt, obj){
                	var dom = $(obj.target);
					dom.data('lock', 1);
					$('#hongbaoLayer').display(0);
                }).reg('getHbList', function(evt, obj){
                	var dom = $(obj.target);
                	var hongbao_lists = $('#hongbao_lists').display(1);
                	if(JSON.parse(config.redpacks).length){
                		hongbao_lists.find('.btn-green').display(1);
                	}
                	hongbao_lists.find('.font-xxlg').text(G.PD.get('redpackAmount'));
                	hongbao_lists.find('#hbamount').text(G.PD.get('redpackCount'));
                	dom.data('lock', 0);
                }).reg('rplist', function(evt, obj){
                	var rplists = $('#rplists'), rendered = rplists.data('rendered');
                	if(!rendered){
                		var temp = ['<li>',
                            '<div class="ui-avatar"><img src="{.headimgurl}" alt="">',
                            '</div>',
                            '<div class="visit-user">',
                              '<div class="visit-user-title">{.nickname}</div>',
                              '<p class="visit-user-text"><span>{.amount}</span>元',
                                '<time>{.created_at}</time>',
                              '</p>',
                            '</div>',
                          '</li>'].join(''),                       
                          redpacks = JSON.parse(config.redpacks);
                          // redpacks = [{"created_at":"2016-01-26","amount":101,"sender":{"nickname":"test account","headimgurl":"http:\/\/dev.file.gaofen.com\/html\/weixin\/bainian\/img\/dummies\/avatar_48x48.png"}}];
                          if(redpacks.length){
                          	var lists = [];
                          	// redpacks = [{"created_at":"2016-01-26","amount":101,"sender":{"nickname":"test account","headimgurl":"http:\/\/dev.file.gaofen.com\/html\/weixin\/bainian\/img\/dummies\/avatar_48x48.png"}}];
                          	$.each(redpacks, function(i, item){
                          		item.amount = item.amount/100;
                          		$.extend(item, item.sender);
                          		lists.push(G.util.parse(temp, item));
                          	})
                          	rplists.find('ul').html(lists.join(''));
                          	rplists.find('.mask-btn').on('tap', function(e){
			                	e.preventDefault();
			                	rplists.display(0);
			                })
                          }
                          $('#hongbao_lists').display(0);
                          rplists.data('rendered', true);
                      }

                      rplists.display(1);
                });

			break;
		}

		//微信JDK(分享)
		(function(){
            var _shareInfo = $.extend(G.PD.get('wxconfig'), G.PD.get('wxconfigDetail'));
			if(!_shareInfo) return;
			GWX.wxready({
				debug: false,
			    appId: _shareInfo.appId,
			    timestamp: _shareInfo.timestamp,
			    nonceStr: _shareInfo.nonceStr,
			    signature: _shareInfo.signature,
			    title: _shareInfo.title||'微信拜年', // 分享标题
			    desc: _shareInfo.desc||'', // 分享描述
			    link: location.href.indexOf('share') > 0 ? G.PD.get('link').inviteLink : _shareInfo.link, // 分享链接
			    imgUrl: _shareInfo.imgUrl||'' // 分享图标
			}, function(){
				weixinReadyCallback && weixinReadyCallback();
			}, function(config){
				wx.onMenuShareAppMessage({
					title: config.title, // 分享标题
				    desc: config.desc, // 分享描述
				    link: config.link+'&type=1', // 分享链接
				    imgUrl: config.imgUrl // 分享图标
				});
				wx.onMenuShareTimeline({
					title: config.title, // 分享标题
				    desc: config.desc, // 分享描述
				    link: config.link+'&type=2', // 分享链接
				    imgUrl: config.imgUrl // 分享图标
				});
				wx.onMenuShareQQ(config);
			});
		})();
	})

	// G.actions.reg('null', function(evt, obj){
	// 	location.href = evt.target.href; 
	// })

})(Zepto, window, Gaofen);
