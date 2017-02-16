/*! jQuery v1.8.3 jquery.com | jquery.org/license */
(function(e,t){function _(e){var t=M[e]={};return v.each(e.split(y),function(e,n){t[n]=!0}),t}function H(e,n,r){if(r===t&&e.nodeType===1){var i="data-"+n.replace(P,"-$1").toLowerCase();r=e.getAttribute(i);if(typeof r=="string"){try{r=r==="true"?!0:r==="false"?!1:r==="null"?null:+r+""===r?+r:D.test(r)?v.parseJSON(r):r}catch(s){}v.data(e,n,r)}else r=t}return r}function B(e){var t;for(t in e){if(t==="data"&&v.isEmptyObject(e[t]))continue;if(t!=="toJSON")return!1}return!0}function et(){return!1}function tt(){return!0}function ut(e){return!e||!e.parentNode||e.parentNode.nodeType===11}function at(e,t){do e=e[t];while(e&&e.nodeType!==1);return e}function ft(e,t,n){t=t||0;if(v.isFunction(t))return v.grep(e,function(e,r){var i=!!t.call(e,r,e);return i===n});if(t.nodeType)return v.grep(e,function(e,r){return e===t===n});if(typeof t=="string"){var r=v.grep(e,function(e){return e.nodeType===1});if(it.test(t))return v.filter(t,r,!n);t=v.filter(t,r)}return v.grep(e,function(e,r){return v.inArray(e,t)>=0===n})}function lt(e){var t=ct.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}function Lt(e,t){return e.getElementsByTagName(t)[0]||e.appendChild(e.ownerDocument.createElement(t))}function At(e,t){if(t.nodeType!==1||!v.hasData(e))return;var n,r,i,s=v._data(e),o=v._data(t,s),u=s.events;if(u){delete o.handle,o.events={};for(n in u)for(r=0,i=u[n].length;r<i;r++)v.event.add(t,n,u[n][r])}o.data&&(o.data=v.extend({},o.data))}function Ot(e,t){var n;if(t.nodeType!==1)return;t.clearAttributes&&t.clearAttributes(),t.mergeAttributes&&t.mergeAttributes(e),n=t.nodeName.toLowerCase(),n==="object"?(t.parentNode&&(t.outerHTML=e.outerHTML),v.support.html5Clone&&e.innerHTML&&!v.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):n==="input"&&Et.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):n==="option"?t.selected=e.defaultSelected:n==="input"||n==="textarea"?t.defaultValue=e.defaultValue:n==="script"&&t.text!==e.text&&(t.text=e.text),t.removeAttribute(v.expando)}function Mt(e){return typeof e.getElementsByTagName!="undefined"?e.getElementsByTagName("*"):typeof e.querySelectorAll!="undefined"?e.querySelectorAll("*"):[]}function _t(e){Et.test(e.type)&&(e.defaultChecked=e.checked)}function Qt(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=Jt.length;while(i--){t=Jt[i]+n;if(t in e)return t}return r}function Gt(e,t){return e=t||e,v.css(e,"display")==="none"||!v.contains(e.ownerDocument,e)}function Yt(e,t){var n,r,i=[],s=0,o=e.length;for(;s<o;s++){n=e[s];if(!n.style)continue;i[s]=v._data(n,"olddisplay"),t?(!i[s]&&n.style.display==="none"&&(n.style.display=""),n.style.display===""&&Gt(n)&&(i[s]=v._data(n,"olddisplay",nn(n.nodeName)))):(r=Dt(n,"display"),!i[s]&&r!=="none"&&v._data(n,"olddisplay",r))}for(s=0;s<o;s++){n=e[s];if(!n.style)continue;if(!t||n.style.display==="none"||n.style.display==="")n.style.display=t?i[s]||"":"none"}return e}function Zt(e,t,n){var r=Rt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function en(e,t,n,r){var i=n===(r?"border":"content")?4:t==="width"?1:0,s=0;for(;i<4;i+=2)n==="margin"&&(s+=v.css(e,n+$t[i],!0)),r?(n==="content"&&(s-=parseFloat(Dt(e,"padding"+$t[i]))||0),n!=="margin"&&(s-=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0)):(s+=parseFloat(Dt(e,"padding"+$t[i]))||0,n!=="padding"&&(s+=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0));return s}function tn(e,t,n){var r=t==="width"?e.offsetWidth:e.offsetHeight,i=!0,s=v.support.boxSizing&&v.css(e,"boxSizing")==="border-box";if(r<=0||r==null){r=Dt(e,t);if(r<0||r==null)r=e.style[t];if(Ut.test(r))return r;i=s&&(v.support.boxSizingReliable||r===e.style[t]),r=parseFloat(r)||0}return r+en(e,t,n||(s?"border":"content"),i)+"px"}function nn(e){if(Wt[e])return Wt[e];var t=v("<"+e+">").appendTo(i.body),n=t.css("display");t.remove();if(n==="none"||n===""){Pt=i.body.appendChild(Pt||v.extend(i.createElement("iframe"),{frameBorder:0,width:0,height:0}));if(!Ht||!Pt.createElement)Ht=(Pt.contentWindow||Pt.contentDocument).document,Ht.write("<!doctype html><html><body>"),Ht.close();t=Ht.body.appendChild(Ht.createElement(e)),n=Dt(t,"display"),i.body.removeChild(Pt)}return Wt[e]=n,n}function fn(e,t,n,r){var i;if(v.isArray(t))v.each(t,function(t,i){n||sn.test(e)?r(e,i):fn(e+"["+(typeof i=="object"?t:"")+"]",i,n,r)});else if(!n&&v.type(t)==="object")for(i in t)fn(e+"["+i+"]",t[i],n,r);else r(e,t)}function Cn(e){return function(t,n){typeof t!="string"&&(n=t,t="*");var r,i,s,o=t.toLowerCase().split(y),u=0,a=o.length;if(v.isFunction(n))for(;u<a;u++)r=o[u],s=/^\+/.test(r),s&&(r=r.substr(1)||"*"),i=e[r]=e[r]||[],i[s?"unshift":"push"](n)}}function kn(e,n,r,i,s,o){s=s||n.dataTypes[0],o=o||{},o[s]=!0;var u,a=e[s],f=0,l=a?a.length:0,c=e===Sn;for(;f<l&&(c||!u);f++)u=a[f](n,r,i),typeof u=="string"&&(!c||o[u]?u=t:(n.dataTypes.unshift(u),u=kn(e,n,r,i,u,o)));return(c||!u)&&!o["*"]&&(u=kn(e,n,r,i,"*",o)),u}function Ln(e,n){var r,i,s=v.ajaxSettings.flatOptions||{};for(r in n)n[r]!==t&&((s[r]?e:i||(i={}))[r]=n[r]);i&&v.extend(!0,e,i)}function An(e,n,r){var i,s,o,u,a=e.contents,f=e.dataTypes,l=e.responseFields;for(s in l)s in r&&(n[l[s]]=r[s]);while(f[0]==="*")f.shift(),i===t&&(i=e.mimeType||n.getResponseHeader("content-type"));if(i)for(s in a)if(a[s]&&a[s].test(i)){f.unshift(s);break}if(f[0]in r)o=f[0];else{for(s in r){if(!f[0]||e.converters[s+" "+f[0]]){o=s;break}u||(u=s)}o=o||u}if(o)return o!==f[0]&&f.unshift(o),r[o]}function On(e,t){var n,r,i,s,o=e.dataTypes.slice(),u=o[0],a={},f=0;e.dataFilter&&(t=e.dataFilter(t,e.dataType));if(o[1])for(n in e.converters)a[n.toLowerCase()]=e.converters[n];for(;i=o[++f];)if(i!=="*"){if(u!=="*"&&u!==i){n=a[u+" "+i]||a["* "+i];if(!n)for(r in a){s=r.split(" ");if(s[1]===i){n=a[u+" "+s[0]]||a["* "+s[0]];if(n){n===!0?n=a[r]:a[r]!==!0&&(i=s[0],o.splice(f--,0,i));break}}}if(n!==!0)if(n&&e["throws"])t=n(t);else try{t=n(t)}catch(l){return{state:"parsererror",error:n?l:"No conversion from "+u+" to "+i}}}u=i}return{state:"success",data:t}}function Fn(){try{return new e.XMLHttpRequest}catch(t){}}function In(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}function $n(){return setTimeout(function(){qn=t},0),qn=v.now()}function Jn(e,t){v.each(t,function(t,n){var r=(Vn[t]||[]).concat(Vn["*"]),i=0,s=r.length;for(;i<s;i++)if(r[i].call(e,t,n))return})}function Kn(e,t,n){var r,i=0,s=0,o=Xn.length,u=v.Deferred().always(function(){delete a.elem}),a=function(){var t=qn||$n(),n=Math.max(0,f.startTime+f.duration-t),r=n/f.duration||0,i=1-r,s=0,o=f.tweens.length;for(;s<o;s++)f.tweens[s].run(i);return u.notifyWith(e,[f,i,n]),i<1&&o?n:(u.resolveWith(e,[f]),!1)},f=u.promise({elem:e,props:v.extend({},t),opts:v.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:qn||$n(),duration:n.duration,tweens:[],createTween:function(t,n,r){var i=v.Tween(e,f.opts,t,n,f.opts.specialEasing[t]||f.opts.easing);return f.tweens.push(i),i},stop:function(t){var n=0,r=t?f.tweens.length:0;for(;n<r;n++)f.tweens[n].run(1);return t?u.resolveWith(e,[f,t]):u.rejectWith(e,[f,t]),this}}),l=f.props;Qn(l,f.opts.specialEasing);for(;i<o;i++){r=Xn[i].call(f,e,l,f.opts);if(r)return r}return Jn(f,l),v.isFunction(f.opts.start)&&f.opts.start.call(e,f),v.fx.timer(v.extend(a,{anim:f,queue:f.opts.queue,elem:e})),f.progress(f.opts.progress).done(f.opts.done,f.opts.complete).fail(f.opts.fail).always(f.opts.always)}function Qn(e,t){var n,r,i,s,o;for(n in e){r=v.camelCase(n),i=t[r],s=e[n],v.isArray(s)&&(i=s[1],s=e[n]=s[0]),n!==r&&(e[r]=s,delete e[n]),o=v.cssHooks[r];if(o&&"expand"in o){s=o.expand(s),delete e[r];for(n in s)n in e||(e[n]=s[n],t[n]=i)}else t[r]=i}}function Gn(e,t,n){var r,i,s,o,u,a,f,l,c,h=this,p=e.style,d={},m=[],g=e.nodeType&&Gt(e);n.queue||(l=v._queueHooks(e,"fx"),l.unqueued==null&&(l.unqueued=0,c=l.empty.fire,l.empty.fire=function(){l.unqueued||c()}),l.unqueued++,h.always(function(){h.always(function(){l.unqueued--,v.queue(e,"fx").length||l.empty.fire()})})),e.nodeType===1&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],v.css(e,"display")==="inline"&&v.css(e,"float")==="none"&&(!v.support.inlineBlockNeedsLayout||nn(e.nodeName)==="inline"?p.display="inline-block":p.zoom=1)),n.overflow&&(p.overflow="hidden",v.support.shrinkWrapBlocks||h.done(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t){s=t[r];if(Un.exec(s)){delete t[r],a=a||s==="toggle";if(s===(g?"hide":"show"))continue;m.push(r)}}o=m.length;if(o){u=v._data(e,"fxshow")||v._data(e,"fxshow",{}),"hidden"in u&&(g=u.hidden),a&&(u.hidden=!g),g?v(e).show():h.done(function(){v(e).hide()}),h.done(function(){var t;v.removeData(e,"fxshow",!0);for(t in d)v.style(e,t,d[t])});for(r=0;r<o;r++)i=m[r],f=h.createTween(i,g?u[i]:0),d[i]=u[i]||v.style(e,i),i in u||(u[i]=f.start,g&&(f.end=f.start,f.start=i==="width"||i==="height"?1:0))}}function Yn(e,t,n,r,i){return new Yn.prototype.init(e,t,n,r,i)}function Zn(e,t){var n,r={height:e},i=0;t=t?1:0;for(;i<4;i+=2-t)n=$t[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}function tr(e){return v.isWindow(e)?e:e.nodeType===9?e.defaultView||e.parentWindow:!1}var n,r,i=e.document,s=e.location,o=e.navigator,u=e.jQuery,a=e.$,f=Array.prototype.push,l=Array.prototype.slice,c=Array.prototype.indexOf,h=Object.prototype.toString,p=Object.prototype.hasOwnProperty,d=String.prototype.trim,v=function(e,t){return new v.fn.init(e,t,n)},m=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,g=/\S/,y=/\s+/,b=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,w=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,E=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,S=/^[\],:{}\s]*$/,x=/(?:^|:|,)(?:\s*\[)+/g,T=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,N=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,C=/^-ms-/,k=/-([\da-z])/gi,L=function(e,t){return(t+"").toUpperCase()},A=function(){i.addEventListener?(i.removeEventListener("DOMContentLoaded",A,!1),v.ready()):i.readyState==="complete"&&(i.detachEvent("onreadystatechange",A),v.ready())},O={};v.fn=v.prototype={constructor:v,init:function(e,n,r){var s,o,u,a;if(!e)return this;if(e.nodeType)return this.context=this[0]=e,this.length=1,this;if(typeof e=="string"){e.charAt(0)==="<"&&e.charAt(e.length-1)===">"&&e.length>=3?s=[null,e,null]:s=w.exec(e);if(s&&(s[1]||!n)){if(s[1])return n=n instanceof v?n[0]:n,a=n&&n.nodeType?n.ownerDocument||n:i,e=v.parseHTML(s[1],a,!0),E.test(s[1])&&v.isPlainObject(n)&&this.attr.call(e,n,!0),v.merge(this,e);o=i.getElementById(s[2]);if(o&&o.parentNode){if(o.id!==s[2])return r.find(e);this.length=1,this[0]=o}return this.context=i,this.selector=e,this}return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e)}return v.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),v.makeArray(e,this))},selector:"",jquery:"1.8.3",length:0,size:function(){return this.length},toArray:function(){return l.call(this)},get:function(e){return e==null?this.toArray():e<0?this[this.length+e]:this[e]},pushStack:function(e,t,n){var r=v.merge(this.constructor(),e);return r.prevObject=this,r.context=this.context,t==="find"?r.selector=this.selector+(this.selector?" ":"")+n:t&&(r.selector=this.selector+"."+t+"("+n+")"),r},each:function(e,t){return v.each(this,e,t)},ready:function(e){return v.ready.promise().done(e),this},eq:function(e){return e=+e,e===-1?this.slice(e):this.slice(e,e+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(l.apply(this,arguments),"slice",l.call(arguments).join(","))},map:function(e){return this.pushStack(v.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:[].sort,splice:[].splice},v.fn.init.prototype=v.fn,v.extend=v.fn.extend=function(){var e,n,r,i,s,o,u=arguments[0]||{},a=1,f=arguments.length,l=!1;typeof u=="boolean"&&(l=u,u=arguments[1]||{},a=2),typeof u!="object"&&!v.isFunction(u)&&(u={}),f===a&&(u=this,--a);for(;a<f;a++)if((e=arguments[a])!=null)for(n in e){r=u[n],i=e[n];if(u===i)continue;l&&i&&(v.isPlainObject(i)||(s=v.isArray(i)))?(s?(s=!1,o=r&&v.isArray(r)?r:[]):o=r&&v.isPlainObject(r)?r:{},u[n]=v.extend(l,o,i)):i!==t&&(u[n]=i)}return u},v.extend({noConflict:function(t){return e.$===v&&(e.$=a),t&&e.jQuery===v&&(e.jQuery=u),v},isReady:!1,readyWait:1,holdReady:function(e){e?v.readyWait++:v.ready(!0)},ready:function(e){if(e===!0?--v.readyWait:v.isReady)return;if(!i.body)return setTimeout(v.ready,1);v.isReady=!0;if(e!==!0&&--v.readyWait>0)return;r.resolveWith(i,[v]),v.fn.trigger&&v(i).trigger("ready").off("ready")},isFunction:function(e){return v.type(e)==="function"},isArray:Array.isArray||function(e){return v.type(e)==="array"},isWindow:function(e){return e!=null&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return e==null?String(e):O[h.call(e)]||"object"},isPlainObject:function(e){if(!e||v.type(e)!=="object"||e.nodeType||v.isWindow(e))return!1;try{if(e.constructor&&!p.call(e,"constructor")&&!p.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(n){return!1}var r;for(r in e);return r===t||p.call(e,r)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw new Error(e)},parseHTML:function(e,t,n){var r;return!e||typeof e!="string"?null:(typeof t=="boolean"&&(n=t,t=0),t=t||i,(r=E.exec(e))?[t.createElement(r[1])]:(r=v.buildFragment([e],t,n?null:[]),v.merge([],(r.cacheable?v.clone(r.fragment):r.fragment).childNodes)))},parseJSON:function(t){if(!t||typeof t!="string")return null;t=v.trim(t);if(e.JSON&&e.JSON.parse)return e.JSON.parse(t);if(S.test(t.replace(T,"@").replace(N,"]").replace(x,"")))return(new Function("return "+t))();v.error("Invalid JSON: "+t)},parseXML:function(n){var r,i;if(!n||typeof n!="string")return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(s){r=t}return(!r||!r.documentElement||r.getElementsByTagName("parsererror").length)&&v.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&g.test(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(C,"ms-").replace(k,L)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,n,r){var i,s=0,o=e.length,u=o===t||v.isFunction(e);if(r){if(u){for(i in e)if(n.apply(e[i],r)===!1)break}else for(;s<o;)if(n.apply(e[s++],r)===!1)break}else if(u){for(i in e)if(n.call(e[i],i,e[i])===!1)break}else for(;s<o;)if(n.call(e[s],s,e[s++])===!1)break;return e},trim:d&&!d.call("\ufeff\u00a0")?function(e){return e==null?"":d.call(e)}:function(e){return e==null?"":(e+"").replace(b,"")},makeArray:function(e,t){var n,r=t||[];return e!=null&&(n=v.type(e),e.length==null||n==="string"||n==="function"||n==="regexp"||v.isWindow(e)?f.call(r,e):v.merge(r,e)),r},inArray:function(e,t,n){var r;if(t){if(c)return c.call(t,e,n);r=t.length,n=n?n<0?Math.max(0,r+n):n:0;for(;n<r;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,s=0;if(typeof r=="number")for(;s<r;s++)e[i++]=n[s];else while(n[s]!==t)e[i++]=n[s++];return e.length=i,e},grep:function(e,t,n){var r,i=[],s=0,o=e.length;n=!!n;for(;s<o;s++)r=!!t(e[s],s),n!==r&&i.push(e[s]);return i},map:function(e,n,r){var i,s,o=[],u=0,a=e.length,f=e instanceof v||a!==t&&typeof a=="number"&&(a>0&&e[0]&&e[a-1]||a===0||v.isArray(e));if(f)for(;u<a;u++)i=n(e[u],u,r),i!=null&&(o[o.length]=i);else for(s in e)i=n(e[s],s,r),i!=null&&(o[o.length]=i);return o.concat.apply([],o)},guid:1,proxy:function(e,n){var r,i,s;return typeof n=="string"&&(r=e[n],n=e,e=r),v.isFunction(e)?(i=l.call(arguments,2),s=function(){return e.apply(n,i.concat(l.call(arguments)))},s.guid=e.guid=e.guid||v.guid++,s):t},access:function(e,n,r,i,s,o,u){var a,f=r==null,l=0,c=e.length;if(r&&typeof r=="object"){for(l in r)v.access(e,n,l,r[l],1,o,i);s=1}else if(i!==t){a=u===t&&v.isFunction(i),f&&(a?(a=n,n=function(e,t,n){return a.call(v(e),n)}):(n.call(e,i),n=null));if(n)for(;l<c;l++)n(e[l],r,a?i.call(e[l],l,n(e[l],r)):i,u);s=1}return s?e:f?n.call(e):c?n(e[0],r):o},now:function(){return(new Date).getTime()}}),v.ready.promise=function(t){if(!r){r=v.Deferred();if(i.readyState==="complete")setTimeout(v.ready,1);else if(i.addEventListener)i.addEventListener("DOMContentLoaded",A,!1),e.addEventListener("load",v.ready,!1);else{i.attachEvent("onreadystatechange",A),e.attachEvent("onload",v.ready);var n=!1;try{n=e.frameElement==null&&i.documentElement}catch(s){}n&&n.doScroll&&function o(){if(!v.isReady){try{n.doScroll("left")}catch(e){return setTimeout(o,50)}v.ready()}}()}}return r.promise(t)},v.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(e,t){O["[object "+t+"]"]=t.toLowerCase()}),n=v(i);var M={};v.Callbacks=function(e){e=typeof e=="string"?M[e]||_(e):v.extend({},e);var n,r,i,s,o,u,a=[],f=!e.once&&[],l=function(t){n=e.memory&&t,r=!0,u=s||0,s=0,o=a.length,i=!0;for(;a&&u<o;u++)if(a[u].apply(t[0],t[1])===!1&&e.stopOnFalse){n=!1;break}i=!1,a&&(f?f.length&&l(f.shift()):n?a=[]:c.disable())},c={add:function(){if(a){var t=a.length;(function r(t){v.each(t,function(t,n){var i=v.type(n);i==="function"?(!e.unique||!c.has(n))&&a.push(n):n&&n.length&&i!=="string"&&r(n)})})(arguments),i?o=a.length:n&&(s=t,l(n))}return this},remove:function(){return a&&v.each(arguments,function(e,t){var n;while((n=v.inArray(t,a,n))>-1)a.splice(n,1),i&&(n<=o&&o--,n<=u&&u--)}),this},has:function(e){return v.inArray(e,a)>-1},empty:function(){return a=[],this},disable:function(){return a=f=n=t,this},disabled:function(){return!a},lock:function(){return f=t,n||c.disable(),this},locked:function(){return!f},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],a&&(!r||f)&&(i?f.push(t):l(t)),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!r}};return c},v.extend({Deferred:function(e){var t=[["resolve","done",v.Callbacks("once memory"),"resolved"],["reject","fail",v.Callbacks("once memory"),"rejected"],["notify","progress",v.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return v.Deferred(function(n){v.each(t,function(t,r){var s=r[0],o=e[t];i[r[1]](v.isFunction(o)?function(){var e=o.apply(this,arguments);e&&v.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[s+"With"](this===i?n:this,[e])}:n[s])}),e=null}).promise()},promise:function(e){return e!=null?v.extend(e,r):r}},i={};return r.pipe=r.then,v.each(t,function(e,s){var o=s[2],u=s[3];r[s[1]]=o.add,u&&o.add(function(){n=u},t[e^1][2].disable,t[2][2].lock),i[s[0]]=o.fire,i[s[0]+"With"]=o.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=l.call(arguments),r=n.length,i=r!==1||e&&v.isFunction(e.promise)?r:0,s=i===1?e:v.Deferred(),o=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?l.call(arguments):r,n===u?s.notifyWith(t,n):--i||s.resolveWith(t,n)}},u,a,f;if(r>1){u=new Array(r),a=new Array(r),f=new Array(r);for(;t<r;t++)n[t]&&v.isFunction(n[t].promise)?n[t].promise().done(o(t,f,n)).fail(s.reject).progress(o(t,a,u)):--i}return i||s.resolveWith(f,n),s.promise()}}),v.support=function(){var t,n,r,s,o,u,a,f,l,c,h,p=i.createElement("div");p.setAttribute("className","t"),p.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=p.getElementsByTagName("*"),r=p.getElementsByTagName("a")[0];if(!n||!r||!n.length)return{};s=i.createElement("select"),o=s.appendChild(i.createElement("option")),u=p.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(r.getAttribute("style")),hrefNormalized:r.getAttribute("href")==="/a",opacity:/^0.5/.test(r.style.opacity),cssFloat:!!r.style.cssFloat,checkOn:u.value==="on",optSelected:o.selected,getSetAttribute:p.className!=="t",enctype:!!i.createElement("form").enctype,html5Clone:i.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",boxModel:i.compatMode==="CSS1Compat",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},u.checked=!0,t.noCloneChecked=u.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!o.disabled;try{delete p.test}catch(d){t.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",h=function(){t.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick"),p.detachEvent("onclick",h)),u=i.createElement("input"),u.value="t",u.setAttribute("type","radio"),t.radioValue=u.value==="t",u.setAttribute("checked","checked"),u.setAttribute("name","t"),p.appendChild(u),a=i.createDocumentFragment(),a.appendChild(p.lastChild),t.checkClone=a.cloneNode(!0).cloneNode(!0).lastChild.checked,t.appendChecked=u.checked,a.removeChild(u),a.appendChild(p);if(p.attachEvent)for(l in{submit:!0,change:!0,focusin:!0})f="on"+l,c=f in p,c||(p.setAttribute(f,"return;"),c=typeof p[f]=="function"),t[l+"Bubbles"]=c;return v(function(){var n,r,s,o,u="padding:0;margin:0;border:0;display:block;overflow:hidden;",a=i.getElementsByTagName("body")[0];if(!a)return;n=i.createElement("div"),n.style.cssText="visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px",a.insertBefore(n,a.firstChild),r=i.createElement("div"),n.appendChild(r),r.innerHTML="<table><tr><td></td><td>t</td></tr></table>",s=r.getElementsByTagName("td"),s[0].style.cssText="padding:0;margin:0;border:0;display:none",c=s[0].offsetHeight===0,s[0].style.display="",s[1].style.display="none",t.reliableHiddenOffsets=c&&s[0].offsetHeight===0,r.innerHTML="",r.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",t.boxSizing=r.offsetWidth===4,t.doesNotIncludeMarginInBodyOffset=a.offsetTop!==1,e.getComputedStyle&&(t.pixelPosition=(e.getComputedStyle(r,null)||{}).top!=="1%",t.boxSizingReliable=(e.getComputedStyle(r,null)||{width:"4px"}).width==="4px",o=i.createElement("div"),o.style.cssText=r.style.cssText=u,o.style.marginRight=o.style.width="0",r.style.width="1px",r.appendChild(o),t.reliableMarginRight=!parseFloat((e.getComputedStyle(o,null)||{}).marginRight)),typeof r.style.zoom!="undefined"&&(r.innerHTML="",r.style.cssText=u+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=r.offsetWidth===3,r.style.display="block",r.style.overflow="visible",r.innerHTML="<div></div>",r.firstChild.style.width="5px",t.shrinkWrapBlocks=r.offsetWidth!==3,n.style.zoom=1),a.removeChild(n),n=r=s=o=null}),a.removeChild(p),n=r=s=o=u=a=p=null,t}();var D=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;v.extend({cache:{},deletedIds:[],uuid:0,expando:"jQuery"+(v.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(e){return e=e.nodeType?v.cache[e[v.expando]]:e[v.expando],!!e&&!B(e)},data:function(e,n,r,i){if(!v.acceptData(e))return;var s,o,u=v.expando,a=typeof n=="string",f=e.nodeType,l=f?v.cache:e,c=f?e[u]:e[u]&&u;if((!c||!l[c]||!i&&!l[c].data)&&a&&r===t)return;c||(f?e[u]=c=v.deletedIds.pop()||v.guid++:c=u),l[c]||(l[c]={},f||(l[c].toJSON=v.noop));if(typeof n=="object"||typeof n=="function")i?l[c]=v.extend(l[c],n):l[c].data=v.extend(l[c].data,n);return s=l[c],i||(s.data||(s.data={}),s=s.data),r!==t&&(s[v.camelCase(n)]=r),a?(o=s[n],o==null&&(o=s[v.camelCase(n)])):o=s,o},removeData:function(e,t,n){if(!v.acceptData(e))return;var r,i,s,o=e.nodeType,u=o?v.cache:e,a=o?e[v.expando]:v.expando;if(!u[a])return;if(t){r=n?u[a]:u[a].data;if(r){v.isArray(t)||(t in r?t=[t]:(t=v.camelCase(t),t in r?t=[t]:t=t.split(" ")));for(i=0,s=t.length;i<s;i++)delete r[t[i]];if(!(n?B:v.isEmptyObject)(r))return}}if(!n){delete u[a].data;if(!B(u[a]))return}o?v.cleanData([e],!0):v.support.deleteExpando||u!=u.window?delete u[a]:u[a]=null},_data:function(e,t,n){return v.data(e,t,n,!0)},acceptData:function(e){var t=e.nodeName&&v.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),v.fn.extend({data:function(e,n){var r,i,s,o,u,a=this[0],f=0,l=null;if(e===t){if(this.length){l=v.data(a);if(a.nodeType===1&&!v._data(a,"parsedAttrs")){s=a.attributes;for(u=s.length;f<u;f++)o=s[f].name,o.indexOf("data-")||(o=v.camelCase(o.substring(5)),H(a,o,l[o]));v._data(a,"parsedAttrs",!0)}}return l}return typeof e=="object"?this.each(function(){v.data(this,e)}):(r=e.split(".",2),r[1]=r[1]?"."+r[1]:"",i=r[1]+"!",v.access(this,function(n){if(n===t)return l=this.triggerHandler("getData"+i,[r[0]]),l===t&&a&&(l=v.data(a,e),l=H(a,e,l)),l===t&&r[1]?this.data(r[0]):l;r[1]=n,this.each(function(){var t=v(this);t.triggerHandler("setData"+i,r),v.data(this,e,n),t.triggerHandler("changeData"+i,r)})},null,n,arguments.length>1,null,!1))},removeData:function(e){return this.each(function(){v.removeData(this,e)})}}),v.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=v._data(e,t),n&&(!r||v.isArray(n)?r=v._data(e,t,v.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=v.queue(e,t),r=n.length,i=n.shift(),s=v._queueHooks(e,t),o=function(){v.dequeue(e,t)};i==="inprogress"&&(i=n.shift(),r--),i&&(t==="fx"&&n.unshift("inprogress"),delete s.stop,i.call(e,o,s)),!r&&s&&s.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return v._data(e,n)||v._data(e,n,{empty:v.Callbacks("once memory").add(function(){v.removeData(e,t+"queue",!0),v.removeData(e,n,!0)})})}}),v.fn.extend({queue:function(e,n){var r=2;return typeof e!="string"&&(n=e,e="fx",r--),arguments.length<r?v.queue(this[0],e):n===t?this:this.each(function(){var t=v.queue(this,e,n);v._queueHooks(this,e),e==="fx"&&t[0]!=="inprogress"&&v.dequeue(this,e)})},dequeue:function(e){return this.each(function(){v.dequeue(this,e)})},delay:function(e,t){return e=v.fx?v.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,s=v.Deferred(),o=this,u=this.length,a=function(){--i||s.resolveWith(o,[o])};typeof e!="string"&&(n=e,e=t),e=e||"fx";while(u--)r=v._data(o[u],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(a));return a(),s.promise(n)}});var j,F,I,q=/[\t\r\n]/g,R=/\r/g,U=/^(?:button|input)$/i,z=/^(?:button|input|object|select|textarea)$/i,W=/^a(?:rea|)$/i,X=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,V=v.support.getSetAttribute;v.fn.extend({attr:function(e,t){return v.access(this,v.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){v.removeAttr(this,e)})},prop:function(e,t){return v.access(this,v.prop,e,t,arguments.length>1)},removeProp:function(e){return e=v.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,s,o,u;if(v.isFunction(e))return this.each(function(t){v(this).addClass(e.call(this,t,this.className))});if(e&&typeof e=="string"){t=e.split(y);for(n=0,r=this.length;n<r;n++){i=this[n];if(i.nodeType===1)if(!i.className&&t.length===1)i.className=e;else{s=" "+i.className+" ";for(o=0,u=t.length;o<u;o++)s.indexOf(" "+t[o]+" ")<0&&(s+=t[o]+" ");i.className=v.trim(s)}}}return this},removeClass:function(e){var n,r,i,s,o,u,a;if(v.isFunction(e))return this.each(function(t){v(this).removeClass(e.call(this,t,this.className))});if(e&&typeof e=="string"||e===t){n=(e||"").split(y);for(u=0,a=this.length;u<a;u++){i=this[u];if(i.nodeType===1&&i.className){r=(" "+i.className+" ").replace(q," ");for(s=0,o=n.length;s<o;s++)while(r.indexOf(" "+n[s]+" ")>=0)r=r.replace(" "+n[s]+" "," ");i.className=e?v.trim(r):""}}}return this},toggleClass:function(e,t){var n=typeof e,r=typeof t=="boolean";return v.isFunction(e)?this.each(function(n){v(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if(n==="string"){var i,s=0,o=v(this),u=t,a=e.split(y);while(i=a[s++])u=r?u:!o.hasClass(i),o[u?"addClass":"removeClass"](i)}else if(n==="undefined"||n==="boolean")this.className&&v._data(this,"__className__",this.className),this.className=this.className||e===!1?"":v._data(this,"__className__")||""})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;n<r;n++)if(this[n].nodeType===1&&(" "+this[n].className+" ").replace(q," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,s=this[0];if(!arguments.length){if(s)return n=v.valHooks[s.type]||v.valHooks[s.nodeName.toLowerCase()],n&&"get"in n&&(r=n.get(s,"value"))!==t?r:(r=s.value,typeof r=="string"?r.replace(R,""):r==null?"":r);return}return i=v.isFunction(e),this.each(function(r){var s,o=v(this);if(this.nodeType!==1)return;i?s=e.call(this,r,o.val()):s=e,s==null?s="":typeof s=="number"?s+="":v.isArray(s)&&(s=v.map(s,function(e){return e==null?"":e+""})),n=v.valHooks[this.type]||v.valHooks[this.nodeName.toLowerCase()];if(!n||!("set"in n)||n.set(this,s,"value")===t)this.value=s})}}),v.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,s=e.type==="select-one"||i<0,o=s?null:[],u=s?i+1:r.length,a=i<0?u:s?i:0;for(;a<u;a++){n=r[a];if((n.selected||a===i)&&(v.support.optDisabled?!n.disabled:n.getAttribute("disabled")===null)&&(!n.parentNode.disabled||!v.nodeName(n.parentNode,"optgroup"))){t=v(n).val();if(s)return t;o.push(t)}}return o},set:function(e,t){var n=v.makeArray(t);return v(e).find("option").each(function(){this.selected=v.inArray(v(this).val(),n)>=0}),n.length||(e.selectedIndex=-1),n}}},attrFn:{},attr:function(e,n,r,i){var s,o,u,a=e.nodeType;if(!e||a===3||a===8||a===2)return;if(i&&v.isFunction(v.fn[n]))return v(e)[n](r);if(typeof e.getAttribute=="undefined")return v.prop(e,n,r);u=a!==1||!v.isXMLDoc(e),u&&(n=n.toLowerCase(),o=v.attrHooks[n]||(X.test(n)?F:j));if(r!==t){if(r===null){v.removeAttr(e,n);return}return o&&"set"in o&&u&&(s=o.set(e,r,n))!==t?s:(e.setAttribute(n,r+""),r)}return o&&"get"in o&&u&&(s=o.get(e,n))!==null?s:(s=e.getAttribute(n),s===null?t:s)},removeAttr:function(e,t){var n,r,i,s,o=0;if(t&&e.nodeType===1){r=t.split(y);for(;o<r.length;o++)i=r[o],i&&(n=v.propFix[i]||i,s=X.test(i),s||v.attr(e,i,""),e.removeAttribute(V?i:n),s&&n in e&&(e[n]=!1))}},attrHooks:{type:{set:function(e,t){if(U.test(e.nodeName)&&e.parentNode)v.error("type property can't be changed");else if(!v.support.radioValue&&t==="radio"&&v.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}},value:{get:function(e,t){return j&&v.nodeName(e,"button")?j.get(e,t):t in e?e.value:null},set:function(e,t,n){if(j&&v.nodeName(e,"button"))return j.set(e,t,n);e.value=t}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(e,n,r){var i,s,o,u=e.nodeType;if(!e||u===3||u===8||u===2)return;return o=u!==1||!v.isXMLDoc(e),o&&(n=v.propFix[n]||n,s=v.propHooks[n]),r!==t?s&&"set"in s&&(i=s.set(e,r,n))!==t?i:e[n]=r:s&&"get"in s&&(i=s.get(e,n))!==null?i:e[n]},propHooks:{tabIndex:{get:function(e){var n=e.getAttributeNode("tabindex");return n&&n.specified?parseInt(n.value,10):z.test(e.nodeName)||W.test(e.nodeName)&&e.href?0:t}}}}),F={get:function(e,n){var r,i=v.prop(e,n);return i===!0||typeof i!="boolean"&&(r=e.getAttributeNode(n))&&r.nodeValue!==!1?n.toLowerCase():t},set:function(e,t,n){var r;return t===!1?v.removeAttr(e,n):(r=v.propFix[n]||n,r in e&&(e[r]=!0),e.setAttribute(n,n.toLowerCase())),n}},V||(I={name:!0,id:!0,coords:!0},j=v.valHooks.button={get:function(e,n){var r;return r=e.getAttributeNode(n),r&&(I[n]?r.value!=="":r.specified)?r.value:t},set:function(e,t,n){var r=e.getAttributeNode(n);return r||(r=i.createAttribute(n),e.setAttributeNode(r)),r.value=t+""}},v.each(["width","height"],function(e,t){v.attrHooks[t]=v.extend(v.attrHooks[t],{set:function(e,n){if(n==="")return e.setAttribute(t,"auto"),n}})}),v.attrHooks.contenteditable={get:j.get,set:function(e,t,n){t===""&&(t="false"),j.set(e,t,n)}}),v.support.hrefNormalized||v.each(["href","src","width","height"],function(e,n){v.attrHooks[n]=v.extend(v.attrHooks[n],{get:function(e){var r=e.getAttribute(n,2);return r===null?t:r}})}),v.support.style||(v.attrHooks.style={get:function(e){return e.style.cssText.toLowerCase()||t},set:function(e,t){return e.style.cssText=t+""}}),v.support.optSelected||(v.propHooks.selected=v.extend(v.propHooks.selected,{get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}})),v.support.enctype||(v.propFix.enctype="encoding"),v.support.checkOn||v.each(["radio","checkbox"],function(){v.valHooks[this]={get:function(e){return e.getAttribute("value")===null?"on":e.value}}}),v.each(["radio","checkbox"],function(){v.valHooks[this]=v.extend(v.valHooks[this],{set:function(e,t){if(v.isArray(t))return e.checked=v.inArray(v(e).val(),t)>=0}})});var $=/^(?:textarea|input|select)$/i,J=/^([^\.]*|)(?:\.(.+)|)$/,K=/(?:^|\s)hover(\.\S+|)\b/,Q=/^key/,G=/^(?:mouse|contextmenu)|click/,Y=/^(?:focusinfocus|focusoutblur)$/,Z=function(e){return v.event.special.hover?e:e.replace(K,"mouseenter$1 mouseleave$1")};v.event={add:function(e,n,r,i,s){var o,u,a,f,l,c,h,p,d,m,g;if(e.nodeType===3||e.nodeType===8||!n||!r||!(o=v._data(e)))return;r.handler&&(d=r,r=d.handler,s=d.selector),r.guid||(r.guid=v.guid++),a=o.events,a||(o.events=a={}),u=o.handle,u||(o.handle=u=function(e){return typeof v=="undefined"||!!e&&v.event.triggered===e.type?t:v.event.dispatch.apply(u.elem,arguments)},u.elem=e),n=v.trim(Z(n)).split(" ");for(f=0;f<n.length;f++){l=J.exec(n[f])||[],c=l[1],h=(l[2]||"").split(".").sort(),g=v.event.special[c]||{},c=(s?g.delegateType:g.bindType)||c,g=v.event.special[c]||{},p=v.extend({type:c,origType:l[1],data:i,handler:r,guid:r.guid,selector:s,needsContext:s&&v.expr.match.needsContext.test(s),namespace:h.join(".")},d),m=a[c];if(!m){m=a[c]=[],m.delegateCount=0;if(!g.setup||g.setup.call(e,i,h,u)===!1)e.addEventListener?e.addEventListener(c,u,!1):e.attachEvent&&e.attachEvent("on"+c,u)}g.add&&(g.add.call(e,p),p.handler.guid||(p.handler.guid=r.guid)),s?m.splice(m.delegateCount++,0,p):m.push(p),v.event.global[c]=!0}e=null},global:{},remove:function(e,t,n,r,i){var s,o,u,a,f,l,c,h,p,d,m,g=v.hasData(e)&&v._data(e);if(!g||!(h=g.events))return;t=v.trim(Z(t||"")).split(" ");for(s=0;s<t.length;s++){o=J.exec(t[s])||[],u=a=o[1],f=o[2];if(!u){for(u in h)v.event.remove(e,u+t[s],n,r,!0);continue}p=v.event.special[u]||{},u=(r?p.delegateType:p.bindType)||u,d=h[u]||[],l=d.length,f=f?new RegExp("(^|\\.)"+f.split(".").sort().join("\\.(?:.*\\.|)")+"(\\.|$)"):null;for(c=0;c<d.length;c++)m=d[c],(i||a===m.origType)&&(!n||n.guid===m.guid)&&(!f||f.test(m.namespace))&&(!r||r===m.selector||r==="**"&&m.selector)&&(d.splice(c--,1),m.selector&&d.delegateCount--,p.remove&&p.remove.call(e,m));d.length===0&&l!==d.length&&((!p.teardown||p.teardown.call(e,f,g.handle)===!1)&&v.removeEvent(e,u,g.handle),delete h[u])}v.isEmptyObject(h)&&(delete g.handle,v.removeData(e,"events",!0))},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(n,r,s,o){if(!s||s.nodeType!==3&&s.nodeType!==8){var u,a,f,l,c,h,p,d,m,g,y=n.type||n,b=[];if(Y.test(y+v.event.triggered))return;y.indexOf("!")>=0&&(y=y.slice(0,-1),a=!0),y.indexOf(".")>=0&&(b=y.split("."),y=b.shift(),b.sort());if((!s||v.event.customEvent[y])&&!v.event.global[y])return;n=typeof n=="object"?n[v.expando]?n:new v.Event(y,n):new v.Event(y),n.type=y,n.isTrigger=!0,n.exclusive=a,n.namespace=b.join("."),n.namespace_re=n.namespace?new RegExp("(^|\\.)"+b.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,h=y.indexOf(":")<0?"on"+y:"";if(!s){u=v.cache;for(f in u)u[f].events&&u[f].events[y]&&v.event.trigger(n,r,u[f].handle.elem,!0);return}n.result=t,n.target||(n.target=s),r=r!=null?v.makeArray(r):[],r.unshift(n),p=v.event.special[y]||{};if(p.trigger&&p.trigger.apply(s,r)===!1)return;m=[[s,p.bindType||y]];if(!o&&!p.noBubble&&!v.isWindow(s)){g=p.delegateType||y,l=Y.test(g+y)?s:s.parentNode;for(c=s;l;l=l.parentNode)m.push([l,g]),c=l;c===(s.ownerDocument||i)&&m.push([c.defaultView||c.parentWindow||e,g])}for(f=0;f<m.length&&!n.isPropagationStopped();f++)l=m[f][0],n.type=m[f][1],d=(v._data(l,"events")||{})[n.type]&&v._data(l,"handle"),d&&d.apply(l,r),d=h&&l[h],d&&v.acceptData(l)&&d.apply&&d.apply(l,r)===!1&&n.preventDefault();return n.type=y,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(s.ownerDocument,r)===!1)&&(y!=="click"||!v.nodeName(s,"a"))&&v.acceptData(s)&&h&&s[y]&&(y!=="focus"&&y!=="blur"||n.target.offsetWidth!==0)&&!v.isWindow(s)&&(c=s[h],c&&(s[h]=null),v.event.triggered=y,s[y](),v.event.triggered=t,c&&(s[h]=c)),n.result}return},dispatch:function(n){n=v.event.fix(n||e.event);var r,i,s,o,u,a,f,c,h,p,d=(v._data(this,"events")||{})[n.type]||[],m=d.delegateCount,g=l.call(arguments),y=!n.exclusive&&!n.namespace,b=v.event.special[n.type]||{},w=[];g[0]=n,n.delegateTarget=this;if(b.preDispatch&&b.preDispatch.call(this,n)===!1)return;if(m&&(!n.button||n.type!=="click"))for(s=n.target;s!=this;s=s.parentNode||this)if(s.disabled!==!0||n.type!=="click"){u={},f=[];for(r=0;r<m;r++)c=d[r],h=c.selector,u[h]===t&&(u[h]=c.needsContext?v(h,this).index(s)>=0:v.find(h,this,null,[s]).length),u[h]&&f.push(c);f.length&&w.push({elem:s,matches:f})}d.length>m&&w.push({elem:this,matches:d.slice(m)});for(r=0;r<w.length&&!n.isPropagationStopped();r++){a=w[r],n.currentTarget=a.elem;for(i=0;i<a.matches.length&&!n.isImmediatePropagationStopped();i++){c=a.matches[i];if(y||!n.namespace&&!c.namespace||n.namespace_re&&n.namespace_re.test(c.namespace))n.data=c.data,n.handleObj=c,o=((v.event.special[c.origType]||{}).handle||c.handler).apply(a.elem,g),o!==t&&(n.result=o,o===!1&&(n.preventDefault(),n.stopPropagation()))}}return b.postDispatch&&b.postDispatch.call(this,n),n.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return e.which==null&&(e.which=t.charCode!=null?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,s,o,u=n.button,a=n.fromElement;return e.pageX==null&&n.clientX!=null&&(r=e.target.ownerDocument||i,s=r.documentElement,o=r.body,e.pageX=n.clientX+(s&&s.scrollLeft||o&&o.scrollLeft||0)-(s&&s.clientLeft||o&&o.clientLeft||0),e.pageY=n.clientY+(s&&s.scrollTop||o&&o.scrollTop||0)-(s&&s.clientTop||o&&o.clientTop||0)),!e.relatedTarget&&a&&(e.relatedTarget=a===e.target?n.toElement:a),!e.which&&u!==t&&(e.which=u&1?1:u&2?3:u&4?2:0),e}},fix:function(e){if(e[v.expando])return e;var t,n,r=e,s=v.event.fixHooks[e.type]||{},o=s.props?this.props.concat(s.props):this.props;e=v.Event(r);for(t=o.length;t;)n=o[--t],e[n]=r[n];return e.target||(e.target=r.srcElement||i),e.target.nodeType===3&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,r):e},special:{load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(e,t,n){v.isWindow(this)&&(this.onbeforeunload=n)},teardown:function(e,t){this.onbeforeunload===t&&(this.onbeforeunload=null)}}},simulate:function(e,t,n,r){var i=v.extend(new v.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?v.event.trigger(i,null,t):v.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},v.event.handle=v.event.dispatch,v.removeEvent=i.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]=="undefined"&&(e[r]=null),e.detachEvent(r,n))},v.Event=function(e,t){if(!(this instanceof v.Event))return new v.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?tt:et):this.type=e,t&&v.extend(this,t),this.timeStamp=e&&e.timeStamp||v.now(),this[v.expando]=!0},v.Event.prototype={preventDefault:function(){this.isDefaultPrevented=tt;var e=this.originalEvent;if(!e)return;e.preventDefault?e.preventDefault():e.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=tt;var e=this.originalEvent;if(!e)return;e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=tt,this.stopPropagation()},isDefaultPrevented:et,isPropagationStopped:et,isImmediatePropagationStopped:et},v.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){v.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,s=e.handleObj,o=s.selector;if(!i||i!==r&&!v.contains(r,i))e.type=s.origType,n=s.handler.apply(this,arguments),e.type=t;return n}}}),v.support.submitBubbles||(v.event.special.submit={setup:function(){if(v.nodeName(this,"form"))return!1;v.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=v.nodeName(n,"input")||v.nodeName(n,"button")?n.form:t;r&&!v._data(r,"_submit_attached")&&(v.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),v._data(r,"_submit_attached",!0))})},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&v.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){if(v.nodeName(this,"form"))return!1;v.event.remove(this,"._submit")}}),v.support.changeBubbles||(v.event.special.change={setup:function(){if($.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")v.event.add(this,"propertychange._change",function(e){e.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),v.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),v.event.simulate("change",this,e,!0)});return!1}v.event.add(this,"beforeactivate._change",function(e){var t=e.target;$.test(t.nodeName)&&!v._data(t,"_change_attached")&&(v.event.add(t,"change._change",function(e){this.parentNode&&!e.isSimulated&&!e.isTrigger&&v.event.simulate("change",this.parentNode,e,!0)}),v._data(t,"_change_attached",!0))})},handle:function(e){var t=e.target;if(this!==t||e.isSimulated||e.isTrigger||t.type!=="radio"&&t.type!=="checkbox")return e.handleObj.handler.apply(this,arguments)},teardown:function(){return v.event.remove(this,"._change"),!$.test(this.nodeName)}}),v.support.focusinBubbles||v.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){v.event.simulate(t,e.target,v.event.fix(e),!0)};v.event.special[t]={setup:function(){n++===0&&i.addEventListener(e,r,!0)},teardown:function(){--n===0&&i.removeEventListener(e,r,!0)}}}),v.fn.extend({on:function(e,n,r,i,s){var o,u;if(typeof e=="object"){typeof n!="string"&&(r=r||n,n=t);for(u in e)this.on(u,n,r,e[u],s);return this}r==null&&i==null?(i=n,r=n=t):i==null&&(typeof n=="string"?(i=r,r=t):(i=r,r=n,n=t));if(i===!1)i=et;else if(!i)return this;return s===1&&(o=i,i=function(e){return v().off(e),o.apply(this,arguments)},i.guid=o.guid||(o.guid=v.guid++)),this.each(function(){v.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,s;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,v(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if(typeof e=="object"){for(s in e)this.off(s,n,e[s]);return this}if(n===!1||typeof n=="function")r=n,n=t;return r===!1&&(r=et),this.each(function(){v.event.remove(this,e,r,n)})},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},live:function(e,t,n){return v(this.context).on(e,this.selector,t,n),this},die:function(e,t){return v(this.context).off(e,this.selector||"**",t),this},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return arguments.length===1?this.off(e,"**"):this.off(t,e||"**",n)},trigger:function(e,t){return this.each(function(){v.event.trigger(e,t,this)})},triggerHandler:function(e,t){if(this[0])return v.event.trigger(e,t,this[0],!0)},toggle:function(e){var t=arguments,n=e.guid||v.guid++,r=0,i=function(n){var i=(v._data(this,"lastToggle"+e.guid)||0)%r;return v._data(this,"lastToggle"+e.guid,i+1),n.preventDefault(),t[i].apply(this,arguments)||!1};i.guid=n;while(r<t.length)t[r++].guid=n;return this.click(i)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),v.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){v.fn[t]=function(e,n){return n==null&&(n=e,e=null),arguments.length>0?this.on(t,null,e,n):this.trigger(t)},Q.test(t)&&(v.event.fixHooks[t]=v.event.keyHooks),G.test(t)&&(v.event.fixHooks[t]=v.event.mouseHooks)}),function(e,t){function nt(e,t,n,r){n=n||[],t=t||g;var i,s,a,f,l=t.nodeType;if(!e||typeof e!="string")return n;if(l!==1&&l!==9)return[];a=o(t);if(!a&&!r)if(i=R.exec(e))if(f=i[1]){if(l===9){s=t.getElementById(f);if(!s||!s.parentNode)return n;if(s.id===f)return n.push(s),n}else if(t.ownerDocument&&(s=t.ownerDocument.getElementById(f))&&u(t,s)&&s.id===f)return n.push(s),n}else{if(i[2])return S.apply(n,x.call(t.getElementsByTagName(e),0)),n;if((f=i[3])&&Z&&t.getElementsByClassName)return S.apply(n,x.call(t.getElementsByClassName(f),0)),n}return vt(e.replace(j,"$1"),t,n,r,a)}function rt(e){return function(t){var n=t.nodeName.toLowerCase();return n==="input"&&t.type===e}}function it(e){return function(t){var n=t.nodeName.toLowerCase();return(n==="input"||n==="button")&&t.type===e}}function st(e){return N(function(t){return t=+t,N(function(n,r){var i,s=e([],n.length,t),o=s.length;while(o--)n[i=s[o]]&&(n[i]=!(r[i]=n[i]))})})}function ot(e,t,n){if(e===t)return n;var r=e.nextSibling;while(r){if(r===t)return-1;r=r.nextSibling}return 1}function ut(e,t){var n,r,s,o,u,a,f,l=L[d][e+" "];if(l)return t?0:l.slice(0);u=e,a=[],f=i.preFilter;while(u){if(!n||(r=F.exec(u)))r&&(u=u.slice(r[0].length)||u),a.push(s=[]);n=!1;if(r=I.exec(u))s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=r[0].replace(j," ");for(o in i.filter)(r=J[o].exec(u))&&(!f[o]||(r=f[o](r)))&&(s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=o,n.matches=r);if(!n)break}return t?u.length:u?nt.error(e):L(e,a).slice(0)}function at(e,t,r){var i=t.dir,s=r&&t.dir==="parentNode",o=w++;return t.first?function(t,n,r){while(t=t[i])if(s||t.nodeType===1)return e(t,n,r)}:function(t,r,u){if(!u){var a,f=b+" "+o+" ",l=f+n;while(t=t[i])if(s||t.nodeType===1){if((a=t[d])===l)return t.sizset;if(typeof a=="string"&&a.indexOf(f)===0){if(t.sizset)return t}else{t[d]=l;if(e(t,r,u))return t.sizset=!0,t;t.sizset=!1}}}else while(t=t[i])if(s||t.nodeType===1)if(e(t,r,u))return t}}function ft(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function lt(e,t,n,r,i){var s,o=[],u=0,a=e.length,f=t!=null;for(;u<a;u++)if(s=e[u])if(!n||n(s,r,i))o.push(s),f&&t.push(u);return o}function ct(e,t,n,r,i,s){return r&&!r[d]&&(r=ct(r)),i&&!i[d]&&(i=ct(i,s)),N(function(s,o,u,a){var f,l,c,h=[],p=[],d=o.length,v=s||dt(t||"*",u.nodeType?[u]:u,[]),m=e&&(s||!t)?lt(v,h,e,u,a):v,g=n?i||(s?e:d||r)?[]:o:m;n&&n(m,g,u,a);if(r){f=lt(g,p),r(f,[],u,a),l=f.length;while(l--)if(c=f[l])g[p[l]]=!(m[p[l]]=c)}if(s){if(i||e){if(i){f=[],l=g.length;while(l--)(c=g[l])&&f.push(m[l]=c);i(null,g=[],f,a)}l=g.length;while(l--)(c=g[l])&&(f=i?T.call(s,c):h[l])>-1&&(s[f]=!(o[f]=c))}}else g=lt(g===o?g.splice(d,g.length):g),i?i(null,o,g,a):S.apply(o,g)})}function ht(e){var t,n,r,s=e.length,o=i.relative[e[0].type],u=o||i.relative[" "],a=o?1:0,f=at(function(e){return e===t},u,!0),l=at(function(e){return T.call(t,e)>-1},u,!0),h=[function(e,n,r){return!o&&(r||n!==c)||((t=n).nodeType?f(e,n,r):l(e,n,r))}];for(;a<s;a++)if(n=i.relative[e[a].type])h=[at(ft(h),n)];else{n=i.filter[e[a].type].apply(null,e[a].matches);if(n[d]){r=++a;for(;r<s;r++)if(i.relative[e[r].type])break;return ct(a>1&&ft(h),a>1&&e.slice(0,a-1).join("").replace(j,"$1"),n,a<r&&ht(e.slice(a,r)),r<s&&ht(e=e.slice(r)),r<s&&e.join(""))}h.push(n)}return ft(h)}function pt(e,t){var r=t.length>0,s=e.length>0,o=function(u,a,f,l,h){var p,d,v,m=[],y=0,w="0",x=u&&[],T=h!=null,N=c,C=u||s&&i.find.TAG("*",h&&a.parentNode||a),k=b+=N==null?1:Math.E;T&&(c=a!==g&&a,n=o.el);for(;(p=C[w])!=null;w++){if(s&&p){for(d=0;v=e[d];d++)if(v(p,a,f)){l.push(p);break}T&&(b=k,n=++o.el)}r&&((p=!v&&p)&&y--,u&&x.push(p))}y+=w;if(r&&w!==y){for(d=0;v=t[d];d++)v(x,m,a,f);if(u){if(y>0)while(w--)!x[w]&&!m[w]&&(m[w]=E.call(l));m=lt(m)}S.apply(l,m),T&&!u&&m.length>0&&y+t.length>1&&nt.uniqueSort(l)}return T&&(b=k,c=N),x};return o.el=0,r?N(o):o}function dt(e,t,n){var r=0,i=t.length;for(;r<i;r++)nt(e,t[r],n);return n}function vt(e,t,n,r,s){var o,u,f,l,c,h=ut(e),p=h.length;if(!r&&h.length===1){u=h[0]=h[0].slice(0);if(u.length>2&&(f=u[0]).type==="ID"&&t.nodeType===9&&!s&&i.relative[u[1].type]){t=i.find.ID(f.matches[0].replace($,""),t,s)[0];if(!t)return n;e=e.slice(u.shift().length)}for(o=J.POS.test(e)?-1:u.length-1;o>=0;o--){f=u[o];if(i.relative[l=f.type])break;if(c=i.find[l])if(r=c(f.matches[0].replace($,""),z.test(u[0].type)&&t.parentNode||t,s)){u.splice(o,1),e=r.length&&u.join("");if(!e)return S.apply(n,x.call(r,0)),n;break}}}return a(e,h)(r,t,s,n,z.test(e)),n}function mt(){}var n,r,i,s,o,u,a,f,l,c,h=!0,p="undefined",d=("sizcache"+Math.random()).replace(".",""),m=String,g=e.document,y=g.documentElement,b=0,w=0,E=[].pop,S=[].push,x=[].slice,T=[].indexOf||function(e){var t=0,n=this.length;for(;t<n;t++)if(this[t]===e)return t;return-1},N=function(e,t){return e[d]=t==null||t,e},C=function(){var e={},t=[];return N(function(n,r){return t.push(n)>i.cacheLength&&delete e[t.shift()],e[n+" "]=r},e)},k=C(),L=C(),A=C(),O="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",_=M.replace("w","w#"),D="([*^$|!~]?=)",P="\\["+O+"*("+M+")"+O+"*(?:"+D+O+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+_+")|)|)"+O+"*\\]",H=":("+M+")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:"+P+")|[^:]|\\\\.)*|.*))\\)|)",B=":(even|odd|eq|gt|lt|nth|first|last)(?:\\("+O+"*((?:-\\d)?\\d*)"+O+"*\\)|)(?=[^-]|$)",j=new RegExp("^"+O+"+|((?:^|[^\\\\])(?:\\\\.)*)"+O+"+$","g"),F=new RegExp("^"+O+"*,"+O+"*"),I=new RegExp("^"+O+"*([\\x20\\t\\r\\n\\f>+~])"+O+"*"),q=new RegExp(H),R=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,U=/^:not/,z=/[\x20\t\r\n\f]*[+~]/,W=/:not\($/,X=/h\d/i,V=/input|select|textarea|button/i,$=/\\(?!\\)/g,J={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),NAME:new RegExp("^\\[name=['\"]?("+M+")['\"]?\\]"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+P),PSEUDO:new RegExp("^"+H),POS:new RegExp(B,"i"),CHILD:new RegExp("^:(only|nth|first|last)-child(?:\\("+O+"*(even|odd|(([+-]|)(\\d*)n|)"+O+"*(?:([+-]|)"+O+"*(\\d+)|))"+O+"*\\)|)","i"),needsContext:new RegExp("^"+O+"*[>+~]|"+B,"i")},K=function(e){var t=g.createElement("div");try{return e(t)}catch(n){return!1}finally{t=null}},Q=K(function(e){return e.appendChild(g.createComment("")),!e.getElementsByTagName("*").length}),G=K(function(e){return e.innerHTML="<a href='#'></a>",e.firstChild&&typeof e.firstChild.getAttribute!==p&&e.firstChild.getAttribute("href")==="#"}),Y=K(function(e){e.innerHTML="<select></select>";var t=typeof e.lastChild.getAttribute("multiple");return t!=="boolean"&&t!=="string"}),Z=K(function(e){return e.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",!e.getElementsByClassName||!e.getElementsByClassName("e").length?!1:(e.lastChild.className="e",e.getElementsByClassName("e").length===2)}),et=K(function(e){e.id=d+0,e.innerHTML="<a name='"+d+"'></a><div name='"+d+"'></div>",y.insertBefore(e,y.firstChild);var t=g.getElementsByName&&g.getElementsByName(d).length===2+g.getElementsByName(d+0).length;return r=!g.getElementById(d),y.removeChild(e),t});try{x.call(y.childNodes,0)[0].nodeType}catch(tt){x=function(e){var t,n=[];for(;t=this[e];e++)n.push(t);return n}}nt.matches=function(e,t){return nt(e,null,null,t)},nt.matchesSelector=function(e,t){return nt(t,null,null,[e]).length>0},s=nt.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(i===1||i===9||i===11){if(typeof e.textContent=="string")return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=s(e)}else if(i===3||i===4)return e.nodeValue}else for(;t=e[r];r++)n+=s(t);return n},o=nt.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?t.nodeName!=="HTML":!1},u=nt.contains=y.contains?function(e,t){var n=e.nodeType===9?e.documentElement:e,r=t&&t.parentNode;return e===r||!!(r&&r.nodeType===1&&n.contains&&n.contains(r))}:y.compareDocumentPosition?function(e,t){return t&&!!(e.compareDocumentPosition(t)&16)}:function(e,t){while(t=t.parentNode)if(t===e)return!0;return!1},nt.attr=function(e,t){var n,r=o(e);return r||(t=t.toLowerCase()),(n=i.attrHandle[t])?n(e):r||Y?e.getAttribute(t):(n=e.getAttributeNode(t),n?typeof e[t]=="boolean"?e[t]?t:null:n.specified?n.value:null:null)},i=nt.selectors={cacheLength:50,createPseudo:N,match:J,attrHandle:G?{}:{href:function(e){return e.getAttribute("href",2)},type:function(e){return e.getAttribute("type")}},find:{ID:r?function(e,t,n){if(typeof t.getElementById!==p&&!n){var r=t.getElementById(e);return r&&r.parentNode?[r]:[]}}:function(e,n,r){if(typeof n.getElementById!==p&&!r){var i=n.getElementById(e);return i?i.id===e||typeof i.getAttributeNode!==p&&i.getAttributeNode("id").value===e?[i]:t:[]}},TAG:Q?function(e,t){if(typeof t.getElementsByTagName!==p)return t.getElementsByTagName(e)}:function(e,t){var n=t.getElementsByTagName(e);if(e==="*"){var r,i=[],s=0;for(;r=n[s];s++)r.nodeType===1&&i.push(r);return i}return n},NAME:et&&function(e,t){if(typeof t.getElementsByName!==p)return t.getElementsByName(name)},CLASS:Z&&function(e,t,n){if(typeof t.getElementsByClassName!==p&&!n)return t.getElementsByClassName(e)}},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace($,""),e[3]=(e[4]||e[5]||"").replace($,""),e[2]==="~="&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),e[1]==="nth"?(e[2]||nt.error(e[0]),e[3]=+(e[3]?e[4]+(e[5]||1):2*(e[2]==="even"||e[2]==="odd")),e[4]=+(e[6]+e[7]||e[2]==="odd")):e[2]&&nt.error(e[0]),e},PSEUDO:function(e){var t,n;if(J.CHILD.test(e[0]))return null;if(e[3])e[2]=e[3];else if(t=e[4])q.test(t)&&(n=ut(t,!0))&&(n=t.indexOf(")",t.length-n)-t.length)&&(t=t.slice(0,n),e[0]=e[0].slice(0,n)),e[2]=t;return e.slice(0,3)}},filter:{ID:r?function(e){return e=e.replace($,""),function(t){return t.getAttribute("id")===e}}:function(e){return e=e.replace($,""),function(t){var n=typeof t.getAttributeNode!==p&&t.getAttributeNode("id");return n&&n.value===e}},TAG:function(e){return e==="*"?function(){return!0}:(e=e.replace($,"").toLowerCase(),function(t){return t.nodeName&&t.nodeName.toLowerCase()===e})},CLASS:function(e){var t=k[d][e+" "];return t||(t=new RegExp("(^|"+O+")"+e+"("+O+"|$)"))&&k(e,function(e){return t.test(e.className||typeof e.getAttribute!==p&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r,i){var s=nt.attr(r,e);return s==null?t==="!=":t?(s+="",t==="="?s===n:t==="!="?s!==n:t==="^="?n&&s.indexOf(n)===0:t==="*="?n&&s.indexOf(n)>-1:t==="$="?n&&s.substr(s.length-n.length)===n:t==="~="?(" "+s+" ").indexOf(n)>-1:t==="|="?s===n||s.substr(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r){return e==="nth"?function(e){var t,i,s=e.parentNode;if(n===1&&r===0)return!0;if(s){i=0;for(t=s.firstChild;t;t=t.nextSibling)if(t.nodeType===1){i++;if(e===t)break}}return i-=r,i===n||i%n===0&&i/n>=0}:function(t){var n=t;switch(e){case"only":case"first":while(n=n.previousSibling)if(n.nodeType===1)return!1;if(e==="first")return!0;n=t;case"last":while(n=n.nextSibling)if(n.nodeType===1)return!1;return!0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||nt.error("unsupported pseudo: "+e);return r[d]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?N(function(e,n){var i,s=r(e,t),o=s.length;while(o--)i=T.call(e,s[o]),e[i]=!(n[i]=s[o])}):function(e){return r(e,0,n)}):r}},pseudos:{not:N(function(e){var t=[],n=[],r=a(e.replace(j,"$1"));return r[d]?N(function(e,t,n,i){var s,o=r(e,null,i,[]),u=e.length;while(u--)if(s=o[u])e[u]=!(t[u]=s)}):function(e,i,s){return t[0]=e,r(t,null,s,n),!n.pop()}}),has:N(function(e){return function(t){return nt(e,t).length>0}}),contains:N(function(e){return function(t){return(t.textContent||t.innerText||s(t)).indexOf(e)>-1}}),enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&!!e.checked||t==="option"&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},parent:function(e){return!i.pseudos.empty(e)},empty:function(e){var t;e=e.firstChild;while(e){if(e.nodeName>"@"||(t=e.nodeType)===3||t===4)return!1;e=e.nextSibling}return!0},header:function(e){return X.test(e.nodeName)},text:function(e){var t,n;return e.nodeName.toLowerCase()==="input"&&(t=e.type)==="text"&&((n=e.getAttribute("type"))==null||n.toLowerCase()===t)},radio:rt("radio"),checkbox:rt("checkbox"),file:rt("file"),password:rt("password"),image:rt("image"),submit:it("submit"),reset:it("reset"),button:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&e.type==="button"||t==="button"},input:function(e){return V.test(e.nodeName)},focus:function(e){var t=e.ownerDocument;return e===t.activeElement&&(!t.hasFocus||t.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},active:function(e){return e===e.ownerDocument.activeElement},first:st(function(){return[0]}),last:st(function(e,t){return[t-1]}),eq:st(function(e,t,n){return[n<0?n+t:n]}),even:st(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:st(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:st(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:st(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}},f=y.compareDocumentPosition?function(e,t){return e===t?(l=!0,0):(!e.compareDocumentPosition||!t.compareDocumentPosition?e.compareDocumentPosition:e.compareDocumentPosition(t)&4)?-1:1}:function(e,t){if(e===t)return l=!0,0;if(e.sourceIndex&&t.sourceIndex)return e.sourceIndex-t.sourceIndex;var n,r,i=[],s=[],o=e.parentNode,u=t.parentNode,a=o;if(o===u)return ot(e,t);if(!o)return-1;if(!u)return 1;while(a)i.unshift(a),a=a.parentNode;a=u;while(a)s.unshift(a),a=a.parentNode;n=i.length,r=s.length;for(var f=0;f<n&&f<r;f++)if(i[f]!==s[f])return ot(i[f],s[f]);return f===n?ot(e,s[f],-1):ot(i[f],t,1)},[0,0].sort(f),h=!l,nt.uniqueSort=function(e){var t,n=[],r=1,i=0;l=h,e.sort(f);if(l){for(;t=e[r];r++)t===e[r-1]&&(i=n.push(r));while(i--)e.splice(n[i],1)}return e},nt.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},a=nt.compile=function(e,t){var n,r=[],i=[],s=A[d][e+" "];if(!s){t||(t=ut(e)),n=t.length;while(n--)s=ht(t[n]),s[d]?r.push(s):i.push(s);s=A(e,pt(i,r))}return s},g.querySelectorAll&&function(){var e,t=vt,n=/'|\\/g,r=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,i=[":focus"],s=[":active"],u=y.matchesSelector||y.mozMatchesSelector||y.webkitMatchesSelector||y.oMatchesSelector||y.msMatchesSelector;K(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||i.push("\\["+O+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),e.querySelectorAll(":checked").length||i.push(":checked")}),K(function(e){e.innerHTML="<p test=''></p>",e.querySelectorAll("[test^='']").length&&i.push("[*^$]="+O+"*(?:\"\"|'')"),e.innerHTML="<input type='hidden'/>",e.querySelectorAll(":enabled").length||i.push(":enabled",":disabled")}),i=new RegExp(i.join("|")),vt=function(e,r,s,o,u){if(!o&&!u&&!i.test(e)){var a,f,l=!0,c=d,h=r,p=r.nodeType===9&&e;if(r.nodeType===1&&r.nodeName.toLowerCase()!=="object"){a=ut(e),(l=r.getAttribute("id"))?c=l.replace(n,"\\$&"):r.setAttribute("id",c),c="[id='"+c+"'] ",f=a.length;while(f--)a[f]=c+a[f].join("");h=z.test(e)&&r.parentNode||r,p=a.join(",")}if(p)try{return S.apply(s,x.call(h.querySelectorAll(p),0)),s}catch(v){}finally{l||r.removeAttribute("id")}}return t(e,r,s,o,u)},u&&(K(function(t){e=u.call(t,"div");try{u.call(t,"[test!='']:sizzle"),s.push("!=",H)}catch(n){}}),s=new RegExp(s.join("|")),nt.matchesSelector=function(t,n){n=n.replace(r,"='$1']");if(!o(t)&&!s.test(n)&&!i.test(n))try{var a=u.call(t,n);if(a||e||t.document&&t.document.nodeType!==11)return a}catch(f){}return nt(n,null,null,[t]).length>0})}(),i.pseudos.nth=i.pseudos.eq,i.filters=mt.prototype=i.pseudos,i.setFilters=new mt,nt.attr=v.attr,v.find=nt,v.expr=nt.selectors,v.expr[":"]=v.expr.pseudos,v.unique=nt.uniqueSort,v.text=nt.getText,v.isXMLDoc=nt.isXML,v.contains=nt.contains}(e);var nt=/Until$/,rt=/^(?:parents|prev(?:Until|All))/,it=/^.[^:#\[\.,]*$/,st=v.expr.match.needsContext,ot={children:!0,contents:!0,next:!0,prev:!0};v.fn.extend({find:function(e){var t,n,r,i,s,o,u=this;if(typeof e!="string")return v(e).filter(function(){for(t=0,n=u.length;t<n;t++)if(v.contains(u[t],this))return!0});o=this.pushStack("","find",e);for(t=0,n=this.length;t<n;t++){r=o.length,v.find(e,this[t],o);if(t>0)for(i=r;i<o.length;i++)for(s=0;s<r;s++)if(o[s]===o[i]){o.splice(i--,1);break}}return o},has:function(e){var t,n=v(e,this),r=n.length;return this.filter(function(){for(t=0;t<r;t++)if(v.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e,!1),"not",e)},filter:function(e){return this.pushStack(ft(this,e,!0),"filter",e)},is:function(e){return!!e&&(typeof e=="string"?st.test(e)?v(e,this.context).index(this[0])>=0:v.filter(e,this).length>0:this.filter(e).length>0)},closest:function(e,t){var n,r=0,i=this.length,s=[],o=st.test(e)||typeof e!="string"?v(e,t||this.context):0;for(;r<i;r++){n=this[r];while(n&&n.ownerDocument&&n!==t&&n.nodeType!==11){if(o?o.index(n)>-1:v.find.matchesSelector(n,e)){s.push(n);break}n=n.parentNode}}return s=s.length>1?v.unique(s):s,this.pushStack(s,"closest",e)},index:function(e){return e?typeof e=="string"?v.inArray(this[0],v(e)):v.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.prevAll().length:-1},add:function(e,t){var n=typeof e=="string"?v(e,t):v.makeArray(e&&e.nodeType?[e]:e),r=v.merge(this.get(),n);return this.pushStack(ut(n[0])||ut(r[0])?r:v.unique(r))},addBack:function(e){return this.add(e==null?this.prevObject:this.prevObject.filter(e))}}),v.fn.andSelf=v.fn.addBack,v.each({parent:function(e){var t=e.parentNode;return t&&t.nodeType!==11?t:null},parents:function(e){return v.dir(e,"parentNode")},parentsUntil:function(e,t,n){return v.dir(e,"parentNode",n)},next:function(e){return at(e,"nextSibling")},prev:function(e){return at(e,"previousSibling")},nextAll:function(e){return v.dir(e,"nextSibling")},prevAll:function(e){return v.dir(e,"previousSibling")},nextUntil:function(e,t,n){return v.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return v.dir(e,"previousSibling",n)},siblings:function(e){return v.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return v.sibling(e.firstChild)},contents:function(e){return v.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:v.merge([],e.childNodes)}},function(e,t){v.fn[e]=function(n,r){var i=v.map(this,t,n);return nt.test(e)||(r=n),r&&typeof r=="string"&&(i=v.filter(r,i)),i=this.length>1&&!ot[e]?v.unique(i):i,this.length>1&&rt.test(e)&&(i=i.reverse()),this.pushStack(i,e,l.call(arguments).join(","))}}),v.extend({filter:function(e,t,n){return n&&(e=":not("+e+")"),t.length===1?v.find.matchesSelector(t[0],e)?[t[0]]:[]:v.find.matches(e,t)},dir:function(e,n,r){var i=[],s=e[n];while(s&&s.nodeType!==9&&(r===t||s.nodeType!==1||!v(s).is(r)))s.nodeType===1&&i.push(s),s=s[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)e.nodeType===1&&e!==t&&n.push(e);return n}});var ct="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",ht=/ jQuery\d+="(?:null|\d+)"/g,pt=/^\s+/,dt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,vt=/<([\w:]+)/,mt=/<tbody/i,gt=/<|&#?\w+;/,yt=/<(?:script|style|link)/i,bt=/<(?:script|object|embed|option|style)/i,wt=new RegExp("<(?:"+ct+")[\\s/>]","i"),Et=/^(?:checkbox|radio)$/,St=/checked\s*(?:[^=]|=\s*.checked.)/i,xt=/\/(java|ecma)script/i,Tt=/^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,Nt={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},Ct=lt(i),kt=Ct.appendChild(i.createElement("div"));Nt.optgroup=Nt.option,Nt.tbody=Nt.tfoot=Nt.colgroup=Nt.caption=Nt.thead,Nt.th=Nt.td,v.support.htmlSerialize||(Nt._default=[1,"X<div>","</div>"]),v.fn.extend({text:function(e){return v.access(this,function(e){return e===t?v.text(this):this.empty().append((this[0]&&this[0].ownerDocument||i).createTextNode(e))},null,e,arguments.length)},wrapAll:function(e){if(v.isFunction(e))return this.each(function(t){v(this).wrapAll(e.call(this,t))});if(this[0]){var t=v(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&e.firstChild.nodeType===1)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return v.isFunction(e)?this.each(function(t){v(this).wrapInner(e.call(this,t))}):this.each(function(){var t=v(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=v.isFunction(e);return this.each(function(n){v(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){v.nodeName(this,"body")||v(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.appendChild(e)})},prepend:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.insertBefore(e,this.firstChild)})},before:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(e,this),"before",this.selector)}},after:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this.nextSibling)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(this,e),"after",this.selector)}},remove:function(e,t){var n,r=0;for(;(n=this[r])!=null;r++)if(!e||v.filter(e,[n]).length)!t&&n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),v.cleanData([n])),n.parentNode&&n.parentNode.removeChild(n);return this},empty:function(){var e,t=0;for(;(e=this[t])!=null;t++){e.nodeType===1&&v.cleanData(e.getElementsByTagName("*"));while(e.firstChild)e.removeChild(e.firstChild)}return this},clone:function(e,t){return e=e==null?!1:e,t=t==null?e:t,this.map(function(){return v.clone(this,e,t)})},html:function(e){return v.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return n.nodeType===1?n.innerHTML.replace(ht,""):t;if(typeof e=="string"&&!yt.test(e)&&(v.support.htmlSerialize||!wt.test(e))&&(v.support.leadingWhitespace||!pt.test(e))&&!Nt[(vt.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(dt,"<$1></$2>");try{for(;r<i;r++)n=this[r]||{},n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),n.innerHTML=e);n=0}catch(s){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(e){return ut(this[0])?this.length?this.pushStack(v(v.isFunction(e)?e():e),"replaceWith",e):this:v.isFunction(e)?this.each(function(t){var n=v(this),r=n.html();n.replaceWith(e.call(this,t,r))}):(typeof e!="string"&&(e=v(e).detach()),this.each(function(){var t=this.nextSibling,n=this.parentNode;v(this).remove(),t?v(t).before(e):v(n).append(e)}))},detach:function(e){return this.remove(e,!0)},domManip:function(e,n,r){e=[].concat.apply([],e);var i,s,o,u,a=0,f=e[0],l=[],c=this.length;if(!v.support.checkClone&&c>1&&typeof f=="string"&&St.test(f))return this.each(function(){v(this).domManip(e,n,r)});if(v.isFunction(f))return this.each(function(i){var s=v(this);e[0]=f.call(this,i,n?s.html():t),s.domManip(e,n,r)});if(this[0]){i=v.buildFragment(e,this,l),o=i.fragment,s=o.firstChild,o.childNodes.length===1&&(o=s);if(s){n=n&&v.nodeName(s,"tr");for(u=i.cacheable||c-1;a<c;a++)r.call(n&&v.nodeName(this[a],"table")?Lt(this[a],"tbody"):this[a],a===u?o:v.clone(o,!0,!0))}o=s=null,l.length&&v.each(l,function(e,t){t.src?v.ajax?v.ajax({url:t.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):v.error("no ajax"):v.globalEval((t.text||t.textContent||t.innerHTML||"").replace(Tt,"")),t.parentNode&&t.parentNode.removeChild(t)})}return this}}),v.buildFragment=function(e,n,r){var s,o,u,a=e[0];return n=n||i,n=!n.nodeType&&n[0]||n,n=n.ownerDocument||n,e.length===1&&typeof a=="string"&&a.length<512&&n===i&&a.charAt(0)==="<"&&!bt.test(a)&&(v.support.checkClone||!St.test(a))&&(v.support.html5Clone||!wt.test(a))&&(o=!0,s=v.fragments[a],u=s!==t),s||(s=n.createDocumentFragment(),v.clean(e,n,s,r),o&&(v.fragments[a]=u&&s)),{fragment:s,cacheable:o}},v.fragments={},v.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){v.fn[e]=function(n){var r,i=0,s=[],o=v(n),u=o.length,a=this.length===1&&this[0].parentNode;if((a==null||a&&a.nodeType===11&&a.childNodes.length===1)&&u===1)return o[t](this[0]),this;for(;i<u;i++)r=(i>0?this.clone(!0):this).get(),v(o[i])[t](r),s=s.concat(r);return this.pushStack(s,e,o.selector)}}),v.extend({clone:function(e,t,n){var r,i,s,o;v.support.html5Clone||v.isXMLDoc(e)||!wt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(kt.innerHTML=e.outerHTML,kt.removeChild(o=kt.firstChild));if((!v.support.noCloneEvent||!v.support.noCloneChecked)&&(e.nodeType===1||e.nodeType===11)&&!v.isXMLDoc(e)){Ot(e,o),r=Mt(e),i=Mt(o);for(s=0;r[s];++s)i[s]&&Ot(r[s],i[s])}if(t){At(e,o);if(n){r=Mt(e),i=Mt(o);for(s=0;r[s];++s)At(r[s],i[s])}}return r=i=null,o},clean:function(e,t,n,r){var s,o,u,a,f,l,c,h,p,d,m,g,y=t===i&&Ct,b=[];if(!t||typeof t.createDocumentFragment=="undefined")t=i;for(s=0;(u=e[s])!=null;s++){typeof u=="number"&&(u+="");if(!u)continue;if(typeof u=="string")if(!gt.test(u))u=t.createTextNode(u);else{y=y||lt(t),c=t.createElement("div"),y.appendChild(c),u=u.replace(dt,"<$1></$2>"),a=(vt.exec(u)||["",""])[1].toLowerCase(),f=Nt[a]||Nt._default,l=f[0],c.innerHTML=f[1]+u+f[2];while(l--)c=c.lastChild;if(!v.support.tbody){h=mt.test(u),p=a==="table"&&!h?c.firstChild&&c.firstChild.childNodes:f[1]==="<table>"&&!h?c.childNodes:[];for(o=p.length-1;o>=0;--o)v.nodeName(p[o],"tbody")&&!p[o].childNodes.length&&p[o].parentNode.removeChild(p[o])}!v.support.leadingWhitespace&&pt.test(u)&&c.insertBefore(t.createTextNode(pt.exec(u)[0]),c.firstChild),u=c.childNodes,c.parentNode.removeChild(c)}u.nodeType?b.push(u):v.merge(b,u)}c&&(u=c=y=null);if(!v.support.appendChecked)for(s=0;(u=b[s])!=null;s++)v.nodeName(u,"input")?_t(u):typeof u.getElementsByTagName!="undefined"&&v.grep(u.getElementsByTagName("input"),_t);if(n){m=function(e){if(!e.type||xt.test(e.type))return r?r.push(e.parentNode?e.parentNode.removeChild(e):e):n.appendChild(e)};for(s=0;(u=b[s])!=null;s++)if(!v.nodeName(u,"script")||!m(u))n.appendChild(u),typeof u.getElementsByTagName!="undefined"&&(g=v.grep(v.merge([],u.getElementsByTagName("script")),m),b.splice.apply(b,[s+1,0].concat(g)),s+=g.length)}return b},cleanData:function(e,t){var n,r,i,s,o=0,u=v.expando,a=v.cache,f=v.support.deleteExpando,l=v.event.special;for(;(i=e[o])!=null;o++)if(t||v.acceptData(i)){r=i[u],n=r&&a[r];if(n){if(n.events)for(s in n.events)l[s]?v.event.remove(i,s):v.removeEvent(i,s,n.handle);a[r]&&(delete a[r],f?delete i[u]:i.removeAttribute?i.removeAttribute(u):i[u]=null,v.deletedIds.push(r))}}}}),function(){var e,t;v.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e=v.uaMatch(o.userAgent),t={},e.browser&&(t[e.browser]=!0,t.version=e.version),t.chrome?t.webkit=!0:t.webkit&&(t.safari=!0),v.browser=t,v.sub=function(){function e(t,n){return new e.fn.init(t,n)}v.extend(!0,e,this),e.superclass=this,e.fn=e.prototype=this(),e.fn.constructor=e,e.sub=this.sub,e.fn.init=function(r,i){return i&&i instanceof v&&!(i instanceof e)&&(i=e(i)),v.fn.init.call(this,r,i,t)},e.fn.init.prototype=e.fn;var t=e(i);return e}}();var Dt,Pt,Ht,Bt=/alpha\([^)]*\)/i,jt=/opacity=([^)]*)/,Ft=/^(top|right|bottom|left)$/,It=/^(none|table(?!-c[ea]).+)/,qt=/^margin/,Rt=new RegExp("^("+m+")(.*)$","i"),Ut=new RegExp("^("+m+")(?!px)[a-z%]+$","i"),zt=new RegExp("^([-+])=("+m+")","i"),Wt={BODY:"block"},Xt={position:"absolute",visibility:"hidden",display:"block"},Vt={letterSpacing:0,fontWeight:400},$t=["Top","Right","Bottom","Left"],Jt=["Webkit","O","Moz","ms"],Kt=v.fn.toggle;v.fn.extend({css:function(e,n){return v.access(this,function(e,n,r){return r!==t?v.style(e,n,r):v.css(e,n)},e,n,arguments.length>1)},show:function(){return Yt(this,!0)},hide:function(){return Yt(this)},toggle:function(e,t){var n=typeof e=="boolean";return v.isFunction(e)&&v.isFunction(t)?Kt.apply(this,arguments):this.each(function(){(n?e:Gt(this))?v(this).show():v(this).hide()})}}),v.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Dt(e,"opacity");return n===""?"1":n}}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":v.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(!e||e.nodeType===3||e.nodeType===8||!e.style)return;var s,o,u,a=v.camelCase(n),f=e.style;n=v.cssProps[a]||(v.cssProps[a]=Qt(f,a)),u=v.cssHooks[n]||v.cssHooks[a];if(r===t)return u&&"get"in u&&(s=u.get(e,!1,i))!==t?s:f[n];o=typeof r,o==="string"&&(s=zt.exec(r))&&(r=(s[1]+1)*s[2]+parseFloat(v.css(e,n)),o="number");if(r==null||o==="number"&&isNaN(r))return;o==="number"&&!v.cssNumber[a]&&(r+="px");if(!u||!("set"in u)||(r=u.set(e,r,i))!==t)try{f[n]=r}catch(l){}},css:function(e,n,r,i){var s,o,u,a=v.camelCase(n);return n=v.cssProps[a]||(v.cssProps[a]=Qt(e.style,a)),u=v.cssHooks[n]||v.cssHooks[a],u&&"get"in u&&(s=u.get(e,!0,i)),s===t&&(s=Dt(e,n)),s==="normal"&&n in Vt&&(s=Vt[n]),r||i!==t?(o=parseFloat(s),r||v.isNumeric(o)?o||0:s):s},swap:function(e,t,n){var r,i,s={};for(i in t)s[i]=e.style[i],e.style[i]=t[i];r=n.call(e);for(i in t)e.style[i]=s[i];return r}}),e.getComputedStyle?Dt=function(t,n){var r,i,s,o,u=e.getComputedStyle(t,null),a=t.style;return u&&(r=u.getPropertyValue(n)||u[n],r===""&&!v.contains(t.ownerDocument,t)&&(r=v.style(t,n)),Ut.test(r)&&qt.test(n)&&(i=a.width,s=a.minWidth,o=a.maxWidth,a.minWidth=a.maxWidth=a.width=r,r=u.width,a.width=i,a.minWidth=s,a.maxWidth=o)),r}:i.documentElement.currentStyle&&(Dt=function(e,t){var n,r,i=e.currentStyle&&e.currentStyle[t],s=e.style;return i==null&&s&&s[t]&&(i=s[t]),Ut.test(i)&&!Ft.test(t)&&(n=s.left,r=e.runtimeStyle&&e.runtimeStyle.left,r&&(e.runtimeStyle.left=e.currentStyle.left),s.left=t==="fontSize"?"1em":i,i=s.pixelLeft+"px",s.left=n,r&&(e.runtimeStyle.left=r)),i===""?"auto":i}),v.each(["height","width"],function(e,t){v.cssHooks[t]={get:function(e,n,r){if(n)return e.offsetWidth===0&&It.test(Dt(e,"display"))?v.swap(e,Xt,function(){return tn(e,t,r)}):tn(e,t,r)},set:function(e,n,r){return Zt(e,n,r?en(e,t,r,v.support.boxSizing&&v.css(e,"boxSizing")==="border-box"):0)}}}),v.support.opacity||(v.cssHooks.opacity={get:function(e,t){return jt.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=v.isNumeric(t)?"alpha(opacity="+t*100+")":"",s=r&&r.filter||n.filter||"";n.zoom=1;if(t>=1&&v.trim(s.replace(Bt,""))===""&&n.removeAttribute){n.removeAttribute("filter");if(r&&!r.filter)return}n.filter=Bt.test(s)?s.replace(Bt,i):s+" "+i}}),v(function(){v.support.reliableMarginRight||(v.cssHooks.marginRight={get:function(e,t){return v.swap(e,{display:"inline-block"},function(){if(t)return Dt(e,"marginRight")})}}),!v.support.pixelPosition&&v.fn.position&&v.each(["top","left"],function(e,t){v.cssHooks[t]={get:function(e,n){if(n){var r=Dt(e,t);return Ut.test(r)?v(e).position()[t]+"px":r}}}})}),v.expr&&v.expr.filters&&(v.expr.filters.hidden=function(e){return e.offsetWidth===0&&e.offsetHeight===0||!v.support.reliableHiddenOffsets&&(e.style&&e.style.display||Dt(e,"display"))==="none"},v.expr.filters.visible=function(e){return!v.expr.filters.hidden(e)}),v.each({margin:"",padding:"",border:"Width"},function(e,t){v.cssHooks[e+t]={expand:function(n){var r,i=typeof n=="string"?n.split(" "):[n],s={};for(r=0;r<4;r++)s[e+$t[r]+t]=i[r]||i[r-2]||i[0];return s}},qt.test(e)||(v.cssHooks[e+t].set=Zt)});var rn=/%20/g,sn=/\[\]$/,on=/\r?\n/g,un=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,an=/^(?:select|textarea)/i;v.fn.extend({serialize:function(){return v.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?v.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||an.test(this.nodeName)||un.test(this.type))}).map(function(e,t){var n=v(this).val();return n==null?null:v.isArray(n)?v.map(n,function(e,n){return{name:t.name,value:e.replace(on,"\r\n")}}):{name:t.name,value:n.replace(on,"\r\n")}}).get()}}),v.param=function(e,n){var r,i=[],s=function(e,t){t=v.isFunction(t)?t():t==null?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};n===t&&(n=v.ajaxSettings&&v.ajaxSettings.traditional);if(v.isArray(e)||e.jquery&&!v.isPlainObject(e))v.each(e,function(){s(this.name,this.value)});else for(r in e)fn(r,e[r],n,s);return i.join("&").replace(rn,"+")};var ln,cn,hn=/#.*$/,pn=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,dn=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,vn=/^(?:GET|HEAD)$/,mn=/^\/\//,gn=/\?/,yn=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bn=/([?&])_=[^&]*/,wn=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,En=v.fn.load,Sn={},xn={},Tn=["*/"]+["*"];try{cn=s.href}catch(Nn){cn=i.createElement("a"),cn.href="",cn=cn.href}ln=wn.exec(cn.toLowerCase())||[],v.fn.load=function(e,n,r){if(typeof e!="string"&&En)return En.apply(this,arguments);if(!this.length)return this;var i,s,o,u=this,a=e.indexOf(" ");return a>=0&&(i=e.slice(a,e.length),e=e.slice(0,a)),v.isFunction(n)?(r=n,n=t):n&&typeof n=="object"&&(s="POST"),v.ajax({url:e,type:s,dataType:"html",data:n,complete:function(e,t){r&&u.each(r,o||[e.responseText,t,e])}}).done(function(e){o=arguments,u.html(i?v("<div>").append(e.replace(yn,"")).find(i):e)}),this},v.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(e,t){v.fn[t]=function(e){return this.on(t,e)}}),v.each(["get","post"],function(e,n){v[n]=function(e,r,i,s){return v.isFunction(r)&&(s=s||i,i=r,r=t),v.ajax({type:n,url:e,data:r,success:i,dataType:s})}}),v.extend({getScript:function(e,n){return v.get(e,t,n,"script")},getJSON:function(e,t,n){return v.get(e,t,n,"json")},ajaxSetup:function(e,t){return t?Ln(e,v.ajaxSettings):(t=e,e=v.ajaxSettings),Ln(e,t),e},ajaxSettings:{url:cn,isLocal:dn.test(ln[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":Tn},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":e.String,"text html":!0,"text json":v.parseJSON,"text xml":v.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:Cn(Sn),ajaxTransport:Cn(xn),ajax:function(e,n){function T(e,n,s,a){var l,y,b,w,S,T=n;if(E===2)return;E=2,u&&clearTimeout(u),o=t,i=a||"",x.readyState=e>0?4:0,s&&(w=An(c,x,s));if(e>=200&&e<300||e===304)c.ifModified&&(S=x.getResponseHeader("Last-Modified"),S&&(v.lastModified[r]=S),S=x.getResponseHeader("Etag"),S&&(v.etag[r]=S)),e===304?(T="notmodified",l=!0):(l=On(c,w),T=l.state,y=l.data,b=l.error,l=!b);else{b=T;if(!T||e)T="error",e<0&&(e=0)}x.status=e,x.statusText=(n||T)+"",l?d.resolveWith(h,[y,T,x]):d.rejectWith(h,[x,T,b]),x.statusCode(g),g=t,f&&p.trigger("ajax"+(l?"Success":"Error"),[x,c,l?y:b]),m.fireWith(h,[x,T]),f&&(p.trigger("ajaxComplete",[x,c]),--v.active||v.event.trigger("ajaxStop"))}typeof e=="object"&&(n=e,e=t),n=n||{};var r,i,s,o,u,a,f,l,c=v.ajaxSetup({},n),h=c.context||c,p=h!==c&&(h.nodeType||h instanceof v)?v(h):v.event,d=v.Deferred(),m=v.Callbacks("once memory"),g=c.statusCode||{},b={},w={},E=0,S="canceled",x={readyState:0,setRequestHeader:function(e,t){if(!E){var n=e.toLowerCase();e=w[n]=w[n]||e,b[e]=t}return this},getAllResponseHeaders:function(){return E===2?i:null},getResponseHeader:function(e){var n;if(E===2){if(!s){s={};while(n=pn.exec(i))s[n[1].toLowerCase()]=n[2]}n=s[e.toLowerCase()]}return n===t?null:n},overrideMimeType:function(e){return E||(c.mimeType=e),this},abort:function(e){return e=e||S,o&&o.abort(e),T(0,e),this}};d.promise(x),x.success=x.done,x.error=x.fail,x.complete=m.add,x.statusCode=function(e){if(e){var t;if(E<2)for(t in e)g[t]=[g[t],e[t]];else t=e[x.status],x.always(t)}return this},c.url=((e||c.url)+"").replace(hn,"").replace(mn,ln[1]+"//"),c.dataTypes=v.trim(c.dataType||"*").toLowerCase().split(y),c.crossDomain==null&&(a=wn.exec(c.url.toLowerCase()),c.crossDomain=!(!a||a[1]===ln[1]&&a[2]===ln[2]&&(a[3]||(a[1]==="http:"?80:443))==(ln[3]||(ln[1]==="http:"?80:443)))),c.data&&c.processData&&typeof c.data!="string"&&(c.data=v.param(c.data,c.traditional)),kn(Sn,c,n,x);if(E===2)return x;f=c.global,c.type=c.type.toUpperCase(),c.hasContent=!vn.test(c.type),f&&v.active++===0&&v.event.trigger("ajaxStart");if(!c.hasContent){c.data&&(c.url+=(gn.test(c.url)?"&":"?")+c.data,delete c.data),r=c.url;if(c.cache===!1){var N=v.now(),C=c.url.replace(bn,"$1_="+N);c.url=C+(C===c.url?(gn.test(c.url)?"&":"?")+"_="+N:"")}}(c.data&&c.hasContent&&c.contentType!==!1||n.contentType)&&x.setRequestHeader("Content-Type",c.contentType),c.ifModified&&(r=r||c.url,v.lastModified[r]&&x.setRequestHeader("If-Modified-Since",v.lastModified[r]),v.etag[r]&&x.setRequestHeader("If-None-Match",v.etag[r])),x.setRequestHeader("Accept",c.dataTypes[0]&&c.accepts[c.dataTypes[0]]?c.accepts[c.dataTypes[0]]+(c.dataTypes[0]!=="*"?", "+Tn+"; q=0.01":""):c.accepts["*"]);for(l in c.headers)x.setRequestHeader(l,c.headers[l]);if(!c.beforeSend||c.beforeSend.call(h,x,c)!==!1&&E!==2){S="abort";for(l in{success:1,error:1,complete:1})x[l](c[l]);o=kn(xn,c,n,x);if(!o)T(-1,"No Transport");else{x.readyState=1,f&&p.trigger("ajaxSend",[x,c]),c.async&&c.timeout>0&&(u=setTimeout(function(){x.abort("timeout")},c.timeout));try{E=1,o.send(b,T)}catch(k){if(!(E<2))throw k;T(-1,k)}}return x}return x.abort()},active:0,lastModified:{},etag:{}});var Mn=[],_n=/\?/,Dn=/(=)\?(?=&|$)|\?\?/,Pn=v.now();v.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Mn.pop()||v.expando+"_"+Pn++;return this[e]=!0,e}}),v.ajaxPrefilter("json jsonp",function(n,r,i){var s,o,u,a=n.data,f=n.url,l=n.jsonp!==!1,c=l&&Dn.test(f),h=l&&!c&&typeof a=="string"&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Dn.test(a);if(n.dataTypes[0]==="jsonp"||c||h)return s=n.jsonpCallback=v.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,o=e[s],c?n.url=f.replace(Dn,"$1"+s):h?n.data=a.replace(Dn,"$1"+s):l&&(n.url+=(_n.test(f)?"&":"?")+n.jsonp+"="+s),n.converters["script json"]=function(){return u||v.error(s+" was not called"),u[0]},n.dataTypes[0]="json",e[s]=function(){u=arguments},i.always(function(){e[s]=o,n[s]&&(n.jsonpCallback=r.jsonpCallback,Mn.push(s)),u&&v.isFunction(o)&&o(u[0]),u=o=t}),"script"}),v.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(e){return v.globalEval(e),e}}}),v.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),v.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=i.head||i.getElementsByTagName("head")[0]||i.documentElement;return{send:function(s,o){n=i.createElement("script"),n.async="async",e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,i){if(i||!n.readyState||/loaded|complete/.test(n.readyState))n.onload=n.onreadystatechange=null,r&&n.parentNode&&r.removeChild(n),n=t,i||o(200,"success")},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(0,1)}}}});var Hn,Bn=e.ActiveXObject?function(){for(var e in Hn)Hn[e](0,1)}:!1,jn=0;v.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&Fn()||In()}:Fn,function(e){v.extend(v.support,{ajax:!!e,cors:!!e&&"withCredentials"in e})}(v.ajaxSettings.xhr()),v.support.ajax&&v.ajaxTransport(function(n){if(!n.crossDomain||v.support.cors){var r;return{send:function(i,s){var o,u,a=n.xhr();n.username?a.open(n.type,n.url,n.async,n.username,n.password):a.open(n.type,n.url,n.async);if(n.xhrFields)for(u in n.xhrFields)a[u]=n.xhrFields[u];n.mimeType&&a.overrideMimeType&&a.overrideMimeType(n.mimeType),!n.crossDomain&&!i["X-Requested-With"]&&(i["X-Requested-With"]="XMLHttpRequest");try{for(u in i)a.setRequestHeader(u,i[u])}catch(f){}a.send(n.hasContent&&n.data||null),r=function(e,i){var u,f,l,c,h;try{if(r&&(i||a.readyState===4)){r=t,o&&(a.onreadystatechange=v.noop,Bn&&delete Hn[o]);if(i)a.readyState!==4&&a.abort();else{u=a.status,l=a.getAllResponseHeaders(),c={},h=a.responseXML,h&&h.documentElement&&(c.xml=h);try{c.text=a.responseText}catch(p){}try{f=a.statusText}catch(p){f=""}!u&&n.isLocal&&!n.crossDomain?u=c.text?200:404:u===1223&&(u=204)}}}catch(d){i||s(-1,d)}c&&s(u,f,c,l)},n.async?a.readyState===4?setTimeout(r,0):(o=++jn,Bn&&(Hn||(Hn={},v(e).unload(Bn)),Hn[o]=r),a.onreadystatechange=r):r()},abort:function(){r&&r(0,1)}}}});var qn,Rn,Un=/^(?:toggle|show|hide)$/,zn=new RegExp("^(?:([-+])=|)("+m+")([a-z%]*)$","i"),Wn=/queueHooks$/,Xn=[Gn],Vn={"*":[function(e,t){var n,r,i=this.createTween(e,t),s=zn.exec(t),o=i.cur(),u=+o||0,a=1,f=20;if(s){n=+s[2],r=s[3]||(v.cssNumber[e]?"":"px");if(r!=="px"&&u){u=v.css(i.elem,e,!0)||n||1;do a=a||".5",u/=a,v.style(i.elem,e,u+r);while(a!==(a=i.cur()/o)&&a!==1&&--f)}i.unit=r,i.start=u,i.end=s[1]?u+(s[1]+1)*n:n}return i}]};v.Animation=v.extend(Kn,{tweener:function(e,t){v.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;r<i;r++)n=e[r],Vn[n]=Vn[n]||[],Vn[n].unshift(t)},prefilter:function(e,t){t?Xn.unshift(e):Xn.push(e)}}),v.Tween=Yn,Yn.prototype={constructor:Yn,init:function(e,t,n,r,i,s){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=s||(v.cssNumber[n]?"":"px")},cur:function(){var e=Yn.propHooks[this.prop];return e&&e.get?e.get(this):Yn.propHooks._default.get(this)},run:function(e){var t,n=Yn.propHooks[this.prop];return this.options.duration?this.pos=t=v.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Yn.propHooks._default.set(this),this}},Yn.prototype.init.prototype=Yn.prototype,Yn.propHooks={_default:{get:function(e){var t;return e.elem[e.prop]==null||!!e.elem.style&&e.elem.style[e.prop]!=null?(t=v.css(e.elem,e.prop,!1,""),!t||t==="auto"?0:t):e.elem[e.prop]},set:function(e){v.fx.step[e.prop]?v.fx.step[e.prop](e):e.elem.style&&(e.elem.style[v.cssProps[e.prop]]!=null||v.cssHooks[e.prop])?v.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},Yn.propHooks.scrollTop=Yn.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},v.each(["toggle","show","hide"],function(e,t){var n=v.fn[t];v.fn[t]=function(r,i,s){return r==null||typeof r=="boolean"||!e&&v.isFunction(r)&&v.isFunction(i)?n.apply(this,arguments):this.animate(Zn(t,!0),r,i,s)}}),v.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Gt).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=v.isEmptyObject(e),s=v.speed(t,n,r),o=function(){var t=Kn(this,v.extend({},e),s);i&&t.stop(!0)};return i||s.queue===!1?this.each(o):this.queue(s.queue,o)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return typeof e!="string"&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=e!=null&&e+"queueHooks",s=v.timers,o=v._data(this);if(n)o[n]&&o[n].stop&&i(o[n]);else for(n in o)o[n]&&o[n].stop&&Wn.test(n)&&i(o[n]);for(n=s.length;n--;)s[n].elem===this&&(e==null||s[n].queue===e)&&(s[n].anim.stop(r),t=!1,s.splice(n,1));(t||!r)&&v.dequeue(this,e)})}}),v.each({slideDown:Zn("show"),slideUp:Zn("hide"),slideToggle:Zn("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){v.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),v.speed=function(e,t,n){var r=e&&typeof e=="object"?v.extend({},e):{complete:n||!n&&t||v.isFunction(e)&&e,duration:e,easing:n&&t||t&&!v.isFunction(t)&&t};r.duration=v.fx.off?0:typeof r.duration=="number"?r.duration:r.duration in v.fx.speeds?v.fx.speeds[r.duration]:v.fx.speeds._default;if(r.queue==null||r.queue===!0)r.queue="fx";return r.old=r.complete,r.complete=function(){v.isFunction(r.old)&&r.old.call(this),r.queue&&v.dequeue(this,r.queue)},r},v.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},v.timers=[],v.fx=Yn.prototype.init,v.fx.tick=function(){var e,n=v.timers,r=0;qn=v.now();for(;r<n.length;r++)e=n[r],!e()&&n[r]===e&&n.splice(r--,1);n.length||v.fx.stop(),qn=t},v.fx.timer=function(e){e()&&v.timers.push(e)&&!Rn&&(Rn=setInterval(v.fx.tick,v.fx.interval))},v.fx.interval=13,v.fx.stop=function(){clearInterval(Rn),Rn=null},v.fx.speeds={slow:600,fast:200,_default:400},v.fx.step={},v.expr&&v.expr.filters&&(v.expr.filters.animated=function(e){return v.grep(v.timers,function(t){return e===t.elem}).length});var er=/^(?:body|html)$/i;v.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){v.offset.setOffset(this,e,t)});var n,r,i,s,o,u,a,f={top:0,left:0},l=this[0],c=l&&l.ownerDocument;if(!c)return;return(r=c.body)===l?v.offset.bodyOffset(l):(n=c.documentElement,v.contains(n,l)?(typeof l.getBoundingClientRect!="undefined"&&(f=l.getBoundingClientRect()),i=tr(c),s=n.clientTop||r.clientTop||0,o=n.clientLeft||r.clientLeft||0,u=i.pageYOffset||n.scrollTop,a=i.pageXOffset||n.scrollLeft,{top:f.top+u-s,left:f.left+a-o}):f)},v.offset={bodyOffset:function(e){var t=e.offsetTop,n=e.offsetLeft;return v.support.doesNotIncludeMarginInBodyOffset&&(t+=parseFloat(v.css(e,"marginTop"))||0,n+=parseFloat(v.css(e,"marginLeft"))||0),{top:t,left:n}},setOffset:function(e,t,n){var r=v.css(e,"position");r==="static"&&(e.style.position="relative");var i=v(e),s=i.offset(),o=v.css(e,"top"),u=v.css(e,"left"),a=(r==="absolute"||r==="fixed")&&v.inArray("auto",[o,u])>-1,f={},l={},c,h;a?(l=i.position(),c=l.top,h=l.left):(c=parseFloat(o)||0,h=parseFloat(u)||0),v.isFunction(t)&&(t=t.call(e,n,s)),t.top!=null&&(f.top=t.top-s.top+c),t.left!=null&&(f.left=t.left-s.left+h),"using"in t?t.using.call(e,f):i.css(f)}},v.fn.extend({position:function(){if(!this[0])return;var e=this[0],t=this.offsetParent(),n=this.offset(),r=er.test(t[0].nodeName)?{top:0,left:0}:t.offset();return n.top-=parseFloat(v.css(e,"marginTop"))||0,n.left-=parseFloat(v.css(e,"marginLeft"))||0,r.top+=parseFloat(v.css(t[0],"borderTopWidth"))||0,r.left+=parseFloat(v.css(t[0],"borderLeftWidth"))||0,{top:n.top-r.top,left:n.left-r.left}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||i.body;while(e&&!er.test(e.nodeName)&&v.css(e,"position")==="static")e=e.offsetParent;return e||i.body})}}),v.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);v.fn[e]=function(i){return v.access(this,function(e,i,s){var o=tr(e);if(s===t)return o?n in o?o[n]:o.document.documentElement[i]:e[i];o?o.scrollTo(r?v(o).scrollLeft():s,r?s:v(o).scrollTop()):e[i]=s},e,i,arguments.length,null)}}),v.each({Height:"height",Width:"width"},function(e,n){v.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){v.fn[i]=function(i,s){var o=arguments.length&&(r||typeof i!="boolean"),u=r||(i===!0||s===!0?"margin":"border");return v.access(this,function(n,r,i){var s;return v.isWindow(n)?n.document.documentElement["client"+e]:n.nodeType===9?(s=n.documentElement,Math.max(n.body["scroll"+e],s["scroll"+e],n.body["offset"+e],s["offset"+e],s["client"+e])):i===t?v.css(n,r,i,u):v.style(n,r,i,u)},n,o?i:t,o,null)}})}),e.jQuery=e.$=v,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return v})})(window);


$.extend($.easing,{
	 easeIn: function (x, t, b, c, d){
		 return c*(t/=d)*t*t + b;
	 },
	 easeOut: function (x, t, b, c, d){
		 return c*((t=t/d-1)*t*t + 1) + b;
	 },
	 easeInOut: function(t,b,c,d){
		 if ((t/=d/2) < 1) return c/2*t*t + b;
		 return -c/2 * ((--t)*(t-2) - 1) + b;
	 }
 }); 


/*********全局脚本*****************神奇的分割符************************************************/
/**************************start:高考频道脚本************************************************/
var jsgaokao_list="";
var jsgaokao_gz=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_gaokao.js"></script>'
				].join('');
var jsgaokao_bj=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_gaokao-bj.js"></script>'
				].join('');
var jsgaokao_cd=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_gaokao-cd.js"></script>'
				].join('');
var jsgaokao_sh=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_gaokao-sh.js"></script>'
				].join('');
/**************************end:高考频道脚本************************************************/
/**************************start:小升初************************************************/
var jsxsc_gad=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_xsc.js"></script>'
				   ].join('');
var jsxsc_gad_sz=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_xsc-sz.js"></script>'
				   ].join('');
