/*
2012, gaofen frontend Library v1.0dev

build time: July 04 11:16
*/

/*
 * @create: ouli
 * @countdown 倒计时插件
 * @调用方式	
   $.fn.countdown({
		hoverDuring: 300, //菜单展示速度
		outDuring: 100, //菜单消失速度
		hoverEvent: "", //鼠标移动上去事情
		outEvent: "" //鼠标离开事件
   })
 */
$.fn.countdown = function(options){
	//默认值
	var defaults = {
		time: "", //倒计时时间对象
		dayPanel: "", //显示天的标签
		hourPanel: "", //显示小时的标签
		minutePanel: "", //显示分钟的标签
		secondPanel: "", //显示秒的标签
		endText: "" //倒计时结束文字
	}
	var options = $.extend({}, defaults, options);
	
	this.each(function() {
		var obj = $(this);
		//倒计时函数
		function countDown(){		
			var openTime = options.time;
			var openTimeStr = countTime(openTime).split("-");
			if(openTimeStr[0] >= 0){;
				obj.find(options.dayPanel).html(openTimeStr[0]);
				obj.find(options.hourPanel).html(openTimeStr[1]);
				obj.find(options.minutePanel).html(openTimeStr[2]);
				obj.find(options.secondPanel).html(openTimeStr[3]);
			}
			if(openTimeStr[0] == ""){
				obj.parent().css("background","none");
				obj.parent().html("<p>"+options.endText+"</p>");
			}
			timeout = setTimeout(function() {
				countDown();
			}, 1000);
		}
		//计算时间差函数
		function countTime(timeObj){
			var nowTime = new Date();	//现在时间  
			/* 
			 * 如果求的时间差为天数则处以864000000，如果是小时数则在这个数字上 
			 *除以24，分钟数则再除以60，依此类推 
			*/
			var timesGAp = timeObj.getTime() - nowTime.getTime();
			var days = Math.floor(timesGAp / (1000 * 60 * 60 * 24));  
			var hour = Math.floor(timesGAp / (1000 * 60 * 60)) % 24;
			if(hour<10)hour = "0"+hour;
			var minute = Math.floor(timesGAp / (1000 * 60)) % 60;
			if(minute<10)minute = "0"+minute;
			var second = Math.floor(timesGAp / 1000) % 60;
			if(second<10)second = "0"+second;
			return days+"-"+hour+"-"+minute+"-"+second;
		}
		//调用倒计时
		countDown();
	})
}


/*
 * @create: ouli
 * @countdown 收藏网页函数插件
 * @调用方式	
   $.fn.addFavorite()
 */
/*$.fn.extend({
	addFavorite: function(){
		var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL';
		if (document.all){
			window.external.addFavorite('http://fuli.gaofen.com/','高分福利社');
		}
		else if (window.sidebar){
			window.sidebar.addPanel('高分福利社', 'http://fuli.gaofen.com/','');
		}
		else {
			alert('您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹!');
		}	
	}
})*/
$.fn.addFavorite=function(options){
	var def={url:'http://fuli.gaofen.com/',urlname:'高分福利社'}	
	var opt=$.extend({},def,options);
	var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL';
		if (document.all){
			window.external.addFavorite(opt.url,opt.urlname);
		}else if(window.sidebar){
			window.sidebar.addPanel(opt.urlname, opt.url,'');
		}else{
			alert('您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹!');
		}
}


/**
 * @create: ouli
 * @hoverDelay 浮动菜单插件
 * @调用方式	
   $.fn.hoverDelay({
		hoverDuring: 300, //菜单展示速度
		outDuring: 100, //菜单消失速度
		hoverEvent: "", //鼠标移动上去事情
		outEvent: "" //鼠标离开事件
   })
 */
$.fn.hoverDelay = function(options){
	var defaults = {
		hoverDuring: 300,
		outDuring: 100,
		hoverEvent: "",
		outEvent: ""
	};
	var options = $.extend({}, defaults, options);
	var hoverTimer, outTimer;
	
	this.each(function(){
		var obj = $(this);
		obj.hover(function(){
			clearTimeout(outTimer);
			hoverTimer = setTimeout(options.hoverEvent, options.hoverDuring);
		},function(){
			clearTimeout(hoverTimer);
			outTimer = setTimeout(options.outEvent, options.outDuring);
		});
	});
}


/**
 * @create: ouli
 * @hoverDelay 气泡插件
 * @调用方式	
   $.fn.bubble({
		top : 300, //气泡相对目标模块的top坐标
		left : 100, //气泡相对目标模块的left坐标
		content : "" //气泡里面的内容
   })
 */
$.fn.bubble = function(options){
	var defaults = {
		top: "",
		left: "",
		content: ""
	};
	var options = $.extend({}, defaults, options);
	var bubble_panel = '<div class="site_bubble"><div class="bubbleInner"><div class="arrowBox"></div>'+options.content+'</div></div>';
	
	this.each(function(){
		var obj = $(this);
		obj.prepend(bubble_panel);
		obj.css("position","relative");
		var sb = $(".site_bubble .bubbleInner", obj);
		$('<a>',{
			href: '',
			id: 'tipsClose',
			title: '关闭',
			click: function(){
				$(this).parent().parent().remove();
				return false;
			}
		}).addClass('close').appendTo(sb);
		
		obj.find(".site_bubble").css({"top":options.top + "px", "left":options.left + "px"})
	});
}


