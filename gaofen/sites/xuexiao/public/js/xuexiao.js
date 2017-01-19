/*!
 * xuexiao	
 * 列表方式加载便于开发模式下调试脚本。
 */
(function(list){
	// 是否打开调试模式
	__debug = true;

    var s = [],
        uri = location.href.toLowerCase(),
		filePath = 'http://dev.xuexiao.gaofen.com/public/js',
        //加载的js文件列表
        list = [
			'jq/jquery.js',
			'base.js',
			'frontbase.js',
            'http://dev.gaofenjs.com/jsframe/compatible.js'
        ];
    if(uri.indexOf('/cz/') > -1 || uri.indexOf('/chuzhong/') > -1){//初中
    	list.push('czfront.js');
    }else if(uri.indexOf('/gz/') > -1 || uri.indexOf('/middle') > -1){//高中
    	list.push('gzfront.js');
    }else{//暂时没有就用初中

    }
    var v = '11.0';
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

