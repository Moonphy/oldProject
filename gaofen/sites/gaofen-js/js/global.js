/*
 *@create: lianlong
 *@description 设置cookie
 *@date: 2011/1/5
 */
function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
    var expires = new Date();
    expires.setTime(expires.getTime() + seconds);
    document.cookie = escape(cookieName) + '=' + escape(cookieValue)
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
    var cookie_start = document.cookie.indexOf(name);
    var cookie_end = document.cookie.indexOf(";", cookie_start);
    return cookie_start == -1 ? '' : decodeURI(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
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
}