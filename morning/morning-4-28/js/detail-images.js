// Download by http://www.jb51.net
var suningImages = function(){
	var box = $('.bigImg');
	var image = $('#imageMenu');
	var btn = image.find('li');
	var len = btn.length ;
	var ul = image.find('ul');
	
	return{
		init:function(){
			var that = this ;
			var posx ;
			var posy ;
			var i = 0 ;
			ul.css('width',(len+1)*160);
			image.prev('div').click(function(e){
				//alert($(this));
				if(i<=0){
					return false;
				}
				i--;
				that.scroll(i);
				e.preventDefault();
			});
			
			image.next('div').click(function(e){
				if(i>= parseInt(len/4) || len<=4 ){
					return false;
				}
				i++;	
				that.scroll(i);
				e.preventDefault();
			});
			
			
			btn.each(function(i){
				$(this).find('a').click(function(e){
					index = i ;							 
					that.addbk(i);
					that.loadimg(i);
					e.preventDefault();
				})
			});
			
			
			var index = 0 ;
			box.click(function(e){
				var e = e || window.event ;
				posx = e.clientX ;
				//判断鼠标位置，鼠标位置大于图片1/2处加
				if(posx>document.documentElement.clientWidth/3){
					index++;
					if(index>=len)
					{
						index=0;
						ul.stop().animate({marginLeft: 0 },300);
					}
					that.next(index);
				}else{
					index--;
					if(index<0){
						index=len-1;
						ul.stop().animate({marginLeft: -160*parseInt(index/4)*4 },300);
					}
					that.prev(index);
				}	
				e.preventDefault();
			}).mousemove(function(e){
                var e = e || window.event ;
                posx = e.clientX ;
                if(posx>document.documentElement.clientWidth/3){
                    box.css('cursor','url(images/arr_right.cur),pointer');
                    box.attr('title','点击查看下一张');
                }else{
                    box.css('cursor','url(images/arr_left.cur),pointer');
                    box.attr('title','点击查看上一张');
                }
            });
			
			$(document).keyup(function(e){
				var e = e || window.event ;
				if(e.which == 4){
					index++;
					if(index>=len){
						index=0;
						ul.stop().animate({marginLeft: 0 },300);
					}
					that.next(index);
					
				}else if(e.which== 38 ){
					index--;
					if(index<0){
						index=len-1;
						ul.stop().animate({marginLeft: -160*parseInt(index/4)*4 },300);
					};
					that.prev(index);
				}
			});
			
		},
		loadimg:function(i){
			box.html('<div class="loading"></div>');
			var src = btn.eq(i).find('img').attr('src');
			box.html('<img src = ' +src+'  />' ).find('img').hide();
			box.find('img').fadeIn(250);
		},
		addbk:function(i){
			btn.eq(i).find('a').addClass('on').parent().siblings().find('a').removeClass('on');
		},
		scroll:function(i){
			ul.stop().animate({marginLeft: -160*4*i },300);
		},
		next:function(index){
			var that = this ;
			if(((index)%4)==0){
				ul.stop().animate({marginLeft: -160*(index) },300);
			}
			that.addbk(index);
			setTimeout(function(){that.loadimg(index);},400);
		},
		prev:function(index){
			var that = this ;
			if((index+1)%4==0){
				ul.stop().animate({marginLeft: -160*parseInt(index/4)*4 },300);
			}
			that.addbk(index);
			setTimeout(function(){that.loadimg(index);},400);
		}
	}
};
$(document).ready(function(){
	suningImages().init();	
});
