define(function(require,exports,module) {
  var common = {};
  var $ = require('zepto'),
      Dialog = require('../gallery/dialog/main'),
      Loading = require('../gallery/loading/main');
  require('touch')($);
  
  common.$ = $;
  common.cache = {};

  $.ajaxSettings = $.extend($.ajaxSettings, {
    timeout: 10000,
    dataType: 'json'
  });
  common.cache['_page_loding'] = Loading();
  common.setAjaxStart = function (msg) {
    $(document)
        .off('ajaxStart')
        .on('ajaxStart', function () {
          if(common.cache['_ajax_loding']){
              common.cache['_ajax_loding'].show();
          }else{
            common.cache['_ajax_loding'] = Loading();
          }
        });
    return $(document);
  };

  common.setAjaxStart('请求数据中...').on('ajaxBeforeSend',function(e,xhr,settings){
    var url = settings.url;
    var idx = url.indexOf('?');
    if(idx!=-1){
      var params = url.slice(idx);
      if(common.check.haveIllegalCharacter(params)){
        var obj = common.utils.mapQuery(common.utils.filterParams(params));
        obj = common.utils.encode(obj);
        var queryStr = common.utils.json2queryStr(obj);
        common.log('查询字符串：'+queryStr);
        settings.url = url.slice(0,idx)+queryStr;
      }
    }
  }).on('ajaxComplete', function (data) {
    common.cache['_ajax_loding'] ? common.cache['_ajax_loding'].close() : null;
    if (common.utils.isJson(data)) {
      if (!data.success && data.errorCode != 0) {
        if(data.errorCode==-1){
          common.msg.error('抱歉，会话已销毁，正在为你重新建立会话', 3000);
          setTimeout(function(){
            window.location.href='/mobile/login.html';
          });
        }else{
          common.msg.error('抱歉，服务器状态异常：'+data.errorCode, 3000);
        }
      }
    }
  }).on('ajaxError', function (data, xhr, options, error) {
    var resText = xhr.responseText;
    if (resText.indexOf('500 ERROR') != '-1') {
      common.msg.error('抱歉，后台500错误，请稍后再试', 3000);
      $('section.content').empty().css({'font-size': '0.5em'}).append(error);
      return;
    }
    if (resText.indexOf('404 ERROR') != '-1') {
      common.msg.error('抱歉，404未找到请求的资源', 3000);
      return;
    }
    if (resText.indexOf('登录') != '-1') {
      common.msg.error('抱歉，会话已销毁，请退出重新进入CRM', 5000);
      return;
    }
    common.msg.error(error+',code:'+xhr.status, 5000);
  });

  ;(function ($) {
    $.extend(common, {
      log: function (msg, type) {
        window.console &&
          // Do NOT print `log(msg)` in non-debug mode
        (type || window.debug) &&
          // Set the default value of type
        (console[type || (type = "log")]) &&
          // Call native method of console
        console[type](msg)
      },
      pageLoaded:function(){
        $('.viewport').css({
          opacity:1
        });
        setTimeout(function(){
          common.cache['_page_loding'].close();  
        },500);
        
      }
    });
    $.extend(common.debug={}, {
      getSuffix:function(){
        if(location.href.indexOf('crm.qipeipu.com')=='-1'){
          return '?tsqq=true';
        }else{
          return '';
        }
      }
    });
    $.extend(common.check = {}, {
      haveIllegalCharacter:function(params){
        return params.search(/\'/)!==-1;
      },
      //空字符串检测
      null: function (str) {
        return str == undefined || $.trim(str) == '' || str == null;
      },
      //判断给定字符串是否是数字
      isNumber: function (string) {
        if (string.search(/^\d+$/) !== -1) {
          return true;
        } else {
          return false;
        }
      },
      //判断一个字符串是否是邮箱格式
      isEmail: function (emailStr) {
        if (emailStr.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) !== -1) {
          return true;
        } else {
          return false;
        }
      },
      //是否为正整数
      isPositiveNum: function (s) {
        var re = /^[0-9]*[1-9][0-9]*$/;
        return re.test(s)
      }
    });

    $.extend(common.utils = {}, {
      //对简单json中的每一项值进行encode处理
      encode:function(json){
        for(var p in json){
          json[p] = encodeURIComponent(json[p]);
        }
        return json;
      },
      //将简单json对象转换为查询字符串
      json2queryStr:function(json){
        var tmp = '';
        for(var p in json){
          tmp+=(p+'='+json[p]+'&');
        }
        if(!common.check.null(tmp)){
          return '?'+tmp.slice(tmp,tmp.length-1);
        }
        return tmp;
      },
      filterParams:function(params){
        return params.replace(/\'/,'');
      },
      //空字符串检测
      toInt: function (string, base) {
        return parseInt(string, base || 10);
      },
      //将字符串转换成浮点数
      toFloat: function (string) {
        return parseFloat(string);
      },
      //将带换行符的字符串转换成无换行符的字符串
      toSingleLine: function (str) {
        return String(str).replace(/\r/gi, "")
            .replace(/\n/gi, "");
      },
      //将字符串转换成html源码
      toHtml: function (str) {
        return String(str).replace(/&/gi, "&amp;")
            .replace(/\\/gi, "&#92;")
            .replace(/\'/gi, "&#39;")
            .replace(/\"/gi, "&quot;")
            .replace(/</gi, "&lt;")
            .replace(/>/gi, "&gt;")
            .replace(/ /gi, "&nbsp;")
            .replace(/\r\n/g, "<br />")
            .replace(/\n\r/g, "<br />")
            .replace(/\n/g, "<br />")
            .replace(/\r/g, "<br />");
      },
      //将 uri 的查询字符串参数映射成对象
      mapQuery: function (uri) {
        //window.location.search
        var i,
            key,
            value,
            uri = uri && uri.split('#')[0] || window.location.search, //remove hash
            index = uri.indexOf("?"),
            pieces = uri.substring(index + 1).split("&"),
            params = {};
        if (index === -1) {//如果连?号都没有,直接返回,不再进行处理. az 2011/5/11
          return params;
        }
        for (i = 0; i < pieces.length; i++) {
          try {
            index = pieces[i].indexOf("=");
            key = pieces[i].substring(0, index);
            value = pieces[i].substring(index + 1);
            if (!(params[key] = decodeURIComponent(value))) {
              throw new Error("uri has wrong query string when run mapQuery.");
            }
          }
          catch (e) {
            common.log("错误：[" + e.name + "] " + e.message + ", " + e.fileName + ", 行号:" + e.lineNumber + "; stack:" + typeof e.stack, 2);
          }
        }
        return params;
      },
      //将键值转换成查询字符串
      toQueryPair: function (key, value) {
        return encodeURIComponent(String(key)) + "=" + encodeURIComponent(String(value));
      },
      //将obj对象转换成查询字符串
      toQueryString: function (obj) {
        var result = [];
        for (var key in obj) {
          result.push(common.utils.toQueryPair(key, obj[key]));
        }
        return result.join("&");
      },
      //用做过滤直接放到HTML里的HTML代码
      encodeHtml: function (sStr) {
        return sStr.replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g, function (r) {
          return "&#" + r.charCodeAt(0) + ";";
        }).replace(/ /g, "&nbsp;").replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/\r/g, "<br />");
      },
      //用做过滤直接URL参数里的  比如 http://xx.com/abc_cgi?a=XXX  XXX就是要过滤的
      encodeUrl: function (sStr) {
        return escape(sStr).replace(/\+/g, "%2B");
      },
      //判断返回是否json格式
      isJson: function (obj) {
        return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
      },
      //计算总页数
      getTotalPage: function (recordtotal, perPage) {
        var pc = Math.ceil(recordtotal / perPage);
        return (pc == 0) ? 1 : pc;
      }
    });

    $.extend(common.data = {}, {
      _storage: window.localStorage,
      set: function (name, value) {
        if (common.utils.isJson(value)) {
          value = JSON.stringify(value);
        }
        common.data._storage.setItem(name, value);
      },
      get: function (name) {
        var tmp;
        try {
          tmp = $.parseJSON(common.data._storage.getItem(name));
        } catch (e) {
          tmp = common.data._storage.getItem(name);
        } finally {
          return tmp;
        }
      },
      remove: function (name) {
        common.data._storage.removeItem(name);
      },
      clear: function () {
        common.data._storage.clear();
      }
    });

    $.extend(common.msg = {}, {
      diy: function (arguments) {
        if(common.cache['dialog-diy']){
          common.cache['dialog-diy'].close(true);
        }
        common.cache['dialog-diy'] = new Dialog(arguments);
        return common.cache['dialog-diy'];
      },
      alert: function (msg, type, ok) {
        return common.msg.diy({
          content: msg,
          title: type,
          ok: ok
        });
      },
      confirm: function (msg, ok, cancel) {
        return common.msg.diy({
          content: msg,
          title: '',
          ok: ok,
          cancel: cancel
        });
      },
      info: function (msg, time, ok) {
        time = time == undefined ? 800 : time;
        return common.msg.diy({
          content: msg,
          title: 'alert',
          time: time,
          onclose: ($.isFunction(ok) ? ok.call(true) : null)
        });
      },
      success: function (msg, time, ok) {
        time = time == undefined ? 800 : time;
        return common.msg.diy({
          content: msg,
          title: 'alert',
          time: time,
          onclose: ($.isFunction(ok) ? ok : null)
        });
      },
      error: function (msg, time, ok) {
        time = time == undefined ? 800 : time;
        return common.msg.diy({
          content: msg,
          title: 'alert',
          time: time,
          onclose: ($.isFunction(ok) ? ok : null)
        });
      }
    });

    $.extend(common.state = {}, {
      check: function (data, ok, error) {
        if (common.utils.isJson(data)) {
          if (data.success && data.errorCode == 0) {
            if (data.model && typeof data.model != "undefined") {
              ok.call(this, data.model, data);
            } else {
              ok.call(this, null, data);
            }
          } else {
            if (!$.isFunction(error)) {
              common.msg.info(data.msg, 1000);
            } else {
              error.call(this, data.msg, data);
            }
          }
        } else {
          common.log('非json格式数据。');
        }
      }
    });
  })($);

  //可在页面设置不禁用自带滚动响应
  /*if(!window.needTuch){
   document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
   }*/

  $(function () {
    var UA = window.navigator.userAgent;
    UA = UA.toLocaleLowerCase();
    if (/ipad|iphone|android/.test(UA)) {
      common.mobileDevice = true;
      common.CLICK = 'tap';
      common.events = {
        click:'tap',
        over:'touchstart',
        out:'touchend'
      }
    } else {
      common.mobileDevice = false;
      common.CLICK = 'click';
      common.events = {
        click:'click',
        over:'mouseover',
        out:'mouseout'
      }
    }
    common.log('event:' + common.CLICK,'log');
  });
  module.exports = common;
});