/**
 * @create: ouli
 * @tabs	选项卡插件
 * @调用方式	
   $.fn.tabs({
		tabsPanel: "",//选项卡的div容器	 
		tabstit: "" //选项卡的标题class					 
   });
 */
$.fn.tabs = function(options){
	//默认值
	var defaults = {
		mouseEvent: "click"
	}
	var options = $.extend({}, defaults, options);
	
	var tit = $(this).find(".tab_title .tt_li");
	var cont = $(this).find(".tab_content .tc_li");
	if(options.mouseEvent == "click"){
		tit.each(function(i){
			$(this).bind({
				"click":function(){
					THIS = $(this);
					hovertime = setTimeout(function(){
						THIS.addClass("active");
						THIS.siblings().removeClass("active");
						cont.eq(i).css("display","block");
						cont.eq(i).siblings().css("display","none");
					},200)
				}
			});				  
		})	
	}
	else if(options.mouseEvent == "mouseover"){
		tit.each(function(i){
			$(this).bind({
				"mouseover":function(){
					THIS = $(this);
					hovertime = setTimeout(function(){
						THIS.addClass("active");
						THIS.siblings().removeClass("active");
						cont.eq(i).css("display","block");
						cont.eq(i).siblings().css("display","none");
					},200)
				},
				"mouseout":function(){
					clearTimeout(hovertime);	
				}
			});				  
		})	
	}
}


/**
 * @create: ouli
 * @floatMenu	鼠标浮现菜单
 * @调用方式	
   $("#floatMenu_show").floatMenu();
 */
$.fn.extend({
	floatMenu: function() {
		var This = $(this);
		This.find(".column").mouseenter(function(){
			if($(this).hasClass('column_open')) return false;
			This.find(".column").removeClass("column_open");
			$(this).addClass("column_open").css("opacity",0).animate({"opacity":1},200)
		}).eq(0).mouseenter();
	}	
})


/**
 * @create: ouli
 * @fadeSlider	图片滑动播放插件
 * @调用方式	
   $.fn.fadeSlider({
		controlsShow: true, //是否显示数字导航
		speed: 800, //滑动速度
		auto: true, //是否自定滑动
		pause: 2000, //两次滑动暂停时间持
		height: 0, //容器高度，不设置自动获取图片高度
		width: 0//容器宽度，不设置自动获取图片宽度
   })
 */
$.fn.fadeSlider = function(options) {
	//默认值
    var defaults = {
        controlsShow: true, //是否显示数字导航
		effect: 1, //1表示浮现,2表示滑动
        speed: 800, //滑动速度
        auto: true, //是否自定滑动
        pause: 2000, //两次滑动暂停时间持
        height: 0, //容器高度，不设置自动获取图片高度
        width: 0 //容器宽度，不设置自动获取图片宽度
    }
	var options = $.extend({}, defaults, options);
	
	this.each(function() {
		var obj = $(this);
		var curr = 1; //当前索引
		var $img = obj.find(".thumb");
		var s = $img.length;
		var w = $img.eq(0).outerWidth();
		var h = $img.eq(0).outerHeight();
		var $flashelement = $(".thumbs", obj);
		options.height == 0 ? obj.height(h) : obj.height(options.height);
		options.width == 0 ? obj.width(w) : obj.width(options.width);
		obj.css({"position":"relative"});
		$(obj).append("<div class='slider-title'><i class='bg'></i><span>"+$img.first().find("img").attr("alt")+"</span></div>");
		if(options.effect == 1){
			$("li", obj).css("display","none");	
		}
		else if(options.effect == 2){
			$("li", obj).css({"float":"left","width":w})
			$flashelement.css("width", s * w);	
		}
		if(options.controlsShow) {
			var navbtnhtml = '<div class="slider-control">';
			for (var i = 0; i < s; i++) {
				navbtnhtml += '<span>' + (i + 1) + '</span>';
			}
			navbtnhtml += '</div>';
			obj.append(navbtnhtml);
			obj.find(".slider-control span").hover(function() {
				var num = Number($(this).html());
				flash(num, true, options.effect);
			}, function() {
				timeout = setTimeout(function() {
					flash((curr / 1 + 1), false, options.effect);
				}, options.pause);
			});
		};
		function setcurrnum(index) {
			obj.find(".slider-control span").eq(index).addClass('active').siblings().removeClass('active');
		}
		function flash(index, clicked, effect) {
			$flashelement.stop();
			var next = index == s ? 1 : index + 1;
			curr = next - 1;			
			setcurrnum((index - 1));
			switch(effect){
				case 1:
				$(".thumb", obj).css("display","none");
				$(".thumb", obj).eq(index - 1).fadeTo(options.speed,1);
				//$("li", obj).eq(index - 1).find("h3").css('display', 'block');
				$(".slider-title span",obj).html($(".thumb", obj).eq(index - 1).find("img").attr("alt"));				
				break;
				
				case 2:
				p = ((index - 1) * w * -1);
				$(".slider-title span",obj).html($(".thumb", obj).eq(index - 1).find("img").attr("alt"));
				$flashelement.animate(
					{ marginLeft: p },
					options.speed
				);
			}
			if (clicked) {
				clearTimeout(timeout);
			};
			if (options.auto && !clicked) {
				timeout = setTimeout(function() {
					flash(next, false, options.effect);
				}, options.speed + options.pause);
			};
		}
		var timeout;
		//初始化
		setcurrnum(0);
		if(options.effect == 1){
			$(".thumb", obj).eq(0).css('display', 'block');
			//$("li", obj).eq(0).find("h3").css('display', 'block');		
		}
		if (options.auto) {
			timeout = setTimeout(function() {
				flash(2, false, options.effect);
			}, options.pause);
		};
	});
};


