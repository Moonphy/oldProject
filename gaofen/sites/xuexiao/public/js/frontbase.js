/**
 * Created by zhiwen on 2015-02-01.
 * xuexiao 前台公共功能
 */
"use strict";

(function(win, $, G){

	var Util = G.util,
	
		Alert = G.tips.alert,	

		PD = G.PD,

		searchUri,			

		contrastName = 'schoolList',

		contrastMax = 4,

		isIE6 = navigator.userAgent.indexOf("MSIE 6.0") > 0;

	G.FN = {};

	G.setContrastName = function(n){
		contrastName = n;
	};

	G.setSearchUri = function(uri){
		searchUri = uri;
	};

	//跟踪代码SEO
	G.FN.seoFollow = function(params){
		
		if(G.PD.get('seoFollow') === '1'){
			if(typeof dataLayer === 'undefined'){
				dataLayer = [];
			}
			dataLayer.push(params); 
		}			
	};

	//处理ie9以下兼容placeholder
	G.FN.placeholder = function(ipts){
		if($.browser.msie && parseInt($.browser.version) < 10 && $.browser.version != '6.0'){
			var url = location.host.indexOf('dev') ? 'http://file.dev.gaofen.com/html/v5/js/jqplugin/placeholder/html5placeholder.min.js' : 'http://file.gaofen.com/html/v5/js/jqplugin/placeholder/html5placeholder.min.js';
			$.getScript(url || "http://dev.gaofenjs.com/jqplugin/placeholder/html5placeholder.min.js", function(data, status, jqxhr) {
			 	$.each(ipts, function(i, item){
			 		$(item).placeholder({}).parent().find('label').css({
			 			'font-size' : '14px',
			 			'line-height' : '22px',
			 			'height' :'auto',
			 			'left' : '17px'});
			 	})
			});
		}
	}

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
	})

	$.extend(Util, {

		getcookie : function(name) {
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
	    },

	    setcookie : function(cookieName, cookieValue, seconds, path, domain, secure) {
		    var expires = new Date();
		    expires.setTime(expires.getTime() + seconds);
		    document.cookie = cookieName + '=' + encodeURIComponent(cookieValue)
		    + (expires ? '; expires=' + expires.toGMTString() : '')
		    + (path ? '; path=' + path : '/')
		    + (domain ? '; domain=' + domain : '')
		    + (secure ? '; secure' : '');
		}

	});




	//对比页删除添加学校收集数据刷新页面
	var cmpPageReload = function(){
	    var ids = [];
        $('#cmpdata tr.tb-header td[rel]').each(function(i, item){
        	if($(item).attr('rel')){
        		ids.push($(item).attr('rel'));		     
        	}
        })
        location.href = G.getCmpUrl(ids);
	};





	 //模拟滚动条	
	var DragBase = function(opt){
		var config = $.extend(this, {
			view : '',	//拖动体			
			handle : '',//拖动位置
			moved : false,//拖动过
			movePart : $('body'),
			dragBar : ''				
		}, opt);

		this.movePart = $('body');
		var that = this,
			view = this.view, 
			handle = this.handle = this.dragBar;
		this.init();
		
	};
			
	DragBase.prototype = {
		
		init : function(){
			if(this.view.length && this.handle.length){
				this.initBind();
			}
		},

		reset : function(){
			var solHeight = this.view.height(), timelineHeight = this.timeline.height();
			this.solHeight = solHeight;
			this.timelineHeight = timelineHeight;
			var fb = solHeight / timelineHeight *100;
			//this.handOffTop = $('#dragBar').offset().top;
			if(timelineHeight <= solHeight+5){
                this.scrollBar.addClass('hidden');
                return false;
            }
			this.scrollBar.removeClass('hidden');
			this.timelineoff = solHeight;
			this.barHeight = fb * solHeight / 100;
			this.dragBar.height(fb + '%');
			this.dragBarHeight = this.dragBar.height();
			return true;
		},
	
		initBind : function(){
			var that = this;
			this.handle.on('mousedown', function(e){
				$.proxy(that.bind, that)(e);
			}).on('click', function(e){
				e.preventDefault();	
			});

			//处理IE8以下
			$('body').on('mouseup', function(e){
				$.proxy(that.unbind, that)(e);
			});

			$(window).mouseup(function(e){
				e.preventDefault();	
				$.proxy(that.unbind, that)(e);
			}).mouseleave(function(e){
				if(e.target.tagName.toLowerCase() === 'html'){
					$.proxy(that.unbind, that)(e);
				}
			});

			this.timeline = this.view.find('ul');
			//设置初始化高度根据active
			var active = this.timeline.find('div.active'), index;
			if(active.length && (index =  active.index())>0){
				var h = 0, allh = this.timeline.outerHeight(), val;
				this.timeline.children(':lt('+(index)+')').each(function(i, item){								
					h += $(item).outerHeight();
				});
				if(allh <= h + this.solHeight){
					val =  this.solHeight - this.barHeight;
				}else{					
					val = h/(allh)*this.solHeight;
				}
				this.setSrcoll(val);
			}
			
			this.view.on('mouseenter', function(e){
				that.mouseInter = true;
			}).on('mouseleave', function(e){
				that.mouseInter = false;
			});
            G.on('onmousewheel', function(p){
                that.mouseScrollRun(p.evt);
            })
			/*注册鼠标滚轮事件*/ 

			if(document.addEventListener && $.browser.mozilla && !(Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject)){
				//FF使用，但IE11的navigator属性几乎一致
				document.addEventListener('DOMMouseScroll',$.proxy(this.mouseScrollRun, this),false); 
			}else{
				/*window.onmousewheel = document.onmousewheel = function(){
					console.log(that.view.parent().hasClass('hidden'))
					if(!that.view.parent().hasClass('hidden')) that.mouseScrollRun();
				}; */
				this.bindOnmousewheel();
			}
		},

		bindOnmousewheel : function(){
            win.onmousewheel = document.onmousewheel = function(e){G.fire('onmousewheel', {evt:e});};//解决多次绑定时出错
			//win.onmousewheel = document.onmousewheel = $.proxy(this.mouseScrollRun, this);//IE/Opera/Chrome
		},
		//鼠标滚轮事件
		mouseInter : false,
		mouseScrollRun : function(e){
			e = e || window.event;
			if(this.mouseInter){
				var direct=0, turn = 'top'; 
				if(e.wheelDelta){//IE/Opera/Chrome 
					turn = e.wheelDelta > 0 ? 'top' : 'down';
				}else if(e.detail){//Firefox 
					turn = e.detail <0 ? 'top' : 'down';
				}				
				this.mathMouseScroll(turn, e);
			}
		},
		
		mathMouseScroll : function(turn, e){
			var top = parseInt(this.dragBar.css('top')), val, isOutScroll, max;
			
			if(turn === 'top' && top >= 0){
				if(top === 0) isOutScroll = true;
				val = top - 5;
				val = val > 0 ? val : 0;
			}else if(turn === 'down' && top <= (max  = this.solHeight - this.dragBarHeight)){
				if(top === max) isOutScroll = true;
				val = top + 5;
				if(val > max){
					val = max;
				}				
			}
			if(!isOutScroll){
				if(e.preventDefault){
					e.preventDefault();
					e.stopPropagation();
				}else{
					e.returnValue = false; 
				}
			}
			this.setSrcoll(val);
		},
		
		beforeDrag : $.noop,
		moveing : $.noop,
		afterDrag : $.noop,
		bind : function(e){
			this.movePart.bind({
				'mousemove' : $.proxy(this.dragMove, this)						
			});
			this.dragStart(e);
		},
		
		unbind : function(e){
			this.dragStop(e);
			this.movePart.unbind({
				'mousemove' : $.proxy(this.dragMove, this)					
			});				
		},
		
		
		dragStart : function(e){
			e.preventDefault();				
			var view = this.view, top = parseInt(this.handle.css('top'));	
			this.startPositoin = {cx:e.clientX, cy:e.clientY, top:top};
			this.beforeDrag && this.beforeDrag(e);
		},

		dragStop : function(e){					
			if(this.moved){
				this.moved = false;
				var view = this.view, outResult;	
			}else{
				this.afterDrag && this.afterDrag();
			}
		},
		
		dragMove : function(e){
			this.moved = true;
			e.preventDefault();
			var cache = this.startPositoin, 
				view = this.view,
				top = cache.top,
				val = e.clientY - this.startPositoin.cy + top;
			this.setSrcoll(val);	
		},
		
		setSrcoll : function(val){
			if(val <= 0){
				val = 0;
			}else if(val > this.solHeight - this.dragBarHeight){
				val = this.solHeight - this.dragBarHeight;
			}	
			var ctop = this.handle.css('top', val);
			if(val !== 0){
				val = val /(this.solHeight - this.dragBarHeight);
			}
			this.timeline.css({top:-val * (this.timelineHeight - this.solHeight)});
		}
	};
			
	G.cls['DragBase'] = DragBase;




	//本地存储
	Util.localStorage = function(page){
		if (!('localStorage' in win)) {
			/**
			 * @ignore
			 */
			win.localStorage = (function() {
				var documentElement, isIE = !!document.all;

				if (isIE) {
					documentElement = document.createElement('div');
					documentElement.style.display = 'none';
					document.body.appendChild(documentElement);
					documentElement.addBehavior('#default#userdata');
				}

				return {
					setItem: function(key, value, filename) {
						if (isIE) {
							documentElement.setAttribute(key, value);
							documentElement.save(filename ? filename: key);
						}
						else {
							win.globalStorage[location.hostname][key] = value;
						}
					},
					getItem: function(key, filename) {
						if (isIE) {
							try{
								documentElement.load(filename ? filename: key);
								return documentElement.getAttribute(key);
							}catch(e){
								return '';
							}
						}
		
						return win.globalStorage[location.hostname][key] || '';
					},
					removeItem: function(key, filename) {
						if (isIE) {
							documentElement.removeAttribute(key);
							documentElement.save(filename ? filename: key);
						}
						else {
							win.globalStorage[location.hostname].removeItem(key);
						}
					}
				};
			})();
		}

		return {
			page : page,

			get : function(key, filename){
				return localStorage.getItem(key, filename);
			},
			
			set : function(key, value, filename){
				return localStorage.setItem(key, value, filename);
			},
			
			remove : function(key, filename){
				return localStorage.removeItem(key, filename);
			},
			
			initEx : function(dom){

			}
			
		}
	};

	if(typeof JSON === 'undefined'){
		var j = window['JSON'] = {};
		j.stringify = JSON.stringify || function (obj) {
		    var t = typeof (obj);
		    if (t != "object" || obj === null) {
		        // simple data type
		        if (t == "string") obj = '"'+obj+'"';
		        return String(obj);
		    }
		    else {
		        // recurse array or object
		        var n, v, json = [], arr = (obj && obj.constructor == Array);
		        for (n in obj) {
		            v = obj[n]; t = typeof(v);
		            if (t == "string") v = '"'+v+'"';
		            else if (t == "object" && v !== null) v = JSON.stringify(v);
		            json.push((arr ? "" : '"' + n + '":') + String(v));
		        }
		        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		    }
		};
	}
		
	
	var Templet = G.Templet = {

		//选择学校层
		addcmp : ['<div class="ui-dropdown">',
                    '<div class="ui-dropdown-in">',
                        '<div class="query blur">',
                            '<input type="text"  autocomplete="off">',
                                '<span class="close"></span>',
                        '</div>',
                        '<div class="query-result hidden">',
                            '<div class="tips-null">暂未能找到，换所学校试试？</div>',
                        '</div>',
                        '<div class="query-result">',
                            '<ul></ul>',
                            '<div class="scroll-bar">',
                                '<div class="scroll-track"></div>',
                                '<div style="height:40px;" class="scroll-thumb"></div>',
                            '</div>',
                        '</div></div><i class="arrow"><i class="arrow-border"></i><i class="arrow-body"></i></i>',
				'</div>'].join(''),
		//登录内容
		win_login  : ['<div class="form" id="form-logins">',
                '<h2>登录高分网</h2>',
                '<div class="form-row">',
                    '<label class="control-label">账号</label>',
                    '<div class="controls">',
                        '<input id="username" type="text" placeholder="用户名/邮箱" class="input-text" />',
                    '</div><span class="help-inline hidden">成功</span>',
                '</div>',
                '<div class="form-row">',
                    '<label class="control-label">密码</label>',
                    '<div class="controls">',
                        '<input type="password" class="input-text" id="pwd"/>',
						'<div class="operations">',
                            '<label class="checkbox">',
                                '<input type="checkbox" id="rem"/>下次自动登录</label><a  target="_blank" href="http://my.gaofen.com/signup/getpwd">忘记密码?</a>',
                        '</div>',
                    '</div><span class="help-inline hidden">成功</span>',
                '</div>',
                '<div class="actions error">',
                    '   <label class="btn btn-primary" id="lgbtn"><button type="submit" id="lg" title="登录">登录</button></label>',
					'   <span class="btn btn-disabled hidden" id="lging">正在登录...</span>',					
					'<span class="help-inline hidden" id="msg">用户名或密码错误</span>',
                '</div>',
            '</div>',
			'<div class="other-login">',
                '<div class="hd">',
                    '<h2>使用合作网站账号登录</h2>',
                '</div>',
                '<div class="bd">',
                    '<div class="quick-login clearfix"><a target="_blank" href="http://my.gaofen.com/account/sinaLogin" title="用微博账号登录" class="btn-weibo-large">用微博账号登录</a><a target="_blank" href="http://my.gaofen.com/account/qzoneLogin" title="用QQ账号登录" class="btn-qq-large">用QQ账号登录</a>',
                    '</div>',
                    '<div class="actions"><a target="_blank" href="http://my.gaofen.com/signup">立即注册</a></div>',
                '</div>',
            '</div>'
			].join(''),

		modalBack : ['<div class="modal-backdrop"></div>'].join(''),

		modal : ['<div class="modal modal-tips hidden {.cs}"><div class="modal-header"><h3>{.title}</h3></div><div class="modal-body" id="mb">{.bodyHtml}</div><a data-dismiss="modal" href="#" class="close">×</a></div>'].join(),

		pk : ['<div id="noResult">',
			        '<div class="alert alert-info">',
			            '<i class="ico"></i>',
			            '<div class="info"><p>您未选择对比学校，暂时无法对比</p></div></div>',
			        '<div class="actions"><a href="#" class="btn btn-primary">确定</a></div>',
			    '</div>',
			    '<div id="schoolList" class="comparison-list"><ul></ul>',
			    	'<div class="actions"><a href="#" target="_blank" class="btn btn-primary" rel="cmp">开始对比</a></div>',
			    '</div>',
			    '<div id="outLists">',
			    	'<div class="alert alert-info"><i class="ico"></i><div class="info"><p>对不起！每次最多可对比4所学校。您可以：</p><p><a href="#" id="clearAll">清空对比筐</a> 或者 <a href="#" id="toDel">取消部分学校</a></p></div></div>',
			    	'<div class="actions"><a href="#"  class="btn btn-primary">确定</a></div>',
			    '</div>'
			    ].join(''),
		pkli : '<li rel="{.id}"><div class="operations"><a href="#" class="btn btn-small">取消对比</a></div><div class="name"><a href="{.uri}" target="_blank">{.name}</a></div></li>',
		 
		cmpHeader : ['<div class="comparison-fixed hidden" id="cmpHeader"><div class="inner"><div class="container"><div class="comparison-table"><table><tbody><tr class="tb-header">{.headHtml}</tr></tbody></table></div></div></div></div>'].join(''),
	
		tips : ['<div class="alert {.tip_cs}"><i class="ico"></i><div class="info"><p>{.msg}</p></div></div><div class="actions"><a href="#" class="btn btn-primary">确定</a></div>'].join(''),

		'baiduMap' : ['<h3 class="name" id="name"></h3>',
			'<div class="address" id="address"></div>',
			'<div class="map" id="bmap" style="width:640px;height:280px;"></div>',
			'<div class="tips">注：地图位置标注仅供参考，具体情况以实际道路标识信息为准</div>',
			'<div class="operations"><a href="#" target="_blank" id="print">打印</a><i>|</i><a href="http://map.baidu.com" id="tobaidu" target="_blank">前往百度地图</a></div>'].join('')
		
	}



	 function createModal(opt){
	 	var config = $.extend({
	 		cs : '',
	 		title : '',
	 		bodyHtml : '',
	 		modalBack : false,
	 		appendTo : 'body'
	 	}, opt);

	 	var modal = Util.parse(Templet.modal, config);

	 	modal = $(modal).appendTo(config.appendTo);
	 	if(config.modalBack){
	 		modal.mb = $(Templet.modalBack).appendTo('body');
	 	}

	 	return modal;
	 }

	//一般提示层，同时只能显示一个这样的层
	var tipModalObj = null, 

		tipModal = G.cls.tipModal = function(opt){
			if(tipModalObj){
				tipModalObj.remove();
				tipModalObj = null;
			}
			var modal = createModal($.extend({
		 		title : '提示',
		 		bodyHtml : Util.parse(Templet.tips, $.extend({
		 			tip_cs : 'alert-info'}, opt))
		 	}, opt));

			opt.afterShow && opt.afterShow.call(modal);

			modal.on('click', 'a.close,a.btn-primary', function(e){
		 		e.preventDefault();
		 		modal.remove();	 		
		 	}).on('click', function(e){
		 		e.stopPropagation();
		 	}).removeClass('hidden');
		 	$('body').on('click', function(e){
		 		modal.remove();	 
		 	})
		 	tipModalObj = modal;
		 	return modal;
		},


	 /**
	 * PK层
	 *
	 **/

		pkBox,
	 	createPK = G.cls.createPK = function(){
	 		var localStorageCon = G.cls.localStorageCon;
		 	if(!pkBox){

		 		//浏览器内同步	
			 	if(window.addEventListener && !(Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject)){//支持onstorage,除IE11，ie11 change时会触发当前页面事件
					window.addEventListener("storage", function(){
						setTimeout(function(){G.fire('setpk');},1);
					}, false);
				}else{//IE下全部采用定时刷新
					setInterval(function(){
						setTimeout(function(){//避免先后顺序
							var ls = localStorageCon.get().length;
							var num = Number($('#pk').find('span').text());
							if(ls !== num) G.fire('setpk');
						},10);
					}, 10000);
				}	 	

			 	var modal = createModal({
			 		cs : 'modal-comparison',
			 		title : '对比学校',
			 		bodyHtml : Templet.pk
			 	});
			 	$('body').on('click', function(e){
			 		pkBox.hide();
			 	});
			 	modal.on('click', function(e){
			 		e.stopPropagation();
			 	}).on('click', 'a.close,a.btn-primary', function(e){
			 		
			 		if($(this).attr('rel') !== 'cmp'){
			 			e.preventDefault();
						pkBox.hide();
			 		}else{//新页面打开	 			
			 			localStorageCon.cmp($(this), function(){
			 				pkBox.hide();
			 			});
			 		}		 		
			 	}).on('click', 'a.btn-small', function(e){
			 		e.preventDefault();
			 		var li = $(e.target).closest('li'), rel = li.attr('rel');
			 		if(localStorageCon.del(rel)){
			 			li.remove();
			 			G.fire('showPkBox', {num : localStorageCon.get().length});
			 		};
			 	}).on('click', '#clearAll,#toDel', function(e){
			 		e.preventDefault();
			 		if($(this).attr('id') === 'clearAll'){
			 			localStorageCon.clear();
			 			pkBox.hide();
			 		}else{
			 			G.fire('showPkBox', { num : contrastMax});
			 		}
			 	});
			 	return pkBox = {
			 		beforeShow : function(){
			 			var ls = localStorageCon.get(), lis = [];
			 			$.each(ls, function(i, item){
			 				lis.push(Util.parse(Templet.pkli, item));
			 			});
			 			this.getView().find('ul').html(lis.join(''));
			 		},
			 		getView : function(){
			 			return modal;
			 		},
			 		show : function(){
			 			this.beforeShow();
			 			modal.removeClass('hidden');
			 		},
			 		hide : function(){
			 			modal.addClass('hidden');
			 		}	
			 	}
			 }
		 },

		 //公共搜索
		searchPublic = G.cls.searchPublic = function(searchDom, text){
			//顶部搜索
			if(searchDom.length){
				new G.cls.AutoInput({
					view : searchDom,
					floatCs : 'ul',
					text : text || '',
					autoPanel:searchDom.find('div.ui-dropdown'),
					autoJump : true,
					itemTemp : '<li  rel="{.id}"><a target="_blank" tabindex="-1" href="{.link}">{.name}</a></li>',
					uri :  G.getRouter(searchUri+'?q='),
					afterClickBody : function(e){
			            if($(e.target).closest(this.autoPanel).length === 0 && $(e.target).is(this.input) === false && e.target.tagName.toLowerCase() !== 'button'){
			                //this.hide();
			                this.removeFloat();
			                this.autoPanel.addClass('hidden');
			                this.input.blur();
			            }
			            
			        },
					callBackAfter : function(re){
						this.autoPanel.removeClass('hidden');
						if(re.length){
							this.view.find('ul').parent().removeClass('hidden');
							this.view.find('.tips-null').parent().addClass('hidden');
						}else{
							this.view.find('ul').parent().addClass('hidden');
							this.view.find('.tips-null').parent().removeClass('hidden');
						}
						this.bdrag.view[this.bdrag.reset() ? 'addClass':'removeClass']('scrollable');
						this.bdrag.bindOnmousewheel();
					},
					input : searchDom.find('input'),
					initReady : function(){
						var that = this;
						this.input.on('focus', function(e){
							that.input.removeClass('blur');
							if($.trim(that.input.val()) === that.text) that.input.val('');
						}).on('blur', function(e){
							if($.trim(that.input.val()) === ''){
								that.input.val(that.text).addClass('blur');
							}
						});

						var scrollArea = this.view.find('div.query-result').eq(1), dragBar = scrollArea.find('div.scroll-thumb'), 
							scrollBar = scrollArea.find('div.scroll-bar');
						this.bdrag = new G.cls.DragBase({
							view : scrollArea,
							dragBar : dragBar,
							scrollBar: scrollBar
						});
					}
				});

				searchDom.find('.search-btn').on('click', function(e){
					var v = $.trim(searchDom.find('input').val());
					if(v === text){
						searchDom.find('input').val('');
					}					
				});
			}
		};

		//对比动画效果
		G.cls.contrastMove = (function(_target){
			var bianliang = 45//数值越大越慢，移动的次数越多
				, mubiao //要移动到的位置 
				, target = _target//要移动到的对象
				, org; // 移动对象

	        function setMubiao(){
	        	//target = t || target;
	        	if(target && target.length){
		        	var off = target.offset();
		        	mubiao = {x : off.left+40, y : off.top};
	        	}
	        }

	        function getPosition(ev) {
	            ev = ev || window.event;
	            var point = { x: 0, y: 0 };
	            if (ev.pageX || ev.pageY) {
	                point.x = ev.pageX;
	                point.y = ev.pageY;
	            } else {//兼容ie  
	                point.x = ev.clientX + document.body.scrollLeft - document.body.clientLeft;
	                point.y = ev.clientY + document.documentElement.scrollTop;
	            }
	            return point;
	        }


	       
	        
	        function movediv() {
	        	 
	            var top_str = org.css("top").split('p')[0];
	            var left_str = org.css("left").split('p')[0];
	            if (top_str >= mubiao.y && left_str >= mubiao.x) {
	                bianliang = 60;
	                org.remove();
	                G.fire('moveSuccess', {target:target, org:org})
	                return;
	            }
	            //if (top_str < mubiao.y)
	                org.css({ "top": (top_str-0 + (mubiao.y - top_str-((bianliang-1)*10)) / (bianliang-0)) + "px" });
	            //else if (top_str > mubiao.y)
	            //    $("#fixeddiv").css({ "top": (top_str - ((top_str - mubiao.y) / bianliang)) + "px" });
	            if (left_str < mubiao.x)
	                org.css({ "left": (left_str - 0 + (mubiao.x - left_str) / (bianliang-0)) + "px" }); 
	//            else if (left_str > mubiao.x)
	//                $("#fixeddiv").css({ "left": (left_str - 10) + "px" });
	            bianliang--;
	            setTimeout(movediv,12);//移动的速度
	        }	

	        setMubiao();

	        return {
		        move : function(e, _target){ 
			        var point = getPosition(e);
			        setMubiao();
		            org.css({ "top": point.y + "px", "left": point.x + "px" }); //fixeddiv要移动的盒子的ID
		            movediv();
		        },
		        createOrg : function(tar){
		        	var html = $('<div class="pk-dot"></div>'), tarOff = tar.offset();
		        	org = $(html).css({'top':tarOff.top,'left':tarOff.left}).appendTo('body');
		        }
	    	};

		});



		//操作对比缓存
		var localStorageCon = G.cls.localStorageCon = {
			get : function(id){//取缓存对比学校，id为空时取全部，id为单个时取一个数据，id为‘，’隔开id串，取多个
				var ls = Util.localStorage.get(contrastName);
				ls = ls ? $.parseJSON(ls) : [];
				if(id === undefined){
					return ls;
				}else{
					if($.type(id) === 'number' || id.split(',') === 1){
						return this.match(id, ls);
					}
				}
			},

			clear : function(){
				var items = this.get(), that = this;
				$.each(items, function(i, item){
					that.del(item.id);
				});
			},

			match : function(id, cons){
				cons = cons || this.get();
				var rl;
				$.each(cons, function(i, item){
					if(item.id == id){
						rl = item;
						return false;
					}
				});
				return rl;
			},

			isHas : function(id, cons){
				return this.match(id, cons);
			},

			add : function(obj, et){
				var cons = this.get();
				if(this.isHas(obj.id, cons)){
					alert('学校已添加');
					return false;
				}
				cons.push(obj);
				Util.localStorage.set(contrastName, JSON.stringify(cons));
				G.fire('joincmp', {dom : et, data : obj});
				return true;
			},
			del : function(id){
				var cons = this.get(), ls, delTure = false;
				$.each(cons, function(i, item){
					if(item.id == id){
						ls  = item;
						cons.splice(i, 1);
						delTure = true;
						return false;
					}
				});
				if(delTure){
					Util.localStorage.set(contrastName, JSON.stringify(cons));
					G.fire('deletecmp', {item : ls});
				}
				return delTure;
			},
			cmp : function(dom, fn){
				var sl = this.get();
				if(sl.length > 0){
					var ids = [];
					$.each(sl, function(i, item){
						ids.push(item.id);
					});
					if(dom){
						dom.attr('href', G.getCmpUrl(ids));
						fn && fn();
					}else{
						win.location.href = G.getCmpUrl(ids);
					}
				}		
			}
		};

		//加入、取消对比后效果
	G.cls.contrastEffect = function(type, dom, params){
		switch(type){

			case 1 ://rank 排行榜加入效果

				$(dom).removeClass('hidden').find('a').replaceWith('<span>已加入对比</span>');

			break;

			case 11 :
				dom.each(function(i, item){
					$(item).addClass('hidden').find('span').replaceWith('<a href="#" rel="e:contrast,id:'+params.id+',n:'+params.name+',uri:'+params.uri+'">加入对比</a>');
				})
			break;

			case 2 ://首页

				$(dom).find('a').replaceWith('<span>已加入对比</span>');

			break;

			case 21 :
				dom.each(function(i, item){
					$(item).find('span').replaceWith('<a href="#" rel="e:contrast,id:'+params.id+',n:'+params.name+',uri:'+params.uri+'">加入对比</a>');
				})
			break;

			case 3 : //详细页
			//debugger;
				dom.addClass('btn-added-comparison').find('span').text('取消对比');
				var rel = dom.attr('rel');
				dom.attr('rel', rel.replace('e:contrast','e:cancelcmp'));
			break;

			case 31 : 
				dom.removeClass('btn-added-comparison').find('span').text('加入对比');
				var rel = dom.attr('rel');
				dom.attr('rel', rel.replace('e:cancelcmp','e:contrast'));
			break;

			case 4 : 
				$(dom).addClass('comparison-added');
			break;

			case 41 : 
				$(dom).removeClass('comparison-added');
			break;
		}


	};

	var picPreview = G.cls.picPreview = function(config){
		$.extend(this, {
			auto : false,
			view : null,
			viewMain : null,
			viewThumb : null,
			showThumb : 5,
			firstCs : 'show-prev',
			lastCs : 'show-next',
			count : 10,
			imgList :null,
			index : 1,
			currPage : 1,
			controlView : null
		}, config);
		this.init();
	}

	picPreview.prototype = {

		init : function(){
			
			var that = this;
			//this.imgList = PD.get('imgList');
			this.count = this.imgList.length;
			this.setPage();
			this.viewThumb = this.view.find('.thumbnails');
			this.viewMain.hover(function(){
				that.setMainCs(true);
			},function(){
				that.setMainCs();
			});

			this.viewMain.on('click', 'a', function(e){
				e.preventDefault();
				var toPage = 'prev';
				if($(this).hasClass('next')){
					toPage = 'next';
				}
				that.setIndex(toPage);
				that.setPage();
				that.setMainCs(true);
				that.view.trigger('changeImg',{toPage : toPage});
			})

			if(this.viewThumb.length){

				this.view.on('changeImg', function(e, obj){
						that.setThumbPage();
						that.setLittlePic(obj);
						that.setTitle();
				})
				
				this.viewThumb.on('click', 'a.next,a.prev,li', function(e){
					e.preventDefault();
					if(this.tagName.toLowerCase() === 'a'){								
						var toPage = 'prev';
						if($(this).hasClass('next')){
							toPage = 'next';
						}
						if(toPage === 'prev' && that.currPage === 1) return;
						if(toPage === 'next' && that.currPage >= that.count/that.showThumb) return;
						if(toPage === 'prev'){
							that.setLeft(-(--that.currPage - 1)* that.showThumb * 130);
							that.index = that.currPage *that.showThumb;
						}else{
							that.setLeft(-(++that.currPage - 1)* that.showThumb * 130);
							that.index = (that.currPage - 1) *that.showThumb +1;
						}
						that.setPage();
						that.setMainCs();
						that.view.trigger('changeImg');
						return;
						if(toPage === 'prev' && that.index === 1) return;
						if(toPage === 'next' && that.index === that.count) return;
						that.setIndex(toPage);
						that.view.trigger('changeImg',{toPage : toPage});
						that.setPage();
						that.setMainCs();
					}else{
						if(!$(this).hasClass('active')){
							that.index = $(this).index()+1;
							that.view.trigger('changeImg',{toPage : toPage});
							that.setPage();
							that.setMainCs();
						}
					}
				})
			}


		},

		setMainCs : function(show){
			if(show){
				if(this.index === 1){
					this.viewMain.removeClass(this.firstCs);
				}else{
					this.viewMain.addClass(this.firstCs);
				}
				if(this.index === this.count){
					this.viewMain.removeClass(this.lastCs);
				}else{
					this.viewMain.addClass(this.lastCs);
				}
			}else{
				this.viewMain.removeClass(this.lastCs).removeClass(this.firstCs);
			}
		},

		getBigPic : function(){
			return this.imgList[this.index-1];
		},

		setIndex : function(toPage){
			this.index = toPage === 'next' ? ++this.index : --this.index;
		},

		setPage : function(){	
			var src = this.getBigPic(), that = this;									
			this.viewMain.find('img').attr('src', '');
			this.view.find('div.pages').html('<span>'+this.index+'</span>/'+this.count);
			Util.drawImage(src, 600, 450, function(obj){
				var imgobj = that.viewMain.find('img').attr('src', src).css({width:obj.width,height:obj.height});
				Util.setImagePosition(imgobj[0], obj.width, obj.height, 600, 450);
			});
		},

		setThumbPage : function(){
			this.viewThumb.find('.active').removeClass();
			this.viewThumb.find('li').eq(this.index-1).addClass('active');
		},

		setLittlePic : function(obj){
			if(!obj) return;
			var toPage = obj.toPage, ul = this.viewThumb.find('ul'), ulpx = parseInt(ul.css('marginLeft')), 
				left = Math.abs(ulpx/-130), goPx = null;

			var currPage = Math.ceil(this.index / this.showThumb);
			if(currPage != this.currPage){
				if(toPage === 'prev'){
					this.setLeft(-(--this.currPage - 1)* this.showThumb * 130);
					//that.index = that.currPage *that.showThumb;
				}else{
					this.setLeft(-(++this.currPage - 1)* this.showThumb * 130);
					//that.index = (that.currPage - 1) *that.showThumb +1;
				}
			}else{
				if(toPage === 'next'){
					var right = left + 5;
					if(this.index > right){
						goPx = ulpx - 130;
					}	
				}else{
					if(this.index < left + 1){
						goPx = ulpx + 130;
					}
				}
				if(goPx !== null){
					this.setLeft(goPx+'px');
				}
			}

		},

		setLeft : function(px){
			this.viewThumb.find('ul').animate({'marginLeft':px}, 300);
			//this.viewThumb.find('ul').css('marginLeft', px);
		},

		setTitle : function(){
			var title = this.viewThumb.find('li.active span').text();
			this.view.find('div.title').text(title);
		}

	}

	//模拟下拉
	var likeSelect = G.cls.LikeSelect = function(opt){
		var config = $.extend(this, {
			view : '',
			handle : '',//点击位置
			valueInput : '',
			textArea : '',
			dropdown : '',
			scrollable : false,//下拉
			selectActiveCs : 'ui-select-active',
			selectedCs : 'ui-select-selected'
		}, opt);
		this.init();
	};

	likeSelect.prototype = {
		init : function(){
			var that = this, nid = (+new Date)+Math.ceil(Math.random()*100);
			this.handle.on('click', function(e){
				e.stopPropagation();
				that.show();
				G.fire('likeSelect-close', {
					nid : nid
				});
			});

			this.view.attr('vrel', nid);

			G.on('likeSelect-close', function(p){
				if(p && p.nid === nid) return;
				that.close();
			})

			G.on('global-bodyClick', function(e){
				if(that.dropdown.display()){
					G.fire('likeSelect-close', {
						//nid : nid
					});
				}
			});

            G.on('likeSelect-valueChange'+nid, function(p){
                //if(p.newValue == '0'){
                    that.setSelectCs(p.newValue);
                //}
            });


            this.dropdown.find('ul').on('click','li', function(e){
				var dom = $(this),
					text = dom.text(),
					rel = Util.parseKnV(dom.attr('rel')),
					orgValue = that.valueInput.val();
				that.valueInput.val(rel.value);
				that.textArea.text(text);

				if(rel.value !== orgValue){
					G.fire('likeSelect-valueChange'+nid, {
						orgValue : orgValue,
						newValue : rel.value
					});
				}
			});

			if(this.valueInput.val() !==''){
				this.setSelectCs(true);
			}

			var scrollArea = this.view.find('div.scrollable'), dragBar = scrollArea.find('div.scroll-thumb'), 
				scrollBar = scrollArea.find('div.scroll-bar');
			scrollBar.display(1);
			this.bdrag = new G.cls.DragBase({
				view : scrollArea,
				dragBar : dragBar,
				scrollBar: scrollBar
			});

			setTimeout(function(){
				//自动设置高度（默认高度是192,少于8个调节高度）
				var len = scrollArea.find('li').length;
				if(len < 8){
					scrollArea.css('height', len * 24);
				}
			}, 1);

		},

		close : function(e){
			this.dropdown.display(0);
			this.view.removeClass(this.selectActiveCs);
			if($.browser.msie && parseInt($.browser.version) < 8){
				this.view.css('zIndex', 0);
			}
		},

		show : function(){
			this.dropdown.display(1);
			this.view.addClass(this.selectActiveCs);
			this.bdrag.reset();
			if($.browser.msie && parseInt($.browser.version) < 8){
				this.view.css('zIndex', 1);
			}
		},

		setSelectCs : function(p){
			this.view[p ? 'addClass':'removeClass'](this.selectedCs);
		}
	};


	//百度地图
	G.cls.BaiduMap = function(opt){
		var modal = createModal($.extend({
	 		title : '学校地址',
	 		cs : 'modal-map',
	 		centerAddress :'',
	 		school_name :'',
	 		modalBack : true,
	 		bodyHtml : Util.parse(Templet.baiduMap)
	 	}, opt));

	 	modal.on('click', 'a.close,#print', function(e){	 		
	 		var jqt = $(this);
	 		if(jqt.hasClass('close')){
	 			e.preventDefault();
	 			Obj.display(0);
	 		}else if(jqt.attr('id') === 'print'){
	 			var params = {newmap:1,
						shareurl:1,
						l:16,
						tn:'B_NORMAL_MAP',
						c:'12609862,2631075',
						cc:'gz',
						i:'-1|-1|-1',
						s:'s&da_src=pcmappg.searchBox.sugg&wd='+opt.centerAddress+'&c=257&src=0&sug=1&l=12&from=webmap',
						pw:2},
					p = [];
				$.each(params, function(i, k){
					p.push(i+'='+encodeURIComponent(k));
				})
				jqt.attr('href' , 'http://map.baidu.com/?'+p.join('&'));
	 			//window.print();
	 		}
	 	});




	 	var Obj = {
	 		map : null,
	 		init : function(){
				var map = this.map = new BMap.Map("bmap");
				if(opt.centerAddress){
					this.setPlace(opt.centerAddress, function(){
						map.enableScrollWheelZoom(); 
					})
				}else{
					map.centerAndZoom("广州",13);   
					map.enableScrollWheelZoom(); 
				}

				this.view = modal;
				this.display(1);
				//this.setPlace();
	 		},
	 		display : function(p){
	 			modal.display(p);
	 			modal.mb.display(p);
	 		},

	 		setInfo : function(name, address){
	 			modal.find('#name').text(name);
	 			modal.find('#address').text('地址：'+address);
	 		},

	 		setPlace : function(address, fn){
	 			var myGeo = new BMap.Geocoder(), map = this.map;
				myGeo.getPoint(address || "广州市越秀区中山三路33号中华国际中心B座2407室", function(point){
					if (point) {
						map.centerAndZoom(point, 16);
						var marker = new BMap.Marker(point, {title:opt.school_name||''});

						map.addOverlay(marker);
						marker.setAnimation(BMAP_ANIMATION_DROP);
						fn && fn();
						//console.log('set address done!');
					}else{
						//console.log("您选择地址没有解析到结果!");
					}
				}, "广州市");
	 		}


	 	}
	 	Obj.init();	
	 	return G.cls.BaiduMap = Obj;
	};


	G.cls.Login = function(opt){
		var modal = $('#login_modal');
		if(modal.length === 0){
			modal = createModal({
		 		cs : 'modal-login',
		 		title : '登录',
		 		modalBack : true,
		 		bodyHtml : Templet.win_login
		 	});
			modal.removeClass('modal-tips').attr('id', 'login_modal');

			modal.on('reset', function(e){
				//console.log('reset');
			}).on('close', function(){
				modal.display(0);
				modal.data('mb').display(0);
			});

			var self = this, jf = modal.find('#form-logins'), inputs = jf.find('input[class="input-text"]'), 
				form_rows = jf.find('.form-row'), msg = modal.find('#msg'), 
				jqun = inputs.eq(0), jqpwd = inputs.eq(1),
				focusCss = 'hints', errorCss = '', successCss = 'success',
				lock = false;
			var setFormRowCss = function(dom, css){
				setSuccess($(dom).closest('.form-row').attr('class', 'form-row '+css), css === successCss);
			}
			var setSuccess = function(dom, p){
				dom.find('.help-inline').cssDisplay(p);
			}
			var vil = function(){
				var nerr = false, perr = false;
				if($.trim(jqun.val()) === ''){
					nerr = true;
				}
				if($.trim(jqpwd.val()) === ''){
					perr = true;
				}
				if(nerr && perr){
					msg.cssDisplay(1).html('请输入帐号和密码');	
					jqun.focus();
				}else if(nerr){
					msg.cssDisplay(1).html('请输入帐号');	
					jqun.focus();
				}else if(perr){
					msg.cssDisplay(1).html('请输入密码');	
					jqpwd.focus();
				}
				return (!nerr && !perr);
			}
			inputs.focus(function(e){
				setFormRowCss(this, focusCss);
			}).blur(function(e){
				if($.trim(this.value)){
					setFormRowCss(this, successCss);
				}else{
					setFormRowCss(this, errorCss);
				}
			}).keyup(function(e){
				if(e.keyCode === 13) modal.find('#lg').click();
			});
			var jqlg = modal.find('#lg').click(function(e){
				if(lock || !vil())return;
				lock = true;
				modal.find('#lgbtn').display(0);
				modal.find('#lging').display(1);	
				msg.display(0);
				var url = 'http://ziliao.gaofen.com/ajax/login?callback=?';	
				G.Ajax.send(url, {
					username : $.trim(jqun.val()),
					password : $.trim(jqpwd.val()),
					save_me : modal.find('#rem').prop('checked') ? 1 : 0
				},function(r){
					lock = false;
					if(r.errno == '0'){
						//跟踪代码SEO
						G.FN.seoFollow({'event': 'signin'});							
						$("body").append(r.rst.data);
						setTimeout(function(){
							window.location.reload();
						},2000);
					}else{
						modal.find('#lgbtn').display(1);
						modal.find('#lging').display(0);
						jf.find('#register').attr({"title":"登录"}).prop('disabled', false).html("登录");
						msg.display(1).html(r.err);								
					}
				}, 'jsonp');
			});



			modal.find('a.close').on('click', function(e){
				e.preventDefault();
				modal.trigger('reset').trigger('close');
			})
		 }
		try{
			modal.display(1);
			if(!modal.mb){
				modal.data('mb').display(1);
			}else{
				modal.data('mb', modal.mb);
			}
		    
		}catch(e){}


		 return modal;
	};



	//回到顶部
	Util.goTop = function(){
				
		var toTop = $('#goTop').hide(), pt;
		/*
		 *IE6下自动适应
		 */	
		if(toTop.length === 0) return;
		if ($.browser.msie) {
			if ($.browser.version == "6.0"){
				toTop.css({"position":"absolute","bottom":"0"});
				setInterval(function(){
					var th = $(win).scrollTop(),
					    //ah = document.documentElement.clientHeight-81;//ie6下，得到窗口显示区域高度
					    ah = document.documentElement.clientHeight/2;
					toTop.css({'top':th+ah});
				},1);//计时器，设置返回顶部操作
			 }
		}
		toTop.click(function(e){

			e.preventDefault();
			$('body,html').animate({scrollTop:0},800);
		});

		if($(this).scrollTop()>0)
			toTop.fadeIn(500);
		$(win).scroll(function(){
			var sh=$(this).scrollTop();		
			if(sh>200){
				toTop.fadeIn(500);			
			}else{
				toTop.fadeOut(500);
			}
		});
		$(win).scroll();
	};


	/*---------------------  添加事件 rel=e:xx  --------------------------*/

	G.actions
	.reg('fav', function(e, d){
		if(Util.getcookie('gaofen_user')){//必需登录
			var relDom = d.target, uri = relDom.attr('href'), type = d.type;
			var cstype = Number(d.cstype || 1), text;
			if(uri === '' || uri === '#'){
				uri = '/'+(G.PD.get("modal")||"cz")+'/ajax/follow';
			}
			relDom.data('lock',1);
			G.Ajax.send(G.getRouter(uri), {school_id:d.id}, function(r){
				if(r.errno == '0'){
					switch(cstype){
						case 1 : 
							text = '取消收藏';
							if(type == '1'){//收藏
								uri = uri.replace('follow', 'unfollow');
								relDom.attr({'rel': relDom.attr('rel').replace('type:1', 'type:2'), 'href':uri});
							}else{//取消收藏
								text = '收藏本校';
								uri = uri.replace('unfollow', 'follow');
								relDom.attr({'rel':relDom.attr('rel').replace('type:2', 'type:1'), 'href' : uri});
							}
						break;

						case 2 ://高中库首页
							relDom.replaceWith('<span>已收藏</span>');
						break;
					}

					relDom.find('span').html(text);
				}
				relDom.data('lock','');
			});
		}else{
			tipModal({
				msg : '亲，请先登录再操作喔！'
			});
		}
	})
	.reg('attention', function(e){//关注学校



	}).reg('contrast', function(e, d){//加入对比
		var cons = localStorageCon.get(), isAdd;
		if(cons.length){
			if(cons.length >= contrastMax){//对比不能超过4个学校
				//延时为了避免先打开再触发点击页面内容关闭浮层事件，先关闭浮层再打开
				setTimeout(function(){
					G.fire('showPkBox', { num : contrastMax+1});
				},10);
				return;
			}else{
				isAdd = localStorageCon.add({'name':d['n'],id :d['id'],'uri':d['uri']}, e.target);
			}
		}else{
			isAdd = localStorageCon.add({'name':d['n'],'id': d['id'],'uri':d['uri']}, e.target);
		}
		//e.target.id = 'fixeddiv';
		if(isAdd){
			if(isIE6) G.fire('setpk');
			else{
				G.moveaction.createOrg($(e.target));
				G.moveaction.move(e);
			}
		}

	}).reg('addcmp', function(e){//对比换学校
		var jqt = $(e.target), 
			addcmpBox = $('body').data('addcmpBox');
		if(!addcmpBox){
			
			addcmpBox = $(Util.parse(Templet['addcmp'], {})).appendTo(jqt.parent());
			$('body').data('addcmpBox', addcmpBox);
			
			var cmpObj = new G.cls.AutoInput({
				view : addcmpBox,
				floatCs : 'ul',
				text : '请输入您要查找的学校名',
				max : 25,
				itemTemp : '<li rel="{.id}"><a target="_blank" tabindex="-1" href="{.link}">{.name}</a></li>',
				uri :  G.getRouter(searchUri+'?q='),
				reset : function(){
					this.clearInput('');
					this.view.find('.query-result').eq(0).addClass('hidden');
					this.view.find('.query-result').eq(1).removeClass('hidden').removeClass('scrollable');
					this.removeFloat();
					this.input.val(this.text).parent().attr('class', 'query blur');
				},
				initReady : function(){
					var that = this;
					this.view.find('span.close').on('click', function(e){
						that.reset();
					});
					this.input.on('focus', function(){
						$(this).parent().removeClass('blur');
						if($.trim(that.input.val()) === that.text) that.input.val('');
					}).on('keyup', function(e){
						$(this).parent()[$.trim(this.value) ? 'addClass' : 'removeClass']('query-inserting');
					}).blur(function(){
						if($.trim(that.input.val()) === ""){
							that.input.parent().addClass('blur');
							that.input.val(that.text);
						}
						//$(this).parent().attr('class', 'query');
					})

					var scrollArea = this.view.find('div.query-result').eq(1), dragBar = scrollArea.find('div.scroll-thumb'), 
						scrollBar = scrollArea.find('div.scroll-bar');
					this.bdrag = new G.cls.DragBase({
						view : scrollArea,
						dragBar : dragBar,
						scrollBar: scrollBar
					});
				},
				afterClickBody : function(e){
					if($(e.target).hasClass('trigger')) return;
					addcmpBox.hide();
				},
				callBackAfter : function(re){
					if(re.length){
						this.view.find('ul').parent().removeClass('hidden');
						this.view.find('.tips-null').parent().addClass('hidden');
					}else{
						this.view.find('ul').parent().addClass('hidden');
						this.view.find('.tips-null').parent().removeClass('hidden');
					}

					this.bdrag.view[this.bdrag.reset() ? 'addClass':'removeClass']('scrollable');
					this.bdrag.bindOnmousewheel();

					
				},
				afterChoosed : function(dom){				
		            var td = addcmpBox.closest('td'), id = dom.attr('rel');
		            
		            if(td.attr('rel') !== id){
		            	if($('#cmpdata tr.tb-header td[rel="'+id+'"]').length){
		            		tipModal({msg:'这所学校已添加了，无需重复添加'});
		            		return false;
		            	}
		            	var index = td.index();
		            	$('#cmpdata tr.tb-header td').eq(index).attr('rel', id);	
		            	this.hide();		            
			            cmpPageReload();
			        }else{
			        	tipModal({msg:'这所学校已添加了，无需重复添加'});
			        	return false;
			        }
				},				
				input : addcmpBox.find('input')
			});
			addcmpBox.on('click', function(e){
				e.stopPropagation();
			});
		}else{
			if(jqt.parent().find('div.ui-dropdown').length === 0){
				addcmpBox.cmpObj.reset();
				addcmpBox.appendTo(jqt.parent()).show();
			}else{
				addcmpBox.show();
			}
			//addcmpBox.cmpObj.input.focus();
		}

	})
	//对比页删除学校刷新页面
	.reg('cmpDel', function(e){
		var rel = $(e.target).closest('td').attr('rel');
		$('#cmpdata td[rel="'+rel+'"]').attr('rel','');
		//$(e.target).closest('td').attr('rel','');
		cmpPageReload();
	}).

	//对比
	reg('cmp', function(e){
		var sl = localStorageCon.get();
		if(sl.length){
			var ids = [];
			$.each(sl, function(i, item){
				ids.push(item.id);
			});
			location.href = G.getCmpUrl(ids);
		}		
	}).

	reg('cancelcmp', function(e, d){
		if(d['id']){
			if(localStorageCon.del(d['id'])){

			}
		}
	}).reg('lg', function(e){
		//登录浮层 暂时在新页面打开
		G.cls.Login();
		//return true;
	}).reg('bm', function(e){
			var show = function(ev){
				var jqt = $(ev.target), address = jqt.attr('vrel'), Map = G.cls.BaiduMap, school_name = $('#school_name').text();
				try{
					if(typeof Map === "function"){
						Map = new Map({centerAddress : address, school_name : school_name});
					}else{
						Map.display(1);				
						Map.setPlace(address);
					}
					Map.setInfo(school_name, address);

				}catch(e){}
			}

			if(typeof BMap === 'undefined'){//避免没有加载完就点击查看地图
				G.on('baiduMapInit', function(){
					show(e);
				})
			}else{
				show(e);
			}
	});

	/*---------------------     添加事件结束     --------------------------*/


	if(isIE6){
		$(function(){
			$('<div class="fuck-ie6">您的IE浏览器版本过低，可能影响正常使用，请更新版本或者使用其他浏览器</div>').insertBefore($('body').children().eq(0));
		});
	}



})(window, jQuery, Gaofen);