var jsxsc_gad_cd=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_xsc-cd.js"></script>'
				   ].join('');
var jsxsc_gad_bj=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_xsc-bj.js"></script>'
				   ].join('');
var jsxsc_gad_sh=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_xsc-sh.js"></script>'
				   ].join('');
/**************************end:小升初************************************************/
/**************************start:中考************************************************/
var jszhongkao_gad_gz=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_zhongkao.js"></script>'
				   ].join('');
var jszhongkao_gad_cd=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_zhongkao-cd.js"></script>'
				   ].join('');
var jszhongkao_gad_bj=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_zhongkao-bj.js"></script>'
				   ].join('');
var jszhongkao_gad_sh=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_zhongkao-sh.js"></script>'
				   ].join('');
var jszhongkao_gad_sz=[
					'<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_zhongkao-sz.js"></script>'
				   ].join('');
/**************************end:中考************************************************/
/**首页脚本**/
var jsindex = [
				 '<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/gad_index.js"></script>'
                ].join('');


/**
* @create:     wenlianlong
* @rotatelist  加载广告脚本
* @page 页面模块
* @page_column 栏目名称
* @city 地区简称
* @调用方式	
    gaofen_app_ad_js(page, page_column,city)
*/
function gaofen_app_ad_js(page, page_column,city){	
	//页面广告位是否出现，后端输出topAd参数控制
	var topAd = Gaofen.PD.get('topAd');
	if ( (typeof topAd === 'undefined' || topAd  == '1') && page != null && page != 'undefined') {
        if (page_column != null && page_column != 'undefined') {
			if (city != null && city != 'undefined') {
				switch (page) {
					case 'gaokao':
						 switch (page_column) {
							case 'list':
								switch (city) {
									case 'gz':
										document.write(jsgaokao_gz);
										break;
									case 'bj':
										document.write(jsgaokao_bj);
										break;
									case 'cd':
										document.write(jsgaokao_cd);
										break;
									case 'sh':
										document.write(jsgaokao_sh);
										break;
									case 'school':
										document.write(jsgaokao_school);
										break;
								}
								break;
						}
					break;					
					case 'xsc':
						switch (page_column) {
							case 'list':
								switch (city) {
									case 'gz':
										document.write(jsxsc_gad);
										break;
									case 'sz':
										document.write(jsxsc_gad_sz);
										break;
									case 'cd':
										document.write(jsxsc_gad_cd);
										break;
									case 'bj':
										document.write(jsxsc_gad_bj);
										break;
									case 'sh':
										document.write(jsxsc_gad_sh);
										break;
							    }
							break;
					   }
					break;
					case 'zhongkao':
						switch (page_column) {
							case 'list':
								switch (city) {
									case 'gz':
										document.write(jszhongkao_gad_gz);
										break;
									case 'sz':
										document.write(jszhongkao_gad_sz);
										break;
									case 'cd':
										document.write(jszhongkao_gad_cd);
										break;
									case 'bj':
										document.write(jszhongkao_gad_bj);
										break;
									case 'sh':
										document.write(jszhongkao_gad_sh);
										break;
							    }
							break;
					   }
					break;
					case 'index':
						switch (page_column) {
							case 'list':
								switch (city) {
									case 'gz':
										document.write(jsindex);
										break;
							    }
							break;
					   }
					break;
				}
			}
		}
	}
}