/**
 * @create: ouli
 * @scrollbar	内容轮播
 * @调用方式	
   $.fn.scrollbar({
		axis: 'y', //水平还是垂直 滚动条? ( x || y ).
		wheel: 40,  //每次滚动的距离px.
		scroll: true, //是否需要鼠标拖动.
		lockscroll: true, //return scrollwheel to browser if there is no more content.
		size: 'auto', //set the size of the scrollbar to auto or a fixed number.
		sizethumb: 'auto' //set the size of the thumb to auto or a fixed number.
   })
 */
$.fn.scrollbar = function(options){
	 var defaults = {
        axis: 'y', // vertical or horizontal scrollbar? ( x || y ).
		wheel: 40,  //how many pixels must the mouswheel scroll at a time.
		scroll: true, //enable or disable the mousewheel.
		lockscroll: true, //return scrollwheel to browser if there is no more content.
		size: 'auto', //set the size of the scrollbar to auto or a fixed number.
		sizethumb: 'auto' //set the size of the thumb to auto or a fixed number.
    }
	var options = $.extend({}, defaults, options);
	
	function Scrollbar(root, options){
		var oSelf = this;
		var oWrapper = root;
		var oViewport = { obj: $('.viewport', root) };
		var oContent = { obj: $('.overview', root) };
		var oContent_li = oContent.obj.find("li");
		var ow = oContent_li.outerWidth()*oContent_li.size();
		oContent.obj.css("width", ow);
		oViewport.obj.css("height",oContent_li.outerHeight())
		var oScrollbar = { obj: $('.scrollbar', root) };
		var oTrack = { obj: $('.track', oScrollbar.obj) };
		var oThumb = { obj: $('.thumb', oScrollbar.obj) };
		var sAxis = options.axis == 'x', sDirection = sAxis ? 'left' : 'top', sSize = sAxis ? 'Width' : 'Height';
		var iScroll, iPosition = { start: 0, now: 0 }, iMouse = {};

		function initialize() {
			oSelf.update();
			setEvents();
			return oSelf;
		}
		this.update = function(sScroll){
			oViewport[options.axis] = oViewport.obj[0]['offset'+ sSize];
			oContent[options.axis] = oContent.obj[0]['scroll'+ sSize];
			oContent.ratio = oViewport[options.axis] / oContent[options.axis];
			oScrollbar.obj.toggleClass('disable', oContent.ratio >= 1);
			oTrack[options.axis] = options.size == 'auto' ? oViewport[options.axis] : options.size;
			oThumb[options.axis] = Math.min(oTrack[options.axis], Math.max(0, ( options.sizethumb == 'auto' ? (oTrack[options.axis] * oContent.ratio) : options.sizethumb )));
			oScrollbar.ratio = options.sizethumb == 'auto' ? (oContent[options.axis] / oTrack[options.axis]) : (oContent[options.axis] - oViewport[options.axis]) / (oTrack[options.axis] - oThumb[options.axis]);
			iScroll = (sScroll == 'relative' && oContent.ratio <= 1) ? Math.min((oContent[options.axis] - oViewport[options.axis]), Math.max(0, iScroll)) : 0;
			iScroll = (sScroll == 'bottom' && oContent.ratio <= 1) ? (oContent[options.axis] - oViewport[options.axis]) : isNaN(parseInt(sScroll)) ? iScroll : parseInt(sScroll);
			setSize();
		};
		function setSize(){
			oThumb.obj.css(sDirection, iScroll / oScrollbar.ratio);
			oContent.obj.css(sDirection, -iScroll);
			iMouse['start'] = oThumb.obj.offset()[sDirection];
			var sCssSize = sSize.toLowerCase();
			oScrollbar.obj.css(sCssSize, oTrack[options.axis]);
			oTrack.obj.css(sCssSize, oTrack[options.axis]);
			oThumb.obj.css(sCssSize, oThumb[options.axis]);
		};
		function setEvents(){
			oThumb.obj.bind('mousedown', start);
			oThumb.obj[0].ontouchstart = function(oEvent){
				oEvent.preventDefault();
				oThumb.obj.unbind('mousedown');
				start(oEvent.touches[0]);
				return false;
			};
			oTrack.obj.bind('mouseup', drag);
			if(options.scroll && this.addEventListener){
				oWrapper[0].addEventListener('DOMMouseScroll', wheel, false);
				oWrapper[0].addEventListener('mousewheel', wheel, false );
			}
			else if(options.scroll){oWrapper[0].onmousewheel = wheel;}
		};
		function start(oEvent){
			iMouse.start = sAxis ? oEvent.pageX : oEvent.pageY;
			var oThumbDir = parseInt(oThumb.obj.css(sDirection));
			iPosition.start = oThumbDir == 'auto' ? 0 : oThumbDir;
			$(document).bind('mousemove', drag);
			document.ontouchmove = function(oEvent){
				$(document).unbind('mousemove');
				drag(oEvent.touches[0]);
			};
			$(document).bind('mouseup', end);
			oThumb.obj.bind('mouseup', end);
			oThumb.obj[0].ontouchend = document.ontouchend = function(oEvent){
				$(document).unbind('mouseup');
				oThumb.obj.unbind('mouseup');
				end(oEvent.touches[0]);
			};
			return false;
		};
		function wheel(oEvent){
			if(!(oContent.ratio >= 1 )){
				var oEvent = oEvent || window.event;
				var iDelta = oEvent.wheelDelta ? oEvent.wheelDelta/120 : -oEvent.detail/3;

				iScroll -= iDelta * options.wheel;
				iScroll = Math.min((oContent[options.axis] - oViewport[options.axis]), Math.max(0, iScroll));

				oThumb.obj.css(sDirection, iScroll / oScrollbar.ratio);
				oContent.obj.css(sDirection, -iScroll);

                if( options.lockscroll || ( iScroll !== (oContent[options.axis] - oViewport[options.axis]) && iScroll !== 0 ) )
                {
                    oEvent = $.event.fix(oEvent);
    				oEvent.preventDefault();
                }
			};
		};
		function end(oEvent){
			$(document).unbind('mousemove', drag);
			$(document).unbind('mouseup', end);
			oThumb.obj.unbind('mouseup', end);
			document.ontouchmove = oThumb.obj[0].ontouchend = document.ontouchend = null;
			return false;
		};
		function drag(oEvent){
			if(!(oContent.ratio >= 1)){
				iPosition.now = Math.min((oTrack[options.axis] - oThumb[options.axis]), Math.max(0, (iPosition.start + ((sAxis ? oEvent.pageX : oEvent.pageY) - iMouse.start))));
				iScroll = iPosition.now * oScrollbar.ratio;
				oContent.obj.css(sDirection, -iScroll);
				oThumb.obj.css(sDirection, iPosition.now);
			}
			return false;
		};

		return initialize();
	};
	
	this.each(function(){ 
		new Scrollbar($(this), options); 
	});
	return this;
}


