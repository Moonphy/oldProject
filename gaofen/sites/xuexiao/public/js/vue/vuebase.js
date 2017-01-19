/**
 * Created by zhiwen on 2016-05-06.
 */
"use strict";
(function(V, win){

    var u = navigator.userAgent, app = navigator.appVersion,
	    isMoblie = !!u.match(/AppleWebKit.*Mobile.*/),
	    eventType = isMoblie ? 'tap' : 'click', touchEvent = 'touchend';


	Object.extend=function(destination, source) { 
		for (var property in source) {
		    destination[property] = source[property];   
		}
		return destination;   
	}
	var Gaofen = {
        _getValue:function(offset) {
            var endstr = document.cookie.indexOf (";", offset);
            if (endstr == -1) {
                endstr = document.cookie.length;
            }
            return unescape(document.cookie.substring(offset, endstr));
        },

        getCookie : function(name){
            var arg = name + "=", alen = arg.length, clen = document.cookie.length, i = 0;
            while (i < clen) {
                var j = i + alen;
                if (document.cookie.substring(i, j) == arg) {
                    return this._getValue(j);
                }
                i = document.cookie.indexOf(" ", i) + 1;
                if (i == 0) break;
            }
            return "";
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
                    if(orfn instanceof Array){
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
        on : function(name, fn){
            Gaofen.actions.reg('self_'+name, fn);
            return this;
        },

        fire : function(name, params){
            var fns = Gaofen.actions.get('self_'+name);
            if(fns){
                if(fns instanceof Array){
                    for(var i=0,len = fns.length;i<len;i++)
                        fns[i](params);
                }else{
                    fns(params);
                }
                //return Gaofen.actions.get('self_'+name)(params);
            }else{
                //console || console.log('no event');
            }
        },
    };
	
	Gaofen.PD = (function(){

        if(typeof Gaofen.cfg === 'undefined')
            Gaofen.cfg = {};
        var data = Gaofen.cfg,
        _window = {};
        return {
            set : function(name, _data){
                var len = arguments.length;
                if (len == 3){
                    _window[name] = _data;
                    data[name] = _data;         
                }else if(len == 2){
                	Object.extend(data, _data);            
                }else if(len == 1){
                	Object.extend(data, name);
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

	})();

    Gaofen['Ajax'] = function(){
            function request(url,opt){
                if(opt.data) opt.data['__rnd'] = +new Date;
                else opt.data = {'__rnd' : +new Date};
                function fn(){}
                var async   = opt.async !== false,
                    method  = opt.method    || 'GET',
                    data    = opt.data      || null,
                    success = opt.success   || fn,
                    failure = opt.failure   || fn;
                    method  = method.toUpperCase();
                var _data = [];
                for(var k in data){
                    _data.push(k+'='+data[k]);
                }
                _data = _data.join('&');
                if(method == 'GET' && _data){
                    url += (url.indexOf('?') == -1 ? '?' : '&') + _data;
                    _data = null;
                }
                var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                xhr.onreadystatechange = function(){
                    _onStateChange(xhr,success,failure);
                };
                xhr.open(method,url,async);
                if(method == 'POST'){
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;');
                }
                xhr.send(_data);
                return xhr;
            }
            function _onStateChange(xhr,success,failure){
                if(xhr.readyState == 4){
                    var s = xhr.status;
                    if(s>= 200 && s < 300){
                        var json = {};
                        try{
                            json = JSON.parse(xhr.responseText);                            
                        }catch(e){
                            // json = {rst:'',"errno":111111,"err":"非JSON数据"};
                            json = {rst:'',"errno":0,"err":""};
                        }
                        success(json);
                    }else{
                        try{
                            failure(JSON.parse(xhr.responseText));
                        }catch(e){
                            // failure({rst:'',"errno":111111,"err":"非JSON数据"});
                            failure({rst:'',"errno":0,"err":""});
                        }
                    }
                }else{}
            }
            return {request:request};  
        }();
	
	window['Gaofen'] = Gaofen;

})(Vue, window);