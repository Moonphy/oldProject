define("gallery/charts/0.0.1/src/adapters/standalone-framework",function(t,e,n){var i=function(){function t(t){function n(t,e,n){t.removeEventListener(e,n,!1)}function r(t,e,n){n=t.HCProxiedMethods[n.toString()],t.detachEvent("on"+e,n)}function s(t,e){var i,s,o,a,h=t.HCEvents;if(t.removeEventListener)i=n;else{if(!t.attachEvent)return;i=r}e?(s={},s[e]=!0):s=h;for(a in s)if(h[a])for(o=h[a].length;o--;)i(t,a,h[a][o])}return t.HCExtended||Highcharts.extend(t,{HCExtended:!0,HCEvents:{},bind:function(t,n){var i,r=this,s=this.HCEvents;r.addEventListener?r.addEventListener(t,n,!1):r.attachEvent&&(i=function(t){t.target=t.srcElement||window,n.call(r,t)},r.HCProxiedMethods||(r.HCProxiedMethods={}),r.HCProxiedMethods[n.toString()]=i,r.attachEvent("on"+t,i)),s[t]===e&&(s[t]=[]),s[t].push(n)},unbind:function(t,e){var o,a;t?(o=this.HCEvents[t]||[],e?(a=i.inArray(e,o),a>-1&&(o.splice(a,1),this.HCEvents[t]=o),this.removeEventListener?n(this,t,e):this.attachEvent&&r(this,t,e)):(s(this,t),this.HCEvents[t]=[])):(s(this),this.HCEvents={})},trigger:function(t,e){var n,i,r,s=this.HCEvents[t]||[],o=this,a=s.length;for(i=function(){e.defaultPrevented=!0},n=0;a>n;n++){if(r=s[n],e.stopped)return;e.preventDefault=i,e.target=o,e.type||(e.type=t),r.call(this,e)===!1&&e.preventDefault()}}}),t}var e,n,r,s=document,o=[],a=[],h={};return Math.easeInOutSine=function(t,e,n,i){return-n/2*(Math.cos(Math.PI*t/i)-1)+e},{init:function(t){s.defaultView||(this._getStyle=function(t,e){var n;return t.style[e]?t.style[e]:("opacity"===e&&(e="filter"),n=t.currentStyle[e.replace(/\-(\w)/g,function(t,e){return e.toUpperCase()})],"filter"===e&&(n=n.replace(/alpha\(opacity=([0-9]+)\)/,function(t,e){return e/100})),""===n?1:n)},this.adapterRun=function(t,e){var n={width:"clientWidth",height:"clientHeight"}[e];return n?(t.style.zoom=1,t[n]-2*parseInt(i._getStyle(t,"padding"),10)):void 0}),Array.prototype.forEach||(this.each=function(t,e){for(var n=0,i=t.length;i>n;n++)if(e.call(t[n],t[n],n,t)===!1)return n}),Array.prototype.indexOf||(this.inArray=function(t,e){var n,i=0;if(e)for(n=e.length;n>i;i++)if(e[i]===t)return i;return-1}),Array.prototype.filter||(this.grep=function(t,e){for(var n=[],i=0,r=t.length;r>i;i++)e(t[i],i)&&n.push(t[i]);return n}),r=function(t,e,n){this.options=e,this.elem=t,this.prop=n},r.prototype={update:function(){var e,n=this.paths,i=this.elem,r=i.element;h[this.prop]?h[this.prop](this):n&&r?i.attr("d",t.step(n[0],n[1],this.now,this.toD)):i.attr?r&&i.attr(this.prop,this.now):(e={},e[this.prop]=this.now+this.unit,Highcharts.css(i,e)),this.options.step&&this.options.step.call(this.elem,this.now,this)},custom:function(t,e,i){var r,s=this,o=function(t){return s.step(t)};this.startTime=+new Date,this.start=t,this.end=e,this.unit=i,this.now=this.start,this.pos=this.state=0,o.elem=this.elem,o()&&1===a.push(o)&&(n=setInterval(function(){for(r=0;r<a.length;r++)a[r]()||a.splice(r--,1);a.length||clearInterval(n)},13))},step:function(t){var e,n,i,r=+new Date,s=this.options,o=this.elem;if(o.stopAnimation||o.attr&&!o.element)e=!1;else if(t||r>=s.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),this.options.curAnim[this.prop]=!0,n=!0;for(i in s.curAnim)s.curAnim[i]!==!0&&(n=!1);n&&s.complete&&s.complete.call(o),e=!1}else{var a=r-this.startTime;this.state=a/s.duration,this.pos=s.easing(a,0,1,s.duration),this.now=this.start+(this.end-this.start)*this.pos,this.update(),e=!0}return e}},this.animate=function(e,n,s){var o,a,h,u,c,p="";e.stopAnimation=!1,("object"!=typeof s||null===s)&&(u=arguments,s={duration:u[2],easing:u[3],complete:u[4]}),"number"!=typeof s.duration&&(s.duration=400),s.easing=Math[s.easing]||Math.easeInOutSine,s.curAnim=Highcharts.extend({},n);for(c in n)h=new r(e,s,c),a=null,"d"===c?(h.paths=t.init(e,e.d,n.d),h.toD=n.d,o=0,a=1):e.attr?o=e.attr(c):(o=parseFloat(i._getStyle(e,c))||0,"opacity"!==c&&(p="px")),a||(a=n[c]),h.custom(o,a,p)}},_getStyle:function(t,e){return window.getComputedStyle(t,void 0).getPropertyValue(e)},addAnimSetter:function(t,e){h[t]=e},getScript:function(t,e){var n=s.getElementsByTagName("head")[0],i=s.createElement("script");i.type="text/javascript",i.src=t,i.onload=e,n.appendChild(i)},inArray:function(t,e){return e.indexOf?e.indexOf(t):o.indexOf.call(e,t)},adapterRun:function(t,e){return parseInt(i._getStyle(t,e),10)},grep:function(t,e){return o.filter.call(t,e)},map:function(t,e){for(var n=[],i=0,r=t.length;r>i;i++)n[i]=e.call(t[i],t[i],i,t);return n},offset:function(t){var e=document.documentElement,n=t.getBoundingClientRect();return{top:n.top+(window.pageYOffset||e.scrollTop)-(e.clientTop||0),left:n.left+(window.pageXOffset||e.scrollLeft)-(e.clientLeft||0)}},addEvent:function(e,n,i){t(e).bind(n,i)},removeEvent:function(e,n,i){t(e).unbind(n,i)},fireEvent:function(t,e,n,i){var r;s.createEvent&&(t.dispatchEvent||t.fireEvent)?(r=s.createEvent("Events"),r.initEvent(e,!0,!0),r.target=t,Highcharts.extend(r,n),t.dispatchEvent?t.dispatchEvent(r):t.fireEvent(e,r)):t.HCExtended===!0&&(n=n||{},t.trigger(e,n)),n&&n.defaultPrevented&&(i=null),i&&i(n)},washMouseEvent:function(t){return t},stop:function(t){t.stopAnimation=!0},each:function(t,e){return Array.prototype.forEach.call(t,e)}}}();n.exports=i});