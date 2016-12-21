/**
 * @author  xiezhiwen
 * @class Gaofen.Common
 * 公共功能兼容两套js功能，为避免功能重复编写
 */
 (function(G, win, $){
	var frame = !!G['ui'] || false, //是否有框架
		hidden = 'hidden',
		parse = frame ? G.tpl.parse : (G.FN.parse || G.util.parse),
		FN = G.FN; 
		
	var Temp = {
		'login_bar' : ['<div class="login-bar" id="login_bar">',
			'<div class="bg"></div>',
			'<a class="close" href="#" id="close"></a>',
			'<div class="container">',
				'<div class="login-form">',
					'<h3>登录高分网，与本地家长共同交流教育话题</h3>',
					'<div class="form">',
						'<input type="text" class="input-text blur"  rel="请填写帐号"  placeholder="昵称/邮箱" name="username" value="">',
						'<input type="password" name="password"  rel="请填写密码"  placeholder="密码"   class="input-text blur" value="">',
						'<label class="btn btn-primary">',
							'<button id="btn">登录</button>',
						'</label>',
					'</div>',
				'</div>',
				'<div class="quick-login">',
					'<h3>使用第三方账号登录</h3>',
					'<div class="actions"><a id="qq-bot" class="btn-qq-small" title="QQ登录" href="http://my.gaofen.com/account/qzoneLogin">QQ登录</a><a id="weibo-bot" class="btn-weibo-small" title="微博登录" href="http://my.gaofen.com/account/sinaLogin">微博登录</a>',
					'</div>',
				'</div>',
				'<div class="reg">',
					'<p>还没有高分网账号？</p>',
					'<div class="actions"><a class="btn btn-primary" href="http://my.gaofen.com/signup">注册高分网</a>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'].join(''),
		
		'Alert' : ['<div class="modal modal-tips">',
					'<div class="modal-header">',
						'<h3>提示</h3>',
					'</div>',
					'<div class="modal-body">',
						'<div class="alert alert-info"><i class="ico"></i>',
							'<div class="info">',
								'<p></p>',
							'</div>',
						'</div>',
						'<div class="actions"><a href="#" class="btn btn-primary">确定</a>',
						'</div>',
					'</div><a data-dismiss="modal" href="#" class="close">×</a>',
				'</div>'].join(''),
		'NoticeItem' : '<div class="item">{.message}<a target="_blank" href="{.purl}">点击查看</a></div>',
		'DocsItem' : '<div class="item"><a target="_blank" href="{.link}">{.title}</a></div>',
		'JiangzuoItem' : '<div class="item"><a target="_blank" href="{.link}">{.title}</a><p>{.startime}<i>|</i>{.cost}<i>|</i>{.applynum}人已报名</p></div>',
		'bottom_ad' :'<div class="picture-footer"><div class="bg"></div><a href="#" class="close"></a><div class="container">{.cont}</div></div>'
	}; //模板
	
	if(!$.cookie ){
		$.cookie = function(name, value, options) {
			if (typeof value != 'undefined') { // name and value given, set cookie
				options = options || {};
				if (value === null) {
					value = '';
					options.expires = -1;
				}
				var expires = '';
				if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
					var date;
					if (typeof options.expires == 'number') {
						date = new Date();
						date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
					} else {
						date = options.expires;
					}
					expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
				}
				var path = options.path ? '; path=' + options.path : '';
				var domain = options.domain ? '; domain=' + options.domain : '';
				var secure = options.secure ? '; secure' : '';
				document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
			} else { // only name given, get cookie
				var cookieValue = null;
				if (document.cookie && document.cookie != '') {
					var cookies = document.cookie.split(';');
					for (var i = 0; i < cookies.length; i++) {
						var cookie = jQuery.trim(cookies[i]);
						// Does this cookie string begin with the name we want?
						if (cookie.substring(0, name.length + 1) == (name + '=')) {
							cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
							break;
						}
					}
				}
				return cookieValue;
			}
		};
	}
	var _getcookie = _setcookie = $.cookie;

	var isLogined = _getcookie('gaofen_user');
	
	//if(frame) return; //暂时不处理有frame架框
	
	if(!frame){
		$.fn.cssDisplay = function(b){
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
				}				
				else {
					this.each(function(){
						if(b) $(this).removeClass('hidden');
						else $(this).addClass('hidden');
					});
				}
			}
			return this;
		}
	}


	var loginAction = function(){

		var temp = parse(Temp['login_bar']);
		
		var login_bar = $(temp).hide().appendTo('body');
		function showBar(e){
			var sh=$(win).scrollTop();		
			if(sh>300){
				login_bar.fadeIn(500);			
			}else{
				login_bar.fadeOut(500);
			}
		}
		$(win).bind('scroll', showBar).trigger('scroll');
		
		login_bar.find('#close').click(function(e){
			e.preventDefault();
			login_bar.remove();
			$(win).unbind('scroll', showBar);
		});
		
		new FN.Login({
			view : login_bar,
			type : 'bot',
			modal : '',
			tipsMsg : function(dom, msg, origin){
				if(msg && origin){
					if(this.modal === ''){
						this.modal = alertModal = $(parse(Temp['Alert'])).hide().appendTo('body');
						alertModal.find('.btn,.close').click(function(e){
							e.preventDefault();
							alertModal.hide();
						})
					}
					this.modal.show().find('p').text(msg);
				}
			}
		});

	}
	
	$(function(){

		FN.fixAd();
		//底部广告
		if(!_getcookie('global_bottom_ad'))
			FN.bottomAD();

		if($('#userPanel').length === 0) return;
		var PD = G.PD,
		channel = PD.get('channel');

		if(isLogined){//显示user-panel
			var userPanel = $('#userPanel');
			var upic = _getcookie('gaofen_uid');
			upic = 'http://uc.gaofen.com/avatar.php?uid='+upic+'&size=small';
			userPanel.find('#userpic img').attr('src', upic);
			userPanel.find('#user').text(isLogined);
			
			function getNews(){
				if(frame){
					G.request.q('http://my.gaofen.com/ajax/checkNotice', {}, function(e){
						setNews(e.getData());
					})
				}else{
					G.Ajax.send('http://my.gaofen.com/ajax/checkNotice?callback=?', '', function(e){
						setNews(e.rst);
					},'jsonp')
				}
			}
			
			function setNews(r){
				try{
					userPanel.find('#newsHandle > .icon').cssDisplay(r.notice != '0');
				}catch(e){}
				setTimeout(getNews, 60000*3);
			}
			
			getNews();
				
			userPanel.cssDisplay(1);
			
			//显示信息层
			userPanel.find('#newsBtn, #newsMore').hover(function(e){
				if($(e.target).hasClass('trigger')){
					$('body').trigger('read');
				}
				$(this).addClass('drop-on');
			}, function(){
				$(this).removeClass('drop-on');
			})
			
			$('body').on('read', function(e){
				userPanel.find('div.sec').cssDisplay(0);
				userPanel.find('#loading').cssDisplay(1);
				getNotice();
			}).on('showNotice', function(e, res){
					userPanel.find('#loading').cssDisplay(0);
					userPanel.find('div .setName').each(function(i,item){
						$(item).find('span').html(res['gtitle']);
					});
					var secs = userPanel.find('div.sec'), secTemp = [], secflag;
					if($.type(res['notice']) === 'object'){
						for(var key in res['notice']){
							secTemp.push(parse(Temp['NoticeItem'], res['notice'][key]));
						}	
						secs.eq(0).cssDisplay(1).find('div.news-list').html(secTemp.join(''));
						secflag = true;
					}else{
						secs.eq(0).cssDisplay(0);
					}
					secTemp = [];
					if($.type(res['docs']) === 'object'){
						for(var key in res['docs'])
							secTemp.push(parse(Temp['DocsItem'], res['docs'][key]));
						secs.eq(1).cssDisplay(1).find('div.data-list').html(secTemp.join(''));
						secflag = true;
					}else{
						secs.eq(1).cssDisplay(0);
					}
					secTemp = [];
					if($.type(res['jiangzuo']) === 'object'){
						for(var key in res['jiangzuo'])
							secTemp.push(parse(Temp['JiangzuoItem'], res['jiangzuo'][key]));
						secs.eq(2).cssDisplay(1).find('div.event-list').html(secTemp.join(''));
						secflag = true;
					}else{
						secs.eq(2).cssDisplay(0);
					}
					secs.eq(3).cssDisplay(!secflag);
			})
			
			function renderSec(temp, data){
				
			}
			
			
			function getNotice(){
				if(frame){
					G.request.q('http://my.gaofen.com/ajax/readNotice', {}, function(e){
						$('body').trigger('showNotice', e.getData());
					})
				}else{

					G.Ajax.send('http://my.gaofen.com/ajax/readNotice?callback=?', '', function(e){
						$('body').trigger('showNotice', e.rst);
					},'jsonp')
				}
			}
			
		}else{//显示登录模块


			switch(channel){
				case 'article' : 
					//loginAction();						
				break;
			}
		
			$('#headLogin, #regTips').cssDisplay(1);
			//frame下用G.use('HoverDelay')
			//if(!frame){
				var ltimer = null, timer = 10, loginPanel = $('#loginPanel');
				$('#loginHandle').mouseenter(function(){
					//clearTimeout(ltimer);
					//ltimer = setTimeout(showLoginPanel, timer);
					showLoginPanel();
				});
				
				function showLoginPanel(){
					var parent = $('#loginHandle').parent();
					if(!parent.hasClass('quick-login-active')){
						parent.addClass('quick-login-active');
					}
				}
				$('body').click(function(e){
					var target = $(e.target);
					if(target.closest('#loginPanel').length === 0 && target.closest('#loginHandle').length === 0){
						$('#loginHandle').parent().removeClass('quick-login-active');
					}
				});
				
				new FN.Login({
					view : loginPanel
				});
			//}
		}
	})

	//底部广告
	FN.bottomAD = function(opt){
		var config = $.extend(this, {
			view : '',
			adname : 'global_bottom_a1',
			afterSucc : $.noop
		}, opt);
		try{
			if(typeof callad !== 'undefined'){
				var content = callad(config.adname, '', 1);
				if(content){				
					var jqt = $(parse(Temp['bottom_ad'], {cont : content})).appendTo('body').on('click', 'a.close', function(e){
						e.preventDefault();
						jqt.slideUp('fast');
						if(typeof dataLayer === 'undefined')
							dataLayer = [];
						dataLayer.push({'event': 'closefloat'});
							_setcookie('global_bottom_ad', '1', {expires: 5, domain:'.gaofen.com',path:'/'});
					});
					jqt.find('div.container a').on('click', function(e){
						var href = $(this).attr('href');
						if(href === '' || href === '#')
							e.preventDefault();
					});
				}
			}
		}catch(e){}
	};


	

	//登录模块
	FN.Login = function(opt){
		var config = $.extend(this, {
			view : '',
			btn : '#btn',
			type : 'top',//登录类型（顶部top,底部bot）
			logining : false,
			afterSucc : $.noop
		}, opt);
		this.init();
	}
	FN.Login.prototype = {
		tipsMsg : function(dom, msg, origin){
			var farther = dom.closest('.form-row');
			if(msg === '') farther.removeClass('error');
			else{
				farther.addClass('error');				
				farther.find('.help-inline').text(msg);
				//dom.focus();
			}
			farther.find('.help-inline').cssDisplay(!!msg);

		},
		init : function(){
			this.view.on('click', this.btn, $.proxy(this.login, this));
			var inputs = this.view.find('input[type="text"], input[type="password"]'), that = this;
			inputs.each(function(i,item){
				$(item).blur(function(e){
					var jqthis = $(this), v = $.trim(this.value);
					if(v === ''){
						that.tipsMsg(jqthis, jqthis.attr('rel'));
					}						
				}).focus(function(e){
					that.tipsMsg($(this), '');
				}).keydown(function(e){
					if(e.keyCode == 13){
						that.login();
					}
				});
			})
		},
		checkAfter : $.noop,
		login : function(){
			if(this.logining) return;
			var result = this.check();
			if(result !== false){
				this.send(result);
			}
		},
		check : function(){
			var input = this.view.find('input'), data = {}, that = this;
			input.each(function(i, item){
				var dom = $(item);
				if(dom.attr('type') === 'text' || dom.attr('type') === 'password'){
					var v = $.trim(item.value);
					if(v === ''){
						that.tipsMsg(dom, dom.attr('rel'), true);
						return data = false;
					}
					that.tipsMsg(dom, '', true);
					data[item.name] = v;
				}else{
					data[item.name] = dom.prop("checked") ? 1 : 0;
				}
			});
			return data;
		},
		send : function(result){
			var that = this;
			this.logining = true;
			if(!frame){
				G.Ajax.send('http://ziliao.gaofen.com/ajax/login?callback=?', result, function(e){
					if(e.errno == '0'){
						that.sendCb(true, e.rst.data);
					}else{
						that.sendCb(false, e.err);
					}
				},'jsonp')
			}else{
				G.request.q('http://ziliao.gaofen.com/ajax/login', result, function(e){							
					if(e.isOk()){
						that.sendCb(true, e.getData().data);
					}else{
						that.sendCb(false, e.getError());
					}
				})
			}
		},
		
		sendCb : function(succ, result){
			if(succ){	
				if(this.type === 'top'){
					dataLayer.push({'event': 'signsucceed-top'});
				}else{
					dataLayer.push({'event': 'signsucceed-bot'});
				}
				$("body").append(result);
				setTimeout(function(){
					window.location.reload();
				},2000);
			}else{					
				dataLayer.push({'failedreason': result});
				if(this.type === 'top'){
					dataLayer.push({'event': 'signinfailed-top'});
				}else{
					dataLayer.push({'event': 'signinfailed-bot'});
				}
				this.logining = false;
				this.tipsMsg(this.view.find('input[name="username"]'), result, true);
			}
		}
		
	};
	
	
	/**
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
			width : '',
			height : '',
			right : null,
			interval : 1,
			dataId : null
		};
		var options = $.extend({}, $.fn.fixDiv.defaults, options),
			isIE6 = !-[1,] && !window.XMLHttpRequest,
			isIE = navigator.userAgent.toLowerCase().indexOf("msie");
			
		this.each(function(){
			var $this = $(this);
			var pt; //存储小窗口的绝对定位的top值
			if(options.top){
				$this.css({"top": options.top});
			}
			if(options.width){
				$this.css({"width": options.width});
			}
			if(options.height){
				$this.css({"height": options.height});
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
			}else{
				$this.css("position","fixed");
			}
			$this.find(".close").bind("click",function(){
				closeWin();	
			})
			
			$this.find("a").bind("click",function(e){
				if($(this).attr('href') == '#') e.preventDefault();
			})
			
			function fixPosition(){
				var st = $(document).scrollTop();
				if(options.top){
					$this.css({"top": st + options.top});
				}
				else if(options.top == null){
					$this.css({"top": st + pt});
				}
				if(options.left){
					$this.css({"left": options.left});
				}
				else if((options.left == null) && (options.right != null)){
					$this.css({"right": options.right});
				}            
			};
			function closeWin(){				
				// if(isIE > 0){
				// 	//setcookie("getad04","close",10000*24*3600*1000);
				// 	//_setcookie(options.dataId,"close",10000*24*3600*1000);
				// }
				// else{
				// 	//saveStorage("getad","close");
				// 	//saveStorage(options.dataId,"close");
				// }

				_setcookie(options.dataId||'gaofenfixad',"close", {expires: 5000});
				$this.animate({ 
					bottom: -($this.outerHeight())
				}, 200,function(){$(this).css("display","none");});				
			}
		});
	}
	
	//两则浮动广告位
	FN.fixAd = function(){
		if(typeof callad === 'undefined') return;
		var szTimer, szTime = 0, cityInfo;
		function getArea(){
			if(typeof remote_ip_info === 'undefined'){
				if(szTime > 100){
					init();
					return;
				};
				szTime++;
				szTimer = setTimeout(getArea, 400);
			}else{
				clearTimeout(szTimer);
				szTimer = null;
				cityInfo = remote_ip_info;
				init();			
			}
		}
		getArea();
		function init(){
			var city = (cityInfo && cityInfo.city === '深圳') ? '_sz' : '';
			var PD = G.PD,
			fixadLeft = callad('left_float_tgw_a1'+city,'', true),
			fixadRight = callad('right_float_tgw_a1'+city,'', true);
			// var fixTemp = "<div id='{.id}' class='picture-couplet-s2 {.cs}'>{.imghtml}<span class='close'>关闭</span></div>";
			var fixTemp = "<div id='{.id}' class='qrcode-fixed'><div class='inner'>{.imghtml}</div></div>";
			
			
			function appendDiv(data){
				$("body").append(parse(fixTemp, data));
			}
			if(fixadLeft){
				var lid = 'fixDiv_left';
				appendDiv({
					id : lid,
					cs : 'picture-couplet-left',
					imghtml : fixadLeft
				});

				var w = $("#"+lid).find('img').width(), h = $("#"+lid).find('img').height();
				$("#"+lid).fixDiv({
					top: null, //设置top/bottom
					//left: 0, //设置left/right
					// width : w,
					// height : h,
					interval: 1, //时间间隔，主要是针对ie6浏览器设置的
					dataId: 'getad_left'
				});
				
			}
			
			if(fixadRight){
				var rid = 'fixDiv_right';
				appendDiv({
					id : rid,
					cs : 'picture-couplet-right',
					imghtml : fixadRight
				});
				var w = $("#"+rid).find('img').width(), h = $("#"+rid).find('img').height();
				$("#"+rid).fixDiv({
					top: null, //设置top/bottom
					//right: 0, //设置left/right
					// width : w,
					// height : h,
					interval: 1, //时间间隔，主要是针对ie6浏览器设置的
					dataId: 'getad_right'
				});
			}		
		}
	}
	
 
 })(Gaofen, window, jQuery);