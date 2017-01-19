/**
 * Created by zhiwen on 2015-05-29.
 * huodong 手机端活动
 */

"use strict";

(function(win, $, G){
	$.extend($.fn, {
		display : function(b){
			    var len = this.length, jq;
			    if(len){
			        if(len === 1){
			            if(b === undefined){
			                var v = !this.hasClass('hidden');
			                return v;
			            }else {
			                if(b) this.removeClass('hidden');
			                else this.addClass('hidden');
			            }
			        }else {
			            this.each(function(){
    			            if(b) $(this).removeClass('hidden');
			                else $(this).addClass('hidden');
			            });
			        }
			    }
			    return this;
			},
	});
	//slider
	(function(){
		var sliderBox = $('#sliderBox'),
			slider = sliderBox.find('.slides'),
			sliderInfo = sliderBox.find('.slide-info'),
			index = 2,
			lis = '',
			insert = function(dom, target, func){
				dom[func](target);
			}
			;
		if(false){
			//假数据
			var imgs = ['http://localhost:8880/img/bing-1.jpg','http://localhost:8880/img/bing-2.jpg','http://localhost:8880/img/bing-3.jpg','http://localhost:8880/img/bing-4.jpg'];
			var as = [], _info = sliderInfo.find('a');
			for(var i=0;i<3;i++){
				as.push('<a href="#"><img src="'+imgs[i]+'"/></a>');
				
			}
			slider.html(as.join(''));
			// setTimeout(function(){
				var info = [];
				sliderInfo.html('');
				for(var i=0;i<slider.children().length;i++)
					sliderInfo.append(_info.clone().addClass('hidden'));
			// }, 100);
			sliderInfo.find('a').eq(index-2).removeClass('hidden');

			//假数据结束
		}
		//clone数据
		var _first = slider.find('a').first(),
			_second = _first.next(),
			isLock = false,
			initLeft = -141,
			auto = true,
			runtime = 3000,
			direction = 'left',
			timer = null,
			itemWidth = 77;

		insert(slider.find('a').last().clone(), slider.find('a').first(), 'insertBefore');

		insert(slider.find('a').last().prev().clone(), slider.find('a').first(), 'insertBefore');

		insert(_first.clone(), slider.find('a').last(), 'insertAfter');
		insert(_second.clone(), slider.find('a').last(), 'insertAfter');
		lis = slider.find('a');
		slider.css('left', -(77*index - 13)+'%');

        var easeOut = function ( t, b, c, d){
            return c*((t=t/d-1)*t*t + 1) + b;
        }

        var revise = function(){
            if(index + 2 === lis.length){
                slider[0].style.left = initLeft + "%";
                index = 2;
            }

            if(index === 1){
                slider[0].style.left = ((lis.length - 3)*itemWidth -13)*-1 + "%";
                index = lis.length - 3;
            }
            // console.log(sliderInfo.find('a:not(class)'))
            sliderInfo.find('a').addClass('hidden');
            sliderInfo.find('a').eq(index-2).removeClass('hidden');
            timer = setTimeout(play, runtime);
        }


        var begin, end, d = 12,t = 0;
        function Run(){
            slider[0].style.left = Math.ceil(easeOut(t,begin, end,d)) + "%";
            if(t<d){ 
            	t++; 
            	requestAnimationFrame(Run);
            	// setTimeout(Run, 5); 
            }else{
            	isLock = false;
                revise();
            }
        }

		sliderBox.on('swipeLeft swipeRight', function(e){
			if(isLock) return;
			clearTimeout(timer);
			// begin = (index * itemWidth -13) * -1;
			if(e.type === 'swipeLeft'){  
				direction = 'left';             
                // end = (++index* itemWidth-13) * -1;
            }else{
            	direction = 'right';
            	// end = (--index* itemWidth -13) * -1;
            }
            // end = end - begin;
            // t = 0;
            // isLock = true;
            // Run();
            play();
        });

        var play = function(){
        	begin = (index * itemWidth -13) * -1;
			if(direction === 'left'){               
                end = (++index* itemWidth-13) * -1;
            }else{
            	end = (--index* itemWidth -13) * -1;
            }
            end = end - begin;
            t = 0;
            isLock = true;
            Run();
        }


        if(auto){//自动播放
        	timer = setTimeout(play, runtime);
        }

        $('#slider_loading').display(0);
        $('#slider_body').display(1);

	})();

	//更多
	var page = 1,
		more = $('#more'),
		noData = false,
		loadLock = false,
		ml = $('#more_loading'),
		setMl = function(p, hasData){
			ml.display(p);
			more.display(hasData && !p);
		};
	var bh = document.body.scrollHeight, wh = $(window).height();

	// G.myFastClick('click', more, function(e){
	var getData = function(){
		setMl(1, true);
		loadLock = true;
		G.Ajax.send(G.PD.get('moreuri'), {page : ++page}, function(r){
			r = JSON.parse(r);
			loadLock = false;
			if(r.errno == '0'){
				var html = r.rst.html;
				$('#event_list').append(html);
				if(html === ''){
					noPage = true;
					setMl(0, false);
				}else{
					setMl(0, true);
				}
				lazy.resetImg();
				$(window).trigger('scroll');
				bh = document.body.scrollHeight;

			}
		})

	// });
	};




	//图片延迟加载
    var lazyload = function(view, match){
        var imgs = [],
            wh = $(window).height(),
            obj = {
                resetImg : function(){//列表再次加载或者分页情况
                    imgs = [];
                    getImgs();
                }
            };

        var getImgs = function(){
            var _imgs = view.find(match);
            // console.log(_imgs)
            $.each(_imgs, function(i, item){
                var jqItem = $(item);
                if(!jqItem.attr('src')){
                    var top = jqItem.offset().top;
                    imgs.push({
                        o : jqItem,
                        top : top
                    })
                }
            });
        }
        var reader = function(scrollTop){
        	var maxDel = [];
            $.each(imgs, function(i, item){
                if(!item.o.attr('src') && item.top <= scrollTop){      	
                    var img = item.o;
                    img.attr('src', img.attr('_src'));
                }
            });
        };

        //初始化
        (function(){
            getImgs();

            $(window).scroll(function(){
                var sh = $(this).scrollTop();
                reader(sh+wh);
            }).trigger('scroll');
        })();

        return obj;
    }


    var lazy, noPage;
    $(function(){
    	$(window).scroll(function(){
			if(!loadLock && !noData){
				var sh = $(this).scrollTop();
				// console.log(bh - sh- wh)
				if(bh - sh - wh< 250 && !noPage){
					getData();
				}
			}
		});
		lazy = lazyload($('#event_list'), 'div.thumb img');
    });
    


})(window, Zepto, Gaofen);