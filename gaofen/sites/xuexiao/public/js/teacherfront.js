/**
 * Created by zhiwen on 2015-04-24.
 * teacherfront 选师前台功能
 */
"use strict";

(function($, win, G){
    var luri = location.href.toLowerCase(), router = [	
    	'teacher/teacher/list',//列表页
    	'teacher/teacher/view',//详细页
    	'teacher/teacher/sell',//约课
    	'teacher/user/comment',//评论页
		// 'teacher/teacher/editparta',//基本信息
		// 'teacher/teacher/editpartb', //详细信息		
		'teacher/user/pay',//支付
		'teacher/user/schedule',//我的课程
		'teacher/user/refund',//退款
		'teacher/user/orderlist',//订单列表页
		'teacher/user/order',//订单详细信息
		'teacher/user/bind'//绑写卓越教育帐号
		],//经验分享

		Send = G.Ajax.send,

		Util = G.util;

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

		var uimask = null;

		var isPc = function(){
	        var userAgentInfo = navigator.userAgent;
	        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
	        var flag = true;
	        for (var v = 0; v < Agents.length; v++) {
	            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
	        }
	        return flag;
	    },
	    touchEvent = 'touchend',
	    myFastClick = function(etype, el, fn, _touchEvent){
            var zel = $(el), dom = $(el).get(0), evt, preventDefault = true, stopPropagation = true;
            if($.type(etype) === 'object'){
                evt = etype.evt;
                preventDefault = etype.hasOwnProperty('pd') ? etype.pd : preventDefault;
                stopPropagation = etype.hasOwnProperty('sp') ? etype.sp : stopPropagation;
            }else{
                evt = etype;
            }

            // evt = 'click';
            // $('#evt').text(touchEvent)
            $(el).on(_touchEvent || touchEvent, function (e) {
                var event = $.Event(evt);
                //这里为了方便而已，其实该e.target
                dom.dispatchEvent(event);
                preventDefault && e.preventDefault();
                stopPropagation && e.stopPropagation();
            });
            $(el).on(evt, fn);
        },
        eventType = isPc() ? 'click' : 'tap',

        tempData = {
        	mask_wrap : '<div class="mask-wrap" id="mask_warp"><div class="mask-content">{.content}</div></div>',
        	giveContent : '<p>非常满意，<br>赠送老师一只5元的康乃馨吧！</p><a class="btn btn-primary">立刻送花</a><a class="btn unread">再想想</a>'
        };

		G.on('show-mask', function(obj){
			if(obj.show){
				//设置遮罩层高度
				// var h = $('body').height();
				// if(h > 1000)
				var h = document.body.scrollHeight;
				uimask.height(h).display(1);
				$('body').css('overflow', 'hidden');
				$('html').addClass('fixed-page');	
				
			}else{
				uimask.display(0);
				$('body').css('overflow', 'auto');
				$('html').removeClass('fixed-page');	
			}

		});


		//图片延迟加载
	    var lazyload = function(view, match){
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
	        	var maxDel = [];
	            $.each(imgs, function(i, item){
	                if(!item.o.attr('src') && item.top <= scrollTop){      	
	                    var img = item.o;
	                    img.attr('src', img.attr('_src'));
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

		var FN = G.FN = {

			Tips : function(isShow, msg){
				$('#ui_tips').display(isShow).text(msg||'');
				$('body').addClass('show-tips');
			},

			waiting : function(e){
				$('#ui_waiting').display(e);
			},

			Give : function(p){
				if(p){
					var html = G.util.parse(tempData['mask_wrap'], {
						content : tempData['giveContent']
					});
					$(html).appendTo('body');
				}else{
					$('#mask_warp').remove();
				}

				G.fire('show-mask', {
		    		show : !!p
		    	});

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
						// else{
						// 	wx.getLocation({
						// 	    success: function (res) {
						// 	    	// initWx = true;
						// 	        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						// 	        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						// 	         alert(latitude+'-'+longitude)
						// 	    }
						// 	});
						// }
					});
					
				};
				$('body')[0].appendChild(script);
				FN.loadWxJDK = null;
			}

		};

        $('#ui_tips').on('webkitAnimationStart', function(e){
        	G.fire('ui_tips_start');
        }).on('webkitAnimationEnd', function(e){ 
        	setTimeout(function(){
        		$('body').removeClass('show-tips');
        		G.fire('ui_tips_end');
        	},1500);
        });


		$(function(){

		    var body = $("body");
		    G.event({
		    	pd : false,
		    	sp : false
		    });

		    //模拟点击效果
			body.on(eventType, 'a', function(e){
				var target  = e.target.tagName.toLowerCase() === 'a' ? $(e.target) : $(e.target).closest('a');
				target.addClass('active');
				setTimeout(function(){target.removeClass('active')}, 500);
			});	

			// if(eventType === 'touchend'){
			// 	body.on('click', 'a', function(e){
			// 		var target  = e.target.tagName.toLowerCase() === 'a' ? $(e.target) : $(e.target).closest('a');
			// 		target.addClass('active');
			// 		alert(target.attr('class'))
			// 		setTimeout(function(){target.removeClass('active')}, 500);
			// 	});	
			// }
			// touch.on('a', eventType, function(e){
			// 	$(e.currentTarget).addClass('active');
			// 	setTimeout(function(){$(e.currentTarget).removeClass('active')}, 500);
			// });



		    uimask = $('div.ui-mask');

		    // touch.on('div.ui-mask', eventType, function(e){
		    // 	if($('#header_bar .active').length){
		    // 		$('#header_bar .active').trigger(eventType);
		    // 	}
		    // });

		    $('div.ui-mask').on(eventType, function(e){
		    	if($('#header_bar .active').length){
		    		$('#header_bar .active').trigger(eventType);
		    	}
		    });


		    $('#animateBox a').each(function(i, item){

		    	myFastClick({
		    		evt : 'click'
		    		// pd : false,
		    		// sp : false
		    	}, item, function(e){
		    		 location.href = e.target.href;
		    	}, 'tap');
		    });

/*		    $('#animateBox').on(eventType === 'click' ? 'click' : 'touchend' , function(e){
		    	var uiactive = $('#filter_bar .ui-filter-active');
		    	if(uiactive.length){
		    		G.fire('nav-state', {
			    		jq : uiactive
			    	});
		    	}
		    });
*/

		    //右上角工具
		    var shownav = 'show-nav',
		    	hidenav = 'hide-nav';

		    $('#header_bar').find('span').each(function(i, item){
		    	myFastClick(eventType, item, function(e){
		    		var jq = $(this), id = jq.attr('id'), uls = $('#nav_main ul'), hasActive = null;
			    	if(id === 'city_switcher'){
			    		uls.eq(0).removeClass('hidden');
			    		uls.eq(1).addClass('hidden');
			    		hasActive = $('#navToggle').hasClass('active') ? 'navToggle' : null;
			    	}else if(id === 'navToggle'){
			    		uls.eq(1).removeClass('hidden');
			    		uls.eq(0).addClass('hidden');
			    		hasActive = $('#city_switcher').hasClass('active') ? 'city_switcher' : null;
			    	}
			    	if(hasActive) $('#'+hasActive).removeClass('active');
			    	var uiactive = $('#filter_bar .ui-filter-active');
			    	if(uiactive.length)
				      	G.fire('nav-state', {
				    		jq : uiactive
				    	});
			        $(this).toggleClass("active");
			        

			        if(hasActive === null){
			        	body.toggleClass(shownav);
			      	    G.fire('show-mask', {
			    			show : uimask.hasClass('hidden') ? 1 : 0
			    		});
			      	}
			      	if(!body.hasClass(shownav)){
			        	body.addClass(hidenav);
			        }
		    	})
		    });
		    // $('#header_bar').on(eventType, 'span', function(e){
		    // 	var jq = $(this), id = jq.attr('id'), uls = $('#nav_main ul'), hasActive = null;
		    // 	if(id === 'city_switcher'){
		    // 		uls.eq(0).removeClass('hidden');
		    // 		uls.eq(1).addClass('hidden');
		    // 		hasActive = $('#navToggle').hasClass('active') ? 'navToggle' : null;
		    // 	}else if(id === 'navToggle'){
		    // 		uls.eq(1).removeClass('hidden');
		    // 		uls.eq(0).addClass('hidden');
		    // 		hasActive = $('#city_switcher').hasClass('active') ? 'city_switcher' : null;
		    // 	}
		    // 	if(hasActive) $('#'+hasActive).removeClass('active');
		    // 	var uiactive = $('#filter_bar .ui-filter-active');
		    // 	if(uiactive.length)
			   //    	G.fire('nav-state', {
			   //  		jq : uiactive
			   //  	});
			   //  // if(hasActive === null && body.hasClass(shownav)){
			   //  // 	body.addClass(hidenav);
			   //  // }
		    //     // if(body.hasClass(hidenav)){
		    //     //     body.removeClass(hidenav);
		    //     // }
		    //     // if(body.hasClass(shownav)){
		    //     //     body.addClass(hidenav);
		    //     // }
		    //     $(this).toggleClass("active");
		        

		    //     if(hasActive === null){
		    //     	body.toggleClass(shownav);
		    //   	    G.fire('show-mask', {
		    // 			show : uimask.hasClass('hidden') ? 1 : 0
		    // 		});
		    //   	}
		    //   	if(!body.hasClass(shownav)){
		    //     	body.addClass(hidenav);
		    //     }
		    // });


		    //监听导航动画
		    var lock = false;
            $('#animateBox').on('webkitAnimationStart', function(e){
            	lock = true;
            	// console.log('animateBox_start');
            	G.fire('animateBox_start', {
            		target : e.target
            	})
            }).on('webkitAnimationEnd', function(e){
            	lock = false;
            	if(body.hasClass(hideOptcls)){
            	    body.removeClass(hideOptcls);
            	    $('#animateBox').display(0);
            	    
            	}else{

            	}
            }).on(eventType, 'li', function(e){
            	// console.log($(this).closest('.ui-filter-active'))
            	// e.preventDefault()
            	G.fire('nav-state', {
		    		jq : $('div.ui-filter-active')
		    	});
            });

            $('#nav_main').on('webkitAnimationStart', function(e){
            	lock = true;
            }).on('webkitAnimationEnd', function(e){
            	lock = false;
            	if(body.hasClass(hidenav))
            		body.removeClass(hidenav);
            });

            var setBoxHeight = function(){
        		var h = $(window).height();
        		$('#animateBox').height(h - 109 - 20);          	
            }
            setBoxHeight();

		    var filter_bar = $('#filter_bar'),
		    	showOptcls = 'show-options',
		    	hideOptcls = 'hide-options',
		    	uifilterActive = 'ui-filter-active',
		    	animateTimer = null,
		    	uiOptions = filter_bar.find('.ui-options'),
		    	// afterCssAnimate = function(fn){
		    	// 	clearTimeout(animateTimer);
		    	// 	animateTimer = setTimeout(fn||$.noop, 1000);
		    	// },
		    	setUioption = function(index, play){
		    		uiOptions.find('ul:not(.hidden)').display(0);
		    		if(play === 1) uiOptions.find('ul').eq(index).display(1);
		    	};

		    filter_bar.find('div.ui-filter').each(function(i, item){
		    	myFastClick(eventType, item, function(e){
		    		if(lock) return;
			    	G.fire('nav-state', {
			    		jq : $(this)
			    	});
		    	});
		    });
		    // filter_bar.on(eventType, 'div.ui-filter', function(i, item){
		    	// if(lock) return;
		    	// G.fire('nav-state', {
		    	// 	jq : $(this)
		    	// });
		    // });

		    //头部导航设置状态
		    G.on('nav-state', function(obj){
		    	// debugger;
		    	var jq = obj.jq, index = jq.index();
		    	if(jq.hasClass(uifilterActive)){//直接关闭层
		    		
		    		G.fire('show-mask', {
		    			show : 0
		    		});
		    		// lock = true;
	            	G.fire('animateBox_start', {
	            		target : $('#animateBox')
	            	});
	            	body.addClass('hide-options');

		    		// $('#animateBox').animate({bottom : 0}, 300, 'ease-out',function(e){
		      //       	 lock = false;
		    		// });
		    		// body.removeClass(showOptcls).addClass(hideOptcls);
		    		// afterCssAnimate();
		    		jq.removeClass(uifilterActive);
		    		// setUioption(index);

		    	}else{
		    		$('#animateBox').display(1);
		    		G.fire('show-mask', {
		    			show : 1
		    		});
		    		body.removeClass('hide-options').addClass('show-options');
		    		var hasActive = filter_bar.find('.'+uifilterActive);
		    		setUioption(index, 1);
		    		if(hasActive.length){//替换显示层
		    			hasActive.removeClass(uifilterActive);
		    		}else{
		    			// lock = true;
			    		// $('#animateBox').animate({bottom : $('#animateBox').height()*-1}, 300, 'ease-out',function(e){
			      //       	lock = false;
			    		// });
		    			// body.addClass(showOptcls);
		    		}
		    		jq.addClass(uifilterActive);
		    	}
		    });


			//路由
			if(luri.indexOf(router[0]) > 0 || location.pathname === '/'){//列表页

				lazyload($('div.teacher-list'), 'div.thumb img');
				// FN.loadWxJDK();
				// var initWx = false;
				// G.on('nav-state', function(obj){
				// 	if(obj.jq.index() === 3){
				// 		if(FN.loadWxJDK) FN.loadWxJDK(function(){
				// 			wx.ready(function () {
				// 				wx.getLocation({
				// 				    success: function (res) {
								    	
				// 				    	initWx = true;
				// 				        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
				// 				        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
				// 				        alert(latitude+'-'+longitude)
				// 				    }
				// 				});
				// 			});
				// 		});
				// 	}
				// });

				// setTimeout(function(){alert(wx)},2000);
				// $('body').append('<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>');


			}else if(luri.indexOf(router[1]) > 0){//详细页  teacher/teacher/view
				$('#share_guide').on(eventType, function(e){
					$('#share_guide').display(0);
				});


	            var wtop, toTop;
	            var setScroll = (function(){
	            	var t = 0,
	            	easeOut = function ( t, b, c, d){
		                return c*((t=t/d-1)*t*t + 1) + b;
		            };
		            var setScroll = function(x){
		            	if(x !== undefined) t = x;
		            	var f = easeOut(t, wtop, toTop, 40);
						if(f < toTop){						 
							window.scrollTo(0,f);
							requestAnimationFrame(function(){
								t++;
								setScroll();
							});
						}else{
							G.fire('to-scroll');
						}
					};
	                // var wtop = $(window).scrollTop(), toTop = $('#ui_panel').offset().top;
	                return setScroll;

	            })();
	            window.requestAnimationFrame = (function () {
					return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					function (callback) {
						      return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
					};
				})();

				var ui_panel = $('#ui_panel'), active = 'ui-tab-item-active', tabCon = ui_panel.find('.tab-cont'),
					isCalendarInit = false;

				ui_panel.find('.ui-tab').on(eventType, 'li', function(e){
					e.preventDefault();
					var jq = $(this);
					if(jq.hasClass(active)) return;
					var act = ui_panel.find('.'+active), index = act.index();
					tabCon.eq(index).display(0);
					act.removeClass(active);
					jq.addClass(active);
					// debugger;
					// console.log($(window).scrollTop(), $('#ui_panel').offset().top)
					// if($(window).scrollTop() < $('#ui_panel').offset().top)
						// setScroll($('#ui_panel').offset().top);
					// $(window).animate({scrollTop:200},800);
					// setTimeout(function(){window.scrollTo(0,$('#ui_panel').offset().top);},200);
					tabCon.eq(jq.index()).display(1);
					// if(jq.index() === 1 && !isCalendarInit){
					// 	isCalendarInit = true;
					// 	initFun();
					// 	// G.actions.get('calendar')({}, {
					// 	// 	type : 'now'
					// 	// });
					// }
					// if(jq.index() === 1){


						if(jq.index() === 1 && !isCalendarInit){
							G.on('to-scroll', function(e){								
								isCalendarInit = true;
								G.actions.del('self_to-scroll');
								initFun();
							})
						}
						if(requestAnimationFrame){
							wtop = $(window).scrollTop(), toTop = $('#ui_panel').offset().top;
							requestAnimationFrame(function(e){
								setScroll(0);
							});
						}else{
							G.fire('to-scroll');
						}
					// }
					
				});

				//分享
				var shareBack = function(msg){
					if(msg){//成功
						// alert('ok=')
						$('#share_guide').display(1);
					}
				};
				var shareLock;
				myFastClick(eventType, $('#shareWxBtn'), function(e){
					// $('body').css({'overflow':'scroll','overflow-y':'hidden'});
					e.preventDefault();
					// return;
					if(shareLock) return;
					var view = $('#teacherInfo'), teacherName = view.find('.teacher-name').text().split('(')[0];
					if(FN.loadWxJDK){
						shareLock = true;
						FN.loadWxJDK(function(e){
							shareLock = false;
							shareBack(true);
							wx.onMenuShareAppMessage({
							      title: '牛师帮',
							      desc: '牛师'+teacherName+'个人主页',
							      link: location.href,
							      imgUrl: $('#faceImg').attr('src'),
							    success: function () { 
							        // shareBack(true);
							    },
							    cancel: function () { 
							        // 用户取消分享后执行的回调函数
							        alert('error');
							    }
							});
						});
					}else{
						shareBack(true);
					}
				});

				var catchData = {}, nowStart, nowEnd, getAll = false,//一次性把数据取回来
						schedule_body = $('#schedule_body'),
					getData = function(start, end, fn){
						nowStart = start;
						nowEnd = end;
						start = getTime(start).join('-');
						end = getTime(end).join('-');
						// console.log(start, end)
						var d = catchData[getAll ? 'getAll' :  start+'T'+end];
						if(d){
							render(d);
							return;
						}
						FN.waiting(1);
						G.Ajax.send('/Teacher/ajax/getTeacherArragementByWeek',{
							tid : teacherNid,
								start : start,
								end : end
							}, fn || function(r){
								if($.type(r) === 'string') r = JSON.parse(r);
								FN.waiting(0);
								if(r.errno == '0'){
									render(r.rst);
									catchData[getAll ? 'getAll' : start+'T'+end] = r.rst;
								}else{//返回错误
									render([]);
								}
							})
					},

					tmpSub = ['<div rel="e:sub,index:{.index}" style="width:82px;" class="{._cls}"><span>{.SubjectName}({.LessionCount})</span><span>{.TeacherName}</span><span>{.TrainingCenterName}</span></div>'].join(''),
					tmpAddress = [''].join(''),

					getTime = function(numString){
						numString = numString || +new Date;
						var result = [], t = new Date(numString);

						result.push(t.getFullYear());
						result.push(t.getMonth()+1);
						result.push(t.getDate());

						return result;
					},
					//清除状态
					resetBody = function(items){
						schedule_body.find('div.placeholder').addClass('over');
					},

					// resetScroll = function(v){
					// 	if(v === undefined) return schedule_body[0].scrollLeft;
					// 	else schedule_body[0].scrollLeft = v;
					// },

					setDate_area = function(start){
						var nowtime = '', days = $('#week_list').children(), trs = schedule_body.find('tbody>tr');
						for(var i=0;i<7;i++){
							nowtime = getTime((start||(+new Date))+(i*86400000));
							 // console.log(nowtime)
							days.eq(i).find('span').text(nowtime[2]);
							// console.log(nowtime[2])
							trs.eq(i).attr('rel', nowtime[1]+'-'+nowtime[2]);
						}
						var date_area = $('#date_area .mon');
						date_area.find('em').text(nowtime[0]);
						date_area.find('span').text(nowtime[1]+'月');
					},

					tempData = null,
					courseList = ['08:30','10:30','14:00','16:00','19:00'],
					exp_coureList = ['16:00','16:30','17:00'],
					render = function(data){
						setDate_area(nowStart);
						resetBody();
						// resetScroll(0);
						tempData = data;
						var trs = schedule_body.find('tbody>tr');
						$.each(data, function(i, item){
							var timeFrom = item.Date, timeTo = item.BeginTime,
								timeFromSS = timeFrom.split('-');
							var rel = parseInt(timeFromSS[1])+'-'+parseInt(timeFromSS[2]);
							var tr = schedule_body.find('tbody>tr[rel="'+rel+'"]');
							// console.log(tr)
							// return;
							if(tr.length === 0) return;
							//按完整节课计算
							//特殊情况在第四个区间有可能出现3种情况，所以先判断是否在3种情况内
							var index = $.inArray(timeTo, exp_coureList);
							if(index > -1){//第四个区间
								tr.find('td').eq(3).find('.over').removeClass('over');
								// var targets = schedule_body.find('thead th').eq(3);
								// targets.find('span').eq(0).text(item.BeginTime);
								// targets.find('span').eq(2).text(item.EndTime);
								// tr.find('td').eq(index).find('.over').removeClass('over');
							}else{
								index = $.inArray(timeTo, courseList);
								if(index > -1){
									tr.find('td').eq(index).find('.over').removeClass('over');
								}
							}
							// var index = $.inArray(timeTo, courseList);
							

							// alert(targetTd.find('.placeholder').children().css('width'))

						});						
						
					};


				//可授课时间
				var teacherNid = G.PD.get('teacherNid'), year = (new Date()).getFullYear(), month = (new Date()).getMonth()+1,
					dataCache = {}, lock = false;
				
				G.actions
				// .reg('calendar', function(e, opt){
				// 	if(lock) return;
				// 	lock = 1;				
				// 	if(opt.type === "prev"){
				// 		month--;
				// 		if(month === 0){
				// 			month = 12;
				// 			year--;
				// 		}
				// 	}else if(opt.type === 'next'){
				// 		month++;
				// 		if(month === 13){
				// 			month = 1;
				// 			year++;
				// 		}
				// 	}
				// 	var key = year+'-'+month;
				// 	if(dataCache[key]){
				// 		lock = 0;
				// 		$('#desc_area').html(dataCache[key]);
				// 		return;
				// 	}
				// 	FN.waiting(1);
				// 	// G.Ajax.send('/teacher/ajax/getTeacherArragement',{
				// 	G.Ajax.send('getTeacherArragementByWeek',{
				// 		tid : teacherNid,
				// 		year : year,
				// 		month : month
				// 	}, function(r){
				// 		FN.waiting(0);
				// 		if($.type(r) === 'string') r = JSON.parse(r);	
				// 		if(r.errno == '0'){
				// 			dataCache[key] = r.rst;
				// 			$('#desc_area').html(r.rst);
				// 		}
				// 		lock = 0;
				// 	});
				// })
				.reg('pre', function(e,obj){
						getData(nowStart - 86400000*7, nowStart);
					}).reg('next', function(e, obj){
						getData(nowEnd, nowEnd + 86400000*7);
					});;

				var initFun = function(){
					var date = new Date(), day = date.getDay(), st = date.getTime() - (day - 1)*86400000;

					getData(st, st+(86400000*7));
				};

			}else if(luri.indexOf(router[2]) > 0){//约课
				G.on('ui_tips_end', function(e){
					location.href = '/Teacher/User/orderList';
				});
				var form = $('#sell_form'), 
					baseCount = 20,
					inputs = form.find('input'),
					lock = false,
					errorArea = form.find('.error-message'),
					btns = form.find('.form-actions button'),
					minus = 'minus', plus = 'plus',
					subject = form.find('select[name="subject"]').val() || G.PD.get('subject'),
					price_area = form.find('#price_area'),
					price = 0,
					setCount = function(num, isGet){
						var _num = parseInt(form.find('.count').text());
						if(isGet) return _num;
						if(num === minus){
							_num -= baseCount;
							if(_num < baseCount) _num = baseCount;
						}else if(num === plus){
							_num += baseCount;
							if(_num > 100) _num = 100;
						}else if(num){
							_num = num;
						}
						getPay(subject, form.find('select[name="grade"]').val(), _num);
						form.find('.count').text(_num+' 课时');
						// setPrice(PeriodPrice);
					},
					setPrice = function(p){
						
						price_area.display(p);
						if(!p){
							return;
						}
						var num = setCount('', true);
						price_area.find('span').eq(0).text('课时单价：'+p.perFee+'/小时');
						var is = price_area.find('i');
						is.eq(0).text(p.totalFee);
						is.eq(1).text(p.discountFee).closest('div').display(!!p.discountFee);

					},
					setTips = function(stat, msg){						
						errorArea.text(msg||'').display(stat);
					},
					initForm = function(e){
						inputs.removeClass();
						setCount(baseCount);
						errorArea.display(0);
						lock = false;
						btns.eq(0).display(1);
						btns.eq(1).display(0);
					};
					inputs.on('focus', function(e){
						$(this).removeClass().addClass('focus');
						setTips(0, '');
					}).on('blur', function(e){
						var jq = $(this), v = $.trim(jq.val());
						if(v === ''){
							setTips(1, '请填写信息！');
							jq.addClass('error');
							return;
						}
						if(jq.attr('name') === 'phone'){
							if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(v)){
								setTips(1, '手机号码填写格式错误，请重新填写!');
								jq.addClass('error');
								return;
							}
						}
						jq.removeClass();
					});
					var row_time = form.find('#row_time');
					if(row_time.display()){
						row_time.on(eventType, '.'+minus+',.'+plus, function(e){

							var jq = $(this), cls = jq.attr('class');
		
							//if(cls === minus){
								setCount(cls);
							//}
						})
					}

					myFastClick(eventType, btns.eq(0), function(e){
						if(lock) return;
						inputs.trigger('blur');
						var error = form.find('input.error');
						if(error.length){
							return;
						}
						var sels = form.find('select'), grade = form.find('select[name="grade"]').val(), trainingCenter = form.find('select[name="trainingCenter"]').val();
						if(grade === ''){
							setTips(1, '选择年级');
							return;
						}
						if(trainingCenter === ''){
							setTips(1, '选择校区');
							return;
						}
						var name  = $.trim(inputs.eq(0).val()), phone = $.trim(inputs.eq(1).val()),
						    amount = setCount('', true),
						    orderType = $('#orderType').val();
						btns.eq(0).display(0);
						btns.eq(1).display(1);
						lock = true;
						Send('/Teacher/Ajax/buy', {
							tid : $('#tid').val(),
							amount : amount,
							name : name,
							phone : phone,
							subject : subject,
							grade : grade,
							trainingCenter : trainingCenter,
							orderType : orderType,
							studyTime : form.find('textarea[name="studyTime"]').val()
						}, function(r){
							lock = false;	
							if($.type(r) === 'string') r = JSON.parse(r);						
							if(r.errno == '0'){
								var tipsMsg = '申请试听成功';//1是试听
								if(orderType == '2'){
									tipsMsg = '约课成功';
								}
								FN.Tips(1, tipsMsg);
							}else{
								setTips(1, r.err);
								btns.eq(1).display(0);
								btns.eq(0).display(1);
							}
						}, 'post');
					});
					// FN.Tips(1, 'tipsMsg');
					var getPay = function(sub, grade, amount){
						if(!grade){
							setPrice('');
							return;
						}
						G.Ajax.send('/Teacher/ajax/getPeriodPrices?subject='+sub+'&grade='+grade+'&city='+G.PD.get('city')+'&amount='+amount, {}, function(r){
							if($.type(r) === 'string') r = JSON.parse(r);	
							if(r.errno == '0'){
								// connsole.log(r)
								// PeriodPrice = r.rst.PeriodPrice;
								setPrice(r.rst);
							}
						});
					};

					var PeriodPrice = 0;
					form.find('select[name="grade"]').on('change', function(e){
						var v = this.value;
						if(v === ''){
							setPrice('');
						}else{
							// var _num = parseInt(form.find('.count').text());
							getPay(subject, v, parseInt(form.find('.count').text()));
							// G.Ajax.send('/Teacher/ajax/getPeriodPrices?subject='+subject+'&grade='+v+'&city='+G.PD.get('city'), {}, function(r){
							// 	if($.type(r) === 'string') r = JSON.parse(r);	
							// 	if(r.errno == '0'){
							// 		PeriodPrice = r.rst.PeriodPrice;
							// 		setPrice(r.rst.PeriodPrice);
							// 	}
							// });
						}
						
					}).trigger('change');

					form.find('select[name="subject"]').on('change', function(e){
						var v = this.value, grade = form.find('select[name="grade"]').val();
						if(v === '' || grade == ''){
							setPrice('');
						}else{
							// var _num = parseInt(form.find('.count').text());
							getPay(v, grade, parseInt(form.find('.count').text()));
						}
						subject = v;
					});

				initForm();
			}else if(luri.indexOf(router[3]) > 0){//评论 teacher/user/comment
				var byteLen = function(text){
					var len = text.length,
						matcher = text.match(/[^\x00-\xff]/g);
					if(matcher)
						len += matcher.length;
					return len;
				},
				byteCut = function(str, length) {
				  var wlen = Util.byteLen(str);
				  if(wlen>length){
					  // 所有宽字用&&代替
					  var c = str.replace(/&/g, " ")
								 .replace(/[^\x00-\xff]/g, "&&");
					  // c.slice(0, length)返回截短字符串位
					  str = str.slice(0, c.slice(0, length)
								// 由位宽转为JS char宽
								.replace(/&&/g, " ")
								// 除去截了半个的宽位
								.replace(/&/g, "").length
							);
				  }
				  return str;
				};
				var cform = $('#cform'), cicon = cform.find('#cicon'), checkNum = 0;
				// cicon.on(eventType, 'label', function(e){
				// 	var jq = $(this);
				// 	setTips(0, '');
				// 	if(!jq.hasClass(checkcs)){
				// 		cicon.find('.'+checkcs).removeClass(checkcs);
				// 		jq.addClass(checkcs);
				// 	}
				// });
				cicon.find('.ui-stars').on(eventType, 'span', function(e){
					checkNum = $(this).index()+1;
					$(this).parent().attr('class', 'ui-stars ui-stars-'+checkNum+' ui-stars-favour')
				})


				var textarea = cform.find('textarea').on('click', function(e){
					setTips(0, '');
				});
				if(eventType === 'click'){
					textarea.on('keydown', function(e){
					
						var v = $.trim($(this).val()),
						    num = byteLen(v);
						num = Math.ceil(num/2);
						
						if(num  > 100){
							if(e.keyCode !== 8) e.preventDefault();
							num = 100;				
						}

						$('#count').text(100 - num);
					
					})

				}else{//移动端不能用preventDefault
					
					textarea.on('keyup', function(e){
						
						var v = $.trim($(this).val()),
						    num = byteLen(v);
						num = Math.ceil(num/2);
						
						if(num  > 100){
							if(e.keyCode !== 8){
								this.value = byteCut(v, 200);
							} 
							num = 100;				
						}

						$('#count').text(100 - num);
						
					})
				}

				var errorArea = cform.find('.error-message'),
					lock = false,
					btns = cform.find('.actions button'),
					setTips = function(stat, msg){						
						errorArea.text(msg||'').display(stat);
					};
				btns.eq(1).on(eventType, function(e){
					if(lock) return;
					textarea.trigger('keyup');				
					var text = $.trim(textarea.val());
					if(text === ''){
						setTips(1, '请填写评论内容！');
						return;
					}
					if(Math.ceil(byteLen(text)/2) > 100){
						$('#count').text(0);
						setTips(1, '字数已超出限制！');
						return;
					}
					if(checkNum === 0){
						setTips(1, '请给老师打评分！');
						return;
					}					
					// var raisal = checkIcon.find('input').val();
					lock = true;
					btns.eq(0).display(1);
					btns.eq(1).display(0);
					Send('/Teacher/Ajax/comment', {
							oid : $('#oid').val(),
							message : text,
							evaluate : checkNum
						}, function(r){
							lock = false;
							if($.type(r) === 'string') r = JSON.parse(r);	
							if(r.errno == '0'){
								FN.Tips(1, '评论成功！');
								cform.display(0);
								var cdjq = $('#comment_detail').display(1);
								cdjq.find('.ui-stars').addClass('ui-stars-'+checkNum);
								cdjq.find('.comment-cont').text(text);

							}else{
								setTips(1, r.err);
								btns.eq(0).display(0);
								btns.eq(1).display(1);
							}
						}, 'post');
				})	

			}else if(luri.indexOf(router[4]) > 0){
				var config = JSON.parse(G.PD.get('wxPayCfg'));
				// alert(G.PD.get('wxPayCfg'))
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
						        alert('paysuccess:'+JSON.stringify(res))
						    },
						    // cancel : function(e){
						    // 	alert('cancel')
						    // },
						    fail : function(r){
						    	alert(JSON.stringify(r))
						    }
						});
					});
				}else{
					//shareBack(true);
				}
			}else if(luri.indexOf(router[5]) > 0){//我的课程 teacher/user/schedule
				 (function(){
				 	//课程时间显示区浮动显示
				 	var _sh = $('#header_bar').height();
			 		$(window).scroll(function(){
						var sh = $(this).scrollTop();		
						if(sh > _sh){
							schedule_body.find('div.timeline').css('top', sh - _sh);			
						}else{
							schedule_body.find('div.timeline').css('top', 0);
						}					
					});
					var catchData = {}, nowStart, nowEnd, getAll = true,//一次性把数据取回来
						schedule_body = $('#schedule_body'),
					getData = function(start, end, fn){
						nowStart = start;
						nowEnd = end;
						start = getTime(start).join('-');
						end = getTime(end).join('-');
						var d = catchData[getAll ? 'getAll' :  start+'T'+end];
						if(d){
							render(d);
							return;
						}
						Gaofen.FN.waiting(1);
						G.Ajax.send('/teacher/ajax/getMyArragement', {
							start : start,
							end : end
						}, fn || function(r){
							if($.type(r) === 'string') r = JSON.parse(r);
							Gaofen.FN.waiting(0);
							if(r.errno == '0'){
								render(r.rst);
								catchData[getAll ? 'getAll' : start+'T'+end] = r.rst;
							}else{//返回错误
								render([]);
							}
						})
					},

					tmpSub = ['<div rel="e:sub,index:{.index}" style="width:82px;" class="{._cls}"><span>{.SubjectName}({.LessionCount})</span><span>{.TeacherName}</span><span>{.TrainingCenterName}</span></div>'].join(''),
					tmpAddress = [''].join(''),
					getTime = function(numString){
						numString = numString || +new Date;
						var result = [], t = new Date(numString);

						result.push(t.getFullYear());
						result.push(t.getMonth()+1);
						result.push(t.getDate());

						return result;
					},

					setDate_area = function(start){
						var nowtime = '', days = $('#week_list').children(), trs = schedule_body.find('tbody>tr');
						for(var i=0;i<7;i++){
							nowtime = getTime((start||(+new Date))+(i*86400000));
							 // console.log(nowtime)
							days.eq(i).find('span').text(nowtime[2]);
							// console.log(nowtime[2])
							trs.eq(i).attr('rel', nowtime[0]+'-'+nowtime[1]+'-'+nowtime[2]);
						}
						var date_area = $('#date_area .mon');
						date_area.find('em').text(nowtime[0]);
						date_area.find('span').text(nowtime[1]+'月');
					},

					tempData = null,
					render = function(data){
						setDate_area(nowStart);
						resetBody();
						resetScroll(0);
						tempData = data;
						var trs = schedule_body.find('tbody>tr');
						$.each(data, function(i, item){
							var timeFrom = item.TimeFrom, timeTo = item.TimeTo, 
								timeFromS = timeFrom.split('T'), timeTos = timeTo.split('T'),
								timeFromSS = timeFromS[0].split('-');
							var rel = parseInt(timeFromSS[0])+'-'+parseInt(timeFromSS[1])+'-'+parseInt(timeFromSS[2]);
							var tr = schedule_body.find('tbody>tr[rel="'+rel+'"]');


							if(tr.length === 0) return;
							var sth = schedule_body.find('thead th[rel="'+timeFromS[1]+'"]'),
							targetTd = tr.find('td').eq(sth.index()),
							allTime = (new Date(timeTo).getTime() - new Date(timeFrom).getTime())/60000;
							var allStartTime = new Date(timeFrom).getTime() - new Date(timeFromS[0]+'T00:00:00').getTime();
							var _allStartTime = Math.floor(allStartTime/1800000)-14;
							targetTd = tr.find('td').eq(_allStartTime);
							var tdw = tr.find('td').width() + 1;
							targetTd.find('.placeholder').html(G.util.parse(tmpSub, $.extend({index:i,_cls : !!item.IsSubmit ? 'over':'scheduled'},item))).find('.over');
							// alert(allTime/30*50)
							targetTd.find('.placeholder').children().css('width',allTime/30*tdw);
							_allStartTime  = allStartTime - (_allStartTime+14)*1800000;
							if(_allStartTime){
								var left = _allStartTime /60000/30*tdw;
								targetTd.find('.placeholder').children('div').css({'left':left});
							}

							// alert(targetTd.find('.placeholder').children().css('width'))

						});
					},

					resetScroll = function(v){
						// schedule_body[0].scrollLeft = v||0;
						if(v === undefined) return schedule_body[0].scrollLeft;
						else schedule_body[0].scrollLeft = v;
					},

					//清除状态
					resetBody = function(items){
						schedule_body.find('div.over,div.scheduled').remove();
						schedule_body.children('div.address').display(0);
					};


					G.actions.reg('sub', function(e, obj){
						var target = obj.target;
						if(target.hasClass('popup-up') || target.hasClass('popup-down') ){
							target.removeClass('popup-up').removeClass('popup-down');
							$('#address_top').display(0);
							return;
						}
						schedule_body.find('div.popup-up,div.popup-down').removeClass('popup-up').removeClass('popup-down');
						schedule_body.children('div.address').display(0);
						var tr = target.closest('tr'), cls = 'popup-up', top = target.offset().top + 40;
						// console.log(target.offset().top)
						var td = target.parent().parent(),bottom, tdw = td.width(), tdleft = tdw * td.index();
						console.log(tdleft);
						if(td.index() > 24){
							tdleft = tdw * 24;
						}
						if(tr.index() > 4){//最后一个
							cls = 'popup-down';
							top = 'auto';
							bottom = tr.height()* (7-tr.index()) + 8;
						}else{
							bottom = 'auto';
						}
						target.addClass(cls);
						var address_top = $('#address_top').display(1).css({'left' : tdleft,'bottom':bottom, 'top':top, 'zIndex':10}),
							ps = address_top.find('p');
						ps.eq(0).text('地址：'+(tempData[obj.index]['Address']||tempData[obj.index]['TrainingCenterName']));
						ps.eq(1).text('课室：'+tempData[obj.index]['ClassRoomName']+' (卡座：'+tempData[obj.index]['FieldName']+')');
						ps.eq(2).text(tempData[obj.index]['Tel'] ? ('电话：'+tempData[obj.index]['Tel']) : '');
					}).reg('pre', function(e,obj){
						getData(nowStart - 86400000*7, nowStart);
					}).reg('next', function(e, obj){
						getData(nowEnd, nowEnd + 86400000*7);
					});

					(function(){
						var date = new Date(), day = date.getDay(), st = date.getTime() - (day - 1)*86400000;

						getData(st, st+(86400000*7));
					})();

					schedule_body.find('table').on('touchstart', function(e){
						e.stopPropagation();
					}).on('touchmove', function(e){
						e.stopPropagation();
					}).on('touchend', function(e){
						$(e.target).trigger(eventType);
						e.stopPropagation();
					});

				 })();
				
			}else if(luri.indexOf(router[6]) > 0){//退款

				G.actions.reg('refund', function(e, obj){
					G.Ajax.send('/teacher/ajax/refund', {
						oid : obj.oid,
						transaction_id : obj.transaction_id||''
					},function(r){
						if($.type(r) === 'string') r = JSON.parse(r);
						if(r.errno == '0'){
							location.reload();
						}else{
							FN.Tips(true, '操作失败！');
							setTimeout(function(){
								location.reload();
								FN.Tips(false, '');
							}, 3000);
						}
					});
				});
			}else if(luri.indexOf(router[7]) > 0){//订单列表页
				// var tabnav = $('div.tab-items');
				// tabnav.on('swipeLeft', function(e){
				// 	alert(e.touches)
				// })
				var tab_items = $('#tab_items'), w = 0, aw = 0, isAdd = false;
				tab_items.on('touchstart', function(e){
						e.stopPropagation();
					}).on('touchmove', function(e){
						e.stopPropagation();
					}).on('touchend', function(e){
						e.stopPropagation();
					});
				tab_items.children().each(function(i, item){
					var jqItem = $(item);
					w += (jqItem.width()+8);
					if(jqItem.hasClass('active')){
						aw = w;
						isAdd = true;
					}
					if(!isAdd){
						aw = w;
					}
				});

				tab_items.css('width', w);

				if(aw > $(window).width()){
					tab_items.parent()[0].scrollLeft = aw;
				}
				tab_items.parent().parent().css('visibility', 'visible');
				// alert(tab_items.parent().parent().html());
				
			}else if(luri.indexOf(router[8]) > 0){//teacher/user/order 订单详细页

				G.actions.reg('clorder', function(e, obj){
					var target = obj.target;
					target.data('lock', true);
					FN.waiting(1);
					G.Ajax.send('/teacher/ajax/cancle', {
						id : obj.id
					},function(r){
						FN.waiting(0);
						if($.type(r) === 'string') r = JSON.parse(r);
						if(r.errno == '0'){
							location.href = '/Teacher/User/orderList';
						}else{
							target.data('lock', false);
							FN.Tips(true, '操作失败！');
							setTimeout(function(){
								location.reload();
								FN.Tips(false, '');
							}, 3000);
						}
					});
				})
			}else if(luri.indexOf(router[9]) > 0){ //teacher/user/bind//绑写卓越教育帐号
				var setError = function(p, msg){
					$('#v_error').display(p).text(msg);
				}, 
				timer = null, 
				allTime = 60, 
				v_getHide = $('#v_getHide'), 
				setTime = function(){
					--allTime;
					if(allTime < 0){
						clearInterval(timer);
						timer = null;		
						$('#v_getHide').display(0);
						$('#v_get').display(1);
						return;
					}
					v_getHide.text('重新发送('+allTime+')');
				}, getData = function(isAll){
					var tel = $.trim($('#v_phone').val()), name = $.trim($('#v_name').val()), code;
					if(name === ''){
						setError(1, '请输入学生姓名！');
						return false;						
					}
					if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(tel)){
						setError(1, '请正确输入手机号！');
						return false;
					}
					if(isAll){
						code = $.trim($('#v_code').val());
						if(code === ''){
							setError(1, '请输入验证码！');
							return false;
						}else{
							return {name : name, tel : tel, code : code};
						}
					}else{
						return {name : name, tel : tel};
					}
				};

				$('#v_phone').on('keydown', function(e){
					if((e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 8 ){
						e.preventDefault();
					}else{
						setError(0, '');
					}
				});
				$('#v_get').on(eventType, function(e){
					setError(0, '');
					var data = getData();
					if(!data) return;


					allTime = 60;
					timer = setInterval(setTime, 1000);
					$('#v_get').display(0);
					$('#v_getHide').display(1);
					Send('/teacher/ajax/sendCode', data, function(r){
						if($.type(r) === 'string') r = JSON.parse(r);
						if(r.errno == '0'){

						}else{
							allTime = -1;
							setTime();
							setError(1, r.err);
						}
					},'post');
					
				});

				$('#v_btn').on(eventType, function(e){
					if($('#v_btn').hasClass('disabled')) return;
					var data = getData(true);
					if(!data) return;
					$('#v_btn').addClass('disabled');
					Send('/teacher/ajax/checkCode',data,function(r){
						$('#v_btn').removeClass('disabled');
						if($.type(r) === 'string') r = JSON.parse(r);
						if(r.errno == '0'){
							FN.Tips(1, "手机号验证成功");
						}else{
							setError(1, r.err);
						}
					},'post');
				});

				G.on('ui_tips_end', function(){
					location.href = '/Teacher/User/setting';
				});
			}			
		});

})(Zepto, window, Gaofen);