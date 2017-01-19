

	$(function(){	
		$('<div style="margin:10px 0;height:35px;line-height:35px;"><input id="isPublishByTime" type="checkbox"> <span>定时发布:</span> <input id="datetimepicker_format" name="publish_time" type="text" style="display:none;width: 220px;height: 33px;line-height: 33px;border-radius: 4px;border: 1px solid #ccc;"></div>').insertAfter('.aw-upload-box');
		var loaded = false, ourl = $('#question_form').attr('action'),
			articleUrl = G_BASE_URL+'/publisher/ajax/publish_article/',
			questionUrl = G_BASE_URL+'/publisher/ajax/publish_question/',
			text = $('div.aw-main-content>ul.aw-nav-tabs>li.active').text(),
			url = text === '文章' ? articleUrl : questionUrl;

		$('#isPublishByTime').on('click', function(e){
			if($(this).prop('checked')){
				if(!loaded){
					loaded = true;
					$('head').append('<link rel="stylesheet" type="text/css" href="/static/js/plugins/publisher/jquery.datetimepicker.css"/>');
					var script = document.createElement('script');
					script.src = '/static/js/plugins/publisher/jquery.datetimepicker.full.js';
					script.onload = function(){
						$('#datetimepicker_format').show().datetimepicker({
							dayOfWeekStart : 1,
							lang:'ch',
							step:10,
							format:'Y-m-d H:i'
						});
					};
					document.body.appendChild(script); 
				}
				$('#datetimepicker_format').removeAttr('disabled').show();

			    //修改表单提交地址
		        $('#question_form').attr('action', url);

			}else{
				$('#datetimepicker_format').attr('disabled',"disabled").hide();
				$('#question_form').attr('action', ourl);
			}
		});

	});

