/**
 * baike mobile 
 * Created by zhiwen on 2014-9-19.
 */
 
(function(jq, win){
 
	$(function(){
		//模拟点击效果
		$('body').on('tap', 'a', function(e){
			$(e.target).addClass('active');
			setTimeout(function(){$(e.target).removeClass('active')}, 500);
		});	
	
		//切换到PC版
		$('#topc').on('tap', function(e){
			if(/m.gaofen/.test(location.href)){
				var _url = location.href.replace('m.gaofen', 'baike.gaofen').replace('/bk', '');
				location.href = _url.indexOf('?')!==-1 ? _url+'&platform=pc':_url+'?platform=pc';
			}
			e.preventDefault();
		});
		
		/*-----------显示折叠层---------------*/
		var moveStart;
		
		function touchstart(e){
			moveStart = e.touches[0].pageX;			
		}
	
		function cancelScroll(e){
			if(Math.abs(e.touches[0].pageX - moveStart) > 30){
				$('.panel').panel('close');
			}
			e.preventDefault();
		}

		$(document.body).bind('touchstart', touchstart);
		$('.panel').show().panel({
			contentWrap: $('.page-content'),
			close: function(){
				$('.page-content').removeClass('ui-panel-animate').css('-webkit-transform', '');
				$('.header').css('top', 0).css('position', 'fixed');
				$(document.body).unbind('touchmove', cancelScroll);
			},
			beforeopen: function(){
				$('.page-content').addClass('ui-panel-animate');
				$('.header').css('top', $(window).scrollTop() + 'px').css('position', 'absolute');
				$(document.body).bind('touchmove', cancelScroll);
			}
		});
		$('#pannelToggle').on('tap', function(e){
			$('.panel').panel('toggle', 'push', 'left');
		});
		
		
		/*-----------可滚动导航---------------*/
		var nav,
			wh = $(window).width(),
			navW,firstW,lastW,
			getX  = function(){
				var px = nav.$el.find('.ui-scroller').css('-webkit-transform'),
				vs = px.match(/\-?[0-9]+/g);
				if(vs.length){
					//if(Number(vs[0])*-1 > firstW){//左则加
					if(Number(vs[0])*-1 > 15){//左则加
						nav.$el.removeClass('nav-scroll-start');
					}else{
						nav.$el.addClass('nav-scroll-start');
					}
					//if(Number(vs[0])*-1 + wh < navW - lastW){//右则加
					if(Number(vs[0])*-1 + wh < navW - 15){//右则加
						nav.$el.removeClass('nav-scroll-end');
					}else{
						nav.$el.addClass('nav-scroll-end');
					}
					console.log(vs[0]);
				}
			};

		$('.nav-scollable').navigator({
			visibleCount : 0,
			ready : function(){
				this.$el.css('visibility','visible');
				navW = this.$el.children().eq(0).width();
				firstW = this.$el.find('li').eq(0).width();
				lastW = this.$el.find('li').last().width();
				nav = this;
				getX();
				
			},		
			iScroll  : {
				onTouchEnd : function(){
					getX();
				},
				onAnimationEnd : function(){
					getX();
				}
			}
		});
		
		
		
		//内容页描点
		$('#content-list').on('tap click','a', function(e){			
			var jq =  $(this), af = jq.attr('href').replace('#',''), target = $('#'+af);
			if(target.length){
				e.preventDefault();
				var offtop = target.offset().top;
				window.scrollTo(200, offtop - 44);
			}
		});

		//处理iframe 视频
		var entryDetails = $('div.entry-details'), iframes = entryDetails.find('iframe');
		if(iframes.length){
			var wd = entryDetails.width();
			iframes.each(function(i, item){
				$(this).height(wd*0.6224).width('100%');							
			});
		}
		
		
	});

 
})(Zepto, window)
 