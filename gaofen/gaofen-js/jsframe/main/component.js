/**
 * @author  xiezhiwen
 * 页面功能组件
 */


(function(G, $, win){
    var Util = G.util,
    
        T = G.tpl,
    
        doc = document, 
        
        hidCls   = 'hidden', 
        
        ui = G.ui,
        
        Base = G.ui.Base,
        
        jqWin = $(win),
        
        jqDoc = $(doc),
		
		Req = G.request,		
    
		log = function(){
		  win.console && console.log.apply(console, arguments);
		};
		
	if(!G.FN)
		var FN = G.FN = {};
	else 
		var FN = G.FN;
		
		
	 /**
     * @class  Gaofen.ui.Uploader
     * iframe提交数据（异步上传数据，跨域提交大数据）
     */
	G.ui.Uploader = G.reg('Uploader', function(cfg){
		this.init(cfg);
	});

	G.ui.Uploader.prototype = {
		
		init : function( cfg ){
			$.extend( this, cfg );
			//设置跨域问题
			if(cfg.domain){
				document.domain = cfg.domain;				
			}
			
			var form = this.form;
			var formEl = this.formEl = $(form)[0];
			var name = 'gf_upload_frame_' + Util.uniqueId();
			this.iframe = T.forNode('<iframe src="about:blank" style="display:none;" id="'+name+'" name="'+name+'"></iframe>');
			
			//添加callback参数
			//$('<input type="hidden" name="callback"/>').appendTo(form);
			
			$(this.iframe).appendTo( doc.body );
			
			formEl.target = name;
			
			if(!this.action)
				this.action = formEl.action || F.request.apiUrl('action', 'upload_pic');
		},
		
		/**
		 * 可重置action值
		 * @param {String} action
		 */
		setAction : function(action){
			this.action = action;
			return this;
		},
		/**
		 * 是否加载中
		 */
		isLoading : function(){
			return !!this.jsonpFn;
		},
		
		/**
		 * @cfg {Function} beforeUpload 开始提交前调用，返回false取消提交，可实现该方法以在提交前检测表单。参数为 beforeUpload(jqForm)。
		 */
		beforeUpload : $.noop,
		
		/**
		 *  开始提交
		 * @param {Function} [callback]
		 */
		upload : function( callback ){
			if(this.beforeUpload(this.form) !== false){
				if(this.isLoading())
					this.abort();
				
				var self = this,
					fn = this.jsonpFn = 'jsonp' + new Date().getTime();
				
				window[fn] = function(){
					window[fn] = null;
					delete self.jsonpFn;
					var e = Req.parseProtocol(arguments[0]);
					(callback||self.onload).call(self, e);
					// fix a bug in IE7
					delete self.jsonpFn;
				};
				//this.formEl.action = Util.appendParam(this.action, {callback:'parent.'+fn, '__rnd':Util.uniqueId()});
				this.formEl.action = Util.appendParam(this.action, {callback:'parent.'+fn, '__rnd':+new Date()});
				this.formEl.submit();
			}
		},

		onload : $.noop,
		
		abort : function(){
			if(this.isLoading()){
				var fn = this.jsonpFn;
				window[fn] = function(){
					window[fn] = null;
				};
			}
		}
	};

	
    /**
     * @class  Gaofen.ui.Switcher
     * 菜单切换
     */
    ui.switcher = G.reg('Switcher', Util.create(Base, {
        
        view : '',
        
        serial : 0,   //当前显示序号
        
        trigMode : 'click',
        
        handler : [],
        
        silder : false, 
        
        timer : 2000,
        
        cls : 'active',
        
        hide : 'hidden',
        
        contents : [],
    
        initUI : function(){
            var self = this;
            this.len = this.handler.length;
            if(this.len == 0) return;
            $.each(this.handler, function(i, item){
                var $i = $(item);
                
                $i.bind(self.trigMode, function(e){
                
                    self.run.call(self, $i, i);
                    
                    e.preventDefault();
                });
                
                if($i.hasClass(self.cls)){
                    self.serial = i ;
                }
                
            });
            
            
            
            if(this.silder){
                this.silderInit();
                $(this.view).hover(function(){
                    
                    self.clearTimer();                  
                },function(){
                    self.silderInit();
                })

                this.handler.eq(0).parent().mouseover(function(){
                    console.log('----------------')
                    
                });
            }
            
        },
        
        
        run : function(item, i){
            if(item.hasClass(this.cls)) return;
            
            Util.bind(this.setHandlerCls, this)(item, i);
            this.onselect && this.onselect(i);
            
            this.serial = i;
            
        },
        
        
        
        setHandlerCls : function(obj, cur){
            var self = this
            , hr = this.handler
            , len = this.handler.length
            , cls = self.cls
            , ci = 0;
            for(var i=0;i<len;i++){
                var $i = $(hr[i]);
                if($i.hasClass(cls)){
                    ci = i;
                    $i.removeClass(cls);
                    break;
                }
            }
            
            obj.addClass(cls);
                        
            this.setContentShow(ci, cur);
            

        }, 
        
        setContentShow : function(_old, _new){
        
            $(this.contents[_old]).addClass(this.hide);
            
            $(this.contents[_new]).removeClass(this.hide);
        },
        
        silderInit : function(){
            var self = this;
            this._timer = setInterval(function(){
                
                self.setTimer.call(self);
                
            }, this.timer)
            
        },
        
        setTimer : function(){
            var i = (this.serial+1) % this.len;
            this.run(this.handler.eq(i), i);
            
            //this.handler.eq(i-1)[this.trigMode]();
            
        },
        
        clearTimer : function(){
            
            clearInterval(this._timer);
        } 
    
    }));
    
    
    
    /**
     * @class  Gaofen.PD
     * 后端给页面写数据使用此类
     */
    G.reg('PD', function(){
        if(typeof G.cfg === 'undefined')
            G.cfg = {};
        var data = G.cfg,
        _window = {};
        return {
            set : function(name, _data){
                var len = arguments.length;
                if (len == 3){
                    _window[name] = _data
                    data[name] = _data;         
                }else if(len == 2){
                    $.extend(data, _data);
                }else if(len == 1){
					$.extend(data, name);
				}
            },
            
            get : function(name){       
                var len = arguments.length;
                if(len == 1)
                    return data[name];
                else{
					if(len === 0) return G.cfg;
                    return _window[name];
				}
            }       
        }       
    });
    var PD = G.PD = G.use('PD');
	
	
	 /**
     * @class  Gaofen.ui.DragBase
     * 基本拖动
     */	
	ui.DragBase = G.reg('DragBase',Util.create(Base, {
		view : '',	//拖动体			
		autoRender : true,
		handle : '',//拖动位置
		outside : true, //要判断是否超出边界
		outsideToLimit : true,//超出边界后按极限处理(false:恢复原来位置，true:按最大极限处理)
		outsideStop : false,//超出边界后停止拖动
		beforeDarg : $.noop,//拖动前回调
		afterDarg : $.noop,//停止拖动回调
		moved : false,//拖动过
		movePart : $('body'),//
		onlyChange : false,
		dragBar : '',
		container : '',
		dlagIngCls : 'dlaging',　　//拖动体样式
		
		onViewReady : function(){
			this.movePart = $('body');
			var that = this,
				view = this.jq(), 
				handle = this.handle;
				
			if(this.outside){//是否要判断超出边界
				if(this.container === '') this.container = this.movePart;
				var container = this.container,
					movePath = this.movePart,
					offset = container.offset(),
					cwidth = container.width(),
					cheight = container.height();
					width = view.width(),
					height = view.height();
				$.extend(this, {
					cwidth : cwidth,
					cheight : cheight,
					width : width,
					height : height,
					minLeft : offset.left,
					minTop : offset.top,
					maxLeft : offset.left + cwidth - width,
					maxTop  : offset.top + cheight - height		
				});			
			}
			if(view.length && handle.length){
				this.initBind();
			}	
		},
		
		initBind : function(){
			var that = this;
			this.handle.bind({
				mousedown : $.proxy(this.bind, this),
				mouseup : $.proxy(this.unbind, this)
			});
			this.movePart.mouseleave($.proxy(this.unbind, this));
			$(window)					
			.mouseleave(function(e){
				if(e.target.tagName.toLowerCase() === 'html'){
					$.proxy(that.unbind, that)(e);
				}
			})
			.mouseup($.proxy(this.unbind, this));
		},
		
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
			var view = this.jq(), off = view.offset();	
			this.startPositoin = {cx:e.clientX, cy:e.clientY, left:off.left,top:off.top, gap: e.clientY - off.top};
			view.addClass(this.dlagIngCls);
			this.beforeDrag && this.beforeDrag(e);
		},
		
		dragStop : function(e){				
			if(this.moved){
				this.moved = false;
				var view = this.jq(), outResult;	
				view.removeClass(this.dlagIngCls);
				if(this.outside === true && (outResult = this.isOutside()) !== false){ //超出边界恢复拖动前位置
					this.recover(outResult);
				}
				this.afterDrag && this.afterDrag(true);
			}else{
				this.afterDrag && this.afterDrag();
			}
		},
		
		dragMove : function(e){
			//console.log('dragMove--');
			this.moved = true;
			e.preventDefault();
			var cache = this.startPositoin, 
				view = this.jq(),
				_left = e.clientX - cache.cx + cache.left,
				_top = e.clientY-cache.gap;

				if(this.onlyChange !== false){//模拟导行条功能使用
					if(this.onlyChange === 'left'){
						if(this.outsideStop){
							_left = _left > this.maxLeft ? this.maxLeft : _left;
							_left = _left < this.minLeft ? this.minLeft : _left;
						}
						view.offset({left:_left});
					}else{
						if(this.outsideStop){
							_top = _top > this.maxTop ? this.maxTop : _top;
							_top = _top < this.minTop ? this.minTop : _top;
						}
						view.offset({top:_top});
					}
				}else{
					view.offset({left:_left,top:_top});
				}
			this.moveing && this.moveing(_left, _top / (this.maxTop -  this.minTop));
		},			
		
		
		//--------------------------判断是否超出边界--------------------------
		isOutside : function(){
			if(!this.outside)
				return false;
			var view = this.jq(), offset = view.offset(), tmin, tmax, omin, omax;
			if( (tmin = offset.top < this.minTop) |
				(tmax = offset.top> this.maxTop) |
				(omin = offset.left < this.minLeft) |
				(omax = offset.left> this.maxLeft)){
				return this.outsideToLimit ? [tmin, tmax, omin, omax] : true;
			}
			return false;
		},
		
		recover : function(outResult){
			var view = this.jq(), startPositoin = this.startPositoin;
			if(!outResult || outResult === true)
				view.offset({top : startPositoin.top, left : startPositoin.left});
			else{
				var offset = view.offset(),
					_top = outResult[0] ? this.minTop : (outResult[1] ? this.maxTop : offset.top),
					_left = outResult[2] ? this.minLeft : (outResult[3] ? this.maxLeft : offset.left);
				view.offset({top : _top, left : _left});
			}	
		}
			
			//--------------------------判断是否超出边界结束--------------------------
		
	}));
	
	
	/**
     * @class  Gaofen.ui.pptScroll
     * ppt类型图片浏览
     */	
	ui.pptScroll = G.reg('pptScroll',Util.create(Base, {
		view : null,
		autoRender : true,
		childrens : null,
		current : 'current',
		model : 'comment',//一般模式\全屏模式
		modelSize : {'comment':{w:748,h:561}, 'full' : {w:978,h:734}},//一般模式
		currentLen : 1,
		host : 'http://ziliao.gaofen.com/',
		total : 10,//总页数
		fid : '',
		pages : [],//图片地址列表
		maxPage : 0,//最大显示页数
		camera : '.listM',
		itemPix : null,//每个所占比例
		dragBar : null,
		scrollBar : null,
		picList : $('#thumb'),
		
		setFullModel : function(){
			this.model = 'full';
			var jq = this.jq();
			this.setView($('#readercontainerfull')[0]);
			this.jq().append(jq);
			this.resetDom();		
			$('body').addClass('fullscreen');			
			this.resetBar();
		},
		
		setCommentModel : function(){
			this.model = 'comment';
			$('#scrollArea').appendTo($('#readcontainerparent'));
			this.setView($('#scrollArea')[0]);
			this.resetDom();
			$('body').removeClass('fullscreen');
			this.resetBar();
		},
		
		resetDom : function(view){
			this.dragBar = $('#dragBar');			
			this.scrollBar = $('#scrollBar');
			if(this.dragBar){
				this.DragBase.view = this.dragBar[0];
				this.DragBase.container = this.scrollBar;
			}
			this.childrens = this.jq('#thumb').children();
			this.reDrawImage();
		},
		
		resetInit : function(obj){
			$.extend(this, obj);
			this.initPro();
		},
		
		initPro : function(){
			var readLen = this.maxPage = this.pages.length;
			this.currentLen = 1;
			//if(readLen === 0) return;
			if(readLen === this.total){
				//this.picList.find('item:eq(1)').remove();
			}
			this.setShow(0, this.pages[0]);
			this.itemPix = Number((100/this.total).toFixed(2));
			$('#pageTotal', this.view).text('/'+this.total);
			this.setInput();
			//this.jq('#pageIpt').val(this.currentLen);
		},
		
		onViewReady : function(){
			this.picList = this.jq('#thumb');
			var offMargin = this.offMargin;
			
			if(this.childrens === null)
				this.childrens = this.picList.children();
			
			this.initPro();
			
			
			var self = this;
			$(window).resize(function(){
				self.offMargin = self.scrollBar.offset().left-10;
			});
			G.use('action').reg('left', function(e){
				self.toLeft();
			}).reg('right', function(e){
				self.toRight();
			}).reg('cmodel', function(e){
				(e.get('f') === '0' ? self.setCommentModel :  self.setFullModel).call(self);
			}).reg('toPage', function(e){
				self.compute(self.getNextItem((e.evt.clientX- offMargin)/ (self.scrollBar.width())));
				//console.log(e.evt.clientX)
			});
			
			function iptFn(){
				var v = parseInt($.trim(this.value));
				if(v > self.pages.length) this.value = v = self.pages.length+1;
				if(v == 0) this.value = v = 1;
				self.compute(v);
			}
			
			$('#pageIpt').keydown(function(e){		
				var key = e.keyCode;
				if((key > 95 && key < 106) || (key > 46 && key < 59) || key === 8 || key === 48){
					return true;
				}else{
					return false;
				}
			}).blur(function(e){
				iptFn.call(this);
			}).keyup(function(e){
				if(e.keyCode === 13){
					iptFn.call(this);
				}
			});
			
			
			if(this.dragBar){
				this.dragBar.css('left', 0);
				this.DragBase = G.use('DragBase', {
					view : this.dragBar[0],
					handle : this.dragBar,
					outsideStop : true,
					dragBar : 'dragBar',
					onlyChange : 'left',
					container:this.scrollBar,
					initBind : function(){
						var that = this;
						this.movePart.bind({
							mousedown : function(e){
								if(e.target.id === that.dragBar)
									Util.bind(that.bind, that)(e);
							},
							mouseup : function(e){
								//console.log('mouseup:'+e.target.id);
								//if(e.target.id === that.dragBar)
									Util.bind(that.unbind, that)(e);
							}
						});
						this.movePart.mouseleave($.proxy(this.unbind, this));
						$(window)					
						.mouseleave(function(e){
							if(e.target.tagName.toLowerCase() === 'html'){
								$.proxy(that.unbind, that)(e);
							}
						})
						.mouseup($.proxy(this.unbind, this));
					},
					beforeDrag : function(e){
						//beforeDarg && beforeDarg();
						if(e.target.id === 'dragBar')
							self.setTips(1);
					},
					moveing : function(l){
						var pl = (l- offMargin)/ (this.container.width());
						self.draging(pl);
						self.setTips(1,pl);
					},
					afterDrag : function(move){					
						self.setTips(0);
						if(move){
							var view = this.jq(), offset = view.offset(),
								_left = offset.left, _top = offset.top;
							self.compute(self.getNextItem((_left- offMargin)/ (this.container.width())));
							this.jq().css('top', '-6px');
						}
					}
				});
			
			}
		},
		
		getUrl : function(src){
			var host = this.host, fid = this.fid;
			return host+'docs/docsImage?id='+fid+'&image='+src;
		},
		
		setView : function(view){
			this.view = view;
		},
		
		reDrawImage : function(){
			var item = this.childrens.eq(0);
			this.getImage(item, item.find('img').attr('src'));
		},
		
		getImage : function(divItem, src){
			var img = divItem.find('img'), _src = this.getUrl(src), loading = divItem.find('.loading');
			loading.cssDisplay(1);
			img.cssDisplay(0);	
			var modelSize = this.modelSize[this.model];
			Util.getImageSizeByValue(_src, modelSize, function(obj){
				img.attr('src',_src).css(obj);
				Util.setImagePosition(img, obj.width, obj.height, modelSize.w, modelSize.h);
				loading.cssDisplay(0);
				img.cssDisplay(1);					
			});
			
		},
		
		setShow : function(item, src){
			item = this.childrens.eq(item);
			var index = item.index(), vdiv = this.picList.find('.item:visible');
			if(index === 0 && src){	
				this.getImage(item, src);
				//item.find('img').attr('src', this.getUrl(src));
			}
			
			if(vdiv.index() !== index){					
				vdiv.cssDisplay(0);
				item.cssDisplay(1);
			}
			this.jq('.prev,.next').cssDisplay(!index);
		},
		
		setTips : function(dp, l){
			if(dp === 0){
				this.dragBar.find('.tooltip').cssDisplay(0);
			}else{
				var page = l ? Math.ceil((Number(Number(l*100).toFixed(2)))/this.itemPix) : this.currentLen;
				this.dragBar.find('#page').text(page);
				this.dragBar.find('.tooltip').cssDisplay(1);
			}
		},
		
		setProgress : function(l){
			this.scrollBar.find('.progress').width(Math.ceil(l)+'%');
		},
		
		draging : function(l){
			l = Number(Number(l*100).toFixed(2));
			this.setProgress(l);
		},
		
		getNextItem : function(pl){
			var itemPix = this.itemPix;
			pl = Number(Number(pl*100).toFixed(2));
			var nextItem = Math.ceil(pl/itemPix);
			return nextItem;
		},
		
		compute : function(nextItem){
			if(nextItem === this.currentLen){//选中当前不变
				var dragPix = this.currentLen * this.itemPix;
			}else{
				if(this.maxPage >= nextItem ){
					this.setCurrent(nextItem);
					this.setShow(0, this.pages[this.currentLen-1]);
				}else{//超出可显示数提示付费
					if(this.maxPage < this.total){
						this.setCurrent(this.maxPage+1);
						this.setShow(1);
					}
				}
			}
			this.resetBar();
		},
		
		toRight : function(){
			this.compute(this.currentLen + 1);
		},
		
		toLeft : function(){
			if(this.currentLen - 1 === 0) return;
			this.compute(this.currentLen - 1);
		},
		
		
		resetBar : function(){
			var itemPix = this.itemPix, citem = this.currentLen, pbarLeft = this.scrollBar.offset().left, left, ps;
			citem -=1;
			if(citem === this.total-1){
				left = this.scrollBar.width() + pbarLeft - 36;
				ps = 100;
			}else{
				left = pbarLeft+itemPix*citem*this.scrollBar.width()/100;
				ps = citem*itemPix;
			}
			if(this.dragBar){
				this.dragBar.offset({'left':left});
				this.setProgress(ps);
			}
		},
		
		getCurrent : function(){
			return this.picList.find('.'+this.current);
		},
		
		setCurrent : function(v){
			this.currentLen = v;
			this.setInput(v);
		},
		
		setInput : function(){
			this.jq().find('#pageIpt').val(this.currentLen);
			this.setLeftRightBtns();
		},
		
		setLeftRightBtns : function(){
			this.jq('a.prev,a.page-prev')[this.currentLen  == 1 ? 'addClass' : 'removeClass']('page-prev-disable');
			this.jq('a.next,a.page-next')[this.total  == this.currentLen ? 'addClass' : 'removeClass']('page-next-disable');
		},
		
		select : function(index){
			this.getCurrent().removeClass(this.current);
			
			if(this.childrens){
				this.childrens.eq(index).addClass(this.current);
			}
		}
	
	
	}))
	
	/**
     * @class  Gaofen.ui.AutoInput
     * 输入框
     */		
	G.ui.AutoInput = G.reg('AutoInput', Util.create(ui.Layer, {
		
		inputor : '',//输入框
		
		defautText : '',//默认值
		
		val : '',	
		
		lastVal : '', //最后一次输入结果
		
		foucsCls : '',
		
		timer : 400,
		
		setTimer : '',
		
		onViewReady : function(){
			var self = this;
			this.val = $.trim(this.inputor.val());
			this.inputor.val(this.defautText);
			this.inputor.bind({
                keyup : Util.getBind(this, 'onkeyup'),
                focus : Util.getBind(this, 'onfocus'),
                click : Util.getBind(this, 'onclick'),
                blur : Util.getBind(this, 'onblur'),
                keydown : Util.getBind(this, 'onkeydown'),
                mousedown : Util.getBind(this, 'onmousedown'),
				mouseout : Util.getBind(this, 'onmouseout') 
            });		
		},
		
		onblur : function(){
			if("" == this.getVal()){
				this.inputor.val(this.defautText);
			}
			this.jq().removeClass(this.foucsCls);
		},
		
		onfocus : function(e){
			if(this.defautText == this.getVal()){
				this.setVal('');
			}
			this.jq().addClass(this.foucsCls);
		},
		
		onclick : $.noop,

		onkeydown : $.noop,
		
		onkeyup : function(e){
			var v = this.getVal(), self = this;
			clearTimeout(this.setTimer);
			this.setTimer = setTimeout(function(){
				self.checkVal(v);
			}, this.timer);
		},
		
		onmousedown : $.noop,
		
		onmouseout : $.noop,
		
		setVal : function(v){
			this.inputor.val(v);
		},
		
		getVal : function(){
			this.val = $.trim(this.inputor.val());
			return this.val;
		},
		
		checkVal : function(v){
			var cv = this.getVal();
			
			if(cv == v && cv != this.defautText && cv != '' && cv != this.lastVal){
				this.lastVal = cv;
				this.onchange();
			}else{
				if(v === '')
					this.hideList();
				return '';
			}
		},
		
		onchange : function(){
			//console.log('onchange:'+this.val);
		},
		
		hideList : $.noop
	
	}));
	
	/**
	 * @class Gaofen.ui.AutoComplete
	 * 输入框自动完成
	 */ 
	G.ui.AutoComplete = G.reg('AutoComplete', Util.create(G.ui.AutoInput, {
		loadXhr : null,
		
		useCache : true,
		
		outHide : true,
		
		actionMgr : true,
		
		scls : 'hover',//选中样式
		
		childTarget : 'li',
		
		onactiontrig : function(e){
			switch(e.data.e){
			    case 'btn':
					//console.log('search')
					e.stopPropagationed = false;
				break;
			}
		},
		
		onfocus : function(e){
			var v = this.val;
			G.ui.AutoInput.prototype.onfocus.call(this);			
			if(this.getVal() == v && v !== '')
				this.showListView(1);
		},
		onkeydown : function(e){//上下键选中
			var key = e.keyCode
			if(key === 40){
				var index = this.listView.find('.'+this.scls).next().index();
				if(index === -1) index = 0;
				this.setSelectCls(index);
			}else if(key === 38){
				var index = this.listView.find('.'+this.scls).prev().index();
				if(index === -1) index = this.listView.children().length-1;
				this.setSelectCls(index);
			}
		},
		
		hideList : function(){
			this.showListView(0);
		},

		onchange : function(e){
			
			var self = this, kw = this.val;
			
			if(this.useCache && this.cache[kw]){
				Util.getBind(this, 'showResult')(this.cache[kw], kw);
				return;
			}
			
			//测试
				this.loadComplete(new Req.DefaultResponseDefinition({rst:true, data:[{cname : 11111, id:1},{cname : 222222, id:2}]}), kw);
				
				return;
			//测试结束
			
			if(this.loadXhr){
				this.loadXhr.abort();				
			}
			var url = 'http://map.baidu.com/su?wd=%E5%8D%97%E4%BA%AC%E8%B7%AF&cid=1&type=0&newmap=1';
			this.loadXhr = Req.q(this.url,{wd:kw},
				function(r){
					Util.getBind(self, 'loadComplete')(r, kw);
				}
			);
			
		},
		onViewReady : function(){
			G.ui.AutoInput.prototype.onViewReady.call(this);
			if(this.outHide){
				this.contextMgr();
			}
			this.listView.bind({
				click : Util.getBind(this, 'chooseItem'),
				mouseover : Util.getBind(this, 'listHover'),
				mouseout  : Util.getBind(this, 'listOutHover')
				//keyup : Util.getBind(this, 'listKeyup')
			});
			//this.listView.hover(Util.getBind(this, 'listHover'), Util.getBind(this, 'listOutHover'));
		},
		
		cache : {},
		loadComplete : function(r, kw){
			if(r.isOk()){
				var data = r.getData();
				if(this.dataChange) data = this.dataChange(data);
				
				this.showResult(data, kw);	

			}else{
			
			}
			this.loadXhr = null;
		},
		
		showResult : function(data, kw){
			//data = [{id:1,title:234},{id:2,title:344344}];
			if( data.length == 0 || (data.length == undefined && !data[0])) {  //返回数据为空				
				if(this.noDataHtml !== ''){
					//this.listView.empty();
					this.listView.html(this.noDataHtml || '<li class="no-data">呃，没有记录哦</li>' ).cssDisplay(1);
					this.afterShowResult && this.afterShowResult(data);
					this.play(1);
				}
				return false; 
			}    
			this.cache[kw] = data;
			if (this.val === kw) {
				var html = [], self = this;
				//this.listView.empty();
				$.each(data, function(i){
					html.push(self.randerData(this,i));
				});						
				this.listView.html(html.join('')).cssDisplay(1);
				this.afterShowResult && this.afterShowResult(data);
				this.setSelectCls(0);
			}
		},
		
		template : '<li><a href="#"><span>{.cname}</span>{.area}</a></li>',
		
		randerData : function(data, index){
			return T.parse(this.template, $.extend({'id':index}, data));
		},
		
		chooseItem : function(e){
			e.preventDefault();
			var index = this.getIndex(e);
			if (index != null) {
				var data = this.getData();
				if(!data) return;
				var row = data[index];
				if(row){
					this.onEnter(row);
				}
			}
		},
		
		onEnter : $.noop,
		
		getIndex : function(e) {
			if(e.type == 'keydown'){
				return this.currentSelected ? this.currentSelected.index() : -1;
			} else {
				return $(e.target).closest('li').index();
			}
		},
		
		getData : function(){
            return this.cache[this.val];
        },
		
		showListView : function(display){
			this.listView.cssDisplay(display);
		},
		
		contextMgr : function(){
			var $v = this.listView, inputor = this.inputor.parent(), self = this;
			$(doc).mousedown(function(e){			
				var $et = $(e.target);
				if($et.closest($v).length == 0 && $et.closest(inputor).length == 0 ){
					self.showListView(0);
				}				
			});		
		},
		setSelectCls : function(index){
			this.listView.find('.'+this.scls).removeClass(this.scls);
			this.listView.children().eq(index?(index == -1?0:index):0).addClass(this.scls);
		},
		listHover : function(e){
			
			this.setSelectCls(this.getSelectIndex(e.target));
		},
		listOutHover : function(e){
		
		},
		
		getSelectIndex : function(elem){
			var tag = elem.tagName.toLowerCase(), $tar = $(elem), index;
			if(tag === this.childTarget){
				index = $tar.index();
			}else{
				index = $tar.closest(this.childTarget).index();
			}
			return index;
		}
	}));

    /**
     * @class Gaofen.ui.ord_amount
     * 订单购买增加数量
     * <code><pre>
     Gaofen.use('Ord_amount', {
			view: $('#Ord_amount')[0],
			amount : $('#amount')
		}).play(1);
     </pre></code>
     */
    G.ui.ord_amount =  G.reg('Ord_amount', Util.create(Base, {
        actionMgr : true,
        amount : '',
        onViewReady : function(){
            var oj_pirce = this.jq('.price'),
                total = this.jq(".total"),
                oj_total =  this.jq(".oj_total"),
                that = this;
            var amount = this.amount.keyup(function(){
                if(parseInt(amount.val())>=1){
                    that.jq('.btn-reduce').removeAttr("style")
                    that.setPrice();
                }else{
                    //alert("最小购买量为1！");
                    that.jq('.btn-reduce').css({"color":"#CCCCCC"})
                    amount.attr("value",'1')
                    that.setPrice();
                }
                if(parseInt(amount.val())>=999){
                    alert("请确认您的购买数量！");
                }
            });
        },

        setPrice : function(num){
            var oj_pirce = this.jq('.price em'),
                total = this.jq("#total"),
                oj_total =  this.jq(".order-total i"),
                amount = this.amount,
                price_val =parseInt(oj_pirce.html()),
                total_val=parseInt(amount.val())*price_val;
            oj_total.html(total_val+'.00');
            total.html('￥'+total_val+'.00');
        },
        onactiontrig : function(e){
            var amount = this.amount, v = parseInt(amount.val()), oj_pirce = this.jq('.tab_pirce em'),
                total = this.jq("#total"),
                oj_total =  this.jq(".oj_total");

            switch(e.data.e){
                case 'reduce':
                    if(v>1){
                        amount.val(v-1);
                        this.setPrice();
                    }else{
                        //alert("最小购买量为1!");
                        $(e.src).css({"color":"#CCCCCC"})
                        amount.attr("value",'1')
                    }
                    if(v == 1){
                        $(e.src).css({"color":"#CCCCCC"})
                    }
                    //e.stopPropagationed = false;
                    break;
                case 'add' :
                    if(v >= 998){
                        alert("请确认您的购买数量！");
                    }else{
                        this.jq('.btn-reduce').removeAttr("style")
                        amount.val(v+1);
                        this.setPrice();
                    }
                    break;
            }
        }

    }));
	
	/**
	 * @class Gaofen.ui.hoverDelay
	 * hover显示层
	 * <code><pre>
		Gaofen.use('HoverDelay', {
			view: $('#hoverDelay')[0],
			inline : false,//显示区域不包括在view里
			hoverView : $('#dropdown')		
		}).play(1);
	   </pre></code>
	 */	
	G.ui.hoverDelay = G.reg('HoverDelay', Util.create(Base, {
		inline : true, //要显示区域包括在view里
		outDuring: 300,
		hoverEvent: "",//over事件回调
		outEvent: "",//out事件回调
		hoverView : '', //隐藏/显示区域
		outTimer : '',
		onViewReady : function(){
			var that = this;
			this.jq().hover(function(){
				clearTimeout(that.outTimer);
				that.hoverEvent && that.hoverEvent();
				that.hoverView.cssDisplay(1);
			},function(){	
				that.hideView();
			});
			if(!this.inline){//不在view范围内
				that.hoverView.hover(function(){
					clearTimeout(that.outTimer);
				}, function(){
					that.hideView();				
				});
			}			
		},

		hideView : function(){
			var that = this;
			this.outTimer = setTimeout(function(){
					clearTimeout(that.outTimer);	
					that.outEvent && that.outEvent();
					that.hoverView.cssDisplay(0);
					//that.jq().removeClass(that.cls);
					}, that.outDuring);
		}
	}));
	
	/**
	 * @class Gaofen.ui.hoverSwitch
	 * hover显示层2,不是浮动
	 * <code><pre>
		Gaofen.use('HoverSwitch', {
			view: $('#hoverSwitch')[0],
			controler : [],
			contentList : []		
		});
	   </pre></code>
	 */
	G.ui.hoverSwitch = G.reg('HoverSwitch', Util.create(Base, {
		controler: '',//控制区域
		targetName : 'a',//控制元素
		contentList : [],//内容区列表
		active : 'active',
		event : 'mouseover',
		autoRender : true,
		onViewReady : function(){
			if(this.event === 'click'){
				this.controler.on(this.event, this.targetName, $.proxy(this.select, this));
			}else{
				this.controler.find(this.targetName).on(this.event, $.proxy(this.select, this))
			}
		},
		select : function(e){
			var jq = $(e.target), index = jq.index();
			if(jq.hasClass(this.active)) return;
			var hindex = this.controler.find('.'+this.active).removeClass(this.active).index();
			jq.addClass(this.active);		
			
			$(this.contentList[hindex]).cssDisplay(0);
			$(this.contentList[index]).cssDisplay(1);
		}			
	}))

	
	/**
	 * @class Gaofen.ui.CollectPageData
	 * 获取指定区域参数
	 * <code><pre>
	    new Gaofen.CollectPageData({
			view : $('div.recent-lecture div.thumb-info-list'),
			target : 'div.item'
		});
	   </pre></code>
	 **/
	ui.CollectPageData = G.reg('CollectPageData', Util.create(Base, {
		
		view : '',
		
		target : 'div', //目标标签
		
		attr : 'rel', //取标签上的属性(val 表示取其value)
		
		toObject : true, //取到的是否需要分割为object
		
		property : 'all', //取所有取到的值(id表示取某个值， id,name表示取id及name)
		
		data : [],
		
		onViewReady : function(){

			var view = this.jq(), 
				self = this;
				items = this.items || view.find(this.target);

			items.each(function(obj, i){
				var _data = self.getItemData($(this));
				self.data.push({item : this, data : _data});
			});	
		
		},
			
		getItemData : function(item){
			var strRel;
			if(this.attr === 'rel'){
				strRel = item.attr('rel');
			}else if(this.attr === 'val'){
				strRel = item.val();
			}
			return this.analyseData(strRel);
		},
		
		analyseData : function(strRel){
			if(!strRel) return "";
			if(this.toObject){
				var map = {}, kv, kvs = (strRel||'').split(',');
				try {
					for( var i=0,len=kvs.length;i<len;i++){
						if(kvs[i].indexOf(':') === -1){
							map[kvs[i]] = true;
						}else {
							kv = kvs[i].split(':');
							map[kv[0]] = kv[1];
						}
					}
				}catch(e) { 
					if(__debug) console.trace();
					throw 'Syntax Error:rel字符串格式出错。' + strRel; 
				}
				
				if(this.property === 'all'){
					return map;
				}else{
					var _key = this.property.split(','), _map = {};
					for( var i=0,len=_key.length;i<len;i++){
						if(map.hasOwnProperty(_key)){
							_map[_key] = map[_key];
						}
					}
					return _map;
				}				
			}else{
				return strRel;
			}
		},
				
		getData : function(){
			return this.data;
		}
	
	}));
	
	ui.login = G.reg('Login', function(opt){

		var box = G.use('Modal', {
			appendTo : 'body'
			, mask : true
			, title : '登录'
			, cs : 'modal-login'
			, contentHtml : 'win_login'
//			, footers : 'win_module'
			, closeable: true
			, destroyOnClose : true
			, onViewReady : function(){
				var self = this, jf = this.jq('#form-logins'), inputs = jf.find('input[class="input-text"]'), 
					form_rows = jf.find('.form-row'), msg = this.jq('#msg'), 
					jqun = inputs.eq(0), jqpwd = inputs.eq(1),
					focusCss = 'hints', errorCss = '', successCss = 'success',
					lock = false;
				function setFormRowCss(dom, css){
					setSuccess($(dom).closest('.form-row').attr('class', 'form-row '+css), css === successCss);
				}
				function setSuccess(dom, p){
					dom.find('.help-inline').cssDisplay(p);
				}
				function vil(){
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
					if(e.keyCode === 13) self.jq('#lg').click();
				});
				var jqlg = this.jq('#lg').click(function(e){
					if(lock || !vil())return;
					lock = true;
					self.jq('#lgbtn').cssDisplay(0);
					self.jq('#lging').cssDisplay(1);	
					msg.cssDisplay(0);
					var url = 'http://'+G.PD.get('host')+'/ajax/login';	
					Req.postReq(url, {
						username : $.trim(jqun.val()),
						password : $.trim(jqpwd.val()),
						save_me : self.jq('#rem').prop('checked') ? 1 : 0
					},function(r){
						lock = false;
						if(r.isOk()){
							//跟踪代码SEO
							FN.seoFollow({'event': 'signin'});							
							$("body").append(r.getData().data);
							setTimeout(function(){
								window.location.reload();
							},2000);
						}else{
							self.jq('#lgbtn').cssDisplay(1);
							self.jq('#lging').cssDisplay(0);
							jf.find('#register').attr({"title":"登录"}).prop('disabled', false).html("登录");
							msg.cssDisplay(1).html(r.getError());										
						}
					});
				});
			}
				
		}, opt).play(1);
		return box;
	});
	
	
	//修改讲座状态及参加人数
	//参数host, view, target, type
	FN.jiangzuoChangeStatus = G.reg('jiangzuoChangeStatus', function(opt){
		var def = {
			view : $('div.recent-lecture div.thumb-info-list')[0],
			target : 'div.item'
		};

		var cpd = G.use('CollectPageData',$.extend(def, opt)).play(1);

		var data = cpd.getData(), host = (opt &&opt.host);
		var param = [], items = {};
		for(var i=0, len = data.length;i<len;i++){
			if(data[i].data){
				param.push(data[i].data.id);
				items[data[i].data.id] = data[i].item;
			}
		}
		if(param.length === 0) return;
		if(!host){
			var PDget = G.PD.get,
			
			host = PDget('host') || 'dev.cms.gaofen.com';
		}
		var url = "http://"+host+"/ajax/getLecturesState";
		Req.q(url, {ids: param.join(',')}, function(r){
			if(r.isOk()){
				$.each(r.getData(), function(k){
					if(items[k]){
						var jq = $(items[k]);
						jq.find('span.ribbon').replaceWith(this.endJoinTime);
						if(opt && opt.type){//特殊情况
							jq.find('#applynum').html(this.applynum);
						}else{
							jq.find('div.details p:last').html(this.applynum);
						}
					}
				});	
			}
		
		})	
	});
	
	
	/**
	 * 用户登录状态
	 */
	FN.gaofen_app_user = function(){
		var islogined = $.cookie('gaofen_user');
		if(islogined){
			$("#logined").removeClass("hidden");
			$("#user").html(islogined);
		}else{
			$("#logined").addClass("hidden");
			$("#login").removeClass("hidden");
		}
	};
	
	/**
	* 全局城市切换 
	*/
	FN.gaofen_app_cityMenu = function(citystr){
		var timeOutVar = null,
			cityname = "广州站";
		switch(citystr){
			case 'sz' :
				cityname = "深圳站";
			break;
			case 'dg' :
				cityname = "东莞站";
			break;
		};
		var $me = $("div.city-selector");
		var city_frame = [
						"<div class=menu>",
						"	<a href='http://www.gaofen.com/'>广州站</a>",
						"	<a href='http://sz.gaofen.com/'>深圳站</a>",
						"</div>"
						].join('');
		$me.find("span.caret").html(cityname+"<i></i>")
			.find("menu.menu").remove()
			.append(city_frame);
	};
	
	//全局搜索方法
	FN.gaofen_app_search = function(opt){
		var auto = G.use('AutoInput', {
			view : opt.view || $('#sv')[0],
			url : opt.url,
			inputor : opt.inputor || $('#search'),
			foucsCls : opt.foucsCls || 'form-search-focus',
			//defautText : opt.txt || '搜索资讯、资料',
			onkeydown : function(e){
				if(e.keyCode == 13){
					this.submit();
				}
			},
			onViewReady : function(){
				G.ui.AutoInput.prototype.onViewReady.call(this);
				var that = this;
				this.jq('.search-btn').click(function(){
					that.submit();
				});
				var channel = PD.get('channel'), nsid = 0;
				switch(channel){
					case 'jiangzuo':
						nsid = 3;
					break;
					case 'xuexiao':
						nsid = 4;
					break;
					case 'ziliao':
						nsid = 5;
					break;
				}
				this.jq('input[name="nsid"]').val(nsid);
			},
			submit : function(){
				var v = this.getVal();
				if(v !== this.defautText && v !== ''){
					$('#search_form').submit();
				}else{
					this.inputor.focus();
				}
			}
		});
		auto.play(1);	
	};
	
	
	FN.goTop = function(){
		var toTop = $('<a title="返回顶部" id="gotop" class="gotop" href="javascript:void(0);" onfocus="this.blur();">返回顶部</a>').hide(),
			pt;
		$('body').append(toTop);
			if ($.browser.msie) {
				if ($.browser.version == "6.0"){
					toTop.css({"position":"absolute","bottom":"0"})
					setInterval(fixPosition,1);//计时器，设置返回顶部操作
				 }
		}
			toTop.click(function(){
			$('body,html').animate({scrollTop:0},800);
		});
		/*
		 *IE6下自动适应
		 */
		function fixPosition(){
			var th=$(window).scrollTop();
			var ah=document.documentElement.clientHeight-81;//ie6下，得到窗口显示区域高度
			toTop.css({'top':th+ah});
		} 		
		if($(this).scrollTop()>0)
			toTop.fadeIn(500);
		$(window).scroll(function(){
			var sh=$(this).scrollTop();		
			if(sh>200){
				toTop.fadeIn(500);			
			}else{
				toTop.fadeOut(500);
			}
		});
	};
	
	
	//通过创建iframe下载面容
	FN.addFrameToDownload = function(url, appendTo){
		$('#downIfr').remove();
		if(url){			
			$('<iframe src="'+url+'" class="hidden" name="downIfr" id="downIfr"></iframe>').appendTo(appendTo || 'body');	
		}
	};
	//下载后修改下载数
	FN.changeDownTimer  = function(timer, id){
		var obj = $('#'+(id||'downNum'));
		if(obj.length){
			old = parseInt(obj.text());
			obj.text(timer || ++old);		
		}
	};
	
	/**
	  * 试看资料后购买调用
	  * mt : 所需价格(20高分币)		
	  * id : 文件ID
	  * type : 支付类型(1:高分币，2:支付宝)
	  * isLogin : 是否已登录
	  */
	FN.readAfterPay = function(mt, id, type, isLogin){
		var $b = $('body'), rpbox = $b.data('rpbox');
		if(!rpbox){
			rpbox = G.use('Modal', {
				appendTo : 'body',
				mask : true,
				title : '购买文档',
				cs : 'modal-download',
				fid : id ,
				ftype : type,
				mt : mt ,
				contentHtml : 'readAfterPay',
				closeable: true,
				destroyOnClose : true,
				actionMgr : true,
				afterHide : function(){
					G.ui.Modal.prototype.afterHide.call(this);
					$b.data('rpbox','');
				},
				onactiontrig : function(e){
					switch(e.data.e){
						case 'ddoc' :
							if(isLogin != '1'){//未登录
								G.use('Login');		
							}else{
								e.stopPropagation(false);
							}
							this.close();
						break;
					}
				}				
			});
			$b.data('rpbox', rpbox);
		}
		rpbox.play(1);		
		return rpbox;
	};
	
	//阅读器控制
	ui.Reader = G.reg('Reader', function(opt){
		var def = $.extend({
				controlView : '',
				//view : $('#pageContain'),
				view : $('div.cont:eq(0)'),
				isImg : 0,//0:表示html方式,1:图片方式展示
				ph : 1050,
				curPage : 1
			}, opt),
			PD = G.PD,
			pageList = def.pages || PD.get('pages'),
			view = def.view,
			isImg = def.isImg,
			viewControl = def.controlView,
			childs = view.children(),
			pages = pageList.length,
			topPx = childs.eq(0).offset().top,
			maxPx = childs.eq(0).offset().top,
			prevDisabled = 'page-prev-disable',
			nextDisabled = 'page-next-disable',
			zidisabled = 'zoom-in-disable',
			zodisabled = 'zoom-out-disable',
			loading = false,
			padHg = jqWin.height(),
			btns = viewControl.find('a'),
			browser = $.browser,
			scale = 7,
			tmpScale,
			maxscale = 11,
			minscale = 7,
			Ph = childs.eq(0).height() || def.ph,
			fid = PD.get('fid'),
			host = PD.get('host'),
			fulling = false,//是否全屏
			effectTime = 300,
			adClass = '.ad',
			adItemHeight = 90,
			insertedAd = 0,
			scaleObj = {
				//'1' : {height:270, width : 748, scale : 0.27, mb : -780},
				//'2' : {height:410, width : 748, scale : 0.4, mb : -640},
				//'3' : {height:540, width : 748, scale : 0.52, mb : -510},
				//'4' : {height:665, width : 748, scale : 0.64, mb : -385},
				//'5' : {height:790, width : 748, scale : 0.76, mb : -260},
				//'6' : {height:910, width : 748, scale : 0.87, mb : -140},
				'7' : {height:1050, width : 748, scale : 1.0133, mb : 27, ieScale:1},
				'8' : {height:1240, width : 748, scale : 1.1, mb : 120},
				'9' : {height:1300, width : 748, scale : 1.23, mb : 260},
				'10' : {height:1440, width : 748, scale : 1.35, mb : 390},
				'11' : {height:1560, width : 748, scale : 1.47, mb : 510},
				'19' : {height:1382, width : 978, scale : 1.3075, mb : 338, ieScale:1.2894}
			};

		var expr = isImg ? '.page-ie' : '.pd',
			pageAd = PD.get('pagead');
		
		if(pageAd){
			pageAd = pageAd.split(',');
		}
		//pageAd = '';
		var _self = {
		
			regetPD : function(pv){
				topPx = pv || view.children(expr).eq(0).height();
			},
		
			getChild : function(){
				return childs; 
			},
			
			setPage : function(page){
				var cv = viewControl, ipt = cv.find('input').val(page);
				this.setPadBtn();
			},
			
			setPadBtn : function(){
				if(def.curPage == '1'){
					btns.eq(0).addClass(prevDisabled);
				}else{
					btns.eq(0).removeClass(prevDisabled);
				}
				if(def.curPage == pages){
					btns.eq(1).addClass(nextDisabled);
				}else{
					btns.eq(1).removeClass(nextDisabled);
				}
			},
			
			compare : function(st){
				var obj = scaleObj[scale], _Ph = Ph + obj['mb'], childs = view.children(expr), len = childs.length,
					page = null;
				for(var i=0;i<len;i++){
					var child = childs.eq(i);
					if(st < child.offset().top){
						var page = i;
						if(page === 0){							
							page = 1;
						}
						break;
					}
				}
				if(page === null){
					page = len > pages ? pages : len;
				}
				return page;
			},
			
			run : function(st){
				def.curPage = this.compare(st);
				//this.setPage(def.curPage = this.compare(st));
				//this.setPadBtn(st);				
				if(!loading){
					if(def.curPage >= view.children(expr).length){
						this.getPage();
					}else{
						if(fulling && st+padHg+30 >= view.parent().height()){//极端情况
							this.getPage();
						}
					}
				}
			},
			
			getScrollTop : function(){
				return jqWin.scrollTop();
			},
			
			toPad : function(direction){
				//var st = this.getScrollTop();
				if(direction === 'next'){
					def.curPage++;
				}else{
					if(def.curPage>1)
						def.curPage--;
				}
				//this.setPage(def.curPage);
				this.goToPage(def.curPage);
				//jqWin.scrollTop(direction === 'next' ? st + padHg - 60 : st - padHg + 60);		
			},
			//scrollTop到某一页
			goToPage : function(toPage){
				var childs = view.children(expr);
				jqWin.scrollTop(childs.eq(toPage - 1).offset().top+10);
			},
			
			setScale : function(opt){
				var p = opt.p, _scale = opt._scale, _childs = opt.child || childs;
				if((p === 'boost' && scale == maxscale) || (p === 'lessen' && scale == minscale)) return;
				if(_scale) 
					scale = _scale;
				else
					p === 'lessen' ? --scale : ++scale;
				//this.setscaleBtn();
				var obj = scaleObj[scale];
				if(!isImg){
					if(browser.mozilla){
						_childs.css({'-moz-transform' : 'scale('+obj.scale+')', 'marginBottom' : obj.mb, 'transformOrigin': '50% 0px 0px'});
					}
					if(browser.chrome || browser.safari){
						_childs.css({'-webkit-transform' : 'scale('+obj.scale+')', 'marginBottom' : obj.mb, 'transformOrigin': '50% 0px 0px'});
					}
					if(browser.opera){
						_childs.css({'-o-transform' : 'scale('+obj.scale+')', 'marginBottom' : obj.mb, 'transformOrigin': '50% 0px 0px'});
					}
				}
				/*
				if(browser.msie){
					if(parseInt(browser.version)>8){
						_childs.css({'-ms-transform' : 'scale('+obj.ieScale+')', 'marginBottom' : obj.mb, 'transformOrigin': '50% 0px 0px'});
					}else{
						_childs.css({'zoom' : obj.ieScale});
					}
				}
				*/
				//Ph = obj.height;
			},
			
			setscaleBtn : function(){
				if(scale === minscale){
					btns.eq(3).addClass(zodisabled);
				}else{
					btns.eq(3).removeClass(zodisabled);
				}
				
				if(scale === maxscale){
					btns.eq(2).addClass(zidisabled);
				}else{
					btns.eq(2).removeClass(zidisabled);
				}
			},
			
			loadingTemp : '<div class="loading" id="ld"></div>',
			
			createLoading : function(){
				view.append(this.loadingTemp);
			},
			
			getPage : function(){
				var p = def.curPage;
				if(pages <= p) return;//已到最后一页
				var url = pageList[p], self = this;			
				loading = true;
				this.createLoading();
				this.beforeGetPage();
				if(isImg){
					url = 'http://'+host+'/docs/docsImage?id='+fid+'&image='+url;
					//url = 'http://file.gaofen.com/html/v5/img/shop/v2/gkkd/1.jpg';
					this.insert(T.parse(T.get('readerImgHtml'), {url:url}));
				}else{
					url = 'http://'+host+'/ajax/docspage?id='+fid+'&pagename='+url;
					Req.q(url, {}, function(e){
						if(e.isOk()){
							self.insert(e.getData().pageC||'');						
						}else{
							view.find('#ld').remove();
						}
					});
				}
			},
			
			//判断是否需要插入广告
			beforeGetPage : function(p){
				if(pageAd){
					if($.inArray((p || def.curPage+1)+'',pageAd)>-1){
						var ad = callad('ziliao_showview_ad'+(this.getADs().length+1), '', 1);
						if(ad){
							if(p){
								$("<div class='picture picture-h70'>"+ad+"</div>").insertBefore(view.children(expr).eq(p-1));
							}else{
								$("<div class='picture picture-h70'>"+ad+"</div>").insertBefore(view.find('#ld'));
							}
						}
					}
				}
			},
			
			getADs : function(){//获取当前插入的广告数
				return view.find('.picture');
			},
			
			insert : function(html){
				if(!html){
					html = view.children(expr).eq(0).clone(true);					
				}
				var _html = $(html);
				view.find('#ld').replaceWith(_html);
				//var nh = $(html).appendTo(def.view);
				childs = view.children(expr);
				if(fulling)
					this.setScale({p:'boost', _scale :19, child : _html});
				else 
					this.setScale({p:'boost', _scale :scale});
				loading = false;
				//this.setPadBtn(this.getScrollTop());
			},

			createFull : function(){
				fulling = true;				
				var _sl = this.getScrollTop() - topPx - (def.curPage-1) * scaleObj['7'].mb;	
				$('body').addClass('fullscreen');			
				this.setView($('#readercontainerfull').append($('#readcontainerparent').html()).find('#pageContain'));
				
				childs = view.children(expr);
				tmpScale = scale;
				this.setScale({p:'boost', _scale :19});
				$('#readcontainerparent').html('');
				setTimeout(function(){jqWin.scrollTop(_sl*1.29)},0);
				//_self.regetPD(0);//重新计算离顶部高度
				//topPx = 0;
			},
			clearFull : function(){	
				fulling = false;
				var _sl = this.getScrollTop() + topPx + 143, readercontainerfull = $('#readercontainerfull');	
				//var _sl = this.getScrollTop();	
				$('body').removeClass('fullscreen');		
				this.setView($('#readcontainerparent').append(readercontainerfull.html()).find('#pageContain'));
				childs = view.children(expr);
				this.setScale({p:'boost', _scale :tmpScale});				
				readercontainerfull.html('');
				setTimeout(function(){jqWin.scrollTop(_sl/1.29)},0);
				//_self.regetPD();//重新计算离顶部高度
			},
			setView : function(_view){
				view = _view;
			},
			
			displayControl : function(p){//display:none后再取其top得不到正确的值,所以用animate
				return;//产品要求不再隐藏功能条
				var opacity = 1;
				if(p !== undefined){
					if(p === false) opacity = 0;
				}else{
					if(!fulling && viewControl.offset().top + 37 > $('#footer').offset().top){
						 opacity = 0;
					}
				}
				viewControl.animate({opacity:opacity}, effectTime);
			}
		
		};
		
		//var th = $(window).scrollTop();

		$(window)
		/*
		.scroll(function(){
			var st = _self.getScrollTop();	
			_self.run(st);
		})
		*/
		.resize(function(){
			padHg = jqWin.height();
		});
		
		
		G.use('ListenScroll', {
			isAsynchrofn : true,
			synchrofn : function(){
				var st = this.getScrollTop();	
				this.run(st);
			},
			asynchrofn : function(){
				var st = this.getScrollTop();	
				this.setPage(def.curPage);
				//this.setPadBtn(st);
				this.displayControl();
			},
			scope : _self
		});
		
		btns.click(function(e){		
			if($(e.target).hasClass('actions') || $(e.target).parent().hasClass('actions')){//下载文件弹出新页面
				return true;
			}
			e.preventDefault();
			var jq = $(this), cn = jq.attr('class');
			if(cn.indexOf('disable') === -1){
				var id = jq.attr('id');
				if(id === 'next' || id === 'prev'){
					_self.toPad(id);
				}else{
					if(cn === 'full-in')
						_self.createFull();
					if(cn === 'full-out') 
						_self.clearFull();
				}
				//else{
				//	_self.setScale(id);
				//}					
			}			
		});
		
		viewControl.find('input').keydown(function(e){		
			var key = e.keyCode;
			if((key > 95 && key < 106) || (key > 46 && key < 59) || key === 8 || key === 48){
				return true;
			}else{
				return false;
			}
		}).keyup(function(e){
			if(e.keyCode === 13){
				var v = parseInt($.trim(this.value)), childs = view.children(expr), total = childs.length;
				if(v > total) this.value = v = total;
				if(v == 0) this.value = v = 1;
				_self.goToPage(v);
			}
		})
		$('#gotop').css('zIndex',10000);
		$(window).scroll();
		_self.beforeGetPage(1);//第一页前插入广告		
		_self.setScale({p:'boost', _scale :scale});
		//_self.setscaleBtn();
		return _self;
	});
	
	
	/**
	  * 监听滚动条事件
	  * isSynchro : 是否有同步滚动条事件		
	  * asynchrofn : 异步事件
	  * synchrofn : 同步事件
	  */
	FN.listenScroll = G.reg('ListenScroll', function(opt){
	
		var obj = opt.obj || $(window),
		
			isAsynchrofn = opt.isAsynchrofn, //是否有同步滚动条事件
			
			scope = opt.scope || window,
			
			asynchrofn = opt.asynchrofn || $.noop, //异步事件
			
			synchrofn = opt.synchrofn || $.noop, //同步事件
			
			timer = opt.timer || 300,
			
			setTimer;
		
		obj.scroll(function(){

			synchrofn.call(scope);
			
			if(isAsynchrofn){//每次滚动只触发一次事件
				clearTimeout(setTimer);
				setTimer = setTimeout(function(){
					asynchrofn.call(scope);
				}, timer);
			}
		});
	
	});
	
	
	//设为首页
	FN.setHome  = function(obj, url){
		url = url || 'http://www.gaofen.com';
		if (document.all) {
			document.body.style.behavior = 'url(#default#homepage)';
			document.body.setHomePage(url);
		} else if (window.sidebar) {
			if(window.netscape) {
				try {
					netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
				}catch (e) {
					alert('此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为’true’,双击即可。');
				}
				try{
					var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
					prefs.setCharPref('browser.startup.homepage', url);
				}catch(e){}
			}
		}
	};
	//设置年级
	ui.setGrade = G.reg('setGrade', function(opt){
		var box = G.use('Modal', {
			appendTo : 'body'
			, mask : true
			, title : '设置身份'
			, cs : 'modal-setting-grade'
			, contentHtml : 'gradeModal'
			, closeable: true
			, setMsg : function(msg){
				var actions  = this.jq('.actions'), children = actions.children();
				if(msg){
					actions.addClass('error');
					children.eq(1).cssDisplay(0);
					children.eq(2).text(msg);
				}else{
					actions.removeClass('error');
					children.eq(1).cssDisplay(1);
					children.eq(2).text('');
				}
			}
			, afterShow : function(){
				var grade = PD.get('grade'), status = PD.get('status');
				if(grade){
					this.jq('input[value="'+grade+'"]').prop('checked', true);
				}
				if(status){
					this.jq('input[value="'+status+'"]').prop('checked', true);
				}
				this.jq('.actions').children().eq(2).text('');
			}
			, onViewReady : function(){
				var self = this;
				this.jq('#btn').click(function(e){
					e.preventDefault();
					var gv = self.jq('input[name="gv"]:checked').val()||'', sf = self.jq('input[name="sf"]:checked').val()||'';
					self.setMsg();				
						data = {'grade' : gv, 'status' : sf};
					Req.postReq('/ajax/setGrade', data, function(r){
						if(r.isOk()){								
							PD.set('', data);
							opt.fn && opt.fn(gv);
							location.reload();
							//self.play(0);
						}else{
							self.setMsg(r.getError());									
						}
					});						
				});
			}}, opt).play(1);
		return box;
	});
	
	//判断是否有新信息
	FN.isHasNewList = function(view, nid, timer, url){
		if(nid){
			var seter = setInterval(function(){
				Req.q( url || '/ajax/getNewDocs', {since_id : nid}, function(r){
					if(r.isOk()){
						var d = r.getData();
						if(d.number == '0') d.number = '';
						$('#badge').text(d.number);
					}
				});
			}, timer);
		}
	};
	
	//跟踪代码SEO
	FN.seoFollow = function(params){
		
		// if(G.PD.get('seoFollow') === '1'){
			if(typeof dataLayer === 'undefined'){
				dataLayer = [];
			}
			dataLayer.push(params); 
		// }			
	};
	
	//在线客服
	FN.feedback = function(){
		$("#fbHandle").click(function(){
			var $me = $(this).parent();
			if($me.hasClass("fb-hide")){
				$me.removeClass("fb-hide").animate({right:0});
				$me.find("i").attr("title","收缩");
			}else{
				$me.animate({right:-161},function(){
					$(this).addClass("fb-hide");
					$(this).find("i").attr("title","展开");
				});
			}
		});
	
	};
	//购买时要检测帐号是否已激活
	FN.avticeAccount  = function(fn, e, direct){
		e && e.lock(1);
		
		var modalFn = function(adata){
			var activeBox = G.use('Modal',{
				appendTo : 'body',
				mask : true,
				title : '激活邮箱',
				cs : 'modal-activate',
				contentHtml : 'activate',
				closeable: !direct ,
				destroyOnClose : true,
				destroy : function(){
					clearTimeout(this.boxTimer);
					G.ui.Modal.prototype.destroy.call(this);
				},
				mail : adata.email,
				toMail : adata.emaillink,
				boxTimer : null,
				onViewReady : function(){
					var alock = false, jqmsg = this.jq('#msg'), self = this;								
					this.jq('#send').click(function(e){
						e.preventDefault();
						if(alock) return;
						alock = true;
						jqmsg.attr('class', 'loading-mini').text('发送中...');
						var url = 'http://my.gaofen.com/ajax/cse';
						//if(G.PD.get('host').indexOf('dev')>-1 ) url = 'http://dev.login.gaofen.com/ajax/cse';
						Req.q(url, {email:adata.email}, function(act){
							var aresult = act.getData();
							if(act.isOk()){
								jqmsg.attr('class', 'icon-success').text('已发送');
								self.boxTimer = setTimeout(function(){
									!direct && activeBox.close();
								},3000);
							}else{
								alock = false;									
								jqmsg.attr('class', 'icon-error').text(act.getError());
							}
							jqmsg.cssDisplay(1);
						});
					});					
				}						
			}).play(1);
		}
		if(direct && $.type(direct) === "object"){//直接弹出浮层
			modalFn(direct);
		}else{		
			Req.q('http://'+(G.PD.get('host')||"my.gaofen.com")+'/ajax/checkEmailStatus', {}, function(active){
				e && e.lock(0);
				if(active.isOk()){
					var adata = active.getData();
					if(adata.emailstatus == '1'){
						fn && fn(); 
						return;
					}
					
					modalFn(adata);
				}else{
					e && e.lock(0);
				}
			});
		
		}
	
	};

	//移动端下载、购买时提示（有些移动端下载不了）
	G.reg('MobileDowm', function(opt){		
		var param = $.extend({
						appendTo : 'body',
						mask : true,
						title : '提示',
						btnMsg : '继续购买',
						cs : 'modal-tips modal-tips-mobile',
						contentHtml : 'mobileModal',
						closeable: true,
						destroyOnClose : true,
						onViewReady : function(){
							
							this.jq('#btnMsg').click(function(e){
								e.preventDefault();
								opt.fn && opt.fn();
								box.close();
							});
							
							this.jq('#cancel').click(function(e){
								e.preventDefault();
								box.close();
							});
						}
		}, opt);

		var box = G.use('Modal', param);
		
		return box;			
	})
	
	//地区共用模块
	FN.areaPublic = function(id){
		var picInit = false, cityInit = false, distInit = false;
		window['showdistrict'] = function(container, elems, totallevel, changelevel){
			if(changelevel === 3) return;
				function isUndefined(variable) {
					return typeof variable == 'undefined' ? true : false;
				}
			var cont = $("#"+container);
			var getdid = function(elem) {
				var op = elem.find("option:selected");
				return op.eq['did'] || op.attr('did') || '0';
			};
			var pid = changelevel >= 1 && elems[0] && $("#"+elems[0]) ? getdid($("#"+elems[0])) : 0;
			var cid = changelevel >= 2 && elems[1] && $("#"+elems[1]) ? getdid($("#"+elems[1])) : 0;
			var did = changelevel >= 3 && elems[2] && $("#"+elems[2]) ? getdid($("#"+elems[2])) : 0;
			var coid = changelevel >= 4 && elems[3] && $("#"+elems[3]) ? getdid($("#"+elems[3])) : 0;
			var geturl = PD.get('APP_URL')+"/ajax/getLocation?op=district&container="+container
				+"&province="+elems[0]+"&city="+elems[1]+"&district="+elems[2]+"&community="+elems[3]
				+"&pid="+pid + "&cid="+cid+"&did="+did+"&coid="+coid+'&level='+totallevel+'&handlekey='+container+'&inajax=1'+(isUndefined(changelevel) ? '&showdefault=1' : '')+'&__rnd='+new Date();

			$.get(geturl,function(msg){
					var value = $(msg).find("root").text();
					if(value){
						cont.html($(msg).find("root").text());	
						//$("#residedistrictbox #resideprovince").attr("tabindex","7");
						//$("#residedistrictbox #residecity").attr("tabindex","8");
						//$("#residedistrictbox #residedist").attr("tabindex","9");	
						//$("#residedistrictbox #residecommunity").attr("tabindex","11");
					}
					if(cityInit === false && typeof remote_ip_info !== 'undefined'){
						$('#residecity option[value^="'+remote_ip_info.city+'"]').prop('selected', true).change();
						cityInit = true;
					}
					//else if(distInit === false){
					//	$('#residedist option[value="三水区"]').prop('selected', true);
					//	distInit = true;
					//}
				}
			);
		};
		
		window['autoSelectArea'] = function(){
			if(picInit === false){
				$('#resideprovince option[value^="'+remote_ip_info.province+'"]').prop('selected', true).change();
			}
		}

		$("#residedistrictbox").click(function(){
			picInit = true;
			cityInit = true;
		});
		
		var szTimer, szTime = 0;
		function selectArea(){
			if(typeof remote_ip_info === 'undefined'){
				if(szTime > 100) return;
				szTime++;
				szTimer = setTimeout(selectArea, 400);
			}else{
				clearTimeout(szTimer);
				szTimer = null;
				window['autoSelectArea']();			
			}
		}
		
		
		return {
			checkArea : function(){
				var residedistrictbox = $('#residedistrictbox'), select = residedistrictbox.find('select'), isSelect = true;
				select.each(function(i, item){
					if($(item).val() === ''){
						isSelect = false;									
						return false;
					}
				});
				if(!isSelect){
					residedistrictbox.parent().removeClass('success').addClass('error').find('.help-inline').text('请选择地区');
					return false;
				}else{
					residedistrictbox.parent().removeClass('error').addClass('success').find('.help-inline').text('OK');
					return true;
				}
			},
			
			selectArea : selectArea
		
		}

	}
	
	
	G.ui.headToolbar =  G.reg('HeadToolbar', Util.create(Base, {
		
		onViewReady : function(){		
			var showPx =  this.showPx, view = this.jq(), that = this, hide = true,
				share = this.jq('div.share'), sharePx = this.sharePx;
			$(window).scroll(function(){				
				var sh = $(this).scrollTop();		
				if( sh > showPx){
					that.play(1);	
				    if(hide){
						//view.animate({'opacity':1}, 200);
					}
					hide = false;
				}else{
					that.play(0);	
					hide = true;
					//view.animate({'opacity':0.1}, 10);
				}
				if(!sharePx || sh > sharePx){
					share.cssDisplay(1);		
				}else{
					share.cssDisplay(0);		
				}
			}).trigger('scroll');
		}
	}))
	
	//活动报名成功
	ui.lectureSuccess = G.reg('LectureSuccess', function(opt){
		var box = G.use('Modal', {
			appendTo : 'body'
			, mask : true
			, cs : 'modal-apply'
			, title : '报名成功'
			, contentHtml : 'win_lectureSuccess'
			, closeable: true
			, onViewReady : function(){
				var self = this;
				this.jq('#close').click(function(e){
					e.preventDefault();
					box.play(0);
				});
			}}, opt).play(1);
		return box;
	});


	//资料问卷调查
	FN.ziliaoDiaocha = function(){							
		if(+new Date < new Date('2015-01-04').getTime()){
			if(navigator.userAgent.indexOf('Android') != -1 || navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('iPad') != -1) {
				if($.cookie('diaocha')) return;
				G.use('Modal', {
					appendTo : 'body'
					, mask : true
					, cs : 'modal-tips'
					, title : '提示'
					, contentHtml : 'AnchorDlgContent'
					, closeable: true
					, destroyOnClose : true
					, buttonHtml : '<a id="godiaocha" class="btn btn-primary" href="http://www.lediaocha.com/m/s/msthag" target="_blank" >参与调查</a>'
					, onViewReady : function(){
						var that = this;
						this.jq('#fwbody').html('为提高移动设备的使用体验，现邀请您参与小调查，提交答案即获赠5高分币！');
						this.jq('#godiaocha').on('click', function(e){
							$.cookie('diaocha', 1, 700);//7天内不再出现
							that.play(0);
						});						
					}					
				}).play(1);
			}
		}
	}
    
})(Gaofen, jQuery, window);