/*! jQuery v1.8.3 jquery.com | jquery.org/license */
(function(e,t){function _(e){var t=M[e]={};return v.each(e.split(y),function(e,n){t[n]=!0}),t}function H(e,n,r){if(r===t&&e.nodeType===1){var i="data-"+n.replace(P,"-$1").toLowerCase();r=e.getAttribute(i);if(typeof r=="string"){try{r=r==="true"?!0:r==="false"?!1:r==="null"?null:+r+""===r?+r:D.test(r)?v.parseJSON(r):r}catch(s){}v.data(e,n,r)}else r=t}return r}function B(e){var t;for(t in e){if(t==="data"&&v.isEmptyObject(e[t]))continue;if(t!=="toJSON")return!1}return!0}function et(){return!1}function tt(){return!0}function ut(e){return!e||!e.parentNode||e.parentNode.nodeType===11}function at(e,t){do e=e[t];while(e&&e.nodeType!==1);return e}function ft(e,t,n){t=t||0;if(v.isFunction(t))return v.grep(e,function(e,r){var i=!!t.call(e,r,e);return i===n});if(t.nodeType)return v.grep(e,function(e,r){return e===t===n});if(typeof t=="string"){var r=v.grep(e,function(e){return e.nodeType===1});if(it.test(t))return v.filter(t,r,!n);t=v.filter(t,r)}return v.grep(e,function(e,r){return v.inArray(e,t)>=0===n})}function lt(e){var t=ct.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}function Lt(e,t){return e.getElementsByTagName(t)[0]||e.appendChild(e.ownerDocument.createElement(t))}function At(e,t){if(t.nodeType!==1||!v.hasData(e))return;var n,r,i,s=v._data(e),o=v._data(t,s),u=s.events;if(u){delete o.handle,o.events={};for(n in u)for(r=0,i=u[n].length;r<i;r++)v.event.add(t,n,u[n][r])}o.data&&(o.data=v.extend({},o.data))}function Ot(e,t){var n;if(t.nodeType!==1)return;t.clearAttributes&&t.clearAttributes(),t.mergeAttributes&&t.mergeAttributes(e),n=t.nodeName.toLowerCase(),n==="object"?(t.parentNode&&(t.outerHTML=e.outerHTML),v.support.html5Clone&&e.innerHTML&&!v.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):n==="input"&&Et.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):n==="option"?t.selected=e.defaultSelected:n==="input"||n==="textarea"?t.defaultValue=e.defaultValue:n==="script"&&t.text!==e.text&&(t.text=e.text),t.removeAttribute(v.expando)}function Mt(e){return typeof e.getElementsByTagName!="undefined"?e.getElementsByTagName("*"):typeof e.querySelectorAll!="undefined"?e.querySelectorAll("*"):[]}function _t(e){Et.test(e.type)&&(e.defaultChecked=e.checked)}function Qt(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=Jt.length;while(i--){t=Jt[i]+n;if(t in e)return t}return r}function Gt(e,t){return e=t||e,v.css(e,"display")==="none"||!v.contains(e.ownerDocument,e)}function Yt(e,t){var n,r,i=[],s=0,o=e.length;for(;s<o;s++){n=e[s];if(!n.style)continue;i[s]=v._data(n,"olddisplay"),t?(!i[s]&&n.style.display==="none"&&(n.style.display=""),n.style.display===""&&Gt(n)&&(i[s]=v._data(n,"olddisplay",nn(n.nodeName)))):(r=Dt(n,"display"),!i[s]&&r!=="none"&&v._data(n,"olddisplay",r))}for(s=0;s<o;s++){n=e[s];if(!n.style)continue;if(!t||n.style.display==="none"||n.style.display==="")n.style.display=t?i[s]||"":"none"}return e}function Zt(e,t,n){var r=Rt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function en(e,t,n,r){var i=n===(r?"border":"content")?4:t==="width"?1:0,s=0;for(;i<4;i+=2)n==="margin"&&(s+=v.css(e,n+$t[i],!0)),r?(n==="content"&&(s-=parseFloat(Dt(e,"padding"+$t[i]))||0),n!=="margin"&&(s-=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0)):(s+=parseFloat(Dt(e,"padding"+$t[i]))||0,n!=="padding"&&(s+=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0));return s}function tn(e,t,n){var r=t==="width"?e.offsetWidth:e.offsetHeight,i=!0,s=v.support.boxSizing&&v.css(e,"boxSizing")==="border-box";if(r<=0||r==null){r=Dt(e,t);if(r<0||r==null)r=e.style[t];if(Ut.test(r))return r;i=s&&(v.support.boxSizingReliable||r===e.style[t]),r=parseFloat(r)||0}return r+en(e,t,n||(s?"border":"content"),i)+"px"}function nn(e){if(Wt[e])return Wt[e];var t=v("<"+e+">").appendTo(i.body),n=t.css("display");t.remove();if(n==="none"||n===""){Pt=i.body.appendChild(Pt||v.extend(i.createElement("iframe"),{frameBorder:0,width:0,height:0}));if(!Ht||!Pt.createElement)Ht=(Pt.contentWindow||Pt.contentDocument).document,Ht.write("<!doctype html><html><body>"),Ht.close();t=Ht.body.appendChild(Ht.createElement(e)),n=Dt(t,"display"),i.body.removeChild(Pt)}return Wt[e]=n,n}function fn(e,t,n,r){var i;if(v.isArray(t))v.each(t,function(t,i){n||sn.test(e)?r(e,i):fn(e+"["+(typeof i=="object"?t:"")+"]",i,n,r)});else if(!n&&v.type(t)==="object")for(i in t)fn(e+"["+i+"]",t[i],n,r);else r(e,t)}function Cn(e){return function(t,n){typeof t!="string"&&(n=t,t="*");var r,i,s,o=t.toLowerCase().split(y),u=0,a=o.length;if(v.isFunction(n))for(;u<a;u++)r=o[u],s=/^\+/.test(r),s&&(r=r.substr(1)||"*"),i=e[r]=e[r]||[],i[s?"unshift":"push"](n)}}function kn(e,n,r,i,s,o){s=s||n.dataTypes[0],o=o||{},o[s]=!0;var u,a=e[s],f=0,l=a?a.length:0,c=e===Sn;for(;f<l&&(c||!u);f++)u=a[f](n,r,i),typeof u=="string"&&(!c||o[u]?u=t:(n.dataTypes.unshift(u),u=kn(e,n,r,i,u,o)));return(c||!u)&&!o["*"]&&(u=kn(e,n,r,i,"*",o)),u}function Ln(e,n){var r,i,s=v.ajaxSettings.flatOptions||{};for(r in n)n[r]!==t&&((s[r]?e:i||(i={}))[r]=n[r]);i&&v.extend(!0,e,i)}function An(e,n,r){var i,s,o,u,a=e.contents,f=e.dataTypes,l=e.responseFields;for(s in l)s in r&&(n[l[s]]=r[s]);while(f[0]==="*")f.shift(),i===t&&(i=e.mimeType||n.getResponseHeader("content-type"));if(i)for(s in a)if(a[s]&&a[s].test(i)){f.unshift(s);break}if(f[0]in r)o=f[0];else{for(s in r){if(!f[0]||e.converters[s+" "+f[0]]){o=s;break}u||(u=s)}o=o||u}if(o)return o!==f[0]&&f.unshift(o),r[o]}function On(e,t){var n,r,i,s,o=e.dataTypes.slice(),u=o[0],a={},f=0;e.dataFilter&&(t=e.dataFilter(t,e.dataType));if(o[1])for(n in e.converters)a[n.toLowerCase()]=e.converters[n];for(;i=o[++f];)if(i!=="*"){if(u!=="*"&&u!==i){n=a[u+" "+i]||a["* "+i];if(!n)for(r in a){s=r.split(" ");if(s[1]===i){n=a[u+" "+s[0]]||a["* "+s[0]];if(n){n===!0?n=a[r]:a[r]!==!0&&(i=s[0],o.splice(f--,0,i));break}}}if(n!==!0)if(n&&e["throws"])t=n(t);else try{t=n(t)}catch(l){return{state:"parsererror",error:n?l:"No conversion from "+u+" to "+i}}}u=i}return{state:"success",data:t}}function Fn(){try{return new e.XMLHttpRequest}catch(t){}}function In(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}function $n(){return setTimeout(function(){qn=t},0),qn=v.now()}function Jn(e,t){v.each(t,function(t,n){var r=(Vn[t]||[]).concat(Vn["*"]),i=0,s=r.length;for(;i<s;i++)if(r[i].call(e,t,n))return})}function Kn(e,t,n){var r,i=0,s=0,o=Xn.length,u=v.Deferred().always(function(){delete a.elem}),a=function(){var t=qn||$n(),n=Math.max(0,f.startTime+f.duration-t),r=n/f.duration||0,i=1-r,s=0,o=f.tweens.length;for(;s<o;s++)f.tweens[s].run(i);return u.notifyWith(e,[f,i,n]),i<1&&o?n:(u.resolveWith(e,[f]),!1)},f=u.promise({elem:e,props:v.extend({},t),opts:v.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:qn||$n(),duration:n.duration,tweens:[],createTween:function(t,n,r){var i=v.Tween(e,f.opts,t,n,f.opts.specialEasing[t]||f.opts.easing);return f.tweens.push(i),i},stop:function(t){var n=0,r=t?f.tweens.length:0;for(;n<r;n++)f.tweens[n].run(1);return t?u.resolveWith(e,[f,t]):u.rejectWith(e,[f,t]),this}}),l=f.props;Qn(l,f.opts.specialEasing);for(;i<o;i++){r=Xn[i].call(f,e,l,f.opts);if(r)return r}return Jn(f,l),v.isFunction(f.opts.start)&&f.opts.start.call(e,f),v.fx.timer(v.extend(a,{anim:f,queue:f.opts.queue,elem:e})),f.progress(f.opts.progress).done(f.opts.done,f.opts.complete).fail(f.opts.fail).always(f.opts.always)}function Qn(e,t){var n,r,i,s,o;for(n in e){r=v.camelCase(n),i=t[r],s=e[n],v.isArray(s)&&(i=s[1],s=e[n]=s[0]),n!==r&&(e[r]=s,delete e[n]),o=v.cssHooks[r];if(o&&"expand"in o){s=o.expand(s),delete e[r];for(n in s)n in e||(e[n]=s[n],t[n]=i)}else t[r]=i}}function Gn(e,t,n){var r,i,s,o,u,a,f,l,c,h=this,p=e.style,d={},m=[],g=e.nodeType&&Gt(e);n.queue||(l=v._queueHooks(e,"fx"),l.unqueued==null&&(l.unqueued=0,c=l.empty.fire,l.empty.fire=function(){l.unqueued||c()}),l.unqueued++,h.always(function(){h.always(function(){l.unqueued--,v.queue(e,"fx").length||l.empty.fire()})})),e.nodeType===1&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],v.css(e,"display")==="inline"&&v.css(e,"float")==="none"&&(!v.support.inlineBlockNeedsLayout||nn(e.nodeName)==="inline"?p.display="inline-block":p.zoom=1)),n.overflow&&(p.overflow="hidden",v.support.shrinkWrapBlocks||h.done(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t){s=t[r];if(Un.exec(s)){delete t[r],a=a||s==="toggle";if(s===(g?"hide":"show"))continue;m.push(r)}}o=m.length;if(o){u=v._data(e,"fxshow")||v._data(e,"fxshow",{}),"hidden"in u&&(g=u.hidden),a&&(u.hidden=!g),g?v(e).show():h.done(function(){v(e).hide()}),h.done(function(){var t;v.removeData(e,"fxshow",!0);for(t in d)v.style(e,t,d[t])});for(r=0;r<o;r++)i=m[r],f=h.createTween(i,g?u[i]:0),d[i]=u[i]||v.style(e,i),i in u||(u[i]=f.start,g&&(f.end=f.start,f.start=i==="width"||i==="height"?1:0))}}function Yn(e,t,n,r,i){return new Yn.prototype.init(e,t,n,r,i)}function Zn(e,t){var n,r={height:e},i=0;t=t?1:0;for(;i<4;i+=2-t)n=$t[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}function tr(e){return v.isWindow(e)?e:e.nodeType===9?e.defaultView||e.parentWindow:!1}var n,r,i=e.document,s=e.location,o=e.navigator,u=e.jQuery,a=e.$,f=Array.prototype.push,l=Array.prototype.slice,c=Array.prototype.indexOf,h=Object.prototype.toString,p=Object.prototype.hasOwnProperty,d=String.prototype.trim,v=function(e,t){return new v.fn.init(e,t,n)},m=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,g=/\S/,y=/\s+/,b=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,w=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,E=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,S=/^[\],:{}\s]*$/,x=/(?:^|:|,)(?:\s*\[)+/g,T=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,N=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,C=/^-ms-/,k=/-([\da-z])/gi,L=function(e,t){return(t+"").toUpperCase()},A=function(){i.addEventListener?(i.removeEventListener("DOMContentLoaded",A,!1),v.ready()):i.readyState==="complete"&&(i.detachEvent("onreadystatechange",A),v.ready())},O={};v.fn=v.prototype={constructor:v,init:function(e,n,r){var s,o,u,a;if(!e)return this;if(e.nodeType)return this.context=this[0]=e,this.length=1,this;if(typeof e=="string"){e.charAt(0)==="<"&&e.charAt(e.length-1)===">"&&e.length>=3?s=[null,e,null]:s=w.exec(e);if(s&&(s[1]||!n)){if(s[1])return n=n instanceof v?n[0]:n,a=n&&n.nodeType?n.ownerDocument||n:i,e=v.parseHTML(s[1],a,!0),E.test(s[1])&&v.isPlainObject(n)&&this.attr.call(e,n,!0),v.merge(this,e);o=i.getElementById(s[2]);if(o&&o.parentNode){if(o.id!==s[2])return r.find(e);this.length=1,this[0]=o}return this.context=i,this.selector=e,this}return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e)}return v.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),v.makeArray(e,this))},selector:"",jquery:"1.8.3",length:0,size:function(){return this.length},toArray:function(){return l.call(this)},get:function(e){return e==null?this.toArray():e<0?this[this.length+e]:this[e]},pushStack:function(e,t,n){var r=v.merge(this.constructor(),e);return r.prevObject=this,r.context=this.context,t==="find"?r.selector=this.selector+(this.selector?" ":"")+n:t&&(r.selector=this.selector+"."+t+"("+n+")"),r},each:function(e,t){return v.each(this,e,t)},ready:function(e){return v.ready.promise().done(e),this},eq:function(e){return e=+e,e===-1?this.slice(e):this.slice(e,e+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(l.apply(this,arguments),"slice",l.call(arguments).join(","))},map:function(e){return this.pushStack(v.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:[].sort,splice:[].splice},v.fn.init.prototype=v.fn,v.extend=v.fn.extend=function(){var e,n,r,i,s,o,u=arguments[0]||{},a=1,f=arguments.length,l=!1;typeof u=="boolean"&&(l=u,u=arguments[1]||{},a=2),typeof u!="object"&&!v.isFunction(u)&&(u={}),f===a&&(u=this,--a);for(;a<f;a++)if((e=arguments[a])!=null)for(n in e){r=u[n],i=e[n];if(u===i)continue;l&&i&&(v.isPlainObject(i)||(s=v.isArray(i)))?(s?(s=!1,o=r&&v.isArray(r)?r:[]):o=r&&v.isPlainObject(r)?r:{},u[n]=v.extend(l,o,i)):i!==t&&(u[n]=i)}return u},v.extend({noConflict:function(t){return e.$===v&&(e.$=a),t&&e.jQuery===v&&(e.jQuery=u),v},isReady:!1,readyWait:1,holdReady:function(e){e?v.readyWait++:v.ready(!0)},ready:function(e){if(e===!0?--v.readyWait:v.isReady)return;if(!i.body)return setTimeout(v.ready,1);v.isReady=!0;if(e!==!0&&--v.readyWait>0)return;r.resolveWith(i,[v]),v.fn.trigger&&v(i).trigger("ready").off("ready")},isFunction:function(e){return v.type(e)==="function"},isArray:Array.isArray||function(e){return v.type(e)==="array"},isWindow:function(e){return e!=null&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return e==null?String(e):O[h.call(e)]||"object"},isPlainObject:function(e){if(!e||v.type(e)!=="object"||e.nodeType||v.isWindow(e))return!1;try{if(e.constructor&&!p.call(e,"constructor")&&!p.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(n){return!1}var r;for(r in e);return r===t||p.call(e,r)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw new Error(e)},parseHTML:function(e,t,n){var r;return!e||typeof e!="string"?null:(typeof t=="boolean"&&(n=t,t=0),t=t||i,(r=E.exec(e))?[t.createElement(r[1])]:(r=v.buildFragment([e],t,n?null:[]),v.merge([],(r.cacheable?v.clone(r.fragment):r.fragment).childNodes)))},parseJSON:function(t){if(!t||typeof t!="string")return null;t=v.trim(t);if(e.JSON&&e.JSON.parse)return e.JSON.parse(t);if(S.test(t.replace(T,"@").replace(N,"]").replace(x,"")))return(new Function("return "+t))();v.error("Invalid JSON: "+t)},parseXML:function(n){var r,i;if(!n||typeof n!="string")return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(s){r=t}return(!r||!r.documentElement||r.getElementsByTagName("parsererror").length)&&v.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&g.test(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(C,"ms-").replace(k,L)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,n,r){var i,s=0,o=e.length,u=o===t||v.isFunction(e);if(r){if(u){for(i in e)if(n.apply(e[i],r)===!1)break}else for(;s<o;)if(n.apply(e[s++],r)===!1)break}else if(u){for(i in e)if(n.call(e[i],i,e[i])===!1)break}else for(;s<o;)if(n.call(e[s],s,e[s++])===!1)break;return e},trim:d&&!d.call("\ufeff\u00a0")?function(e){return e==null?"":d.call(e)}:function(e){return e==null?"":(e+"").replace(b,"")},makeArray:function(e,t){var n,r=t||[];return e!=null&&(n=v.type(e),e.length==null||n==="string"||n==="function"||n==="regexp"||v.isWindow(e)?f.call(r,e):v.merge(r,e)),r},inArray:function(e,t,n){var r;if(t){if(c)return c.call(t,e,n);r=t.length,n=n?n<0?Math.max(0,r+n):n:0;for(;n<r;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,s=0;if(typeof r=="number")for(;s<r;s++)e[i++]=n[s];else while(n[s]!==t)e[i++]=n[s++];return e.length=i,e},grep:function(e,t,n){var r,i=[],s=0,o=e.length;n=!!n;for(;s<o;s++)r=!!t(e[s],s),n!==r&&i.push(e[s]);return i},map:function(e,n,r){var i,s,o=[],u=0,a=e.length,f=e instanceof v||a!==t&&typeof a=="number"&&(a>0&&e[0]&&e[a-1]||a===0||v.isArray(e));if(f)for(;u<a;u++)i=n(e[u],u,r),i!=null&&(o[o.length]=i);else for(s in e)i=n(e[s],s,r),i!=null&&(o[o.length]=i);return o.concat.apply([],o)},guid:1,proxy:function(e,n){var r,i,s;return typeof n=="string"&&(r=e[n],n=e,e=r),v.isFunction(e)?(i=l.call(arguments,2),s=function(){return e.apply(n,i.concat(l.call(arguments)))},s.guid=e.guid=e.guid||v.guid++,s):t},access:function(e,n,r,i,s,o,u){var a,f=r==null,l=0,c=e.length;if(r&&typeof r=="object"){for(l in r)v.access(e,n,l,r[l],1,o,i);s=1}else if(i!==t){a=u===t&&v.isFunction(i),f&&(a?(a=n,n=function(e,t,n){return a.call(v(e),n)}):(n.call(e,i),n=null));if(n)for(;l<c;l++)n(e[l],r,a?i.call(e[l],l,n(e[l],r)):i,u);s=1}return s?e:f?n.call(e):c?n(e[0],r):o},now:function(){return(new Date).getTime()}}),v.ready.promise=function(t){if(!r){r=v.Deferred();if(i.readyState==="complete")setTimeout(v.ready,1);else if(i.addEventListener)i.addEventListener("DOMContentLoaded",A,!1),e.addEventListener("load",v.ready,!1);else{i.attachEvent("onreadystatechange",A),e.attachEvent("onload",v.ready);var n=!1;try{n=e.frameElement==null&&i.documentElement}catch(s){}n&&n.doScroll&&function o(){if(!v.isReady){try{n.doScroll("left")}catch(e){return setTimeout(o,50)}v.ready()}}()}}return r.promise(t)},v.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(e,t){O["[object "+t+"]"]=t.toLowerCase()}),n=v(i);var M={};v.Callbacks=function(e){e=typeof e=="string"?M[e]||_(e):v.extend({},e);var n,r,i,s,o,u,a=[],f=!e.once&&[],l=function(t){n=e.memory&&t,r=!0,u=s||0,s=0,o=a.length,i=!0;for(;a&&u<o;u++)if(a[u].apply(t[0],t[1])===!1&&e.stopOnFalse){n=!1;break}i=!1,a&&(f?f.length&&l(f.shift()):n?a=[]:c.disable())},c={add:function(){if(a){var t=a.length;(function r(t){v.each(t,function(t,n){var i=v.type(n);i==="function"?(!e.unique||!c.has(n))&&a.push(n):n&&n.length&&i!=="string"&&r(n)})})(arguments),i?o=a.length:n&&(s=t,l(n))}return this},remove:function(){return a&&v.each(arguments,function(e,t){var n;while((n=v.inArray(t,a,n))>-1)a.splice(n,1),i&&(n<=o&&o--,n<=u&&u--)}),this},has:function(e){return v.inArray(e,a)>-1},empty:function(){return a=[],this},disable:function(){return a=f=n=t,this},disabled:function(){return!a},lock:function(){return f=t,n||c.disable(),this},locked:function(){return!f},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],a&&(!r||f)&&(i?f.push(t):l(t)),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!r}};return c},v.extend({Deferred:function(e){var t=[["resolve","done",v.Callbacks("once memory"),"resolved"],["reject","fail",v.Callbacks("once memory"),"rejected"],["notify","progress",v.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return v.Deferred(function(n){v.each(t,function(t,r){var s=r[0],o=e[t];i[r[1]](v.isFunction(o)?function(){var e=o.apply(this,arguments);e&&v.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[s+"With"](this===i?n:this,[e])}:n[s])}),e=null}).promise()},promise:function(e){return e!=null?v.extend(e,r):r}},i={};return r.pipe=r.then,v.each(t,function(e,s){var o=s[2],u=s[3];r[s[1]]=o.add,u&&o.add(function(){n=u},t[e^1][2].disable,t[2][2].lock),i[s[0]]=o.fire,i[s[0]+"With"]=o.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=l.call(arguments),r=n.length,i=r!==1||e&&v.isFunction(e.promise)?r:0,s=i===1?e:v.Deferred(),o=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?l.call(arguments):r,n===u?s.notifyWith(t,n):--i||s.resolveWith(t,n)}},u,a,f;if(r>1){u=new Array(r),a=new Array(r),f=new Array(r);for(;t<r;t++)n[t]&&v.isFunction(n[t].promise)?n[t].promise().done(o(t,f,n)).fail(s.reject).progress(o(t,a,u)):--i}return i||s.resolveWith(f,n),s.promise()}}),v.support=function(){var t,n,r,s,o,u,a,f,l,c,h,p=i.createElement("div");p.setAttribute("className","t"),p.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=p.getElementsByTagName("*"),r=p.getElementsByTagName("a")[0];if(!n||!r||!n.length)return{};s=i.createElement("select"),o=s.appendChild(i.createElement("option")),u=p.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(r.getAttribute("style")),hrefNormalized:r.getAttribute("href")==="/a",opacity:/^0.5/.test(r.style.opacity),cssFloat:!!r.style.cssFloat,checkOn:u.value==="on",optSelected:o.selected,getSetAttribute:p.className!=="t",enctype:!!i.createElement("form").enctype,html5Clone:i.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",boxModel:i.compatMode==="CSS1Compat",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},u.checked=!0,t.noCloneChecked=u.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!o.disabled;try{delete p.test}catch(d){t.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",h=function(){t.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick"),p.detachEvent("onclick",h)),u=i.createElement("input"),u.value="t",u.setAttribute("type","radio"),t.radioValue=u.value==="t",u.setAttribute("checked","checked"),u.setAttribute("name","t"),p.appendChild(u),a=i.createDocumentFragment(),a.appendChild(p.lastChild),t.checkClone=a.cloneNode(!0).cloneNode(!0).lastChild.checked,t.appendChecked=u.checked,a.removeChild(u),a.appendChild(p);if(p.attachEvent)for(l in{submit:!0,change:!0,focusin:!0})f="on"+l,c=f in p,c||(p.setAttribute(f,"return;"),c=typeof p[f]=="function"),t[l+"Bubbles"]=c;return v(function(){var n,r,s,o,u="padding:0;margin:0;border:0;display:block;overflow:hidden;",a=i.getElementsByTagName("body")[0];if(!a)return;n=i.createElement("div"),n.style.cssText="visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px",a.insertBefore(n,a.firstChild),r=i.createElement("div"),n.appendChild(r),r.innerHTML="<table><tr><td></td><td>t</td></tr></table>",s=r.getElementsByTagName("td"),s[0].style.cssText="padding:0;margin:0;border:0;display:none",c=s[0].offsetHeight===0,s[0].style.display="",s[1].style.display="none",t.reliableHiddenOffsets=c&&s[0].offsetHeight===0,r.innerHTML="",r.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",t.boxSizing=r.offsetWidth===4,t.doesNotIncludeMarginInBodyOffset=a.offsetTop!==1,e.getComputedStyle&&(t.pixelPosition=(e.getComputedStyle(r,null)||{}).top!=="1%",t.boxSizingReliable=(e.getComputedStyle(r,null)||{width:"4px"}).width==="4px",o=i.createElement("div"),o.style.cssText=r.style.cssText=u,o.style.marginRight=o.style.width="0",r.style.width="1px",r.appendChild(o),t.reliableMarginRight=!parseFloat((e.getComputedStyle(o,null)||{}).marginRight)),typeof r.style.zoom!="undefined"&&(r.innerHTML="",r.style.cssText=u+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=r.offsetWidth===3,r.style.display="block",r.style.overflow="visible",r.innerHTML="<div></div>",r.firstChild.style.width="5px",t.shrinkWrapBlocks=r.offsetWidth!==3,n.style.zoom=1),a.removeChild(n),n=r=s=o=null}),a.removeChild(p),n=r=s=o=u=a=p=null,t}();var D=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;v.extend({cache:{},deletedIds:[],uuid:0,expando:"jQuery"+(v.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(e){return e=e.nodeType?v.cache[e[v.expando]]:e[v.expando],!!e&&!B(e)},data:function(e,n,r,i){if(!v.acceptData(e))return;var s,o,u=v.expando,a=typeof n=="string",f=e.nodeType,l=f?v.cache:e,c=f?e[u]:e[u]&&u;if((!c||!l[c]||!i&&!l[c].data)&&a&&r===t)return;c||(f?e[u]=c=v.deletedIds.pop()||v.guid++:c=u),l[c]||(l[c]={},f||(l[c].toJSON=v.noop));if(typeof n=="object"||typeof n=="function")i?l[c]=v.extend(l[c],n):l[c].data=v.extend(l[c].data,n);return s=l[c],i||(s.data||(s.data={}),s=s.data),r!==t&&(s[v.camelCase(n)]=r),a?(o=s[n],o==null&&(o=s[v.camelCase(n)])):o=s,o},removeData:function(e,t,n){if(!v.acceptData(e))return;var r,i,s,o=e.nodeType,u=o?v.cache:e,a=o?e[v.expando]:v.expando;if(!u[a])return;if(t){r=n?u[a]:u[a].data;if(r){v.isArray(t)||(t in r?t=[t]:(t=v.camelCase(t),t in r?t=[t]:t=t.split(" ")));for(i=0,s=t.length;i<s;i++)delete r[t[i]];if(!(n?B:v.isEmptyObject)(r))return}}if(!n){delete u[a].data;if(!B(u[a]))return}o?v.cleanData([e],!0):v.support.deleteExpando||u!=u.window?delete u[a]:u[a]=null},_data:function(e,t,n){return v.data(e,t,n,!0)},acceptData:function(e){var t=e.nodeName&&v.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),v.fn.extend({data:function(e,n){var r,i,s,o,u,a=this[0],f=0,l=null;if(e===t){if(this.length){l=v.data(a);if(a.nodeType===1&&!v._data(a,"parsedAttrs")){s=a.attributes;for(u=s.length;f<u;f++)o=s[f].name,o.indexOf("data-")||(o=v.camelCase(o.substring(5)),H(a,o,l[o]));v._data(a,"parsedAttrs",!0)}}return l}return typeof e=="object"?this.each(function(){v.data(this,e)}):(r=e.split(".",2),r[1]=r[1]?"."+r[1]:"",i=r[1]+"!",v.access(this,function(n){if(n===t)return l=this.triggerHandler("getData"+i,[r[0]]),l===t&&a&&(l=v.data(a,e),l=H(a,e,l)),l===t&&r[1]?this.data(r[0]):l;r[1]=n,this.each(function(){var t=v(this);t.triggerHandler("setData"+i,r),v.data(this,e,n),t.triggerHandler("changeData"+i,r)})},null,n,arguments.length>1,null,!1))},removeData:function(e){return this.each(function(){v.removeData(this,e)})}}),v.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=v._data(e,t),n&&(!r||v.isArray(n)?r=v._data(e,t,v.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=v.queue(e,t),r=n.length,i=n.shift(),s=v._queueHooks(e,t),o=function(){v.dequeue(e,t)};i==="inprogress"&&(i=n.shift(),r--),i&&(t==="fx"&&n.unshift("inprogress"),delete s.stop,i.call(e,o,s)),!r&&s&&s.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return v._data(e,n)||v._data(e,n,{empty:v.Callbacks("once memory").add(function(){v.removeData(e,t+"queue",!0),v.removeData(e,n,!0)})})}}),v.fn.extend({queue:function(e,n){var r=2;return typeof e!="string"&&(n=e,e="fx",r--),arguments.length<r?v.queue(this[0],e):n===t?this:this.each(function(){var t=v.queue(this,e,n);v._queueHooks(this,e),e==="fx"&&t[0]!=="inprogress"&&v.dequeue(this,e)})},dequeue:function(e){return this.each(function(){v.dequeue(this,e)})},delay:function(e,t){return e=v.fx?v.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,s=v.Deferred(),o=this,u=this.length,a=function(){--i||s.resolveWith(o,[o])};typeof e!="string"&&(n=e,e=t),e=e||"fx";while(u--)r=v._data(o[u],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(a));return a(),s.promise(n)}});var j,F,I,q=/[\t\r\n]/g,R=/\r/g,U=/^(?:button|input)$/i,z=/^(?:button|input|object|select|textarea)$/i,W=/^a(?:rea|)$/i,X=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,V=v.support.getSetAttribute;v.fn.extend({attr:function(e,t){return v.access(this,v.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){v.removeAttr(this,e)})},prop:function(e,t){return v.access(this,v.prop,e,t,arguments.length>1)},removeProp:function(e){return e=v.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,s,o,u;if(v.isFunction(e))return this.each(function(t){v(this).addClass(e.call(this,t,this.className))});if(e&&typeof e=="string"){t=e.split(y);for(n=0,r=this.length;n<r;n++){i=this[n];if(i.nodeType===1)if(!i.className&&t.length===1)i.className=e;else{s=" "+i.className+" ";for(o=0,u=t.length;o<u;o++)s.indexOf(" "+t[o]+" ")<0&&(s+=t[o]+" ");i.className=v.trim(s)}}}return this},removeClass:function(e){var n,r,i,s,o,u,a;if(v.isFunction(e))return this.each(function(t){v(this).removeClass(e.call(this,t,this.className))});if(e&&typeof e=="string"||e===t){n=(e||"").split(y);for(u=0,a=this.length;u<a;u++){i=this[u];if(i.nodeType===1&&i.className){r=(" "+i.className+" ").replace(q," ");for(s=0,o=n.length;s<o;s++)while(r.indexOf(" "+n[s]+" ")>=0)r=r.replace(" "+n[s]+" "," ");i.className=e?v.trim(r):""}}}return this},toggleClass:function(e,t){var n=typeof e,r=typeof t=="boolean";return v.isFunction(e)?this.each(function(n){v(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if(n==="string"){var i,s=0,o=v(this),u=t,a=e.split(y);while(i=a[s++])u=r?u:!o.hasClass(i),o[u?"addClass":"removeClass"](i)}else if(n==="undefined"||n==="boolean")this.className&&v._data(this,"__className__",this.className),this.className=this.className||e===!1?"":v._data(this,"__className__")||""})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;n<r;n++)if(this[n].nodeType===1&&(" "+this[n].className+" ").replace(q," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,s=this[0];if(!arguments.length){if(s)return n=v.valHooks[s.type]||v.valHooks[s.nodeName.toLowerCase()],n&&"get"in n&&(r=n.get(s,"value"))!==t?r:(r=s.value,typeof r=="string"?r.replace(R,""):r==null?"":r);return}return i=v.isFunction(e),this.each(function(r){var s,o=v(this);if(this.nodeType!==1)return;i?s=e.call(this,r,o.val()):s=e,s==null?s="":typeof s=="number"?s+="":v.isArray(s)&&(s=v.map(s,function(e){return e==null?"":e+""})),n=v.valHooks[this.type]||v.valHooks[this.nodeName.toLowerCase()];if(!n||!("set"in n)||n.set(this,s,"value")===t)this.value=s})}}),v.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,s=e.type==="select-one"||i<0,o=s?null:[],u=s?i+1:r.length,a=i<0?u:s?i:0;for(;a<u;a++){n=r[a];if((n.selected||a===i)&&(v.support.optDisabled?!n.disabled:n.getAttribute("disabled")===null)&&(!n.parentNode.disabled||!v.nodeName(n.parentNode,"optgroup"))){t=v(n).val();if(s)return t;o.push(t)}}return o},set:function(e,t){var n=v.makeArray(t);return v(e).find("option").each(function(){this.selected=v.inArray(v(this).val(),n)>=0}),n.length||(e.selectedIndex=-1),n}}},attrFn:{},attr:function(e,n,r,i){var s,o,u,a=e.nodeType;if(!e||a===3||a===8||a===2)return;if(i&&v.isFunction(v.fn[n]))return v(e)[n](r);if(typeof e.getAttribute=="undefined")return v.prop(e,n,r);u=a!==1||!v.isXMLDoc(e),u&&(n=n.toLowerCase(),o=v.attrHooks[n]||(X.test(n)?F:j));if(r!==t){if(r===null){v.removeAttr(e,n);return}return o&&"set"in o&&u&&(s=o.set(e,r,n))!==t?s:(e.setAttribute(n,r+""),r)}return o&&"get"in o&&u&&(s=o.get(e,n))!==null?s:(s=e.getAttribute(n),s===null?t:s)},removeAttr:function(e,t){var n,r,i,s,o=0;if(t&&e.nodeType===1){r=t.split(y);for(;o<r.length;o++)i=r[o],i&&(n=v.propFix[i]||i,s=X.test(i),s||v.attr(e,i,""),e.removeAttribute(V?i:n),s&&n in e&&(e[n]=!1))}},attrHooks:{type:{set:function(e,t){if(U.test(e.nodeName)&&e.parentNode)v.error("type property can't be changed");else if(!v.support.radioValue&&t==="radio"&&v.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}},value:{get:function(e,t){return j&&v.nodeName(e,"button")?j.get(e,t):t in e?e.value:null},set:function(e,t,n){if(j&&v.nodeName(e,"button"))return j.set(e,t,n);e.value=t}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(e,n,r){var i,s,o,u=e.nodeType;if(!e||u===3||u===8||u===2)return;return o=u!==1||!v.isXMLDoc(e),o&&(n=v.propFix[n]||n,s=v.propHooks[n]),r!==t?s&&"set"in s&&(i=s.set(e,r,n))!==t?i:e[n]=r:s&&"get"in s&&(i=s.get(e,n))!==null?i:e[n]},propHooks:{tabIndex:{get:function(e){var n=e.getAttributeNode("tabindex");return n&&n.specified?parseInt(n.value,10):z.test(e.nodeName)||W.test(e.nodeName)&&e.href?0:t}}}}),F={get:function(e,n){var r,i=v.prop(e,n);return i===!0||typeof i!="boolean"&&(r=e.getAttributeNode(n))&&r.nodeValue!==!1?n.toLowerCase():t},set:function(e,t,n){var r;return t===!1?v.removeAttr(e,n):(r=v.propFix[n]||n,r in e&&(e[r]=!0),e.setAttribute(n,n.toLowerCase())),n}},V||(I={name:!0,id:!0,coords:!0},j=v.valHooks.button={get:function(e,n){var r;return r=e.getAttributeNode(n),r&&(I[n]?r.value!=="":r.specified)?r.value:t},set:function(e,t,n){var r=e.getAttributeNode(n);return r||(r=i.createAttribute(n),e.setAttributeNode(r)),r.value=t+""}},v.each(["width","height"],function(e,t){v.attrHooks[t]=v.extend(v.attrHooks[t],{set:function(e,n){if(n==="")return e.setAttribute(t,"auto"),n}})}),v.attrHooks.contenteditable={get:j.get,set:function(e,t,n){t===""&&(t="false"),j.set(e,t,n)}}),v.support.hrefNormalized||v.each(["href","src","width","height"],function(e,n){v.attrHooks[n]=v.extend(v.attrHooks[n],{get:function(e){var r=e.getAttribute(n,2);return r===null?t:r}})}),v.support.style||(v.attrHooks.style={get:function(e){return e.style.cssText.toLowerCase()||t},set:function(e,t){return e.style.cssText=t+""}}),v.support.optSelected||(v.propHooks.selected=v.extend(v.propHooks.selected,{get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}})),v.support.enctype||(v.propFix.enctype="encoding"),v.support.checkOn||v.each(["radio","checkbox"],function(){v.valHooks[this]={get:function(e){return e.getAttribute("value")===null?"on":e.value}}}),v.each(["radio","checkbox"],function(){v.valHooks[this]=v.extend(v.valHooks[this],{set:function(e,t){if(v.isArray(t))return e.checked=v.inArray(v(e).val(),t)>=0}})});var $=/^(?:textarea|input|select)$/i,J=/^([^\.]*|)(?:\.(.+)|)$/,K=/(?:^|\s)hover(\.\S+|)\b/,Q=/^key/,G=/^(?:mouse|contextmenu)|click/,Y=/^(?:focusinfocus|focusoutblur)$/,Z=function(e){return v.event.special.hover?e:e.replace(K,"mouseenter$1 mouseleave$1")};v.event={add:function(e,n,r,i,s){var o,u,a,f,l,c,h,p,d,m,g;if(e.nodeType===3||e.nodeType===8||!n||!r||!(o=v._data(e)))return;r.handler&&(d=r,r=d.handler,s=d.selector),r.guid||(r.guid=v.guid++),a=o.events,a||(o.events=a={}),u=o.handle,u||(o.handle=u=function(e){return typeof v=="undefined"||!!e&&v.event.triggered===e.type?t:v.event.dispatch.apply(u.elem,arguments)},u.elem=e),n=v.trim(Z(n)).split(" ");for(f=0;f<n.length;f++){l=J.exec(n[f])||[],c=l[1],h=(l[2]||"").split(".").sort(),g=v.event.special[c]||{},c=(s?g.delegateType:g.bindType)||c,g=v.event.special[c]||{},p=v.extend({type:c,origType:l[1],data:i,handler:r,guid:r.guid,selector:s,needsContext:s&&v.expr.match.needsContext.test(s),namespace:h.join(".")},d),m=a[c];if(!m){m=a[c]=[],m.delegateCount=0;if(!g.setup||g.setup.call(e,i,h,u)===!1)e.addEventListener?e.addEventListener(c,u,!1):e.attachEvent&&e.attachEvent("on"+c,u)}g.add&&(g.add.call(e,p),p.handler.guid||(p.handler.guid=r.guid)),s?m.splice(m.delegateCount++,0,p):m.push(p),v.event.global[c]=!0}e=null},global:{},remove:function(e,t,n,r,i){var s,o,u,a,f,l,c,h,p,d,m,g=v.hasData(e)&&v._data(e);if(!g||!(h=g.events))return;t=v.trim(Z(t||"")).split(" ");for(s=0;s<t.length;s++){o=J.exec(t[s])||[],u=a=o[1],f=o[2];if(!u){for(u in h)v.event.remove(e,u+t[s],n,r,!0);continue}p=v.event.special[u]||{},u=(r?p.delegateType:p.bindType)||u,d=h[u]||[],l=d.length,f=f?new RegExp("(^|\\.)"+f.split(".").sort().join("\\.(?:.*\\.|)")+"(\\.|$)"):null;for(c=0;c<d.length;c++)m=d[c],(i||a===m.origType)&&(!n||n.guid===m.guid)&&(!f||f.test(m.namespace))&&(!r||r===m.selector||r==="**"&&m.selector)&&(d.splice(c--,1),m.selector&&d.delegateCount--,p.remove&&p.remove.call(e,m));d.length===0&&l!==d.length&&((!p.teardown||p.teardown.call(e,f,g.handle)===!1)&&v.removeEvent(e,u,g.handle),delete h[u])}v.isEmptyObject(h)&&(delete g.handle,v.removeData(e,"events",!0))},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(n,r,s,o){if(!s||s.nodeType!==3&&s.nodeType!==8){var u,a,f,l,c,h,p,d,m,g,y=n.type||n,b=[];if(Y.test(y+v.event.triggered))return;y.indexOf("!")>=0&&(y=y.slice(0,-1),a=!0),y.indexOf(".")>=0&&(b=y.split("."),y=b.shift(),b.sort());if((!s||v.event.customEvent[y])&&!v.event.global[y])return;n=typeof n=="object"?n[v.expando]?n:new v.Event(y,n):new v.Event(y),n.type=y,n.isTrigger=!0,n.exclusive=a,n.namespace=b.join("."),n.namespace_re=n.namespace?new RegExp("(^|\\.)"+b.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,h=y.indexOf(":")<0?"on"+y:"";if(!s){u=v.cache;for(f in u)u[f].events&&u[f].events[y]&&v.event.trigger(n,r,u[f].handle.elem,!0);return}n.result=t,n.target||(n.target=s),r=r!=null?v.makeArray(r):[],r.unshift(n),p=v.event.special[y]||{};if(p.trigger&&p.trigger.apply(s,r)===!1)return;m=[[s,p.bindType||y]];if(!o&&!p.noBubble&&!v.isWindow(s)){g=p.delegateType||y,l=Y.test(g+y)?s:s.parentNode;for(c=s;l;l=l.parentNode)m.push([l,g]),c=l;c===(s.ownerDocument||i)&&m.push([c.defaultView||c.parentWindow||e,g])}for(f=0;f<m.length&&!n.isPropagationStopped();f++)l=m[f][0],n.type=m[f][1],d=(v._data(l,"events")||{})[n.type]&&v._data(l,"handle"),d&&d.apply(l,r),d=h&&l[h],d&&v.acceptData(l)&&d.apply&&d.apply(l,r)===!1&&n.preventDefault();return n.type=y,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(s.ownerDocument,r)===!1)&&(y!=="click"||!v.nodeName(s,"a"))&&v.acceptData(s)&&h&&s[y]&&(y!=="focus"&&y!=="blur"||n.target.offsetWidth!==0)&&!v.isWindow(s)&&(c=s[h],c&&(s[h]=null),v.event.triggered=y,s[y](),v.event.triggered=t,c&&(s[h]=c)),n.result}return},dispatch:function(n){n=v.event.fix(n||e.event);var r,i,s,o,u,a,f,c,h,p,d=(v._data(this,"events")||{})[n.type]||[],m=d.delegateCount,g=l.call(arguments),y=!n.exclusive&&!n.namespace,b=v.event.special[n.type]||{},w=[];g[0]=n,n.delegateTarget=this;if(b.preDispatch&&b.preDispatch.call(this,n)===!1)return;if(m&&(!n.button||n.type!=="click"))for(s=n.target;s!=this;s=s.parentNode||this)if(s.disabled!==!0||n.type!=="click"){u={},f=[];for(r=0;r<m;r++)c=d[r],h=c.selector,u[h]===t&&(u[h]=c.needsContext?v(h,this).index(s)>=0:v.find(h,this,null,[s]).length),u[h]&&f.push(c);f.length&&w.push({elem:s,matches:f})}d.length>m&&w.push({elem:this,matches:d.slice(m)});for(r=0;r<w.length&&!n.isPropagationStopped();r++){a=w[r],n.currentTarget=a.elem;for(i=0;i<a.matches.length&&!n.isImmediatePropagationStopped();i++){c=a.matches[i];if(y||!n.namespace&&!c.namespace||n.namespace_re&&n.namespace_re.test(c.namespace))n.data=c.data,n.handleObj=c,o=((v.event.special[c.origType]||{}).handle||c.handler).apply(a.elem,g),o!==t&&(n.result=o,o===!1&&(n.preventDefault(),n.stopPropagation()))}}return b.postDispatch&&b.postDispatch.call(this,n),n.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return e.which==null&&(e.which=t.charCode!=null?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,s,o,u=n.button,a=n.fromElement;return e.pageX==null&&n.clientX!=null&&(r=e.target.ownerDocument||i,s=r.documentElement,o=r.body,e.pageX=n.clientX+(s&&s.scrollLeft||o&&o.scrollLeft||0)-(s&&s.clientLeft||o&&o.clientLeft||0),e.pageY=n.clientY+(s&&s.scrollTop||o&&o.scrollTop||0)-(s&&s.clientTop||o&&o.clientTop||0)),!e.relatedTarget&&a&&(e.relatedTarget=a===e.target?n.toElement:a),!e.which&&u!==t&&(e.which=u&1?1:u&2?3:u&4?2:0),e}},fix:function(e){if(e[v.expando])return e;var t,n,r=e,s=v.event.fixHooks[e.type]||{},o=s.props?this.props.concat(s.props):this.props;e=v.Event(r);for(t=o.length;t;)n=o[--t],e[n]=r[n];return e.target||(e.target=r.srcElement||i),e.target.nodeType===3&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,r):e},special:{load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(e,t,n){v.isWindow(this)&&(this.onbeforeunload=n)},teardown:function(e,t){this.onbeforeunload===t&&(this.onbeforeunload=null)}}},simulate:function(e,t,n,r){var i=v.extend(new v.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?v.event.trigger(i,null,t):v.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},v.event.handle=v.event.dispatch,v.removeEvent=i.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]=="undefined"&&(e[r]=null),e.detachEvent(r,n))},v.Event=function(e,t){if(!(this instanceof v.Event))return new v.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?tt:et):this.type=e,t&&v.extend(this,t),this.timeStamp=e&&e.timeStamp||v.now(),this[v.expando]=!0},v.Event.prototype={preventDefault:function(){this.isDefaultPrevented=tt;var e=this.originalEvent;if(!e)return;e.preventDefault?e.preventDefault():e.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=tt;var e=this.originalEvent;if(!e)return;e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=tt,this.stopPropagation()},isDefaultPrevented:et,isPropagationStopped:et,isImmediatePropagationStopped:et},v.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){v.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,s=e.handleObj,o=s.selector;if(!i||i!==r&&!v.contains(r,i))e.type=s.origType,n=s.handler.apply(this,arguments),e.type=t;return n}}}),v.support.submitBubbles||(v.event.special.submit={setup:function(){if(v.nodeName(this,"form"))return!1;v.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=v.nodeName(n,"input")||v.nodeName(n,"button")?n.form:t;r&&!v._data(r,"_submit_attached")&&(v.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),v._data(r,"_submit_attached",!0))})},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&v.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){if(v.nodeName(this,"form"))return!1;v.event.remove(this,"._submit")}}),v.support.changeBubbles||(v.event.special.change={setup:function(){if($.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")v.event.add(this,"propertychange._change",function(e){e.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),v.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),v.event.simulate("change",this,e,!0)});return!1}v.event.add(this,"beforeactivate._change",function(e){var t=e.target;$.test(t.nodeName)&&!v._data(t,"_change_attached")&&(v.event.add(t,"change._change",function(e){this.parentNode&&!e.isSimulated&&!e.isTrigger&&v.event.simulate("change",this.parentNode,e,!0)}),v._data(t,"_change_attached",!0))})},handle:function(e){var t=e.target;if(this!==t||e.isSimulated||e.isTrigger||t.type!=="radio"&&t.type!=="checkbox")return e.handleObj.handler.apply(this,arguments)},teardown:function(){return v.event.remove(this,"._change"),!$.test(this.nodeName)}}),v.support.focusinBubbles||v.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){v.event.simulate(t,e.target,v.event.fix(e),!0)};v.event.special[t]={setup:function(){n++===0&&i.addEventListener(e,r,!0)},teardown:function(){--n===0&&i.removeEventListener(e,r,!0)}}}),v.fn.extend({on:function(e,n,r,i,s){var o,u;if(typeof e=="object"){typeof n!="string"&&(r=r||n,n=t);for(u in e)this.on(u,n,r,e[u],s);return this}r==null&&i==null?(i=n,r=n=t):i==null&&(typeof n=="string"?(i=r,r=t):(i=r,r=n,n=t));if(i===!1)i=et;else if(!i)return this;return s===1&&(o=i,i=function(e){return v().off(e),o.apply(this,arguments)},i.guid=o.guid||(o.guid=v.guid++)),this.each(function(){v.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,s;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,v(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if(typeof e=="object"){for(s in e)this.off(s,n,e[s]);return this}if(n===!1||typeof n=="function")r=n,n=t;return r===!1&&(r=et),this.each(function(){v.event.remove(this,e,r,n)})},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},live:function(e,t,n){return v(this.context).on(e,this.selector,t,n),this},die:function(e,t){return v(this.context).off(e,this.selector||"**",t),this},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return arguments.length===1?this.off(e,"**"):this.off(t,e||"**",n)},trigger:function(e,t){return this.each(function(){v.event.trigger(e,t,this)})},triggerHandler:function(e,t){if(this[0])return v.event.trigger(e,t,this[0],!0)},toggle:function(e){var t=arguments,n=e.guid||v.guid++,r=0,i=function(n){var i=(v._data(this,"lastToggle"+e.guid)||0)%r;return v._data(this,"lastToggle"+e.guid,i+1),n.preventDefault(),t[i].apply(this,arguments)||!1};i.guid=n;while(r<t.length)t[r++].guid=n;return this.click(i)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),v.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){v.fn[t]=function(e,n){return n==null&&(n=e,e=null),arguments.length>0?this.on(t,null,e,n):this.trigger(t)},Q.test(t)&&(v.event.fixHooks[t]=v.event.keyHooks),G.test(t)&&(v.event.fixHooks[t]=v.event.mouseHooks)}),function(e,t){function nt(e,t,n,r){n=n||[],t=t||g;var i,s,a,f,l=t.nodeType;if(!e||typeof e!="string")return n;if(l!==1&&l!==9)return[];a=o(t);if(!a&&!r)if(i=R.exec(e))if(f=i[1]){if(l===9){s=t.getElementById(f);if(!s||!s.parentNode)return n;if(s.id===f)return n.push(s),n}else if(t.ownerDocument&&(s=t.ownerDocument.getElementById(f))&&u(t,s)&&s.id===f)return n.push(s),n}else{if(i[2])return S.apply(n,x.call(t.getElementsByTagName(e),0)),n;if((f=i[3])&&Z&&t.getElementsByClassName)return S.apply(n,x.call(t.getElementsByClassName(f),0)),n}return vt(e.replace(j,"$1"),t,n,r,a)}function rt(e){return function(t){var n=t.nodeName.toLowerCase();return n==="input"&&t.type===e}}function it(e){return function(t){var n=t.nodeName.toLowerCase();return(n==="input"||n==="button")&&t.type===e}}function st(e){return N(function(t){return t=+t,N(function(n,r){var i,s=e([],n.length,t),o=s.length;while(o--)n[i=s[o]]&&(n[i]=!(r[i]=n[i]))})})}function ot(e,t,n){if(e===t)return n;var r=e.nextSibling;while(r){if(r===t)return-1;r=r.nextSibling}return 1}function ut(e,t){var n,r,s,o,u,a,f,l=L[d][e+" "];if(l)return t?0:l.slice(0);u=e,a=[],f=i.preFilter;while(u){if(!n||(r=F.exec(u)))r&&(u=u.slice(r[0].length)||u),a.push(s=[]);n=!1;if(r=I.exec(u))s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=r[0].replace(j," ");for(o in i.filter)(r=J[o].exec(u))&&(!f[o]||(r=f[o](r)))&&(s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=o,n.matches=r);if(!n)break}return t?u.length:u?nt.error(e):L(e,a).slice(0)}function at(e,t,r){var i=t.dir,s=r&&t.dir==="parentNode",o=w++;return t.first?function(t,n,r){while(t=t[i])if(s||t.nodeType===1)return e(t,n,r)}:function(t,r,u){if(!u){var a,f=b+" "+o+" ",l=f+n;while(t=t[i])if(s||t.nodeType===1){if((a=t[d])===l)return t.sizset;if(typeof a=="string"&&a.indexOf(f)===0){if(t.sizset)return t}else{t[d]=l;if(e(t,r,u))return t.sizset=!0,t;t.sizset=!1}}}else while(t=t[i])if(s||t.nodeType===1)if(e(t,r,u))return t}}function ft(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function lt(e,t,n,r,i){var s,o=[],u=0,a=e.length,f=t!=null;for(;u<a;u++)if(s=e[u])if(!n||n(s,r,i))o.push(s),f&&t.push(u);return o}function ct(e,t,n,r,i,s){return r&&!r[d]&&(r=ct(r)),i&&!i[d]&&(i=ct(i,s)),N(function(s,o,u,a){var f,l,c,h=[],p=[],d=o.length,v=s||dt(t||"*",u.nodeType?[u]:u,[]),m=e&&(s||!t)?lt(v,h,e,u,a):v,g=n?i||(s?e:d||r)?[]:o:m;n&&n(m,g,u,a);if(r){f=lt(g,p),r(f,[],u,a),l=f.length;while(l--)if(c=f[l])g[p[l]]=!(m[p[l]]=c)}if(s){if(i||e){if(i){f=[],l=g.length;while(l--)(c=g[l])&&f.push(m[l]=c);i(null,g=[],f,a)}l=g.length;while(l--)(c=g[l])&&(f=i?T.call(s,c):h[l])>-1&&(s[f]=!(o[f]=c))}}else g=lt(g===o?g.splice(d,g.length):g),i?i(null,o,g,a):S.apply(o,g)})}function ht(e){var t,n,r,s=e.length,o=i.relative[e[0].type],u=o||i.relative[" "],a=o?1:0,f=at(function(e){return e===t},u,!0),l=at(function(e){return T.call(t,e)>-1},u,!0),h=[function(e,n,r){return!o&&(r||n!==c)||((t=n).nodeType?f(e,n,r):l(e,n,r))}];for(;a<s;a++)if(n=i.relative[e[a].type])h=[at(ft(h),n)];else{n=i.filter[e[a].type].apply(null,e[a].matches);if(n[d]){r=++a;for(;r<s;r++)if(i.relative[e[r].type])break;return ct(a>1&&ft(h),a>1&&e.slice(0,a-1).join("").replace(j,"$1"),n,a<r&&ht(e.slice(a,r)),r<s&&ht(e=e.slice(r)),r<s&&e.join(""))}h.push(n)}return ft(h)}function pt(e,t){var r=t.length>0,s=e.length>0,o=function(u,a,f,l,h){var p,d,v,m=[],y=0,w="0",x=u&&[],T=h!=null,N=c,C=u||s&&i.find.TAG("*",h&&a.parentNode||a),k=b+=N==null?1:Math.E;T&&(c=a!==g&&a,n=o.el);for(;(p=C[w])!=null;w++){if(s&&p){for(d=0;v=e[d];d++)if(v(p,a,f)){l.push(p);break}T&&(b=k,n=++o.el)}r&&((p=!v&&p)&&y--,u&&x.push(p))}y+=w;if(r&&w!==y){for(d=0;v=t[d];d++)v(x,m,a,f);if(u){if(y>0)while(w--)!x[w]&&!m[w]&&(m[w]=E.call(l));m=lt(m)}S.apply(l,m),T&&!u&&m.length>0&&y+t.length>1&&nt.uniqueSort(l)}return T&&(b=k,c=N),x};return o.el=0,r?N(o):o}function dt(e,t,n){var r=0,i=t.length;for(;r<i;r++)nt(e,t[r],n);return n}function vt(e,t,n,r,s){var o,u,f,l,c,h=ut(e),p=h.length;if(!r&&h.length===1){u=h[0]=h[0].slice(0);if(u.length>2&&(f=u[0]).type==="ID"&&t.nodeType===9&&!s&&i.relative[u[1].type]){t=i.find.ID(f.matches[0].replace($,""),t,s)[0];if(!t)return n;e=e.slice(u.shift().length)}for(o=J.POS.test(e)?-1:u.length-1;o>=0;o--){f=u[o];if(i.relative[l=f.type])break;if(c=i.find[l])if(r=c(f.matches[0].replace($,""),z.test(u[0].type)&&t.parentNode||t,s)){u.splice(o,1),e=r.length&&u.join("");if(!e)return S.apply(n,x.call(r,0)),n;break}}}return a(e,h)(r,t,s,n,z.test(e)),n}function mt(){}var n,r,i,s,o,u,a,f,l,c,h=!0,p="undefined",d=("sizcache"+Math.random()).replace(".",""),m=String,g=e.document,y=g.documentElement,b=0,w=0,E=[].pop,S=[].push,x=[].slice,T=[].indexOf||function(e){var t=0,n=this.length;for(;t<n;t++)if(this[t]===e)return t;return-1},N=function(e,t){return e[d]=t==null||t,e},C=function(){var e={},t=[];return N(function(n,r){return t.push(n)>i.cacheLength&&delete e[t.shift()],e[n+" "]=r},e)},k=C(),L=C(),A=C(),O="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",_=M.replace("w","w#"),D="([*^$|!~]?=)",P="\\["+O+"*("+M+")"+O+"*(?:"+D+O+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+_+")|)|)"+O+"*\\]",H=":("+M+")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:"+P+")|[^:]|\\\\.)*|.*))\\)|)",B=":(even|odd|eq|gt|lt|nth|first|last)(?:\\("+O+"*((?:-\\d)?\\d*)"+O+"*\\)|)(?=[^-]|$)",j=new RegExp("^"+O+"+|((?:^|[^\\\\])(?:\\\\.)*)"+O+"+$","g"),F=new RegExp("^"+O+"*,"+O+"*"),I=new RegExp("^"+O+"*([\\x20\\t\\r\\n\\f>+~])"+O+"*"),q=new RegExp(H),R=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,U=/^:not/,z=/[\x20\t\r\n\f]*[+~]/,W=/:not\($/,X=/h\d/i,V=/input|select|textarea|button/i,$=/\\(?!\\)/g,J={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),NAME:new RegExp("^\\[name=['\"]?("+M+")['\"]?\\]"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+P),PSEUDO:new RegExp("^"+H),POS:new RegExp(B,"i"),CHILD:new RegExp("^:(only|nth|first|last)-child(?:\\("+O+"*(even|odd|(([+-]|)(\\d*)n|)"+O+"*(?:([+-]|)"+O+"*(\\d+)|))"+O+"*\\)|)","i"),needsContext:new RegExp("^"+O+"*[>+~]|"+B,"i")},K=function(e){var t=g.createElement("div");try{return e(t)}catch(n){return!1}finally{t=null}},Q=K(function(e){return e.appendChild(g.createComment("")),!e.getElementsByTagName("*").length}),G=K(function(e){return e.innerHTML="<a href='#'></a>",e.firstChild&&typeof e.firstChild.getAttribute!==p&&e.firstChild.getAttribute("href")==="#"}),Y=K(function(e){e.innerHTML="<select></select>";var t=typeof e.lastChild.getAttribute("multiple");return t!=="boolean"&&t!=="string"}),Z=K(function(e){return e.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",!e.getElementsByClassName||!e.getElementsByClassName("e").length?!1:(e.lastChild.className="e",e.getElementsByClassName("e").length===2)}),et=K(function(e){e.id=d+0,e.innerHTML="<a name='"+d+"'></a><div name='"+d+"'></div>",y.insertBefore(e,y.firstChild);var t=g.getElementsByName&&g.getElementsByName(d).length===2+g.getElementsByName(d+0).length;return r=!g.getElementById(d),y.removeChild(e),t});try{x.call(y.childNodes,0)[0].nodeType}catch(tt){x=function(e){var t,n=[];for(;t=this[e];e++)n.push(t);return n}}nt.matches=function(e,t){return nt(e,null,null,t)},nt.matchesSelector=function(e,t){return nt(t,null,null,[e]).length>0},s=nt.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(i===1||i===9||i===11){if(typeof e.textContent=="string")return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=s(e)}else if(i===3||i===4)return e.nodeValue}else for(;t=e[r];r++)n+=s(t);return n},o=nt.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?t.nodeName!=="HTML":!1},u=nt.contains=y.contains?function(e,t){var n=e.nodeType===9?e.documentElement:e,r=t&&t.parentNode;return e===r||!!(r&&r.nodeType===1&&n.contains&&n.contains(r))}:y.compareDocumentPosition?function(e,t){return t&&!!(e.compareDocumentPosition(t)&16)}:function(e,t){while(t=t.parentNode)if(t===e)return!0;return!1},nt.attr=function(e,t){var n,r=o(e);return r||(t=t.toLowerCase()),(n=i.attrHandle[t])?n(e):r||Y?e.getAttribute(t):(n=e.getAttributeNode(t),n?typeof e[t]=="boolean"?e[t]?t:null:n.specified?n.value:null:null)},i=nt.selectors={cacheLength:50,createPseudo:N,match:J,attrHandle:G?{}:{href:function(e){return e.getAttribute("href",2)},type:function(e){return e.getAttribute("type")}},find:{ID:r?function(e,t,n){if(typeof t.getElementById!==p&&!n){var r=t.getElementById(e);return r&&r.parentNode?[r]:[]}}:function(e,n,r){if(typeof n.getElementById!==p&&!r){var i=n.getElementById(e);return i?i.id===e||typeof i.getAttributeNode!==p&&i.getAttributeNode("id").value===e?[i]:t:[]}},TAG:Q?function(e,t){if(typeof t.getElementsByTagName!==p)return t.getElementsByTagName(e)}:function(e,t){var n=t.getElementsByTagName(e);if(e==="*"){var r,i=[],s=0;for(;r=n[s];s++)r.nodeType===1&&i.push(r);return i}return n},NAME:et&&function(e,t){if(typeof t.getElementsByName!==p)return t.getElementsByName(name)},CLASS:Z&&function(e,t,n){if(typeof t.getElementsByClassName!==p&&!n)return t.getElementsByClassName(e)}},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace($,""),e[3]=(e[4]||e[5]||"").replace($,""),e[2]==="~="&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),e[1]==="nth"?(e[2]||nt.error(e[0]),e[3]=+(e[3]?e[4]+(e[5]||1):2*(e[2]==="even"||e[2]==="odd")),e[4]=+(e[6]+e[7]||e[2]==="odd")):e[2]&&nt.error(e[0]),e},PSEUDO:function(e){var t,n;if(J.CHILD.test(e[0]))return null;if(e[3])e[2]=e[3];else if(t=e[4])q.test(t)&&(n=ut(t,!0))&&(n=t.indexOf(")",t.length-n)-t.length)&&(t=t.slice(0,n),e[0]=e[0].slice(0,n)),e[2]=t;return e.slice(0,3)}},filter:{ID:r?function(e){return e=e.replace($,""),function(t){return t.getAttribute("id")===e}}:function(e){return e=e.replace($,""),function(t){var n=typeof t.getAttributeNode!==p&&t.getAttributeNode("id");return n&&n.value===e}},TAG:function(e){return e==="*"?function(){return!0}:(e=e.replace($,"").toLowerCase(),function(t){return t.nodeName&&t.nodeName.toLowerCase()===e})},CLASS:function(e){var t=k[d][e+" "];return t||(t=new RegExp("(^|"+O+")"+e+"("+O+"|$)"))&&k(e,function(e){return t.test(e.className||typeof e.getAttribute!==p&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r,i){var s=nt.attr(r,e);return s==null?t==="!=":t?(s+="",t==="="?s===n:t==="!="?s!==n:t==="^="?n&&s.indexOf(n)===0:t==="*="?n&&s.indexOf(n)>-1:t==="$="?n&&s.substr(s.length-n.length)===n:t==="~="?(" "+s+" ").indexOf(n)>-1:t==="|="?s===n||s.substr(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r){return e==="nth"?function(e){var t,i,s=e.parentNode;if(n===1&&r===0)return!0;if(s){i=0;for(t=s.firstChild;t;t=t.nextSibling)if(t.nodeType===1){i++;if(e===t)break}}return i-=r,i===n||i%n===0&&i/n>=0}:function(t){var n=t;switch(e){case"only":case"first":while(n=n.previousSibling)if(n.nodeType===1)return!1;if(e==="first")return!0;n=t;case"last":while(n=n.nextSibling)if(n.nodeType===1)return!1;return!0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||nt.error("unsupported pseudo: "+e);return r[d]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?N(function(e,n){var i,s=r(e,t),o=s.length;while(o--)i=T.call(e,s[o]),e[i]=!(n[i]=s[o])}):function(e){return r(e,0,n)}):r}},pseudos:{not:N(function(e){var t=[],n=[],r=a(e.replace(j,"$1"));return r[d]?N(function(e,t,n,i){var s,o=r(e,null,i,[]),u=e.length;while(u--)if(s=o[u])e[u]=!(t[u]=s)}):function(e,i,s){return t[0]=e,r(t,null,s,n),!n.pop()}}),has:N(function(e){return function(t){return nt(e,t).length>0}}),contains:N(function(e){return function(t){return(t.textContent||t.innerText||s(t)).indexOf(e)>-1}}),enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&!!e.checked||t==="option"&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},parent:function(e){return!i.pseudos.empty(e)},empty:function(e){var t;e=e.firstChild;while(e){if(e.nodeName>"@"||(t=e.nodeType)===3||t===4)return!1;e=e.nextSibling}return!0},header:function(e){return X.test(e.nodeName)},text:function(e){var t,n;return e.nodeName.toLowerCase()==="input"&&(t=e.type)==="text"&&((n=e.getAttribute("type"))==null||n.toLowerCase()===t)},radio:rt("radio"),checkbox:rt("checkbox"),file:rt("file"),password:rt("password"),image:rt("image"),submit:it("submit"),reset:it("reset"),button:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&e.type==="button"||t==="button"},input:function(e){return V.test(e.nodeName)},focus:function(e){var t=e.ownerDocument;return e===t.activeElement&&(!t.hasFocus||t.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},active:function(e){return e===e.ownerDocument.activeElement},first:st(function(){return[0]}),last:st(function(e,t){return[t-1]}),eq:st(function(e,t,n){return[n<0?n+t:n]}),even:st(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:st(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:st(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:st(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}},f=y.compareDocumentPosition?function(e,t){return e===t?(l=!0,0):(!e.compareDocumentPosition||!t.compareDocumentPosition?e.compareDocumentPosition:e.compareDocumentPosition(t)&4)?-1:1}:function(e,t){if(e===t)return l=!0,0;if(e.sourceIndex&&t.sourceIndex)return e.sourceIndex-t.sourceIndex;var n,r,i=[],s=[],o=e.parentNode,u=t.parentNode,a=o;if(o===u)return ot(e,t);if(!o)return-1;if(!u)return 1;while(a)i.unshift(a),a=a.parentNode;a=u;while(a)s.unshift(a),a=a.parentNode;n=i.length,r=s.length;for(var f=0;f<n&&f<r;f++)if(i[f]!==s[f])return ot(i[f],s[f]);return f===n?ot(e,s[f],-1):ot(i[f],t,1)},[0,0].sort(f),h=!l,nt.uniqueSort=function(e){var t,n=[],r=1,i=0;l=h,e.sort(f);if(l){for(;t=e[r];r++)t===e[r-1]&&(i=n.push(r));while(i--)e.splice(n[i],1)}return e},nt.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},a=nt.compile=function(e,t){var n,r=[],i=[],s=A[d][e+" "];if(!s){t||(t=ut(e)),n=t.length;while(n--)s=ht(t[n]),s[d]?r.push(s):i.push(s);s=A(e,pt(i,r))}return s},g.querySelectorAll&&function(){var e,t=vt,n=/'|\\/g,r=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,i=[":focus"],s=[":active"],u=y.matchesSelector||y.mozMatchesSelector||y.webkitMatchesSelector||y.oMatchesSelector||y.msMatchesSelector;K(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||i.push("\\["+O+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),e.querySelectorAll(":checked").length||i.push(":checked")}),K(function(e){e.innerHTML="<p test=''></p>",e.querySelectorAll("[test^='']").length&&i.push("[*^$]="+O+"*(?:\"\"|'')"),e.innerHTML="<input type='hidden'/>",e.querySelectorAll(":enabled").length||i.push(":enabled",":disabled")}),i=new RegExp(i.join("|")),vt=function(e,r,s,o,u){if(!o&&!u&&!i.test(e)){var a,f,l=!0,c=d,h=r,p=r.nodeType===9&&e;if(r.nodeType===1&&r.nodeName.toLowerCase()!=="object"){a=ut(e),(l=r.getAttribute("id"))?c=l.replace(n,"\\$&"):r.setAttribute("id",c),c="[id='"+c+"'] ",f=a.length;while(f--)a[f]=c+a[f].join("");h=z.test(e)&&r.parentNode||r,p=a.join(",")}if(p)try{return S.apply(s,x.call(h.querySelectorAll(p),0)),s}catch(v){}finally{l||r.removeAttribute("id")}}return t(e,r,s,o,u)},u&&(K(function(t){e=u.call(t,"div");try{u.call(t,"[test!='']:sizzle"),s.push("!=",H)}catch(n){}}),s=new RegExp(s.join("|")),nt.matchesSelector=function(t,n){n=n.replace(r,"='$1']");if(!o(t)&&!s.test(n)&&!i.test(n))try{var a=u.call(t,n);if(a||e||t.document&&t.document.nodeType!==11)return a}catch(f){}return nt(n,null,null,[t]).length>0})}(),i.pseudos.nth=i.pseudos.eq,i.filters=mt.prototype=i.pseudos,i.setFilters=new mt,nt.attr=v.attr,v.find=nt,v.expr=nt.selectors,v.expr[":"]=v.expr.pseudos,v.unique=nt.uniqueSort,v.text=nt.getText,v.isXMLDoc=nt.isXML,v.contains=nt.contains}(e);var nt=/Until$/,rt=/^(?:parents|prev(?:Until|All))/,it=/^.[^:#\[\.,]*$/,st=v.expr.match.needsContext,ot={children:!0,contents:!0,next:!0,prev:!0};v.fn.extend({find:function(e){var t,n,r,i,s,o,u=this;if(typeof e!="string")return v(e).filter(function(){for(t=0,n=u.length;t<n;t++)if(v.contains(u[t],this))return!0});o=this.pushStack("","find",e);for(t=0,n=this.length;t<n;t++){r=o.length,v.find(e,this[t],o);if(t>0)for(i=r;i<o.length;i++)for(s=0;s<r;s++)if(o[s]===o[i]){o.splice(i--,1);break}}return o},has:function(e){var t,n=v(e,this),r=n.length;return this.filter(function(){for(t=0;t<r;t++)if(v.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e,!1),"not",e)},filter:function(e){return this.pushStack(ft(this,e,!0),"filter",e)},is:function(e){return!!e&&(typeof e=="string"?st.test(e)?v(e,this.context).index(this[0])>=0:v.filter(e,this).length>0:this.filter(e).length>0)},closest:function(e,t){var n,r=0,i=this.length,s=[],o=st.test(e)||typeof e!="string"?v(e,t||this.context):0;for(;r<i;r++){n=this[r];while(n&&n.ownerDocument&&n!==t&&n.nodeType!==11){if(o?o.index(n)>-1:v.find.matchesSelector(n,e)){s.push(n);break}n=n.parentNode}}return s=s.length>1?v.unique(s):s,this.pushStack(s,"closest",e)},index:function(e){return e?typeof e=="string"?v.inArray(this[0],v(e)):v.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.prevAll().length:-1},add:function(e,t){var n=typeof e=="string"?v(e,t):v.makeArray(e&&e.nodeType?[e]:e),r=v.merge(this.get(),n);return this.pushStack(ut(n[0])||ut(r[0])?r:v.unique(r))},addBack:function(e){return this.add(e==null?this.prevObject:this.prevObject.filter(e))}}),v.fn.andSelf=v.fn.addBack,v.each({parent:function(e){var t=e.parentNode;return t&&t.nodeType!==11?t:null},parents:function(e){return v.dir(e,"parentNode")},parentsUntil:function(e,t,n){return v.dir(e,"parentNode",n)},next:function(e){return at(e,"nextSibling")},prev:function(e){return at(e,"previousSibling")},nextAll:function(e){return v.dir(e,"nextSibling")},prevAll:function(e){return v.dir(e,"previousSibling")},nextUntil:function(e,t,n){return v.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return v.dir(e,"previousSibling",n)},siblings:function(e){return v.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return v.sibling(e.firstChild)},contents:function(e){return v.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:v.merge([],e.childNodes)}},function(e,t){v.fn[e]=function(n,r){var i=v.map(this,t,n);return nt.test(e)||(r=n),r&&typeof r=="string"&&(i=v.filter(r,i)),i=this.length>1&&!ot[e]?v.unique(i):i,this.length>1&&rt.test(e)&&(i=i.reverse()),this.pushStack(i,e,l.call(arguments).join(","))}}),v.extend({filter:function(e,t,n){return n&&(e=":not("+e+")"),t.length===1?v.find.matchesSelector(t[0],e)?[t[0]]:[]:v.find.matches(e,t)},dir:function(e,n,r){var i=[],s=e[n];while(s&&s.nodeType!==9&&(r===t||s.nodeType!==1||!v(s).is(r)))s.nodeType===1&&i.push(s),s=s[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)e.nodeType===1&&e!==t&&n.push(e);return n}});var ct="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",ht=/ jQuery\d+="(?:null|\d+)"/g,pt=/^\s+/,dt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,vt=/<([\w:]+)/,mt=/<tbody/i,gt=/<|&#?\w+;/,yt=/<(?:script|style|link)/i,bt=/<(?:script|object|embed|option|style)/i,wt=new RegExp("<(?:"+ct+")[\\s/>]","i"),Et=/^(?:checkbox|radio)$/,St=/checked\s*(?:[^=]|=\s*.checked.)/i,xt=/\/(java|ecma)script/i,Tt=/^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,Nt={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},Ct=lt(i),kt=Ct.appendChild(i.createElement("div"));Nt.optgroup=Nt.option,Nt.tbody=Nt.tfoot=Nt.colgroup=Nt.caption=Nt.thead,Nt.th=Nt.td,v.support.htmlSerialize||(Nt._default=[1,"X<div>","</div>"]),v.fn.extend({text:function(e){return v.access(this,function(e){return e===t?v.text(this):this.empty().append((this[0]&&this[0].ownerDocument||i).createTextNode(e))},null,e,arguments.length)},wrapAll:function(e){if(v.isFunction(e))return this.each(function(t){v(this).wrapAll(e.call(this,t))});if(this[0]){var t=v(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&e.firstChild.nodeType===1)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return v.isFunction(e)?this.each(function(t){v(this).wrapInner(e.call(this,t))}):this.each(function(){var t=v(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=v.isFunction(e);return this.each(function(n){v(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){v.nodeName(this,"body")||v(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.appendChild(e)})},prepend:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.insertBefore(e,this.firstChild)})},before:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(e,this),"before",this.selector)}},after:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this.nextSibling)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(this,e),"after",this.selector)}},remove:function(e,t){var n,r=0;for(;(n=this[r])!=null;r++)if(!e||v.filter(e,[n]).length)!t&&n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),v.cleanData([n])),n.parentNode&&n.parentNode.removeChild(n);return this},empty:function(){var e,t=0;for(;(e=this[t])!=null;t++){e.nodeType===1&&v.cleanData(e.getElementsByTagName("*"));while(e.firstChild)e.removeChild(e.firstChild)}return this},clone:function(e,t){return e=e==null?!1:e,t=t==null?e:t,this.map(function(){return v.clone(this,e,t)})},html:function(e){return v.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return n.nodeType===1?n.innerHTML.replace(ht,""):t;if(typeof e=="string"&&!yt.test(e)&&(v.support.htmlSerialize||!wt.test(e))&&(v.support.leadingWhitespace||!pt.test(e))&&!Nt[(vt.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(dt,"<$1></$2>");try{for(;r<i;r++)n=this[r]||{},n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),n.innerHTML=e);n=0}catch(s){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(e){return ut(this[0])?this.length?this.pushStack(v(v.isFunction(e)?e():e),"replaceWith",e):this:v.isFunction(e)?this.each(function(t){var n=v(this),r=n.html();n.replaceWith(e.call(this,t,r))}):(typeof e!="string"&&(e=v(e).detach()),this.each(function(){var t=this.nextSibling,n=this.parentNode;v(this).remove(),t?v(t).before(e):v(n).append(e)}))},detach:function(e){return this.remove(e,!0)},domManip:function(e,n,r){e=[].concat.apply([],e);var i,s,o,u,a=0,f=e[0],l=[],c=this.length;if(!v.support.checkClone&&c>1&&typeof f=="string"&&St.test(f))return this.each(function(){v(this).domManip(e,n,r)});if(v.isFunction(f))return this.each(function(i){var s=v(this);e[0]=f.call(this,i,n?s.html():t),s.domManip(e,n,r)});if(this[0]){i=v.buildFragment(e,this,l),o=i.fragment,s=o.firstChild,o.childNodes.length===1&&(o=s);if(s){n=n&&v.nodeName(s,"tr");for(u=i.cacheable||c-1;a<c;a++)r.call(n&&v.nodeName(this[a],"table")?Lt(this[a],"tbody"):this[a],a===u?o:v.clone(o,!0,!0))}o=s=null,l.length&&v.each(l,function(e,t){t.src?v.ajax?v.ajax({url:t.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):v.error("no ajax"):v.globalEval((t.text||t.textContent||t.innerHTML||"").replace(Tt,"")),t.parentNode&&t.parentNode.removeChild(t)})}return this}}),v.buildFragment=function(e,n,r){var s,o,u,a=e[0];return n=n||i,n=!n.nodeType&&n[0]||n,n=n.ownerDocument||n,e.length===1&&typeof a=="string"&&a.length<512&&n===i&&a.charAt(0)==="<"&&!bt.test(a)&&(v.support.checkClone||!St.test(a))&&(v.support.html5Clone||!wt.test(a))&&(o=!0,s=v.fragments[a],u=s!==t),s||(s=n.createDocumentFragment(),v.clean(e,n,s,r),o&&(v.fragments[a]=u&&s)),{fragment:s,cacheable:o}},v.fragments={},v.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){v.fn[e]=function(n){var r,i=0,s=[],o=v(n),u=o.length,a=this.length===1&&this[0].parentNode;if((a==null||a&&a.nodeType===11&&a.childNodes.length===1)&&u===1)return o[t](this[0]),this;for(;i<u;i++)r=(i>0?this.clone(!0):this).get(),v(o[i])[t](r),s=s.concat(r);return this.pushStack(s,e,o.selector)}}),v.extend({clone:function(e,t,n){var r,i,s,o;v.support.html5Clone||v.isXMLDoc(e)||!wt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(kt.innerHTML=e.outerHTML,kt.removeChild(o=kt.firstChild));if((!v.support.noCloneEvent||!v.support.noCloneChecked)&&(e.nodeType===1||e.nodeType===11)&&!v.isXMLDoc(e)){Ot(e,o),r=Mt(e),i=Mt(o);for(s=0;r[s];++s)i[s]&&Ot(r[s],i[s])}if(t){At(e,o);if(n){r=Mt(e),i=Mt(o);for(s=0;r[s];++s)At(r[s],i[s])}}return r=i=null,o},clean:function(e,t,n,r){var s,o,u,a,f,l,c,h,p,d,m,g,y=t===i&&Ct,b=[];if(!t||typeof t.createDocumentFragment=="undefined")t=i;for(s=0;(u=e[s])!=null;s++){typeof u=="number"&&(u+="");if(!u)continue;if(typeof u=="string")if(!gt.test(u))u=t.createTextNode(u);else{y=y||lt(t),c=t.createElement("div"),y.appendChild(c),u=u.replace(dt,"<$1></$2>"),a=(vt.exec(u)||["",""])[1].toLowerCase(),f=Nt[a]||Nt._default,l=f[0],c.innerHTML=f[1]+u+f[2];while(l--)c=c.lastChild;if(!v.support.tbody){h=mt.test(u),p=a==="table"&&!h?c.firstChild&&c.firstChild.childNodes:f[1]==="<table>"&&!h?c.childNodes:[];for(o=p.length-1;o>=0;--o)v.nodeName(p[o],"tbody")&&!p[o].childNodes.length&&p[o].parentNode.removeChild(p[o])}!v.support.leadingWhitespace&&pt.test(u)&&c.insertBefore(t.createTextNode(pt.exec(u)[0]),c.firstChild),u=c.childNodes,c.parentNode.removeChild(c)}u.nodeType?b.push(u):v.merge(b,u)}c&&(u=c=y=null);if(!v.support.appendChecked)for(s=0;(u=b[s])!=null;s++)v.nodeName(u,"input")?_t(u):typeof u.getElementsByTagName!="undefined"&&v.grep(u.getElementsByTagName("input"),_t);if(n){m=function(e){if(!e.type||xt.test(e.type))return r?r.push(e.parentNode?e.parentNode.removeChild(e):e):n.appendChild(e)};for(s=0;(u=b[s])!=null;s++)if(!v.nodeName(u,"script")||!m(u))n.appendChild(u),typeof u.getElementsByTagName!="undefined"&&(g=v.grep(v.merge([],u.getElementsByTagName("script")),m),b.splice.apply(b,[s+1,0].concat(g)),s+=g.length)}return b},cleanData:function(e,t){var n,r,i,s,o=0,u=v.expando,a=v.cache,f=v.support.deleteExpando,l=v.event.special;for(;(i=e[o])!=null;o++)if(t||v.acceptData(i)){r=i[u],n=r&&a[r];if(n){if(n.events)for(s in n.events)l[s]?v.event.remove(i,s):v.removeEvent(i,s,n.handle);a[r]&&(delete a[r],f?delete i[u]:i.removeAttribute?i.removeAttribute(u):i[u]=null,v.deletedIds.push(r))}}}}),function(){var e,t;v.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e=v.uaMatch(o.userAgent),t={},e.browser&&(t[e.browser]=!0,t.version=e.version),t.chrome?t.webkit=!0:t.webkit&&(t.safari=!0),v.browser=t,v.sub=function(){function e(t,n){return new e.fn.init(t,n)}v.extend(!0,e,this),e.superclass=this,e.fn=e.prototype=this(),e.fn.constructor=e,e.sub=this.sub,e.fn.init=function(r,i){return i&&i instanceof v&&!(i instanceof e)&&(i=e(i)),v.fn.init.call(this,r,i,t)},e.fn.init.prototype=e.fn;var t=e(i);return e}}();var Dt,Pt,Ht,Bt=/alpha\([^)]*\)/i,jt=/opacity=([^)]*)/,Ft=/^(top|right|bottom|left)$/,It=/^(none|table(?!-c[ea]).+)/,qt=/^margin/,Rt=new RegExp("^("+m+")(.*)$","i"),Ut=new RegExp("^("+m+")(?!px)[a-z%]+$","i"),zt=new RegExp("^([-+])=("+m+")","i"),Wt={BODY:"block"},Xt={position:"absolute",visibility:"hidden",display:"block"},Vt={letterSpacing:0,fontWeight:400},$t=["Top","Right","Bottom","Left"],Jt=["Webkit","O","Moz","ms"],Kt=v.fn.toggle;v.fn.extend({css:function(e,n){return v.access(this,function(e,n,r){return r!==t?v.style(e,n,r):v.css(e,n)},e,n,arguments.length>1)},show:function(){return Yt(this,!0)},hide:function(){return Yt(this)},toggle:function(e,t){var n=typeof e=="boolean";return v.isFunction(e)&&v.isFunction(t)?Kt.apply(this,arguments):this.each(function(){(n?e:Gt(this))?v(this).show():v(this).hide()})}}),v.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Dt(e,"opacity");return n===""?"1":n}}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":v.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(!e||e.nodeType===3||e.nodeType===8||!e.style)return;var s,o,u,a=v.camelCase(n),f=e.style;n=v.cssProps[a]||(v.cssProps[a]=Qt(f,a)),u=v.cssHooks[n]||v.cssHooks[a];if(r===t)return u&&"get"in u&&(s=u.get(e,!1,i))!==t?s:f[n];o=typeof r,o==="string"&&(s=zt.exec(r))&&(r=(s[1]+1)*s[2]+parseFloat(v.css(e,n)),o="number");if(r==null||o==="number"&&isNaN(r))return;o==="number"&&!v.cssNumber[a]&&(r+="px");if(!u||!("set"in u)||(r=u.set(e,r,i))!==t)try{f[n]=r}catch(l){}},css:function(e,n,r,i){var s,o,u,a=v.camelCase(n);return n=v.cssProps[a]||(v.cssProps[a]=Qt(e.style,a)),u=v.cssHooks[n]||v.cssHooks[a],u&&"get"in u&&(s=u.get(e,!0,i)),s===t&&(s=Dt(e,n)),s==="normal"&&n in Vt&&(s=Vt[n]),r||i!==t?(o=parseFloat(s),r||v.isNumeric(o)?o||0:s):s},swap:function(e,t,n){var r,i,s={};for(i in t)s[i]=e.style[i],e.style[i]=t[i];r=n.call(e);for(i in t)e.style[i]=s[i];return r}}),e.getComputedStyle?Dt=function(t,n){var r,i,s,o,u=e.getComputedStyle(t,null),a=t.style;return u&&(r=u.getPropertyValue(n)||u[n],r===""&&!v.contains(t.ownerDocument,t)&&(r=v.style(t,n)),Ut.test(r)&&qt.test(n)&&(i=a.width,s=a.minWidth,o=a.maxWidth,a.minWidth=a.maxWidth=a.width=r,r=u.width,a.width=i,a.minWidth=s,a.maxWidth=o)),r}:i.documentElement.currentStyle&&(Dt=function(e,t){var n,r,i=e.currentStyle&&e.currentStyle[t],s=e.style;return i==null&&s&&s[t]&&(i=s[t]),Ut.test(i)&&!Ft.test(t)&&(n=s.left,r=e.runtimeStyle&&e.runtimeStyle.left,r&&(e.runtimeStyle.left=e.currentStyle.left),s.left=t==="fontSize"?"1em":i,i=s.pixelLeft+"px",s.left=n,r&&(e.runtimeStyle.left=r)),i===""?"auto":i}),v.each(["height","width"],function(e,t){v.cssHooks[t]={get:function(e,n,r){if(n)return e.offsetWidth===0&&It.test(Dt(e,"display"))?v.swap(e,Xt,function(){return tn(e,t,r)}):tn(e,t,r)},set:function(e,n,r){return Zt(e,n,r?en(e,t,r,v.support.boxSizing&&v.css(e,"boxSizing")==="border-box"):0)}}}),v.support.opacity||(v.cssHooks.opacity={get:function(e,t){return jt.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=v.isNumeric(t)?"alpha(opacity="+t*100+")":"",s=r&&r.filter||n.filter||"";n.zoom=1;if(t>=1&&v.trim(s.replace(Bt,""))===""&&n.removeAttribute){n.removeAttribute("filter");if(r&&!r.filter)return}n.filter=Bt.test(s)?s.replace(Bt,i):s+" "+i}}),v(function(){v.support.reliableMarginRight||(v.cssHooks.marginRight={get:function(e,t){return v.swap(e,{display:"inline-block"},function(){if(t)return Dt(e,"marginRight")})}}),!v.support.pixelPosition&&v.fn.position&&v.each(["top","left"],function(e,t){v.cssHooks[t]={get:function(e,n){if(n){var r=Dt(e,t);return Ut.test(r)?v(e).position()[t]+"px":r}}}})}),v.expr&&v.expr.filters&&(v.expr.filters.hidden=function(e){return e.offsetWidth===0&&e.offsetHeight===0||!v.support.reliableHiddenOffsets&&(e.style&&e.style.display||Dt(e,"display"))==="none"},v.expr.filters.visible=function(e){return!v.expr.filters.hidden(e)}),v.each({margin:"",padding:"",border:"Width"},function(e,t){v.cssHooks[e+t]={expand:function(n){var r,i=typeof n=="string"?n.split(" "):[n],s={};for(r=0;r<4;r++)s[e+$t[r]+t]=i[r]||i[r-2]||i[0];return s}},qt.test(e)||(v.cssHooks[e+t].set=Zt)});var rn=/%20/g,sn=/\[\]$/,on=/\r?\n/g,un=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,an=/^(?:select|textarea)/i;v.fn.extend({serialize:function(){return v.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?v.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||an.test(this.nodeName)||un.test(this.type))}).map(function(e,t){var n=v(this).val();return n==null?null:v.isArray(n)?v.map(n,function(e,n){return{name:t.name,value:e.replace(on,"\r\n")}}):{name:t.name,value:n.replace(on,"\r\n")}}).get()}}),v.param=function(e,n){var r,i=[],s=function(e,t){t=v.isFunction(t)?t():t==null?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};n===t&&(n=v.ajaxSettings&&v.ajaxSettings.traditional);if(v.isArray(e)||e.jquery&&!v.isPlainObject(e))v.each(e,function(){s(this.name,this.value)});else for(r in e)fn(r,e[r],n,s);return i.join("&").replace(rn,"+")};var ln,cn,hn=/#.*$/,pn=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,dn=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,vn=/^(?:GET|HEAD)$/,mn=/^\/\//,gn=/\?/,yn=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bn=/([?&])_=[^&]*/,wn=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,En=v.fn.load,Sn={},xn={},Tn=["*/"]+["*"];try{cn=s.href}catch(Nn){cn=i.createElement("a"),cn.href="",cn=cn.href}ln=wn.exec(cn.toLowerCase())||[],v.fn.load=function(e,n,r){if(typeof e!="string"&&En)return En.apply(this,arguments);if(!this.length)return this;var i,s,o,u=this,a=e.indexOf(" ");return a>=0&&(i=e.slice(a,e.length),e=e.slice(0,a)),v.isFunction(n)?(r=n,n=t):n&&typeof n=="object"&&(s="POST"),v.ajax({url:e,type:s,dataType:"html",data:n,complete:function(e,t){r&&u.each(r,o||[e.responseText,t,e])}}).done(function(e){o=arguments,u.html(i?v("<div>").append(e.replace(yn,"")).find(i):e)}),this},v.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(e,t){v.fn[t]=function(e){return this.on(t,e)}}),v.each(["get","post"],function(e,n){v[n]=function(e,r,i,s){return v.isFunction(r)&&(s=s||i,i=r,r=t),v.ajax({type:n,url:e,data:r,success:i,dataType:s})}}),v.extend({getScript:function(e,n){return v.get(e,t,n,"script")},getJSON:function(e,t,n){return v.get(e,t,n,"json")},ajaxSetup:function(e,t){return t?Ln(e,v.ajaxSettings):(t=e,e=v.ajaxSettings),Ln(e,t),e},ajaxSettings:{url:cn,isLocal:dn.test(ln[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":Tn},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":e.String,"text html":!0,"text json":v.parseJSON,"text xml":v.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:Cn(Sn),ajaxTransport:Cn(xn),ajax:function(e,n){function T(e,n,s,a){var l,y,b,w,S,T=n;if(E===2)return;E=2,u&&clearTimeout(u),o=t,i=a||"",x.readyState=e>0?4:0,s&&(w=An(c,x,s));if(e>=200&&e<300||e===304)c.ifModified&&(S=x.getResponseHeader("Last-Modified"),S&&(v.lastModified[r]=S),S=x.getResponseHeader("Etag"),S&&(v.etag[r]=S)),e===304?(T="notmodified",l=!0):(l=On(c,w),T=l.state,y=l.data,b=l.error,l=!b);else{b=T;if(!T||e)T="error",e<0&&(e=0)}x.status=e,x.statusText=(n||T)+"",l?d.resolveWith(h,[y,T,x]):d.rejectWith(h,[x,T,b]),x.statusCode(g),g=t,f&&p.trigger("ajax"+(l?"Success":"Error"),[x,c,l?y:b]),m.fireWith(h,[x,T]),f&&(p.trigger("ajaxComplete",[x,c]),--v.active||v.event.trigger("ajaxStop"))}typeof e=="object"&&(n=e,e=t),n=n||{};var r,i,s,o,u,a,f,l,c=v.ajaxSetup({},n),h=c.context||c,p=h!==c&&(h.nodeType||h instanceof v)?v(h):v.event,d=v.Deferred(),m=v.Callbacks("once memory"),g=c.statusCode||{},b={},w={},E=0,S="canceled",x={readyState:0,setRequestHeader:function(e,t){if(!E){var n=e.toLowerCase();e=w[n]=w[n]||e,b[e]=t}return this},getAllResponseHeaders:function(){return E===2?i:null},getResponseHeader:function(e){var n;if(E===2){if(!s){s={};while(n=pn.exec(i))s[n[1].toLowerCase()]=n[2]}n=s[e.toLowerCase()]}return n===t?null:n},overrideMimeType:function(e){return E||(c.mimeType=e),this},abort:function(e){return e=e||S,o&&o.abort(e),T(0,e),this}};d.promise(x),x.success=x.done,x.error=x.fail,x.complete=m.add,x.statusCode=function(e){if(e){var t;if(E<2)for(t in e)g[t]=[g[t],e[t]];else t=e[x.status],x.always(t)}return this},c.url=((e||c.url)+"").replace(hn,"").replace(mn,ln[1]+"//"),c.dataTypes=v.trim(c.dataType||"*").toLowerCase().split(y),c.crossDomain==null&&(a=wn.exec(c.url.toLowerCase()),c.crossDomain=!(!a||a[1]===ln[1]&&a[2]===ln[2]&&(a[3]||(a[1]==="http:"?80:443))==(ln[3]||(ln[1]==="http:"?80:443)))),c.data&&c.processData&&typeof c.data!="string"&&(c.data=v.param(c.data,c.traditional)),kn(Sn,c,n,x);if(E===2)return x;f=c.global,c.type=c.type.toUpperCase(),c.hasContent=!vn.test(c.type),f&&v.active++===0&&v.event.trigger("ajaxStart");if(!c.hasContent){c.data&&(c.url+=(gn.test(c.url)?"&":"?")+c.data,delete c.data),r=c.url;if(c.cache===!1){var N=v.now(),C=c.url.replace(bn,"$1_="+N);c.url=C+(C===c.url?(gn.test(c.url)?"&":"?")+"_="+N:"")}}(c.data&&c.hasContent&&c.contentType!==!1||n.contentType)&&x.setRequestHeader("Content-Type",c.contentType),c.ifModified&&(r=r||c.url,v.lastModified[r]&&x.setRequestHeader("If-Modified-Since",v.lastModified[r]),v.etag[r]&&x.setRequestHeader("If-None-Match",v.etag[r])),x.setRequestHeader("Accept",c.dataTypes[0]&&c.accepts[c.dataTypes[0]]?c.accepts[c.dataTypes[0]]+(c.dataTypes[0]!=="*"?", "+Tn+"; q=0.01":""):c.accepts["*"]);for(l in c.headers)x.setRequestHeader(l,c.headers[l]);if(!c.beforeSend||c.beforeSend.call(h,x,c)!==!1&&E!==2){S="abort";for(l in{success:1,error:1,complete:1})x[l](c[l]);o=kn(xn,c,n,x);if(!o)T(-1,"No Transport");else{x.readyState=1,f&&p.trigger("ajaxSend",[x,c]),c.async&&c.timeout>0&&(u=setTimeout(function(){x.abort("timeout")},c.timeout));try{E=1,o.send(b,T)}catch(k){if(!(E<2))throw k;T(-1,k)}}return x}return x.abort()},active:0,lastModified:{},etag:{}});var Mn=[],_n=/\?/,Dn=/(=)\?(?=&|$)|\?\?/,Pn=v.now();v.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Mn.pop()||v.expando+"_"+Pn++;return this[e]=!0,e}}),v.ajaxPrefilter("json jsonp",function(n,r,i){var s,o,u,a=n.data,f=n.url,l=n.jsonp!==!1,c=l&&Dn.test(f),h=l&&!c&&typeof a=="string"&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Dn.test(a);if(n.dataTypes[0]==="jsonp"||c||h)return s=n.jsonpCallback=v.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,o=e[s],c?n.url=f.replace(Dn,"$1"+s):h?n.data=a.replace(Dn,"$1"+s):l&&(n.url+=(_n.test(f)?"&":"?")+n.jsonp+"="+s),n.converters["script json"]=function(){return u||v.error(s+" was not called"),u[0]},n.dataTypes[0]="json",e[s]=function(){u=arguments},i.always(function(){e[s]=o,n[s]&&(n.jsonpCallback=r.jsonpCallback,Mn.push(s)),u&&v.isFunction(o)&&o(u[0]),u=o=t}),"script"}),v.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(e){return v.globalEval(e),e}}}),v.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),v.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=i.head||i.getElementsByTagName("head")[0]||i.documentElement;return{send:function(s,o){n=i.createElement("script"),n.async="async",e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,i){if(i||!n.readyState||/loaded|complete/.test(n.readyState))n.onload=n.onreadystatechange=null,r&&n.parentNode&&r.removeChild(n),n=t,i||o(200,"success")},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(0,1)}}}});var Hn,Bn=e.ActiveXObject?function(){for(var e in Hn)Hn[e](0,1)}:!1,jn=0;v.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&Fn()||In()}:Fn,function(e){v.extend(v.support,{ajax:!!e,cors:!!e&&"withCredentials"in e})}(v.ajaxSettings.xhr()),v.support.ajax&&v.ajaxTransport(function(n){if(!n.crossDomain||v.support.cors){var r;return{send:function(i,s){var o,u,a=n.xhr();n.username?a.open(n.type,n.url,n.async,n.username,n.password):a.open(n.type,n.url,n.async);if(n.xhrFields)for(u in n.xhrFields)a[u]=n.xhrFields[u];n.mimeType&&a.overrideMimeType&&a.overrideMimeType(n.mimeType),!n.crossDomain&&!i["X-Requested-With"]&&(i["X-Requested-With"]="XMLHttpRequest");try{for(u in i)a.setRequestHeader(u,i[u])}catch(f){}a.send(n.hasContent&&n.data||null),r=function(e,i){var u,f,l,c,h;try{if(r&&(i||a.readyState===4)){r=t,o&&(a.onreadystatechange=v.noop,Bn&&delete Hn[o]);if(i)a.readyState!==4&&a.abort();else{u=a.status,l=a.getAllResponseHeaders(),c={},h=a.responseXML,h&&h.documentElement&&(c.xml=h);try{c.text=a.responseText}catch(p){}try{f=a.statusText}catch(p){f=""}!u&&n.isLocal&&!n.crossDomain?u=c.text?200:404:u===1223&&(u=204)}}}catch(d){i||s(-1,d)}c&&s(u,f,c,l)},n.async?a.readyState===4?setTimeout(r,0):(o=++jn,Bn&&(Hn||(Hn={},v(e).unload(Bn)),Hn[o]=r),a.onreadystatechange=r):r()},abort:function(){r&&r(0,1)}}}});var qn,Rn,Un=/^(?:toggle|show|hide)$/,zn=new RegExp("^(?:([-+])=|)("+m+")([a-z%]*)$","i"),Wn=/queueHooks$/,Xn=[Gn],Vn={"*":[function(e,t){var n,r,i=this.createTween(e,t),s=zn.exec(t),o=i.cur(),u=+o||0,a=1,f=20;if(s){n=+s[2],r=s[3]||(v.cssNumber[e]?"":"px");if(r!=="px"&&u){u=v.css(i.elem,e,!0)||n||1;do a=a||".5",u/=a,v.style(i.elem,e,u+r);while(a!==(a=i.cur()/o)&&a!==1&&--f)}i.unit=r,i.start=u,i.end=s[1]?u+(s[1]+1)*n:n}return i}]};v.Animation=v.extend(Kn,{tweener:function(e,t){v.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;r<i;r++)n=e[r],Vn[n]=Vn[n]||[],Vn[n].unshift(t)},prefilter:function(e,t){t?Xn.unshift(e):Xn.push(e)}}),v.Tween=Yn,Yn.prototype={constructor:Yn,init:function(e,t,n,r,i,s){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=s||(v.cssNumber[n]?"":"px")},cur:function(){var e=Yn.propHooks[this.prop];return e&&e.get?e.get(this):Yn.propHooks._default.get(this)},run:function(e){var t,n=Yn.propHooks[this.prop];return this.options.duration?this.pos=t=v.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Yn.propHooks._default.set(this),this}},Yn.prototype.init.prototype=Yn.prototype,Yn.propHooks={_default:{get:function(e){var t;return e.elem[e.prop]==null||!!e.elem.style&&e.elem.style[e.prop]!=null?(t=v.css(e.elem,e.prop,!1,""),!t||t==="auto"?0:t):e.elem[e.prop]},set:function(e){v.fx.step[e.prop]?v.fx.step[e.prop](e):e.elem.style&&(e.elem.style[v.cssProps[e.prop]]!=null||v.cssHooks[e.prop])?v.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},Yn.propHooks.scrollTop=Yn.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},v.each(["toggle","show","hide"],function(e,t){var n=v.fn[t];v.fn[t]=function(r,i,s){return r==null||typeof r=="boolean"||!e&&v.isFunction(r)&&v.isFunction(i)?n.apply(this,arguments):this.animate(Zn(t,!0),r,i,s)}}),v.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Gt).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=v.isEmptyObject(e),s=v.speed(t,n,r),o=function(){var t=Kn(this,v.extend({},e),s);i&&t.stop(!0)};return i||s.queue===!1?this.each(o):this.queue(s.queue,o)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return typeof e!="string"&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=e!=null&&e+"queueHooks",s=v.timers,o=v._data(this);if(n)o[n]&&o[n].stop&&i(o[n]);else for(n in o)o[n]&&o[n].stop&&Wn.test(n)&&i(o[n]);for(n=s.length;n--;)s[n].elem===this&&(e==null||s[n].queue===e)&&(s[n].anim.stop(r),t=!1,s.splice(n,1));(t||!r)&&v.dequeue(this,e)})}}),v.each({slideDown:Zn("show"),slideUp:Zn("hide"),slideToggle:Zn("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){v.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),v.speed=function(e,t,n){var r=e&&typeof e=="object"?v.extend({},e):{complete:n||!n&&t||v.isFunction(e)&&e,duration:e,easing:n&&t||t&&!v.isFunction(t)&&t};r.duration=v.fx.off?0:typeof r.duration=="number"?r.duration:r.duration in v.fx.speeds?v.fx.speeds[r.duration]:v.fx.speeds._default;if(r.queue==null||r.queue===!0)r.queue="fx";return r.old=r.complete,r.complete=function(){v.isFunction(r.old)&&r.old.call(this),r.queue&&v.dequeue(this,r.queue)},r},v.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},v.timers=[],v.fx=Yn.prototype.init,v.fx.tick=function(){var e,n=v.timers,r=0;qn=v.now();for(;r<n.length;r++)e=n[r],!e()&&n[r]===e&&n.splice(r--,1);n.length||v.fx.stop(),qn=t},v.fx.timer=function(e){e()&&v.timers.push(e)&&!Rn&&(Rn=setInterval(v.fx.tick,v.fx.interval))},v.fx.interval=13,v.fx.stop=function(){clearInterval(Rn),Rn=null},v.fx.speeds={slow:600,fast:200,_default:400},v.fx.step={},v.expr&&v.expr.filters&&(v.expr.filters.animated=function(e){return v.grep(v.timers,function(t){return e===t.elem}).length});var er=/^(?:body|html)$/i;v.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){v.offset.setOffset(this,e,t)});var n,r,i,s,o,u,a,f={top:0,left:0},l=this[0],c=l&&l.ownerDocument;if(!c)return;return(r=c.body)===l?v.offset.bodyOffset(l):(n=c.documentElement,v.contains(n,l)?(typeof l.getBoundingClientRect!="undefined"&&(f=l.getBoundingClientRect()),i=tr(c),s=n.clientTop||r.clientTop||0,o=n.clientLeft||r.clientLeft||0,u=i.pageYOffset||n.scrollTop,a=i.pageXOffset||n.scrollLeft,{top:f.top+u-s,left:f.left+a-o}):f)},v.offset={bodyOffset:function(e){var t=e.offsetTop,n=e.offsetLeft;return v.support.doesNotIncludeMarginInBodyOffset&&(t+=parseFloat(v.css(e,"marginTop"))||0,n+=parseFloat(v.css(e,"marginLeft"))||0),{top:t,left:n}},setOffset:function(e,t,n){var r=v.css(e,"position");r==="static"&&(e.style.position="relative");var i=v(e),s=i.offset(),o=v.css(e,"top"),u=v.css(e,"left"),a=(r==="absolute"||r==="fixed")&&v.inArray("auto",[o,u])>-1,f={},l={},c,h;a?(l=i.position(),c=l.top,h=l.left):(c=parseFloat(o)||0,h=parseFloat(u)||0),v.isFunction(t)&&(t=t.call(e,n,s)),t.top!=null&&(f.top=t.top-s.top+c),t.left!=null&&(f.left=t.left-s.left+h),"using"in t?t.using.call(e,f):i.css(f)}},v.fn.extend({position:function(){if(!this[0])return;var e=this[0],t=this.offsetParent(),n=this.offset(),r=er.test(t[0].nodeName)?{top:0,left:0}:t.offset();return n.top-=parseFloat(v.css(e,"marginTop"))||0,n.left-=parseFloat(v.css(e,"marginLeft"))||0,r.top+=parseFloat(v.css(t[0],"borderTopWidth"))||0,r.left+=parseFloat(v.css(t[0],"borderLeftWidth"))||0,{top:n.top-r.top,left:n.left-r.left}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||i.body;while(e&&!er.test(e.nodeName)&&v.css(e,"position")==="static")e=e.offsetParent;return e||i.body})}}),v.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);v.fn[e]=function(i){return v.access(this,function(e,i,s){var o=tr(e);if(s===t)return o?n in o?o[n]:o.document.documentElement[i]:e[i];o?o.scrollTo(r?v(o).scrollLeft():s,r?s:v(o).scrollTop()):e[i]=s},e,i,arguments.length,null)}}),v.each({Height:"height",Width:"width"},function(e,n){v.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){v.fn[i]=function(i,s){var o=arguments.length&&(r||typeof i!="boolean"),u=r||(i===!0||s===!0?"margin":"border");return v.access(this,function(n,r,i){var s;return v.isWindow(n)?n.document.documentElement["client"+e]:n.nodeType===9?(s=n.documentElement,Math.max(n.body["scroll"+e],s["scroll"+e],n.body["offset"+e],s["offset"+e],s["client"+e])):i===t?v.css(n,r,i,u):v.style(n,r,i,u)},n,o?i:t,o,null)}})}),e.jQuery=e.$=v,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return v})})(window);

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
		},
		
		setImagePosition : function(image, ow, oh, FitWidth, FitHeight){
			var left = 0, top = 0;
			if(FitWidth - ow > 0){
				left = (FitWidth - ow)/2;
			}
			
			if(FitHeight > oh){
				top = (FitWidth - oh)/2;
			}
			$(image).css({'left':left, 'top':top});
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
		//等比取缩放图片（最少不能少于某值）
		getImageSizeByValue : function(obj, lag, fn){
			var image = new Image(), rw, rh, isObj = typeof(obj) == 'object';		
			function loaded(_image){
				if(_image) image = _image;
				if(image.width>0 && image.height>0){ 
					if(typeof lag == 'number'){//正方形
						if(image.width>lag && image.height>lag){
							if(image.width>=image.height){
								rh = lag;
								rw = image.width / image.height * lag;
							}else{
								rw = lag;
								rh = image.height / image.width * lag;
							}
						}else{
							rw = image.width;
							rh = image.height;
						}
					}else if(typeof lag == 'object'){//高宽不一样
						if(lag.w && !lag.h){//只有宽度
							if(image.width>lag.w){
								rw = lag.w;
								rh = lag.w/image.width * image.height;
							}else{
								rw = image.width;
								rh = image.height;
							}
						}else if(lag.h && !lag.w){//只有高度
							if(image.height>lag.h){
								rh = lag.h;
								rw = lag.h/image.height * image.width;
							}else{
								rw = image.width;
								rh = image.height;
							}
						}else{//高宽都存在
							if(image.width>lag.w && image.height >lag.h){
								if(image.width/lag.w > image.height / lag.h){
									rw = lag.w;
									rh = lag.w/image.width*image.height;
								}else{
									rh = lag.h;
									rw = lag.h/image.height*image.width;
								}
							}else{
								rw = image.width;
								rh = image.height;
							}
						}
					}
					if(isObj){
						obj.width = rw;
						obj.height = rh;
					}
					fn && fn({width : rw, height : rh});
				}
			}		

			$(image).load(function(){
				loaded(); 
			});
			image.src = isObj?obj.src : obj; 
		},
		
		//时间戳转成年月日
		timeChange : function(str){
			var timeObj = new Date(str),
			Y = timeObj.getFullYear(),
			M = timeObj.getMonth() + 1,
			D = timeObj.getDate(),
			h = timeObj.getHours(),
			m = timeObj.getMinutes(),
			s = timeObj.getSeconds(),
			w = timeObj.getDay();
			switch(w){
				case 0 :
					w = "星期日";
				break;
				case 1 :
					w = "星期一";
				break;
				case 2 :
					w = "星期二";
				break;
				case 3 :
					w = "星期三";
				break;
				case 4 :
					w = "星期四";
				break;
				case 5 :
					w = "星期五";
				break;
				case 6 :
					w = "星期六";
				break;
			}
			return [Y,M,D,h,m,s,w];
		}
	};
	
	/**
	 * @class Gaofen.Ad
	 * 高分网广告函数。<br/>
	 * @singleton
	 */
	G.Ad = {	
		bbsjsad : {
			jsgaokao_gz   : 'gad_gaokao',
			jsgaokao_bj   : 'gad_gaokao-bj',
			jsgaokao_cd   : 'gad_gaokao-cd',
			jsgaokao_sh   : 'gad_gaokao-sh',
			jsxsc_gad     : 'gad_xsc',
			jsxsc_gad_sz  : 'gad_xsc-sz',
			jsxsc_gad_cd  : 'gad_xsc-cd',
			jsxsc_gad_bj  : 'gad_xsc-bj',
			jsxsc_gad_sh  : 'gad_xsc-sh',
			jszhongkao_gad_gz : 'gad_zhongkao',
			jszhongkao_gad_cd : 'gad_zhongkao-cd',
			jszhongkao_gad_bj : 'gad_zhongkao-bj',
			jszhongkao_gad_sh : 'gad_zhongkao-sh',
			jszhongkao_gad_sz : 'gad_zhongkao-sz',
			jsindex : 'gad_index',
			szjsindex : 'gad_sz'
		},
		
		/**
		* @page 页面模块
		* @page_column 栏目名称
		* @city 地区简称
		*/
		getAd : function(page, page_column,city){
			var jsname = null, tbj = this.bbsjsad;
			if (page != null && page != 'undefined') {
				if (page_column != null && page_column != 'undefined') {
					if (city != null && city != 'undefined') {
						switch (page) {
							case 'gaokao':
								 switch (page_column) {
									case 'list':
										jsname = tbj['jsgaokao_'+city];
									break;
								}
							break;					
							case 'xsc':
								switch (page_column) {
									case 'list':
										switch (city) {
											case 'gz':
												jsname = tbj['jsxsc_gad'];
												break;
											case 'sz':
												jsname = tbj['jsxsc_gad_sz'];
												break;
											case 'cd':
												jsname = tbj['jsxsc_gad_cd'];
												break;
											case 'bj':
												jsname = tbj['jsxsc_gad_bj'];
												break;
											case 'sh':
												jsname = tbj['jsxsc_gad_sh'];
												break;
										}
									break;
							   }
							break;
							case 'zhongkao':
								switch (page_column) {
									case 'list':
										jsname = tbj['jszhongkao_gad_'+city];
									break;
							   }
							break;
							case 'index':
								switch (page_column) {
									case 'list':
										switch (city) {
											case 'gz':
												jsname = tbj['jsindex'];
												break;
											case 'sz':
												jsname = tbj['szjsindex'];
											break;
										}
									break;
							   }
							break;
						}
					}
				}
			}
			return jsname;
		},

		//加载广告脚本
		addAd : function(jsname){
			if(jsname)
				document.write('<script type="text/javascript" src="http://bbs.gaofen.com/source/plugin/gaofen_ad/js/'+jsname+'.js"></script>');
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
/**
 * @author   xiezhiwen
 * ui模板
 */
 
(function(G, $, win){
	
	var T = G.tpl.reg({

		BoxTitlebar : '<div class="modal-header"><h3 class="{.titCls}" id="gf_title">{.title}</h3></div>',		
		
		//对话框 
		modal : [
		     '<div class="modal {.cs}" >',		
					'[?.title?{BoxTitlebar}?]',
				'<div class="modal-body" id="gfbody">',
					'{.contentHtml}',
				'</div>',				
				'[?.footers? {mfooter}?]',
				'[?.closeable?<a class="close" href="#"  id="gf_close" title="关闭">×</a>?]',
				//'[?.closeable?<button type="button" class="close" id="gf_close" title="关闭">×</button>?]',
			'</div>'].join(''),
			
		mask : '<div class="modal-backdrop fade"></div>',
		
		mfooter : '<div class="modal-footer" id="gf_buttons">{.footers}</div>', 
		 
		//dialogContent : '{.dlgContentHtml}<div class="btn-area" id="xwb_dlg_btns">{.buttonHtml}</div>',
		
	    AnchorTipContent : '<div class="tips-c"><div class="icon-correct icon-bg"></div><p id="fwbody"></p></div>',
	    //AnchorDlgContent : '<div class="tips-c"><div class="icon-warn icon-bg"></div><p id="fwbody"></p></div>',
		
		AnchorDlgContent : ['<div class="alert alert-info" id="icon_cls">',
			'<i class="ico"></i>',
			'<div class="info" id="fwbody"><p></p>',
			'</div>',
		'</div>',
		'<div class="actions" id="gf_buttons">',
			'{.buttonHtml}',
			//'<input class="btn btn-primary" type="submit" name="submit" value="确定">',
		'</div>'].join(''),

		button : '<a href="#" class="btn btn-primary {.cs}" id="gf_btn_{.id}">{.title}</a>',
		
		Bubble : '<div class="bubble {.cs}">{.msg}</div>',
		
		Bubble_Award : '<div class="bubble {.cs}">{.msg}<span class="arrow"><i class="arrow-border"></i><i class="arrow-body"></i></span></div>',
		
		//分页
		Page : ['<div class="pagination clear" id="{.id}">',
					'<div class="page-wrap">',
					'<ul class="page" id="content"></ul></div>',
				'</div>'].join(''),
				
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
                    '<div class="actions"><a target="_blank" href="http://my.gaofen.com/signup">注册新账号</a>',
                    '</div>',
                '</div>',
            '</div>'
			].join(''),
				
	//报名成功
	    win_lecture : ['<div class="form" id="joinInfo">',
							'<div class="form-row">',
								'<label class="control-label">参加</label>',
								'<div class="controls">',
									'<select id="select01">',
									 '   <option value="1">1人</option>',
									 '   <option value="2">2人</option>',
									 '   <option value="3">3人</option>',
									 '   <option value="4">4人</option>',
									 '   <option value="5">5人</option>',
								   ' </select>',
							   ' </div>',
						    '</div> ',
							'<div class="form-row" id="changci">',
								'<label class="control-label">场次</label>',
								'<div class="controls">',
									'<select id="ccselect" class="width-auto" vrel="_f|ne=m:请选择场次">',
								   ' </select>',
							   ' </div>',
							   '<span class="help-inline hidden">请选择场次</span>',
						    '</div> ',
							'<div class="form-row ipt_user">',
							 '   <label class="control-label">联系人</label>',
							 '   <div class="controls">',
							  '      <input type="text" class="input-text txt_user" name="user" vrel="_f|ne=m:请填写联系人">',
							 '   </div>',
							'    <span class="help-inline hidden">请填写联系人</span>',
						   ' </div>',
						   ' <div class="form-row ipt_mobile">',
							'    <label class="control-label">手机号</label>',
							 '   <div class="controls">',
							 '       <input type="text" maxlength="11" class="input-text" name="txt_mobile" vrel="_f|ne=m:请填写手机号|phone=m:手机号格式不对">',
							  '      <p class="hints">用于接收领票短信</p>',
							  '  </div>',
							  '  <span class="help-inline hidden">请填写手机号</span>',
						   ' </div>',
						   ' <div class="actions">',
						   '     <a class="btn btn-primary" id="lecturebtn" rel="e:sub" title="提交" href="#">提交</a>',
						 '   </div>',
			    '</div>',
				'<div class="alert alert-success hidden">',
				'	<i class="ico"></i>',
				'	<div class="info">',
				'		<h3>报名成功!</h3>',
				'		<p>我们将在活动开始前发送领票凭证短信到报名手机，凭短信到现场领票即可！</p>',
				'	</div>',
				'	<div class="actions">',
				'		<a class="btn btn-primary btn-close" title="关闭" href="javascript:void(0);" id="close">关闭</a>',
				'	</div>',
				'</div>'
				].join(''),
				
		win_download1 : [
					'<div class="modal-info ">',
			        '    <div class="cont">',
			        '        <p>本次下载需要消耗高分币：<strong id="usecost" class="hl"></strong></p>',
			        '        <p id="residue"></p>',
			        '    </div>',
			        '    <div class="actions">',
			        '		 <form method="post" action=""  id="submit_download">',
			        '			<label class="btn btn-primary"><input type="submit" value="立即下载" name="download"></label>',
			        '       	<a class="btn" title="取消"  id="cancel" href="#">取消</a>',
					'			<input type="text" class="hidden" name="id" value="{.fid}">',
			        '        <p id="share" class="hidden"><label class="checkbox"><input type="checkbox" value="1" name="share" checked="checked">同步分享到微博</label></p>',
			        '		 </form>',			        
			        '    </div>',
			        '</div>'
					].join(''),
					
		win_download2 : [
					'<div class="modal-info ">',
			        '    <div class="cont">',
			        '        <p>本次下载需要消耗高分币：<strong  id="usecost" class="h1"></strong></p>',
			        '        <p>您剩余高分币：<span class="hl tip_cUost" class="h1"></span><span class="hl">您的高分币余额不足</span></p>',
			        '    </div>',
			        '    <div class="actions">',
			        '        <a class="btn btn-primary" target="_blank" title="马上充值" href="http://bbs.gaofen.com/home.php?mod=spacecp&ac=credit&op=buy">马上充值</a>',
			        '        <p><a  target="_blank" title="通过其他方式获取高分币" href="http://bbs.gaofen.com/thread-16509-1-1.html  ">通过其他方式获取高分币</a></p>',
			        '    </div>',
			        '</div>'
				  ].join(''),
				  
		win_download3 : ['<div class="modal-info">',
							'<div class="cont">',
								'<p>{.bookname}</p>',
								'<p>请支付：<strong class="hl">{.money}</strong></p>',
							'</div>',
							'<div class="actions">',
								'<form method="post" action="{.payurl}"  id="submit_download" target="_blank">',
									'<label class="btn btn-primary"><input type="submit" id="downbtn" name="download" value="支付宝支付"></label>',
									'<a class="btn" title="取消" href="#" id="cancel">取消</a>',
									'<input type="text" value="{.fid}" class="hidden" name="id">',
								'</form>',
							'</div>',
						'</div>',
						'<div class="modal-info hidden">',
								'<div class="cont">',
									'<p>请在新打开的支付页面中完成支付</p>',
								'</div>',
								'<div class="actions">',
									'<a id="finish"  href="#" class="btn btn-primary">完成支付</a>',
								'</div>',
						'</div>',
						'<div class="modal-info hidden">',
							'<div class="alert alert-success">',
								'<i class="ico"></i>',
								'<div class="info">',
									'<h3>恭喜你！支付成功</h3>',
									'<p class="hints"><a href="http://my.gaofen.com/index.php?parent=orderlist&r_parent=orderlist" target="_black">您可以在个人中心 - 我的订单中查看您的购买记录</a></p>',
								'</div>',
							'</div>',
							'<div class="actions">',
								'<form method="post" action=""  id="submit_download" target="_blank">',
									'<label class="btn btn-primary"><input type="submit" id="_downbtn" value="立即下载" name="_downbtn"></label>',
									'<p><label class="checkbox"><input type="checkbox" checked="checked">分享到微博</label></p>',
								'</form>',
							'</div>',
						'</div>'].join(''),
				  
		downloadChange : ['<div class="actions">',
							'<form method="post" action="{.url}" >',
								'<label class="btn btn-primary"><input type="submit" value="立即下载" name="download"></label>',
							'</form>',
							'<span class="free">已购买</span>',
                        '</div>'].join(''),
					
		readAfterPay : [
			'<div class="modal-info">',
					'<div class="cont">',
						'<p>免费试读已结束，购买后可继续阅读或下载。</p>',
					'</div>',
					'<div class="actions">',
						'<a id="finish" rel="e:ddoc,id:{.fid},t:{.ftype}" href="#" class="btn btn-primary">立即购买</a>',
						'<span class="hl">{.mt}</span>',
					'</div>',
			'</div>'
		].join(''),
		
		readerImgHtml : ['<div class="page-ie"><img height="1058" src="{.url}" /></div>'],
		
		lingquDatum : ['<div class="modal-info">',
						'<div class="form">',
							'<div class="form-row">',
								'<label class="control-label">校区</label>',
								'<div class="controls">',
									'<select id="school" name="school" vrel="_f|ne=m:请选择领取校区">',
										'<option value="">请选择领取校区</option>',
									'</select>',
									'<p class="hints" id="schoolArea"></p>',
									//'<p class="help-inline"></p>'
								'</div>',
								'<span class="help-inline"></span>',
							'</div>',
							'<div class="form-row">',
								'<label class="control-label">姓名</label>',
								'<div class="controls">',
									'<input type="text" class="input-text" name="username" vrel="_f|ne=m:请填写姓名|sz=max:10,m:姓名不超过10字">',
								'</div>',
								'<span class="help-inline"></span>',
							'</div>',
							'<div class="form-row">',
								'<label class="control-label">手机</label>',
								'<div class="controls">',
									'<input type="text" class="input-text" name="phone" vrel="_f|ne=m:请填写手机|sz=max:13,m:请正确填写手机号|phone=m:请正确填写手机号">',
								'</div>',
								'<span class="help-inline"></span>',
							'</div>',
							//'<div class="actions">',
							//	'<a class="btn btn-primary" id="btn" title="提交" href="#">提交</a>',
							//'</div>',
							'<div class="form-row actions">',
								'<div class="controls">',
									'<a class="btn btn-primary" id="btn" title="提交" href="#">提交</a>',
								'</div>',
								'<span class="help-inline" id="errorArea"></span>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="modal-info hidden" id="lingqusuccess">',
						'<div class="alert alert-success">',
							'<i class="ico"></i>',
							'<div class="info">',
								'<h3>成功提交信息！</h3>',
								'<p>资料领取的详细信息将会以短信的形式通知您，如有疑问请及时与我们联系。</p>',
								'<p>客服电话：020-38350411（周一至五 9:00-18:00）</p>',
							'</div>',
						'</div>',
					'</div>'].join(''),
		ChangeCity : ['<span class="trigger" id="triggerCity">[切换城市]</span>',
						'<div class="drop" id="cityDrop">',
							'<div class="in">{.sites}',
							'</div>',
							'<i class="arrow"><i class="arrow-border"></i><i class="arrow-body"></i></i>',
						'</div>'].join(''),
						

			//购买时要检测帐号是否已激活
			activate : ['<h2>请激活邮箱</h2>',
					'<p>为了正常使用网站内的功能，请验证您的邮箱并激活账号。</p>',
					'<p>您的注册邮箱：<span class="hl-red">{.mail}</span></p>',
					'<div class="actions"><a class="btn btn-primary" href="{.toMail}" target="_black">登录邮箱</a>',
					'</div>',
					'<div class="hints">还没收到邮件？<a href="#" id="send">点此重发一遍</a><span class="icon-success hidden" id="msg">已发送</span>',
				'</div>'].join(''),
						
		//特殊广告只有深圳用户才能看到				
		shenzhengAd : ['<div class="ad-bottom">',
							'<a target="_blank" href="http://sz.gaofen.com/special/jingruijiangzuo.htm"></a>',
							'<span class="close" id="close"></span>',
						'</div>'].join(''),
						
		//移动端下载、购买时提示浮层
		mobileModal : ['<div class="alert alert-info"><i class="ico"></i>',
				'<div class="info">',
					'<p>您正在使用移动设备访问本页面，由于部分终端在下载时可能会出现异常，如不能正常下载请到电脑上完成操作。</p>',
				'</div>',
			'</div>',
			'<div class="actions"><a class="btn btn-primary" href="#" id="btnMsg">{.btnMsg}</a><a class="btn" href="#" id="cancel">取消</a>',
			'</div>'].join('')						
		
	})
	
	
})(Gaofen, jQuery, window);
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
	
	
	ui.Bubble = G.reg('Bubble', Util.create(Base, {
		view : 'Bubble',
		cs : 'bubble-info',
		autoHide : true,
		timeoutHide : 1000,
		timeoutShow : 200,
		stayHover : false,
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
			//if( Layer.prototype.beforeShow.apply(this, arguments) === false )
			//	return false;
			
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
			var self = this;
			setTimeout(function(){
				self.close();
			}, this.timeoutHide);
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
         * 获得库中公用提示框实例
         * @return {Gaofen.ui.Bubble}
         */
        getBubbleBox : function(css, msg, view){
            //var w = this.Bubble;
            //if(!w){
                w = this.Bubble = G.use('Bubble', {
                    cs : css,
                    appendTo:doc.body,
					view : view || 'Bubble',
                    //title:'提示',
					msg : msg,
					destroyOnClose : true,
					anchorElem : null,
                    setContent : function(html){
                        this.jq().html(html);
                    },
					setCss : function(css){
						var jq = this.jq();
						jq.attr('class', jq.attr('class').replace(/bubble\-\S+/i, css));
					},
                    
                    timeoutHide:2000,
                    setAnchor : function(anchorElem){
						if(anchorElem && $.type(anchorElem) !== "array"){
							this.anchorEl = anchorElem;
						}else{
							
							var jq = this.jq();
							if(anchorElem && $.type(anchorElem) === "array"){
								this.anchorElem = anchorElem[0];
							}else{
								$(jq).css({'left':($(window).width()-jq.width())/2+'px','top':($(window).height()-jq.height())/2+'px'});
							}
						}
                        return this;
                    },
                    
                    beforeShow : function(){

                        if(this.anchorEl){
                            this.anchor(this.anchorEl, 'tc', function(ret, sw, sh){
                                ret[1]-=8;
                            });
                            this.slide('bc',true);
                        }else{
							if(this.anchorElem)
								this.anchor(this.anchorElem, 'tc', function(ret, sw, sh){
									ret[1]-=8;
								});
						}
                        ui.Bubble.prototype.beforeShow.call(this);
                    },
                    
                    beforeHide : function(){
                        if(this.anchorEl){
                            this.slide('cb',false);
                            delete this.anchorEl;
                            return false;
                        }else ui.Bubble.prototype.beforeHide.call(this);
                    },
                    
                    afterHide : function(){
                        ui.Bubble.prototype.afterHide.call(this);
                        // 复原callback
                        if(this.onhide){
                            this.onhide();
                            this.onhide = false;
                        }
                    }
                });
            //}else{
			//	w.setContent(msg);
			//	w.setCss(css);
			//}
			
            return w;
        },
		
		bubble : function(elem, cs, msg, fn){
			 var bubble = this.getBubbleBox(cs, msg);
				bubble.setAnchor(elem)
				.play(true);
				fn && (bubble.onhide = fn);
			return bubble;
		},
	
		BubbleTip : function(elem, msg, fn){ 
			return this.bubble(elem, 'bubble-success', msg, fn); 
		},
		
		BubbleAlert : function(elem, msg, fn){
			return this.bubble(elem, 'bubble-info', msg, fn); 
		},
		
		BubbleSuccess : function(elem, msg, fn){
			var bubble = this.getBubbleBox('bubble-success bubble-award', msg);
				bubble.beforeShow = function(){
					var off = $(elem).offset(), width = $(elem).width(), tw = this.jq().outerWidth();
					var left = (tw - width) / 2;
					this.jq().offset({top : off.top + $(elem).height() + 5, left : off.left - left});
					ui.Bubble.prototype.beforeShow.call(this);
				}
				bubble.play(true);
				fn && (bubble.onhide = fn);
			return bubble;	
		},
		
		BubbleAward : function(elem, msg, fn){ 		
			var bubble = this.getBubbleBox('bubble-success bubble-award', msg, 'Bubble_Award');
				bubble.setAnchor(elem)
				.play(true);
				fn && (bubble.onhide = fn);
			return bubble;		
		},
		
		//错误提示
		BubbleError : function(elem, msg, fn){
			var args = arguments;
			if($.type(args[0]) === 'string'){
				msg = args[0];
				elem = '';
			}
			var bubble = this.getBubbleBox('bubble-error', msg);
				bubble.setAnchor(elem)
				.play(true);
				fn && (bubble.onhide = fn);
			return bubble;
		},
		
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

        anchorConfirm : function(elem, msg, fn){
            var dlg = this.getAnchorDlg();
            dlg.setTitle(msg)
               .setHandler(fn||$.noop)
               .setAnchor(elem)
               .play(true);
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
/**
 * @author  xiezhiwen
 * @class  Gaofen.ui.validator
 * 表单验证
 * <code><pre>
		Gaofen.use('validator', {
			form : '#myform'//表单id
			, trigger : '#btn'//提交按钮
			//, elements : $('#myform input') //仅当非表单或者特殊情况下使用
			, inForm : true
			, onSuccess : function(data){//data是收集到的要验证的内容
				return false;//返回false表单才能提交。如果不是form表单自行ajax提交
			}
		});
   </pre></code>
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
	
	lineCls = 'form-row',
	
	validators = {

		/**
		 * @event ne
		 * 不能为空
		 */
		ne : function(elem, v, data, next){		
			data.m = data.m || ErrorMap['IS_NUll'];
			this.report(!!v, data);			
			next();
		},

		/**
		 * @event mail
		 * 检测邮箱
		 */
		mail : function(elem, v, data, next){	
			var error = true, msg;
			if(!Util.isEmail(v)){//邮箱格式
				msg = data.m || ErrorMap['IS_EMAIL_ERROR'];
			}/*
			else if(Util.isIllegalChar(v)){ //非法字符
				msg = ErrorMap['IS_EMAIL_ILLEGAL'];
			}else if(Util.isChineseChar(v)){//中文字符
				msg = ErrorMap['IS_EMAIL_CHINESECHAR'];
			}else if(Util.isFullwidthChar(v)){//全角符号
				msg = ErrorMap['IS_EMAIL_ALLANGLE'];
			}*/
			if(msg) data.m = msg;
			this.report(!!!msg, data);
		    next();		
		},
		
		/**
		 * @event sz
		 * 检测输入字符长度
		 * 属性：
			<div class="mdetail-params">
			<ul>
			<li>max=number，允许最大字节长度</li>
			<li>min=number，允许最小字节长度</li>
			<li>ww, wide code缩写，将长度按宽字符计算，一个汉字两个字节长度</li>
			<li></li>
			</ul>
			</div>
			例：
			<pre>
				sz=max:6,min:4,m:最少两个汉字，最多三个汉字,ww
			</pre>
		 * @param {Number} max 最大长度
		 * @param {Number} min 最小长度
		 * @param {Boolean} ww 取值1或0，指明长度单位是否按宽字符长度计算，宽字符单位为2，一个字两个字母
		 */
		sz : function(elem, v, data, next){	
			var error = true;
		   if(v){
			   var len = data.ww ? Util.byteLen(v) : v.length,
				   max = data.max, 
				   min = data.min;
			   if(max !== undefined && parseInt(max) < len)
					error = false;
			   if(min !== undefined && parseInt(min) > len)
					error = false;
			   this.report(error, data);
		   }else this.report(false, data);
		   
		   next();
		},
		
		/**
		 * @event mcode
		 * 敏感字符
		 */
		mcode : function(elem, v, data, next){	
			data.m = data.m || ErrorMap['IS_USER_ERROR3'];		    
		    this.report( !/<|"/ig.test(v), data);		   
		    next();
		},
		
		/**
		 * @event illegalChar
		 * 非法字符
		 */
		 illegalChar : function(elem, v, data, next){	
			data.m = data.m || ErrorMap['IS_IllegalChar'];		    
		    this.report( !/[`~!#$%^&*@()_+<>?:"{},\/;'[\]]/im.test(v), data);		   
		    next();
		},
		
		/**
		 * @event radio
		 * radio验证
		 */		
		radio : function(elem, v, data, next){
			var radio = $(elem).closest('.'+lineCls).find('input[type="radio"]:checked');	    
		    this.report( radio.length , data);		   
		    next();
		},
		
		/**
		 * @event cbox
		 * checkbox验证
		 */			
		cbox : function(elem, v, data, next){
			var radio = $(elem).closest('.'+lineCls).find('input[type="checkbox"]:checked');	    
		    this.report( radio.length , data);		   
		    next();
		},
		
		/**
		 * @event cpw
		 * 两次密码匹配
		 *	例：
			<pre>
				cpw=pid:password,m:'两次输入密码不一致'
			</pre>
		 * @param {String} pid 再一次密码输入框id
		 * @param {String} m 错误提示信息
		 */
		cpw : function(elem, v, data, next){
			var pid = data.pid, pv = $('#'+pid).val();
			if(v != pv){
				data.m = data.m || '两次输入密码不一致';
				this.report(false, data);
			}
			next();
		},
		
		/**
		 * @event vcode
		 * 验证码
		 */	
		vcode : function(elem, v, data, next){
			var self = this;
			$.ajax({
				type : 'get',
				dataType: 'html',
                url: '/signup/checkCode?code='+v,
                success : function(e){				
					if(e!= 'ok' && e!=""){
						if(data.re){//刷新
							$(elem).parent().find('img').trigger('click');
						}
						data.m = data.m || ErrorMap['IS_CODE_ERROR'];						
						self.report(false, data);
					}else
						self.report(true, data);
					next();
				}
			});
			/*
			G.request.q('http://my.gaofen.com/index.php?mod=user&do=checkCode&code='+v, {}, function(e){
				if(e!= 'ok' && e!=""){
					data.m = data.m || ErrorMap['IS_CODE_ERROR'];
					self.report(false, data);
				}else
					self.report(true, data);
				next();
			});		
			*/			
		},
		
		/**
		 * @event phone
		 * 手机号
		 */	
		phone : function(elem, v, data, next){			
			data.m = data.m || ErrorMap['IS_PHONE'];		    
		    this.report(/^1[3|4|5|8][0-9]\d{8}$/.test(v), data);		   
		    next();		
		},
		
		/**
		 * @event vcode
		 * 验证码帐号邮箱
		 */	
		account : function(elem, v, data, next){		
			var self = this, url = '';
			if(data && data.t){
				url = '/signup/checkUser?type='+data.t+'&username='+v;
			}else{
				data || (data = {t : 1});
				url = '/signup/checkUser?type=1&username='+v;
			}
			$.ajax({
				type : 'get',
                url: url,
                success : function(e){
					if(e!= '1' && e!=""){
						data.m || (data.m = data.t == '1' ? ErrorMap['IS_EMAIL_EXIST'] : ErrorMap['IS_LIKE_EXIST']);
						self.report(false, data);
					}else
						self.report(true, data);
					next();
				}
			});	
		},
		
		//重复输入密码
		pwd : function(elem, v, data, next){
			var pwd2 = data.id, jqpwd2 = $('#'+pwd2), v2 = $.trim(jqpwd2.val());
			if(v2 !== ''){
				this.report(v2==v, data);
			}
			next();
		},
		
		//select选择
		select : function(elem, v, data, next){			
			var selects = $(elem).closest('.'+lineCls).find('select:visible'), flag = true;	    
			for(var i=0, len = selects.length; i<len;i++){
				if(selects.eq(i).val() === ''){
					flag  = false;
					break;
				}
			}
		    this.report( flag , data);		   
		    next();
		}
	},
	
	ErrorMap = {
		IS_NUll 			:   '请输入内容',
		IS_EMAIL_NULL		:	'请填写电子邮箱，可用来取回密码',
		IS_EMAIL_ERROR		:	'请检查邮箱拼写，示例：gaofen@gaofen.com',
		IS_EMAIL_EXIST		:	'此邮箱地址已被注册',
		IS_EMAIL_CHINESECHAR:	'请输入英文(a-z,A-Z)或数字（0-9）',					
		IS_EMAIL_ALLANGLE   :	'邮箱不能为全角，请切换半角',
		IS_EMAIL_ILLEGAL    :	'邮箱不能使用非法字符',
		IS_PASSWORD_NULL	:	'请填写一个方便你记忆的密码',
		IS_PASSWORD_CONFIRM	:	'请再次填写密码',
		IS_CODE_NULL		: 	'请填写如图显示的四位验证码',
		IS_CODE_ERROR		: 	'验证码不正确，请检查',
		IS_USER_NULL		:	'请填写用户名， 长度为3 到 15 个字符',
		IS_USER_ERROR1		:	'用户名不能少于 3 个字符',
		IS_USER_ERROR2		:	'用户名不能多于 15 个字符',
		IS_USER_ERROR3		:	'用户名包含敏感字符',
		IS_IllegalChar      :   '不能输入特殊字符',
		IS_LIKE_EXIST       :   '此昵称已被注册',
		IS_USER_CONFIRM		:	'抱歉，用户名已被占用，请换一个试试',
		IS_USER_NO_LEGAL	:	'用户名不合法',
		IS_USER_NO_ALLOW	:	'包含不允许注册的词语',
		IS_RESIDENCE_NULL	:	'请选择你的居住地',
		IS_IDENTITY_NULL	:	'请选择你的身份',
		IS_DEAL_CHECK		:	'请先阅读《用户协议》',
		IS_PHONE 			:   '手机号格式不对，请修正'
	};
	
	
	
	function validatiorElement(cmp, elem){
		$.extend(this, {cmp:cmp, elem:elem});
		this.init();
	};
	
	validatiorElement.prototype = {
	
		n : -1,　　//验证数数
		
		error : 0,	//错误数
				
		valiArr : [],　　
		
		inForm : true,//表单内部
		
		bev : 0,
		
		stopByOne : true, //只要一个错了就不再验证下去
		
		
		tipsCls : 'help-inline',
		
		tipsMsg : '',
		
		init : function(){
			this.valiArr = [];
			var $t = $(this.elem), vrel = $t.attr('vrel');

			
			if(vrel){
				var arr = vrel.split('|'), isF = false
				
				, self = this, vs = validators;
				
				this.$t = $t;				
				this.$row = $t.closest('.'+lineCls);
				this.$tips = this.$row.find('.'+this.tipsCls);
				//radio验证，最少选择一个
				if($t.attr('type') === 'radio'){	
					this.valiArr.push({fn:vs['radio'], data:Util.parseKnV(vrel.split('=')[1])});
					this.cmp.addElement(this, false);
					if(arr[0] == '_f'){
						this.$row.find('input[type="radio"]').change(function(e){
							self.n = -1;
							self.validate();						
						});
					}
					return;				
				}
				
				//checkbox验证，最少选择一个
				if($t.attr('type') === 'checkbox'){	
					this.valiArr.push({fn:vs['cbox'], data:Util.parseKnV(vrel.split('=')[1])});
					this.cmp.addElement(this, false);
					return;				
				}
				
				//select验证
				if($t[0].tagName.toLowerCase() === 'select'){
					this.valiArr.push({fn:vs['select'], data:Util.parseKnV(vrel.split('=')[1])});
					this.cmp.addElement(this, false);
					return;	
				}
				
				
				if(arr[0] == '_f'){
					isF = true;					
					$t.blur(function(e){
						self.n = -1;
						self.validate();						
					});
				}
				
				var start = isF?1:0;
				
				for(var i=start,len = arr.length;i<len;i++){
				
					var v = arr[i].split('='), data = {}, fn = vs[v[0]];					
					if(v.length>1){
						data = Util.parseKnV(v[1]);						
					}
					
					if(v[0] === 'tips'){
						self.tipsMsg = data['m'];
						$t.focus(function(e){
							self.hasFocus.call(self);	
							self.$tips.text(self.tipsMsg);
						});
						if(start == 0)
							$t.blur(function(e){
								self.displayTips.call(self, false);		
							});
						continue;
					};

					if(fn) this.valiArr.push({fn:fn,data:data});
				}
				
				this.cmp.addElement(this, isF);
			
			}
			

		
		}
		
		,hasFocus : function(){
			this.$row.removeClass('success').removeClass('error').addClass('hints');
			this.displayTips();
			
		}
		
		,displayTips  : function(p, msg){
			this.$tips.cssDisplay(p === false ? false : 1);
		}
		
		,validate : function(next){
			var vas = this.valiArr, len = vas.length, v = $.trim(this.$t.val());			
			this.n++;
			if(len>this.n && !(this.stopByOne && this.error > 0)){
				vas[this.n].fn.call(this, this.elem, v, vas[this.n].data, Util.bind(this.validate, this));
			}else{
				this.cmp.elemChainResult(this.error, this.elem);
				var error = this.error ? true:false;
				this.showFlag(!error, vas[this.n-1].data);
				this.n = -1;
				this.error = 0;
				if(this.bev && this.cmp.chainAll){
					this.bev = 0;
					this.cmp.validate();
				}
				
			}
				
		}
		
		,showFlag : function(isTrue, data){
			var id = this.$t.attr('id'), cmp = this.cmp, parent = '';
			if(cmp.inForm === false){
			
			}else{
				parent = this.$row;
				if(isTrue){
					parent.removeClass('hints').removeClass('error').addClass('success');
					this.$tips.text(cmp.isShowOk&&data.isOK !== 'false'? 'OK' : '');
					this.displayTips(true);
				}else{
					parent.removeClass('hints').removeClass('success').addClass('error');
					this.$tips.text(data.m);
					this.displayTips(true, data.m);
				}
				
			};
		}
		
		,report : function(isTrue, data){
			!isTrue && this.error++;
		}
	
	
	};
	
	ui.validation = function(cfg){

		$.extend(this, cfg);
		
		this.init();
	
	};
	
	ui.validation.prototype = {
	
		idx : -1,
		
		errorResult : 0,
		
		chainAll : true, //每次都全部验证，false时只验证到有错误的项
		
		velem : [],
		
		isShowOk : true, //单个成功时显示OK
		
		lock : false,
		
		felem : [],
		
		elemChainResult : function(result, elem){		
			if(result){
				this.errorResult++;
				this.onElemError(elem);
			}else{				
				this.onElemTrue(elem);
			}
			//console.log('errorResult:'+this.errorResult);
		},
		
		onElemError : function(elem){
			//console.log('errorelem:'+elem);
		},
		
		onElemTrue : function(elem){
			//console.log('trueelem:'+elem);
		},
	
		init : function(){
			this.velem = [];
			this.felem = [];
			if(!validators)
				validators = {};
			this.form = $(this.form)[0];
			var self = this;
			
			var vals = this.validators;
			for(var key in vals){
				this.reg(key, vals[key]);
			}
			
			// 执行预处理
			
			$.each(this._getElements(), function(){
				var chain = new validatiorElement(self, this);
				//chain.doPrehandling();
			});
			
			var trigFn = function(){
				if(self.lock == false){
					self.lock = true;
					self.idx = -1;
					self.errorResult = 0;
					self.validate();
				}
				return false;
			};
			if( this.trigOnSubmit )
				this.form.onsubmit = trigFn;
			if( this.trigger ){
				this.trigger = $(this.trigger)[0];
				$(this.trigger).click(function(){
				   return trigFn();
				});
			}	
			
		}
		
		,_getElements : function(){
			return  this.elements || this.form.elements;			
		}
		
		,addElement : function(elem, isF){
			this.velem.push(elem);
			isF && this.felem.push(elem);
		}
		
		,validate : function(){			
			var velem = this.velem;
			this.idx++;
			if(velem.length>this.idx){
				var _elem = velem[this.idx];
				_elem.bev = 1;
				velem[this.idx].validate();
			}else{
				this.chainResult();
			}
			
		}
		
		,chainResult : function(){
			if(this.errorResult){
				this.lock = false;
				this.onError();
			}else{
				if(this.submitBefore && this.submitBefore() === false){
					return false;
				}
				if(this.onSuccess(this.getData()) == true){
					$(this.form).submit();
				}else{
					this.lock = false;
				}
			}
		}
		
		/**
		 * 验证成功返回
		 * @return {Object} data
		 */
		,onSuccess : $.noop
		
		,getData : function(){
			var data = {}, es = this._getElements();
			for(var i=0,len = es.length;i<len;i++){				
				var elem = es[i], $e = $(elem);
				if($e.attr('type') == 'submit') break;
				data[$e.attr('name')||$e.attr('id')] = $.trim($e.val());			
			}
			return data;
		}
		
		/**
		 * 验证错误返回
		 */
		,onError : $.noop
		
		
		/**
		 * 给验证器注册事件
		 * @param {String} cmd
		 * @param {Function} validator
		 * @return {Object} this
		 */
		,reg : function(cmd, validator) {
			if(!validators)
				validators = {};
			if($.isArray(cmd)){
				for(var i=0,len=cmd.length;i<len;i++){
					this.reg.apply(this, cmd[i]);
				}
			}else validators[cmd] = validator;
			return this;
		}
		
	};
	
    G.ui.validation = G.reg('validator', ui.validation);

})(Gaofen, jQuery, window);
/**
 * @author  xiezhiwen
 * @class  Gaofen.ex.ContextMgr
 * contextMgr
 */
(function(G, $, win){
    
    G.reg('contextMgr', function(){
        
        var Util = G.util,
            doc  = document;
        
        var contextMgr = {
        
        	context : function(comp){
        
        		if(comp.contexted)
        			this.release(comp);
        
        		var q = this.q;
        		if(!q)
        			this.q = q = [];
        
        	    if(!q.length)
        	        $(doc).mousedown(this._getDocEvtHandler());
        	  
        	    q[q.length] = comp;
        	  
        	    this._setCompEvtHandler(comp, true);
        	    comp.contexted = true;
        	    if(__debug) console.log('contexted', comp);
        	},
        	
        	release : function(comp, e){
        		comp.contexted = false;
        		if( comp.onContextRelease(e) !== false ) {
            		this._setCompEvtHandler(comp, false);
            		Util.arrayRemove(this.q, comp);
        			if(!this.q.length)
        			    $(doc).unbind('mousedown', this._getDocEvtHandler());
        		} else comp.contexted = true;
        		
        		if(__debug) console.log('release context', comp);
        	},
            /*!
             * 释放所有已上下文绑定的控件，释放对于传递事件event由控件自身或控件子结点发出控件无效。
             * @param {DOMEvent} [event] 如果释放由DOM事件引发，传递该事件，如果事件由控件发出，包括子结点，则取消释放该控件。
             */
        	releaseAll : function(e){
        		var q = this.q;
        		if (q) {
        			var len = q.length;
        			if(e)
        			    var src = e.target;
        			for (var s = len - 1; s >= 0; s--) {
        				if(!src || !q[s].ancestorOf(src))
        				    this.release(q[s], e);
        			}
        		}
        	},
        	
        	_setCompEvtHandler : function(comp, set){
        		set ? comp.domEvent('mousedown', this._compEvtStopHandler)
        		    : comp.unDomEvent('mousedown', this._compEvtHandler);
        	},
        	
        	_getDocEvtHandler : function(){
        		 var hd = this.docEvtHd;
        		 if(!hd)
        		 	hd = this.docEvtHd = Util.bind(this._docHandler, this);
        		 return hd;
        	},
        
        	_releaseFollower : function(curr, e){
        		var q = this.q;
        		if(q){
        			var last = q.length - 1;
        			// not the last one itself
        			if(last !== -1 && q[last] !== curr){
        				var len = last;
        				for(;last>=0;last--){
        					if(q[last] === curr)
        						break;
        				  this.release(q[last], e);
        				}
        		  }
        		}
        	},
        	
        	// component mouse down handler & stop event
        	// scope : component	
        	_compEvtStopHandler : function(e){
        		if(e.target.nodeName == 'SELECT' || e.target.nodeName == 'INPUT')
        			return true; 
        	    contextMgr._releaseFollower(this, e);
                return false;
            },
            
        	// component mouse down handler
        	// scope : component
        	_compEvtHandler : function(e){
        		// cancel 后来者
        		contextMgr._releaseFollower(this, e);
        	},
        	
        	// document mouse down handler
        	_docHandler : function(e){
        		this.releaseAll(e);
        	}
        };

        G.ex.ContextMgr = contextMgr;
        G.reg('contextMgr', contextMgr, true);
        
        return contextMgr;
    });

})(Gaofen, jQuery, window);
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
/**
 * @author  xiezhiwen
 * @class  Gaofen.ex.Event
 * 单击事件处理
 */
(function(G, $, win) {
    var undefined, Util = G.util;
    /**
     * @property data
     * 当前处理元素的rel数据
     * @type Object
     */
    function ActionEvent(rels) {
        this.q = rels;
        // 初始状态
        this.idx = -1;
        // end pos
        this.end = this.q.length - 1;
    };

    ActionEvent.prototype = {

        prevented : undefined,

        stopPropagationed : undefined,

        /**
         * 当前DOM路径内向上查找rel属性中包含name键的数据
         <pre><code>
         // rel="w:123456"
         var wbId = e.get('w');
         </code></pre>

         * @param {String} name
         * @return {String} value
         */
        get : function(name) {
            var r = this.getRel(name);
            return r && r.data && r.data[name];
        },
        /**
         * 返回经escape函数转义后的字符串数据
         * @param {String} name
         * @return {String}
         */
        escape : function(name) {
            var v = this.get(name);
            if (v !== undefined)
                return escape(v);
        },
        /**
         * 当前DOM路径内向上查找含有rel以name为键的元素
         * <pre><code>
         // 从当前产生事件的元素开始向上查找获得包含w字段的元素
         var parent = e.getEl('w');
         </code></pre>
         * @param {String} name
         * @return {HTMLElement}
         */
        getEl : function(name) {
            var r = this.getRel(name);
            return r && r.src;
        },

        /**
         * 清空元素rel数据。
         */
        clear : function(name) {
            var wrap = name ? this.getRel(name) : this;
            var jq = $(wrap.src);
            jq.data('gf_rel', null);
            jq.attr('rel', '');
        },
        /**
         * 保存一个键值对到含有name键的元素的rel属性中，如未指定name值，数据被保存到当前触发元素，即e.src中。<br/>
         */
        save : function(k, v, name) {
            var wrap = name ? this.getRel(name) : this;
            var jq = $(wrap.src);

            // 是否存在缓存
            var rel = jq.data('gf_rel');
            if (rel) {
                rel = rel[k] = v;
            } else {
                rel = G.ex.ActionMgr.parseRel(jq.attr('rel'));
                rel[k] = v;
            }

            wrap.data = rel;
            // 更新缓存
            jq.data('gf_rel', rel);

            var serial = [];
            for (var i in rel) {
                var val = rel[i] || '';
                serial.push(i + ':' + val.replace(':', '\\:').replace(',', '\\,'));
            }
            serial = serial.join(',');
            jq.attr('rel', serial);
        },

        /**
         * 上溯DOM获得rel含有name键元素或其子元素的jQuery对象
         *@param {String} name 字段名
         * @param {Selector} [child] 可查找元素下的子元素
         * @return {jQuery}
         */
        jq : function(name, child) {
            var jq = $(this.getEl(name));
            if (child)
                jq = jq.find(child);
            return jq;
        },

        // private
        getRel : function(name) {
            var set = this.q;
            for (var i = this.idx, end = this.end; i <= end; i++) {
                var d = set[i].data;
                if (d[name] !== undefined)
                    return set[i];
            }
        },

        // private
        _next : function() {
            var nxt = this.q[++this.idx];
            // 最终状态
            if (nxt === undefined)
                this.idx = 0;
            return nxt;
        },

        // private 拷贝包括当前状态等所有数据。
        clone : function() {
            var act = new ActionEvent(this.q);
            act.idx = 0;
            return act;
        },

        /**
         * 是否终止浏览器默认操作，<b>默认为终止</b>。<br/>
         常见的处理完checkbox或radio元素的事件后，调用该方法使得元素改变选择状态。<br/>
         * @param {Boolean} prevented
         */
        preventDefault : function(set) {
            this.prevented = set;
        },
        /**
         * 是否停止浏览器的事件冒泡，<b>默认为停止</b>。
         * 对于{@link Gaofen.ui.Base}组件，在有自身的actionMgr处理的同时，也有全局或更父层action处理的情况下，
         * 可以在{@link Gaofen.ui.Base#onactiontrig}方法中调用本方法将动作事件上传到父层，这样父层的监听器就能正确处理其它事件。
         * 例如：
         * <pre>
         * <code>
         new Gaofen.ui.Base({
         view:'#panel',
         actionMgr:true,
         // 默认的onactiontrig处理后是停止事件上传的，
         // 所以要手动开启以将未处理的提交到父层处理。
         onactiontrig:function(actEvent){
         switch(actEvent.get('e')){
         case 'local' :
         // do something local stuff here.
         break;

         // or else , take other events to parents.
         default:
         e.stopPropagation(false);
         break;
         }
         }
         });
         * </code>
         * </pre>
         * @param {Boolean} stopPropagation
         * @see #preventDefault
         */
        stopPropagation : function(set) {
            this.stopPropagationed = set;
        },
        /**
         * 标记当前动作，或获得当前动作标记。
         * 常用于标记以防止动作重复触发动作。
         * @param {Boolean} locked
         * @param {String} [name] name
         *<pre><code>
         // 锁定动作元素，使得不能再触发
         e.lock(1);
         // 待请求处理后恢复
         Gaofen.request.post(data, function(){
         // 解除锁定
         e.lock(0);
         });
         </code></pre>

         */
        lock : function(set, name) {
            var k = 'gf_e_' + this.data.e;
            if (name)
                k += '_' + name;
            if (set === undefined)
                return $(this.src).data(k);
            $(this.src).data(k, set);
        }
    };

    var Event = G.ex.Event = G.reg('Event', function(cfg) {

        cfg && $.extend(this, cfg);
        if (!this.actions)
            this.actions = {};
        if (!this.filters)
            this.filters = [];

        if (this.target) {
            this.bind(this.target);
            delete this.target;
        }

    });

    Event.parseRel = function(rel) {
        if ( typeof rel === 'string')
            return Util.parseKnV(rel);
        return Util.parseKnV($(rel).attr('rel'));
    };

    Event.collectRels = function(trigSource, stopEl, cache) {
        var rels, rel, self = this;

        if (cache === undefined)
            cache = true;
        // 往上收集rel
        Util.domUp(trigSource, function(el) {
            var jq = $(el);

            if (cache) {
                rel = jq.data('gf_rel');
                if (!rel) {
                    rel = jq.attr('rel');
                    if (rel) {
                        rel = {
                            src : el,
                            data : self.parseRel(rel)
                        };
                        jq.data('gf_rel', rel);
                    }
                }
            } else {
                rel = jq.attr('rel');
                if (rel)
                    rel = {
                        src : el,
                        data : self.parseRel(rel)
                    };
            }

            if (rel) {
                if (!rels)
                    rels = [];
                rels[rels.length] = rel;
            }

        }, stopEl);

        return rels;
    };

    var globalFilters = [];

    var extEvent = {

        bind : function(select, evt) {
            var self = this;
            if (select) {
                var js = select.jquery ? select : $(select);
                js.bind(evt || 'click', function(e) {
                    var rels = G.ex.Event.collectRels(e.target, this, this.cacheNodeData);
                    rels && self.fireRels(rels, e);
                });
            }
        },
        fireRels : function(rels, evt) {
            var er = new ActionEvent(rels);
            er.evt = evt;
            var rel, data, hs = globalFilters.length, hg = this.filters.length, handled, prevented, stopPropagationed;

            while ( rel = er._next()) {
                data = rel.data;
                if (data.e) {
                    er.src = rel.src;
                    er.data = data;
                    if (er.lock()) {
                        if (__debug)
                            console.warn('action  has been locked for resubmiting');
                        handled = true;
                        stopPropagationed = true;
                        prevented = true;
                        return;
                    }
                    var act = this.actions[data.e];
                    if (hs) {
                        handled = true;
                        if (this._fireArray(globalFilters, er, act) === false) {
                            stopPropagationed = er.stopPropagationed;
                            prevented = er.prevented;
                            break;
                        }
                    }

                    if (hg) {
                        handled = true;
                        if (this._fireArray(this.filters, er, act) === false) {
                            break;
                        }
                    }
                    stopPropagationed = er.stopPropagationed;
                    prevented = er.prevented;
                    if (act) {
                        // clone e
                        var hdE = er.clone();
                        hdE.src = er.src;
                        hdE.data = data;
                        hdE.evt = evt;
                        if (__debug)
                            console.log('act e:', hdE);
                        if (!handled)
                            handled = true;
                        if (act.h.call(this, hdE) === false) {
                            if (hdE.stopPropagationed !== undefined)
                                stopPropagationed = hdE.stopPropagationed;
                            if (hdE.prevented !== undefined)
                                prevented = hdE.prevented;
                            break;
                        }

                        if (hdE.stopPropagationed !== undefined)
                            stopPropagationed = hdE.stopPropagationed;
                        if (hdE.prevented !== undefined)
                            prevented = hdE.prevented;
                    }
                } else{
                    //console.log('null e:' + data);
				}
            }

            if (evt && handled) {
                // we defaultly preventDefault and stopPropagation
                if (prevented === undefined)
                    prevented = true;
                if (stopPropagationed === undefined)
                    stopPropagationed = true;

                if (prevented)
                    evt.preventDefault();

                if (stopPropagationed)
                    evt.stopPropagation();
            }

        },
        addFilter : function(filter, global) {
            global ? globalFilters.push(filter) : this.filters.push(filter);
            return this;
        },
        // 如果未注册action:，act有可能为空，所以act应用时要作空检查
        
        _fireArray : function(gs, e, act) {
            for (var i = 0, len = gs.length; i < len; i++)
                if (gs[i].call(this, e, act) === false)
                    return false;
        },
        reg : function(act, handler, cfg) {
            var d = {
                n : act,
                h : handler
            };
            if (cfg)
                $.extend(d, cfg);

            this.actions[act] = d;
            return this;
        }
    };

    $.extend(G.ex.Event.prototype, extEvent);

    G.reg('action', G.use('Event'));

})(Gaofen, jQuery, window);
/**
 * @author   xiezhiwen
 * @class Gaofen.ex.Listener
 * 全局事件广播
 * <code><pre>
   Gaofen.on('listen', function(){
        console.log(arguments);
    });
    
    Gaofen.fire('listen', {arg:1});
   </pre></code>
 */


(function(G, $, win){

    var R = G.util.arrayRemove,
        Listener = function(){};
       
    Listener.prototype = {
    
      fire : function(eid){

      	if(__debug) {console.log('发送:%o',arguments);}
      
      	if(this.events){
      		
      		var handlers = this.events[eid];
      		
      		if(handlers){
      			var fnArgs = $.makeArray(arguments),
      			    argLen, ret, i, len, oHand;
      			// remove eid the first argument
      			fnArgs.shift();
    			argLen=fnArgs.length;
            
            handlers._evtLocked = true;
            
      			for(i=0,len=handlers.length;i<len;i++){
      				oHand = handlers[i];
      				
      				// 标记已删除
      				if( oHand.removed)
      				   continue;
      				// 如果注册处理中存在参数args,追加到当前参数列尾
      				if(oHand.args)
      				   fnArgs[argLen] = oHand.args;
      
      				// 如果注册处理中存在this,应用this调用处理函数
      				ret = (oHand.ds)?oHand.cb.apply(oHand.ds,fnArgs):oHand.cb.apply(this,fnArgs);
      				
      				//如果某个处理回调返回false,取消后续处理
      				if(ret === false)
      				   break;
      			}
      			
      			handlers._evtLocked = false;
      		}
      	}
      	//返回最后一个处理的函数执行结果
      	return ret;
      },
      
      on   :  function(eid,callback,ds,objArgs){
          if(!eid || !callback){
          	  if(__debug) console.trace();
              throw ('eid or callback can not be null');
          }
    
          
          if(!this.events)
            this.events = {};
          var hs = this.events[eid];
          if(!hs)
              hs = this.events[eid] = [];
          hs[hs.length] = {
              cb:callback,
              ds:ds,
              args:objArgs
          };
          return this;
      },
      
      un : function(eid,callback){
          if(!this.events)
            return this;
          
          if(callback === undefined){
            delete this.events[eid];
            return this;
          }
      
          var handlers = this.events[eid];
      
          if(handlers){
              // 产生迭代修改冲突，将复制新数组。
              if(handlers._evtLocked) {
                 handlers = this.events[eid] = handlers.slice(0);
              }
              
              for(var i=0;i<handlers.length;i++){
                  var oHand = handlers[i];
                  if(oHand.cb == callback){
                      R(handlers, i);
                      // 标记删除
                      oHand.removed = true;
                      break;
                  }
              }
          }
          return this;
      },
      
      fireOnce : function(eid){
        var r = this.fire.apply(this, arguments);
        this.un(eid);
        return r;
      }
    };

    G.ex.Listener = Listener;

    $.extend(G, Listener.prototype);

})(Gaofen, jQuery, window);	
/**
 * @author : xiezhiwen
 * jquery扩展插件
 */

(function(G, $, win){
	var FALSE = false,
		TRUE = true,
		NULL = null,
		toInt = parseInt,
		isIE6 = !!($.browser.msie && $.browser.version == '6.0');


	$.extend($.fn, {
		   /**
			* 文字放大渐隐
			*@param {Number} num 增加数值
			*@param {Number} times 放大倍数
			*@return {jQuery}
			*/
			zoomText: function(num, times) {
				this.each(function() {
					var
						$clone,
						$el = $(this),
						offset = $el.offset(),
						text = $el.text();
						
					times = isNaN(times) ? 2 : times;
					
					if(!isNaN(+text)) {
						text = +text + (num || 1);
					}
					
					$el.text(text);
					
					$clone = $el.clone()
						.attr('id', '')
						.css({
							'position': 'absolute',
							'top': offset.top,
							'left': offset.left,
							'font': $el.css('font'),
							'color': $el.css('color')
						})
						.appendTo($(document.body));
					
					var fontsize = times * parseInt($el.css('font-size'));
					
					$clone.animate({
						'font-size': fontsize,
						'top': offset.top - ($el.height()/4),
						'left': offset.left - ($el.width()/2),
						'opacity': 0.1
					}, {
						'duration': 300,
						'complete': function() {
							$clone.remove();
						}
					});
					
				});
				
				return this;
			},

			/**
			 * 文本输入框加上聚焦清空，失焦停留提示功能。<br/>
			 如果利用{@link gaofen.ui.ValidationMgr}类作表单验证，制作类似功能时不必直接采用该方法，
			 Validator类提供一系列验证器无需写代码即可轻松实现，详见该类的各种验证器。<br/>
			 如果当前文本框已经过{@link gaofen.ex.SelectionHolder}实例处理，
			 则focusText方法会利用当前{@link gaofen.ex.SelectionHolder}实例输出文本。
			 * @param {String} hoverText 停留提示文字
			 * @param {String} [focusStyle] 修饰样式类
			 * @param {DomSelector} [cssNode]
			 * @param {Boolean} [removeOnFocus] 如果为false，当聚焦后添加css类，否则移除css类
			  <pre><code>
                $('#id').focusText('这里输入用户名', 'focusStyle');
              </code></pre>
			 */
			focusText : function(texts, css, cssNode, operate,handle){
			    this.each(function(i){
			        $(this).data('defaultText', $.isArray(texts) ? texts[i] : texts)
                    .focus(function(){
                        var text = $(this).data('defaultText');
			            if(this.value === text){
			                var selHolder = $(this).data('xwb_selholder');
			                if(selHolder)
			                    selHolder.setText('');
			                else this.value = '';
			            }
			            if(css){
							switch(operate?+operate:0){
								case 1: $(cssNode||this).removeClass(css);break;
								case 0:$(cssNode||this).addClass(css);break;
								case 3: $(cssNode||this).addClass(css);break;
								default:$.merge($(cssNode),$(this)).addClass(css);break;
							}
			            }
			        })
			        .blur(function(){
                        var text = $(this).data('defaultText');
                        
			            if($.trim(this.value) === ''){
			                var selHolder = $(this).data('xwb_selholder');
			                if(selHolder)
			                    selHolder.setText(text);
			                else this.value = text;
			            } else{
							if(handle) {
								switch(operate?+operate:0){
									case 1: 
									case 0:return;
									default:$(cssNode).removeClass(css);return;
								}
							}
						}
			            if(css){
							switch(operate?+operate:0){
								case 1: $(cssNode||this).addClass(css);break;
								case 0:$(cssNode||this).removeClass(css); break;
								case 3: $(cssNode||this).removeClass(css);break;
								default:$.merge($(cssNode),$(this)).removeClass(css);break;
							}
			            }
			        });
			    });
                
                return this;
			},
			
			/**
			 * 方法使用'hidden'样式控制元素的显示或隐藏状态。
			 * 如果无参数，返回当前元素hidden样式的状态，否则利用'hidden'CSS类进行隐藏或显示元素。
			  <pre><code>
			    // 获得显示状态
			    if ($('#id').cssDisplay()) {}
			    // 显示
			    $('#id').cssDisplay(true);
             </code></pre>
             *@return {Boolean|jQuery}
			 */
			cssDisplay : function(b){
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
			        }
			        
			        else {
			            this.each(function(){
    			            if(b) $(this).removeClass('hidden');
			                else $(this).addClass('hidden');
			            });
			        }
			    }
			    return this;
			},
			
            /**
             * 检查是否含有某个样式,如果有,添加或删除该样式.
             * @param {String} css 样式名称
             * @param {Boolean} addOrRemove true 时添加样式，false时移除该样式
             * @return {jQuery} this
             */
			checkClass : function(cs, b){
			    if(cs){
    			    this.each(function(){
    			        var jq = $(this);
            			var hc = jq.hasClass(cs);
            			if(b){
            				if(!hc)
            				jq.addClass(cs);
            			}else if(hc){
            				jq.removeClass(cs);
            			}			        
    			    });
			    }
        		return this;
			},
			
            /**
            * 替换view元素样式类.<br/>
            * <code>comp.switchClass('mouseoverCss', 'mouseoutCss');</code><br/>
            * @param {String} oldSty 已存在的CSS类名
            * @param {String} newSty 新的CSS类名
            * @return {Object} this
            */
              switchClass: function(oldSty, newSty) {
                    this.each(function(){
                        var jq = $(this);
                        jq.removeClass(oldSty);
                        jq.addClass(newSty);
                    });
                    return this;
              },
              
              /**
               * 获得相对于viewport的位置，只适用于单个元素
               * @return {left, top}
               */
              absolutePos : function(){
                    var off = this.offset(), doc = $(document);
                    var st  = doc.scrollTop(), sl = doc.scrollLeft();
                    off.left -= sl;
                    off.top -= st;
                    return off;
              },
              
              slideMenu : function(slideLayer, hoverCs){
                this.each(function(){
                    (function(jq){
                        var layer = jq.find(slideLayer);
                        var setTimer, clsTimer;
                        function slidedown(){
                            layer.show().cssDisplay(true);
                            if(hoverCs)
                                jq.addClass(hoverCs);
                        }
                        
                        function slideup(){
                            if(hoverCs)
                                jq.removeClass(hoverCs);
                            layer.cssDisplay(false);
                        }
                        
                        function clear() { 
                            if(setTimer){
                                clearTimeout(setTimer);
                                setTimer = false;
                            }
                            clsTimer = setTimeout(slideup, 80);
                        }
                        
                        function set(){
                            if(clsTimer){
                                clearTimeout(clsTimer);
                                clsTimer = false;
                            }
                            setTimer = setTimeout(slidedown, 100);
                        }
                        
                        jq.hover(set, clear);
                    })($(this));
                });
              },

		/**
	    * 截取内容
	    *@param {Number} num  位置，默认10
        *@param {Boolean} hasFace  是否显示表情图片，否为文字代替
        *@param {String} postfix  后缀
        *@return jQuery
	    */
        substrText: function(num, hasFace, postfix) {
            var re = new RegExp('(?:<a.*?>.*?<\\/a>)|(?:<img.*?>)|.','gi');
            
	        this.each(function() {
                var 
                    cache = [],
                    postfix = postfix || '...',
                    text = this.innerHTML,
                    match = text.match(re);
                    
                num = num||10;
                    
                if(match && match.length > num) {
                    
                    match = match.slice(0, num).join('');

                    text = hasFace ? match : match.replace(/<img.*?title=\"(.*?)\".*?>/gi, '[$1]');
                    
                    $(this).html(text+postfix);
                }
	        });
            
            return this;
        },

		/**
	    * IE6修复PNG图片
	    *@return jQuery
	    */
        fixPng: function() {			

            if(isIE6) {
            	var fixFn = function() {
                    if(this.tagName == 'IMG') {
                        var $img = $('<span></span>').css({
                            width: this.offsetWidth,
                            height: this.offsetHeight,
                            display: 'inline-block'
                        });
                        $img[0].style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+this.src+'", sizingMethod="crop")';                        
                        $(this).replaceWith($img);
                    }
                }
                this.each(function(){
                	if(this.complete){
                		fixFn.call(this);
                	} else {
                		this.onload = fixFn ;
                	}
                });
            }
            
            return this;
        },
/*
		makeScroll : function(opt){
            var scrollor = this[0];
            var tid,cid;
            var dir = 1;
            var nxtBtn = $(opt.nextBtn);
            var prevBtn = $(opt.prevBtn),
				dirPar = {'left':['offsetWidth','scrollLeft','width','outerWidth','scrollWidth'],'top':['offsetHeight','scrollTop','height','outerHeight','scrollheight']}[opt.dir || 'left'];
            
            function updateStatus(){
                if(opt.ldisabledCs){
                    var show = scrollor[dirPar[4]] > scrollor[dirPar[0]] || this.showState;
                    prevBtn.cssDisplay(show);
                    nxtBtn.cssDisplay(show);
                    prevBtn.checkClass(opt.ldisabledCs, scrollor[dirPar[1]]==0);
                    nxtBtn.checkClass(opt.rdisabledCs, scrollor[dirPar[1]] + scrollor[dirPar[0]] === scrollor[dirPar[0]]);
                }
            }
            
            opt.pace = opt.pace||25;
            
            function timer(){
                var nxt = scrollor[dirPar[1]] + opt.pace * dir;
                if(nxt<0)
                    nxt = 0;
                if(nxt>scrollor[dirPar[2]])
                    nxt = scrollor[dirPar[2]];

                scrollor[dirPar[1]] = nxt;
                updateStatus();
                tid = setTimeout(arguments.callee, opt.interval||20);
            }
            
            var clicked;
            function startRoll(){
                clicked = false;
                timer();
            }
            
            function leftMousedown(){
                clicked = true;
                dir = -1;
                mid = setTimeout(startRoll, 200);
                return false;
            }
            
            function rightMousedown(){
                clicked = true;
                dir = 1;
                mid = setTimeout(startRoll, 200);
                return false;             
            }
            
            function mouseup(){
                if(clicked){
                    var nxt = scrollor[dirPar[1]] + opt.pace * dir * 4;
                    if(nxt<0)
                        nxt = 0;
                    if(nxt>scrollor[dirPar[2]])
                        nxt = scrollor[dirPar[2]];
                    
					var tmp = {};tmp[dirPar[1]] = nxt;
                    $(scrollor).animate(
                        tmp, 'fast', 
                        function(){ updateStatus();}
                    );
                }
                
                clearTimeout(tid);
                clearTimeout(mid);
            }
            
            if(opt.nextBtn)
                $(opt.nextBtn).mousedown(rightMousedown).mouseup(mouseup).click(function(){return false;});
            
            if(opt.prevBtn)
                $(opt.prevBtn).mousedown(leftMousedown).mouseup(mouseup).click(function(){return false;});
							
			if(opt.moveScorll) {
				nxtBtn.hover(rightMousedown,mouseup);
				prevBtn.hover(leftMousedown,mouseup);
			}
            var offw = 0;
            if(opt.items){
                $(scrollor).find(opt.items).each(function(){
                    offw+=$(this)[dirPar[3]](true);
                });
                $(scrollor).find(opt.ct||':first-child').css(dirPar[2], offw);
            }
            
            updateStatus();
            
            return opt;
        }
*/		
		/**
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
        slideScroll:function(param){
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
			
			if(turnLeft){//左右按钮滚动
				turnLeft.click(function(){
					if(runLock) return;
					clearInterval(timer);
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
		
	   //整块的循环移动
	   //Count 一次移动子元素数量
	   //delay 移动间隔时间
	   //animateTime 动画执行时间
	   /*
	   ,scrollMass : function(Count,delay,animateTime){
			var parent =this,
				length = parent.children().length,
				timer,
				delay = delay,
				tmp = parent.children()[0].offsetWidth * Count,
				p = false;
		   if (length <= Count) {
			   return this; 
		   }
		   function scrollNext(){
				parent.animate({marginLeft:-tmp},animateTime?animateTime:1000,function(){
					if( timer !=0 ){
						parent.css('marginLeft',0);
						parent.append( parent.children(':lt(' +  Count + ')') );
					}
					if( p ) return;
					start();
				});
		   };
		   
		   function start(){ timer = window.setTimeout(scrollNext,delay); }
		   this.hover(function(){ 
				p = true ;clearTimeout(timer); 
		   },function(){ 
				p = false;start();
		   });
		   start();
		   return this;
	   }
       
       //向父级寻找符合selector的首个元素, 
       //selector 可以是jquery选择器 或 函数(如果找到返回dom，否则false|null|undefined)
       , parentFind : function(selector, end) {
            end = end || doc.body;
            var isStr = typeof selector === 'string';
            var el = $(this).get(0);
            
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
*/	   
	   //以宽度或者高度为优先考虑条件,对图片进行缩放后再为其高度或者宽度进行居中处理
	   , imageToCenter : function(opt){
			var toProperty = opt.toProperty||'width' //缩放优先属性(width/height)
			, toLocation = toProperty == 'width' ? 'marginTop' : 'marginLeft'
			, zoom = opt.zoom //缩放值
			, ow = ''
			, oh = ''
			, lastVal     //最终值
			, instead = opt.instead     //相反位置的值   
			, image = new Image()
			, self = this
			, setImage = function(){		
				oh = image.height;
				ow = image.width;
				if(toProperty == 'width'){
					lastVal = oh;
					if(zoom < ow) 
						lastVal = oh * zoom/ow;
					else
						this.css((toProperty == 'width' ? 'marginLeft' : 'marginTop'), (zoom-ow)/2);
						
					this.css({'width': zoom < ow ? zoom : ow, 'height':lastVal});
				}
				if(toProperty == 'height'){
					lastVal = ow;
					if(zoom < oh) 
						lastVal = ow * zoom/oh;
					else
						this.css((toProperty == 'width' ? 'marginLeft' : 'marginTop'), (zoom-oh)/2);
					this.css({'height': zoom < oh ? zoom : oh, 'width':lastVal});
				}

				if(lastVal > instead){
					this.css(toLocation, -(lastVal - instead)/2);
				}					
			}	
			if($.browser.msie){
				image.onreadystatechange =function(){ 
					if(this.readyState == "complete"){ 					    
						setImage.call(self);
					} 
				}
			}else{
				image.onload=function(){ 
					if(image.complete==true){ 
						setImage.call(self);
					} 
				}
			} 
			image.src = this.attr('src');	
	   }
	});
	
	$.easing.cubicOut = function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	}

	$.cookie = function(name, value, options) {
		if (typeof value != 'undefined') { // name and value given, set cookie
			options = options || {};
			if (value === null) {
				value = '';
				options.expires = -1;
			}
			var expires = '';
			if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
				var date;
				if (typeof options.expires == 'number') {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				} else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
			}
			var path = options.path ? '; path=' + options.path : '';
			var domain = options.domain ? '; domain=' + options.domain : '';
			var secure = options.secure ? '; secure' : '';
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		} else { // only name given, get cookie
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
	};	

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
 
})(Gaofen, jQuery, window);	
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
				items = this.items || view.find(this.target);

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
//			, footers : 'win_module'
			, closeable: true
			, destroyOnClose : true
			, onViewReady : function(){
				var self = this, jf = this.jq('#form-logins'), inputs = jf.find('input[class="input-text"]'), 
					form_rows = jf.find('.form-row'), msg = this.jq('#msg'), 
					jqun = inputs.eq(0), jqpwd = inputs.eq(1),
					focusCss = 'hints', errorCss = 'error', successCss = 'success',
					lock = false;
				function setFormRowCss(dom, css){
					setSuccess($(dom).closest('.form-row').attr('class', 'form-row '+css), css === successCss);
				}
				function setSuccess(dom, p){
					dom.find('.help-inline').cssDisplay(p);
				}
				function vil(){
					if($.trim(jqun.val()) === ''){
						jqun.focus();
						return false;
					}
					if($.trim(jqpwd.val()) === ''){
						jqpwd.focus();
						return false;
					}
					return true;
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
					if(e.keyCode === 13) self.jq('#lg').click();
				});
				var jqlg = this.jq('#lg').click(function(e){
					if(lock || !vil())return;
					lock = true;
					self.jq('#lgbtn').cssDisplay(0);
					self.jq('#lging').cssDisplay(1);	
					msg.cssDisplay(0);
					var url = 'http://'+G.PD.get('host')+'/ajax/login';	
					Req.postReq(url, {
						username : $.trim(jqun.val()),
						password : $.trim(jqpwd.val()),
						save_me : self.jq('#rem').prop('checked') ? 1 : 0
					},function(r){
						lock = false;
						if(r.isOk()){
							//跟踪代码SEO
							FN.seoFollow({'event': 'signin'});							
							$("body").append(r.getData().data);
							setInterval(function(){
								window.location.reload();
							},3000);
						}else{
							self.jq('#lgbtn').cssDisplay(1);
							self.jq('#lging').cssDisplay(0);
							jf.find('#register').attr({"title":"登录"}).prop('disabled', false).html("登录");
							msg.cssDisplay(1).html(r.getError());										
						}
					});
				});
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
	FN.gaofen_app_cityMenu = function(citystr, view){
		var siteUrl = G.PD.get('siteUrl'), sites = [];
		if(!siteUrl || view.length === 0) return;
		if('gz' in siteUrl){
			sites.push('<a href="'+siteUrl.gz+'">广州站</a>');
		}else{
			sites.push('<span>广州站</span>');
		}		
		if('sz' in siteUrl){
			sites.push('<a href="'+siteUrl.sz+'">深圳站</a>');
		}else{
			sites.push('<span>深圳站</span>');
		}
		view.append(T.parse(T.get('ChangeCity'), {sites : sites.join('')}));
		
		var triggerCity = $('#triggerCity', view), cityDrop = $('#cityDrop', view), $parent = triggerCity.parent();
		//$('body').click(function(){
		//	cityDrop.hide();
		//});
		 $parent.mouseleave(function(e){
			cityDrop.hide();
		 });
		triggerCity.mouseenter(function(e){
			e.preventDefault();
			cityDrop.show();
		});
		/*
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
			*/
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
					$('#search_form').submit();
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
		return rpbox;
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
			adClass = '.ad',
			adItemHeight = 90,
			insertedAd = 0,
			scaleObj = {
				//'1' : {height:270, width : 748, scale : 0.27, mb : -780},
				//'2' : {height:410, width : 748, scale : 0.4, mb : -640},
				//'3' : {height:540, width : 748, scale : 0.52, mb : -510},
				//'4' : {height:665, width : 748, scale : 0.64, mb : -385},
				//'5' : {height:790, width : 748, scale : 0.76, mb : -260},
				//'6' : {height:910, width : 748, scale : 0.87, mb : -140},
				'7' : {height:1050, width : 748, scale : 1.0133, mb : 27, ieScale:1},
				'8' : {height:1240, width : 748, scale : 1.1, mb : 120},
				'9' : {height:1300, width : 748, scale : 1.23, mb : 260},
				'10' : {height:1440, width : 748, scale : 1.35, mb : 390},
				'11' : {height:1560, width : 748, scale : 1.47, mb : 510},
				'19' : {height:1382, width : 978, scale : 1.3075, mb : 338, ieScale:1.2894}
			};

		var expr = isImg ? '.page-ie' : '.pd',
			pageAd = PD.get('pagead');
		
		if(pageAd){
			pageAd = pageAd.split(',');
		}
		//pageAd = '';
		var _self = {
		
			regetPD : function(pv){
				topPx = pv || view.children(expr).eq(0).height();
			},
		
			getChild : function(){
				return childs; 
			},
			
			setPage : function(page){
				var cv = viewControl, ipt = cv.find('input').val(page);
				this.setPadBtn();
			},
			
			setPadBtn : function(){
				if(def.curPage == '1'){
					btns.eq(0).addClass(prevDisabled);
				}else{
					btns.eq(0).removeClass(prevDisabled);
				}
				if(def.curPage == pages){
					btns.eq(1).addClass(nextDisabled);
				}else{
					btns.eq(1).removeClass(nextDisabled);
				}
			},
			
			compare : function(st){
				var obj = scaleObj[scale], _Ph = Ph + obj['mb'], childs = view.children(expr), len = childs.length,
					page = null;
				for(var i=0;i<len;i++){
					var child = childs.eq(i);
					if(st < child.offset().top){
						var page = i;
						if(page === 0){							
							page = 1;
						}
						break;
					}
				}
				if(page === null){
					page = len > pages ? pages : len;
				}
				return page;
			},
			
			run : function(st){
				def.curPage = this.compare(st);
				//this.setPage(def.curPage = this.compare(st));
				//this.setPadBtn(st);				
				if(!loading){
					if(def.curPage >= view.children(expr).length){
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
				//var st = this.getScrollTop();
				if(direction === 'next'){
					def.curPage++;
				}else{
					if(def.curPage>1)
						def.curPage--;
				}
				//this.setPage(def.curPage);
				this.goToPage(def.curPage);
				//jqWin.scrollTop(direction === 'next' ? st + padHg - 60 : st - padHg + 60);		
			},
			//scrollTop到某一页
			goToPage : function(toPage){
				var childs = view.children(expr);
				jqWin.scrollTop(childs.eq(toPage - 1).offset().top+10);
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
				if(!isImg){
					if(browser.mozilla){
						_childs.css({'-moz-transform' : 'scale('+obj.scale+')', 'marginBottom' : obj.mb, 'transformOrigin': '50% 0px 0px'});
					}
					if(browser.chrome || browser.safari){
						_childs.css({'-webkit-transform' : 'scale('+obj.scale+')', 'marginBottom' : obj.mb, 'transformOrigin': '50% 0px 0px'});
					}
					if(browser.opera){
						_childs.css({'-o-transform' : 'scale('+obj.scale+')', 'marginBottom' : obj.mb, 'transformOrigin': '50% 0px 0px'});
					}
				}
				/*
				if(browser.msie){
					if(parseInt(browser.version)>8){
						_childs.css({'-ms-transform' : 'scale('+obj.ieScale+')', 'marginBottom' : obj.mb, 'transformOrigin': '50% 0px 0px'});
					}else{
						_childs.css({'zoom' : obj.ieScale});
					}
				}
				*/
				//Ph = obj.height;
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
				var p = def.curPage;
				if(pages <= p) return;//已到最后一页
				var url = pageList[p], self = this;			
				loading = true;
				this.createLoading();
				this.beforeGetPage();
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
			
			//判断是否需要插入广告
			beforeGetPage : function(p){
				if(pageAd){
					if($.inArray((p || def.curPage+1)+'',pageAd)>-1){
						var ad = callad('ziliao_showview_ad'+(this.getADs().length+1), '', 1);
						if(ad){
							if(p){
								$("<div class='picture picture-h70'>"+ad+"</div>").insertBefore(view.children(expr).eq(p-1));
							}else{
								$("<div class='picture picture-h70'>"+ad+"</div>").insertBefore(view.find('#ld'));
							}
						}
					}
				}
			},
			
			getADs : function(){//获取当前插入的广告数
				return view.find('.picture');
			},
			
			insert : function(html){
				if(!html){
					html = view.children(expr).eq(0).clone(true);					
				}
				var _html = $(html);
				view.find('#ld').replaceWith(_html);
				//var nh = $(html).appendTo(def.view);
				childs = view.children(expr);
				if(fulling)
					this.setScale({p:'boost', _scale :19, child : _html});
				else 
					this.setScale({p:'boost', _scale :scale});
				loading = false;
				//this.setPadBtn(this.getScrollTop());
			},

			createFull : function(){
				fulling = true;				
				var _sl = this.getScrollTop() - topPx - (def.curPage-1) * scaleObj['7'].mb;	
				$('body').addClass('fullscreen');			
				this.setView($('#readercontainerfull').append($('#readcontainerparent').html()).find('#pageContain'));
				
				childs = view.children(expr);
				tmpScale = scale;
				this.setScale({p:'boost', _scale :19});
				$('#readcontainerparent').html('');
				setTimeout(function(){jqWin.scrollTop(_sl*1.29)},0);
				//_self.regetPD(0);//重新计算离顶部高度
				//topPx = 0;
			},
			clearFull : function(){	
				fulling = false;
				var _sl = this.getScrollTop() + topPx + 143, readercontainerfull = $('#readercontainerfull');	
				//var _sl = this.getScrollTop();	
				$('body').removeClass('fullscreen');		
				this.setView($('#readcontainerparent').append(readercontainerfull.html()).find('#pageContain'));
				childs = view.children(expr);
				this.setScale({p:'boost', _scale :tmpScale});				
				readercontainerfull.html('');
				setTimeout(function(){jqWin.scrollTop(_sl/1.29)},0);
				//_self.regetPD();//重新计算离顶部高度
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
				//this.setPadBtn(st);
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
				var v = parseInt($.trim(this.value)), childs = view.children(expr), total = childs.length;
				if(v > total) this.value = v = total;
				if(v == 0) this.value = v = 1;
				_self.goToPage(v);
			}
		})
		$('#gotop').css('zIndex',10000);
		$(window).scroll();
		_self.beforeGetPage(1);//第一页前插入广告		
		_self.setScale({p:'boost', _scale :scale});
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
	
	
	//设为首页只有IE适用
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
	
	//设置详细页在线人数
	FN.onlineUsers = function(){
		var jqonline = $('#onlineMath');
		if(jqonline.length === 0) return;
		var bigMath = 125800, base = 100, math = Math.ceil(Math.random()*base),
			url = 'http://szbbs.gaofen.com';
		math += bigMath;
		/*暂时统一入口
		switch(location.host){
			case 'xsc.gaofen.com' :
				url += 'forum-45-1.html';//小升初				
			break;
			case 'zhongkao.gaofen.com' :
				url += 'forum-49-1.html';//中考
			break;
			case 'gaokao.gaofen.com' :
				url += 'forum-53-1.html';//高考考
			break;
		};
		*/
		jqonline.attr('href', url).text('[当前'+math+'位家长在线讨论]');;
	};
	
		//购买时要检测帐号是否已激活
	FN.avticeAccount  = function(fn, e){
		e && e.lock(1);
		Req.q('http://'+G.PD.get('host')+'/ajax/checkEmailStatus', {}, function(active){
			e && e.lock(0);
			if(active.isOk()){
				var adata = active.getData();
				if(adata.emailstatus == '1'){
					fn && fn(); 
					return;
				}
				var activeBox = G.use('Modal',{
					appendTo : 'body',
					mask : true,
					title : '激活邮箱',
					cs : 'modal-activate',
					contentHtml : 'activate',
					closeable: true,
					destroyOnClose : true,
					destroy : function(){
						clearTimeout(this.boxTime);
						G.ui.Modal.prototype.destroy.call(this);
					},
					mail : adata.email,
					toMail : adata.emaillink,
					boxTimer : null,
					onViewReady : function(){
						var alock = false, jqmsg = this.jq('#msg'), self = this;;								
						$('#send').click(function(e){
							e.preventDefault();
							if(alock) return;
							alock = true, timer = 60*2*1000;
							jqmsg.attr('class', 'loading-mini').text('发送中...');
							var url = 'http://my.gaofen.com/ajax/cse';
							//if(G.PD.get('host').indexOf('dev')>-1 ) url = 'http://dev.login.gaofen.com/ajax/cse';
							Req.q(url, {email:adata.email}, function(act){
								var aresult = act.getData();
								if(act.isOk()){
									jqmsg.attr('class', 'icon-success').text('已发送');
									self.boxTimer = setTimeout(function(){
										activeBox.close();
									},3000);
								}else{
									alock = false;									
									//if(act.getCode() === '10000'){
									//	jqmsg.attr('class', 'icon-error').text('请在2分钟后重新发送');
									//}else{
										jqmsg.attr('class', 'icon-error').text(act.getError());
									//}
								}
								jqmsg.cssDisplay(1);
							});
						});					
					}						
				}).play(1);
			}else{

			}
		});
	
	};
	
	
	//移动端下载、购买时提示（有些移动端下载不了）
	G.reg('MobileDowm', function(opt){		
		var param = $.extend({
						appendTo : 'body',
						mask : true,
						title : '提示',
						btnMsg : '继续购买',
						cs : 'modal-tips modal-tips-mobile',
						contentHtml : 'mobileModal',
						closeable: true,
						destroyOnClose : true,
						onViewReady : function(){
							
							this.jq('#btnMsg').click(function(e){
								e.preventDefault();
								opt.fn && opt.fn();
								box.close();
							});
							
							this.jq('#cancel').click(function(e){
								e.preventDefault();
								box.close();
							});
						}
		}, opt);

		var box = G.use('Modal', param);
		
		return box;			
	})
	
    
})(Gaofen, jQuery, window);
/**
 * @author   xiezhiwen
 * 点击事件代理
 */

(function(G, $, win){
	
	var mbox = G.ui.mbox,
		Req = G.request,
		T = G.tpl,
		PD = G.PD,
		FN = G.FN;

	G.use('action').addFilter(function( e, act){//全站过滤
        if(  e.get('na') || ( act && act.na ) )
            return true;
		else{
			if($.cookie('gaofen_user') === null){
				G.use('Login');
				return false;
			}else{
				return true;
			}
		}
	}).reg('join', function(e){//我要报名 
		var id = e.get('id'), type = e.get('type'), title = '报名讲座', url = '/ajax/joinLectures', host = G.PD.get('host');		
		if(type === 'shiting'){//参加视听
			title = '参加视听',
			url = '/ajax/joinCourse';
		}
		url = 'http://'+host+url;
		G.use('Modal', {
			appendTo : 'body'
			, mask : true
			, title : title
			, cs : 'modal-apply'
			, contentHtml : 'win_lecture'
			, closeable: true
			, destroyOnClose : true
			, beforeHide : function(){
				if(this.uploader){
					this.uploader = null;
					try{
						this.uploadForm.remove();
					}catch(e){
						if(__debug) console.log('error to delete form');
					}				
				}
			}
			, onViewReady : function(){
				var jf = this.jq('#joinInfo'), view = this.jq(), that = this;
				this.jq('#close').click(function(){
					that.close();
				});
				var cc = e.get('cc'), elements = jf.find('input');
				if(!cc){
					this.jq('#changci').remove();					
				}else{//创建场次。。。。
					var opts = ['<option value="">请选择场次</option>'], vs = cc.split('|');
					$.each(vs, function(){
						opts.push('<option value="'+this+'">'+this+'</option>');
					});
					elements.push(this.jq('#ccselect'));
					this.jq('#ccselect').html(opts.join(''));
					this.jq().height(340);
				}
				G.use('validator', {
					form : jf
					, trigger : '#lecturebtn'
					, elements : elements
					, onSuccess : function(data){
						var _number = jf.find('#select01').val(), uf;
						if(!that.uploader){
							var changci = '';
							if(cc){
								var v = that.jq("#ccselect").val();
								changci = '<input type="text" name="changci" value='+v+'>';
							}
							uf = that.uploadForm = $(['<form  target="_blank" class="hidden" method="post">',
								'<input type="text" name="id" value='+id+'>',								
								'<input type="text" name="applynum" value='+_number+'>',
								'<input type="text" name="phone" value='+data.txt_mobile+'>',
								changci,
								'<input type="text" name="realname" value='+data.user+'><input type="submit" ></form>'].join('')).appendTo('body');
							that.uploader = G.use('Uploader', {
								form:uf[0],
								domain : 'gaofen.com',
								action :url || 'http://editor.wp.com/special/2013gaokaozy/test',
								onload:function(r){
									if(r.isOk()){
										jf.addClass('hidden');
										view.find('.alert').removeClass('hidden alert-error').addClass('alert-success');
										view.find('.alert .info').find('h3').html('报名成功');
										view.find('.thumb-info-details .details p:last').find('i')
										.html(parseInt(_number)+parseInt(view.find('.thumb-info-details .details p:last').find('i').html()));
									}else{
										view.find('.form').addClass('hidden');
										view.find('.alert').removeClass('hidden alert-success').addClass('alert-error');
										view.find('.alert .info').find('h3').html('报名失败');
										view.find('.alert .info').find('p').html(msg.err);
									}
								}
							});
						}else{
							var inputs = that.uploadForm.find('input');
							inputs.eq(1).val(_number);
							inputs.eq(2).val(data.txt_mobile);
							inputs.eq(3).val(data.user);
							cc && inputs.eq(4).val(data.changci);
						}
						that.uploader.upload();
						return false;
					}
				});
			
			}}).play(1);
		
	}, {na : 1})
	//下载
	.reg('ddoc', function(e){
		if(e.get('mobile') == '1'){
			G.use('MobileDowm', {btnMsg : '继续购买', fn : function(){
				FN.avticeAccount(pay, e);
			}}).play(1);
		}else{
			FN.avticeAccount(pay, e);
		}
		function pay(){
		
			var src = e.src, 
				lock = false, host = 'http://'+G.PD.get('host'), isReload;
				var applyId = e.get('id'),
					type = e.get('t'),
					opt = {},
					applyUrl = host+'/ajax/download/',
					downUrl = host+'/docs/download/';
				Req.isPayTofile(applyId, type, applyUrl, function(r){//查询文件是否已支付
					//e.lock(0);
					var err = r.getError();
					if(r.isOk() || err == "高分币不够"){
						var data = r.getData(), template, state = data.state;
						if(state == 1){//已支付直接下载	
							location.reload();
							return;
						}
						if(type == 1){//高分币												
							switch(state){						
								case 2 : //高分币余额不足
									template = 'win_download2';
								break;	
								case 3 : //用高分币购买
									template = 'win_download1';
								break;							
							};
							opt = {fid : applyId};

						}else{//现金支付
							template = 'win_download3';
							opt = {	
								money : $('#usermoney').text()||e.get('price'), 
								bookname : "《"+($('#bookName').text()||$(src).attr('vrel'))+"》",
								payurl : host+'/pay/docsPay',
								fid : applyId 
							};
						}
						
						var vbox = G.use('Modal', $.extend({
							appendTo : 'body'
							, mask : true
							, title : '购买文档'
							, cs : 'modal-download'
							, afterHide : function(){//到完成支付步骤关闭层刷新页面
								G.ui.Modal.prototype.afterHide.call(this);
								if(isReload){
									location.reload();
								}
							}
							, contentHtml : template
							//, footers : 'win_module'
							, closeable: true
							, destroyOnClose : true
							, onViewReady : function(){
								var self = this;
								isReload = false;
								if(type == 1){
									switch(state){
										case 2 : //高分币余额不足
											this.jq("#usecost").html(data.cost);
											this.jq(".tip_cUost").html(data.uCost);
										break;	
										case 3 : //用高分币购买
											this.jq("form").attr("action",downUrl);
											this.jq("#usecost").html(data.cost);
											this.jq('input[name="id"]').val(applyId);
											this.jq('#residue').html("您剩余高分币："+data.uCost);
											this.jq('input[name="download"]').click(function(_e){
												//G.FN.changeDownTimer();
												setTimeout(function(){location.reload();}, 1000);
												return true;
											});
										break;							
									};
								}else{//现金购买
									$('#downbtn').click(function(_e){//弹出支付页面先切换内容
										var views = self.jq('div.modal-info');
										views.eq(0).cssDisplay(0);
										views.eq(1).cssDisplay(1);
										self.setTitle('等待支付');
										self.jq().addClass('pay-waiting');
										self.jq('#finish').click(function(ev){
											ev.preventDefault();
											if(lock) return;
											lock = true;
											Req.isPayTofile(applyId, 2, applyUrl, function(er){	
												if(er.isOk() && er.getData().state && parseInt(er.getData().state) == 1){//state为1时已支付其它刷新页面（4为未支付）
													isReload = true;
													views.eq(1).cssDisplay(0);
													views.eq(2).cssDisplay(1).find('form').attr('action', downUrl+applyId);												
													self.jq().removeClass('pay-waiting').addClass('pay-success');
													self.setTitle('支付成功');
													self.jq('#_downbtn').click(function(ev){
														FN.changeDownTimer();
														setTimeout(function(){self.close()}, 500);
													})
												}else{
													location.reload();
												}
											});
										});
										return true;
									});
								}							
								this.jq('#cancel').click(function(_e){
									_e.preventDefault();
									self.close();
								});
								if(data.bind == 1){
									this.jq('#share').cssDisplay(1);
								}
							}}, opt))
							//debugger;
							vbox.play(1);
						
					}else{
					
					}
				});	
			}
	})
	//资料免费下载
	.reg('cand', function(e){
		function down(){
			FN.addFrameToDownload('http://'+G.PD.get('host')+$(e.src).attr('vrel'));
			FN.changeDownTimer();
		}
		if(e.get('mobile') == '1'){
			G.use('MobileDowm', {btnMsg : '继续下载', fn : function(){
				down();
			}}).play(1);
		}else{
			down();
		}
	})
	//领取资料
	.reg('lq', function(e){
		var $e = $(e.src), vbox = $e.data('vbox'), jid = e.get('id'), lqed = $e.data('lqed');
		Req.q('/ajax/getSchool', {id:jid}, function(r){
			if(r.isOk()){
				var list = r.getData();
				//var list = {1:{id:1, school:'天河区', area:'天河北2001号'},2:{id:2, school:'东山区', area:'东山区2001号'}, 
				//	3:{id:3, school:'芳村区', area:'芳村区2001号'}};
				G.use('Modal', {
					appendTo : 'body'
					, mask : true
					, title : '资料领取'
					, cs : 'modal-fetch fetch-success'
					, contentHtml : 'lingquDatum'
					, closeable: true
					, destroyOnClose : true
					, getItem : function(id){
						if($.type(list) == 'object') return list[id];
						for(var i=0, len = list.length;i<len;i++){
							if(list[i].id == id){
								return list[i];
							}
						}
					}
					, onViewReady : function(){
						var opts = [];
						$.each(list, function(){
							opts.push('<option value="'+this.id+'">'+this.school+'</option>');
						});
						this.jq('#school').change(function(e){
							var v = $(this).val();
							if(v != ''){
								self.jq('#schoolArea').text(self.getItem(v).addr);									
							}else{
								self.jq('#schoolArea').text('');
							}
						}).append(opts.join(''));
						
						var self = this, jf = self.jq('.form'), inputs = jf.find('input,select');
						var vd = G.use('validator', {
							form : jf,
							trigger : '#btn',
							elements : inputs, 
							onSuccess : function(data){	
								var item = self.getItem(data.school);
								Req.postReq('/ajax/receive', {
									id : jid, 
									school : item.school,
									sid : item.id,
									addr : item.addr,
									phone : data.phone,
									realname : data.username,
									title : $('#bookName').html()
								}, function(rr){
									if(rr.isOk()){//领取资料
										self.jq('.modal-info').toggleClass('hidden');
										e.clear();
										$e.text('已领取');
									}else{
										self.jq('#errorArea').text(rr.getMsg()).closest('.form-row').addClass('error');
										//self.close();									
									}
								})
								return true;
							}
						});
					}					
				}).play(1);
			}				
		});				
	}).
	
	reg('null', function(e){//登录才能触发的功能
		if($.cookie('gaofen_user')){
			e.preventDefault(false);
		}
	})
	//签到
	.reg('qd', function(e){
		e.lock(1);
		Req.qiandao('qiandao', function(r){
			if(r.isOk()){
				e.clear();
				
				mbox.BubbleAward([$(e.src).parent()], '签到成功，高分币+10');
				$(e.src).addClass('btn-signed').text('今天您已签到');
			}else{
				switch(Number(r.getCode())){
					case 404 : 
					case 423001:
						G.use('Login');//未登录						
					break;
					case 423101 : 
					case 423003 ://已签到
						mbox.BubbleAlert($(e.src), '今天您已签到!');
						//$(e.src).addClass('btn-signed').text('今天您已签到');
					break;
					default :
						mbox.BubbleAlert($(e.src), '今天您已签到!');
						//mbox.alert('','网络问题，请稍后再试试吧。')
					break;
				}
			}
			e.lock(0);
		});
	})
	
	//参与话题互动
	.reg('ht', function(e){
		var $e = $(e.src), parent = $e.parent(), code = parent.data('ajax');
		if(code === true) return;
		e.lock(1);
		switch(code){		
			case '1000' :			
			case '2000' :
				mbox.BubbleAlert($e, '您已投过票！', function(){
					e.lock(0);
				});				
				return;
			break;
			
		}
		var $e = $(e.src), url = Req.mkUrl('debate','');
		if(!__debug){
			url = PD.get('host');
		}
		Req.q(PD.get('host'), {
			'mod' : 'debate',
			'action':'vote',
			tid : e.get('tid'),
			stand : e.get('t')
		}, function(r){
			if(r.isOk()){
				var span = $e.find('span'), number = Number(span.text()), offset = span.offset();
				span.text(++number);
				$('<span style="color:#0C67AA;width:40px">'+number+'</span>').appendTo('body').css({
					position: 'absolute',
					'font-size' : 20,
					top : offset.top,
					left : offset.left,
					'z-index':1000
				}).animate({
					top :  offset.top - 14,
					left: offset.left - 4 - (number > 10 ? 10 : 0),
					opacity: 0.4
				},500,function(){
					$(this).remove();					
				});
				var cls = $e.attr('class');
				if(e.get('t') == '1'){
					parent.data('ajax', '1000');
					$e.addClass(cls+'d');
				}else{
					parent.data('ajax', '2000');
					$e.addClass(cls+'ed');
				}				
				mbox.BubbleTip($e, '投票成功!');
				//e.clear();
			}else{
				switch(Number(r.getCode())){
					case 404 : 
					case 423001:
						G.use('Login');//未登录		
					break;
					case -2 : 
						mbox.BubbleAlert($e, '话题已经关闭!');
					break;			
					case -3 : 
						mbox.BubbleAlert($e, '话题不存在!');
					break;					
					case -4 : 
						mbox.BubbleAlert($e, '您已投过票！');
						var cls = $e.attr('class');
						if(e.get('t') == '1'){
							$e.addClass(cls+'d');
						}else{
							$e.addClass(cls+'ed');
						}	
						//e.clear();
					break;
					case -7 ://已签到
						mbox.BubbleAlert($e, '话题已经结束！');
					break;
					default :
						mbox.BubbleAlert($e, '网络问题，请稍后再试试吧。');
					break;
				}
				if(__debug) console.log('error:'+r.getError());
			}
			e.lock(0);
		});
	});   
		
	
})(Gaofen, jQuery, window);

/**
 * @author : xiezhiwen
 * 页面入口程序
 */
/*---------------非脚本加载完成时执行-----------------------*/
 //加载广告脚本
(function(){
	if(typeof ad_js !== 'undefined')
		Gaofen.Ad.addAd(Gaofen.Ad.getAd(ad_js[0], ad_js[1], ad_js[2]));

	$(window).load(function(){
		/*
		//特殊广告只有深圳用户才能看到
		if(typeof remote_ip_info !== 'undefined' && remote_ip_info.city === '深圳'){
			if(!$.cookie('remoteAdCook')){
				$(Gaofen.tpl.get('shenzhengAd')).appendTo('body').find('#close').click(function(){
					$(this).parent().slideUp();
					$.cookie('remoteAdCook', true, {expires:1});
				});
			}
		}
		*/
	});	
})(); 
/*---------------非脚本加载完成时执行结束-----------------------*/

$(function(){
	var G = Gaofen,
		Req = G.request,
		Util = G.util,
		FN = G.FN,
		PD = G.PD,
		channel = PD.get('channel'),
		module = PD.get('module'),
		action = PD.get('action'),
		host = PD.get('host'),
		event = G.use('action').bind(document.body);    //全局点击事件代理
	

/*-----------公共事件----------*/
	(function(){

		//设为首页
		$('#login #set_home, #logined #set_home').click(function(e){
			e.preventDefault();
			G.FN.setHome(this, this.href||'');
		});	
		
		//用户登录状态
		FN.gaofen_app_user();
		
		//登录框
		var loginView = $('#login li.account');

		G.use('HoverDelay', {
			view: loginView[0],
			hoverView : $('div.dropdown', loginView),
			hoverEvent : function(){
				loginView.find('a.caret span.bg').cssDisplay(1);
			},
			outEvent : function(){
				loginView.find('a.caret span.bg').cssDisplay(0);
			}
		}).play(1);
		
		//全局城市切换 
		FN.gaofen_app_cityMenu(PD.get('site'), $('#subsite'));

		//全局搜索方法
		var inputor = $('#searchValue');
		FN.gaofen_app_search({
			view : inputor.parent()[0],
			inputor : inputor,
			url : 'http://so.gaofen.com/cse/search?s=2958907847468970783&nsid=0&q='
		});

		//反回顶部
		FN.goTop();

		//顶部广告位
		var jqad = $('#slidertop');
		if(jqad.find('a').length>1){
			jqad.slideScroll({
				target : 'a',
				speed : 5000
			});
		}else if(jqad.find('a').length === 1){
			jqad.removeClass('slider');
		}
		//侧边广告位(由于可能有多个)
		$('div.slider').each(function(e){
			var jqad = $(this);
			if(jqad.attr('id') === 'sliderside' && jqad.find('a').length>1)
				jqad.slideScroll({
					target : 'a',
					speed : 3000
				});
		});	

		//检查签到
		var qiandao = $('#qiandao'), hostTime = Number(PD.get('hostTime')||(+new Date()));
		if(qiandao.length){			
			try{
				if(hostTime < 137991948313) hostTime *= 1000;
				var date = Util.timeChange(hostTime);
				if(date[1] < 10) date[1] = '0'+date[1];
				qiandao.find('.date').text(date[0]+'-'+date[1]+'-'+date[2]);
				qiandao.find('.week').text(date[6]);
			}catch(e){
				if(__debug) console.log('Date Error!');
			}
			if($.cookie('gaofen_user') !== null){
				var qdbtn = qiandao.find('.btn-sign');
				Req.qiandao('check', function(r){
					var code = Number(r.getCode());
					if(code !== ''){
						switch(code){
							case 0 ://未签到
								qdbtn.attr('rel', 'e:qd');
							break;
							case 423003 ://已签到
							case 423101 : 
								qdbtn.addClass('btn-signed').text('您今天已签到');
							break;
							case 404 : 
							case 423001:
								if(__debugg)  console.log('请先登录');
								//未登录
							break;

						}
					}
				});
			}else{
				qiandao.find('.btn-sign').attr('rel', 'e:null');
			}
		}
		
		//今日话题检查
		var hts = $('div.focus-today div.actions');
		if(hts.length){
			var obj = Gaofen.use('CollectPageData',{   
				items : hts 
			}).play(1);
			$.each(obj.data, function(i, dom){
				(function(_dom){
					var jq = $(_dom.item);
					jq.data('ajax', true);
					Req.q(PD.get('host'), {
						mod : 'debate',
						action : 'check',
						tid : _dom.data.tid
					}, function(r){
							var code = r.getCode(), jqa = jq.find('a');
							jq.data('ajax', code);						
							if(code == '1000'){
								jqa.eq(0).addClass('btn-approved');				
							}else if(code == '2000'){
								jqa.eq(1).addClass('btn-objected');	
							}							
					})
				})(dom);
			});
		}
		
		//设置详细页在线人数
		FN.onlineUsers();
		
	})();
	
/*-----------公共结束----------*/

/*-----------模块功能----------*/		
	switch(channel){
	
		case 'index' : //首页
			switch(action){
				case 'view' :

				break;
			}
		break;
	

		case 'jiangzuo' : //讲座模块
		
			switch(action){
				case 'index' : //讲座首页
					//修改右则状态
					Req.q('http://'+host+'/ajax/getLecturesCount', {}, function(r){
						if(r.isOk()){
							var jqps = $('div.widget-statistic>div.status p'), data = r.getData();
								jqps.eq(0).html('举办讲座： '+data.lectuCount+'场');
								jqps.eq(1).html('参加人数： '+data.applynumCount+'人');
								jqps.eq(2).html('合作机构： '+data.orgCount+'家');
						}
					});	
				case 'list' :
					G.use('jiangzuoChangeStatus');
				break;
				case 'view' : //讲座详细页
				case 'report': //讲座报道
					var btn = $('#joinActions');
					if(btn.length){
						var rel = Util.parseKnV(btn.closest('div.thumb-info-details').attr('rel')), host = PD.get('host');;
						Req.q('http://'+host+'/ajax/getLecturesJoinState', {id:rel.id}, function(r){
							if(r.isOk()){
								var date = parseInt(r.getData().joinTime);
								if( date >= 0 ){
									btn.cssDisplay(1).find('.icon-clock').html('报名剩余'+date+'天');									
								}else{
									btn.remove();
								}
							}
						});
					}

					G.use('jiangzuoChangeStatus', {
						view : $('div.span16')[0],
						target : 'div.thumb-info-details',
						type : 'special'
					});
				break;
			};
		break;
		
		case 'xuexiao' : //学校模块

			switch(action){
			
				case 'index' : //学校首页
					Req.q('http://'+host+'/ajax/getSchoolCount', {}, function(r){
						if(r.isOk()){
							var data = r.getData(), jqp = $('#schoolData div.status>p');
							jqp.eq(0).text('收录学校： '+data.schoolCount+'所');
							jqp.eq(1).text('名校访谈： '+data.interviewCount+'人');
						}
					});
					var squery = $('#squery');
					squery.find('#go_score').click(function(e){
						e.preventDefault();
						var year = squery.find('#go_year').val(),
							batch_id = squery.find('#go_batch_id').val(),
							admareaid = squery.find('#go_admareaid').val(),
							header = 'http://'+host+'/school/score/?';
						location.href = header + $.param({'year':year, 'batch_id':batch_id, 'admareaid':admareaid});
					});
				break;
				
				case 'score' : //分数线查询
					var catchData = {};		
					$("#change_year, #change_batch_id, #change_admareaid").bind('change', function(){
						var change_year = $("#change_year").val(),
							change_batch_id = $("#change_batch_id").val(),
							change_admareaid = $("#change_admareaid").val(),
							url = 'http://'+host;		
						$('#school_score_body').html('<tr><td colspan="9">数据载入中...</td></tr>');			
							var key = [change_year, change_batch_id, change_admareaid].join('&'), data;
							if(data = catchData[key]){
								randData(data);
							}else{
								Req.q(url+'/ajax/score/',{
									'year' : change_year,
									'batch_id' : change_batch_id,
									'admareaid' : change_admareaid
								},function(r){		
									catchData[key] = r;
									randData(r);	
								});
							}
					});
									
					function randData(r){
						var data = r.getData(), html = [], batchname = '', admarea = '';
						if(data){
							var k = 1, key;					
							for(key in data) {
								var row = data[key], _style = '';
								if (!parseInt(row.low_mark)) {
									row.low_mark = '--';
								}
								if (!parseInt(row.low_mark_last)) {
									row.low_mark_last = '--';
								}
								if (!parseInt(row.last_student_wish)) {
									row.last_student_wish = '--';
								}
								if (!parseInt(row.last_student_mark)) {
									row.last_student_mark = '--';
								}
								if (!parseInt(row.last_student_num)) {
									row.last_student_num = '--';
								}
								if((k%2) == 0){
									_style = 'class="even"';  
								}
								html.push('<tr '+_style+'><td>'+row.code+'</td><td><a target="_blank" href="/school/view/?id='+row.mid+'">'+row.name+'</a></td><td>' + row.typename + '</td><td>'+row.areaname+'</td><td>'+row.low_mark+'</td><td>'+row.low_mark_last+'</td><td>'+row.last_student_wish+'</td><td>'+row.last_student_mark+'</td><td>'+row.last_student_num+'</td></tr>');
								k++;
							}
							if(k>1){
								batchname = data[key].admareaid ? data[key].batchname : '所有批次';
								admarea = data[key].areaname ? data[key].areaname : '全区';
							}
						}else{
							var err = r.getRaw().err;
							batchname = err['batchname'];
							admarea = err['areaname'];
							html.push("<tr><td colspan='9'>暂无数据</td></tr>");
						}
						$('#school_score_body').html(html.join(''));
						$('#sel_batchname').html(batchname);
						$('#sel_admarea').html(admarea);
						$('#sel_year').text($("#change_year").val());
						html = '';
					}				
				break;				
			}			
		break;
		
		case 'ziliao' : //资料
			switch(action){
				case 'view' :
				case 'dochtml' : //资料浏览
					if(PD.get('jsReader'))//需要初始化阅读器
						var v = G.use('Reader', {controlView : $('#readControl'), view : $('#pageContain'), isImg : PD.get('isImg') === 1 ? 1 : 0});
				break;
				case 'userupload' : //资料上传
					var jf = $('#form1'), inputs = jf.find('input,textarea');
					var vd = G.use('validator', {
						form : jf,
						trigger : '#btnSubmits',
						elements : inputs, 
						onSuccess : function(data){
							//jf.find('#btnSubmits').prop('disabled', true);		
							if($('#pact').prop('checked')){
								$('#btnSubmit')[0].onclick();
							}
							return true;
						}
					});
					var SWFUPLOADSESSID = PD.get('SWFUPLOADSESSID') || "", swf_auth_key = PD.get('swf_auth_key') || "";
					window.swfu = new SWFUpload({
						upload_url: "/ajax/uploadFile/?SWFUPLOADSESSID="+SWFUPLOADSESSID+"&swf_auth_key="+swf_auth_key+"&__rnd="+(+new Date),
						file_post_name: "uploadefile",
						outSizeTips : '文档大小限制在20M以内，请重新上传!',
						button_image_url : '',
						file_size_limit : "20 MB",
						file_types : "*.doc;*.ppt;*.xlsx;*.pdf;*.txt;*.docx;*.pptx;*.xls",			// or you could use something like: "*.doc;*.wpd;*.pdf",
						file_types_description : "Files",
						file_upload_limit : "0",
						file_queue_limit : "1",

						swfupload_loaded_handler : swfUploadLoaded ,
						
						file_dialog_start_handler: fileDialogStart,
						file_queued_handler : fileQueued,
						file_queue_error_handler : fileQueueError,
						file_dialog_complete_handler : fileDialogComplete,
						
						upload_start_handler : function(){
							vd.lock = true;
							$('#pact').prop('disabled', true);
							$('#fsUploadProgress').removeClass('hidden');
							$('#btnSubmits').addClass('btn-disabled');
						},
						upload_progress_handler : function(file, bytesLoaded, bytesTotal) {
							try {
								var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
								$('#fsUploadProgress').html('正在上传文档，请稍候...(<em>'+percent+'</em>%)');
							} catch (ex) {
								this.debug(ex);
							}
						},
						upload_error_handler : function(){
							uploadError.apply(this, arguments);
							$('#pact').prop('disabled', false);
							$('#btnSubmits').removeClass('btn-disabled');
							vd.lock = false;
						},
						upload_success_handler : function(file, serverData){
							document.getElementById("hidFileID").value = serverData;
							$('#fsUploadProgress').text('');
						},
						upload_complete_handler : uploadComplete,

						button_image_url : "/public/js/swfupload/swfuploadbtn.png",
						button_placeholder_id : "spanButtonPlaceholder",
						button_width: 76,
						button_height: 20,

						flash_url : "/public/js/swfupload/swfupload.swf",

						custom_settings : {
							progress_target : "fsUploadProgress",
							upload_successful : true
						}
					});
					break;
			}
		break;
	}
/*-----------模块功能结束----------*/	
});