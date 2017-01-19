/*!
 * Gaofen JavaScript Library v1.0
 * http://www.gaofen.com/
 * Date: 2013/5/7 15:00:00
 */
 
 
/**
 * @author  xiezhiwen
 * @class Gaofen
 * Gaofen命名空间根目录。
 */

if(typeof Gaofen === 'undefined') 
	Gaofen = {};
(function(G, $, win){
	var _uid = 0;

	/**
	 * @class Gaofen.util
	 * 实用函数集
	 * @singleton
	 */
	var Util = G.util = {

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
                function Bridge(){};
                Bridge.prototype = base;
                clazz.prototype = absObj = new Bridge();
            }
        
            if (type) {
                absObj.type = type;
                Util.ns(type, clazz);
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
		}
		
		,ns : function(ns, v){
			var routes = ns.split('.'),p=win,key;
			for(var k=0,len=routes.length - 1;k<len;k++){
				key = routes[k];
				if(!p[key])
					p[key] = {};
				p = p[key];
			}
			p[routes[k]] = v;
		}
		
		,parseKnV : function(strRel){
			var map = {}, kv, kvs = this.split(strRel||'', ',');
			try {
				for( var i=0,len=kvs.length;i<len;i++){
					// if not contains ':'
					// set k = true
					if(kvs[i].indexOf(':') === -1){
						map[kvs[i]] = true;
					}else {
						// split : to k and v
						kv = Util.split(kvs[i], ':');
						// escape value
						map[kv[0]] = kv[1];
					}
				}
			}catch(e) { 
				if(__debug) console.trace();
				throw 'Syntax Error:rel字符串格式出错。' + strRel; 
			}
		
			return map;
		}
		
		,split : function(str, splitChar, escChar){
			var c, arr = [], tmp = [];
			if(!escChar)
				escChar = '\\';
		
			for(var i=0,len=str.length;i<len;i++){
				c = str.charAt(i);
				if(c === splitChar){
					arr.push(tmp.join(''));
					tmp.length = 0;
					continue;
				}
				else if(c === escChar && str.charAt(i+1) === splitChar){
					c = splitChar;
					i++;
				}
				tmp[tmp.length] = c;
			}
			if(tmp.length)
				arr.push(tmp.join(''));
			return arr;
		}
		
		,arrayRemove : function(arr, idx){
			arr.splice(idx, 1)[0];
		}
		
		/**
		 * 往URL追加提交参数
		 * @param {String} url
		 * @param {Object|String} param
		 * @return {String}
		 */
		,appendParam : function(url, param){
			var qs = typeof param !== 'string' ? this.queryString(param):param;
			return url + ( url.indexOf('?') !== -1 ? '&'+qs : '?'+qs );
		}
		
		,queryString : function(obj) {
            if(!obj)
                return '';
            var arr = [];
            for(var k in obj){
                var ov = obj[k], k = encodeURIComponent(k);
                var type = typeof ov;
                if(type === 'undefined'){
                    arr.push(k, "=&");
                }else if(type != "function" && type != "object"){
                    arr.push(k, "=", encodeURIComponent(ov), "&");
                }else if(ov instanceof Array){
                    if (ov.length) {
                        for(var i = 0, len = ov.length; i < len; i++) {
                            arr.push(k, "=", encodeURIComponent(ov[i] === undefined ? '' : ov[i]), "&");
                        }
                    } else {
                        arr.push(k, "=&");
                    }
                }else if(type === 'object'){
                    // 例如"extra_params":{"interview_id":"27"}形式
                    for(var kk in ov){
                        arr.push(k,'[',kk,']','=', encodeURIComponent(ov[kk]),'&');
                    }
                }
            }
            arr.pop();
            return arr.join("");
        }
		
		,domUp : function(el, selector, end){
			end = end || doc.body;
			var isStr = typeof selector === 'string';
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
		
		/**
		 * 转义文本中的HTML字符
		 * @param {String} html
		 * @return {String} escapedHtml
		 */
		,escapeHtml : function(html){
			return html?html.replace(/</g, '&lt;').replace(/>/g, '&gt;'):'';
		}
		
		/**
		 * 验证邮箱
		 * @param {String} txt
		 * @return {boolean} 
		 */
		,isEmail : function(txt){
			return /.+@.+\.[a-zA-Z]{2,4}$/.test(txt);
		}
		
		/**
		 * 非法字符
		 * @param {String} txt
		 * @return {boolea} 
		 */
		,isIllegalChar : function(txt){
			return /[`~!#$%^&*()_+<>?:"{},\/;'[\]]/im.test(txt);		
		}
		
		/**
		 * 中文字符
		 * @param {String} txt
		 * @return {boolea} 
		 */
		,isChineseChar : function(txt){
			return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(txt);		
		}
		
		/**
		 * 全角符号
		 * @param {String} txt
		 * @return {boolea} 
		 */
		,isFullwidthChar : function(txt){
			return /[\uFF00-\uFFEF]/.test(txt);		
		}
		
		
		/**
		 *  返回占用字节长度（一个字两个字节）
		 * @param {String} text
		 * @return {Number}
		 */
		,byteLen : function(text){
			var len = text.length;
			var matcher = text.match(/[^\x00-\xff]/g);
			if(matcher)
				len += matcher.length;
			return len;
		}
		
		/**
		 * 以字节为长度计算单位截取字符串，一个字两个字节
		 * @param {String} text
		 * @param {Number} length
		 * @return {String} cutString
		 */
		,byteCut : function(str, length) {
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
		}
		
		/**
		 *  返回运行时唯一ID
		 * @return {Number}
		 */
		,uniqueId : function(){
			return ++_uid;
		}
		
		,bind : function(fn, scope){
          return function() {
              return fn.apply(scope, arguments);
          };
        }
		
		,getBind : function(obj, funcName){
			var k = '_gf_'+funcName;
			var m = obj[k];
			if(!m)
			   m = obj[k] = Util.bind(obj[funcName], obj);
			return m;
		}
		
		,ancestorOf :function(v, a, depth){
			  if (v.contains && !$.browser.webkit) {
				 return v.contains(a);
			  }else if (v.compareDocumentPosition) {
				 return !!(v.compareDocumentPosition(a) & 16);
			  }
			
			  if(depth === undefined)
				depth = 65535;
			  var p = a.parentNode, bd = doc.body;
			  while(p!= bd && depth>0 && p !== null){
				if(p == v)
				  return true;
				p = p.parentNode;
				depth--;
			  }
			  return false;
		}
		
		,arrayRemove : function(arr, idx){
			arr.splice(idx, 1)[0];
		}
		
		/**
		 *  等比例缩放图片
		 *  @param {String|Object} img 可以是图片地址也可以是图片的dom对象
		 *  @param {String} FitWidth 最大宽度
		 *  @param {String} FitHeight 最大高度
		 *  @param {function} fn 回调
		 */ 
		,drawImage : function(obj,FitWidth,FitHeight,fn){ 
			var image = new Image(), rw, rh, isObj = typeof(obj) == 'object';		
			function loaded(_image){
				if(_image) image = _image;	
				if(image.width>0 && image.height>0){ 
					var realwh = Util.getRealSize(image.width, image.height, FitWidth, FitHeight);
					if(isObj){
						obj.width = realwh[0];
						obj.height = realwh[1];
					}
					fn && fn({width : realwh[0], height : realwh[1]});
				}
			}		

			if(isObj) loaded(image);
            $(image).load(function(){
                loaded(); 
            });
            //src = isObj ? obj.src : obj; 
		}
		
		//已知图片高宽等比取大小
		,getRealSize : function(ow, oh, FitWidth, FitHeight){
			var rw, rh;
			if(ow/oh>= FitWidth/FitHeight){ 
				if(ow>FitWidth){ 
					rw=FitWidth; 
					rh=(oh*FitWidth)/ow; 
				}else{ 
					rw=ow; 
					rh=oh; 
				} 
			}else{ 
				if(oh>FitHeight){ 
					rh=FitHeight; 
					rw=(ow*FitHeight)/oh; 
				}else{ 
					rw=ow; 
					rh=oh; 
				} 
			}
			
			return [rw, rh];
		}
	};
	
	
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
	
	
	if ( $.browser.msie && $.trim($.browser.version) == "6.0" ){
		Util.ie6 = true;
	}	

	
	var tplRegIf = /\[\?(!?)\.([\w_$]+?)(\.[\w_$]+)?\?([\S\s]*?)\?\]/g,
	tplReg   = /\{(\.?[\w_|$]+)(\.[\w_$]+)?\}/g;

	var T = G.tpl = {
		// 模板html缓存
		tpls:{},
		
		//修改器
		//用于parse时，
		modifiers : {
			//XSS过滤
			escape : function(v) {
				return Util.escapeHtml(v);
			}
		},
		
	/**
	 * 键查找过程：模板 --> 对象 --> 模板
	 * @param {String} htmls 模板字符串
	 * @param {Object} map 值键对
	 */    
		parse : function(htmls, map){
			if(!map)
				map = {};
			if(htmls.charAt(0) !== '<'){
				var tmp = T.tpls[htmls];
				if(tmp) 
					htmls = tmp;
			}
			
			// [?test?<img src="{src}">],当test置值时应用内容部份
			// example : [?right?output value {right}?]the left
			htmls = htmls.replace(tplRegIf, function(s, s0, s1, s2 , s3){
				var v = map[s1];
				if(s2 && s2.charAt(0) === '.' && v){
					v = v[s2.substr(1)];
				}
				if(s0 === '!')
					return !v ? s3:'';
		
				return !v ? '' : s3;
			});
			
			return htmls.replace(tplReg, function(s, k , k1){
				var v, modfs, k_str, key;
				// "." 字符
				if (k.charCodeAt(0) === 46)  {
					k_str = k.substr(1);
					modfs = k_str.split('|');
					key = modfs.shift();
					v = map[key];
				} else {
					//内嵌模板
					v = T.tpls[k];
				}
				
				if(v === undefined || v === null)
					return '';
					
				if(k1 && k1.charAt(0) === '.' && k.charAt(0) === '.') v = v[k1.substr(1)];
				
				if(v === undefined || v === null)
					return '';
				
				//检查是否有修改器
				if (modfs && modfs.length) {
					var fn;
					$.each(modfs, function(i, f){
						fn = T.modifiers[f];
						if (!fn) return;
						v = fn(v);
					});
					
				} else {
					// html text
					if(v.toString().charAt(0) === '<') {
						return T.parse(v, map);
					}
				
					// key of Tpl?
					if(T.tpls[v])
						return T.parse(T.tpls[v], map);
				}

				return v;
			});
		},
	   /**
		* 根据html模板创建HTML元素
		<pre>
			<code>
				var iframeElement = forNode(
				  '&lt;{tag} class="{cls}" frameBorder="no" scrolling="auto" hideFocus=""&gt;&lt;/iframe&gt;',
				  {tag:'iframe', cls:'ui-frame'}
				);
			</code>
		</pre>
		* @param {String} htmls
		* @param {Object|Array} map
		* @return {HTMLElement}
		*/
		forNode : function(htmls, map){
			if(map)
				htmls = this.parse(htmls, map);
			return $(htmls).get(0);
		},
		/**
		 *  根据模板名称获得模板字符串。
		 * @param {String} templateName
		 * @return {String}
		 */
		get : function(type){
			var tpl = this.tpls[type];
			return $.isArray(tpl) ? tpl.join(''): tpl;
		},
		/**
		 * 注册HTML模板
		 * @param {Object} htmlTemplateMap
		 */
		reg : function(map){
			$.extend(this.tpls, map);
		}
		
	};
	
	
	/**
	 * @class Gaofen.ex
	 */
	G.ex = {};
	
	
	/**
	 * @class Gaofen.Cache
	 * 缓存类，可以将一些常用重用的数据纳入本类管理。<br/>
	 * 内部数据结构为:<br>
	 * <pre>
	 * // 数据直接放在类下，名称不要与方法冲突了哦！
	 * Cache[key] = [dataObjectArray||null, generator];
	 * dataObjectArray[0] = 预留位,保存该key数据最大缓存个数, 默认为3.
	 * generator = 生成数据回调
	 * </pre>
	 * @singleton
	 */
	var Cache = G.Cache = {

		/**@cfg {Number} MAX_ITEM_SIZE 对每个类别设置的最大缓存数量，默认为3.*/
		MAX_ITEM_SIZE: 3,

	/**
	 * 注册数据产生方式回调函数,可重复赋值,函数返回键对应的数据.
	 * @param {Object} key
	 * @param {Function} callback
	 * @param {Number} [max] 缓存该数据的最大值
	 */
		reg: function(k, callback, max) {
		   if(!this[k])
			this[k] = [null, callback];
		   else this[k][1] = callback;

		   if(max !== undefined)
			this.sizeFor(k, max);
		},
	/**
	 * 根据键获得对应的缓存数据.
	 * @param {String} key
	 * @return {Object}
	 */
		get: function(k) {
			var a = this[k];
			if(a === undefined)
				return null;
			var b = a[1];
			a = a[0];

			if(a === null){
			  return b();
			}
			//0位预留
			if(a.length > 1)
				return a.pop();
			if(b)
				return b();

			return null;
		},
	/**
	 * 缓存键值数据.
	 * @param {Object} key
	 * @param {Object} value
	 */
		put: function(k, v) {
			var a = this[k];
			if(!a){
				this[k] = a = [[this.MAX_ITEM_SIZE, v]];
				return;
			}
			var c = a[0];
			if(!c)
			  a[0] = c = [this.MAX_ITEM_SIZE];

			if (c.length - 1 >= c[0]) {
				return ;
			}

			c.push(v);
		},

	/**
	 * 移除缓存.
	 * @param {Object} key 键值
	 */
		remove : function(k){
		  var a = this[k];
		  if(a){
			delete this[k];
		  }
		},
	/**
	 * 设置指定键值缓存数据的最大值.
	 * @param {Object} key
	 * @param {Number} max
	 */
		sizeFor : function( k, max ) {
			var a = this[k];
			if(!a)
			  this[k] = a = [[]];
			if(!a[0])
			  a[0] = [];
			a[0][0] = max;
		}
	};

	/**
	 * 缓存DIV结点.
	 * <pre><code>
	   var divNode = Gaofen.Cache.get('div');
	 * </code></pre>
	 * @property div
	 * @type DOMElement
	 */
	Cache.reg('div', function() {
		return document.createElement('DIV');
	});
	

})(Gaofen, jQuery, window);