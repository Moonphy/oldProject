/*!
 * 主站	
 * 列表方式加载便于开发模式下调试脚本。
 */
(function(list){
	// 是否打开调试模式
	__debug = true;

    var s = [],
		//filePath = 'http://file.gaofen.com/html/v5/jsframe',
		filePath = 'http://dev.myweb.com',
		//filePath = '/jsframe',
        //加载的js文件列表
        list = [
			'jquery.js',
			'base/util.js',
			'base/ui.base.js',
			'main/ui.template.js',
			'base/ui.box.js',
			'base/ui.validation.js',
			'base/ui.contextmgr.js',
			'base/ajax.js',
			'base/clickevent.js',
			'base/listener.js',
			'base/jqext.js',
			'main/component.js',
			'main/clicker.js',
			'compatible.js',
			'main/ready.js'
        ];

    var v = '1.0';
	//异步模式加载脚本需要
    for(var i=0,len=list.length;i<len;i++){
		var path = filePath+'/'+list[i];
        var oScript = document.createElement("script");
		oScript.type = "text/javascript";
        oScript.src = path+'?v='+v;
        s.push('<script charset="utf-8" type="text/javascript" src="'+path+'?v='+v+'"></script>');
    }

	document.write(s.join(''));
	return;

	//appendJSc();
	function appendJSc(url, success, error, id){
		if(list.length === 0 )return;
		var  path = filePath+'/'+list.shift();
		 var oScript = document.createElement("script");
		 oScript.type = "text/javascript";
		 oScript.src = path;
		 if (oScript.readyState) {
			 oScript.onreadystatechange = function() {
				 if (oScript.readyState == "loaded"
					 || oScript.readyState == "complete") {
					 oScript.onreadystatechange = null;
					 appendJSc();
				 }
			 };
		 } else {
			 oScript.onload = function() {
				  appendJSc();
			 };
		 }

		 if(id){
			 oScript.id = id;
		 }

		 oScript.onerror = function(){
			 (error || jq.noop)();
		 }

		 document.getElementsByTagName('HEAD').item(0).appendChild(oScript);
	 }
    
})();