/*
 *@create: lianlong
 *@description 设置cookie
 *@date: 2011/1/5
 */
function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
    var expires = new Date();
    expires.setTime(expires.getTime() + seconds);
    document.cookie = cookieName + '=' + encodeURIComponent(cookieValue)
    + (expires ? '; expires=' + expires.toGMTString() : '')
    + (path ? '; path=' + path : '/')
    + (domain ? '; domain=' + domain : '')
    + (secure ? '; secure' : '');
}

/*
 *@create: lianlong
 *@description 读取cookie
 *@date: 2011/1/5
 */
function getcookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
 /**
 * @create: wenlianlong
 * @info	返回顶部
 * @调用方式	
   addBackToTopTips()
 */
$.fn.extend({
	addBackToTopTips : function(){		
		var toTop = $('<a title="返回顶部" class="gotop" href="javascript:void(0);" onfocus="this.blur();">返回顶部</a>').hide();
		var pt;
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
			$('.gotop').css({'top':th+ah});
		} 		
		if($(this).scrollTop()>0)
			$('.gotop').fadeIn(500);
		$(window).scroll(function(){
			var sh=$(this).scrollTop();		
			if(sh>200){
				$('.gotop').fadeIn(500);			
			}else{
				$('.gotop').fadeOut(500);
			}
		});
	}
});


