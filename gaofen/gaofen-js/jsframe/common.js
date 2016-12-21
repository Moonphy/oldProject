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
			'common-source.js',
			'compatible.js'//公共功能兼容两套js功能，为避免功能重复编写
        ];

    var v = '1.0';
        for(var i=0,len=list.length;i<len;i++){
		var path = filePath+'/'+list[i];
        var oScript = document.createElement("script");
		oScript.type = "text/javascript";
        oScript.src = path+'?v='+v;
        s.push('<script charset="utf-8" type="text/javascript" src="'+path+'?v='+v+'"></script>');
    }

	document.write(s.join(''));
    
})();