/**
 * @create: ouli
 * @rotatelist	内容轮播插件
 * @调用方式	
   $.fn.rotatelist({
		speed: 10, //移动速率
		rate : 3, //图片每次移动的距离
		par : 80, //基数
		direction : 1 //方向，1是水平方向，2是垂直方向
   })
 */
$.fn.rotatelist = function(options){
	var defaults = {
		speed: 10, //移动速率
		rate : 3, //图片每次移动的距离
		par : 80, //基数
		direction : 1 //方向，1是水平方向，2是垂直方向
	};
	var options = $.extend({}, defaults, options);

	this.each(function() {
		var obj = $(this);
		var action_timer = null;
		var init_timer = null;
		var On = false;
		var length = 0;
		var In = false;
		var slideobj = null;
		var holder1 = null;
		//初始化
		function init(){
			slideobj = obj.find(".slideshow");
			holder1 = slideobj.find(".holder1");
			slideobj.find(".holder2").html(holder1.html());
			
			if(options.direction == 1){
				slideobj.scrollLeft(holder1.outerWidth());
				if(holder1.outerWidth() > slideobj.outerWidth()){
					start();	
				}
				else return;
			}
			else if(options.direction == 2){
				slideobj.scrollTop(holder1.outerHeight());
				if(holder1.outerHeight() > slideobj.outerHeight()){
					start();	
				}
				else return;
			}
			
			slideobj.mouseover(function () {
				stop()
			})
			slideobj.mouseout(function () {
				start()
			})
			
			if(obj.find(".leftbtn").size() != 0){
				var aleft = obj.find(".leftbtn");
				aleft.mousedown(function () {
					up();
				})
				aleft.mouseup(function () {
					stopUp();
				})
				aleft.mouseout(function () {
					stopUp();
				})		
				aleft.mouseover(function () {
					stop();
				})	
			}
			
			if(obj.find(".rightbtn").size() != 0){
				var aright = obj.find(".rightbtn");
				aright.mousedown(function () {
					down();
				})
				aright.mouseup(function () {
					stopDown();
				})
				aright.mouseout(function () {
					stopDown();
				})
				aright.mouseover(function () {
					stop();
				})	
			}
			
		}
		function start(){
			clearInterval(init_timer);
			init_timer = setInterval(function () {
				down();
				stopDown();
			}, 3000)
		};
		function stop(){
			clearInterval(init_timer)	
		};
		function up(){
			if (On) {
				return
			}
			clearInterval(init_timer);
			On = true;
			action_timer = setInterval(function () {
				move_backword()
			}, options.speed)	
		};
		function stopUp(){
			if (In) {
				return
			}
			clearInterval(action_timer);
			if(options.direction == 1){
				if (slideobj.scrollLeft() % options.par != 0) {
					length = -(slideobj.scrollLeft() % options.par);
					T()
				} else {
					On = false
				}	
			}
			else if(options.direction == 2){
				if (slideobj.scrollTop() % options.par != 0) {
					length = -(slideobj.scrollTop() % options.par);
					T()
				} else {
					On = false
				}	
			}
			start();
		};
		function move_backword(){
			if(options.direction == 1){
				if (slideobj.scrollLeft() <= 0) {
					slideobj.scrollLeft(holder1.outerWidth());
				}
				var lf = slideobj.scrollLeft() - options.rate; 
				slideobj.scrollLeft(lf);	
			}
			else if(options.direction == 2){
				if (slideobj.scrollTop() <= 0) {
					slideobj.scrollTop(holder1.outerHeight());
				}
				var tp = slideobj.scrollTop() - options.rate; 
				slideobj.scrollTop(tp);	
			}
		};
		function down(){
			clearInterval(action_timer);
			if (On) {
				return
			}
			clearInterval(init_timer);
			On = true;
			move_forword();
			action_timer = setInterval(function () {
				move_forword();
			}, options.speed)
		};
		function stopDown(){
			if (In) {
				return
			}
			clearInterval(action_timer);
			if(options.direction == 1){
				if (slideobj.scrollLeft() % options.par != 0) {
					length = options.par - slideobj.scrollLeft() % options.par;
					T();
				} else {
					On = false
				}	
			}
			else if(options.direction == 2){
				if (slideobj.scrollTop() % options.par != 0) {
					length = options.par - slideobj.scrollTop() % options.par;
					T();
				} else {
					On = false
				}	
			}
			start();
		};
		function move_forword(){
			if(options.direction == 1){
				if (slideobj.scrollLeft() >= holder1.outerWidth()) {
					slideobj.scrollLeft(0);
				}
				var lf = slideobj.scrollLeft() + options.rate; 
				slideobj.scrollLeft(lf);	
			}
			else if(options.direction == 2){
				if (slideobj.scrollTop() >= holder1.outerHeight()) {
					slideobj.scrollTop(0);
				}
				var tp = slideobj.scrollTop() + options.rate; 
				slideobj.scrollTop(tp);	
			}	
		};
		function T(){
			if (length == 0) {
				On = false;
				In = false;
				return
			}
			var V;
			var W = options.speed,
				X = options.rate;
			if (Math.abs(length) < options.par / 5) {
					X = Math.round(Math.abs(length / 5));
					if (X < 1) {
						X = 1
					}
				}
			if (length < 0) {
					if (length < -X) {
						length += X;
						V = X
					} else {
						V = -length;
						length = 0
					}
					if(options.direction == 1){
						var lf = slideobj.scrollLeft() - V;
						slideobj.scrollLeft(lf);	
					}
					else if(options.direction == 2){
						var tp = slideobj.scrollTop() - V;
						slideobj.scrollTop(tp);	
					}
					setTimeout(function () {
						T()
					}, W)
			} else {
				if (length > X) {
					length -= X;
					V = X
				} else {
					V = length;
					length = 0
				}
				if(options.direction == 1){
					var lf = slideobj.scrollLeft() + V;
					slideobj.scrollLeft(lf);	
				}
				else if(options.direction == 2){
					var tp = slideobj.scrollTop() + V;
					slideobj.scrollTop(tp);	
				}
				setTimeout(function () {
					T()
				}, W)
			}	
		}
		init();
	});
	
}


