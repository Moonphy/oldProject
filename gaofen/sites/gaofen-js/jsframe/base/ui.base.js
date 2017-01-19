/**
 * @author  xiezhiwen
 * @class  Gaofen.ui.base
 * ui基础类
 */
 
(function(G, $, win){
    
	G.temp = {};

	var Util = G.util,
	
    	T = G.tpl,
    
    	doc = document, 
    	
    	hidCls  = 'hidden', 
    	
    	jqWin = $(window),
    	
    	jqDoc = $(doc);
	
	var ui = G.ui = {
		Base : Util.create()
	};

	var Base = ui.Base;
	
	
	 ui.Base.prototype = {
		
		autoRender : false,
        
        titleNode : '#gf_title',
		
		hidden : true,
		
		clsNode : '#gf_close',
		
        _locked : 0,
		
        // 类初始化入口
        init : function(opt){
            this.cacheId = 'c' + Util.uniqueId();
            opt && $.extend(this, opt);
            // UI初始化入口
            this.initUI();
            
            if(this.autoRender)
                this.getView();
        },
		
		// 接口方法
        initUI : $.noop,
		
		innerViewReady : $.noop,
		
		getReadyView : function(){
			
			return this.view;
		},
		
		getView : function(){
			  var v = this.view;
			  // 未创建
			  if(!v || !v.tagName)
				v = this.createView();
			  // 重写，下载调用时就直接返回结点
			  this.getView = this.getReadyView;
			  if(this.appendTo){
				  if(typeof this.appendTo == 'function')
					  this.appendTo(v);
				  else
					  $(this.appendTo).append(v);
				  delete this.appendTo;
			  }
			  
			  if(this.closeable !== undefined)
				  this.initClsBehave(this.closeable);

			  if(this.actionMgr){
				  this.actionMgr = G.use('Event', this.actionMgr);
				  this.actionMgr.bind( v );
				  if(this.onactiontrig){
					  var self = this;
					  this.actionMgr.addFilter(function(e){
						  return self.onactiontrig(e);
					  });
				  }
			  }
			  
			  // interval method
			  this.innerViewReady(v);
			  

			  this.onViewReady && this.onViewReady(v);
			  
/* 			  if(this.hidden !== undefined){
				  var tmp = this.hidden;
				  this.hidden = undefined;
				  this.play(!tmp);
			  } */
			  return v;			
		},
		
        // 绑定关闭事件
        initClsBehave : function(cls){
            this.jq(this.clsNode).click(Util.bind(this.onClsBtnClick, this));
            this.setCloseable(cls);
        },
		
		/**
         *  设置是否可关闭
         * @param {Boolean} closable
         */
        setCloseable : function(cls){
            this.jq(this.clsNode).cssDisplay(cls);
            this.closeable = cls;
        },
		
        onClsBtnClick : function(){
            this.close(true);
            return false;
        },
		/**
		 * 关闭控件，关闭前触发{@link #onclose}回调，如果开始{@link #destroyOnClose}，关闭后销毁({@link #destroy})该控件
		 */
        close : function(){
            if(!this.onclose || this.onclose() !== false){
                if(this.destroyOnClose)
                    this.destroy();
                else this.play(false);
            }
        },
		
		createView : function(){
            var v = this.view;
            if(typeof v === 'string'){
                v = this.view = T.forNode(T.get(v)||v, this.tplData || this, true);
            }else this.view = v = doc.createElement('DIV');
            return $(v)[0];
        },
		
		setTitle : function(tle){
            this.jq(this.titleNode).html(tle);
            return this;
        },
		
		center : function(){
          var jq  = this.jq(),
              sz  = [jqWin.width(), jqWin.height()],
              dsz = [jq.width(), jq.height()],
              off = (sz[1] - dsz[1]) * 0.8;
          this.view.style.left = Math.max((((sz[0] - dsz[0]) / 2) | 0), 0) + ( this.isFixed && !Util.ie6 ? 0 : jqDoc.scrollLeft() )  + 'px';
          this.view.style.top  = Math.max(off - off/2|0, 0)+  ( this.isFixed && !Util.ie6 ? 0 : jqDoc.scrollTop() ) + 'px';
          return this;
        },
		
		beforeShow : $.noop,
		afterShow : $.noop,
		beforeHide : $.noop,
		afterHide : $.noop,
		
		
		play : function(b){			
            var j = this.jq();
			if(b === undefined)
				return !j.hasClass(hidCls);			
			
			if(this.hidden == false && b) return this;
			
			this.hidden = !b;
		
			if(b){
				j.css('visibility', 'hidden').removeClass(hidCls);
				this.beforeShow();
				j.css('visibility', '');
			
				if( this.contextable && !this.contexted)
					this.setContexted(true);

				this.afterShow();				
			}else{
				var bh = this.beforeHide(); 
				if(bh !== false){
					j.addClass(hidCls);
					this.afterHide(); 
				}
				
			}
			
			
			
			if( this.ie6Iframe && Util.ie6 ){
				var $view = this.jq();
				this.jqIframe = this.getIframe();
				if(!b){
					$view.after(this.jqIframe);
					this.jqIframe.css({
						top:$view.css('top'),
						left:$view.css('left'),
						width:$view.width(),
						height:$view.height(),
						zoom:1
					});
				} else {
					this.jqIframe.remove();
				}
			}
			return this;
			
		},
		
		destroy : function(){
            this.play(false);
            this.jq().remove();
        },
		
		setContexted : function(set){
    		set ? G.use('contextMgr').context(this) : 
    		      G.use('contextMgr').release(this);
        	return this;
        },
		
		jq : function(selector){
            return selector === undefined ? $(this.getView()) : $(this.getView()).find(selector);
        },
		
		ancestorOf :function(a, depth){
            a = a.view || a;
            return Util.ancestorOf(this.view, a, depth);
        },
		
		onContextRelease : function(){
            this.play(false);    
        },
		
		unDomEvent : function(evt, fn, child){
            if(evt === 'mousedown'){
                var wrapper = this._mousedownFns[fn];
                this.jq(child).unbind(evt, wrapper);
                delete this._mousedownFns[fn];
            }else this.jq(child).unbind(evt, fn);
        },
		
		domEvent : function(evt, fn, child){
            if(evt === 'mousedown'){
                var comp = this;
                var wrapper = function(e){
    	           	if(!comp.contexted)
    					X.use('contextMgr').releaseAll(e);
    			    return fn.apply(comp, arguments);
                };
                
                if(!this._mousedownFns)
                    this._mousedownFns = {};
                this._mousedownFns[fn] = wrapper;
                
                this.jq(child).bind(evt, wrapper);
            }else this.jq(child).bind(evt, fn);
        },
		
		getIframe : function(){
			if(!this.jqIframe){
				this.jqIframe = $('<iframe class="shade-iframe" frameborder="0"></iframe>');
				this.jqIframe.css({
					position: 'absolute'
				});
			} 
			return this.jqIframe;
		},
		
		anchor : function(targetEl, pos, prehandler, intoView){
		    var jqT  = $(targetEl), jq = this.jq();
		    var toff = jqT.offset(),
		        tw   = jqT.innerWidth(),
		        th   = jqT.outerHeight(),
		        sw   = jq.outerWidth(),
		        sh   = jq.innerHeight();
		    var pa = pos.charAt(0), pb = pos.charAt(1);

		    var l = toff.left, t = toff.top;
		    switch(pa){
		        case 't' :
		            t-=sh;
		        break;
		        case 'b':
		            t+=th;
		        break;
		        case 'c':
		            t+= Math.floor((th-sh)/2);
		        break;
		    }
		    
		    switch(pb){
		        case 'c' :
		            l+= Math.floor((tw-sw)/2);
		        break;
		        case 'r':
		            l+=tw-sw;
		        break;
		    }
		    
		    if(prehandler){
		        var ret = ret = [l, t];
		        prehandler(ret, sw, sh);
		        l = ret[0];
		        t = ret[1];
		    }
		    // 限制宽在可见范围内
		    if(intoView){
		        if(t<0) t=0;
		        else {
    		        var vph = jqWin.height();
    		        if(t+sh-jqDoc.scrollTop()>vph){
    		            t = vph-sh+jqDoc.scrollTop();
    		        }
		        }
		        if(l<0)
		            l=0;
		        else {
    		        var vpw = jqWin.width();
    		        if(l+sw-jqDoc.scrollLeft()>vpw){
    		            l = vpw-sw+jqDoc.scrollLeft();
    		        }
		        }
		    }
		    
		    jq.css('left', l+'px')
		      .css('top', t+'px');
		},
		
        slide : function(fromto, show, fn, props, duration, easing){
            var jq = this.jq();
				l  = 0, t  = 0,
                w  = jq.width(),
                h  = jq.innerHeight(),
                fl = l,ft = t,tl = l,tt = t,
                jqWr = this.clip();
            var from = fromto.charAt(0), 
                to = fromto.charAt(1);
            switch(from){
                case 'l' :
                    fl = l-w;
                break;
                case 'r':
                    fl = l+w;
                break;
                case 't':
                    ft=t-h;
                break;
                case 'b':
                    ft=t+h;
                break;
            }
            
            switch(to){
                case 'l' :
                    tl = l-w;
                break;
                case 'r':
                    tl = l+w;
                break;
                case 't':
                    tt=t-h;
                break;
                case 'b':
                    tt=t+h;
                break;
            }
            jq.css('left',fl)
              .css('top',ft);
			  
            if(!props) props = {};
            if(tl!=fl){
                props.left = props.left === undefined?tl:props.left + tl;
            }
            if(tt!=ft){
                props.top  = props.top===undefined?tt:props.top+tt;
            }
            if(show)
                jq.css('visibility','');
            var self = this;
            jq.animate(props, duration||'fast', easing , function(){
                if(!show){
                    self.play(false);
                    jq.css('visibility', '');
                }
                setTimeout(function(){
                    self.unclip();
                    fn && fn(self);
                }, 0);
            });
        },
		
		clip : function(){
            if(!Base.CLIP_WRAPPER_CSS){
                Base.CLIP_WRAPPER_CSS = {
                    position:'absolute',
                    clear : 'both',
                    overflow:'hidden'
                };
                Base.CLIPPER_CSS = {
                    position:'absolute',
                    left:0,
                    top:0
                };
            }
            // 防止多次调用时产生多层包裹
            if(!this.jqClipWrapper){
                var jqWrap = $(G.Cache.get('div')),
                    v      = this.getView(),
                    jq     = this.jq(),
                    pNode  = v.parentNode,
                    voff   = jq.offset();
                    
                jqWrap.css(Base.CLIP_WRAPPER_CSS)
                      .css(voff)
                      .css('width', jq.outerWidth()+'px')
                      .css('height', jq.outerHeight()+'px')
                      .css('z-index', jq.css('z-index'))
                      .append(v);
    
                // 保存状态，clip结束恢复
                var tmpCps = this._tmpClipedCss = {};
                for(var k in Base.CLIPPER_CSS){
                    tmpCps[k] = v.style[k];
                }
                jq.css(Base.CLIPPER_CSS);
                
                pNode && jqWrap.appendTo(pNode);
                this.jqClipWrapper = jqWrap;
            }
            return this.jqClipWrapper;
        },
		
		unclip : function(){
            if(this.jqClipWrapper){
                var wr = this.jqClipWrapper[0],
                    wrst = wr.style,
                    jq = this.jq(),
                    st = jq[0].style;
                
                for(var k in Base.CLIP_WRAPPER_CSS)
                    wrst[k] = '';
    
                this.jqClipWrapper
                    .css('overflow','')
                    .css('width','')
                    .css('height','');
                
                var tmpCps = this._tmpClipedCss;
                for(k in tmpCps)
                    st[k] = tmpCps[k];
                delete this._tmpClipedCss;
                
                wr.removeChild(jq[0]);
                if(wr.parentNode)
                    this.jqClipWrapper.replaceWith(jq);
                G.Cache.put('div', wr);
                delete this.jqClipWrapper;
           }
        }
		
		
	};
	
	
	G.reg('base', Base);
		
	
})(Gaofen, jQuery, window);	