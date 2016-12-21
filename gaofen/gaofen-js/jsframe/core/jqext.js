/**
 * @author : xiezhiwen
 * jquery扩展插件
 */

(function(G, $, win){
	var FALSE = false,
		TRUE = true,
		NULL = null,
		toInt = parseInt,
		isIE6 = !!($.browser.msie && $.browser.version == '6.0');


	$.extend($.fn, {
		   /**
			* 文字放大渐隐
			*@param {Number} num 增加数值
			*@param {Number} times 放大倍数
			*@return {jQuery}
			*/
			zoomText: function(num, times) {
				this.each(function() {
					var
						$clone,
						$el = $(this),
						offset = $el.offset(),
						text = $el.text();
						
					times = isNaN(times) ? 2 : times;
					
					if(!isNaN(+text)) {
						text = +text + (num || 1);
					}
					
					$el.text(text);
					
					$clone = $el.clone()
						.attr('id', '')
						.css({
							'position': 'absolute',
							'top': offset.top,
							'left': offset.left,
							'font': $el.css('font'),
							'color': $el.css('color')
						})
						.appendTo($(document.body));
					
					var fontsize = times * parseInt($el.css('font-size'));
					
					$clone.animate({
						'font-size': fontsize,
						'top': offset.top - ($el.height()/4),
						'left': offset.left - ($el.width()/2),
						'opacity': 0.1
					}, {
						'duration': 300,
						'complete': function() {
							$clone.remove();
						}
					});
					
				});
				
				return this;
			},

			/**
			 * 文本输入框加上聚焦清空，失焦停留提示功能。<br/>
			 如果利用{@link gaofen.ui.ValidationMgr}类作表单验证，制作类似功能时不必直接采用该方法，
			 Validator类提供一系列验证器无需写代码即可轻松实现，详见该类的各种验证器。<br/>
			 如果当前文本框已经过{@link gaofen.ex.SelectionHolder}实例处理，
			 则focusText方法会利用当前{@link gaofen.ex.SelectionHolder}实例输出文本。
			 * @param {String} hoverText 停留提示文字
			 * @param {String} [focusStyle] 修饰样式类
			 * @param {DomSelector} [cssNode]
			 * @param {Boolean} [removeOnFocus] 如果为false，当聚焦后添加css类，否则移除css类
			  <pre><code>
                $('#id').focusText('这里输入用户名', 'focusStyle');
              </code></pre>
			 */
			focusText : function(texts, css, cssNode, operate,handle){
			    this.each(function(i){
			        $(this).data('defaultText', $.isArray(texts) ? texts[i] : texts)
                    .focus(function(){
                        var text = $(this).data('defaultText');
			            if(this.value === text){
			                var selHolder = $(this).data('xwb_selholder');
			                if(selHolder)
			                    selHolder.setText('');
			                else this.value = '';
			            }
			            if(css){
							switch(operate?+operate:0){
								case 1: $(cssNode||this).removeClass(css);break;
								case 0:$(cssNode||this).addClass(css);break;
								case 3: $(cssNode||this).addClass(css);break;
								default:$.merge($(cssNode),$(this)).addClass(css);break;
							}
			            }
			        })
			        .blur(function(){
                        var text = $(this).data('defaultText');
                        
			            if($.trim(this.value) === ''){
			                var selHolder = $(this).data('xwb_selholder');
			                if(selHolder)
			                    selHolder.setText(text);
			                else this.value = text;
			            } else{
							if(handle) {
								switch(operate?+operate:0){
									case 1: 
									case 0:return;
									default:$(cssNode).removeClass(css);return;
								}
							}
						}
			            if(css){
							switch(operate?+operate:0){
								case 1: $(cssNode||this).addClass(css);break;
								case 0:$(cssNode||this).removeClass(css); break;
								case 3: $(cssNode||this).removeClass(css);break;
								default:$.merge($(cssNode),$(this)).removeClass(css);break;
							}
			            }
			        });
			    });
                
                return this;
			},
			
			/**
			 * 方法使用'hidden'样式控制元素的显示或隐藏状态。
			 * 如果无参数，返回当前元素hidden样式的状态，否则利用'hidden'CSS类进行隐藏或显示元素。
			  <pre><code>
			    // 获得显示状态
			    if ($('#id').cssDisplay()) {}
			    // 显示
			    $('#id').cssDisplay(true);
             </code></pre>
             *@return {Boolean|jQuery}
			 */
			cssDisplay : function(b){
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
			},
			
            /**
             * 检查是否含有某个样式,如果有,添加或删除该样式.
             * @param {String} css 样式名称
             * @param {Boolean} addOrRemove true 时添加样式，false时移除该样式
             * @return {jQuery} this
             */
			checkClass : function(cs, b){
			    if(cs){
    			    this.each(function(){
    			        var jq = $(this);
            			var hc = jq.hasClass(cs);
            			if(b){
            				if(!hc)
            				jq.addClass(cs);
            			}else if(hc){
            				jq.removeClass(cs);
            			}			        
    			    });
			    }
        		return this;
			},
			
            /**
            * 替换view元素样式类.<br/>
            * <code>comp.switchClass('mouseoverCss', 'mouseoutCss');</code><br/>
            * @param {String} oldSty 已存在的CSS类名
            * @param {String} newSty 新的CSS类名
            * @return {Object} this
            */
              switchClass: function(oldSty, newSty) {
                    this.each(function(){
                        var jq = $(this);
                        jq.removeClass(oldSty);
                        jq.addClass(newSty);
                    });
                    return this;
              },
              
              /**
               * 获得相对于viewport的位置，只适用于单个元素
               * @return {left, top}
               */
              absolutePos : function(){
                    var off = this.offset(), doc = $(document);
                    var st  = doc.scrollTop(), sl = doc.scrollLeft();
                    off.left -= sl;
                    off.top -= st;
                    return off;
              },
              
              slideMenu : function(slideLayer, hoverCs){
                this.each(function(){
                    (function(jq){
                        var layer = jq.find(slideLayer);
                        var setTimer, clsTimer;
                        function slidedown(){
                            layer.show().cssDisplay(true);
                            if(hoverCs)
                                jq.addClass(hoverCs);
                        }
                        
                        function slideup(){
                            if(hoverCs)
                                jq.removeClass(hoverCs);
                            layer.cssDisplay(false);
                        }
                        
                        function clear() { 
                            if(setTimer){
                                clearTimeout(setTimer);
                                setTimer = false;
                            }
                            clsTimer = setTimeout(slideup, 80);
                        }
                        
                        function set(){
                            if(clsTimer){
                                clearTimeout(clsTimer);
                                clsTimer = false;
                            }
                            setTimer = setTimeout(slidedown, 100);
                        }
                        
                        jq.hover(set, clear);
                    })($(this));
                });
              },

		/**
	    * 截取内容
	    *@param {Number} num  位置，默认10
        *@param {Boolean} hasFace  是否显示表情图片，否为文字代替
        *@param {String} postfix  后缀
        *@return jQuery
	    */
        substrText: function(num, hasFace, postfix) {
            var re = new RegExp('(?:<a.*?>.*?<\\/a>)|(?:<img.*?>)|.','gi');
            
	        this.each(function() {
                var 
                    cache = [],
                    postfix = postfix || '...',
                    text = this.innerHTML,
                    match = text.match(re);
                    
                num = num||10;
                    
                if(match && match.length > num) {
                    
                    match = match.slice(0, num).join('');

                    text = hasFace ? match : match.replace(/<img.*?title=\"(.*?)\".*?>/gi, '[$1]');
                    
                    $(this).html(text+postfix);
                }
	        });
            
            return this;
        },

		/**
	    * IE6修复PNG图片
	    *@return jQuery
	    */
        fixPng: function() {			

            if(isIE6) {
            	var fixFn = function() {
                    if(this.tagName == 'IMG') {
                        var $img = $('<span></span>').css({
                            width: this.offsetWidth,
                            height: this.offsetHeight,
                            display: 'inline-block'
                        });
                        $img[0].style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+this.src+'", sizingMethod="crop")';                        
                        $(this).replaceWith($img);
                    }
                }
                this.each(function(){
                	if(this.complete){
                		fixFn.call(this);
                	} else {
                		this.onload = fixFn ;
                	}
                });
            }
            
            return this;
        },
/*
		makeScroll : function(opt){
            var scrollor = this[0];
            var tid,cid;
            var dir = 1;
            var nxtBtn = $(opt.nextBtn);
            var prevBtn = $(opt.prevBtn),
				dirPar = {'left':['offsetWidth','scrollLeft','width','outerWidth','scrollWidth'],'top':['offsetHeight','scrollTop','height','outerHeight','scrollheight']}[opt.dir || 'left'];
            
            function updateStatus(){
                if(opt.ldisabledCs){
                    var show = scrollor[dirPar[4]] > scrollor[dirPar[0]] || this.showState;
                    prevBtn.cssDisplay(show);
                    nxtBtn.cssDisplay(show);
                    prevBtn.checkClass(opt.ldisabledCs, scrollor[dirPar[1]]==0);
                    nxtBtn.checkClass(opt.rdisabledCs, scrollor[dirPar[1]] + scrollor[dirPar[0]] === scrollor[dirPar[0]]);
                }
            }
            
            opt.pace = opt.pace||25;
            
            function timer(){
                var nxt = scrollor[dirPar[1]] + opt.pace * dir;
                if(nxt<0)
                    nxt = 0;
                if(nxt>scrollor[dirPar[2]])
                    nxt = scrollor[dirPar[2]];

                scrollor[dirPar[1]] = nxt;
                updateStatus();
                tid = setTimeout(arguments.callee, opt.interval||20);
            }
            
            var clicked;
            function startRoll(){
                clicked = false;
                timer();
            }
            
            function leftMousedown(){
                clicked = true;
                dir = -1;
                mid = setTimeout(startRoll, 200);
                return false;
            }
            
            function rightMousedown(){
                clicked = true;
                dir = 1;
                mid = setTimeout(startRoll, 200);
                return false;             
            }
            
            function mouseup(){
                if(clicked){
                    var nxt = scrollor[dirPar[1]] + opt.pace * dir * 4;
                    if(nxt<0)
                        nxt = 0;
                    if(nxt>scrollor[dirPar[2]])
                        nxt = scrollor[dirPar[2]];
                    
					var tmp = {};tmp[dirPar[1]] = nxt;
                    $(scrollor).animate(
                        tmp, 'fast', 
                        function(){ updateStatus();}
                    );
                }
                
                clearTimeout(tid);
                clearTimeout(mid);
            }
            
            if(opt.nextBtn)
                $(opt.nextBtn).mousedown(rightMousedown).mouseup(mouseup).click(function(){return false;});
            
            if(opt.prevBtn)
                $(opt.prevBtn).mousedown(leftMousedown).mouseup(mouseup).click(function(){return false;});
							
			if(opt.moveScorll) {
				nxtBtn.hover(rightMousedown,mouseup);
				prevBtn.hover(leftMousedown,mouseup);
			}
            var offw = 0;
            if(opt.items){
                $(scrollor).find(opt.items).each(function(){
                    offw+=$(this)[dirPar[3]](true);
                });
                $(scrollor).find(opt.ct||':first-child').css(dirPar[2], offw);
            }
            
            updateStatus();
            
            return opt;
        }
*/		
		/**
		 * @slideScroll 幻灯片切换
		 * @调用方式	
		   $.fn.slideScroll({
				effect:'fadeOut',//动画方式
				target:"div",//目标项
				isauto:auto,//自动播放
				speed:speed,//播放时间
				active:"active"
		   })
		 */
        slideScroll:function(param){
			var	opt = $.extend({
				effect : 'fadeOut',//动画方式
				target : "div",//目标项
				eventType : 'over',
				overStop : true,//
				isauto : true,//自动播放
				speed : 3000,//播放时间
				effectTime : 300,//过度效果时间
				active : "active",
				children : '',//单元集
				controlType : 2,
				hasControl : true, //是否有控制器
				createControl : true,//是否自己创建控制器
				sliderControl : $('<ul class="pages"></ul>')
			}, param),
			
			jqview = this,
			viewMain = opt.viewMain || this,
			sliderControl = opt.sliderControl,
			controlType = opt.controlType,
			effect = opt.effect,
			target = opt.target,
			active = opt.active,//选中样式
			index = 0,
			oldIndex = 0,
			loadCount = 0,//图片加载           
			$me = opt.children || $(target,viewMain),
			imgLen = $me.length,
			turnLeft = opt.turnLeft,
			hasControl = opt.hasControl,
			turnRight = opt.turnRight,
			childWidth,
			turn,
			timer,
			runLock;//运行锁定
		//opt.speed = 15000;
		var init = function(){	
			if(effect === 'slide'){//滑动效果
				childWidth = $me.eq(0).width();
				viewMain.css({'width':childWidth * imgLen});
				turn = 'right';
			}
			
			//加控制器
			if(opt.createControl === true && controlType === 1){
				$me.not(":first").hide();
				var controls = [];
				$me.each(function(i){
					controls.push("<span>"+(++i)+"</span>");
					$(this).find("a").append("<span class='tit'><i class='bg'></i><em>"+$(this).find("a").attr("title")+"</em></span>");
				});
				sliderControl.append(controls.join(''));
				$me.css("position","absolute");  
				viewMain.after(sliderControl);
				$("span:first",sliderControl).addClass(active);				
			}
			
			if(opt.createControl === true && controlType === 2){
				var controls = [];
				$me.each(function(i){
					controls.push("<li >"+(++i)+"</li>");
				});
				sliderControl.append(controls.join(''));
				$("li:first",sliderControl).addClass(active);	
				viewMain.append(sliderControl);
			}
			

			
			if(imgLen < 2){//只有一张图片
				sliderControl.remove();
				return;
			}
			
			if(effect === 'fadeOut'){
				$me.css('position', 'absolute');
				if(hasControl){
					sliderControl.css('zIndex', 1);
				}
				$me.css({'zIndex':0, 'opacity':0, 'display': 'block'});
				$me.eq(index).css({'zIndex':'1', 'opacity':1});
			}
			
			if(hasControl){
				sliderControl.children().bind(opt.eventType === 'click' ? 'click' : 'mouseenter', function(){
					if(runLock) return;
					clearInterval(timer);
					var that = $(this);
					if(!that.hasClass(active)){
						oldIndex = index;
						index = that.index(); 
						animate(index);
					}
				});
			}
			
			if(turnLeft){//左右按钮滚动
				turnLeft.click(function(){
					if(runLock) return;
					clearInterval(timer);
					--index;
					if(index === -1)
						index = imgLen - 1;
					turn = 'left';
					animate(index);
				});
				turnRight.click(function(){
					if(runLock) return;
					clearInterval(timer);
					setIndex();
					turn = 'right';
					animate(index);
				});
				
			}
			
			
			if(opt.overStop){
				jqview.bind("mouseenter",function(){
					clearTimeout(timer);
				}).bind("mouseleave",function(){
					if(opt.isauto)
						start();
				});
			}
			//加载完图片才运行
			if(imgLen>0){
				$("img",$me).each(function(){
					var imgObj = new Image();
					$(imgObj).load(function(){
						loadCount++;
						if(loadCount === imgLen)
							start();
					}).error(function(){//取不到图片隐藏滚动条
						sliderControl.hide();
					});
					imgObj.src = this.src;
				});
			}
		},

		setIndex = function(){
			oldIndex = index;
			index = ++index % imgLen;		
		},

		//切换效果
		animate = function(_index){
			if(_index === undefined){
				setIndex();
				_index = index;
			}
			switch (effect){
				case 'fadeOut':	 
					runLock = true;
					var showed = $me.eq(oldIndex), hided = $me.eq(_index);
					hided.css({opacity:1});
					showed.animate({opacity:0}, opt.effectTime, function(){
						showed.css("z-index",0);
						hided.css("z-index",1);
						runLock = false;
					});

				break;
				
				case 'slide' : //滑动效果
					var left = - childWidth * _index;
					if(_index === 0){
						if(turn === 'right'){
							$me.eq(0).css({'position':'relative','left': childWidth * imgLen});
							_index = imgLen;
							left = - childWidth * _index;
						}
					}
					
					if(_index === imgLen - 1){
						if(turn === 'left'){
							$me.eq(_index).css({'position':'relative','left': - childWidth * imgLen});
							left = childWidth;
						}
					}
					
					viewMain.animate({ left : left }, opt.effectTime, 'easeIn', function(){
						if(_index === imgLen && turn === 'right'){
							$me.eq(0).css({'position':'default','left':'0'});
							viewMain.css({'left':'0'});
						}
						if(_index === imgLen-1 && turn === 'left'){
							$me.eq(_index).css({'position':'default','left':'0'});
							viewMain.css({'left':- childWidth * (imgLen-1)});
						}
						turn = 'right';
					});
				break;
					
			}
			setControlStyle();
			
		},

		setControlStyle = function(){
			if(hasControl)
				sliderControl.children().eq(index).addClass(active).siblings().removeClass(active);//改变小图导航样式
		},


		start = function(){
			timer = setInterval( animate,  opt.speed);		
		};

		init();
	}
		
	   //整块的循环移动
	   //Count 一次移动子元素数量
	   //delay 移动间隔时间
	   //animateTime 动画执行时间
	   /*
	   ,scrollMass : function(Count,delay,animateTime){
			var parent =this,
				length = parent.children().length,
				timer,
				delay = delay,
				tmp = parent.children()[0].offsetWidth * Count,
				p = false;
		   if (length <= Count) {
			   return this; 
		   }
		   function scrollNext(){
				parent.animate({marginLeft:-tmp},animateTime?animateTime:1000,function(){
					if( timer !=0 ){
						parent.css('marginLeft',0);
						parent.append( parent.children(':lt(' +  Count + ')') );
					}
					if( p ) return;
					start();
				});
		   };
		   
		   function start(){ timer = window.setTimeout(scrollNext,delay); }
		   this.hover(function(){ 
				p = true ;clearTimeout(timer); 
		   },function(){ 
				p = false;start();
		   });
		   start();
		   return this;
	   }
       
       //向父级寻找符合selector的首个元素, 
       //selector 可以是jquery选择器 或 函数(如果找到返回dom，否则false|null|undefined)
       , parentFind : function(selector, end) {
            end = end || doc.body;
            var isStr = typeof selector === 'string';
            var el = $(this).get(0);
            
            while(el){
                if(isStr){
                    if($(el).is(selector))
                        return el; 
                }else if(selector(el)){
                    return el;
                }
                el = el.parentNode;
                if(el === end)
                    return null;
            }
            return el;
       }
*/	   
	   //以宽度或者高度为优先考虑条件,对图片进行缩放后再为其高度或者宽度进行居中处理
	   , imageToCenter : function(opt){
			var toProperty = opt.toProperty||'width' //缩放优先属性(width/height)
			, toLocation = toProperty == 'width' ? 'marginTop' : 'marginLeft'
			, zoom = opt.zoom //缩放值
			, ow = ''
			, oh = ''
			, lastVal     //最终值
			, instead = opt.instead     //相反位置的值   
			, image = new Image()
			, self = this
			, setImage = function(){		
				oh = image.height;
				ow = image.width;
				if(toProperty == 'width'){
					lastVal = oh;
					if(zoom < ow) 
						lastVal = oh * zoom/ow;
					else
						this.css((toProperty == 'width' ? 'marginLeft' : 'marginTop'), (zoom-ow)/2);
						
					this.css({'width': zoom < ow ? zoom : ow, 'height':lastVal});
				}
				if(toProperty == 'height'){
					lastVal = ow;
					if(zoom < oh) 
						lastVal = ow * zoom/oh;
					else
						this.css((toProperty == 'width' ? 'marginLeft' : 'marginTop'), (zoom-oh)/2);
					this.css({'height': zoom < oh ? zoom : oh, 'width':lastVal});
				}

				if(lastVal > instead){
					this.css(toLocation, -(lastVal - instead)/2);
				}					
			}	
			if($.browser.msie){
				image.onreadystatechange =function(){ 
					if(this.readyState == "complete"){ 					    
						setImage.call(self);
					} 
				}
			}else{
				image.onload=function(){ 
					if(image.complete==true){ 
						setImage.call(self);
					} 
				}
			} 
			image.src = this.attr('src');	
	   }
	});
	
	$.easing.cubicOut = function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	}

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

	$.extend($.easing,{
		 easeIn: function (x, t, b, c, d){
			 return c*(t/=d)*t*t + b;
		 },
		 easeOut: function (x, t, b, c, d){
			 return c*((t=t/d-1)*t*t + 1) + b;
		 },
		 easeInOut: function(t,b,c,d){
			 if ((t/=d/2) < 1) return c/2*t*t + b;
			 return -c/2 * ((--t)*(t-2) - 1) + b;
		 }
	 }); 
 
})(Gaofen, jQuery, window);	