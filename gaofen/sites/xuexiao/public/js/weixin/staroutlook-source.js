/**
 * 海外生存大作战
 */
"use strict";
(function($, win, G){
    var weixinReadyCallback;

	$(function(){
		var router = G.PD.get('router');
		switch(router){
			case 'index':
				break;
			case 'registration':
                var links = G.PD.get('links'),
                    canUpdate = G.PD.get('canUpdate'),
                    uinfo = G.PD.get('uinfo'),
                    isSubmitted = false,

                    updateInfo = function(data) {
                        $('.ui-mask').removeClass('hidden');
                        isSubmitted = true;
 
                        $.post(links.register, data, function(res) {
                            isSubmitted = false;
                            $('.ui-mask').addClass('hidden');

                            if($.type(res) !== 'object'){
                                res = JSON.parse(res);
                            }

                            if(res.errno == 0) {
                                $('.form-wrap').addClass('hidden');
                                $('.erweima-wrap').removeClass('hidden');
                                //$('.btn-cancel').removeClass('hidden');
                            } else {
                                alert(res.err);
                            }
                        }, 'json');
                    };
                
                $('#grade').val(uinfo.grade);

                /*
                if (isReg) {
                    $('.form-wrap').addClass('hidden');
                    $('.btn-cancel').removeClass('hidden');
                } else {
                    $('.form-wrap').removeClass('hidden');
                    $('.erweima-wrap').addClass('hidden');
                }
                */

                /*
                if (canUpdate) {
                    $('.btn-update').removeClass('hidden');
                }
                */

                G.event({eventType:'touchend', pd:false, sp:false});
                G.actions.reg('register', function(evt, obj) {
                    if (isSubmitted) {
                        return;
                    }

                    var data = {
                        name: $('#name').val(),
                        grade: $('#grade').val(),
                        cell: $('#cell').val(),
                        qq: $('#qq').val(),
                        province: $('#province').val(),
                        city: $('#city').val(),
                        district: $('#district').val()
                    }, 
                        valid = true,
                        validation = {
                        name: {
                            p: /^.{1,20}$/,
                            m: '学生名字。必填项。不长于20个字。'
                        },
                        grade: {
                            p: /^.{0,10}$/,
                            m: '学生年级。可选项。不长于10个字。'
                        },
                        cell: {
                            p: /^(\d{5,11})?$/,
                            m: '联系号码。可选项。输入你的手机或座机号码。'
                        },
                        qq: {
                            p: /^(\d{5,12})?$/,
                            m: '联系号码。可选项。输入QQ号码。'
                        },
                        province: {
                            p: /^.{0,10}$/,
                            m: '地址：省。可选项。输入你的现居住的省。不长于10个字。'
                        },
                        city: {
                            p: /^.{0,20}$/,
                            m: '地址：市。可选项。输入你的现居住的市。不长于20个字。'
                        },
                        district: {
                            p: /^.{0,20}$/,
                            m: '地址：区。可选项。输入你的现居住的区。不长于20个字。'
                        },
                    }, patt, i;

                    for (i in validation) {
                        patt = new RegExp(validation[i].p);
                        if(!patt.test(data[i])) {
                            valid = false;
                            alert(validation[i].m);
                            break;
                        }
                    }

                    if (valid) {
                       updateInfo(data);
                    }

                }).reg('updateInfo', function(evt, obj) {
                    $('.form-wrap').removeClass('hidden');
                    $('.erweima-wrap').addClass('hidden');

                }).reg('cancel', function(evt, obj) {
                    $('.form-wrap').addClass('hidden');
                    $('.erweima-wrap').removeClass('hidden');

                }).reg('closewin', function(evt, obj) {
                    wx.closeWindow();

                });
			break;
		}

		//微信JDK(分享)
		(function(){
            var _shareInfo = $.extend(G.PD.get('wxconfig'), G.PD.get('wxconfigDetail'));
			if(!_shareInfo) return;

			GWX.wxready({
				debug: false,
			    appId: _shareInfo.appId,
			    timestamp: _shareInfo.timestamp,
			    nonceStr: _shareInfo.nonceStr,
			    signature: _shareInfo.signature,
			    title: _shareInfo.title||'海外生存大挑战', // 分享标题
			    desc: _shareInfo.desc||'我报名了，你还在等什么？', // 分享描述
			    link: _shareInfo.share || location.href,// 分享链接
			    imgUrl: _shareInfo.imgUrl||'http://file.gaofen.com/html/weixin/staroutlook/img/body-title.png' // 分享图标
			}, function(){
				weixinReadyCallback && weixinReadyCallback();
			}, function(config){
				wx.onMenuShareAppMessage({
					title: config.title, // 分享标题
				    desc: config.desc, // 分享描述
				    link: config.link+'&type=chat', // 分享链接
				    imgUrl: config.imgUrl // 分享图标
				});
				wx.onMenuShareTimeline({
					title: config.title, // 分享标题
				    desc: config.desc, // 分享描述
				    link: config.link+'&type=moment', // 分享链接
				    imgUrl: config.imgUrl // 分享图标
				});
				wx.onMenuShareQQ(config);
			});
		})();
	});
})(Zepto, window, Gaofen);
