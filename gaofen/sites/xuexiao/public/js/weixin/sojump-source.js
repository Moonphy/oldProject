/**
 * 海外生存大作战
 */
"use strict";
(function($, win, G){
    var weixinReadyCallback;

    G.event({eventType:'touchend', pd:false, sp:false});
    G.actions.reg('register', function(evt, obj) {

    });

    //微信JDK(分享)
    setTimeout(function(){
        var _shareInfo = G.PD.get('wxconfig');
        var totalValue = G.PD.get('totalvalue');

        var title = '我参加了广州课外辅导满意度打分';
        if (parseInt(totalValue) > 1) {
            title = '我给广州课外辅导满意度打'+totalValue+'分';
        }

        if(!_shareInfo) return;
        GWX.wxready({
            debug: false,
            appId: _shareInfo.appId,
            timestamp: _shareInfo.timestamp,
            nonceStr: _shareInfo.nonceStr,
            signature: _shareInfo.signature,
            title: title, // 分享标题
            desc: '你也来为广州课外辅导满意度打个分吧。', // 分享描述
            link: location.href,// 分享链接
            imgUrl: 'http://file.gaofen.com/html/weixin/sojump/img/share-logo.png' // 分享图标
        }, function(){
            weixinReadyCallback && weixinReadyCallback();
        }, function(config){
            wx.onMenuShareAppMessage({
                title: config.title, // 分享标题
                desc: config.desc, // 分享描述
                link: config.link+'&type=1', // 分享链接
                imgUrl: config.imgUrl // 分享图标
            });
            wx.onMenuShareTimeline({
                title: config.title, // 分享标题
                desc: config.desc, // 分享描述
                link: config.link+'&type=2', // 分享链接
                imgUrl: config.imgUrl // 分享图标
            });
            wx.onMenuShareQQ(config);
        });
    }, 100);
})(Zepto, window, Gaofen);