$.fn.mail_lenovo=function(options){
	return this.each(function(){
		var $me=$(this);
		var _menu=$("<div class='drop-menu'><p>请选择您的邮箱类型...</p></div>")
		var mail_list=["@qq.com","@163.com","@126.com","@sina.com.cn","@hotmail.com","@sohu.com","@gmail.com"];
		var ul_list=$("<ul></ul>")
		var valkey="";
		$me.bind("keyup",function(e){
			if(e.which==40){//向下键
				var ul_obj=$(".drop-menu").find("ul");
				var data_length=ul_obj.find("li").length;
				if(data_length>0){
					$(".drop-menu").removeClass('hidden')
					var caretPos = -1;
					var li_obj_selected = ul_obj.find("li[flag='1']");
					caretPos = li_obj_selected.attr("index");
					caretPos++;
					if (caretPos >= data_length) {
	                    caretPos = 0;
	                 }
					ul_obj.find("li").each(function () {
	                    $(this).removeClass("active").attr({
	                        flag: "0"
	                    });
	                });
					if(li_obj_selected.length==0){
						ul_obj.find("li:first").attr("flag",1).addClass("active");
					}
	                ul_obj.find("li[index='" + caretPos + "']").attr({
	                    flag: "1"
	                }).addClass("active")
				}
			}else if(e.which==38){//向上键
				var ul_obj=$(".drop-menu").find("ul");
				var data_length=ul_obj.find("li").length;
				if(data_length>0){
					$(".drop-menu").removeClass('hidden')
					var caretPos = -1;
					var li_obj_selected = ul_obj.find("li[flag='1']");
					caretPos = li_obj_selected.attr("index");
					caretPos--;
					 if (caretPos<0) {
	                    caretPos = data_length-1;
	                 }
					ul_obj.find("li").each(function () {
	                    $(this).removeClass("active").attr({
	                        flag: "0"
	                    });
	                });
					if(li_obj_selected.length==0){
						ul_obj.find("li:first").attr("flag",1).addClass("active");
					}
	                ul_obj.find("li[index='" + caretPos + "']").attr({
	                    flag: "1"
	                }).addClass("active")
				}
			}else if(e.which==13){
				if(_menu.find("li[flag='1']").length>0){
					$me.val(_menu.find("li[flag='1']").html());
					_menu.addClass("hidden")
					var _maill=$("input[id='to']").val();
					if(_maill!="" && /.+@.+\.[a-zA-Z]{2,4}$/.test(_maill)){
						$me.parent(".form-row").removeClass("error")
						$me.parent(".form-row").find(".help-inline").addClass("hidden");
						$me.trigger("blur");
					}
					return false;
				}
			}
			var _val=$.trim($me.val().replace(/[ ]/g,""));			    
			if(valkey==$.trim($(this).val().replace(/[ ]/g,""))){//判断输入跟上次是否相同
				return false;
			}
			if(_val.length>0){	
				valkey=_val;
				_menu.removeClass("hidden");
				ul_list.find("li").remove();
				//reg = '@\w+'
				if(_val.indexOf("@")!="-1"){
					var str_last=_val.substring(_val.indexOf("@"));
					if(str_last=="@"){
						$.each(mail_list,function(key,value){
							ul_list.append("<li flag='0' index='"+key+"'>"+_val.replace("@","")+value+"</li>");
						});
					}else{
						var s_index=0;
						$.each(mail_list,function(key,value){
							var arrMactches = value.match(str_last);
							if (arrMactches) {
							   ul_list.append("<li flag='0' index='"+s_index+"'>"+_val.replace(str_last,"")+value+"</li>");
							   s_index++;
						   }
						})
					}
				}else{
					$.each(mail_list,function(key,value){
						ul_list.append("<li flag='0' index='"+key+"'>"+_val+value+"</li>");
					})
				}	
				_menu.append(ul_list);
				var hover_index="-1"
				ul_list.find("li").bind("click",function(){
					$me.val($(this).html());
					_menu.addClass("hidden");
					$me.trigger("blur");
				}).bind("mouseenter",function(){
					if($(this).hasClass("active"))
						hover_index=$(this).index();
					$(this).addClass("active");
				}).bind("mouseleave",function(){					
					$(this).removeClass("active");
					if(hover_index>=0){
						ul_list.find("li").eq(hover_index).addClass("active")
						hover_index="-1"
					}
				})
				$me.parents(".form-row").append(_menu);
			}else{
				_menu.addClass("hidden")
			};	
				
		}).bind("focus",function(){
			var _value=$me.val(),
				_tip="请输入您的邮箱";
			if(_value==_tip){
				$me.val('')
			}
			$me.addClass("focus");

		}).bind("blur",function(){
			var _value=$me.val(),
				_tip="请输入您的邮箱";
			if($.trim(_value.replace(/[ ]/g,""))==""){
				$me.val(_tip)
			}
			$me.removeClass("focus")
		});	
	})
}
/**
 * @create: ouli
 * @hoverDelay 浮动菜单
 * @调用方式	
   $.fn.hoverDelay({
		hoverDuring: 300, //菜单展示速度
		outDuring: 100, //菜单消失速度
		hoverEvent: "", //鼠标移动上去事情
		outEvent: "" //鼠标离开事件
   })
 */
