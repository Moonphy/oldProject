/**
 * @author   xiezhiwen
 * 各种对话框
 */
(function(G, $, win){
	
	var Util = G.util,
	
	T = G.tpl,

	doc = document, 
	
	hidCls   = 'hidden', 
	
	ui = G.ui,
	
	Base = G.ui.Base,
	
	jqWin = $(window),
	
	jqDoc = $(doc),
	
	// 记录弹出浮层zIndex
    currentZ = 10000;
	
	var PopupKBMonitor = {
		
		layers : [],
		
		hash : {},
		
		keyListeners : 0,
		
		add : function(layer){
			var cid = layer.cacheId;
			if(!this.hash[cid]){
				this.layers.push(layer);
				if(layer.keyEvent){
					if(this.keyListeners === 0){
						//if(__debug) console.log('bind key listener');
						$(doc).bind('keydown', this.getEvtHandler());
					}
					this.keyListeners++;
				}
				this.hash[cid] = true;
		  }
		},
		
		remove : function(layer){
			var cid = layer.cacheId;
			if(this.hash[cid]){
				var ly = this.layers;
				if(ly[ly.length - 1] === layer)
					ly.pop();
			  else Util.arrayRemove(ly, layer);
				
				this.keyListeners--;
				if(this.keyListeners===0){
					if(__debug) console.log('remove key listener');
					$(doc).unbind('keydown', this.getEvtHandler());
				}
				delete this.hash[cid];
		  }
		},
		
		getEvtHandler : function(){
			  var kh = this._onDocKeydown;
			  if( !kh )
				kh = this._onDocKeydown = Util.bind( this.onDocKeydown, this );
			  return kh;
		},
		
		onDocKeydown : function(e){
				var top = this.layers[this.layers.length-1];
				if(top && top.keyEvent)
					return top.onKeydown(e);
		}
	};
	
	
	/**
	 * @class Gaofen.ui.Layer
	 */  
	var Layer = ui.Layer = Util.create(Base, {
		
		/**@cfg {Boolean} autoCenter 当显示或显示后窗口resize时，是否自动居中*/
		
		/**@cfg {Boolean} hidden 默认隐藏*/
		hidden : true,
		
		onViewReady : $.noop,
		
		/**
		 * @cfg {Boolean} frameMask 显示时是否应用IFRAME层作遮罩层，IE6时默认为true，其它浏览器默认false
		 */
		frameMask : Util.ie6,
		
	/**
	 * 手动更新窗口zindex，默认是自动更新。
	 * 当同时显示多个窗口时,调用该方法可使窗口置顶。
	 * 适用于position:absolute, fixed面板。
	 * @see Gaofen.ui.Layer#setCurrentZ
	 */
		trackZIndex : function(z){

		    if(this.z < currentZ || this.z < z || !this.z){
    			currentZ = z ? z : currentZ + 3;
    
    			if(this.mask)
    				$(this.mask).css('z-index', currentZ - 1);
    			
    			if(this.frameMask)
    				$(this.getFrameMask()).css('z-index', currentZ - 2);
    			
    			this.jq().css('z-index', currentZ);
    			this.z = currentZ;
		    }
		},
		
		/**
		 * @cfg {Boolean} keyEvent 是否开启键盘监听，默认true，将处理ESC键。
		 */
		keyEvent : true,
		
		/**
		 * 如果监听浮层按键事件，可重写本方法。默认处理是监听ESC键，当ESC按下时关闭浮层。
		 * @param {DOMEvent} event
		 */
		onKeydown : function(e){
			// esc
			if(e.keyCode === 27 && !this.cancelEscKeyEvent){
				this.close();
				return false;
			}
		},
		
		// override
		beforeShow : function(){
			if(this.mask)
				this._applyMask(true);
			var pos = this.jq().css('position');
			if( pos === 'absolute' || pos === 'fixed' )
				this.trackZIndex();
			PopupKBMonitor.add(this);
			if(this.autoCenter)
				this.center();				
			if(this.size){
				this.setSize();
			}
		},
		
		setSize : function(){
			if(typeof this.size == 'object'){
				this.jq().css(this.size);
			}
		},
		
		
		// override
		afterHide : function(){
			if(this.mask)
				this._applyMask(false);
			PopupKBMonitor.remove(this);
		},
		
		getFrameMask : function(){
			if(this.frameMaskEl)
				return this.frameMaskEl;
			// 因为iframe层比较特殊，较少变动，所以直接写在这里而不必JS HTML模板里。
			this.frameMaskEl = T.forNode('<iframe class="shade-div shade-iframe" frameborder="0"></iframe>');
			return this.frameMaskEl;
		},
		
		/**
		 * @cfg {Boolean} mask 显示时是否应用遮罩层，默认false
		 */
		_applyMask : function(b){
		  var mask = this.mask;
		  if(!mask || mask === true)
			mask = this.mask = T.forNode(T.get('mask'));
		  
		  var wh = jqWin.height();
		  if(b){
			$(mask)
				.height( wh )
				.appendTo(doc.body);
			setTimeout(function(){
				$(mask).addClass('in');
			},1);
			if(this.frameMask)
				$(this.getFrameMask()).height(wh).appendTo(doc.body);
			// window resize event handler
			jqWin.bind('resize', Util.getBind(this, 'onMaskWinResize'));
		  }else {
			$(mask).removeClass('in');
			setTimeout(function(){
				$(mask).remove();
			},200);
			//$(mask).remove();
			if(this.frameMask)
				$(this.getFrameMask()).remove();
			jqWin.unbind('resize', Util.getBind(this, 'onMaskWinResize'));
		  }
		},
		
		onMaskWinResize : function(){
		  var mask = this.mask, wh = jqWin.height();
		  if(mask)
			$(mask).height( wh );
			
			if(this.frameMask)
				$(this.getFrameMask()).height(wh);
		  
		  if(this.autoCenter)
				this.center();
		}
	});

	G.reg('Layer', Layer);
	
	
	/**
	 * @class  Gaofen.ui.Modal
	 */  
	ui.Modal = G.reg('Modal', Util.create(ui.Layer, {
		view : 'modal'
	}));
	
	
	
	 /**
	 * @class  Gaofen.ui.Tip
	 */  
	ui.Tip = G.reg('Tip', Util.create(ui.Modal, {
		
		cs : 'win-fixed',
	/**
	 * @cfg {Boolean} autoHide defaults true
	 */      
		autoHide : true,
	/**
	 * @cfg {Number} timeoutHide defaults to 1000 ms
	 */    
		timeoutHide : 1000,
	/**
	 *  该属性是{@link setShowTimer}延迟显示时设置的超时时间，
	 *  {@link setShowTimer}常用在mouseover时延迟提示的显示，mouseout时清除延迟以提高用户体验。
	 */
		timeoutShow : 200,

	/**
	 * @cfg {Boolean} stayHover stay on mouseover and hide on mouseout, defaults to false
	 */
	 
		stayHover : false,
	/**
	 * @cfg {Number} offX 面板定位时往瞄点X方向的偏移增量，默认25
	 */
		offX : 25,
		
	/**
	 * @cfg {Number} offX 面板定位时往瞄点Y方向的偏移增量，默认-10
	 */
		offY : -10,
		
		// override
		innerViewReady : function(v){
			var jq = this.jq();
			if(this.stayHover){
				jq.hover(
					Util.bind(this.onMouseover, this),
					Util.bind(this.onMouseout, this)
				);
			}
		},
		
		onMouseover : function(){
			this.clearHideTimer();
		},
		
		onMouseout : function(){
			this.setHideTimer();
		},
		
	/**
	 * 清除超时隐藏
	 */
		clearHideTimer : function(){
			if(this.hideTimerId){
				clearTimeout(this.hideTimerId);
				this.hideTimerId = false;
			}
		},
		
		beforeShow : function(){
			if( Layer.prototype.beforeShow.apply(this, arguments) === false )
				return false;
			
			if(this.autoHide)
				this.setHideTimer();
		},

	/**
	 *  设置或清除显示超时。
	 *  该方法是#setHideTimer与clearHideTimer对应延迟显示方法，已集中在一个函数调用。
	 *  常用在mouseover时延迟提示的显示，mouseout时清除延迟，
	 *  可有效防止用户只是掠过鼠标但并非查看时取消显示提示以提高用户体验。
	 * @param {Boolean} set
	 */
		setShowTimer : function(b){
			if(b){
				this.showTimerId = setTimeout(Util.getBind(this, 'onTimerShow'), this.timeoutShow);
			}else if(this.showTimerId){
				clearTimeout(this.showTimerId);
				this.showTimerId = false;
			}
		},
		
	/**
	 * 开始超时隐藏,在指定时间内隐藏
	 */
		setHideTimer : function(){
			this.clearHideTimer();
			this.hideTimerId = setTimeout(Util.getBind(this, 'onTimerHide'), this.timeoutHide);
		},
		
		onTimerHide : function(){
			this.play(false);
			this.clearHideTimer();
		},
		
		onTimerShow : function(){
			this.play(true);
			this.setShowTimer(false);
		}
	}));

	
	/**
	 * @class  Gaofen.ui.Dialog
	 */  
    ui.Dialog = G.reg('Dlg', Util.create(ui.Modal, function(father){
        
        return {            
            
            focusBtnCs : 'btn-s1-light',
            
            //mask : true,
            cs : ' modal-tips',
            
            appendTo : 'body',
            
            title : '标题',
            
            contentHtml: 'AnchorDlgContent',
            
            closeable : true,
            
            // 创建按钮html
            initUI : function(){
                if(this.buttons && !this.buttonHtml){
                    var htmls = [];
                    for(var i=0,btns=this.buttons,len=btns.length;i<len;i++){
                        htmls.push(T.parse(this.buttonTpl || 'button', btns[i]));
                    }
                    this.buttonHtml = htmls.join('');
                }
                father.initUI.call(this);
            },
            
            // override super
            onClsBtnClick : function(){
                if( this.onbuttonclick('cancel') !== false )
                    this.close();
                return false;
            },
            
            /**
             * 聚焦到指定按钮
             * @param {String} buttonId
             */
            setFocus : function(btn){
                if(btn || this.defBtn)
                    this.jq('#gf_btn_' + (btn||this.defBtn)).focus().addClass(this.focusBtnCs);
            },
            
            afterShow : function(){
                father.afterShow.call(this);
                if(this.defBtn)
                    this.setFocus();
            },
            /**
             * @cfg {Function} onbuttonclick 当按钮点击时回调，参数:buttonId
             */
            onbuttonclick : function(eid){
                if(__debug) console.log(eid+' clicked');
            },
        /**
         * 重定义{@link #onbuttonclick}处理
         * @param {Function} handler
         */
            setHandler : function(handler){
                this.onbuttonclick = handler;
                return this;
            },
        /**
         * 获得指定按钮
         * @return {jQuery}
         */
            getButton : function(bid){
                return this.jq('#gf_btn_' +bid);
            },
             
            innerViewReady : function(v){
                father.innerViewReady.call(this, v);
                var w = this;
                $(v).find('#gf_buttons').click(function(e){
                    var btn = Util.domUp(e.target, function(el){
                            return el.id && ( el.id.indexOf('gf_btn_') ===0 );
                        }, this);
                    if(btn){
                        var eid = btn.id.substr('gf_btn_'.length);
                        if( w.buttons ){
                            $.each( w.buttons, function(){

                                if(this.id === eid){
                                    var ret;
                                    if(this.onclick)
                                        ret = this.onclick(w);
                                    
                                    if(ret !== false && w['on'+eid])
                                        ret = w['on'+eid]();
                                        
                                    if(ret !== false)
                                       if( w.onbuttonclick(eid) !== false )
                                        w.close();
                                }
                            });
                        }
                        return false;
                    }
                });
            }
        };
    }));
    
    
	/**
	 * @class  Gaofen.ui.mbox
	 */  
    ui.mbox = G.reg('mbox', {
        /**
         * 获得库中公用对话框实例
         * @return {Gaofen.ui.Dialog}
         */
        getSysBox : function(){
            var w = this.sysBox;
            if(!w){
                w = this.sysBox =  G.use('Dlg', {
                    //对话框默认按钮
                    buttons : [
                      {title: '确&nbsp;定',     id :'ok'},
                      {title: '取&nbsp;消',     id :'cancel'},
                      {title: '&nbsp;是&nbsp;', id :'yes'},
                      {title: '&nbsp;否&nbsp;', id :'no'},
                      {title: '关&nbsp;闭',     id :'close'}
                    ],
                    
                    /***/
                    setContent : function(html){
                        this.jq('#fwbody p:eq(0)').html(html);
                    },

                    setIcon : function(icon){
                        var jq = w.jq('#icon_cls');
                        jq.attr('class', jq.attr('class').replace(/alert\-\S+/i, 'alert-'+icon));
                    },                  
                    
                    afterHide : function(){
                        ui.Dialog.prototype.afterHide.call(this);
                        // 复原callback
                        this.onbuttonclick = ui.Dialog.prototype.onbuttonclick;
                    }
                });
            }
            return w;
        },
        /**
         * 获得库中公用提示框实例
         * @return {Gaofen.ui.Tip}
         */
        getTipBox : function(){
            var w = this.tipBox;
            if(!w){
                w = this.tipBox = G.use('Tip', {
                    cs : 'modal-tips win-fixed',
                    appendTo:doc.body,
                    //title:'提示',
                    timeoutHide:1200,

                    setContent : function(html){
                        this.jq('#gfbody').html(html);
                    },
                    
                    setIcon : function(icon){

                    },
                    
                    afterHide : function(){
                        ui.Tip.prototype.afterHide.call(this);
                        // 复原callback
                        if(this.onhide){
                            this.onhide();
                            this.onhide = false;
                        }
                    }
                });
            }
            return w;
        },
        /**
         * 获得库中公用定向弹出框实例
         * @return {Gaofen.ui.Dialog}
         */
        getAnchorDlg : function(){
            var w = this._anchorDlg;
            if(!w){
                w = this._anchorDlg = G.use('Dlg', {
                    defBtn:'ok',
                    title : '',
                    cs : 'win-fixed win-tips-ask',
                    buttons : [
                      {title: '确&nbsp;定',     id :'ok'},
                      {title: '取&nbsp;消',     id :'cancel'}
                    ],
                    setAnchor : function(anchorElem){
                        this.anchorEl = anchorElem;
                        return this;
                    },
                    
                    //onbuttonclick : function(){},
                    
                    beforeShow : function(){
                        ui.Dialog.prototype.beforeShow.call(this);
                        if(this.anchorEl){
                            this.anchor(this.anchorEl, 'tc', function(ret, sw, sh){
                                ret[1]-=2;
                            });
                            var self = this;
                            this.slide('bc',true, function(){
                                ui.Dialog.prototype.afterShow.call(self);
                            });
                        }
                    },
                    
                    // 置为空，在效果完成后再调用父类afterShow
                    afterShow : $.noop,
                    
                    beforeHide : function(){
                        if(this.anchorEl){
                            this.slide('cb',false);
                            delete this.anchorEl;
                            return false;
                        }else ui.Dialog.prototype.beforeHide.call(this);
                    },
                    
                    afterHide : function(){
                        ui.Dialog.prototype.afterHide.call(this);
                        // 复原callback
                        this.onbuttonclick = ui.Dialog.prototype.onbuttonclick;
                    }
                });
            }
            return w;
        },
        /**
         * 获得库中公用定向提示框实例
         * @return {Gaofen.ui.Dialog}
         */
        getAnchorTip : function(){
            var w = this._anchorTip;
            if(!w){
                w = this._anchorTip = G.use('Tip', {
                    cs:'operate-success',
                    contentHtml:'<div>内容</div>', 
                    appendTo:doc.body,
                    timeoutHide:1800,
                    setAnchor : function(anchorElem){
                        this.anchorEl = anchorElem;
                        return this;
                    },
                    
                    beforeShow : function(){
                        if(this.anchorEl){
                            this.anchor(this.anchorEl, 'tc', function(ret, sw, sh){
                                ret[1]-=8;
                            });
                            this.slide('bc',true);
                        }
                        ui.Tip.prototype.beforeShow.call(this);
                    },
                    
                    beforeHide : function(){
                        if(this.anchorEl){
                            this.slide('cb',false);
                            delete this.anchorEl;
                            return false;
                        }else ui.Tip.prototype.beforeHide.call(this);
                    },
                    
                    afterHide : function(){
                        ui.Tip.prototype.afterHide.call(this);
                        // 复原callback
                        if(this.onhide){
                            this.onhide();
                            this.onhide = false;
                        }
                    }
                });
            }
            
            return w;
        },
        /**
         * @param {String} message
         * @param {Function} callback
         */
        tipError : function(msg, fn){ this.tip(msg, 'error', fn); },
        /**
         * @param {String} message
         * @param {Function} callback
         */
        tipOk : function(msg, fn){ this.tip(msg, 'success', fn); },
        /**
         * @param {String} message
         * @param {Function} callback
         */
        tipWarn : function(msg, fn){ this.tip(msg, 'alert', fn); },
        /**
         * @param {HTMLElement} anchorElement
         * @param {String} message
         * @param {Function} callback
         */
        anchorTipOk : function(elem, msg, fn){ this.anchorTip(elem, msg,'',fn); },
        /**
         * @param {HTMLElement} anchorElement
         * @param {String} message
         * @param {Function} callback
         */
        anchorConfirm : function(elem, msg, fn){
            var dlg = this.getAnchorDlg();
            dlg.setTitle(msg)
               .setHandler(fn||$.noop)
               .setAnchor(elem)
               .play(true);
        },
        /**
         * @param {String} message
         * @param {String} icon
         * @param {Function} callback
         */
        tip : function(msg, icon, fn){
            var tip = this.getTipBox();
            tip.setIcon(icon||'alert');
            tip.setContent(msg||'');
            tip.play(true);
            fn && (tip.onhide = fn);
        },
        /**
         * @param {HTMLElement} anchorElement
         * @param {String} message
         * @param {String} icon
         * @param {Function} callback
         */
        anchorTip : function(anchorElem, msg, icon, fn){
            var tip = this.getAnchorTip();
            tip.setTitle(msg)
               .setAnchor(anchorElem)
               .play(true);
            fn && (tip.onhide = fn);
        },
        /**
         * @param {String} title
         * @param {String} message
         * @param {Function} [callback]
         * @param {String} [buttons]
         * @param {String} [icon]
         * @param {String} [defaultButton]
         */
        alert : function(title, msg, callback, buttons, icon, def){
            var w = this.getSysBox(), btns = w.buttons, len = btns.length;
            if(!buttons)
                def = buttons = 'ok';
            if(!icon)
                icon = 'info';
			$.each(btns, function(){
				w.jq('#gf_btn_'+this.id).cssDisplay(buttons.indexOf( this.id ) >= 0);
			});
            //for(var i=0;i<len;i++){
            //    w.jq('#gf_btn_'+btns[i].id).cssDisplay(buttons.indexOf( btns[i].id ) >= 0);
            //}
            w.defBtn = def;
            title && w.setTitle(title);
            msg   && w.setContent(msg);
            icon  && w.setIcon(icon);
            callback && (w.onbuttonclick = callback);
            w.play(true);
            return w;
        },
        /**
         * @param {String} title
         * @param {String} message
         * @param {Function} [callback]
         * @param {String} defaultButton
         */
        confirm : function(title, msg, callback, def){
            this.alert(title || '提示', msg, callback, 'ok|cancel', 'ask', def||'ok');
        },
        /**
         * @param {String} title
         * @param {String} message
         * @param {Function} [callback]
         * @param {String} defaultButton
         */
        success : function(title, msg, callback, buttons, def){
            this.alert(title, msg, callback, buttons || 'ok', 'success', def||'ok');
        },
        /**
         * @param {String} title
         * @param {String} message
         * @param {Function} [callback]
         * @param {String} defaultButton
         */
        error  : function(title, msg, callback, buttons, def){
            this.alert(title, msg, callback, buttons || 'ok', 'error', def||'ok');
        }
    })
    
    
})(Gaofen, jQuery, window);	