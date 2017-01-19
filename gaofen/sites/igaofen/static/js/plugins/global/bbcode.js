/*
 * 2016-06-17 
 * 文章内容区音频转换
 * 把[audio]xxx[/audio]内的音频地址(不带http://)换成音频播放器
*/
(function(){
	$(function(){
        var contentDom;
        if($('div.markitup-box').length){
            contentDom = $('div.markitup-box').eq(0);
        }else {
            contentDom = $('div.article-content').eq(0);
        }
        var html = contentDom.html(),
       		reg = /\[audio\]([\s\S]*?)\[\/audio\]/gi,
        	arr = re =  [];
        while((re = reg.exec(html)) != null) {
         	arr.push('http://'+re[1]);
        }
        var k = 0, isAudio = typeof(Worker) !== "undefined";
        html = html.replace(reg, function(m){
        	var ms, src = arr[k++];
        	if(src === ''){
        		return  '';
        	} 

        	if(isAudio) {
                ms = '<audio preload="auto" controls preload><source src='+src+' preload/></audio>';
        		// ms = '<audio src='+src+' controls preload></audio>';
        	}else{
        		ms = '<object classid="clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95"><param name="AutoStart" value="1" /><param name="Src" value="'+src+'" /></object>';
        	}
        	return ms;
        });
        contentDom.html(html);
        if(isAudio && k){
            var link = document.createElement('link'); 
            link.type= 'text/css'; 
            link.href= '/static/js/plugins/global/audioplayer.css'; 
            link.rel = 'stylesheet';
            $('head').append(link); 
            $.getScript("/static/js/plugins/global/audioplayer.js",function(){
                    contentDom.find('audio').audioPlayer();
                    contentDom.find('.audioplayer-time-current').hide();
                    contentDom.find('div.audioplayer-time-duration').hide();
            })
        }
	})
})();