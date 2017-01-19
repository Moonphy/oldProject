/**
 * @author  xiezhiwen
 * @class Gaofen.request
 * ajax请求
 */
 
(function(G, $, win){

if(!window.__debug)
    __debug = false;

var 
    localDomain  = location.hostname,
    domainReg = /:\/\/(.[^\/]+)/,
	Util = G.util;

var ajaxRequest = {
    
/**
 * @class Gaofen.ax.RequestConfig
 * @extends Gaofen.ax.AjaxConfig
 */
 
 /**
  * @cfg {Function} success
  * @param {Gaofen.ax.ResponseDefinition} data
  */

/**
 * Gaofen库数据层API。<br/>
 * 发起任何请求前请先执行初始化{@link #init}。
 * @singleton
 */

/**
 *  初始化请求。发起任何请求前请先初始化。
 * @param {String} serverBaseUrl 服务器URL.
 * @return this
 */
    init : function(server){
        this.basePath = server;
        return this;
    },
	
	
	 ajax : function(param){
            var ajax, url = param.url;
            
            if (window.XMLHttpRequest) {
                ajax = new XMLHttpRequest();
            } else {
                if (window.ActiveXObject) {
                    try {
                        ajax = new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (e) {
                        try {
                            ajax = new ActiveXObject("Microsoft.XMLHTTP");
                        } catch (e) { }
                        }
                    }
            }
            
            
            if(ajax){
                param.method = param.method ? param.method.toUpperCase() : 'GET';
                // setup param

                var ps = param.data, ch = !param.cache;
                if(ps || ch){
                    var isQ = url.indexOf('?') >= 0;
                    // append data to url or parse post data to string
                    if(ps){
                        if(typeof ps === 'object')
                            ps = Util.queryString(ps);
                        if(ps && param.method === 'GET'){
                            if(!isQ){
                                url = url+'?';
							}else{
								url = url+'&';
							}
                            url = url + ps;
                        }
                    }
					if(ch){
                        if (url.indexOf('?') >= 0)
                            url = url + '&__rnd=' + (+new Date());
                        else
                            url = url + '?__rnd=' + (+new Date());
                    }
                }

                ajax.open(param.method, url, true);
                
                if (param.method === 'POST')
                    ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset='+(param.encoding?param.encoding:''));
                
                ajax.onreadystatechange = function(){
                    if (ajax.readyState === 4) {
                        var ok = (ajax.status === 200);
                        if(ok && param.success){
                            try{
                                //var data = (!param.dt || param.dt === 'json') ? eval("("+ajax.responseText+");") : ajax.responseText;
								var data = (!param.dt || param.dt === 'json') ? $.parseJSON(ajax.responseText) : ajax.responseText;
                            }catch(e){
                                if( __debug ) console.error('服务器返回JSON格式有误，请检查。\n',e,'\n', ajax.responseText);
                                ok = false;
                            }
                            if (ok)
                                param.success.call(param.scope||this, data, ajax);
                        }
                        
                        if(!ok && param.failure){
                            param.failure.call(param.scope||this, ajax.responseText, ajax);
                        }
                    }
                };
                
                // send POST data
                ajax.send("POST" === param.method ? ps : undefined);
                
                return ajax;
            }
        },
        
        /**
         * @class Gaofen.ax.JSONPConfig
         * {@link Gaofen.util#jsonp}方法的请求参数
         */
         
         /**
          * @cfg {String} url 请求目标URL
          */
         /**
          * @cfg {DOMElement} doc 可以指定生成JSONP脚本所在的document
          */
         
         /**
          * @cfg {Object} scope 可指定回调方法调用时的this对象
          */
          
         /**
          * @cfg {Object} data 作为提交参数的键值对
          */
          
          /**
           * @cfg {String} charset JSONP脚本字符编码
           */
           /**
            * @cfg {Object} script 进行JSONP请求的script标签的属性集，在请求前该属性集将被复制到script标签中
            */
         /**
          * @cfg {Function} success 请求成功后回调方法
          * @param {Object} data 根据设定的数据类型传递不同的类型数据
          * @param {XMLHttpRequest} ajax
          */
         /**
          * @cfg {Function} failure 请求失败后回调方法
          * @param {String} responseText 根据设定的数据类型传递不同的类型数据
          * @param {XMLHttpRequest} ajax 
          */
          /**
           * @cfg {String} jsonp 指定JSONP请求标识参数的名称，默认为'jsonp'
           */

         /**
          * 发起一个JSONP请求
         * @param {String} url 目标地址
         * @param {Gaofen.ax.JSONPConfig} param 请求参数
         * @return {HTMLElement} scriptElement
         */
        jsonp : function(param){
            var fn  = 'jsonp_' + (+new Date()),
                doc = param.doc || document, 
                url = param.url,
                script = doc.createElement('script'),
                hd = doc.getElementsByTagName("head")[0],
                success;
				
            if(typeof param == 'function'){
                success = param;
                param = {};
            }else success = param.success;

            
            script.type = 'text/javascript';
            param.charset && (script.charset = param.charset);
            param.deffer  && (script.deffer  = param.deffer);
            
            url = url + ( url.indexOf('?')>=0 ? '&' + ( param.callback || 'callback')+'='+fn : '?'+( param.callback || 'callback')+'='+fn);
			
            if(!param.data)
				 param.data = {};
			param.data['__rnd'] = +new Date();
			
            url += '&'+Util.queryString(param.data);
            
            if(param.script){
                Util.extend(script, param.script);
                delete param.script;
            }
            
            script.src = url;

            var cleaned = false;
            
            function clean(){
                if(!cleaned){
                    try {
                        delete window[fn];
                        script.parentNode.removeChild(script);
                        script = null;
                    }catch(e){}
                    cleaned = true;
                }
            }
            
            window[fn] = function(){
                clean();
                if(success)
                  success.apply(param.scope||this, arguments);
            };

            script.onreadystatechange = script.onload = function(){
                var rs = this.readyState;
                // 
                if( !cleaned && (!rs || rs === 'loaded' || rs === 'complete') ){
                    clean();
                    if(param.failure)
                        param.failure.call(param.scope||this);
                }
            };
            
            hd.appendChild(script);
            
            return script;
        },
	
	
    
/**
 * 发起一个请求。<br>请求不必理会是否跨域，系统会判断是否同域调用ajax或JSONP请求。
 * @param {Gaofen.ax.RequestConfig} config
 * @return {Connector} connector XMLHttpRequest|SCRIPT
 */
 
    direct : function(cfg){
        if(!cfg)
            cfg = {};
            
        // make a success handler wrapper
        var handler = cfg.success, connector;
        cfg.success = function(data, connector){
            var e = new (ajaxRequest.DefaultResponseDefinition ) (data, cfg, connector);
            
            if(__debug) console.log('req e:', e);
            
            if(cfg.scope)
                handler.call(cfg.scope, e);
            else handler(e);
            
            data = null;
            e = null;
            connector = null;
        };
        // check domain the same
        var domain = cfg.url.match(domainReg);
        connector = !domain || domain[1] == localDomain ? this.ajax(cfg) : this.jsonp(cfg);
        return connector;
    },
    
/**
 * 利用给定参数发起一个POST请求
 * <code><pre>
    // POST
    Gaofen.request.post(
        'http://demo.rayli.com.cn/?m=action.getCounts',
        {ids:'3042338323,3042296891'},
        function(e){
            if(e.isOk()){
                console.log(e.getRaw());
            }
        }
    );
   </pre></code>
 * @param {String} url
 * @param {Object} data
 * @param {Function} successCallback
 * @param {Gaofen.ax.RequestConfig} config
 * @return {Connector} connector XMLHttpRequest|SCRIPT
 */
    postReq : function(url, data, success, cfg){
        !cfg && (cfg = {});
        cfg.method = 'POST';
        return this.q(url, data, success, cfg);
    },

/**
 * 利用给定参数发起一个请求。
 * q是query的缩写。 
 * <code><pre>
    // JSONP
    Gaofen.request.q(
        'http://bbs.rayli.com.cn/api/gaofenx.php',
        {
            action : 'gaofenlogin',
            name   : 'yourname',
            pwd    : 'youpassword'
        },
        function(e){
            if(e.isOk()){
                console.log(e.getRaw());
            }
        },
        
        // 默认 'jsonp'，可根据具体目标而设置
        {jsonp:'jscallback'}
    );
   </pre></code>
 * @param {String} url
 * @param {Object} data
 * @param {Function} successCallback
 * @param {Gaofen.ax.RequestConfig} config
 * @return {Connector} connector XMLHttpRequest|SCRIPT
 */
    q : function(url, data, success, cfg){
        !cfg && (cfg = {});
        cfg.url = url;
        // merge data
        if(cfg.data)
            Util.extend(cfg.data, data);
        else cfg.data = data;
        cfg.success = success;
        return this.direct(cfg);
    },
    
    basePath : '/',
    
/**
 * 发起Gaofen的action请求
 * @param {String} actionName
 * @param {Gaofen.ax.RequestConfig} config
 * @return {Connector} connector XMLHttpRequest|SCRIPT
 */
    act : function(url, data, success, cfg){
        //var url = this.apiUrl('action', name);
        return this.postReq(url, data, function(){
            success && success.apply(this, arguments);
            // 数据层发送 act.开头的各种action事件
            //var arg = ['api.'+name];
            //for(var i=0,len=arguments.length;i<len;i++)
            //    arg.push(arguments[i]);
			G.fire.apply(url,{});
            //G.fire.apply(G, arg);
        }, cfg);
    },
    
/**
 * 创建Gaofen页面链接
 * @param {String} moduleName
 * @param {String} actionName
 * @param {String} [queryString]
 * @param {String} [entry]
 * @return {String}
 */
    mkUrl : function(module, action, queryStr, entry){
        var params = (entry||'')+'?mod=' + module;
        if (action)
            params += '&' + action;

        if (queryStr){
          typeof queryStr === 'string' ?  params += '&' + queryStr : params+='&'+Util.queryString(queryStr);
        }
        return this.basePath + params;
    },
    
/**
 * 获得api/weibo/请求URL
 * @param {String} moduleName
 * @param {String} actionName
 * @param {String} [queryString]
 */
    apiUrl : function(module, action, queryStr){
        return this.mkUrl('api/weibo/'+module, action, queryStr);
    },

/**
 * 解析原始返回的数据，很少会用到本方法，除非要手动解释返回的JSON数据。
 * @param {Object} rawData
 * @return {Gaofen.request.DefaultResponseDefinition}
 */
    parseProtocol : function(ret){
        return new ajaxRequest.DefaultResponseDefinition( ret );
    },
    
    event : function(name, data, success, cfg) {
        var url = this.mkUrl('event', name);
        this.postReq(url, data, success, cfg);
    },
	
	
	/*--------------------------以下是业务公共方法--------------------------*/
	/**
	 * 查询文件是否已支付
	 * @param {String} fid 文件ID
	 * @param {Number} type 支付方式(1:高分币，2:现金)
	 * @param {String} url
	 * @param {Function} fn
	 * @return {Object}
	 */
	isPayTofile : function(fid, type, url, fn, cfg){
		//url = url || http://dev.cms.gaofen.com/ajax/download
		return this.postReq(url, {
			id : fid,
			t : type
		}, fn, cfg);
	},

    
	/**
	 * 签到或者检查是否已签
	 * @param {String} action "qiandao" 签到、"check" 检查是否已经签到
	 * @param {Function} fn
	 * @return {Object}
	 */
    qiandao : function(action, fn, cfg){
		var url = G.PD.get('host');
		if(url.indexOf('http') === -1) url ='http://'+url;
		return this.q(url, {mod:'punch',action : action}, fn, cfg);
	},
	
	/**
	 * 签到或者检查是否已签
	 * @param {String} action "qiandao" 签到、"check" 检查是否已经签到
	 * @param {Function} fn
	 * @return {Object}
	 */
	qiandao2 : function(action, fn, cfg){
		var url = G.PD.get('host');
		url = url ? url+'/my/punch' : '/my/punch';
		if(url.indexOf('http') === -1) url ='http://'+url;
		return this.q(url, {action : action}, fn, cfg);
	}

};


/**
 * @class Gaofen.ax.ResponseDefinition
 * 该类定义获得返回内容数据的方式，即封装了底层数据返回的具体结构，外部应用可以以一致的<b>方法</b>读取返回的数据。<br/>
 * 异步返回的JSONP数据格式是前端与后台既定的一个格式，<strong>任何异步请求都要遵循该格式</strong>。<br/>
 * 一般情况下不必直接实现化本类，当{@link Gaofen.request}发起的异步请求返回时，回调传递的参数就是本类的实例化对象。
 * <pre><code>
    // response参数即为Gaofen.ax.ResponseDefinition类实例
    Gaofen.request.q('http://server.com/', {}, function(response){
        if(response.isOk()){
            alert(response.getData());
        }
   });
 </code></pre>
 * @constructor
 * @param {Object} rawData row json data responsed by server
 * @param {Object} requestConfig 连接配置信息
 * @param {XMLHttpRequest|JSONP} connector 发起请求的连接器(ajax:XMLHttpRequest或JSONP:script结点)
 */
ajaxRequest.DefaultResponseDefinition = function(rawData, reqCfg, connector){
    this.raw = rawData;
    this.reqCfg = reqCfg;
    if(connector)
        this.connector = connector;
};

ajaxRequest.DefaultResponseDefinition.prototype = {
/**
 * 获得该请求发起时的配置信息
 * @return {Object}
 */
    getRequestCfg : function(){
        return this.reqCfg;
    },
/**
 * 获得该请求所使所有连接器(ajax:XMLHttpRequest对象或JSONP:script结点)
 * @return {Object}
 */
    getConnector : function(){
        return this.connector;
    },
    
/**
 * 获得请求原始返回数据，根据请求数据类型的不同返回text文本或json对象
 * @return {Object} jsonData
 */
    getRaw : function(){
        return this.raw;
    },

/**
 * 获得该请求的应用数据
 * @return {Object}
 */
    getData : function(){
        return this.getRaw().data || this.getRaw().rst;
    },

/**
 * 检测服务器数据调用是否成功。
 * 该检测处于服务器成功返回之后，
 * 对客户端提交的请求数据有效性的一种反应。
 * @return {Boolean}
 */
    isOk : function(){
        //return !this.getCode();
		return this.getCode() == '0';
    },

/**
 * 获得返回码
 * @return {Number}
 */
    getCode : function(){
        return this.getRaw().code || this.getRaw().errno;
    },

/**
 * 获得错误的具体信息。这个错误信息是API默认返回的错误信息，主要给开发人员参考。
 * @return {Object} errorInfo
 */
    getError : function(){
        return this.getRaw().msg || this.getRaw().err || this.getRaw().error;
    },
    
/**
 * 从ERRORMAP获得错误码对应信息，返回的信息是面向用户的信息，如果要获得开发人员参考的错误信息，请用{@link #getError}。
 * @param {String} defaultString 如果不存在，返回该字符串。
 * @return {String}
 */
    getMsg : function(def){
        if(__debug) if( !ERRORMAP[ this.getCode() ] ) console.warn('未定义错误码消息：' + this.getCode(), '@', this.getRaw());
        // '系统繁忙，请稍后重试！'
        return ERRORMAP[ this.getCode() ] || def || ('系统不给力，请稍后再试试吧。');
    },

/**
 * 枚举返回的data数据，只枚举下标为数字的条项。
 * @param {Function} callback
 * @param {Object} scope
 */
    each : function(func, scope){
        var i = 0, data = this.getData();
        for( var item in data ){
            if( isNaN (item) )
                continue;
            if( scope ){
                if( func.call(scope, data[item], i) === false)
                    break;
            } else if( func(data[item], i) === false)
                 break;
            i++;
        }
    }
};


//
//  这里只限定后台返回的错误码，请不要定义其它多余的错误码。
//
var ERRORMAP = ajaxRequest.ERRORMAP = {
        '0'      :    '发布失败。',
		'404'    :    '未登录',
		'423001' :    '未登录',
		'500'    :    'api error',
		'423003' : ''
};


//
//  为方便处理，所有事件统一有X层发送
//
if(!G.fire)
    G.fire = function(){};

G.request = ajaxRequest;

})(Gaofen, jQuery, window);