/**
 * @create: wenlianlong
 * @rotatelist	内容列表垂直无缝滚动插件
 * @调用方式	
   $.fn.listScroll({
		speed: 30, //移动速率
		rowHeight : 24 //列表高度
   })
 */
$.fn.listScroll = function(options){
	var defaults = {
		speed: 30,
		rowHeight: 24
	}
	var options = $.extend({},defaults,options),
	intId = [];
	
	function marquee(obj,st){
		obj.find("ul").animate({marginTop: "-=1"},0,function(){
			var sh = Math.abs(parseInt($(this).css("margin-top")))//得到margin-top的值转换成整数
			if(sh >= st)
			{
				$(this).find("li").slice(0,1).appendTo($(this));//将第一个li列表追加到ul里面
				$(this).css("margin-top",0)//重置margin-top为0，进行下一次滚动
			}
		});
	}
	this.each(function(i){
		var sh = options["rowHeight"],
		speed = options["speed"],
		_this = $(this);
		
		var _setInterval=function(){
				intId[i]=setInterval(function(){marquee(_this,sh);},speed);
			}
			_setInterval();
			//hover
			_this.hover(function(){clearInterval(intId[i]);},function(){_setInterval();});
	})
}


/**
 * @create: ouli
 * @FixDiv	固定小窗口插件
 * @调用方式	
   $.fn.FixDiv({
		top: "0px", //设置top/bottom的样式数值 
		left: "0px", //设置left/right的样式值
		interval: 1 //时间间隔，主要是针对ie6浏览器设置的
   })
 */
$.fn.fixDiv = function(options) {
	var defaults = {
		top : 0,
		bottom : null,
		left : 0,
		right : null,
		interval : 1,
		dataId : null
	};
	var options = $.extend({}, $.fn.fixDiv.defaults, options);
	var isIE6 = !-[1] && !window.XMLHttpRequest;
		
	this.each(function(){
		var $this = $(this);
		$this.css({"width" : options.width + "px", "height" : options.height + "px"});
		var pt; //存储小窗口的绝对定位的top值
		var fb = $(".float_banner_inner", $this);
		if(options.top){
			$this.css({"top": options.top});
		}
		else if((options.top == null) && (options.bottom != null)){
			$this.css({"bottom": options.bottom});
		}
		if(options.left){
			$this.css({"left": options.left});
		}
		else if((options.left == null) && (options.right != null)){
			$this.css({"right": options.right});
		}
		
		if(isIE6){
			$this.css({position: "absolute"});
			pt = $this.position().top; //存储小窗口的绝对定位的top值
			setInterval(fixPosition,options.interval);
		}
		else{
			$this.css("position","fixed");
		}
		$this.find(".closeit").bind("click",function(){
			closeWin();	
		})
		
		function fixPosition(){
			var st = $(document).scrollTop();
			if(options.top){
				$this.css({"top": st + options.top});
			}
			else if((options.top == null) && (options.bottom != null)){
				$this.css({"top": st + pt});
			}
			if(options.left){
				$this.css({"left": options.left});
			}
			else if((options.left == null) && (options.right != null)){
				$this.css({"right": options.right});
			}            
		};
		$("<a>",{
			href: "",
			title: "关闭",
			click: function(){
				$(this).parent().parent().remove();
				return false;
			}
		}).addClass("close").appendTo(fb).html("关闭");
		function closeWin(){
			if(isIE > 0){
				//setcookie("getad04","close",10000*24*3600*1000);
				setcookie(options.dataId,"close",10000*24*3600*1000);
			}
			else{
				//saveStorage("getad","close");
				saveStorage(options.dataId,"close");
			}
			
			$this.animate({ 
				bottom: -($this.outerHeight())
			}, 200,function(){$(this).css("display","none");});
			
		}
	});
}


