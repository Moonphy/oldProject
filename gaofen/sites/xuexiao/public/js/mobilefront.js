/**
 * Created by zhiwen on 2015-05-07.
 * mobile 主站资讯前台功能
 */
"use strict";

(function($, win, G){

	$.extend($.fn, {
		display : function(b){
			var len = this.length, jq;
		    if(len){
		        if(len === 1){
		            if(b === undefined){
		                var v = !this.hasClass('hidden');
		                return v;
		            }else {
		                if(b) this.removeClass('hidden');
		                else this.addClass('hidden');
		            }
		        }else {
		            this.each(function(){
			            if(b) $(this).removeClass('hidden');
		                else $(this).addClass('hidden');
		            });
		        }
		    }
		    return this;
		}
	});
	var isPc = function(){
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
	},
    moveFn =  function (event) {
        event.preventDefault();
    },
	is_weixn = function(){
	    var ua = navigator.userAgent.toLowerCase();
	    if(ua.match(/MicroMessenger/i)=="micromessenger") {
	        return true;
	    } else {
	        return false;
	    }
	},
	shareLock = false,
	shareBack = function(msg){
		if(msg){//成功
			document.body.addEventListener('touchmove', moveFn, false);
			$('#share_guide').display(1);
		}
	},
	loadWxJDK = function(fn){
		var wcon = G.PD.get('wxconfig');
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
			        'onMenuShareAppMessage'
			      ]
			  });

			wx.ready(function () {
				if(fn) fn();
			});
			
		};
		$('body')[0].appendChild(script);
		loadWxJDK = null;
	};

	var uimask = $('div.ui-mask').css('position','fixed'), body = $("body"),
		eventType = isPc() ? 'click': 'tap',
		touchEvent = 'touchend',
		myFastClick = function(etype, el, fn){
            var zel = $(el), dom = $(el).get(0), evt, preventDefault = true, stopPropagation = true;
            if($.type(etype) === 'object'){
                evt = etype.evt;
                preventDefault = etype.hasOwnProperty('pd') ? etype.pd : preventDefault;
                stopPropagation = etype.hasOwnProperty('sp') ? etype.sp : stopPropagation;
            }else{
                evt = etype;
            }
            // $('#evt').text(touchEvent)
            $(el).on(touchEvent, function (e) {
                var event = $.Event(evt);
                //这里为了方便而已，其实该e.target
                dom.dispatchEvent(event);
                preventDefault && e.preventDefault();
                stopPropagation && e.stopPropagation();
            });
            $(el).on(evt, fn);
        };

	G.on('show-mask', function(obj){
		if(obj.show){
			uimask.display(1);
			$('html').css('overflow', 'hidden');
			document.body.addEventListener('touchmove', moveFn, false);
		}else{
			uimask.display(0);
			$('html').css('overflow', 'auto');
			document.body.removeEventListener('touchmove', moveFn);
		}
		// $('html').toggleClass("fixed-page");			
	});
	//是否加广告(暂时只有广州有广告位)
	G.on('xsc-gz-ad', function(){
		var ids = ['channel_index_tgw_wap_a1', 'article_ad_wap4', 'channel_list_tgw_wap_a1'],
			dom;
		for(var i=0, len = ids.length;i<len;i++){
			dom = $('#'+ids[i]);
			if(dom.length){
				var r = callad(ids[i],'', 1);
				dom.html(r);
				break;
			}
		}
	});

	//特殊广告只有广州用户才能看到
	(function(){
		var gzTimer, gzTime = 0;
		function showSzAd(){
			if(typeof remote_ip_info === 'undefined'){
				if(gzTime > 1000) return;
				gzTime++;
				gzTimer = setTimeout(showSzAd, 400);
				return;
			}
			clearTimeout(gzTimer);
			gzTimer = null;
			if(remote_ip_info.city === '广州'){
				G.fire('xsc-gz-ad');
			}
			document.head.removeChild(sinaScript);
		}

		var sinaScript = document.createElement('script');
		sinaScript.src = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
		document.head.appendChild(sinaScript);
		showSzAd();	
	})();

	// uimask.on(eventType, function(e){
	// 	$("#navToggle").trigger(eventType);
	// });

	myFastClick(eventType, uimask, function (e) {
		$("#navToggle").trigger(eventType);
	});

	//模拟点击效果
	body.on(eventType, 'a', function(e){
		$(e.target).addClass('active');
		setTimeout(function(){$(e.target).removeClass('active')}, 500);
	});	


	//图片延迟加载
	//调用方法 var lazy = lazyload($('div.main'), 'img');
    function  lazyload(view, match){
        var imgs = [],
            wh = $(window).height(),
            obj = {
                resetImg : function(){//列表再次加载或者分页情况
                    imgs = [];
                    getImgs();
                }
            };

        var getImgs = function(){
            var _imgs = view.find(match);
            $.each(_imgs, function(i, item){
                var jqItem = $(item);
                if(!jqItem.attr('src')){
                    var top = jqItem.offset().top;
                    imgs.push({
                        o : jqItem,
                        top : top
                    })
                }
            });
        }

        var reader = function(scrollTop){
            $.each(imgs, function(i, item){
                if(item.top <= scrollTop){
                    var img = item.o;
                    img.attr('src', img.attr('_src'));
                    imgs.splice(i, 1);
                }
            });
        };

        //初始化
        (function(){
            getImgs();

            $(window).scroll(function(){
                var sh = $(this).scrollTop();
                reader(sh+wh);
            }).trigger('scroll');




        })();

        return obj;
    }

    $(function () {

    	//右上角功能位置事件
        myFastClick(eventType, $("#navToggle"), function (e) {
            var show = 1;
            if (body.hasClass("hide-nav")) {
                body.removeClass("hide-nav");
            }
            if (body.hasClass("show-nav")) {
            	show = 0;
                body.addClass("hide-nav");
            }
            $(this).toggleClass("active");
            body.toggleClass("show-nav");
            G.fire('show-mask', {
            	show : show
            });
        });

        //微信状态下加分享功能
        if(is_weixn()){
        	var btn = $('#weixinshare');
        	myFastClick(eventType, btn, function (e) {
        	// $('#weixinshare').on(eventType, function(e){
        		// e.preventDefault();
        		if(shareLock) return;
        		if(loadWxJDK){
        			shareLock = true;
        			loadWxJDK(function(e){
						shareLock = false;
						shareBack(true);
						wx.onMenuShareAppMessage({
						    imgUrl: 'http://file.gaofen.com/html/mobile/images/wxartlogo.jpg',
						    success: function () { 
						        // shareBack(true);
						    },
						    cancel: function () { 
						        // 用户取消分享后执行的回调函数
						        // alert('error');
						    }
						});
					});
        		}else{
        			shareBack(true);
        		}

        	});
        	btn.parent().display(1);
        	myFastClick(eventType, $('#share_guide'), function (e) {
        	// $('#share_guide').on(eventType, function(e){
        		document.body.removeEventListener('touchmove', moveFn);
        		$(this).display(0);
        		// $('html').css({'overflow':'auto', height:'auto'});
        	})
        }
    });

})(Zepto, window, Gaofen);