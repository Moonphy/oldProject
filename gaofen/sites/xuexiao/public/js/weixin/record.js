/*!
 * weixin record	
 * 列表方式加载便于开发模式下调试脚本。
 */
(function(list){
	// 是否打开调试模式
	__debug = true;
    var s = [],
        uri = location.href.toLowerCase(),
		filePath = '/public/js',
        //加载的js文件列表
        list = [
			'gmu/zepto.min.js',
            'base.js',
            'weixin/record-source.js'
        ];
    var v = '1.0-'+(+new Date);
    // v = 1.0;
	//异步模式加载脚本需要
    for(var i=0,len=list.length;i<len;i++){
        var path;
        if(list[i].indexOf('http') < 0)
		    path = filePath+'/'+list[i];
        else path = list[i];
        var oScript = document.createElement("script");
		oScript.type = "text/javascript";
        oScript.src = path+'?v='+v;
        s.push('<script charset="utf-8" type="text/javascript" src="'+path+'?v='+v+'"></script>');
    }

	document.write(s.join(''));
    
})();