/**
 * @create: ouli
 * @popWindow	弹出蒙版层窗口插件
 * @调用方式	
   $.fn.popWindow({
		background : "#818181", //蒙版背景颜色
		opacity : 0.7 //蒙版透明度
   })
 */
$.fn.popWindow = function(options) {
	var defaults = {
		background: "#818181",
		opacity: 0.7
	};
	var options = $.extend({}, defaults, options);
	
	this.each(function(){
		var cont = $(this);
		var dom = document.documentElement;
		var dh;
		
		var popObj = $("<div></div>").attr("id","pop_div");
		$("body").append($(popObj));

		var loading_pic = "<img src='http://file.gaofen.com/html/v3/img/loading.gif' width='24' height='24' />"
		var overLay_bg = "<div id='overLay' style='display: block; background: "+options.background+"; z-index: 130; position: absolute; margin: 0px; padding: 0px; top: 0px; left: 0px;'><iframe frameborder='0' style='position:absolute; top:0; left:0; width:100%; height:100%; filter:alpha(opacity=0); opacity=0;'></iframe></div>";
		popObj.append($(overLay_bg));
		
		if(dom.scrollHeight > dom.clientHeight){
			dh = dom.scrollHeight;
		}
		else{
			dh = dom.clientHeight;	
		}
		$("#overLay").css({
			"width"  : dom.clientWidth,
			"height" : dh,
			"opacity" : options.opacity
		})
		cont.removeClass("hidden");
		//关闭蒙层功能
		cont.find("[class~='close']").bind(
			"click",function(){
				popObj.remove();
				cont.addClass("hidden");
			}
		);
		
		//fixDialog(cont);
		
		function fixDialog(obj){
			var dom = document.documentElement || document.body;
			var dw = $(dom).width();
			var dh = $(window).height();
			var ui_dialog = $(obj);
			ui_dialog.css({"position": "absolute","display": "block","z-index": 10000});
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
			ui_dialog.fixDiv({
				left: centerX, 
				top: centerY,
				width : u_w, //窗口宽度
				height : u_h, //窗口高度
				interval: 1 //时间间隔，主要是针对ie6浏览器设置的
			});
		};
	});
}


/**
 * @create: ouli
 * @storeInfo	存储本地信息插件函数
 * @调用方式
   
   //获取信息
   $.fn.getInformation(name) //name: 信息载体名称
   
   //保存信息
   $.fn.saveInformation(name, value, time) //name: 信息载体名称,value: 信息载体的值,time: 保存时间
   
 */
