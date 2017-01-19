var document_title = document.title;

/*
 * 2016-06-17 
 * 文章内容区音频转换
 * 把[audio]xxx[/audio]内的音频地址(不带http://)换成音频播放器
*/
(function(){
	$(function(){
		var contentDom = $('div.markitup-box').eq(0);
        if(contentDom.length === 0) return;
        var html = contentDom.html(),
       		reg = /\[audio\]([\s\S]*?)\[\/audio\]/gi,
        	arr = re =  [];
        try{
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

        }catch(e){}
	})
})();

$(document).ready(function () {

	// 检测首页动态更新
	if (G_USER_ID.length > 0) 
	{
		var checkactionsnew_handle = setInterval(function ()
		{
			check_actions_new(new Date().getTime());
		}, 60000);
	}

	// 滚动指定位置
	if (window.location.hash.indexOf('#!') != -1)
	{
		if ($('a[name=' + window.location.hash.replace('#!', '') + ']').length)
		{
			$.scrollTo($('a[name=' + window.location.hash.replace('#!', '') + ']').offset()['top'] - 20, 600, {queue:true});
		}
	}

	// 验证码自动点击
	$('#captcha').click();

	// 导航条小箭头位置修复
	$('.nav .triangle').css('left', $('.nav li').innerWidth()/2 - 8);

	// 导航条按钮
	$('.nav ul li .user').click(function()
	{
		$(this).parents('.nav').find('.aw-popover.more').hide();
		$('.nav ul li .more .triangle').hide();
		$('.nav ul li .more').removeClass('active');

		if ($(this).parents('li').find('.triangle').css('display') == 'none')
		{
			$(this).parents('li').find('.triangle').show();
			$(this).parents('.nav').find('.aw-popover.user').show();
			$(this).addClass('active');
		}
		else
		{
			$(this).parents('li').find('.triangle').hide();
			$(this).parents('.nav').find('.aw-popover.user').hide();
			$(this).removeClass('active');
		}
	});

	$('.nav ul li .more').click(function()
	{
		$(this).parents('.nav').find('.aw-popover.user').hide();
		$('.nav ul li .user .triangle').hide();
		$('.nav ul li .user').removeClass('active');

		if ($(this).parents('li').find('.triangle').css('display') == 'none')
		{
			$(this).parents('li').find('.triangle').show();
			$(this).parents('.nav').find('.aw-popover.more').show();
			$(this).addClass('active');
		}
		else
		{
			$(this).parents('li').find('.triangle').hide();
			$(this).parents('.nav').find('.aw-popover.more').hide();
			$(this).removeClass('active');
		}
	});

	// textarea自动增加高度
	$('.autosize').autosize();

	// 问题评论box
	AWS.Init.init_comment_box('.aw-add-comment');

	// 文章评论box
	AWS.Init.init_article_comment_box('.aw-article-comment');

	// 话题编辑box
	AWS.Init.init_topic_edit_box('.aw-topic-bar .icon-inverse');

	// 搜索下拉菜单
	AWS.Dropdown.bind_dropdown_list('.aw-search-bar input','search');

	// 私信搜索下拉菜单
	AWS.Dropdown.bind_dropdown_list('.aw-inbox-search-bar input','message');

	// 邀请下拉菜单
	AWS.Dropdown.bind_dropdown_list('.aw-invite-box input','invite');

	// 话题编辑删除按钮
	$(document).on('click', '.aw-topic-bar .tag-bar .topic-tag i', function()
	{
		var _this = $(this);
		$.post(G_BASE_URL + '/topic/ajax/remove_topic_relation/', {'type':$(this).parents('.aw-topic-bar').attr('data-type'), 'item_id' : $(this).parents('.aw-topic-bar').attr('data-id'), 'topic_id' : $(this).parents('.topic-tag').attr('data-id')} , function (result)
		{
			if (result.errno == 1)
			{
				_this.parents('.topic-tag').detach();
			}else
			{
				alert(result.err);
			}
		}, 'json');
		return false;
	});

	//邀请回答按钮
	$('.aw-invite-replay').click(function()
	{
		if ($(this).parents('.aw-question-detail').find('.aw-invite-box').is(':visible'))
		{
			$(this).parents('.aw-question-detail').find('.aw-invite-box').hide();
			$(this).removeClass('active');
		}else
		{
			$(this).parents('.aw-question-detail').find('.aw-invite-box').show();
			$(this).addClass('active');
		}
	});

	function check_actions_new(time)
	{
		$.get(G_BASE_URL + '/home/ajax/check_actions_new/time-' + time, function (result)
		{
			if (result.errno == 1)
			{
				if (result.rsm.new_count > 0)
				{
					if ($('#new_actions_tip').is(':hidden'))
					{
						$('#new_actions_tip').css('display', 'block');
					}

					$('#new_action_num').html(result.rsm.new_count);

					$('.nav .new-action').show();
				}
			}
		}, 'json');
	}

	// textarea获取焦点时兼容导航溢出
	$('textarea').bind({
		focus : function()
		{
			$('.nav').css({
	        	'position' : 'relative',
	        	'bottom' : - (parseInt($(document).height()) - parseInt($('.nav').offset().top))
	        });

	        $('body').addClass('focus');
		},

		blur : function()
		{
			$('.nav').css({
	        	'position' : 'fixed',
	        	'bottom' : 0
	        });

	        $('body').removeClass('focus');
		}
	})

});