$.fn.hoverDelay = function(options){
	var defaults = {
		hoverDuring: 300,
		outDuring: 100,
		hoverEvent: "",
		outEvent: ""
	};
	var options = $.extend({}, $.fn.hoverDelay.defaults, options);	
	var hoverTimer, outTimer;
	var obj = $(this);
	return obj.each(function(){
		obj.hover(function(){
			clearTimeout(outTimer);
			hoverTimer = setTimeout(options.hoverEvent, options.hoverDuring);
		},function(){
			clearTimeout(hoverTimer);
			outTimer = setTimeout(options.outEvent, options.outDuring);
		});
	});
};

/**
 * zhiwen
 * @slideScroll 幻灯片切换
 * @调用方式	
   $.fn.slideScroll({
		effect:'fadeOut',//动画方式
		target:"div",//目标项
		isauto:auto,//自动播放
		speed:speed,//播放时间
		active:"active"
   })
 */

$.fn.slideScroll = function(param){
		var	opt = $.extend({
			effect : 'fadeOut',//动画方式
			target : "div",//目标项
			eventType : 'over',
			overStop : true,//
			isauto : true,//自动播放
			speed : 3000,//播放时间
			effectTime : 300,//过度效果时间
			active : "active",
			children : '',//单元集
			controlType : 2,
			hasControl : true, //是否有控制器
			createControl : true,//是否自己创建控制器
			sliderControl : $('<ul class="pages"></ul>')
		}, param),
		
		jqview = this,
		viewMain = opt.viewMain || this,
		sliderControl = opt.sliderControl,
		controlType = opt.controlType,
		effect = opt.effect,
		target = opt.target,
		active = opt.active,//选中样式
		index = 0,
		oldIndex = 0,
		loadCount = 0,//图片加载           
		$me = opt.children || $(target,viewMain),
		imgLen = $me.length,
		turnLeft = opt.turnLeft,
		hasControl = opt.hasControl,
		turnRight = opt.turnRight,
		childWidth,
		turn,
		timer,
		runLock;//运行锁定
	//opt.speed = 15000;
	var init = function(){	
		if(effect === 'slide'){//滑动效果
			childWidth = $me.eq(0).width();
			viewMain.css({'width':childWidth * imgLen});
			turn = 'right';
		}
		
		//加控制器
		if(opt.createControl === true && controlType === 1){
			$me.not(":first").hide();
			var controls = [];
			$me.each(function(i){
				controls.push("<span>"+(++i)+"</span>");
				$(this).find("a").append("<span class='tit'><i class='bg'></i><em>"+$(this).find("a").attr("title")+"</em></span>");
			});
			sliderControl.append(controls.join(''));
			$me.css("position","absolute");  
			viewMain.after(sliderControl);
			$("span:first",sliderControl).addClass(active);				
		}
		
		if(opt.createControl === true && controlType === 2){
			var controls = [];
			$me.each(function(i){
				controls.push("<li >"+(++i)+"</li>");
			});
			sliderControl.append(controls.join(''));
			$("li:first",sliderControl).addClass(active);	
			viewMain.append(sliderControl);
		}
		

		if(imgLen < 2){//只有一张图片
			sliderControl.remove();
			return;
		}
		
		if(effect === 'fadeOut'){
			$me.css('position', 'absolute');
			if(hasControl){
				sliderControl.css('zIndex', 1);
			}
			$me.css({'zIndex':0, 'opacity':0, 'display': 'block'});
			$me.eq(index).css({'zIndex':'1', 'opacity':1});
		}
		
		if(hasControl){
			sliderControl.children().bind(opt.eventType === 'click' ? 'click' : 'mouseenter', function(){
				if(runLock) return;
				clearInterval(timer);
				var that = $(this);
				if(!that.hasClass(active)){
					oldIndex = index;
					index = that.index(); 
					animate(index);
				}
			});
		}

		if(jqview.attr('id').indexOf('sliderside') > -1){
			jqview.append('<span class="prev"></span><span class="next"></span>')
			turnLeft = jqview.find('span.prev');
			turnRight = jqview.find('span.next');
		}
		
		if(turnLeft){//左右按钮滚动
			turnLeft.click(function(){
				if(runLock) return;
				clearInterval(timer);
				oldIndex = index;
				--index;
				if(index === -1)
					index = imgLen - 1;
				turn = 'left';
				animate(index);
			});
			turnRight.click(function(){
				if(runLock) return;
				clearInterval(timer);
				setIndex();
				turn = 'right';
				animate(index);
			});
			
		}
		
		
		if(opt.overStop){
			jqview.bind("mouseenter",function(){
				clearTimeout(timer);
			}).bind("mouseleave",function(){
				if(opt.isauto)
					start();
			});
		}
		//加载完图片才运行
		if(imgLen>0){
			$("img",$me).each(function(){
				var imgObj = new Image();
				$(imgObj).load(function(){
					loadCount++;
					if(loadCount === imgLen)
						start();
				}).error(function(){//取不到图片隐藏滚动条
					sliderControl.hide();
				});
				imgObj.src = this.src;
			});
		}
	},

	setIndex = function(){
		oldIndex = index;
		index = ++index % imgLen;		
	},

	//切换效果
	animate = function(_index){
		if(_index === undefined){
			setIndex();
			_index = index;
		}
		switch (effect){
			case 'fadeOut':	 
				runLock = true;
				var showed = $me.eq(oldIndex), hided = $me.eq(_index);
				hided.css({opacity:1});
				showed.animate({opacity:0}, opt.effectTime, function(){
					showed.css("z-index",0);
					hided.css("z-index",1);
					runLock = false;
				});

			break;
			
			case 'slide' : //滑动效果
				var left = - childWidth * _index;
				if(_index === 0){
					if(turn === 'right'){
						$me.eq(0).css({'position':'relative','left': childWidth * imgLen});
						_index = imgLen;
						left = - childWidth * _index;
					}
				}
				
				if(_index === imgLen - 1){
					if(turn === 'left'){
						$me.eq(_index).css({'position':'relative','left': - childWidth * imgLen});
						left = childWidth;
					}
				}
				
				viewMain.animate({ left : left }, opt.effectTime, 'easeIn', function(){
					if(_index === imgLen && turn === 'right'){
						$me.eq(0).css({'position':'default','left':'0'});
						viewMain.css({'left':'0'});
					}
					if(_index === imgLen-1 && turn === 'left'){
						$me.eq(_index).css({'position':'default','left':'0'});
						viewMain.css({'left':- childWidth * (imgLen-1)});
					}
					turn = 'right';
				});
			break;
				
		}
		setControlStyle();
		
	},

	setControlStyle = function(){
		if(hasControl)
			sliderControl.children().eq(index).addClass(active).siblings().removeClass(active);//改变小图导航样式
	},


	start = function(){
		timer = setInterval( animate,  opt.speed);		
	};

	init();
}


/**
 * @fadeSlider	图片滑动播放插件函数
 * @调用方式	
   $.fn.gaofen_ui.fadeSlider({
		flashSliderPanel: "",//播放器的div容器
		controlsShow: true, //是否显示数字导航
		speed: 800, //滑动速度
		auto: true, //是否自定滑动
		pause: 2000, //两次滑动暂停时间持
		height: 0, //容器高度，不设置自动获取图片高度
		width: 0//容器宽度，不设置自动获取图片宽度
   })
 
$.fn.fadeSlider = function(options) {
	//默认值
    var defaults = {
        controlsShow: true, //是否显示数字导航
		effect: 1, //1表示浮现,2表示滑动
        speed: 800, //滑动速度
        auto: true, //是否自定滑动
        pause: 2000, //两次滑动暂停时间持
        height: 0, //容器高度，不设置自动获取图片高度
        width: 0 //容器宽度，不设置自动获取图片宽度
    }
	var options = $.extend({}, defaults, options);
	
	this.each(function() {
		var obj = $(this);
		var curr = 1; //当前索引
		var $img = obj.find(".thumb");
		var s = $img.length;
		var w = $img.eq(0).outerWidth();
		var h = $img.eq(0).outerHeight();
		var $flashelement = $(".thumbs", obj);
		options.height == 0 ? obj.height(h) : obj.height(options.height);
		options.width == 0 ? obj.width(w) : obj.width(options.width);
		if(s>0){
			obj.css({"position":"relative"});
			 $img.css({"position":"absolute","display":"none"})
			$(obj).find("a").append("<span class='tit'><i class='bg'></i><em>"+$img.first().find("img").attr("alt")+"</em></span>");
			if(options.controlsShow) {
				var navbtnhtml = '<div class="slider-control">';
				if(s>1){
					for (var i = 0; i < s; i++) {
						navbtnhtml += '<span>' + (i + 1) + '</span>';
					}
				}
				navbtnhtml += '</div>';
				obj.append(navbtnhtml);
				obj.find(".slider-control span").hover(function() {
					var num = Number($(this).html());
					flash(num, true, options.effect);
				}, function() {
					timeout = setTimeout(function() {
						flash((curr / 1 + 1), false, options.effect);
					}, options.pause);
				});
			};
			function setcurrnum(index) {
				if(s>1){
					obj.find(".slider-control span").eq(index).addClass('active').siblings().removeClass('active');
				}
			}
			function flash(index, clicked, effect) {
				$flashelement.stop();
				var next = index == s ? 1 : index + 1;
				curr = next - 1;			
				setcurrnum((index - 1));
				switch(effect){
					case 1:
					//$(".thumb", obj).css("display","none");
					//$(".thumb", obj).eq(index - 1).show();
					//$(".thumb", obj).eq(index - 1).find("img").hide();
					//$(".thumb", obj).eq(index - 1).find("img").fadeTo(options.speed,1);
					$(".tit em",obj).html($(".thumb", obj).eq(index - 1).find("img").attr("alt"));
					// $("span",sliderControl).eq(index - 1).addClass(active).siblings().removeClass(active);//改变小图导航样式
				   $(".thumb", obj).eq(index - 1).css("z-index",1).siblings().css("z-index",0);//控制absolute的层级
				   $(".thumb", obj).eq(index - 1).show().find("img").css({"opacity": 0})
					.animate({opacity:1},300,function(){
						$(this).removeAttr("style");//动画之后删除opacity
						$(".thumb", obj).eq(index - 1).show().siblings().hide();//显示大图   
					});//展示当前显示动画
					break;
					
					case 2:
					p = ((index - 1) * w * -1);
					$(".tit em",obj).html($(".thumb", obj).eq(index - 1).find("img").attr("alt"));
					$flashelement.animate(
						{ marginLeft: p },
						options.speed
					);
				}
				if (clicked) {
					clearTimeout(timeout);
				};
				if (options.auto && !clicked) {
					timeout = setTimeout(function() {
						flash(next, false, options.effect);
					}, options.speed + options.pause);
				};
			}
			var timeout;
			//初始化
			setcurrnum(0);
			if(options.effect == 1){
				$(".thumb", obj).eq(0).css('display', 'block');		
			}
			if (options.auto) {
				timeout = setTimeout(function() {
					if(s>1){
						flash(2, false, options.effect);
					}
				}, options.pause);
			};
			$flashelement.find(".thumb").hover(function(){
				clearTimeout(timeout);
			},function(){
				var _index=parseInt($(".slider-control span.active").html())-1;
				timeout = setTimeout(function() {
					if(s>1){
						flash((curr / 1 + 1), false, options.effect);
					}
				}, options.pause);
			});
		}
	});
};
*/
/* 
 *@file input_ui.js
 *@author wenlianlong
 *@info 用户中心注册验证函数（优化）
 *@data 2012-07-19
 */
