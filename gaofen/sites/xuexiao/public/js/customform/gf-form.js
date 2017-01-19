
//提供给后台直接使用
;(function(){
    var iframe = document.createElement('iframe');
    iframe.id= 'gf_custom_frame';
    iframe.src = '';
    iframe.style.height = '300px';
    iframe.style.width = '100%';
    iframe.onload = function(){
        window.addEventListener("message", function( event ) {
            iframe.style.height = (event.data.height || 400)+'px';
        }, false );
        (function(){
            document.getElementById("gf_custom_frame").contentWindow
                .postMessage({
                    host : location.host,
                    msg : 'connect'
                },"http://dev.xuexiao.gaofen.com");
        })();
    }
    document.body.appendChild(iframe);
})();