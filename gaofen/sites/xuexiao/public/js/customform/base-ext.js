/**
 * Created by zhiwen on 2015-5-28.
 */
"use strict";
(function(jq, win, G){

	var doc = document, 
		_uid = 0;


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
			},
	});

	$.extend(G, {
		_cls : {},
		/**
		 * 为指定类或对象注册一个短命名标识，便于在其它地方通过{@link use}方法返回该类实例或该对象。<br/>
		 * @param {String} shortcut 标识，即该类的缩略名
		 * @param {Function|Object} target 类或对象
		 * @param {Boolean} [override] 默认如果已存在同名对象会抛出异常，但通过设置本标记可强制重定义类
		 * @return clazz
		 */
		reg : function(n, cls, override){
			if(this._cls[n] !== undefined && !override){
				if(__debug) console.trace();
				throw 'had' + n;
			}
			this._cls[n] = cls;
			return cls;
		},
		
		/**
		 * 使用短名类，可以将某个类或类实例通过{@link #reg}方法放到Xwb对象缓存中，
		 * 在任何地方调用本方法获得已缓存对象。
		 * @param {Object} name 根据键查找缓存对象
		 * @param {Object} [config] 假如缓存值为一个类(Function)，以config为参数实例化该类
		 * @return {Object} 如果缓存的是一个类(Function)，返回该类实例，否则直接返回缓存对象
		 */
		use : function(n){
			// instance( type, config )
			var cls = this._cls[n];
			if (cls) {
				// object only
				if(typeof cls === 'object')
					return cls;
				// instance class
				var cfg = arguments[1];
				if( typeof cfg === 'function' )
					return new cls(cfg(cls.prototype));
				return new cls(cfg);
			}
			return null;
		}
			
	});

	/**
	 * @class Gaofen.util
	 * 实用函数集
	 * @singleton
	 */
	var Util = $.extend(G.util, {

		clone : function(obj) {
			if (typeof (obj) != 'object')
				return obj;

			var re = {};
			if (obj.constructor==Array)
				re = [];

			for ( var i in obj) {
				re[i] = Util.clone(obj[i]);
			}

			return re;

		},

		/**
		 * @param {String} [namespace] 名称，包含命名空间，可选
		 * @param {Function} superclass 父类，无父类可置空
		 * @param {Object} attributes 类(原型)属性，方法集
		 * @return {Function} 新类
		*/
	    create : function(){
            var clazz = (function() {
                this.init.apply(this, arguments);
            });
        
            if (arguments.length === 0)
                return clazz;
        
            var absObj, base, type, ags = $.makeArray( arguments );
        
            if (typeof ags[0] === 'string') {
                type = ags[0];
                base = ags[1];
                ags.shift();
            } else base = ags[0];
          
            ags.shift();
        
            if (base)
                base = base.prototype;
          
            if (base) {
                var Bridge = function(){};
                Bridge.prototype = base;
                clazz.prototype = absObj = new Bridge();
            }
        
            if (type) {
                absObj.type = type;
                // Util.ns(type, clazz);
            }
          
            for(var i=0,len=ags.length;i<len;i++)
                absObj = $.extend(absObj, typeof ags[i] === 'function' ? ags[i]( base ):ags[i]);
          
          
            //属性加base   
            clazz.prototype.uber = function(){
                var args = arguments;
                if(args.length == 0 ) return ;  
                var name = args[0], base = this['base'];
                if(base && base[name]){
                    base[name].apply(this, args);
                    var _cs = base['uber'];
                        if(_cs)
                            _cs.apply(base, args);
                        else return;
                }
            };
            absObj.base = base;
            absObj.constructor = clazz;
            return clazz;
		},

		/**
		 *  返回运行时唯一ID
		 * @return {Number}
		 */
		uniqueId : function(){
			return ++_uid;
		},

		createFieldId : function(){
        	var code = [], codeLength = 5,//验证码的长度   
       		selectChar = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];//所有候选组成验证码的字符，当然也可以用中文的             
	        for(var i=0;i<codeLength;i++){    
	       		var charIndex = Math.floor(Math.random()*36);   
	       		code.push(selectChar[charIndex]);    
	        }   
        	return 'field_'+code.join('');
        }


	})


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

		  // if(this.actionMgr){
			 //  this.actionMgr = G.use('Event', this.actionMgr);
			 //  this.actionMgr.bind( v );
			 //  if(this.onactiontrig){
				//   var self = this;
				//   this.actionMgr.addFilter(function(e){
				// 	  return self.onactiontrig(e);
				//   });
			 //  }
		  // }
		  
		  // interval method
		    this.innerViewReady(v);
		  

		    this.onViewReady && this.onViewReady(v);
		  
		    return v;					
		},

		createView : function(){
            var v = this.view;
            if(typeof v === 'string'){
                v = this.view = $(G.util.parse(G.tpls.get(v)||v, this.tplData || this, true)).get(0);
            }else this.view = v = doc.createElement('DIV');
            return $(v)[0];
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

        jq : function(){
        	return $(this.view);
        }
	}

	G.reg('base', Base);

	ui.fieldComponent = Util.create(Base, {
		isCreate : true,//新建or修改
		field_id : false,
		field_type : false,
		autoRender : true,
		canDel : true,//是否允许删除
		canCopy : true,//是否允许复制
		presence : '',//必填
		number : '',//不能和已有数据重复
		tips_value : '',//提示文案
		editingcs : 'editing',
		appendTo : '#fields_area',
		getSideBarData : $.noop,
		getBaseOpt : function(){
			var obj = {};
			$.each(this, function(key, item){
				if($.type(item) !== 'function' && key !== 'base'){
					obj[key] = item;
				}
			})
			return obj;
		},
		isActive : function(){
			return this.jq().hasClass(this.editingcs);
		},
		setActive : function(p){
			this.jq()[(p === false || p === 0) ? 'removeClass' : 'addClass'](this.editingcs);
		},
		setError : function(msg){
			if(msg){
				this.jq().find('.error-message').removeClass('hidden').find('span').text(msg);
			}else{
				this.jq().find('.error-message').addClass('hidden');
			}
		},
		bindVil : function(){
			var view  = this.jq(), self = this;
			if(this.isInputText()){
				if(this.presence || this.number){
					view.find('input,textarea').on('blur', function(e){
						if(self.presence && self.isPresenceVil()){
							self.number && self.isNumber();
						}
					});
				}
			}
		},
		isInputText : function(){
			return $.inArray(this.type, ['single_line_text','paragraph_text','phone_text','phone_mobile_text','email_text','code_text','date_text']) > -1;
		},
		isPresenceVil : function(){
			if(!this.presence) return true;
			if(this.isInputText()){
				if(this.getIptVal() === ''){
					this.setError(this.nullmsg || '请输入内容');
					return false;
				}else{
					this.setError();
					return true;
				}
			}else if(this.type === 'single_choice_text' || this.type === 'multiple_choice_text' ){
				if(this.jq().find('input[type="radio"]:checked').length||this.jq().find('input[type="checkbox"]:checked').length){
					this.setError();
					return true;
				}else{
					this.setError('请选择');
					return false;
				}
			}else if(this.type === 'drop_down_text'){
				var sels = this.jq().find('select'), seled = true;
				sels.each(function(i, item){
					if($(this).val() === '' ||$(this).val() === '请选择') seled = false;
				});
				this.setError(seled ? '' : '请选择');
				return seled;
			}

		},

		isNumber : function(){
			if(!this.isInputText() || !this.number) return true;
			if( /^[0-9]*$/im.test(this.getIptVal())){
				this.setError();
				return true;
			}else{
				this.setError('请填写数字');
				return false;
			}
		},
		getIptVal : function(){
			var view  = this.jq(), ipt = view.find('input');
			if(ipt.length === 0){
				return  $.trim(view.find('textarea').val());
			}
			return $.trim(ipt.val());
		},

		isNullVil : function(e){
			// if($.inArray(this.type, ['single_line_text','paragraph_text','phone_text','phone_mobile_text']) > -1)
				return (this.isPresenceVil() && this.isNumber());
			// else if(this.type === 'single_choice_text'){//单选
			// 	// if()
			// }
		},
		getVrel : function(presence, number){
			var vrel = '';
			presence = presence || this.presence;
			number = number || this.number;
			if(presence){
				vrel = '_f|ne=m:请填写内容';
			}
			if(number){
				vrel = '_f|number=m:请输入数字';
			}

			if(presence && number){
				vrel = '_f|ne=m:请填写内容|number=m:请输入数字';
			}

			return vrel;
		},
		innerViewReady : function(){
			var self = this;
			//响应点击部件
			G.on('field-active', function(opt){
				if(opt.field_id === self.field_id){
					if(!self.isActive()){
						self.setActive();
						//通知sidebar当前选中对象
						if(self.field_type !== 'code_text')	
							G.fire('field-active-side', {
								id : self.field_id,
								targetDom : self.jq(),
								type : self.field_type,
								data :self.getSideBarData()
							});
						else
							G.fire('nosidebar');
					}
				}else{
					self.setActive(false);
				}
			});
			//响应校验部分
			G.on('sidebar-checkbox-click', function(opt){
				if(opt.id === self.field_id){
					self[opt.name] = opt.v;
				}
			});

			G.on('sidebar_text_ipt_blur', function(e){
				if(self.field_id === e.id){
					var targetDom = e.targetDom, type = e.type, v = e.v;
					if(type === 'title'){
						self.jq().find('#title_txt').text(v === '' ? '未命名' : v);
					}else if(type === 'tips-textarea'){
						self.jq().find('div.help-block').html(v);
						self.tips_value = v;
					}else if(type === 'default'){
						var jqDef = self.jq().find('input[name="default_value"]');
						if(jqDef.length){
							jqDef.val(v);
						}else{
							self.jq().find('textarea[name="default_value"]').text(v);
						}
					}
				}
			});

			if(this.canDel !== true){//不否允许删除
				this.jq().find('div.actions i.fa-trash').remove();
			}

			if(this.canCopy !== true){//不否允许复制
				this.jq().find('div.actions i.fa-copy').remove();
			}
		}
	});

	G.reg('fieldComponent', ui.fieldComponent);


})($, window, Gaofen);