$.fn.reg_validate=function(options){	
	var fm = $(this);
	 return this.each(function(){
		 var fm_input=$(this).find("input");
		 fm_input.focus(function(){
		 	var $me=$(this);//当前对象
		 	if($me.is(".use_login") || $me.is(".pwd_login")){
				$("#ipt_bubble").addClass("hidden")
			}
		 })
		 fm_input.blur(function(){
			var $me=$(this);//当前对象
			//联系人
			if($me.is(".txt_user")){
				if($me.val()==""){
					$(".ipt_user").removeClass("success").addClass("error");
					$(".ipt_user .help-inline").removeClass("hidden")
					return;
				}else{
					$(".ipt_user").removeClass("error").addClass("success");
					$(".ipt_user .help-inline").addClass("hidden")
				}
			}
			//手机号
			if($me.is(".txt_mobile")){
				if($me.val()==""){
					$(".ipt_mobile").removeClass("success").addClass("error")
					$(".ipt_mobile .help-inline").removeClass("hidden").html("请填写手机号");
					return;
				}else if(isMobile($me.val()) && $me.val()!=""){
					$(".ipt_mobile").removeClass("error").addClass("success");
					$(".ipt_mobile .help-inline").addClass("hidden").html("请填写手机号");
				}else{
					$(".ipt_mobile").removeClass("success").addClass("error");
					$(".ipt_mobile .help-inline").removeClass("hidden").html("手机号需为11位数字");
					return;
					
				}
			}
			//帐号
			if($me.is(".use_login")){
				if($me.val()==""){
					$(".ipt_user").removeClass("success").addClass("error");
					$(".ipt_user .help-inline").removeClass("hidden");
					return;
				}else{
					$(".ipt_user").removeClass("error").addClass("success");
					$(".ipt_user .help-inline").addClass("hidden");
				}
			}
			//密码
			if($me.is(".pwd_login")){
				if($me.val()==""){
					$(".ipt_password").removeClass("success").addClass("error");
					$(".ipt_password .help-inline").removeClass("hidden").html("输入密码");
					return;
				}else if($me.val()!="" && $me.val().length<6){
					$(".ipt_password").removeClass("success").addClass("error");
					$(".ipt_password .help-inline").removeClass("hidden").html("密码有误");
					return false;
				}else{
					$(".ipt_password").removeClass("error").addClass("success");
					$(".ipt_password .help-inline").addClass("hidden");
				}
			}
		});
	//添加提示
	function returnInfo(msg,parent){
		parent.find(".help-inline").remove();
		parent.append('<span class="help-inline">' + msg + '</span>');
	}
	//邮件验证
	fm.find("#email").bind({
		'blur':function(){
			var $me=$(this);//当前对象
			var $parent = $(this).parents(".form-row");
			if($me.val()==""){
				returnInfo("请填写邮箱地址",$parent.removeClass("hints success").addClass("error"))
				return;
			}else if(isEmail($me.val()) && $me.val()!=""){
				returnInfo("请填写正确的邮箱地址，用于找回密码",$parent.removeClass("hints success").addClass("error"));
				return;
			}else{
				//检测邮箱是否已注册
				var _url=jsRequestUrl("/ajax/checkName")
				 $.ajax({
	                url: _url,
	                type: 'POST',
	                data:{username:$me.val(),type:1},
	                dataType: 'html',
	                timeout: 3000,
	                success: function(str){
	                	var _json=eval("("+str+")");
	                	if(_json['rst'] <1 ){
							returnInfo("此邮箱已被注册",$parent.removeClass("hints success").addClass("error"));
							return;
						}else if(_json['rst'] ==1 ){
							$parent.removeClass("hints error").addClass("success")

						}
	                }
	            });	
            }		 
		},
		'focus':function(){
			var $parent = $(this).parents(".form-row");
				returnInfo("如：gaofen@gaofen.com",$parent.addClass("hints"))
				return;
			}
	});
	//密码验证
	fm.find("#password").bind({
		'blur':function(){
			var $me=$(this);//当前对象
			var $parent = $(this).parents(".form-row");
			if($me.val()==""){
				returnInfo("请设置密码",$parent.removeClass("hints success").addClass("error"))
				return;
			}else if($me.val().length<6 || $me.val().length>15){
				returnInfo("6-15位字符，可由英文、数字及标点符号组成",$parent.removeClass("hints success").addClass("error"))
				return;
			}else{
				$parent.removeClass("hints error").addClass("success")
			}
		},
		'focus':function(){
			var $parent = $(this).parents(".form-row");
				returnInfo("6-15位字符，可由英文、数字及标点符号组成",$parent.addClass("hints"))
				return;
		}
	});
	//昵称验证
	fm.find('#username').bind({
		'blur':function(){
			var $me=$(this);//当前对象
			var $parent = $(this).parents(".form-row");
			if($me.val()==""){
				returnInfo("请填写昵称",$parent.removeClass("hints success").addClass("error"))
				return;
			}else if(len_str($me.val())<4 || len_str($me.val())>15){
				returnInfo("4-15位字符，可由英文、中文及数字组成",$parent.removeClass("hints success").addClass("error"))
				return;
			}else{
				//检测用户名是否忆注册
				var _url=jsRequestUrl("/ajax/checkName")
				 $.ajax({
	                url: _url,
	                type: 'POST',
	                data:{username:$me.val(),type:2},
	                dataType: 'html',
	                timeout: 3000,
	                success: function(str){
	                	var _json=eval("("+str+")");
	                	if(_json['rst'] <1 ){
							returnInfo("该昵称已被使用",$parent.removeClass("hints success").addClass("error"))
							return;
						}else{
							$parent.removeClass("hints error").addClass("success")
						}
	                }
	            });	
            }	
		},
		'focus':function(){
			var $parent = $(this).parents(".form-row");
				returnInfo("4-15位字符，可由英文、中文及数字组成",$parent.addClass("hints"))
				return;
		}
	});
	//参加报名
	$("#submit_lecture").click(function(){
		fm_input.trigger('blur');
		var flag=$("#add_content").find(".error").length;
		if(flag==0){
			submit_lecture();
		}else{
			return;
		}
	});
	$("#regForm .btn-primary").click(function(){
		fm_input.trigger('blur');
		var flag=$("#regForm").find(".error").length;
		if(flag>0){
			return false;
		}
	})		
	//登录
	var flag_login="";
	$("#form-login").submit(function(){
		fm_input.trigger('blur');
		var flag_login=$("#add_content").find(".error").length;
		if(flag_login==0){
			flag_login=1;
			var use_name=$(".use_login").val();
			var use_pwd=$(".pwd_login").val();
			var save_me=$('#logstatus').val();
			$("#form-login .actions .btn").attr({"title":"正在登录...","disabled":"disabled"}).html("正在登录...");			
			var urlstring="/ajax/login";
				urlstring=jsRequestUrl(urlstring)
			$.ajax({
				type: "POST",
				url : urlstring,	
				data:{username:use_name,password:use_pwd,save_me:save_me},
				success : function(msg){
					if(msg.errno==0){
						$("body").append(msg.rst.data);
						var tmp_user=setInterval(function(){
							window.location.reload();
						},3000)
					}else{
						$("#form-login .actions .btn").attr({"title":"正在登录"}).removeAttr("disabled").html("登录");
						$("#ipt_bubble").removeClass("hidden");
						$("#tip_info").html(msg.err);
						return;
					}
				}
			});
		}else{
			$("#form-login .actions .btn").removeAttr("disabled");
			return false;
		}
		return false;
	});
	})
}
/*
 * @create: ouli
 * @countdown 倒计时插件
 * @调用方式	
   $.fn.countdown({
		hoverDuring: 300, //菜单展示速度
		outDuring: 100, //菜单消失速度
		hoverEvent: "", //鼠标移动上去事情
		outEvent: "" //鼠标离开事件
   })
 */
$.fn.countdown = function(options){
	//默认值
	var defaults = {
		time: "", //倒计时时间对象
		dayPanel: "", //显示天的标签
		hourPanel: "", //显示小时的标签
		minutePanel: "", //显示分钟的标签
		secondPanel: "", //显示秒的标签
		endText: "" //倒计时结束文字
	}
	var options = $.extend({}, defaults, options),
	falg=true;
	this.each(function() {
		var obj = $(this);
		//倒计时函数
		function countDown(){	
			var openTime = options.time;
			var openTimeStr = countTime(openTime).split("-");
			if(openTimeStr[0] >= 0){;
				obj.find(options.dayPanel).html(openTimeStr[0]);
				obj.find(options.hourPanel).html(openTimeStr[1]);
				obj.find(options.minutePanel).html(openTimeStr[2]);
				obj.find(options.secondPanel).html(openTimeStr[3]);
			}
			if(openTimeStr[0] == ""){
				//obj.find("strong").html(options.endText);
				obj.find('span').remove();
				falg=false;
			}
			if(falg)
			timeout = setTimeout(function() {
				countDown();
			}, 1000);
		}
		//计算时间差函数
		function countTime(timeObj){
			var nowTime = new Date();	//现在时间  
			/* 
			 * 如果求的时间差为天数则处以864000000，如果是小时数则在这个数字上 
			 *除以24，分钟数则再除以60，依此类推 
			*/
			var timesGAp = timeObj.getTime() - nowTime.getTime();
			if(timesGAp < 0){//当年已完毕
				if(timesGAp > -259200000){//3天内都为0
					return '0-0-0-0';
				}else{
					var oyear = timeObj.getFullYear();
					timeObj.setFullYear(oyear+1);
					timesGAp = timeObj.getTime() - nowTime.getTime();
				}
			}
			var days = Math.floor((timesGAp) / (1000 * 60 * 60 * 24)); 
			var hour = Math.floor(timesGAp / (1000 * 60 * 60)) % 24;
			if(hour<10)hour = "0"+hour;
			var minute = Math.floor(timesGAp / (1000 * 60)) % 60;
			if(minute<10)minute = "0"+minute;
			var second = Math.floor(timesGAp / 1000) % 60;
			if(second<10)second = "0"+second;
			return days+"-"+hour+"-"+minute+"-"+second;
		}
		//调用倒计时
		countDown();
	})
}
/**************************自定义方法************************************************/
//URL添加随机数
function jsRequestUrl(url){
	if (url.indexOf('?') == -1) {
		url = url + '?__rnd='+Math.random();
	} else {
		url = url + '&__rnd='+Math.random();
	}
	return url;
}
//验证手机
function isMobile(mobile){
	if(/^(1(([35][0-9])|(47)|[8][01236789]))\d{8}$/.test(mobile)){
		return true;
	}else{
		return false;
	}
}
//验证邮件
function isEmail(email){
	if(!/.+@.+\.[a-zA-Z]{2,4}$/.test(email)){
		return true; 
	}else{
		return false;
	}
}	
/***登录框内容状态****/
function gaofen_login_state(){
	var isInDropdown = 0;
        var isInTrigger = 0;
        $(".extra-links .account .caret").mouseenter(function(){
            isInTrigger = 1;
            $(this).find(".bg").removeClass("hidden");
            $(this).next(".dropdown").removeClass("hidden");
        }).mouseleave(function(){
            isInTrigger = 0;
            if (!isInDropdown) {
                $(this).find(".bg").addClass("hidden");
                $(this).next(".dropdown").addClass("hidden");
            }
        });
        $(".extra-links .account .dropdown").mouseenter(function() {
            isInDropdown = 1;
            $(this).prev().find(".bg").removeClass("hidden");
            $(this).removeClass("hidden");
        }).mouseleave(function(){
            isInDropdown = 0;
            if (!isInTrigger && !isInDropdown ) {
                $(this).prev().find(".bg").addClass("hidden");
                $(this).addClass("hidden");
            }
        });
}
//计算中英文字符长度，
function len_str(s) {
	 var l = 0;
	 var a = s.split("");
	 for (var i=0;i<a.length;i++) {
		if (a[i].charCodeAt(0)<299) {
		  	l++;
		}else{
		  	l+=2;
		}
	 }
	 return l;
}
//报名
function submit_lecture(){
	var _use=$(".ipt_user .input-text").val()//联系人
	var _mobile=$(".ipt_mobile .input-text").val();//手机号
	var _number=$("#select01").val();	
	if(_use!="" && _mobile!=""){		
		applyUrl = jsRequestUrl(applyUrl);
		$.ajax({
			type: "POST",
			url : applyUrl,	
			data:{id:applyId,applynum:_number,phone:_mobile,realname:_use},
			success : function(msg){
				if(msg.errno==0){
					//$("#btn_apply,#btn_shiting").removeClass("btn-primary").unbind('click');
					$("#add_content .form").addClass("hidden");
					$("#add_content .alert").removeClass("hidden alert-error").addClass("alert-success");
					$("#add_content .alert .info").find("h3").html("报名成功");
					$('.thumb-info-details .details p:last').find("i")
					.html(parseInt(_number)+parseInt($('.thumb-info-details .details p:last').find("i").html()))
				}else{
					$("#add_content .form").addClass("hidden");
					$("#add_content .alert").removeClass("hidden alert-success").addClass("alert-error");;	
					$("#add_content .alert .info").find("h3").html("报名失败");
					$("#add_content .alert .info").find("p").html(msg.err);
				}
			}
		})
	}
}
//立即下载
function submit_download(){
	var _download=setInterval(function(){
		$('.thumb-info-details .details p:last').find("i")
		.html(parseInt($('.thumb-info-details .details p:last').find("i").html())+1);
		clearInterval(_download);	
		$(".modal-backdrop,.modal").remove();
	},1000)
}	
/**************************设置用方法************************************************/
/**
* @create:     wenlianlong
* @rotatelist 全局城市切换 
* @调用方式	
function gaofen_app_cityMenu()
*/
function gaofen_app_cityMenu(citystr){
	var timeOutVar=null;
	var cityname="广州站";
	if(citystr=='sz'){cityname="深圳站";}
	if(citystr=='dg'){cityname="东莞站";}
	var $me=$(".city-selector");
	var city_frame=[
					"<div class=menu>",
					"	<a href='http://www.gaofen.com/'>广州站</a>",
					"	<a href='http://sz.gaofen.com/'>深圳站</a>",
					"</div>"
					].join('');
	$me.find(".caret").html(cityname+"<i></i>");
	$me.find(".menu").remove();
	$me.append(city_frame);
	/*$me.mouseleave(function(){
		clearTimeout(timeOutVar);
		clearTimeout(timeOutVar2);
   		timeOutVar=setTimeout('$(".city-selector").removeClass("hover")',100);				   
	});	
	$me.mouseenter(function(){
		if(timeOutVar!=null)clearTimeout(timeOutVar); 
   		timeOutVar=null; 
		timeOutVar2=setTimeout('$(".city-selector").addClass("hover")',300);
	});	*/
}
/**
* @create:       wenlianlong
* @rotatelist    图片幻灯片切换
* @numberID      对象ID
* @controlsShow  是否显示数字导航
* @effect        1表示浮现,2表示滑动
* @speed         滑动速度
* @auto          是否自定滑动
* @pause         两次滑动暂停时间持
* @height        容器高度，不设置自动获取图片高度
* @width         容器宽度，不设置自动获取图片宽度
* @调用方式	
gaofen_fadeSlider(nunberID,controlsShow,effect,speed,auto,pause,height,width)
*/
function gaofen_fadeSlider(nunberID,controlsShow,effect,speed,auto,pause,height,width){
	/*$("#"+nunberID).fadeSlider({
		controlsShow: controlsShow, //是否显示数字导航
		effect: effect, //1表示浮现,2表示滑动
        speed: speed, //滑动速度
        auto: auto, //是否自定滑动
        pause: pause, //两次滑动暂停时间持
        height: height, //容器高度，不设置自动获取图片高度
        width: width//容器宽度，不设置自动获取图片宽度
	});*/
	var slideView = $("#"+nunberID);
	slideView.slideScroll({
		//viewMain:slideView.find("div.thumbs"),//舞台
		effect:'fadeOut',//动画方式
		target:"a",//
		isauto:auto,//自动播放
		speed:speed,//播放时间
		active:"active",
		width:width,//宽度
		height:height//高度
	})
}
/**
* @create:      wenlianlong
* @rotatelist  全局搜索方法
* @url        URL链接
* @调用方式	
function gaofen_app_search(url)
*/
function gaofen_app_search(url){
	//设置全局搜索
	var searchTxt = '搜索资讯、资料',
		$search_input = $("#searchValue"),
		jqSearchForm = $search_input.parent(); 
	$search_input.focus(function(){
		jqSearchForm.addClass("form-search-focus");
	}).blur(function(){
		jqSearchForm.removeClass("form-search-focus");
		return;
	});
	//搜索框回车事件
	$search_input.keydown(function(e){
        if(e.which==13){
            go_search();
        }
    });
	//搜索
    jqSearchForm.find(".search-btn").bind("click",function(){
        go_search();
    });

    function go_search(){
		var q = encodeURI($search_input.val());
		if(q != ""){
			//url = 'http://so.gaofen.com/cse/search?s=2958907847468970783&nsid=0&q=';
			//location.href = url + q;
			$('#search_form').submit();
		}
    }
}
/**
* @create:     wenlianlong
* @rotatelist 用户登录状态
* @调用方式	
function gaofen_app_user()
*/
function gaofen_app_user(){
	var islogined = getcookie('gaofen_user');
    if(islogined){
        $("#logined").removeClass("hidden");
        $("#user").html(islogined);
    }else{
        $("#logined").addClass("hidden");
        $("#login").removeClass("hidden");
    }
}
/**
* @create:     wenlianlong
* @rotatelist 浮动框
* @_id		弹出框ID
* @_title   提示框标题
* @_style     浮动框内容类型,1：登录2：报名讲座3：下载文档
* @_isfooter 是否显示footer
* @_class 提示框样式
* @调用方式	
function gaofen_app_win_fixed(_style)
*/
// function gaofen_app_win_fixed(_id,_title,_type,_isfooter,_class){	
// 	var isfooter=_isfooter?"":"hidden";
// 	var tit=_title!=""?_title:"提示框",
// 		clas=_class!=""?_class:"modal-apply";
// 	//弹出背景遮罩层
// 	var win_mask="<div class='modal-backdrop'><!--[if lte IE 6]><iframe frameborder='0'></iframe><![endif]--></div>";
// 	//弹出框，框架
// 	var win_module=[
// 					'<div id="'+_id+'" class="modal '+clas+'">',
// 					'<div class="modal-header"><h3>'+tit+'</h3></div>',
// 					'<div class="modal-body"  id="add_content">',
// 					'</div>',
// 					'<div class="modal-footer '+isfooter+'">',
// 					'	<div class="reg">还没有高分账号？<a target="_blank" href="http://my.gaofen.com/index.php?mod=user">点击注册</a></div>',
// 					'	<div class="operations">其他账号登录<a class="btn-weibo-mini" title="使用新浪微博登录" target="_blank" href="http://s.gaofen.com/account/sinaLogin"></a><a class="btn-qq-mini" title="使用QQ账号登录" target="_blank" href="http://s.gaofen.com/account/qzoneLogin"></a></div>',
// 					'</div>',
// 					'<a data-dismiss="modal" onclick=$(".modal-backdrop,.modal").remove() class="close">×</a>',
// 					'</div>'
// 					].join('');		
// 	//登录内容
// 	var win_login=[
// 					'<form class="form" id="form-login" method="post" action="index.php?mod=user&do=login">',
// 					'<div class="form-row ipt_user">',
// 					'	<label class="control-label">账号</label>',
// 					'	<div class="controls">',
// 					'   	 <input type="text" placeholder="邮箱/昵称" class="input-text use_login">',
// 					'	</div>',
// 					'	<span class="help-inline hidden">请输入账号</span>',
// 					'</div>',
// 					'<div class="form-row ipt_password">',
// 				    '	<label class="control-label">密码</label>',
// 				    '	<div class="controls">',
// 					'		<input type="password" class="input-text pwd_login">',
// 					'		<div class="operations">',
// 					'	  	 	<label class="checkbox"><input type="checkbox" value="cookietime" name="save_me" id="logstatus">下次自动登录</label>',
// 					'  		 	<a href="http://my.gaofen.com/index.php?mod=user&do=findPwd" title="忘记密码" target="_blank">忘记密码?</a>',
// 					'		 </div>',
// 				    ' 	</div>',
// 				    '	<span class="help-inline hidden">密码不能为空</span>',
// 			   	    '</div>',
// 					'<div class="actions">',
//                     '	<button type="submit"  name="register" class="btn btn-primary" title="登录">登录</button>',
//             		'</div>',
//             		'<div class="bubble bubble-error hidden" id="ipt_bubble"><span id="tip_info">用户名或密码错误</span><span class="arrow"><i class="arrow-border"></i><i class="arrow-body"></i></span><a class="close" onclick=$("#ipt_bubble").addClass("hidden") href="javascript:void(0);">&times;</a></div>',
//                    	'</form>'
// 				].join('');
// 	//报名成功
// 	var win_lecture=[
// 					'<div class="form ">',
// 					'<div class="form-row">',
// 						'<label class="control-label">参加</label>',
// 						'<div class="controls">',
// 							'<select id="select01">',
// 							 '   <option value="1">1人</option>',
// 							 '   <option value="2">2人</option>',
// 							 '   <option value="3">3人</option>',
// 							 '   <option value="4">4人</option>',
// 							 '   <option value="5">5人</option>',
// 						   ' </select>',
// 					   ' </div>',
// 				   ' </div> ',
// 					'<div class="form-row ipt_user">',
// 					 '   <label class="control-label">联系人</label>',
// 					 '   <div class="controls">',
// 					  '      <input type="text" class="input-text txt_user">',
// 					 '   </div>',
// 					'    <span class="help-inline hidden">请填写联系人</span>',
// 				   ' </div>',
// 				   ' <div class="form-row ipt_mobile">',
// 					'    <label class="control-label">手机号</label>',
// 					 '   <div class="controls">',
// 					 '       <input type="text" maxlength="11" class="input-text txt_mobile">',
// 					  '      <p class="hints">用于接收领票短信</p>',
// 					  '  </div>',
// 					  '  <span class="help-inline hidden">请填写手机号</span>',
// 				   ' </div>',
// 				   ' <div class="actions">',
// 				   '     <a class="btn btn-primary" id="submit_lecture" title="提交" href="#">提交</a>',
// 				 '   </div>',
// 			    '</div>',
// 				'<div class="alert alert-success hidden">',
// 				'	<i class="ico"></i>',
// 				'	<div class="info">',
// 				'		<h3>报名成功!</h3>',
// 				'		<p>我们将在活动开始前发送领票凭证短信到报名手机，凭短信到现场领票即可！</p>',
// 				'	</div>',
// 				'	<div class="actions">',
// 				'		<a class="btn btn-primary btn-close" onclick=$(".modal-backdrop,.modal").remove() title="关闭" href="javascript:void(0);">关闭</a>',
// 				'	</div>',
// 				'</div>'
// 				].join('');	
// 	var win_download1=[
// 					'<div class="modal-info ">',
// 			        '    <div class="cont">',
// 			        '        <p>本次下载需要消耗高分币：<strong></strong></p>',
// 			        '        <p></p>',
// 			        '    </div>',
// 			        '    <div class="actions">',
// 			        '		 <form method="post" action="" onsubmit="return submit_download()" id="submit_download">',
// 			        '			<input type="submit" class="btn btn-primary" value="立即下载" name="download">',
// 			        '       	<a class="btn" title="取消" onclick=$(".modal-backdrop,.modal").remove() href="javascript:void(0);">取消</a>',
// 			        '        <p><label class="checkbox"><input type="checkbox" value="1" name="share" checked="checked">同步分享到微博</label></p>',
// 			        '		 </form>',			        
// 			        '    </div>',
// 			        '</div>'
// 					].join('');
// 	var win_download2=[
// 					'<div class="modal-info ">',
// 			        '    <div class="cont">',
// 			        '        <p>本次下载需要消耗高分币：<strong></strong></p>',
// 			        '        <p>您剩余高分币：<span class="hl tip_cUost"></span><span class="hl">您的高分币余额不足</span></p>',
// 			        '    </div>',
// 			        '    <div class="actions">',
// 			        '        <a class="btn btn-primary" target="_blank" title="马上充值" href="http://bbs.gaofen.com/home.php?mod=spacecp&ac=credit&op=buy">马上充值</a>',
// 			        '        <p><a  target="_blank" title="通过其他方式获取高分币" href="http://bbs.gaofen.com/thread-16509-1-1.html  ">通过其他方式获取高分币</a></p>',
// 			        '    </div>',
// 			        '</div>'
// 				  ].join('');
// 	var win_download3=[
// 					'<div class="modal-info">',
// 			        '    <div class="cont">',
// 			        '        <p>您已为该资料支付过高分币，本次下载 <strong class="hl">免费</strong></p>',
// 			        '    </div>',
// 			        '    <div class="actions">',
// 			        '		 <form method="post" action="" onsubmit="return submit_download()" id="submit_download">',
// 			        '			<input type="submit" class="btn btn-primary" value="立即下载" name="download">',
// 			        '       	<a class="btn" title="取消" onclick=$(".modal-backdrop,.modal").remove() href="javascript:void(0);">取消</a>',
// 			        '        <p><label class="checkbox"><input type="checkbox" value="1" name="share" checked="checked">同步分享到微博</label></p>',
// 			        '		 </form>',			        
// 			        '    </div>',
// 			        '</div>'
// 					].join('');
	