$.fn.extend({
	getInformation: function(name) {
		var isIE = navigator.userAgent.toLowerCase().indexOf("msie"); //浏览器判断
		//如果是IE浏览器内核，直接用cookie
		if(isIE > 0) {
			var cookie_start = document.cookie.indexOf(name);
			var cookie_end = document.cookie.indexOf(";", cookie_start);
			return cookie_start == -1 ? '' : decodeURI(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
		}
		//如果是Mozilla或者WebKit,就用html5的方法
		else {
			var str = localStorage.getItem(name);
			return str;
		}
	},
	saveInformation: function(name, value, time) {
		var isIE = navigator.userAgent.toLowerCase().indexOf("msie"); //浏览器判断
		//如果是IE浏览器内核，直接用cookie
		if(isIE > 0) {
			var expires = new Date();
			expires.setTime(expires.getTime() + time);
			document.cookie = escape(name) + '=' + escape(value) + (expires ? '; expires=' + expires.toGMTString() : '')
		}
		//如果是Mozilla或者WebKit,就用html5的方法
		else {
			localStorage.setItem(name,value);
		}
	}
});


/*
 *@create: ouli
 *@loadImage：图片预加载、重置图片宽度，高度、图片水平，垂直居中
 *@date: 2012/7/18
 */
$.fn.loadImage = function(options){
	defaults = {
		width : "",
		height : ""
	};
	var options = $.extend({}, defaults, options);
	
    var loadpic = "http://file.gaofen.com/html/v3/img/loading.gif";
	
	return this.each(function(){
		var t = $(this);
		var src = $(this).attr("src")
		var img = new Image();
		img.src = src;
		//自动缩放图片
		var autoScaling = function() {
			if(img.width > 0 && img.height > 0) {
				var rate = (options.width/img.width < options.height/img.height)?options.width/img.width:options.height/img.height;
				//如果 指定高度/图片高度  小于  指定宽度/图片宽度 ，  那么，我们的比例数 取 指定高度/图片高度。
				//如果 指定高度/图片高度  大于  指定宽度/图片宽度 ，  那么，我们的比例数 取 指定宽度/
				if(rate <= 1){
					t.width(img.width * rate);
					t.height(img.height * rate);
				}
				else{//  如果比例数大于1，则新的宽度等于以前的宽度。
					t.width(img.width);
					t.height(img.height);
				}
			}
		}
		//处理ff下会自动读取缓存图片
		if(img.complete){
			autoScaling();
		    return;
		}
		
		$(this).attr("src","");
		var loading = $("<img alt=\"加载中...\" title=\"图片加载中...\" src=\"" + loadpic + "\" />");

		t.hide();
		t.after(loading);
		
		$(img).load(function(){
			autoScaling();
			loading.remove();
			t.attr("src",this.src);
			t.show();
		});
		
	});
}

/* 
 *@author wenlianlong
 *@info 文本框内容长度统计
 *@data 2012-07-30
 */
$.fn.InputLength=function(options){
		var def={
			showId:null,
			strLen:140
		}
		$me=$(this);
		var options=$.extend(def,options);
		$(options["showId"]).html($me.val().length+"/"+options["strLen"]);//设置初始值
		return this.each(function(){
			$me.bind("keydown keyup",function(){
				var slen=$me.val().length;
				if(slen > parseInt(options["strLen"])){
					$me.val($me.val().substring(0,options["strLen"]));
					return;
				}
				else{
					$(options["showId"]).html(slen+"/"+options["strLen"]);
				}
			})
		});
	}
/* 
 *@author wenlianlong
 *@info 返回顶部
 *@data 2012-07-30
 */
$.fn.extend({
	addBackToTopTips : function(){
		var isIE6 = !-[1] && !window.XMLHttpRequest;
		var toTop = $('<a class="scrollTop" title="返回顶部" href="javascript:void(0);" onfocus=this.blur()>返回顶部</a>').hide();
		var pt;
		$('body').append(toTop);
		if(isIE6){
			toTop.css({"position":"absolute","bottom":"0"})
			setInterval(fixPosition,1);//计时器，设置返回顶部操作
		}
		toTop.click(function(){
			$('body,html').animate({scrollTop:0},800);
		});
		/*
		 *IE6下自动适应
		 */
		function fixPosition(){
			var th=$(window).scrollTop();
			var ah=document.documentElement.clientHeight-41;//ie6下，得到窗口显示区域高度
			$('.scrollTop').css({'top':th+ah});
		} 		
		$(window).scroll(function(){
			var sh=$(this).scrollTop();		
			if(sh>0){
				$('.scrollTop').fadeIn(500);			
			}else{
				$('.scrollTop').fadeOut(500);
			}
		});
	}
});
/* 
 *@file input_ui.js
 *@author wenlianlong
 *@info 用户中心注册验证插件函数（优化）reg_validate
 *@data 2012-07-19
 */
 
$.fn.extend({
	reg_validate : function(){
		var fm = $(this); //获取表单对象
		var fm_input = fm.find("input"); //获取输入框集合
		var fm_rd = fm.find(".rd"); //获取单选框集合
		
		//提示信息
		var msg = [];
			msg = {
				IS_EMAIL_NULL		:	'请填写电子邮箱，可用来取回密码',
				IS_EMAIL_ERROR		:	'请检查邮箱拼写，示例：my@site.com',
				IS_EMAIL_EXIST		:	'邮箱已被注册过，是否需要<a href="index.php?mod=user&do=findPwd" style=" text-decoration:underline; color:#FF0000;">取回密码</a>?',
				IS_EMAIL_CHINESECHAR:	'请输入英文(a-z,A-Z)或数字（0-9）',					
				IS_EMAIL_ALLANGLE   :	'邮箱不能为全角，请切换半角',
				IS_EMAIL_ILLEGAL    :	'邮箱不能使用非法字符',
				IS_PASSWORD_NULL	:	'请填写一个方便你记忆的密码',
				IS_PASSWORD_CONFIRM	:	'请再次填写密码',
				IS_CODE_NULL		: 	'请填写如图显示的四位验证码',
				IS_CODE_ERROR		: 	'验证码不正确，请检查',
				IS_USER_NULL		:	'请填写用户名， 长度为3 到 15 个字符',
				IS_USER_ERROR1		:	'用户名不能少于 3 个字符',
				IS_USER_ERROR2		:	'用户名不能多于 15 个字符',
				IS_USER_ERROR3		:	'用户名包含敏感字符',
				IS_USER_CONFIRM		:	'抱歉，用户名已被占用，请换一个试试',
				IS_USER_NO_LEGAL	:	'用户名不合法',
				IS_USER_NO_ALLOW	:	'包含不允许注册的词语',
				IS_RESIDENCE_NULL	:	'请选择你的居住地',
				IS_IDENTITY_NULL	:	'请选择你的身份',
				IS_DEAL_CHECK		:	'请先阅读《用户协议》'
				
			}
			//验证邮件
			function isEmail(email){
				if(!/.+@.+\.[a-zA-Z]{2,4}$/.test(email)){
					return true;
				}
				else{
					return false;
				}
			}
			//过滤非法字符
			function trim(str){
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
			function returnInfo(msg,parent){
				parent.append('<span class="help_text">' + msg + '</span>');
				parent.parent().addClass("error");	
			}
			//inpu输入框操作
			fm_input.blur(function(){
				var $me = $(this);//当前对象
				var $parent = $(this).parent();
				$parent.find(".help_text").remove();//删除当前提示内容
				$parent.find(".icon_sure").remove();//删除当前验证成功图标
				//验证邮箱
				if($me.is("#regEmail")){
					if($me.val() == ""){
						returnInfo(msg["IS_EMAIL_NULL"],$parent);
						return;
					}
					else if(isEmail($me.val()) && $me.val() != ""){
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
					$.get('index.php?mod=user&do=checkName&type=1&username='+this.value,function(str){
						if(str != 1 && str != ""){
							returnInfo(msg["IS_EMAIL_EXIST"],$parent);
							return;
						}
						else{
							$parent.find(".icon_sure").remove();
							$parent.parent().removeClass("error");
							$parent.append('<i class="icon_sure ml5"></i>');
							email_check = true;
						}
					}); 
				}
				//验证密码
				if($me.is("#regPassword")){
					if($me.val() == ""){
						returnInfo(msg["IS_PASSWORD_NULL"],$parent);		
						return;
					}
					if($me.val() != ""){
						$parent.parent().removeClass("error");
						$parent.append('<i class="icon_sure ml5"></i>');
						pword_check = true;
					}
				}
				//验证重复密码
				if($me.is("#confirm_password")){
					if($me.val() == ""){
						returnInfo(msg["IS_PASSWORD_CONFIRM"],$parent);		
						return;
					}
					if($me.val() != "")
					{
						$parent.parent().removeClass("error");
						$parent.append('<i class="icon_sure ml5"></i>');
					}
				}
				//验证码
				if($me.is("#checkCode")){
					if($me.val() == ""){
						returnInfo(msg["IS_CODE_NULL"],$parent);
						return;
					}
					if($me.val().length>0){
						$parent.parent().removeClass("error");
					}
					$.get('index.php?mod=user&do=checkCode&code='+$me.val(),function(str){
						if(str != 'ok' && str!=""){					
							returnInfo(msg["IS_CODE_ERROR"],$parent);
							return;
						}
						else{
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
					if($me.val() == ""){
						returnInfo(msg["IS_USER_NULL"],$parent);
						return;
					}
					else if($me.val() != "" && $me.val().length<3){
						returnInfo(msg["IS_USER_ERROR1"],$parent);
						return;
					}
					else if($me.val() != "" && $me.val().length>15){
						returnInfo(msg["IS_USER_ERROR2"],$parent);
						return;
					}
					else if($me.val() != "" && trim($me.val()).match(/<|"/ig)){
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
						}
						else if(str == -1){
							returnInfo(msg["IS_USER_NO_LEGAL"],$parent);
							return;
						}
						else if(str == -2){
							returnInfo(msg["IS_USER_NO_ALLOW"],$parent);
							return;
						}
						else if(str == -3){
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
					}
					else{
						$parent.parent().removeClass("error");
						$parent.append('<i class="icon_sure ml5"></i>');
						place_check = true;
					}
			});
			//身份验证
			fm_rd.bind({
				click : function(){
					var ched =  $('input[name="status"]:checked').attr("checked");//得到status 组选中状态
					var $parent = $(this).parent().parent();			
					if(ched){
						$parent.find(".help_text").remove();
						$parent.parent().removeClass("error");
						id_check = true;
						return;
					}
					else{
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
				}
				else{
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
				if(numError > 0){  
				   return false;  
				}
				else{
					$('#reg_form').submit();
				}	
			});
	}		
})
/* 
 *@file ui.js
 *@author wenlianlong
 *@info 搜索下拉框，带键盘上下键
 *@data 2012-07-19
 */
$.fn.searchInput=function(options){
	var def={search_list:null}//search_list：下拉列表对象
	var opt=$.extend({},def,options);
	return this.each(function(){
		var $me=$(this),
		    keyValue="";
		$me.bind("keyup",function(e){
			var _s_list=$(opt.search_list);
				_s_list.css({top:$me.height(),width:$me.outerWidth()-2});
			if(e.which==40){//下
				_s_list.show();
				var data_length=_s_list.find("li").length;				
				if(data_length>0){
					var caretPos = -1;
					var selectedflag=_s_list.find("li[selectedflag=1]");
					caretPos=selectedflag.attr("index");
					caretPos++;
					if(caretPos>=data_length){
						caretPos=0;
					}
					_s_list.find("li").each(function(){
						$(this).removeClass("on").attr("selectedflag",0);
					});
					if(selectedflag.length==0){
						_s_list.find("li:first").addClass("on").attr("selectedflag",1);
					}
					_s_list.find("li[index="+caretPos+"]").addClass("on").attr("selectedflag",1);
				}
			}else if(e.which==38){//上
				_s_list.show();
				var data_length=_s_list.find("li").length;
				if(data_length>0){
					var caretPos=-1,
					selectedflag=_s_list.find("li[selectedflag=1]");
					caretPos=selectedflag.attr("index");
					caretPos--;
					if(caretPos<0){
						caretPos=data_length-1;
					}
					_s_list.find("li").each(function(){
						$(this).removeClass("on").attr("selectedflag",0);
					});
					if(selectedflag.length==0){
						_s_list.find("li:last").addClass("on").attr("selectedflag",1);
					}
					_s_list.find("li[index="+caretPos+"]").addClass("on").attr("selectedflag",1);
				}
			}
			if($.trim($(this).val()).length>0 && keyValue!=$.trim($(this).val())){//用于判断内容是否一致
				keyValue=$.trim($(this).val());	
				var strUrl="http://tool.gaofen.com/index.php?m=ajax&type=chengyu&s="+encodeURI(keyValue);
				$.ajax({
					type:'POST',
					url:strUrl,
					data:'',
					success:function(msg){
						alert(msg)
					}
				});
				_s_list.show();			
			}else{
				return false;
			}
		});
	})
}
$(document).click(function(event){
	if(event.target.className!="search_input search_input_list")
		$(".search_list").hide();
})