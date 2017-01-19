/**
 * Created by zhiwen on 2014-9-19.
 */
"use strict";
(function(jq, win){

    var u = navigator.userAgent, app = navigator.appVersion,
	    isMoblie = !!u.match(/AppleWebKit.*Mobile.*/),
	    eventType = isMoblie ? 'tap' : 'click', touchEvent = 'touchend';

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
		}
	});

    var Gaofen = {

    	eventType : eventType,

    	//广播事件
    	on : function(name, fn){
    		Gaofen.actions.reg('self_'+name, fn);
    		return this;
    	},

    	fire : function(name, params){
    		var fns = Gaofen.actions.get('self_'+name);
    		if(fns){
    			if($.type(fns) === 'array'){
    				$.each(fns, function(i, fn){
    					fn(params);
    				})
    			}else{
    				fns(params);
    			}
    			//return Gaofen.actions.get('self_'+name)(params);
    		}else{
    			//console || console.log('no event');
    		}
    	},
		
		util : {
			bind : function(fn, scope){
	          return function() {
	              return fn.apply(scope, arguments);
	          };
	        },
			parse : function(htmls, map){
				if(htmls){
					var tplReg =  /\{(\.?[\w_|$]+)(\.[\w_$]+)?\}/g;
					return htmls.replace(tplReg, function(s, k , k1){
						var v, modfs, k_str, key;
						if (k.charCodeAt(0) === 46)  {
							k_str = k.substr(1);
							modfs = k_str.split('|');
							key = modfs.shift();
							v = map[key] === undefined? '' : map[key];
						}
						return v;
					});
				}else
					return '';
			},
			parseKnV : function(strRel){
				var map = {}, kv, kvs = strRel.split(',');
				try {
					for( var i=0,len=kvs.length;i<len;i++){
						// if not contains ':'
						// set k = true
						if(kvs[i].indexOf(':') === -1){
							map[kvs[i]] = true;
						}else {
							// split : to k and v
							kv = kvs[i].split(':');
							// escape value
							map[kv[0]] = kv[1];
						}
					}
				}catch(e) { 
					throw 'Syntax Error:rel字符串格式出错。' + strRel; 
				}
			
				return map;
			}
			
			,isEmail : function(txt){
				return /.+@.+\.[a-zA-Z]{2,4}$/.test(txt);
			}			
			
			,byteLen : function(text){
				var len = text.length;
				var matcher = text.match(/[^\x00-\xff]/g);
				if(matcher)
					len += matcher.length;
				return len;
			},
			
			drawImage : function(obj,FitWidth,FitHeight,fn){ 
				var image = new Image(), rw, rh, isObj = typeof(obj) == 'object';		
				function loaded(_image){
					if(_image) image = _image;	
					if(image.width>0 && image.height>0){ 
						var realwh = Gaofen.util.getRealSize(image.width, image.height, FitWidth, FitHeight);
						if(isObj){
							obj.width = realwh[0];
							obj.height = realwh[1];
						}
						fn && fn({width : realwh[0], height : realwh[1]});
					}
				}		
				if(isObj && obj.complete) loaded(obj);
				else{


		            $(image).load(function(){
		                loaded(); 
		            });
		            image.src = obj;

	        	}
	            //src = isObj ? obj.src : obj; 
			},

			//已知图片高宽等比取大小
			getRealSize : function(ow, oh, FitWidth, FitHeight){
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
			},

			setImagePosition : function(image, ow, oh, FitWidth, FitHeight){
				var left = 0, top = 0;
				if(FitWidth - ow > 0){
					left = (FitWidth - ow)/2;
				}
				
				if(FitHeight > oh){
					top = (FitHeight - oh)/2;
				}
				$(image).css({'left':left, 'top':top, 'position':'absolute'});
			}
			
		},

		
		tips : {		
			alert : function(msg, type){//type : success\warning\error
				if(typeof toastr)
					toastr[type || 'success'](msg||'未知错误！');		
				else
					alert(msg);
			}
		},

		myFastClick : function(etype, el, fn){
            var zel = $(el), dom = $(el).get(0), evt, preventDefault = true, stopPropagation = true;
            if($.type(etype) === 'object'){
                evt = etype.evt;
                preventDefault = etype.hasOwnProperty('pd') ? etype.pd : preventDefault;
                stopPropagation = etype.hasOwnProperty('sp') ? etype.sp : stopPropagation;
            }else{
                evt = etype;
            }
            // $('#evt').text(touchEvent)
            $(el).on(touchEvent, function (e) {
                var event = $.Event(evt);
                //这里为了方便而已，其实该e.target
                dom.dispatchEvent(event);
                preventDefault && e.preventDefault();
                stopPropagation && e.stopPropagation();
            });
            $(el).on(evt, fn);
        },
		
		event : function(opt){

			var _inner = function(e){

				var tg = $(e.target), rel = tg.attr('rel'), data = [];
				if(tg.data('lock')){
					e.preventDefault();
					return;
				} 
				for(var i=0;i<10;i++){
					var _rel = tg.attr('rel');
					
					if(_rel){
						var item = Gaofen.util.parseKnV(_rel);
						item.target = tg;
						data.push(item);
					}
					tg = tg.parent();
				}
				var len = data.length;

				if(len){
					for(var j = 0;j<len;j++){
						var evt = Gaofen.actions.get(data[j]['e']);
						//console.log('event:'+data[j]['e']);						
						if(evt){							
							if(!evt(e, data[j]))
								e.preventDefault();
						}							
					}
				}
				Gaofen.fire('global-bodyClick');
			};
			if(Gaofen.eventType === 'click'){
				$('body').on('click', function(e){				
					_inner(e);
				});
			}else{//移动
				if(typeof opt !== 'object'){
					opt = {evt : eventType, pd : false,sp: false};
				}else{
					opt.evt = eventType;
				}
				Gaofen.myFastClick(opt, $('body'),function(e){
					_inner(e);
				});
			}
		},
		
		actions : {
			evts : {},
			get : function(ns){
				return this.evts[ns];
			},
			
			reg : function(ns, fn){
				if(!this.evts[ns])
					this.evts[ns] = fn;
				else{
					var orfn = this.evts[ns];
					if($.type(orfn) === 'array'){
						orfn.push(fn);
					}else{
						var newfn = [orfn];
						newfn.push(fn);
						this.evts[ns] = newfn;
					}

				}
				return this;
			},
			del : function(ns){
                var fn = this.get(ns);
                if(fn){
                    return delete this.evts[ns];
                }
                return '';
            }
		},
		
		
		getRouter : function(url, router){
			var front = Gaofen.PD.get('front-project')|| 'chuzhong',
				back = Gaofen.PD.get('back-project')|| 'Czadmin',
				backFornt = 'chuzhong';
			var luri = location.href;
			if(Gaofen.place === 'admin'){//后台				
				if(luri.indexOf('dev') > 0)//开发环境
					return '/'+back+url;
				else{//正式环境
					if(luri.indexOf(backFornt) > 0){//外网初中库
						return '/'+backFornt+'/'+back+url;
					}else{
						return '/gaozhong/'+back+url;
					}
				}

			}else{//前台
				if(luri.indexOf('dev') > 0)//开发环境
					return url;
				else{//正式环境
					//if(luri.indexOf(front) > 0){//初中库
						if(Gaofen.PD.get('modal') === 'gz') front = 'gaozhong';
						return 'http://school.gaofen.com/'+front+url;
					//}
				}

			}

		},
		
		
		
		cls : {},


		getCmpUrl : function(ids){
			var uri = location.href.toLowerCase();
			if(uri.indexOf('dev') > 0){
				var mod = 'cz', front = 'chuzhong';
				mod = Gaofen.PD.get('modal')|| mod;
				// if(uri.indexOf('/gz/') > -1){
				// 	mod = 'gz';
				// }
				if(mod === 'gz') front = 'gaozhong';
				return this.getRouter('/'+front+'/duibi_'+ids.join('_')+'.html');
				//return this.getRouter('/'+mod+'/school/cmp?ids='+ids.join(','));
			}else{
				return this.getRouter('/duibi_'+ids.join('_')+'.html');
			}
		}
	
	}

	/**
	 *	Ajax请求入口
	 * @param {String} url 请求地址
	 * @param {Object} param 参数
	 * @param {Function} fn  回调
	 * @param {String} method ajax类型
	 **/
	 
	 Gaofen['Ajax'] = {
		
		send : function(url, param, fn, method){
			if( !param ) param = {__rnd : +new Date};
			else param['__rnd'] = +new Date;
			method = method || 'get';
			switch(method){
				case 'get' :
					$.get(url, param, fn);
				break;
				case 'post' :
					$.post(url, param, fn);
				break;
				case 'jsonp' :
					$.getJSON(url, param, fn);
				break;				
			}
			
		}
	 
	 };
	
	function AutoInput(opt){
         var config = $.extend(this, {
             view : '',
			 autoPanel : '',
             uri : '/admin/entry/ajaxEntries/string/',
             input : '',
             delay : 500,
             max : 10,
             text : '',
             choosedMax : 1,
             autoJump : false,
             floatCs : '.dropdown-menu',
             choosedCs : 'labels',
			 delCs : 'del',
             timer : null,
             choosed : '<span class="label label-success" rel="id:{.id}">{.text}<i class="glyphicon glyphicon-remove"></i></span>',
             itemTemp : '<li rel="{.id}"><a tabindex="-1" href="#">{.name}( {.school_type_name})</a></li>',
             floatTemp : '{.lis}'
         }, opt);
         this.init();
    }

    AutoInput.prototype = {

        couser : null,
        cache : {},
		currData : '',

        init : function(){        	
        	if(!this.autoPanel) this.autoPanel = this.view;
            var that = this;
            this.input = this.input || this.view;
            if(this.text){
            	this.input.val(this.text);
            }
            //this.couser = new cursorControl(this.input[0]);
            $(this.input).on('keyup click', function(e){
                clearTimeout(that.timer);
                that.timer = setTimeout(function(){that.get.call(that,e)}, that.delay);
            });
            $('body').on('click', function(e){
            	that.afterClickBody(e);
            });
            this.view.on('click', this.floatCs+' li', function(e){

            	if(that.autoJump){
            		// that.hide();	
            		that.removeFloat();
            	}else{
            		e.preventDefault();
                //console.log($(this).text());
                	if(that.afterChoosed($(this))){
                		that.removeFloat();
                	}
            	}

                
            });

            this.view.on('click', '.'+this.choosedCs+' .'+this.delCs, function(e){
                $(this).parent().remove();
            })

            this.view.cmpObj = this;

            this.initReady();

        },

        initReady : $.noop,

        afterClickBody : function(e){
            if($(e.target).closest(this.autoPanel).length === 0 && $(e.target).is(this.input) === false){
                this.hide();
            }
        },

        afterChoosed : function(dom){
            var data = this.currData, id = dom.attr('rel');
            this.createChoosed(data.list[dom.index()]);
            this.clearInput('');
            return true;
        },

        clearInput : function(v){
            this.setVal(v);
        },

        removeFloat : function(){
            //this.view.find('.'+this.floatCs).remove();
            this.view.find(this.floatCs).html('')
        },

        getVal : function(){
            if(this.input.attr('type') === 'text' || this.input.attr('type') === 'textarea')
                return $.trim(this.input.val());
            else
                return $.trim(this.input.text());
        },

        setVal : function(v){
            if(this.input.attr('type') === 'text' || this.input.attr('type') === 'textarea')
                this.input.val(v);
            else
                this.input.text(v);
        },

        get : function(e){
            var v = this.getVal();
            //console.log(v);
            //this.input.focus();
            //console.log(this.couser.getStart());
            if(v && v !== this.text)
                this.getByAjax(v);
            else{
            	//this.reset();
            }
        },

        getByAjax : function(str){
            var data = this.cache[str], that = this;
            if(!data){
				Gaofen.Ajax.send(this.uri+encodeURIComponent(str), '', function(r){
					if($.type(r) !== 'object')
						r = JSON.parse(r);
					if(r.errno == '0'){
						data = that.cache[str] = r.rst;
						that.reader(data);
					}
				})
                //data = this.cache[str] = [{'id':'1',text:"小学"}, {'id':2,text:'中学'}, {'id':3,text:'大学'}];
				
			}else
				this.reader(data);
        },
		
		getSchool_type_name  : function(school_type){
			return school_type == '1' ? '高中' : (school_type == '2' ? '初中' : '小学') ;
		},

        reader : function(data){
			this.currData  = data;
            var lis = [], that = this, list = data.hasOwnProperty('list') ?  data['list'] : data;
            $.each(list, function(i, item){
				if(i<10){
					item.school_type_name =  that.getSchool_type_name(item.school_type);
					lis.push(Gaofen.util.parse(that.itemTemp, item));
				}else return false;
            });
            var ul = Gaofen.util.parse(that.floatTemp, {lis:lis.join('')});
            this.removeFloat();
            
			if(lis.length > 0){
				//$(ul).appendTo(this.autoPanel).show();
				this.view.find(this.floatCs).display(1).append(ul);

			}

			this.callBackAfter(data);

        },

        callBackAfter : function(rs){

        },

        createChoosed : function(d){
            var cd = this.view.find('.'+this.choosedCs);
			if(cd.find('span[rel="id:'+d.id+'"]').length) return;
            if(this.choosedMax === 1){
                cd.html(Gaofen.util.parse(this.choosed, {id:d.id, text:d.name})).show();
            }else if(cd.children().length < this.choosedMax){
                cd.append(Gaofen.util.parse(this.choosed, {id:d.id, text:d.name})).show();
            }
        },

        reset : function(){
        	this.clearInput('');
        	this.removeFloat();
        },

        hide : function(){
        	this.reset();
        	this.autoPanel.addClass('hidden');
        }

    }	
	
	Gaofen.cls['AutoInput'] = AutoInput;
	
	
	Gaofen.PD = (function(){

        if(typeof Gaofen.cfg === 'undefined')
            Gaofen.cfg = {};
        var data = Gaofen.cfg,
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
					if(len === 0) return Gaofen.cfg;
                    return _window[name];
				}
            }       
        }  

	})()
	
	
	
	window['Gaofen'] = Gaofen;
 
 
})($, window)
 