// 	//表彰验证	
// 	//var $content=$("#add_content");
// 	switch (_type){
// 		case 1:			
// 			$("body").append(win_mask+win_module);
// 			$("#add_content").append(win_login);
// 			break;
// 		case 2:
// 			$("body").append(win_mask+win_module);
// 			$("#add_content").append(win_lecture);			
// 			break;
// 		case 3:
// 			applyUrl=jsRequestUrl(applyUrl);
// 			$.ajax({
// 				type: "POST",
// 				url : applyUrl,	
// 				data:{id:applyId},
// 				success : function(msg){
// 					//console.log(msg);
// 					$("body").append(win_mask+win_module);
// 					if(msg.rst.state==1){
// 						$("#add_content").append(win_download3);
// 						$("#add_content form").attr("action","/docs/download/"+applyId);
// 					}else if(msg.rst.state==2){
// 						$("#add_content").append(win_download2);
// 						$("#add_content .modal-info strong").html(msg.rst.cost);
// 						$("#add_content .tip_cUost").html(msg.rst.uCost);
// 					}else if(msg.rst.state==3){
// 						$("#add_content").append(win_download1);
// 						$("#add_content form").attr("action","/docs/download/"+applyId);
// 						$("#add_content .modal-info strong").html(msg.rst.cost);
// 						$("#add_content .modal-info .cont p:last").html("您剩余高分币："+msg.rst.uCost);						
// 					}
// 					if(msg.rst.bind==1){
// 						$("input[name='share']").parent().show();
// 					}else if(msg.rst.bind==0){
// 						$("input[name='share']").parent().hide();
// 					}
// 				}
// 			})
// 			break;
// 	}
// 	$("#add_content").reg_validate();

// 	/*$(".btn-close,.close").click(function(){
// 		$(".modal-backdrop,.modal").remove();
// 	});*/
// }	
//邮件订阅提示框
// function gaofen_add_subscibe(nId,sText){
// 	var email = getcookie('gaofen_email');
// 	if(email!="")
// 		email = decodeURIComponent(email);
// 	else
// 		email="请输入您的邮箱"
// 	var _content=[
// 					'<div class="dropdown tooltip tooltip-subscibe hidden">',
// 					'<div class="dropdown-in">',
// 						//'<p>'+sText+'</p>',
// 						'<div class="form"> ',
// 						   ' <div class="form-row">',
// 						   		//'<div id="form_maill" action="http://list.qq.com/cgi-bin/qf_compose_send" target="_blank" method="post">',
// 								'<input id="to" name="to" type="text" autocomplete="off" class="input-text" value="'+email+'">',
// 								'<input type="submit" name="small"  id="email_submit" value="订阅" class="btn btn-primary btn-small">',
// 							   //' <a href="javascript:void(0);" class="btn btn-primary btn-small">订阅</a>',
// 							   ' <span class="help-inline hidden">请输入正确的邮箱地址</span>',
// 							   '<input type="hidden" name="t" value="qf_booked_feedback"><input type="hidden" name="id" value="'+nId+'">',
// 							   //'</div>',
// 						   ' </div>',
// 					   ' </div>',
// 				   ' </div>',
// 				   ' <span class="arrow">',
// 					'    <i class="arrow-shadow"></i>',
// 					'    <i class="arrow-border"></i>',
// 					'    <i class="arrow-body"></i>',
// 				   ' </span>',
// 			   ' </div>'
// 				].join('');
// 	$(".mod-calendar").css({"position":"relative"}).append(_content);
// 	var timesubscibe="";
// 	$(".btn-subscibe").bind("mouseenter",function(){
// 		var $me=$(".tooltip-subscibe");
// 		$me.find(".dropdown-in").removeAttr("style");
// 		$me.find(".form-row").removeClass("error");
// 		clearInterval(timesubscibe);
// 		timesubscibe=setInterval(function(){
// 			$me.css({top:34,left:"auto",right:5}).removeClass("hidden");
// 			$(".close",$me).click(function(){
// 				$me.addClass("hidden")
// 			});
// 			clearInterval(timesubscibe);
// 		},300);
// 	}).bind("mouseleave",function(){
// 		clearInterval(timesubscibe);
// 		leavesubscibe()
// 	});
// 	$("#to").mail_lenovo();//邮件联想
// 	$(".tooltip-subscibe").bind("mouseenter",function(){
// 		clearInterval(timesubscibe);
// 	}).bind("mouseleave",function(){
// 		clearInterval(timesubscibe);
// 		leavesubscibe()
// 	});	
// 	//订阅
// 	function leavesubscibe(){
// 		timesubscibe=setInterval(function(){
// 			$(".tooltip-subscibe").addClass("hidden")
// 			$("#form_maill .help-inline").addClass("hidden")
// 			$(".drop-menu").addClass("hidden")
// 			//$(".drop-menu").find("li").remove();
// 			clearInterval(timesubscibe);
// 		},200);
// 	}
// 	//订阅邮件
// 	$("#email_submit").click(function(){
// 		var _maill=$("input[id='to']").val();
// 		$(".drop-menu").addClass("hidden")
// 		if(_maill!="" && /.+@.+\.[a-zA-Z]{2,4}$/.test(_maill)){
// 			$.getJSON('http://cp.gaofen.com/?mod=feedemail&action=feed&cat='+tplslug+'&email='+encodeURI(_maill)+'&jsonpcallback=?',function(json){
// 				if(json.result){//json.result=true;json.msg=ok
// 					if(tplslug=='xsc') catname = '小学';
// 					if(tplslug=='zhongkao') catname = '初中';
// 					if(tplslug=='gaokao') catname = '高中';					
// 					successhtml = '<div class="alert alert-success">'+
//                                     '<i class="ico"></i>'+
//                                     '<div class="info">'+
//                                         '<h3>邮件订阅成功！</h3>'+
//                                         '<p>'+catname+'相关资讯将及时发送到您邮箱</p>'+
//                                     '</div>'+
//                                 '</div>';
// 					$(".tooltip-subscibe .dropdown-in").html(successhtml);
// 				}else{//json.result=false;json.msg=					
// 					alert(json.msg);
// 				}
// 			});

// 		}else{			
// 			$(".tooltip-subscibe .dropdown-in").animate({height:50},function(){
// 				$("#email_submit").parent(".form-row").addClass("error")
// 				$(".tooltip-subscibe .help-inline").removeClass("hidden")
// 			});
// 			return false;
// 		}
// 	});
// }
/**
* @create:     wenlianlong
* @rotatelist 所有图片切换，滑动公共方法
* @page 页面模块
* @page_column 栏目名称
* @调用方式	
gaofen_app_img_animate(page, page_column,city)
*/

function gaofen_app_img_animate(page,city) {
	 if (page != null && page != 'undefined') {
		var control = true, controlType = 2, year = new Date().getFullYear();
        switch (page) {
			case 'xsc':			
			   gaofen_fadeSlider("sliderside",true,1,3000,true,3000,0,0);//小升初首页图片切换
			   $("#wday").countdown({time: new Date(year,5,20,24,0,0),dayPanel:"span",endText:'0'})
				break;
			case 'zhongkao':
			 	gaofen_fadeSlider("sliderside",true,1,3000,true,3000,0,0);//中考首页图片切换
			   $("#wday").countdown({time: new Date(year,5,17,24,0,0),dayPanel:"span",endText:'0'})
				break;
			case 'gaokao':
			 	gaofen_fadeSlider("sliderside",true,1,3000,true,3000,0,0);//高考首页图片切换
			   $("#wday").countdown({time: new Date(year,5,7,24,0,0),dayPanel:"span",endText:'0'})
				break;
			case 'index':
				gaofen_fadeSlider("sliderside",true,1,3000,true,3000,0,0);//首页图片切换
				gaofen_fadeSlider("sliderside1",true,1,3000,true,3000,0,0);//首页图片切换
				break;
		 }
		 
		var jqad = $('#slidertop');
		if(jqad.find('a').length>1){
			jqad.slideScroll({
				controlType : 2,
				overStop : control,
				createControl : control,
				hasControl : control,
				//sliderControl : $('<ul class="pages"></ul>'),
				target : 'a',
				speed : 5000
			});
		}else if(jqad.find('a').length === 1){
			jqad.removeClass('slider');
		}
	  }
}
/**************************站内操作************************************************/
var applyId="",
	applyUrl="";
	
$(function(){
		
	// //点击报名
	// $("#btn_apply").click(function(){
	// 	applyId=$("#btn_apply").attr("data-item");
	// 	applyUrl="/ajax/joinLectures"
	// 	gaofen_app_win_fixed("modalApply","报名讲座",2,false,"modal-apply");	
	// });
	// //参加视听
	// $("#btn_shiting").click(function(){
	// 	applyId=$("#btn_shiting").attr("data-item");
	// 	applyUrl="/ajax/joinCourse"
	// 	gaofen_app_win_fixed("modalApply","参加视听",2,false,"modal-apply");			
	// });	
	// //文档下载
	// $("#btn_download").click(function(){
	// 	var islogined = getcookie('gaofen_user')
	// 	if(islogined){
	// 		applyId=$("#btn_download").attr("data-item");
	// 		applyUrl="/ajax/download"
	// 		gaofen_app_win_fixed("modalDownload","文档下载",3,false,"modal-download");	
	// 	}else{
	// 		gaofen_app_win_fixed("modalLogin","登录",1,true,"modal-login");
	// 	}
	// });	

	var ctview = $('#countdown');
	if(ctview.length){
		areas = ctview.find('i'), pd = Gaofen.PD.get();
		Gaofen.FN.Countdown({	
				view : ctview,
				'is' : areas,
				'endTime' :   parseInt(pd.endTime),
				'startTime' : parseInt(pd.startTime),
				'nowTime' :   parseInt(pd.nowTime),
				'originCost' : pd.originCost,
				'saleCost' :   pd.saleCost,
				callback : function(){
					ctview.addClass('hidden');
					$('#saleCost').text(pd.originCost);
				}		
			});
			
			//“立刻购买”按钮下加上跟踪标记
			(function(){
				var urlsearch = location.href.split('?');
				if(urlsearch.length > 1){
					var btn = ctview.parent().find('a.btn-buy'), url = btn.attr('href');
					btn.attr('href' , url+'?'+urlsearch[1]);					
				}
			})();

	}
	
	
	
	$(this).addBackToTopTips();//返回顶部
	
	//两侧试题优惠广告
	var sideAd = true;	
	if(sideAd && (+new Date()) < 1386892800000){
		var cs = 'ad-couplet-fold';
		$('<a id="lefta-d" target="_blank" href="http://shop72729909.taobao.com" class="ad-couplet ad-couplet-left"></a><a href="http://shop72729909.taobao.com"  target="_blank"  id="righta-d" class="ad-couplet ad-couplet-right"></a>').appendTo('body');
		var ads = $('#lefta-d,#righta-d');
		ads.mouseenter(function(){
			ads.removeClass(cs);
		}).mouseleave(function(){
			ads.addClass(cs);
		});
	}
	
	/*--------------通过路由触发----------------*/
	var G = Gaofen,
		PD = Gaofen.PD,
		channel = PD.get('channel'),
		module = PD.get('module'),
		action = PD.get('action'),
		host = PD.get('host');
		
	G.FN.onlineUsers();//在线人数

	G.event();
	
	//设为首页
	$('#login #set_home, #logined #set_home').click(function(e){
		e.preventDefault();
		G.FN.setHome(this);
	});		
	
	//文章列表
	function articleList(){
		var listArea = $('#articleListArea');
		if(listArea.length)
			new G.FN.ArticleList({
				view : listArea,
				listView : $('#articleList'),
				tplslug : PD.get('tplslug'),
				pageView : $('#articleListPage')
			})
	};

	switch(channel){
	
		case 'home' :

			switch(action){
				case 'index':
					articleList();
					var widgetSwitch = $('#widgetSwitch');
					new G.FN.TabSwitch({
						view : widgetSwitch,
						initAfter : function(){
							widgetSwitch.find('#tabs').click(function(e){
								e.preventDefault();
							});
						},
						contentList : widgetSwitch.children(':gt(0)'),
						controler : widgetSwitch.find('#tabs'),
						event : 'mouseover'						
					});
					G.Ajax.send('http://my.gaofen.com/ajax/lastMember?callback=?', '', function(r){
						var panel = $('#reginfoPanel');
						if(!getcookie('gaofen_user')){
							panel.find('.actions>a').removeClass('hidden');
						}
						if(r.errno == '0' && $.type(r.rst) === 'object'){
							panel.find('.actions>span').html('<span>'+G.FN.byteCut(r.rst.username,16)+'</span>'+r.rst.regdate+'加入');
						}
					}, 'jsonp')
				break;
			}
		break;
		case 'jiangzuo' : //讲座
		
			switch(action){
				case 'index' : //讲座首页
					G.FN.jiangzuoChangeStatus();
					//修改右则状态
					G.Ajax.send('http://'+host+'/ajax/getLecturesCount?callback=?', '', function(r){
						if(r.errno == '0'){
							var jqps = $('div.widget-statistic>div.status p'), data = r.rst;
								jqps.eq(0).html('举办讲座： '+data.lectuCount+'场');
								jqps.eq(1).html('参加人数： '+data.applynumCount+'人');
								jqps.eq(2).html('合作机构： '+data.orgCount+'家');
						}
					}, 'jsonp');	
				break;
				case 'view' : //讲座详细页
				case 'report': //讲座报道				
					G.FN.jiangzuoChangeStatus('', $('div.span16'), 'div.thumb-info-details', 'special');
				break;
			};
		break;
		
		case 'article' : //文章

			var tplslug = G.PD.get('tplslug');
			if(tplslug === 'xsc' || tplslug === 'zhongkao'){//小升初及其下页面 or 初中及其下页面
				var uri = 'http://school.gaofen.com/chuzhong/cz/ajax/search?district=', changeSelect = $('#area3_school');
				if(tplslug === 'zhongkao'){
					uri = 'http://school.gaofen.com/chuzhong/gz/ajax/search?district=';
					changeSelect = $('#middle_school');
				}

				$('#area3').on('change', function(i){
					changeSelect.html('<option  value="">请选择学校</option>').trigger('change');
					if($(this).val() != '0'){
						G.Ajax.send(uri+$(this).val()+'&callback=?', '', function(r){
							if(r.errno == '0'){
								var opts = ['<option  value="">请选择学校</option>'];
								$.each(r.rst, function(i, item){
									opts.push('<option  value="'+item.link+'">'+item.name+'</option>');
								});
								changeSelect.html(opts.join('')).trigger('change');
							}
						},'jsonp');
					}
				});
				$('#toSchool').on('click', function(e){			
					if(changeSelect.val()){
						$(this).attr('href', changeSelect.val());
					}else{
						e.preventDefault();
					}
				})
			}

			//历年分数线查询
			$('#do_submit,#go_score').on('click', function(e){
				e.preventDefault();
				$(this).closest('form').submit();
			});


			//右则月份
			G.FN.rightSideTime();

			switch(action){
				case 'index' : 
					// var scrollArea = $('#scrollArea'), dragBar = scrollArea.find('#dragBar'), scrollBar = $('#scrollbar');

					// new G.FN.DragBase({
					// 	view : scrollArea,
					// 	dragBar : dragBar,
					// 	scrollBar: scrollBar
					// });
					
					articleList();
					
					var view = $('.widget-data'), controler  = view.find('div.tabs');
					new G.FN.TabSwitch({
						view : view,
						targetName : 'span',
						contentList : view.children(':gt(0)'),
						controler : controler,
						initAfter : function(){
							controler.click(function(e){
								e.preventDefault();
							});
						},
						event : 'mouseover'							
					});
					
				break;
			
				case 'detail' ://文章详细页
					var opinionArea = $('#opinionArea'), cls = 'checked', urlHead = 'http://'+(host || location.host)+'/?post_id='+PD.get('post_id'),
						url = urlHead+'&mod=statistic&action=getPostsNum&callback=?',
						urls = [urlHead+'&mod=statistic&action=p_approve&callback=?',
						urlHead+'&mod=statistic&action=p_disapprove&callback=?',
						urlHead+'&mod=statistic&action=p_puzzle&callback=?'];	

					//文章阅读数+1
					G.Ajax.send(urlHead+'&mod=statistic','',function(){});	
								
					if(opinionArea.length){	
						G.Ajax.send(url, '', function(r){
							opinionArea.removeClass('hidden');
							var jqa = opinionArea.find('a'), expire = r.expire;
							function setNum(dom, num){
								dom.find('span.num').text(num);
							}
							var nums = [r.approve, r.disapprove, r.puzzle];							
							for(var i=0;i<jqa.length;i++)
								setNum(jqa.eq(i), nums[i]);
							if(expire){						
								var lock = false;
								opinionArea.on('click', 'a' , function(e){
									e.preventDefault();
									if(lock) return;
									lock = true;
									var jq = $(this), index = jq.index();
									G.Ajax.send(urls[index], '', function(r){
										if(r.err == '0'){
											dataLayer.push({      
											  'opinion': jq.attr('id'),
											  'event': 'opinionClick'
											});

											setNum(jq, r.ret);
											//jqa.addClass(cls);
										}
									}, 'jsonp');
								})
							}else{
								opinionArea.on('click', 'a' , function(e){
									e.preventDefault();
								});
								//jqa.addClass(cls);
							}
						},'jsonp');
					}
					
					var rel_block = $('#rel_block');	
					if(rel_block.length){
						G.Ajax.send(urlHead+'&mod=statistic&tplslug='+PD.get("tplslug")+'&action=p_block&callback=?', '', function(r){		
							rel_block.html(r.rst);						
							if(typeof callad !== undefined){
								var ads = rel_block.find('div[rel="js_callad"]');
								ads.each(function(i, item){
									var id = $(item).attr('id'), ihtml = callad(id, '', 1);
									if(ihtml){
										$(item).html(ihtml);
									}
								})
							}
				
							if(r.wx && r.wx !== 'have'){
								$('#view_right_wx').removeClass('hidden');			
							}
						}, 'jsonp');
					}


					//文章内容顶部加推荐内容
					var postContent = $('div.post-details > div.post-content');
					if(postContent.length){
						G.Ajax.send('http://'+host+'?mod=statistic&tplslug='+PD.get("tplslug")+'&action=article_recome&callback=?', '', function(r){							
							var last = [];
							// $(r.html).insertBefore(postContent);
							if(r.adid){
								var html = callad(r.adid, '', 1);
								if(html && $.trim(html)){
									last = ['<div class="picture picture-h40 mt15">'];
									last.push(html);
									last.push('</div>');
									// $(_html.join('')).insertBefore('div.post-latest');
								}								
							}
							last.push(r.html);
							$(last.join('')).insertBefore(postContent);
						}, 'jsonp');
					}
											
				break;
			}

			//显示当前学段QQ群
			var postContent = $('div.post-details > div.post-content');
			if(postContent.length){
				var _tplslug = tplslug;
				if(tplslug === 'xsc'){
					var text = $('div.container>ul.breadcrumb').text();
					if(text.indexOf('幼升小') > 0)
						_tplslug = 'ysx';
				}
				G.Ajax.send('http://m.gaofen.com/ajax/qqgroup?callback=?', {
					channel : 'article', 
					city : remote_ip_info.city,
					section : _tplslug
				}, function(r){		
					// if(r.err == '0'){		
						try{
							$(r.rst).insertAfter(postContent);
						}catch(e){

						}
					// }
							
				}, 'jsonp');
			}
		break;
	
	}

	//模拟select
	G.FN.initSelected();
	
	//没有输出路由页面
	(function(){
	    //试题首页
		var uri = location.href;
		if(/\/shiti/.test(uri)){
			var d = PD.get('items');
			if(d){
				for(var key in d){				
					if(d[key] === 1){//限时促销					
						$('#item_'+key).find('span.badge').removeClass('hidden');
					}
				}			
			}
		}
	})();
	
	
	/*------测试-------*/
});

/**************************站内方法************************************************/


/*------------------------往下是新加内容 -------------------------*/

