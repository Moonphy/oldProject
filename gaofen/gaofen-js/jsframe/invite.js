/**
*   ZY 咨询插件
*   xzw 2015-01-09
*/
(function(){

    //在线咨询浮层
    function ZypulginDragBox(opts){
        $.extend(this, {
            view : '',
            iX : '',
            iY : '',
            handler : '',
            initOffset : '',
            isFixed : true,
            dragging : false,
            offDrag : ''//不发生drag事件
        }, opts);
    }

    ZypulginDragBox.prototype = {
        init : function(){
            this.view.appendTo($('body'));

            if(!this.handler) this.handler = this.view;
            var that = this;

            //IE6只要基本功能，不做fixed
            if(navigator.userAgent.indexOf("MSIE 6.0") < 0){
                this.view.css('position','fixed');
            }

            this.handler.mousedown(function(e) {
                var flag = false;
                if(that.offDrag){
                    $.each($(that.offDrag), function(){
                        if($(e.target).closest(this).length){
                            flag = true;
                            return false;
                        }
                    })
                }
                if(flag) return;
                that.dragging = true;
                that.iX = e.clientX - this.offsetLeft;
                that.iY = e.clientY - this.offsetTop;
                this.setCapture && this.setCapture();
                return false;
            });

            document.onmousemove = function(e) {
                if (that.dragging) {
                    var e = e || window.event;
                    var oX = e.clientX - that.iX;
                    var oY = e.clientY - that.iY;
                    that.handler.css({"left":oX + "px", "top":oY + "px"});
                    return false;
                }
            };
            $(document).mouseup(function(e) {
                try{
                    that.dragging = false;
                    that.handler[0].releaseCapture && that.handler[0].releaseCapture();
                    //window.captureEvents && window.captureEvents();
                    e.cancelBubble = true;
                }catch(e){}

            })
            this.show();
            this.afterInit();
            if(this.initOffset){
                this.view.offset(this.initOffset);
            }
        },

        setCookie : function(){
            // var date = new Date();
            // date.setHours(23);
            // date.setMinutes(59);
            // date.setSeconds(59);
            // date.setMilliseconds(59);
            // time = date.getTime();
            // var now = time-(+new Date);

            // $.cookie('showDragBox', 1, {expires:now/60/60/1000/24});
             setcookie('showDragBox', 1, 60*60*24);
        },

        close : function(){
            this.view.remove();
        },

        show : function(){
            this.view.show();
        },

        afterInit : function(){}
    }

    //运行主程序
    var initPulgin = function(){

        if(!document.getElementById('qqInviteJs')){
            $('head').append('<script id="qqInviteJs" charset="utf-8" src="http://wpa.b.qq.com/cgi/wpa.php"><\/script>');
        }

        if(!getcookie('showDragBox')){

            var wh = $(window).height();
            new ZypulginDragBox({
                view : $('<div id="InviteWindow" class="plugin-invite">' +
                            '<div class="plugin-invite-cont">' +
                                '<p>亲爱的同学/家长，寒假招生已经开始啦，如需咨询课程，请点击【接受】与老师对话。</p>' +
                            '</div>' +
                            '<div class="plugin-invite-actions"><a id="accept" href="javascript:void(0);">接&nbsp;受</a><a id="cancel" href="javascript:void(0);">忽&nbsp;略</a></div>' +
                        '</div>'),
                initOffset : {top:(wh-159)/2, left:($(window).width()-459)/2},
                offDrag : $('#InviteWindow').find('#accpet,#cancel'),
                afterInit : function(){
                    var that = this;
                    this.view.find('#cancel,#accept').on('click', function(){

                        setTimeout(function(){
                            that.setCookie();
                            that.close();

                        }, 1);
                    });
                }
            }).init();
            //弹出QQ咨询层
            var loopQQ = function(){
                if(typeof(BizQQWPA) === 'undefined'){
                    setTimeout(loopQQ, 100);
                }else{
                     try{
                         BizQQWPA.addCustom({aty: '0', a: '0', nameAccount: 4008809880, selector: 'accept'});
                     }catch(e){}
                }
             };
            loopQQ();
        }

    }


    if(!document.getElementById('jquery190')){
        var script = document.createElement('script');
        script.src = 'http://apps.bdimg.com/libs/jquery/1.9.0/jquery.min.js';
        script.id = 'jquery190';
        document.body.appendChild(script);
     }

    var setcookie = function(cookieName, cookieValue, seconds, path, domain, secure) {
        var expires = new Date();
        expires.setTime(expires.getTime() + seconds);
        document.cookie = cookieName + '=' + encodeURIComponent(cookieValue)
        + (expires ? '; expires=' + expires.toGMTString() : '')
        + (path ? '; path=' + path : '/')
        + (domain ? '; domain=' + domain : '')
        + (secure ? '; secure' : '');
    }


    var getcookie = function(name) {
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


    var loopJquery = function(){
        if(typeof(jQuery) === 'undefined'){
            setTimeout(loopJquery, 100);
        }else{
            initPulgin();
        }
    }

    var loadCssFile = function (filename) {
        var cssFile = document.createElement("link");
        cssFile.setAttribute("rel", "stylesheet");
        cssFile.setAttribute("type", "text/css");
        cssFile.setAttribute("href", filename);
        document.head.appendChild(cssFile);
    }

    loadCssFile('http://www.zy.com/content/style/plugins/invite/main.css');

    loopJquery();

})();
