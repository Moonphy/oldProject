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
    G.PD = G.use('PD');
	
	
	 /**
     * @class  Gaofen.ui.DragBase
     * 拖动组件
     */	
	ui.DragBase = G.reg('DragBase',Util.create(Base, {
		items : [] //拖动对象
		,parent : null//拖动对象级
		,dlagIngCls : 'dlaging'　　//拖动体样式
		,cp : []//每个可拖动对象位置
		,canDlagArea : null //拖动体
		,itemHeight : null　//拖动体高度
		,clone : false //拖动对象并带背景
		,sortAble : false //调整顺序
		,target : null //放置目标位置
		,canOutside : true//是否拖出outsideArea
		,outsideArea : ''//不能拖出的区域
		,movePart : $('body') //可拖动区域
		,targetInCls : 'targetIn'  //拖动体在放置目标上样式
		,pushPoint : function(item){
			this.cp.push({obj:item,offset:item.offset()});
		}
		,cloneTemp : '<div class="dlagnull hidden" ></div>'
		
		,initUI : function(e){
			this.parent = this.parent || $('body');
			if(this.items.length){
				this.bingDrag(this.items);
				this.itemHeight = $(this.items[0]).height();
			}
		}
		
		,bingDrag : function(items){
			var self = this;
			items.each(function(i){					
				var _t = $(this), fn;
				self.pushPoint(_t);				
				var handle = self.handle?_t.find(self.handle):_t;
				handle.mousedown(function(e){
					var _fn = self.parent.find('.'+self.dlagIngCls).data('md');
					if(_fn){
						self.movePart.unbind('mousemove', _fn);
					}
					
					if(self.sortAble && self.parent.children().length<2) return false;

					Util.bind(self.mousedown, self)(e,_t);	
					fn = function(e){					
						Util.bind(self.mousemove, self)(e,_t);
						return false;
					};
					_t.data('md',fn);
					self.movePart.mousemove(fn);
					e.preventDefault();
				})

				self.movePart.mouseup(function(e){
					e.preventDefault();
					var md = self.parent.find('.'+self.dlagIngCls);
					if(md.data('md')){
						self.movePart.unbind('mousemove', md.data('md'));
						md.data('md','');					
						Util.bind(self.mouseup, self)(e, md);
					}				
				});
			})		
		}
		
		,addItem : function(item){
			this.items.push(item);
			this.bingDrag(item);
		}

		,mousedown : function(e, dom){
			var off = dom.offset();	
			dom.data('cache',{cx:e.clientX, cy:e.clientY, left:off.left,top:off.top, index : dom.index(), gap: e.clientY - off.top});
			dom.addClass(this.dlagIngCls);	
			if(this.clone){
				if(this.sortAble){
					var chs = this.parent.children();
					this.startT = chs.eq(0).offset().top;
					this.endT = chs.eq(chs.length - 1).offset().top;
				}	
				this.insertClone = this.insertClone || $(this.cloneTemp);
				this.insertClone.cssDisplay(0);
				this.insertClone.insertBefore(dom);			
			}			
		}
		
		,mouseup : function(e, dom){
			this.stop(dom, e);
			if(this.clone){
				this.insertClone.remove();
				this.insertClone = '';	
			}
		}
		
		,mousemove : function(e, dom){
			var cache = dom.data('cache'), 
			left = e.clientX - cache.cx+ cache.left,
			top = e.clientY-cache.gap;

			/*
			if(!this.canOutside){
				if(moff.left - e.clientX +(cache.cx- cache.left) >= 0 || 
					e.clientX - moff.left +(cache.cx- cache.left) >= this.movePart.width() || 
					e.clientY-cache.gap - (cache.cy- cache.top) <= 0 || 
					moff.top >= e.clientY-cache.gap ||
					moff.top+h - e.clientY - (cache.cy- cache.top) <= 0 || 
					h+moff.top < dom.offset().top+dom.height()){
					this.movePart.trigger('mouseup');
					return;
				}
			}
			*/
			dom.css('position','absolute').offset({left:left,top:top});
			if(this.clone){
				this.insertClone.cssDisplay(1);	
				this.sortAble && this.mathInsertNull(e);
			}
			if(this.target){
				this.moveTarget && this.moveTarget(this.isInTarget(dom, e), dom, this.target);
			}					
		}		
		
		,stop : function(dom, e){
			dom.removeClass(this.dlagIngCls);
			if(!this.canOutside){					
				var cache = dom.data('cache'), moff = this.outsideArea.offset(),
				h = this.outsideArea.height(),
				left = e.clientX - cache.cx+ cache.left,
				top = e.clientY-cache.gap;
				console.log(cache.cy- cache.top)
				if(moff.left - e.clientX +(cache.cx- cache.left) >= 0 				
					||e.clientX + dom.width()-(cache.cx- cache.left) >= this.outsideArea.width() + moff.left
					|| e.clientY - (cache.cy- cache.top) <= moff.top
					|| e.clientY + dom.height()- (cache.cy- cache.top) >= moff.top + h 
				){
					dom.css('position','absolute').offset({left:cache.left,top:cache.top});
					//return;
				}
				
			}
			
			
			if(this.target){
				this.toTarget(dom, e);
			}else{
				if(this.reset){
					dom.removeAttr('style');
				}
			}
		}
		
		,isInTarget : function(dom, e){
			var tg = this.target;
			if(typeof tg == 'string')
				tg = $(tg);
			if(tg.length){
				var tgOff = tg.offset(), domOff = dom.offset(), maxL = tgOff.left+tg.width(), maxH = tgOff.top + tg.height();
				if(e.clientX>tgOff.left && e.clientX<maxL && e.clientY>tgOff.top && e.clientY<maxH){
					return true
				}
			}
			return false;
		}
		
		,moveTarget : function(isIn, dom){
			var tg = this.target;
			if(typeof tg == 'string')
				tg = $(tg);
			if(isIn){
				tg.addClass(this.targetInCls);
			}else
				tg.removeClass(this.targetInCls);
		}
		
		,toTarget : function(dom, e){		
			if(this.isInTarget(dom, e)){
				this.inTargetFn && this.inTargetFn(dom);
				this.moveTarget(false);
			}else{
				dom.removeAttr('style');
			}
		}
		,remove : function(){
			this.items.each(function(i){					
				var _t = $(this).unbind('mousedown').unbind('mouseup')
			});				
		}
		
	}));
	
	
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
			console.log('onchange:'+this.val);
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
					console.log('search')
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
				items = view.find(this.target);
			
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
			, footers : 'win_module'
			, closeable: true
			, destroyOnClose : true
			, onViewReady : function(){
					var self = this, jf = this.jq('#form-logins'), inputs = jf.find('input');
					G.use('validator', {
						form : jf,
						trigger : '#register',
						elements : inputs, 
						onSuccess : function(data){
							jf.find('.actions .btn').prop('disabled', true).attr({"title":"正在登录..."}).html("正在登录...");			
							var url = 'http://'+G.PD.get('host')+'/ajax/login';							
							Req.postReq(url, {
									username : data.username,
									password : data.pwd,
									save_me : inputs.eq(2).prop('checked') ? 1 : 0
								},function(r){
									if(r.isOk()){
										$("body").append(r.getData().data);
										setInterval(function(){
											window.location.reload();
										},3000);
									}else{
										jf.find('.actions .btn').attr({"title":"正在登录"}).removeAttr("disabled").html("登录");
										$("#ipt_bubble").removeClass("hidden");
										$("#tip_info").html(r.getError());										
									}
								});
							return false;
						}
					});
					jf.find('input').eq(0).trigger('focus');
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
			},
			submit : function(){
				var v = this.getVal();
				if(v !== this.defautText && v !== ''){
					location.href = opt.url + encodeURI(v);
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
			if(sh>0){
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
			scaleObj = {
				//'1' : {height:270, width : 748, scale : 0.27, mb : -780},
				//'2' : {height:410, width : 748, scale : 0.4, mb : -640},
				//'3' : {height:540, width : 748, scale : 0.52, mb : -510},
				//'4' : {height:665, width : 748, scale : 0.64, mb : -385},
				//'5' : {height:790, width : 748, scale : 0.76, mb : -260},
				//'6' : {height:910, width : 748, scale : 0.87, mb : -140},
				'7' : {height:1050, width : 748, scale : 1, mb : 13},
				'8' : {height:1240, width : 748, scale : 1.1, mb : 120},
				'9' : {height:1300, width : 748, scale : 1.23, mb : 260},
				'10' : {height:1440, width : 748, scale : 1.35, mb : 390},
				'11' : {height:1560, width : 748, scale : 1.47, mb : 510},
				'19' : {height:1382, width : 978, scale : 1.3075, mb : 332}
			};
		
		var _self = {
		
			getChild : function(){
				return childs; 
			},
			
			setPage : function(page){				
				var cv = viewControl, ipt = cv.find('input').val(page);
			},
			
			setPadBtn : function(st){
				if(st < topPx){
					btns.eq(0).addClass(prevDisabled);
				}else{
					btns.eq(0).removeClass(prevDisabled);
				}
				
				if(topPx + view.height() < st+ padHg){
					btns.eq(1).addClass(nextDisabled);
				}else{
					btns.eq(1).removeClass(nextDisabled);
				}
				
			},
			
			compare : function(st){
				
				if(topPx+Ph >= st) return 1;
				
				if(topPx + view.height() < st) return pages;
				
				var tmp = st - topPx,
					page = Math.ceil(tmp/Ph);
					page = page > pages ? pages : page;
				return page;
			
			},
			
			run : function(st){
				def.curPage = this.compare(st);
				//this.setPage(def.curPage = this.compare(st));
				//this.setPadBtn(st);
				if(!loading){
					if(def.curPage >= view.children().length){
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
				var st = this.getScrollTop();
				jqWin.scrollTop(direction === 'next' ? st + padHg - 60 : st - padHg + 60);		
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
				if(browser.mozilla){
					_childs.css({'-moz-transform' : 'scale('+obj.scale+')', 'marginBottom' : obj.mb, 'transformOrigin': '50% 0px 0px'});
				}
				if(browser.chrome || browser.safari){
					_childs.css({'-webkit-transform' : 'scale('+obj.scale+')', 'marginBottom' : obj.mb, 'transformOrigin': '50% 0px 0px'});
				}
				if(browser.opera){
					_childs.css({'-o-transform' : 'scale('+obj.scale+')', 'marginBottom' : obj.mb, 'transformOrigin': '50% 0px 0px'});
				}
				if(browser.msie){
					if(parseInt(browser.version)>8){
						_childs.css({'-ms-transform' : 'scale('+obj.scale+')', 'marginBottom' : obj.mb, 'transformOrigin': '50% 0px 0px'});
					}else{
						_childs.css('zoom' , obj.scale);
					}
				}
				Ph = obj.height;
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
				var p = view.children().length;
				if(pages <= p) return;//已到最后一页
				var url = pageList[p], self = this;			
				loading = true;
				this.createLoading();
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
			
			insert : function(html){
				if(!html){
					html = view.children().eq(0).clone(true);					
				}
				var _html = $(html);
				view.find('#ld').replaceWith(_html);
				//var nh = $(html).appendTo(def.view);
				childs = view.children();
				if(fulling)
					this.setScale({p:'boost', _scale :19, child : _html});
				loading = false;
				this.setPadBtn(this.getScrollTop());
			},
			
			createFull : function(){
				fulling = true;
				var _sl = this.getScrollTop() - topPx;	
				$('body').addClass('fullscreen');			
				this.setView($('#readercontainerfull').append($('#readcontainerparent').html()).find('#pageContain'));
				
				childs = view.children();
				tmpScale = scale;
				this.setScale({p:'boost', _scale :19});
				
				$('#readcontainerparent').html('');
				setTimeout(function(){jqWin.scrollTop(_sl*1.3085)},0);				
			},
			clearFull : function(){	
				fulling = false;
				var _sl = this.getScrollTop() + topPx + 143, readercontainerfull = $('#readercontainerfull');	
				//var _sl = this.getScrollTop();	
				$('body').removeClass('fullscreen');		
				this.setView($('#readcontainerparent').append(readercontainerfull.html()).find('#pageContain'));
				childs = view.children();
				this.setScale({p:'boost', _scale :tmpScale});				
				readercontainerfull.html('');
				setTimeout(function(){jqWin.scrollTop(_sl/1.3085)},0);				
			},
			setView : function(_view){
				view = _view;
			},
			
			displayControl : function(p){//display:none后再取其top得不到正确的值,所以用animate
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
				this.setPadBtn(st);
				//debugger;
				this.displayControl();
			},
			scope : _self
		});
		
		btns.click(function(e){
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
				var v = parseInt($.trim(this.value)), childs = view.children(), total = childs.length;
				if(v > total) this.value = v = total;
				if(v == 0) this.value = v = 1;
				jqWin.scrollTop(childs.eq(v - 1).offset().top+30);
			}
		})
		$('#gotop').css('zIndex',10000);
		$(window).scroll();
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
	
    
})(Gaofen, jQuery, window);