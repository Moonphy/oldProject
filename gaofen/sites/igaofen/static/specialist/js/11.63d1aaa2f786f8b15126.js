webpackJsonp([11,19],{1:function(e,t,n){var r=n(28)("wks"),o=n(17),i=n(3).Symbol,a="function"==typeof i,s=e.exports=function(e){return r[e]||(r[e]=a&&i[e]||(a?i:o)("Symbol."+e))};s.store=r},8:function(e,t){e.exports={}},9:function(e,t){e.exports=!0},10:function(e,t){t.f={}.propertyIsEnumerable},11:function(e,t,n){var r=n(4).f,o=n(2),i=n(1)("toStringTag");e.exports=function(e,t,n){e&&!o(e=n?e:e.prototype,i)&&r(e,i,{configurable:!0,value:t})}},12:function(e,t,n){var r=n(3),o=n(23),i=n(9),a=n(13),s=n(4).f;e.exports=function(e){var t=o.Symbol||(o.Symbol=i?{}:r.Symbol||{});"_"==e.charAt(0)||e in t||s(t,e,{value:a.f(e)})}},13:function(e,t,n){t.f=n(1)},18:function(e,t,n){"use strict";var r=n(9),o=n(25),i=n(22),a=n(6),s=n(2),c=n(8),f=n(40),l=n(11),u=n(47),A=n(1)("iterator"),d=!([].keys&&"next"in[].keys()),p="@@iterator",m="keys",h="values",v=function(){return this};e.exports=function(e,t,n,b,g,C,w){f(n,t,b);var B,y,k,_=function(e){if(!d&&e in D)return D[e];switch(e){case m:return function(){return new n(this,e)};case h:return function(){return new n(this,e)}}return function(){return new n(this,e)}},x=t+" Iterator",S=g==h,E=!1,D=e.prototype,O=D[A]||D[p]||g&&D[g],P=O||_(g),j=g?S?_("entries"):P:void 0,T="Array"==t?D.entries||O:O;if(T&&(k=u(T.call(new e)),k!==Object.prototype&&(l(k,x,!0),r||s(k,A)||a(k,A,v))),S&&O&&O.name!==h&&(E=!0,P=function(){return O.call(this)}),r&&!w||!d&&!E&&D[A]||a(D,A,P),c[t]=P,c[x]=v,g)if(B={values:S?P:_(h),keys:C?P:_(m),entries:j},w)for(y in B)y in D||i(D,y,B[y]);else o(o.P+o.F*(d||E),t,B);return B}},19:function(e,t,n){var r=n(15),o=n(44),i=n(26),a=n(27)("IE_PROTO"),s=function(){},c="prototype",f=function(){var e,t=n(65)("iframe"),r=i.length,o=">";for(t.style.display="none",n(38).appendChild(t),t.src="javascript:",e=t.contentWindow.document,e.open(),e.write("<script>document.F=Object</script"+o),e.close(),f=e.F;r--;)delete f[c][i[r]];return f()};e.exports=Object.create||function(e,t){var n;return null!==e?(s[c]=r(e),n=new s,s[c]=null,n[a]=e):n=f(),void 0===t?n:o(n,t)}},20:function(e,t,n){var r=n(67),o=n(26).concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return r(e,o)}},21:function(e,t){t.f=Object.getOwnPropertySymbols},22:function(e,t,n){e.exports=n(6)},30:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}t.__esModule=!0;var o=n(33),i=r(o),a=n(32),s=r(a),c="function"==typeof s["default"]&&"symbol"==typeof i["default"]?function(e){return typeof e}:function(e){return e&&"function"==typeof s["default"]&&e.constructor===s["default"]?"symbol":typeof e};t["default"]="function"==typeof s["default"]&&"symbol"===c(i["default"])?function(e){return"undefined"==typeof e?"undefined":c(e)}:function(e){return e&&"function"==typeof s["default"]&&e.constructor===s["default"]?"symbol":"undefined"==typeof e?"undefined":c(e)}},31:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0}),t.globalMixins=void 0;var o=n(30),i=r(o),a=n(61),s=r(a),c=n(56),f=r(c),l=n(60);t.globalMixins={data:function(){return{debug:!1,backurl:"#",nowurl:"#",routeName:"",lastid:"1",isSetShare:!1,pageShareData:{common:{title:"听专家讲家庭教育 — 3分钟解决你的教育难题",link:"",desc:"听专家讲家庭教育 — 3分钟解决你的教育难题",imgUrl:""}}}},vuex:{getters:{apiInterface:function(e){var t=e.system;return t.apiInterface},loading:function(e){var t=e.system;return t.loading},pullLoad:function(e){var t=e.system;return t.pullloading},notices:function(e){var t=e.system;return t.notices},prompt:function(e){var t=e.system;return t.prompt},wxinited:function(e){var t=e.system;return t.wxinited},machineType:function(e){var t=e.system;return t.machineType},album:function(e){var t=e.cachedata;return t.albumList},category:function(e){var t=e.cachedata;return t.category},userinfo:function(e){var t=e.cachedata;return t.userinfo},expertWay:function(e){var t=e.cachedata;return t.expertWay},expert:function(e){var t=e.cachedata;return t.expert}},actions:{setState:l.setState,addNotice:l.addNotice,setPrompt:l.setPrompt,setwxinit:l.setwxinit,setalbum:l.setalbum,setcategory:l.setcategory,setuserinfo:l.setuserinfo,setExpertWay:l.setExpertWay,setExpert:l.setExpert,setPullLoad:l.setPullLoad}},store:s["default"],created:function(){var e=this.$options.layout;e&&this.setLayout(e)},route:{data:function(e){e.from.path&&(this.backurl=e.from.path),this.nowurl=e.to.path,this.routeName=this.$options.name,this.$dispatch("change-route",{to:this.nowurl,from:this.backurl,toname:this.$options.name}),this.wxsign(),setTimeout(function(){window.scrollTo(0,0)},100),this.setPullLoad(!1)}},watch:{wxinited:function(e,t){e===!0&&this.share()}},methods:{wxsign:function(){var e=this;if(this.wxinited===!0&&this.share(),this.wxinited===!1){var t=this;f["default"].common.getWxconfig(this.apiInterface.wxconfig,{url:window.location.href.split("#")[0]}).then(function(n){if(0===n.data.errno){var r=e.toJson(n.data.rsm);e.regwx(r,{debug:!1},"",function(e){e||"error"===t.wxinited?(window.location.href.indexOf("dev")>-1&&t.addNotice({type:"error",content:"微信注册失败!"}),t.setwxinit("error")):(t.setwxinit(!0),window.location.href.indexOf("dev")>-1&&t.addNotice({type:"success",content:"微信注册成功!"}))})}})}},goback:function(){this.route.go()},numberic:function(e){return/^\d*$/.test(e)},noSpaces:function(e){return/^\S+$/.test(e)},noSpacesPrefixAndSuffix:function(e){return/^\S(.*\S)*$/.test(e)},getTime:function(e){var t=e?new Date(e):new Date;return t.getTime()},getComponentId:function(){return this.lastid++},toJson:function(e){try{return"object"===("undefined"==typeof e?"undefined":(0,i["default"])(e))?e:window.JSON.parse(e)}catch(t){return""}},toUrlParams:function(e){var t=[];for(var n in e)t.push(n+"="+e[n]);return t.join("&")},pinjieUrl:function(e,t){return t=this.toUrlParams(t),e.indexOf("?")>-1?e+"&"+t:e+"?"+t},makeUrl:function(e){var t=window.location.origin;return t+"/static/specialist/"+e},handleError:function(e){this.setPrompt(e)},filterCallback:function(e){return e.data.errno!==-1?null===e.data.rsm?e.data:this.toJson(e.data):void(window.location.href=this.pinjieUrl(window.Gaofen.api.do_login,{url:window.btoa(window.location.href)}))},secondToTime:function(e){var t=[],n=60,r=60*n,o=24*r;if(e>o){var i=Math.floor(e/o);e-=i*o,t.push(i+"天")}if(e>r){var a=Math.floor(e/r);a<10&&(a="0"+a),e-=a*r,t.push(a+":")}if(e>n){var s=Math.floor(e/n);s<10&&(s="0"+s),e-=s*n,t.push(s+":")}return e<10&&(e="0"+e),t.push(e),t.join("")},regwx:function(e,t,n,r){window.wx.config({debug:t.debug||!1,appId:e.appId,timestamp:e.timestamp,nonceStr:e.nonceStr,signature:e.signature,jsApiList:["checkJsApi","getLocation","onMenuShareTimeline","onMenuShareQQ","onMenuShareAppMessage","startRecord","stopRecord","onVoiceRecordEnd","playVoice","pauseVoice","stopVoice","onVoicePlayEnd","uploadVoice","downloadVoice","chooseImage","previewImage","uploadImage"]}),window.wx.error(function(e){r&&r(e)}),window.wx.ready(function(){n&&n(t),r&&r()})},setShareData:function(e){e.title&&(this.pageShareData.common.title=e.title),this.pageShareData.common.desc=e.desc||"听专家讲家庭教育 — 3分钟解决你的教育难题",e.imgUrl&&(this.pageShareData.common.imgUrl=e.imgUrl),this.wxinited===!0&&this.isSetShare===!1&&this.share()},share:function(e){var t=this.pageShareData.common;t.link=window.location.href;var n=!0;switch(this.routeName){case"index":case"catalogs":case"more":case"album":t.imgUrl=this.makeUrl("img/audio-current-img.png");break;case"albumDetail":""===t.imgUrl&&(n=!1),t.title=t.title+" — 听专家方法";break;case"detail":""===t.imgUrl&&(n=!1),t.title=t.title+" — 听专家方法";break;case"home":""===t.imgUrl&&(n=!1)}n&&(window.wx.onMenuShareAppMessage(t),window.wx.onMenuShareTimeline(t),window.wx.onMenuShareQQ(t),this.isSetShare=!0)},initPage:function(e){var t=this;setTimeout(function(){t.getPageCallBack=e.getPage,document.addEventListener("scroll",t.bindPage,!1)},100)},removeScrollPage:function(){document.removeEventListener("scroll",this.bindPage,!1)},getPageCallBack:"",getPageTimer:null,bindPage:function(){var e=window.screen.height,t=document.documentElement.scrollTop||document.body.scrollTop;t+e+20>document.body.clientHeight&&(clearTimeout(this.getPageTimer),this.getPageTimer=setTimeout(this.getPageCallBack,1))},addItem:function(e,t){for(var n=0;n<t.length;n++)e.push(t[n]);return n},answerPay:function(e,t){var n=this;this.setState(!0),f["default"].common.getData(this.apiInterface.get_voice_link,{answer_id:e}).then(this.filterCallback).then(function(e){if(0===e.errno)t&&t(e.rsm);else if(e.errno===-100)try{var r=window.location.href.replace("&paying=1","");window.location.href=n.pinjieUrl(e.rsm.pay_link,{callback:encodeURIComponent(r)})}catch(o){}else n.addNotice({type:"error",content:e.err});n.setState(!1)})},getUser:function(e,t,n){var r=this,o=function(){var t={imgUrl:this.user.avatar};"albumDetail"===this.routeName&&e&&(t.title=e),this.setShareData(t)};return this.userinfo.time&&(new Date).getTime()-this.userinfo.time<3e5?(this.user=this.userinfo.user,o.call(this),void(n&&n(this.user))):(this.setState(!0),void f["default"].common.getData(this.apiInterface.user_index).then(this.filterCallback).then(function(e){r.user=e.rsm,r.setuserinfo({time:(new Date).getTime(),user:r.user}),n&&n(r.user),o.call(r),r.setState(!1)}))},showPageErweima:function(e,t){e="http://qr.liantu.com/api.php?text="+encodeURIComponent(e||window.location.href),t=t||"长按图片，保存到相册。",this.$dispatch("wxError",{wxpopup:!0,wxpopupText:t+'<br><img src="'+e+'" alt="二维码">'})},isOpenByWeixin:function(e){var t=navigator.userAgent.toLowerCase().match(/MicroMessenger/i),n=!1;return t&&t.length&&"micromessenger"===t[0]?n=!0:this.showPageErweima("",e),n}}}},32:function(e,t,n){e.exports={"default":n(34),__esModule:!0}},33:function(e,t,n){e.exports={"default":n(35),__esModule:!0}},34:function(e,t,n){n(52),n(50),n(53),n(54),e.exports=n(23).Symbol},35:function(e,t,n){n(51),n(55),e.exports=n(13).f("iterator")},36:function(e,t){e.exports=function(){}},37:function(e,t,n){var r=n(7),o=n(21),i=n(10);e.exports=function(e){var t=r(e),n=o.f;if(n)for(var a,s=n(e),c=i.f,f=0;s.length>f;)c.call(e,a=s[f++])&&t.push(a);return t}},38:function(e,t,n){e.exports=n(3).document&&document.documentElement},39:function(e,t,n){var r=n(64);e.exports=Array.isArray||function(e){return"Array"==r(e)}},40:function(e,t,n){"use strict";var r=n(19),o=n(16),i=n(11),a={};n(6)(a,n(1)("iterator"),function(){return this}),e.exports=function(e,t,n){e.prototype=r(a,{next:o(1,n)}),i(e,t+" Iterator")}},41:function(e,t){e.exports=function(e,t){return{value:t,done:!!e}}},42:function(e,t,n){var r=n(7),o=n(5);e.exports=function(e,t){for(var n,i=o(e),a=r(i),s=a.length,c=0;s>c;)if(i[n=a[c++]]===t)return n}},43:function(e,t,n){var r=n(17)("meta"),o=n(59),i=n(2),a=n(4).f,s=0,c=Object.isExtensible||function(){return!0},f=!n(24)(function(){return c(Object.preventExtensions({}))}),l=function(e){a(e,r,{value:{i:"O"+ ++s,w:{}}})},u=function(e,t){if(!o(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!i(e,r)){if(!c(e))return"F";if(!t)return"E";l(e)}return e[r].i},A=function(e,t){if(!i(e,r)){if(!c(e))return!0;if(!t)return!1;l(e)}return e[r].w},d=function(e){return f&&p.NEED&&c(e)&&!i(e,r)&&l(e),e},p=e.exports={KEY:r,NEED:!1,fastKey:u,getWeak:A,onFreeze:d}},44:function(e,t,n){var r=n(4),o=n(15),i=n(7);e.exports=n(14)?Object.defineProperties:function(e,t){o(e);for(var n,a=i(t),s=a.length,c=0;s>c;)r.f(e,n=a[c++],t[n]);return e}},45:function(e,t,n){var r=n(10),o=n(16),i=n(5),a=n(29),s=n(2),c=n(66),f=Object.getOwnPropertyDescriptor;t.f=n(14)?f:function(e,t){if(e=i(e),t=a(t,!0),c)try{return f(e,t)}catch(n){}if(s(e,t))return o(!r.f.call(e,t),e[t])}},46:function(e,t,n){var r=n(5),o=n(20).f,i={}.toString,a="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(e){try{return o(e)}catch(t){return a.slice()}};e.exports.f=function(e){return a&&"[object Window]"==i.call(e)?s(e):o(r(e))}},47:function(e,t,n){var r=n(2),o=n(68),i=n(27)("IE_PROTO"),a=Object.prototype;e.exports=Object.getPrototypeOf||function(e){return e=o(e),r(e,i)?e[i]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?a:null}},48:function(e,t,n){var r=n(63),o=n(62);e.exports=function(e){return function(t,n){var i,a,s=String(o(t)),c=r(n),f=s.length;return c<0||c>=f?e?"":void 0:(i=s.charCodeAt(c),i<55296||i>56319||c+1===f||(a=s.charCodeAt(c+1))<56320||a>57343?e?s.charAt(c):i:e?s.slice(c,c+2):(i-55296<<10)+(a-56320)+65536)}}},49:function(e,t,n){"use strict";var r=n(36),o=n(41),i=n(8),a=n(5);e.exports=n(18)(Array,"Array",function(e,t){this._t=a(e),this._i=0,this._k=t},function(){var e=this._t,t=this._k,n=this._i++;return!e||n>=e.length?(this._t=void 0,o(1)):"keys"==t?o(0,n):"values"==t?o(0,e[n]):o(0,[n,e[n]])},"values"),i.Arguments=i.Array,r("keys"),r("values"),r("entries")},50:function(e,t){},51:function(e,t,n){"use strict";var r=n(48)(!0);n(18)(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,t=this._t,n=this._i;return n>=t.length?{value:void 0,done:!0}:(e=r(t,n),this._i+=e.length,{value:e,done:!1})})},52:function(e,t,n){"use strict";var r=n(3),o=n(2),i=n(14),a=n(25),s=n(22),c=n(43).KEY,f=n(24),l=n(28),u=n(11),A=n(17),d=n(1),p=n(13),m=n(12),h=n(42),v=n(37),b=n(39),g=n(15),C=n(5),w=n(29),B=n(16),y=n(19),k=n(46),_=n(45),x=n(4),S=n(7),E=_.f,D=x.f,O=k.f,P=r.Symbol,j=r.JSON,T=j&&j.stringify,z="prototype",M=d("_hidden"),U=d("toPrimitive"),I={}.propertyIsEnumerable,q=l("symbol-registry"),N=l("symbols"),L=l("op-symbols"),Y=Object[z],W="function"==typeof P,R=r.QObject,F=!R||!R[z]||!R[z].findChild,J=i&&f(function(){return 7!=y(D({},"a",{get:function(){return D(this,"a",{value:7}).a}})).a})?function(e,t,n){var r=E(Y,t);r&&delete Y[t],D(e,t,n),r&&e!==Y&&D(Y,t,r)}:D,Q=function(e){var t=N[e]=y(P[z]);return t._k=e,t},$=W&&"symbol"==typeof P.iterator?function(e){return"symbol"==typeof e}:function(e){return e instanceof P},V=function(e,t,n){return e===Y&&V(L,t,n),g(e),t=w(t,!0),g(n),o(N,t)?(n.enumerable?(o(e,M)&&e[M][t]&&(e[M][t]=!1),n=y(n,{enumerable:B(0,!1)})):(o(e,M)||D(e,M,B(1,{})),e[M][t]=!0),J(e,t,n)):D(e,t,n)},X=function(e,t){g(e);for(var n,r=v(t=C(t)),o=0,i=r.length;i>o;)V(e,n=r[o++],t[n]);return e},H=function(e,t){return void 0===t?y(e):X(y(e),t)},G=function(e){var t=I.call(this,e=w(e,!0));return!(this===Y&&o(N,e)&&!o(L,e))&&(!(t||!o(this,e)||!o(N,e)||o(this,M)&&this[M][e])||t)},K=function(e,t){if(e=C(e),t=w(t,!0),e!==Y||!o(N,t)||o(L,t)){var n=E(e,t);return!n||!o(N,t)||o(e,M)&&e[M][t]||(n.enumerable=!0),n}},Z=function(e){for(var t,n=O(C(e)),r=[],i=0;n.length>i;)o(N,t=n[i++])||t==M||t==c||r.push(t);return r},ee=function(e){for(var t,n=e===Y,r=O(n?L:C(e)),i=[],a=0;r.length>a;)!o(N,t=r[a++])||n&&!o(Y,t)||i.push(N[t]);return i};W||(P=function(){if(this instanceof P)throw TypeError("Symbol is not a constructor!");var e=A(arguments.length>0?arguments[0]:void 0),t=function(n){this===Y&&t.call(L,n),o(this,M)&&o(this[M],e)&&(this[M][e]=!1),J(this,e,B(1,n))};return i&&F&&J(Y,e,{configurable:!0,set:t}),Q(e)},s(P[z],"toString",function(){return this._k}),_.f=K,x.f=V,n(20).f=k.f=Z,n(10).f=G,n(21).f=ee,i&&!n(9)&&s(Y,"propertyIsEnumerable",G,!0),p.f=function(e){return Q(d(e))}),a(a.G+a.W+a.F*!W,{Symbol:P});for(var te="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),ne=0;te.length>ne;)d(te[ne++]);for(var te=S(d.store),ne=0;te.length>ne;)m(te[ne++]);a(a.S+a.F*!W,"Symbol",{"for":function(e){return o(q,e+="")?q[e]:q[e]=P(e)},keyFor:function(e){if($(e))return h(q,e);throw TypeError(e+" is not a symbol!")},useSetter:function(){F=!0},useSimple:function(){F=!1}}),a(a.S+a.F*!W,"Object",{create:H,defineProperty:V,defineProperties:X,getOwnPropertyDescriptor:K,getOwnPropertyNames:Z,getOwnPropertySymbols:ee}),j&&a(a.S+a.F*(!W||f(function(){var e=P();return"[null]"!=T([e])||"{}"!=T({a:e})||"{}"!=T(Object(e))})),"JSON",{stringify:function(e){if(void 0!==e&&!$(e)){for(var t,n,r=[e],o=1;arguments.length>o;)r.push(arguments[o++]);return t=r[1],"function"==typeof t&&(n=t),!n&&b(t)||(t=function(e,t){if(n&&(t=n.call(this,e,t)),!$(t))return t}),r[1]=t,T.apply(j,r)}}}),P[z][U]||n(6)(P[z],U,P[z].valueOf),u(P,"Symbol"),u(Math,"Math",!0),u(r.JSON,"JSON",!0)},53:function(e,t,n){n(12)("asyncIterator")},54:function(e,t,n){n(12)("observable")},55:function(e,t,n){n(49);for(var r=n(3),o=n(6),i=n(8),a=n(1)("toStringTag"),s=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],c=0;c<5;c++){var f=s[c],l=r[f],u=l&&l.prototype;u&&!u[a]&&o(u,a,f),i[f]=i.Array}},120:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(31),i=n(56),a=r(i);t["default"]={name:"newssetting",mixins:[o.globalMixins],data:function(){return{userType:"",items:{apply_receive:0,question_receive:0,topic_publish:0,answer_listen:0,withdraw:0,withdraw_success:0,level_change:0}}},ready:function(){var e=this,t=this;this.setPullLoad(!0),this.getUser("","",function(e){t.userType=e.type,t.setPullLoad(!1)}),this.setState(!0),a["default"].common.getData(this.apiInterface.template_settings).then(this.filterCallback).then(function(t){0===t.errno&&(e.items=t.rsm),e.setState(!1)})},methods:{save:function(){var e=this;this.loading||(this.setState(!0),a["default"].common.getData(this.apiInterface.save_template_settings,this.items).then(this.filterCallback).then(function(t){0===t.errno?e.addNotice({type:"success",content:"设置成功！"}):e.addNotice({type:"error",content:"操作失败，请稍候再试"}),e.setState(!1)}))},check:function(e,t){this.items[t]=e?0:1}}}},158:function(e,t,n){t=e.exports=n(57)(),t.push([e.id,'.home-page .home-avatar[_v-f8e199ee]{padding:.15rem .2rem .1rem;background-color:#fff;position:relative}.home-page .home-avatar[_v-f8e199ee]:after,.home-page .home-avatar[_v-f8e199ee]:before{display:table;content:"";line-height:0}.home-page .home-avatar[_v-f8e199ee]:after{clear:both}.home-page .home-avatar .ui-avatar[_v-f8e199ee]{width:.5rem;height:.5rem}.home-page .home-avatar .home-avatar-center[_v-f8e199ee]{position:relative;margin-left:.6rem;margin-right:.7rem;padding-top:.05rem}.home-page .home-avatar .home-avatar-center .user-name[_v-f8e199ee]{width:100%;font-size:.16rem}.home-page .home-avatar .home-avatar-center .disabled[_v-f8e199ee]{background-color:#fff}.home-page .row-flex[_v-f8e199ee]{width:100%;background-color:#fff;border-bottom:.01rem solid #ddd;display:-ms-flexbox;display:-webkit-box;display:flex;-webkit-box-pack:justify;-o-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.home-page .row-flex a[_v-f8e199ee]{display:block;-webkit-box-flex:1;-ms-flex:1;flex:1;text-align:center;border-left:.01rem solid #ddd;margin-bottom:.1rem;position:relative;padding-top:.05rem}.home-page .row-flex a[_v-f8e199ee]:first-child{border-left:none}.home-page .row-flex a .font-grey[_v-f8e199ee]{font-size:.12rem}.home-page .row-flex a .ui-label[_v-f8e199ee]{padding:0 .05rem;position:absolute;right:0;top:0;margin:0}.home-page .audio-list[_v-f8e199ee]{background-color:#fff}.home-avatar-right[_v-f8e199ee]{width:.7rem;text-align:right;padding-top:.1rem}.btn-edit[_v-f8e199ee],.btn-erweima[_v-f8e199ee]{display:inline-block;size:.35rem .4rem;font-size:.1rem;text-align:center;overflow:hidden}.btn-edit .icon[_v-f8e199ee],.btn-erweima .icon[_v-f8e199ee]{background-size:100%}.ui-block[_v-f8e199ee]{padding:.2rem}.rule-list[_v-f8e199ee]{margin:.1rem .2rem .1rem .3rem}.rule-list li[_v-f8e199ee]{list-style:disc;margin:.05rem 0}.font-money[_v-f8e199ee]{line-height:1}.erweima-wrap[_v-f8e199ee]{width:30%;margin:.05rem auto;padding:.08rem;background-color:#eee}.erweima-wrap img[_v-f8e199ee]{display:block;width:100%}.row-panel[_v-f8e199ee]{border-bottom:.01rem solid #ddd}.row-panel .panel-title[_v-f8e199ee]{font-size:.18rem;padding:.2rem;padding-left:.2rem;border-bottom:.01rem solid #ddd}.row-panel .panel-content[_v-f8e199ee]{padding:0 .4rem}.row-panel .panel-content ul li[_v-f8e199ee]:last-child{border-bottom:0}.row-panel .panel-content li[_v-f8e199ee]{padding-bottom:.04rem;padding-top:.15rem;font-size:.16rem;border-bottom:.01rem solid #ddd}.row-panel .panel-content li[_v-f8e199ee]:after{content:" ";display:block;clear:both}.row-panel .panel-content li .check-part[_v-f8e199ee]{width:.52rem;height:.32rem;border:1px solid #dfdfdf;outline:0;border-radius:16px;box-sizing:border-box;background-color:#dfdfdf;-webkit-appearance:none;position:relative;-webkit-transition:background-color .1s,border .1s;transition:background-color .1s,border .1s}.row-panel .panel-content li .check-part[_v-f8e199ee]:before{content:" ";position:absolute;top:0;left:0;width:.5rem;height:.3rem;border-radius:15px;background-color:#fdfdfd;transition:transform .35s cubic-bezier(.45,1,.4,1),-webkit-transform .35s cubic-bezier(.45,1,.4,1)}.row-panel .panel-content li .check-part[_v-f8e199ee]:after{content:" ";position:absolute;top:0;left:0;width:.3rem;height:.3rem;border-radius:15px;background-color:#fff;box-shadow:0 1px 3px rgba(0,0,0,.4);-webkit-transition:-webkit-transform .35s cubic-bezier(.4,.4,.25,1.35);transition:-webkit-transform .35s cubic-bezier(.4,.4,.25,1.35);transition:transform .35s cubic-bezier(.4,.4,.25,1.35);transition:transform .35s cubic-bezier(.4,.4,.25,1.35),-webkit-transform .35s cubic-bezier(.4,.4,.25,1.35)}.row-panel .panel-content li .check-part[_v-f8e199ee]:checked{border-color:#04be02;background-color:#04be02}.row-panel .panel-content li .check-part[_v-f8e199ee]:checked:before{background-color:#04be02}.row-panel .panel-content li .check-part[_v-f8e199ee]:checked:after{-webkit-transform:translateX(20px);transform:translateX(20px)}',"",{version:3,sources:["/./src/views/newssetting.vue"],names:[],mappings:"AAAA,qCACE,2BAAsC,AACtC,sBAAuB,AACvB,iBAAmB,CACpB,AACD,uFAEE,cAAe,AACf,WAAY,AACZ,aAAe,CAChB,AACD,2CACE,UAAY,CACb,AACD,gDACE,YAAc,AACd,YAAe,CAChB,AACD,yDACE,kBAAmB,AACnB,kBAAoB,AACpB,mBAAqB,AACrB,kBAAqB,CACtB,AACD,oEACE,WAAY,AACZ,gBAAmB,CACpB,AACD,mEACE,qBAAuB,CACxB,AACD,kCACE,WAAY,AACZ,sBAAuB,AACvB,gCAAkC,AAClC,oBAAqB,AACrB,oBAAqB,AACrB,aAAc,AACd,yBAA0B,AAC1B,oBAAqB,AACrB,sBAAuB,AACvB,6BAA+B,CAChC,AACD,oCACE,cAAe,AACf,mBAAoB,AAChB,WAAY,AACR,OAAQ,AAChB,kBAAmB,AACnB,8BAAgC,AAChC,oBAAsB,AACtB,kBAAmB,AACnB,kBAAqB,CACtB,AACD,gDACE,gBAAkB,CACnB,AACD,+CACE,gBAAmB,CACpB,AACD,8CACE,iBAAmB,AACnB,kBAAmB,AACnB,QAAS,AACT,MAAO,AACP,QAAU,CACX,AACD,oCACE,qBAAuB,CACxB,AACD,gCACE,YAAc,AACd,iBAAkB,AAClB,iBAAoB,CACrB,AACD,iDAEE,qBAAsB,AACtB,kBAAqB,AACrB,gBAAkB,AAClB,kBAAmB,AACnB,eAAiB,CAClB,AACD,6DAEE,oBAAsB,CACvB,AACD,uBACE,aAAgB,CACjB,AACD,wBACE,8BAAoC,CACrC,AACD,2BACE,gBAAiB,AACjB,eAAkB,CACnB,AACD,yBACE,aAAe,CAChB,AACD,2BACE,UAAW,AACX,mBAAqB,AACrB,eAAiB,AACjB,qBAAuB,CACxB,AACD,+BACE,cAAe,AACf,UAAY,CACb,AACD,wBACE,+BAAkC,CACnC,AACD,qCACE,iBAAmB,AACnB,cAAgB,AAChB,mBAAqB,AACrB,+BAAkC,CACnC,AACD,uCACE,eAAkB,CACnB,AACD,wDACE,eAAiB,CAClB,AACD,0CACE,sBAAwB,AACxB,mBAAqB,AACrB,iBAAmB,AACnB,+BAAkC,CACnC,AACD,gDACE,YAAa,AACb,cAAe,AACf,UAAY,CACb,AACD,sDACE,aAAe,AACf,cAAgB,AAChB,yBAA0B,AAC1B,UAAW,AACX,mBAAoB,AACpB,sBAAuB,AACvB,yBAA0B,AAC1B,wBAAyB,AACzB,kBAAmB,AACnB,mDAAuD,AACvD,0CAA+C,CAChD,AACD,6DACE,YAAa,AACb,kBAAmB,AACnB,MAAO,AACP,OAAQ,AACR,YAAc,AACd,aAAe,AACf,mBAAoB,AACpB,yBAA0B,AAC1B,kGAAiH,CAClH,AACD,4DACE,YAAa,AACb,kBAAmB,AACnB,MAAO,AACP,OAAQ,AACR,YAAc,AACd,aAAe,AACf,mBAAoB,AACpB,sBAAuB,AACvB,oCAAsC,AACtC,uEAA+E,AAC/E,+DAAuE,AACvE,uDAA+D,AAC/D,0GAA2H,CAC5H,AACD,8DACE,qBAAsB,AACtB,wBAA0B,CAC3B,AACD,qEACE,wBAA0B,CAC3B,AACD,oEACE,mCAAoC,AAC5B,0BAA4B,CACrC",file:"newssetting.vue",sourcesContent:['.home-page .home-avatar[_v-f8e199ee] {\n  padding: 0.15rem 0.2rem 0.1rem 0.2rem;\n  background-color: #fff;\n  position: relative;\n}\n.home-page .home-avatar[_v-f8e199ee]:before,\n.home-page .home-avatar[_v-f8e199ee]:after {\n  display: table;\n  content: "";\n  line-height: 0;\n}\n.home-page .home-avatar[_v-f8e199ee]:after {\n  clear: both;\n}\n.home-page .home-avatar .ui-avatar[_v-f8e199ee] {\n  width: 0.5rem;\n  height: 0.5rem;\n}\n.home-page .home-avatar .home-avatar-center[_v-f8e199ee] {\n  position: relative;\n  margin-left: 0.6rem;\n  margin-right: 0.7rem;\n  padding-top: 0.05rem;\n}\n.home-page .home-avatar .home-avatar-center .user-name[_v-f8e199ee] {\n  width: 100%;\n  font-size: 0.16rem;\n}\n.home-page .home-avatar .home-avatar-center .disabled[_v-f8e199ee] {\n  background-color: #fff;\n}\n.home-page .row-flex[_v-f8e199ee] {\n  width: 100%;\n  background-color: #fff;\n  border-bottom: 0.01rem solid #ddd;\n  display: -ms-flexbox;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: justify;\n  -o-box-pack: justify;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\n.home-page .row-flex a[_v-f8e199ee] {\n  display: block;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  text-align: center;\n  border-left: 0.01rem solid #ddd;\n  margin-bottom: 0.1rem;\n  position: relative;\n  padding-top: 0.05rem;\n}\n.home-page .row-flex a[_v-f8e199ee]:first-child {\n  border-left: none;\n}\n.home-page .row-flex a .font-grey[_v-f8e199ee] {\n  font-size: 0.12rem;\n}\n.home-page .row-flex a .ui-label[_v-f8e199ee] {\n  padding: 0 0.05rem;\n  position: absolute;\n  right: 0;\n  top: 0;\n  margin: 0;\n}\n.home-page .audio-list[_v-f8e199ee] {\n  background-color: #fff;\n}\n.home-avatar-right[_v-f8e199ee] {\n  width: 0.7rem;\n  text-align: right;\n  padding-top: 0.1rem;\n}\n.btn-erweima[_v-f8e199ee],\n.btn-edit[_v-f8e199ee] {\n  display: inline-block;\n  size: 0.35rem 0.4rem;\n  font-size: 0.1rem;\n  text-align: center;\n  overflow: hidden;\n}\n.btn-erweima .icon[_v-f8e199ee],\n.btn-edit .icon[_v-f8e199ee] {\n  background-size: 100%;\n}\n.ui-block[_v-f8e199ee] {\n  padding: 0.2rem;\n}\n.rule-list[_v-f8e199ee] {\n  margin: 0.1rem 0.2rem 0.1rem 0.3rem;\n}\n.rule-list li[_v-f8e199ee] {\n  list-style: disc;\n  margin: 0.05rem 0;\n}\n.font-money[_v-f8e199ee] {\n  line-height: 1;\n}\n.erweima-wrap[_v-f8e199ee] {\n  width: 30%;\n  margin: 0.05rem auto;\n  padding: 0.08rem;\n  background-color: #eee;\n}\n.erweima-wrap img[_v-f8e199ee] {\n  display: block;\n  width: 100%;\n}\n.row-panel[_v-f8e199ee] {\n  border-bottom: 0.01rem solid #ddd;\n}\n.row-panel .panel-title[_v-f8e199ee] {\n  font-size: 0.18rem;\n  padding: 0.2rem;\n  padding-left: 0.2rem;\n  border-bottom: 0.01rem solid #ddd;\n}\n.row-panel .panel-content[_v-f8e199ee] {\n  padding: 0 0.4rem;\n}\n.row-panel .panel-content ul li[_v-f8e199ee]:last-child {\n  border-bottom: 0;\n}\n.row-panel .panel-content li[_v-f8e199ee] {\n  padding-bottom: 0.04rem;\n  padding-top: 0.15rem;\n  font-size: 0.16rem;\n  border-bottom: 0.01rem solid #ddd;\n}\n.row-panel .panel-content li[_v-f8e199ee]:after {\n  content: " ";\n  display: block;\n  clear: both;\n}\n.row-panel .panel-content li .check-part[_v-f8e199ee] {\n  width: 0.52rem;\n  height: 0.32rem;\n  border: 1px solid #dfdfdf;\n  outline: 0;\n  border-radius: 16px;\n  box-sizing: border-box;\n  background-color: #dfdfdf;\n  -webkit-appearance: none;\n  position: relative;\n  -webkit-transition: background-color 0.1s, border 0.1s;\n  transition: background-color 0.1s, border 0.1s;\n}\n.row-panel .panel-content li .check-part[_v-f8e199ee]:before {\n  content: " ";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 0.5rem;\n  height: 0.3rem;\n  border-radius: 15px;\n  background-color: #fdfdfd;\n  transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1), -webkit-transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);\n}\n.row-panel .panel-content li .check-part[_v-f8e199ee]:after {\n  content: " ";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 0.3rem;\n  height: 0.3rem;\n  border-radius: 15px;\n  background-color: #fff;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.4);\n  -webkit-transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);\n  transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);\n  transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);\n  transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35), -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);\n}\n.row-panel .panel-content li .check-part[_v-f8e199ee]:checked {\n  border-color: #04be02;\n  background-color: #04be02;\n}\n.row-panel .panel-content li .check-part[_v-f8e199ee]:checked:before {\n  background-color: #04be02;\n}\n.row-panel .panel-content li .check-part[_v-f8e199ee]:checked:after {\n  -webkit-transform: translateX(20px);\n          transform: translateX(20px);\n}'],sourceRoot:"webpack://"}])},183:function(e,t,n){var r=n(158);"string"==typeof r&&(r=[[e.id,r,""]]);n(58)(r,{});r.locals&&(e.exports=r.locals)},216:function(e,t){e.exports=' <div class=bg-white _v-f8e199ee=""> <div class=row-panel v-if="userType!==\'\'" _v-f8e199ee=""> <div class="panel-title font-pink" _v-f8e199ee="">新消息通知设置</div> <div class=panel-content _v-f8e199ee=""> <ul _v-f8e199ee=""> <li _v-f8e199ee=""> <div class=fl _v-f8e199ee="">收到回复</div> <div class=fr _v-f8e199ee=""><input type=checkbox @click="check(items.apply_receive, \'apply_receive\')" :checked=!!items.apply_receive class=check-part _v-f8e199ee=""></div> </li> <li v-if="userType === 1" _v-f8e199ee=""> <div class=fl _v-f8e199ee="">收到提问</div> <div class=fr _v-f8e199ee=""><input @click="check(items.question_receive, \'question_receive\')" :checked=!!items.question_receive type=checkbox class=check-part _v-f8e199ee=""></div> </li> <li _v-f8e199ee=""> <div class=fl _v-f8e199ee="">答案被偷偷听</div> <div class=fr _v-f8e199ee=""><input type=checkbox class=check-part @click="check(items.answer_listen, \'answer_listen\')" :checked=!!items.answer_listen _v-f8e199ee=""></div> </li> </ul> </div> </div> <div class=row-panel v-if="userType!==\'\'" _v-f8e199ee=""> <div class="panel-title font-pink" _v-f8e199ee="">提现通知设置</div> <div class=panel-content _v-f8e199ee=""> <ul _v-f8e199ee=""> <li _v-f8e199ee=""> <div class=fl _v-f8e199ee="">发起提现</div> <div class=fr _v-f8e199ee=""><input type=checkbox class=check-part @click="check(items.withdraw, \'withdraw\')" :checked=!!items.withdraw _v-f8e199ee=""></div> </li> <li _v-f8e199ee=""> <div class=fl _v-f8e199ee="">提现成功</div> <div class=fr _v-f8e199ee=""><input type=checkbox class=check-part @click="check(items.withdraw_success, \'withdraw_success\')" :checked=!!items.withdraw_success _v-f8e199ee=""></div> </li> </ul> </div> </div> <div class="tc pl20 pr20 pb40 pt20" v-if="userType!==\'\'" _v-f8e199ee=""> <input type=button value=保存 @click=save() class="btn btn-primary btn-block" _v-f8e199ee=""> </div> </div> '},235:function(e,t,n){var r,o;n(183),r=n(120),o=n(216),e.exports=r||{},e.exports.__esModule&&(e.exports=e.exports["default"]),o&&(("function"==typeof e.exports?e.exports.options||(e.exports.options={}):e.exports).template=o)}});
//# sourceMappingURL=11.63d1aaa2f786f8b15126.js.map