if(typeof Gaofen === 'undefined')
		var Gaofen = {
			Tpl : {
				modal : ['<div class="modal modal-tips hidden {.cs}"><div class="modal-header"><h3>{.title}</h3></div><div class="modal-body" id="mb">{.bodyHtml}</div><a data-dismiss="modal" href="#" class="close">×</a></div>'].join(),
				modalBack : '<div class="modal-backdrop"></div>',
				//登录内容
				win_login  : ['<div class="form" id="form-logins">',
		                '<h2>登录高分网</h2>',
		                '<div class="form-row">',
		                    '<label class="control-label">账号</label>',
		                    '<div class="controls">',
		                        '<input id="username" type="text" placeholder="用户名/邮箱" class="input-text" />',
		                    '</div><span class="help-inline hidden">成功</span>',
		                '</div>',
		                '<div class="form-row">',
		                    '<label class="control-label">密码</label>',
		                    '<div class="controls">',
		                        '<input type="password" class="input-text" id="pwd"/>',
								'<div class="operations">',
		                            '<label class="checkbox">',
		                                '<input type="checkbox" id="rem"/>下次自动登录</label><a  target="_blank" href="http://my.gaofen.com/signup/getpwd">忘记密码?</a>',
		                        '</div>',
		                    '</div><span class="help-inline hidden">成功</span>',
		                '</div>',
		                '<div class="actions error">',
		                    '   <label class="btn btn-primary" id="lgbtn"><button type="submit" id="lg" title="登录">登录</button></label>',
							'   <span class="btn btn-disabled hidden" id="lging">正在登录...</span>',					
							'<span class="help-inline hidden" id="msg">用户名或密码错误</span>',
		                '</div>',
		            '</div>',
					'<div class="other-login">',
		                '<div class="hd">',
		                    '<h2>使用合作网站账号登录</h2>',
		                '</div>',
		                '<div class="bd">',
		                    '<div class="quick-login clearfix"><a target="_blank" href="http://my.gaofen.com/account/sinaLogin" title="用微博账号登录" class="btn-weibo-large">用微博账号登录</a><a target="_blank" href="http://my.gaofen.com/account/qzoneLogin" title="用QQ账号登录" class="btn-qq-large">用QQ账号登录</a>',
		                    '</div>',
		                    '<div class="actions"><a target="_blank" href="http://my.gaofen.com/signup">立即注册</a></div>',
		                '</div>',
		            '</div>'
					].join('')
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
				}
			},
			//广播事件
	    	on : function(name, fn){
	    		Gaofen.actions.reg('self_'+name, fn);
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
		    event : function(cb){
				$('body').on('click', function(e){				
					var tg = $(e.target), rel = tg.attr('rel'), data = [];
					if(tg.data('lock')){
						e.preventDefault();
						return;
					} 
					for(var i=0;i<10;i++){
						var _rel = tg.attr('rel');
						
						if(_rel){
							var item = Gaofen.FN.parseKnV(_rel);
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
				})
			}
		};
(function(G, $, win){


	//特殊广告只有深圳用户才能看到
	var szTimer, szTime = 0;
	function showSzAd(){
		if(typeof remote_ip_info === 'undefined'){
			if(szTime > 100) return;
			szTime++;
			szTimer = setTimeout(showSzAd, 400);
			return;
		}
		clearTimeout(szTimer);
		szTimer = null;		
		if(remote_ip_info.city === '深圳'){
			var shenzhengAd = ['<div class="ad-bottom">',
								'<a target="_blank" href="http://szbbs.gaofen.com/thread-3143426-1-1.html?f=szf"></a>',
								'<span class="close" id="close"></span>',
							'</div>'].join('');
			$(shenzhengAd).appendTo('body').find('#close').click(function(){
				$(this).parent().slideUp();
				setcookie('remoteAdCook', true, 86400000);
			});
		}
	}
	//showSzAd();

	G.CollectPageData = function(opt){
		
		var def = {
		
			view : '',
			
			target : 'div', //目标标签
			
			attr : 'rel', //取标签上的属性(val 表示取其value)
			
			toObject : true, //取到的是否需要分割为object
			
			property : 'all', //取所有取到的值(id表示取某个值， id,name表示取id及name)
			
			data : []
		};
		
		$.extend(this, def, opt);
		
		this.init();
	}
	
	/**
	 * @class Gaofen.CollectPageData
	 * 获取指定区域参数
	 * <code><pre>
	    new Gaofen.CollectPageData({
			view : $('div.recent-lecture div.thumb-info-list'),
			target : 'div.item'
		});
	   </pre></code>
	 **/
	G.CollectPageData.prototype = {
		
		init : function(){
		
			var view = this.view, 
				self = this;
				items = view.find(this.target);
			
			items.each(function(obj, i){
				var _data = self.getItemData($(this));
				self.data.push({item : this, data : _data});
			});	

			return this;
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
	};
	
	//Gaofen.FN空间为功能方法所用
	var FN = G.FN = {};

	FN.parseKnV = function(strRel){
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
	};
	
	//修改讲座状态及参加人数
	FN.jiangzuoChangeStatus = function(host, view, target, type){

		var data = new Gaofen.CollectPageData({
			view : view || $('div.recent-lecture div.thumb-info-list'),
			target : target|| 'div.item'
		}).getData();
		
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
		var url = "http://"+host+"/ajax/getLecturesState?callback=?"
		
		G.Ajax.send(url, {
				ids:param.join(',')
			},
			function(r){	
				if(r.errno == 0){					
					$.each(r.rst, function(k){
						if(items[k]){
							var jq = $(items[k]);
							jq.find('span.ribbon').replaceWith(this.endJoinTime);
							if(type){//特殊情况
								jq.find('#applynum').html(this.applynum);
							}else{
								jq.find('div.details p:last').html(this.applynum);
							}
						}
					})				
				
				}		
		}, 'jsonp');
		
	};
	
	/**
	 *	后端给前端传参
	 *	Gaofen.PD.set({
			channel : '',
			module : '',
			action : '',
			host : ''
		});
	 **/
	
	G.PD = (function(){
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

	})();
	
	/**
	 *	Ajax请求入口
	 * @param {String} url 请求地址
	 * @param {Object} param 参数
	 * @param {Function} fn  回调
	 * @param {String} method ajax类型
	 **/
	 
	 G.Ajax = {
		
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
	 
	
	/**
	 *	资料折扣活动倒计时
	 * @param {Number} endTime 结束时间
	 * @param {Number} startTime  开始时间
	 * @param {Number} nowTime   当前时间
	 * @param {Number} originCost  原价
	 * @param {Number} saleCost  折后价
	 **/	
	FN.Countdown = function(opt){
		var options = $.extend({			
			'endTime' :   1374636326178,
			'startTime' : 1374636315178,
			'nowTime' :   1374636315178
		}, opt),
			sm = 9,
			normalTimer;
			
		var st = options.startTime,
				nt = options.nowTime,
				et = options.endTime;	
		if(options.endTime < 2000000000){
			st *= 1000,
			nt *= 1000,
			et *= 1000;
		}
		
		var _self = {
			
			// : function(){//1000*60*60*24									
			//	return this.getTime(86400000);									
			//},
			
			getHouer : function(){
				return this.getTime(3600000);		
			},
			
			getMinute : function(){
				return this.getTime(60000)%60;		
			},
			
			getSecond : function(){
				return this.getTime(1000)%60;		
			},
			
			
			getTime : function(unit){
				var time = et - nt;
				if(time>0)
					return Math.floor(time / unit);
				return 0;
			},
			
			spilt : function(d){
				d = parseInt(d);
				var big = Math.floor(d/10),
					lit = d % 10;	
				return [big, lit];
			},
			
			getResidue : function(){
				var h = this.getHouer(),
					m = this.getMinute(),
					s = this.getSecond();
					sm--;
					if(sm == -1){
						if(h + m +s == 0){
							clearInterval(normalTimer);
							sm = 0;
							options.callback && options.callback();
						}else
							sm = 9;
					}
				
				h = this.spilt(h);
				m = this.spilt(m);
				s = this.spilt(s);
				var jqis = options.is;
				jqis.eq(0).text(h[0]);
				jqis.eq(1).text(h[1]);
				jqis.eq(2).text(m[0]);
				jqis.eq(3).text(m[1]);
				jqis.eq(4).text(s[0]);
				jqis.eq(5).text(s[1]);
				jqis.eq(6).text(sm);
			},
			
			init : function(){
				//设置界面
				$('#saleCost').text(opt.saleCost);
				normalTimer = setInterval(function(){
					nt += 100;
					_self.getResidue();
				}, 100);
				options.view.removeClass('hidden');
			}
		
		}

		if(nt > et){//活动已结束

			if(opt.originCost !== undefined){
				$('#saleCost').text(opt.originCost);
			}
			//console.log('活动已结束');
		}else{
			if(nt > st){			
				_self.init();
			}else{
				normalTimer = setInterval(function(){
					nt += 100;
					if(nt >= st){
						clearInterval(normalTimer);
						_self.init();
					}
				}, 100);
			}
		}

		return _self;
	};
	
	//只接受“1374760861000”格式
	FN.TimeClass = function(opt){
		var def = {
			type : 'compare',
			'endTime' :   1374636326178,
			'startTime' : 1374636315178,
			'nowTime' :   1374636325178
		};
		
		var self = {
			
			compare : function(s, e){
				return s < e;
			}, 
			
			getYear : function(d){},
			
			getMonth : function(d){},
			
			getDay : function(d){}
		};
		return self;
	
	}
	
	//资料购买数量
	FN.OrderAmount = function(){

		var view = $('#orders'),
			ms = view.find(".minus"),
			ps = view.find(".plus"),
			amount = view.find(".text-amount"),
			total = $("#total"),
			oj_total =  view.find(".oj_total"),
			oj_pirce =  view.find(".tab_pirce").find("em"),
			price_val = parseInt(oj_pirce.text());

		var _self = {
			setAmount : function(n){
				amount.val(n);
			},
			getAmount : function(){
				return parseInt(amount.val());
			},
			setPrice : function(){
				var total_val = this.getAmount() * price_val;
				oj_total.html(total_val);
				total.html(total_val);
			},
			setMs : function(color){
				if(color){
					ms.css({"color":"#CCCCCC"});
				}else{	
					ms.removeAttr("style");
				}
			},
			init : function(){
				ms.click(function(e){
					e.preventDefault();
					var num = _self.getAmount();
					if(num > 1){
						_self.setAmount(num -1);
						_self.setPrice();
						if(num == 2){
							_self.setMs(true);
						}
					}else{
						_self.setMs(true);
						amount.attr("value",'1');
					}
				});
				
				ps.click(function(){
					var num = _self.getAmount();
					if(num >= 998){
						alert("请确认您的购买数量！");	
					}else{
						num === 1 && _self.setMs();
						_self.setAmount(++num);
						_self.setPrice();
					}
				});
				
				amount.keyup(function(){
					var num = _self.getAmount();
					if(num >= 1 ){
						_self.setMs(num === 1);
						_self.setAmount(num);
					}else{
						//alert("最小购买量为1！");
						_self.setMs(true);
						_self.setAmount(num = 1);						
					}
					_self.setPrice();
					 if( num >= 999){
						alert("请确认您的购买数量！");	
					}
					
				});
			}
			
		};
		
		var cfg = G.PD.get(), timeObj;
		if(cfg.startTime && cfg.endTime){
			timeObj = FN.TimeClass();
			if(timeObj.compare(cfg.nowTime, cfg.endTime)){
				price_val = cfg.saleCost;
				oj_pirce.text(price_val);				
			}else{
				oj_pirce.text(cfg.originCost);
			};
			_self.setPrice();
		}
		_self.init();
		return _self;
	};
	
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
	
	FN.parse = function(htmls, map){
		var tplReg =  /\{(\.?[\w_|$]+)(\.[\w_$]+)?\}/g;
		return htmls.replace(tplReg, function(s, k , k1){
			var v, modfs, k_str, key;

			if (k.charCodeAt(0) === 46)  {
				k_str = k.substr(1);
				modfs = k_str.split('|');
				key = modfs.shift();
				v = map[key];
			}
			return v;
		});
	};
	
	//我的资料页面显示拒绝内容
	FN.showRefused = function(dom){
		var rebox = $('div.tooltip-refuse');
		if(rebox.length){
			rebox.closest('div.status').removeClass('drop');
			rebox.addClass('hidden');
		}
		var status = dom.closest('div.status'), tips = status.find('div.tooltip-refuse'), txt = dom.attr('rel');
		if(!tips.length){
			var temp = 	['<div class="dropdown tooltip tooltip-refuse hidden" id="refusedTips">',
							'<div class="dropdown-in">',
								'<p>拒绝原因：</p>',
								'<p id="msg">'+txt+'</p>',
							'</div>',
							'<span class="arrow">',
								'<i class="arrow-shadow"></i>',
								'<i class="arrow-border"></i>',
								'<i class="arrow-body"></i>',
							'</span>',
							'<a class="close" title="关闭" href="#" id="cld">关闭</a>',
						'</div>'].join('');
			tips = $(temp).appendTo(status);			
			tips.find('#cld').click(function(e){
				e.preventDefault();
				tips.addClass('hidden');
			});
		}
		status.addClass('drop');
		tips.removeClass('hidden');
	};

	//设置详细页在线人数
	FN.onlineUsers = function(){
		var jqonline = $('#onlineMath');
		// if(jqonline.length === 0) return;
		// var bigMath = 125800, base = 100, math = Math.ceil(Math.random()*base),
		// 	url = 'http://bbs.gaofen.com/';
		// math += bigMath;
		// switch(location.host){
		// 	case 'xsc.gaofen.com' :
		// 		url += 'forum-45-1.html';//小升初				
		// 	break;
		// 	case 'zhongkao.gaofen.com' :
		// 		url += 'forum-49-1.html';//中考
		// 	break;
		// 	case 'gaokao.gaofen.com' :
		// 		url += 'forum-53-1.html';//高考考
		// 	break;
		// };
    jqonline.attr('href', 'http://i.gaofen.com').text('[更多家长在线讨论]');
		// jqonline.attr('href', url).text('[当前'+math+'位家长在线讨论]');
		
		//加入文章页追踪代码
		$(window).load(function(){
			var jqTime = jqonline.parent().find('span.time');
			if(jqTime.length === 0) return;
			var time = jqTime.eq(0).text().split(' ')[0];						
			if(typeof dataLayer === 'undefined'){
				dataLayer = [];
			}
			dataLayer.push({'time':time});
		});
	}
	
	
	
	FN.DragBase = function(opt){
		var config = $.extend(this, {
			view : '',	//拖动体			
			handle : '',//拖动位置
			moved : false,//拖动过
			movePart : $('body'),
			dragBar : ''				
		}, opt)
		
		this.movePart = $('body');
		var that = this,
			view = this.view, 
			handle = this.handle = this.dragBar;
		this.init();
		

	}
			
	FN.DragBase.prototype = {
		
		init : function(){
			this.timeline = this.view.find('.timeline-list');
			var solHeight = this.view.height(), timelineHeight = this.timeline.height();
			this.solHeight = solHeight;
			this.timelineHeight = timelineHeight;
			var fb = solHeight / timelineHeight *100;
			//this.handOffTop = $('#dragBar').offset().top;
			if(timelineHeight < solHeight) return;
			this.scrollBar.removeClass('hidden');
			this.timelineoff = solHeight;
			this.barHeight = fb * solHeight / 100;
			this.dragBar.height(fb + '%');
			this.dragBarHeight = this.dragBar.height();
			if(this.view.length && this.handle.length){
				this.initBind();
			}
		},
	
		initBind : function(){
			var that = this;
			this.handle.on('mousedown', function(e){
				e.preventDefault();	
				$.proxy(that.bind, that)(e);
			}).on('click', function(e){
				e.preventDefault();	
			})
			
			//处理IE8以下
			$('body').on('mouseup', function(e){
				$.proxy(that.unbind, that)(e);
			});

			$(window).mouseup(function(e){
				e.preventDefault();	
				$.proxy(that.unbind, that)(e);
			}).mouseleave(function(e){
				if(e.target.tagName.toLowerCase() === 'html'){
					$.proxy(that.unbind, that)(e);
				}
			});
			
			
			//设置初始化高度根据active
			var active = this.timeline.find('div.active'), index;
			if(active.length && (index =  active.index())>0){
				var h = 0, allh = this.timeline.outerHeight(), val;
				this.timeline.children(':lt('+(index)+')').each(function(i, item){								
					h += $(item).outerHeight();
				});
				if(allh <= h + this.solHeight){
					val =  this.solHeight - this.barHeight;
				}else{					
					val = h/(allh)*this.solHeight;
				}
				this.setSrcoll(val);
			}
			
			
			this.view.on('mouseenter', function(e){
				that.mouseInter = true;
			}).on('mouseleave', function(e){
				that.mouseInter = false;
			})
			
			/*注册鼠标滚轮事件*/ 
			if(document.addEventListener && $.browser.mozilla){ 
				document.addEventListener('DOMMouseScroll',$.proxy(this.mouseScrollRun, this),false); 
			}//W3C 
			window.onmousewheel = document.onmousewheel = $.proxy(this.mouseScrollRun, this);//IE/Opera/Chrome 
		},
		//鼠标滚轮事件
		mouseInter : false,
		mouseScrollRun : function(e){
			e = e || window.event; 
			if(this.mouseInter){
				var direct=0, turn = 'top'; 
				if(e.wheelDelta){//IE/Opera/Chrome 
					turn = e.wheelDelta > 0 ? 'top' : 'down'
				}else if(e.detail){//Firefox 
					turn = e.detail <0 ? 'top' : 'down'
				}				
				this.mathMouseScroll(turn, e);
			}
		},
		
		mathMouseScroll : function(turn, e){
			var top = parseInt(this.dragBar.css('top')), val, isOutScroll;
			if(turn === 'top' && top >= 0){
				if(top === 0) isOutScroll = true;
				val = top - 5;
				val = val > 0 ? val : 0;
			}else if(turn === 'down' && top <= (max  = this.solHeight - this.dragBarHeight)){
				if(top === max) isOutScroll = true;
				val = top + 5;
				if(val > max){
					val = max;
				}				
			}
			if(!isOutScroll){
				if(e.preventDefault){
					e.preventDefault();
				}else{
					e.returnValue = false; 
				}
			}
			this.setSrcoll(val);
		},
		
		beforeDrag : $.noop,
		moveing : $.noop,
		afterDrag : $.noop,
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
			var view = this.view, top = parseInt(this.handle.css('top'));	
			this.startPositoin = {cx:e.clientX, cy:e.clientY, top:top};
			this.beforeDrag && this.beforeDrag(e);
		},

		dragStop : function(e){					
			if(this.moved){
				this.moved = false;
				var view = this.view, outResult;	
			}else{
				this.afterDrag && this.afterDrag();
			}
		},
		
		dragMove : function(e){
			this.moved = true;
			e.preventDefault();
			var cache = this.startPositoin, 
				view = this.view,
				top = cache.top,
				val = e.clientY - this.startPositoin.cy + top;
			this.setSrcoll(val);	
		},
		
		setSrcoll : function(val){
			if(val <= 0){
				val = 0;
			}else if(val > this.solHeight - this.dragBarHeight){
				val = this.solHeight - this.dragBarHeight;
			}	
			var ctop = this.handle.css('top', val);
			if(val !== 0){
				val = val /(this.solHeight - this.dragBarHeight);
			}
			this.timeline.css({top:-val * (this.timelineHeight - this.solHeight)});
		}
	};
			
			
	FN.ArticleList = function (opt){
		var config = $.extend(this, {
			view : '',
			listView : '',
			pageView : '',
			initLoadPage : false, //是否要加载第一页
			getLock : false,
			loadCs : ''
		}, opt);
		this.init();
	}
	
	FN.ArticleList.prototype  = {
		initLoaded : false,
	
		init : function(){
			var that  = this;
			this.pageView.on('click', 'a', function(e){
				e.preventDefault();
				if(that.setLock()) return;
				
				that.get($(this).attr('href'));
			});
			if(this.initLoadPage)
				this.get('http://'+Gaofen.PD.get("host")+'?mod=statistic&action=article&tplslug='+this.tplslug+'&page=1&callback=?');
			else{
				this.initLoaded = true;
				this.isImageNull();
				this.addAd();
			}
		},								
		
		setLock : function(p){
			if(p === undefined){
				return this.lock;
			}
			this.lock = p;
		},
	
		load : function(p){
			if(!p){
				if(this.initLoaded)
					$('body,html').animate({scrollTop:this.view.offset().top},1400, 'easeOut');
				else this.initLoaded = true;
			}
			if(this.initLoaded)
				this.view.animate({'opacity' : (p ? 0.4 : 1)}, 800);
		},
		
		get : function(uri){
			//uri = 'http://dev.cp.gaofen.com/?mod=statistic&action=article&tplslug=zhongkao&page=1';
			if(!uri) return;
			this.setLock(true);
			var that = this, tplslug = this.tplslug;
			this.load(true);					
			G.Ajax.send(uri, '', function(result){
				if(typeof result !== 'object')
					result = $.parseJSON(result);
				if(result.html){
					that.listView.html(result.html);
					that.isImageNull();
					that.pageView.children().html(result.pagehtml);
					that.addAd();

				}
				that.succ();
			}, 'jsonp');
		},
		
		addAd : function(){
			if(typeof callad === 'undefined') return;
			var pictures = this.listView.children('div.picture');
			pictures.each(function(i, item){
				var dom = $(item), id = dom.attr('id');
				(function(dom, id){
					var html = callad(id, '', 1);
					if($.trim(html) == '') dom.remove();
					else{
						dom.html(callad(id, '', 1)).removeClass('hidden');
					}
				})(dom, id);
			});
		},
		
		defaultImg : 'http://file.gaofen.com/nopic.png',
		isImageNull : function(){
			var defaultImg = this.defaultImg;
			this.listView.find('img').each(function(i, item){
				(function(dom){
					FN.loadImage(item.src,$.noop, function(){
						if(defaultImg) $(dom).attr('src', defaultImg);
						else $(dom).closest('div.thumb').remove();
					});
				})(item);			
			});
		},
		
		succ : function(){
			this.setLock(false);
			this.load(false);
		}
	
	}
	
	//切换tab
	FN.TabSwitch = function(opt){
		var config = $.extend(this, {
			view : '',
			controler: '',//控制区域
			targetName : 'a',//控制元素
			contentList : [],//内容区列表
			active : 'active',
			initAfter : $.noop,
			event : 'click'//事件类型
		}, opt);
		
		this.init();
	}
	
	FN.TabSwitch.prototype = {
	
		init : function(){
			if(this.event === 'click'){
				this.controler.on(this.event, this.targetName, $.proxy(this.select, this));
			}else{
				this.controler.find(this.targetName).on(this.event, $.proxy(this.select, this))
			}
			this.initAfter();
		},
		
		select : function(e){
			e.preventDefault();
			var jq = $(e.target), index = jq.index();
			if(jq.hasClass(this.active)) return;
			var hindex = this.controler.find('.'+this.active).removeClass(this.active).index();
			jq.addClass(this.active);		
			
			$(this.contentList[hindex]).addClass('hidden');
			$(this.contentList[index]).removeClass('hidden');
		}
	}
	
	//跟踪代码SEO
	FN.seoFollow = function(params){
		
		// if(G.PD.get('seoFollow') === '1'){
			if(typeof dataLayer === 'undefined'){
				dataLayer = [];
			}
			dataLayer.push(params); 
		// }			
	};
	
	
		/**
		 *  返回占用字节长度（一个字两个字节）
		 * @param {String} text
		 * @return {Number}
		 */
		FN.byteLen = function(text){
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
		FN.byteCut = function(str, length) {
		  var wlen = FN.byteLen(str);
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
		
		//虚拟图片加载
		FN.loadImage = function(src, succfn, errfn){
			if(src){
				var imgObj = new Image();
				$(imgObj).load(function(){
					succfn && succfn(this);
				}).error(function(){//取不到图片
					errfn && errfn();
				});							
				
				if (imgObj.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
					succfn && succfn(imgObj);
					return;
				 }				 
				 imgObj.src = src;
			}else{
				errfn && errfn();
			}
		}


		FN.topLogin = function(opt){
			var modal = $('#login_modal');
			if(modal.length === 0){
				modal = FN.createModal({
			 		cs : 'modal-login',
			 		title : '登录',
			 		modalBack : true,
			 		bodyHtml : G.Tpl.win_login
			 	});
				modal.removeClass('modal-tips').attr('id', 'login_modal');

				modal.on('reset', function(e){
					//console.log('reset');
				}).on('close', function(){
					modal.cssDisplay(0);
					modal.data('mb').cssDisplay(0);
				});

				var self = this, jf = modal.find('#form-logins'), inputs = jf.find('input[class="input-text"]'), 
					form_rows = jf.find('.form-row'), msg = modal.find('#msg'), 
					jqun = inputs.eq(0), jqpwd = inputs.eq(1),
					focusCss = 'hints', errorCss = '', successCss = 'success',
					lock = false;
				var setFormRowCss = function(dom, css){
					setSuccess($(dom).closest('.form-row').attr('class', 'form-row '+css), css === successCss);
				}
				var setSuccess = function(dom, p){
					dom.find('.help-inline').cssDisplay(p);
				}
				var vil = function(){
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
					if(e.keyCode === 13) modal.find('#lg').click();
				});
				var jqlg = modal.find('#lg').click(function(e){
					if(lock || !vil())return;
					lock = true;
					modal.find('#lgbtn').cssDisplay(0);
					modal.find('#lging').cssDisplay(1);	
					msg.cssDisplay(0);
					var url = 'http://ziliao.gaofen.com/ajax/login?callback=?';	
					G.Ajax.send(url, {
						username : $.trim(jqun.val()),
						password : $.trim(jqpwd.val()),
						save_me : modal.find('#rem').prop('checked') ? 1 : 0
					},function(r){
						lock = false;
						if(r.errno == '0'){
							//跟踪代码SEO
							G.FN.seoFollow({'event': 'signin'});							
							$("body").append(r.rst.data);
							setTimeout(function(){
								window.location.reload();
							},2000);
						}else{
							modal.find('#lgbtn').cssDisplay(1);
							modal.find('#lging').cssDisplay(0);
							jf.find('#register').attr({"title":"登录"}).prop('disabled', false).html("登录");
							msg.cssDisplay(1).html(r.err);								
						}
					}, 'jsonp');
				});



				modal.find('a.close').on('click', function(e){
					e.preventDefault();
					modal.trigger('reset').trigger('close');
				})
			 }
			try{
				modal.cssDisplay(1);
				if(!modal.mb){
					modal.data('mb').cssDisplay(1);
				}else{
					modal.data('mb', modal.mb);
				}
			    
			}catch(e){}


			 return modal;
		};

		FN.createModal = function(opt){
		 	var config = $.extend({
		 		cs : '',
		 		title : '',
		 		bodyHtml : '',
		 		modalBack : false,
		 		appendTo : 'body'
		 	}, opt);

		 	var modal = FN.parse(G.Tpl.modal, config);

		 	modal = $(modal).appendTo(config.appendTo);
		 	if(config.modalBack){
		 		modal.mb = $(G.Tpl.modalBack).appendTo('body');
		 	}

		 	return modal;
		 }


		G.actions.reg('lg', function(e){
			//登录浮层 暂时在新页面打开
			FN.topLogin();

		});

	//模拟select
	FN.initSelected = function(opt){
		$('div.ui-select-trigger select').each(function(i, item){
			var sjq = $(this);
			$('<span></span>').insertBefore(sjq);
			new Mselect(sjq);
			
		});

		function Mselect(sel){
			(function(_sel){
				setTimeout(function(){
					_sel.on('change', function(e){
						var jq = $(this), p = jq.closest('.ui-select-trigger'),
						v = jq.val(), text = jq.find('option:selected').text();
						p.find('span').text(text);
					});
					_sel.trigger('change');
				}, 1);
			})(sel);
		}
	}

	//右则距离时间表
	FN.rightSideTime = function(){
		var wcalendar = $('#wcalendar'), ul = wcalendar.find('ul'), lis = ul.find('li'),current = '',
			initflag = false, lock = false,
			eventDom = wcalendar.find('div.events'), active = 'active', page = 1, pageW = 76;
		if(wcalendar.length === 0) return;
		function select(dom){
			G.fire('monthselect', {
				target : dom
			});	
			if(initflag && lis.length >= 3){
				add();
			}	
		}
		function getPage(index){
			return _page = Math.ceil(index/3);
		} 
		function setPage(p){
			page = p;
			G.fire('changePage');
		}

		function del(toLeft){
			var curjq = ul.find('.'+active), childs = ul.find('li'), rel = Number(curjq.attr('rel'));
			if(toLeft === undefined){
				var next = rel === 12 ? 1 : rel +1, prev = rel === 1 ? 12 : rel - 1;
				childs.each(function(i, item){
					var _rel = Number($(item).attr('rel'));
					if(_rel !== rel && _rel !== next && _rel !== prev )
						$(item).remove(); 
				});
			}else{
				if(toLeft){
					ul.animate({'marginLeft': -pageW}, function(e){
						ul.css({'marginLeft': 0});	
						ul.children().eq(0).remove();
						lock = false;
					});	
				}else{
					ul.animate({'marginLeft': 0}, function(e){	
						ul.children().last().remove();
						lock = false;
					});	
				}
			}
		}


		function add(){
			var curjq = ul.find('.'+active), childs = ul.find('li'), rel = Number(curjq.attr('rel'));
			var next = rel === 12 ? 1 : rel +1, prev = rel === 1 ? 12 : rel - 1, toLeft = true, li;
			if(curjq.prev().length ===0 ){
				li = $('<li rel="'+prev+'">'+prev+'月</li>').insertBefore(curjq);	
				toLeft = false;	
				ul.css({'marginLeft': -pageW});	
			}else{
				li = $('<li rel="'+next+'">'+next+'月</li>').insertAfter(curjq);
			}
			if(Number(li.attr('rel')) -1 === current)
				li.addClass('current');
			del(toLeft);
		}
		G.on('changePage', function(p){
			var ml = (page - 1)*pageW;
			ul.animate({'marginLeft': -ml});
		});
		G.on('monthselect', function(p){
			if(p && p.target){
				ul.find('.'+active).removeClass(active);
				p.target.addClass(active);
				eventDom.children('div:visible').addClass('hidden');
				eventDom.children().eq(Number(p.target.attr('rel'))-1).removeClass('hidden');
			}
		});
		if(wcalendar.length === 0 ) return;
		// if(lis.length < 12){//测试补充数据
		// 	var j = 12 - lis.length;
		// 	for(var i=0;i<j;i++){
		// 		var cur = i+lis.length+1;
		// 		ul.append('<li rel="'+cur+'">'+cur+'</li>');
		// 		eventDom.append('<div class="cont hidden" rel="'+cur+'">'+i+'</div>');
		// 	}
		// 	ul.find('li:eq(2)').addClass('current');
		// }
		//if(lis.length < 3) return;
		current = ul.find('.current').index();
		select(ul.find('.current'));

		if(lis.length > 3) del();
		initflag = true;
		ul.on('click', function(e){
			if(lock) return;
			var tjq = $(e.target), index = tjq.index();
			if(!tjq.hasClass('active')){
				select(tjq);
			}
		});

		var minPage = 1, maxPage = 4;
		wcalendar.find('span.next, span.prev').on('click', function(e){
			e.preventDefault();
			if(lock) return;
			var tjq = $(this), cls = tjq.attr('class');
			if(cls === 'next'){
				select(ul.find('.'+active).next());			 
			}else{
				select(ul.find('.'+active).prev());				
			}

		})

	}
	

})(Gaofen, jQuery, window);
