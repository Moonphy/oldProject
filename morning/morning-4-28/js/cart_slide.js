//shopping-cart-show
$.fn.ckSlide = function(opts){
    opts = $.extend({}, $.fn.ckSlide.opts, opts);
    this.each(function(){
        var slidewrap = $(this).find('.cart_show_good');
        var slide = slidewrap.find('.good');
        var count = slide.length;
        var that = this;
        var index = 0;
        var time = null;
        $(this).data('opts', opts);
        // next
        $(this).parent().find('.cart_up').on('click', function(){
            if(opts['isAnimate'] == true){
                return;
            }

            var old = index;
            if(index >= count - 1){
                index = 0;
            }else{
                index++;
            }
            change.call(that, index, old);
        });
        // prev
        $(this).parent().find('.cart_down').on('click', function(){
            if(opts['isAnimate'] == true){
                return;
            }

            var old = index;
            if(index <= 0){
                index = count - 1;
            }else{
                index--;
            }
            change.call(that, index, old);
        });


        // focus clean auto play
        $(this).on('mouseover', function(){
            if(opts.autoPlay){
                clearInterval(time);
            }
        });
        //  leave
        $(this).on('mouseleave', function(){
            if(opts.autoPlay){
                startAtuoPlay();
            }
        });
        startAtuoPlay();
        // auto play
        function startAtuoPlay(){
            if(opts.autoPlay){
                time  = setInterval(function(){
                    var old = index;
                    if(index >= count - 1){
                        index = 0;
                    }else{
                        index++;
                    }
                    change.call(that, index, old);
                }, 4000);
            }
        }
        // dir
        switch(opts.dir){
            case "Y":
                opts['height'] = $(this).children().children().height();
                slidewrap.css({
                    'height':count * opts['height']
                });
                slide.css({
                    'position':'relative'
                });
                slidewrap.wrap('<div class="ck-slide-dir"></div>');
                slide.show();
                break;
        }
    });
};
function change(show, hide){
    var opts = $(this).data('opts');
    if(opts.dir == 'Y'){
        var Y = show * opts['height'];
        $(this).find('.cart_show_good').stop().animate({'margin-top':-Y}, function(){opts['isAnimate'] = false;});
        opts['isAnimate'] = true
    }else{
        $(this).find('.cart_show_good .good').eq(hide).stop().animate({opacity:0});
        $(this).find('.cart_show_good .good').eq(show).show().css({opacity:0}).stop().animate({opacity:1});
    }
}
$.fn.ckSlide.opts = {
    autoPlay: true,
    dir: 'Y',
    isAnimate: true
};