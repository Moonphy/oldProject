var blockData = { numOfCol:4, offsetX: 15, offsetY: 10};


$(function(){

    $(".sec_menu").hover(function(){
        $("#popup_subdivision").css('display','block').slideDown(5000);
    });

    $('goods_little_block').hover(function(){
        $(this).addClass('on');
    },function(){
        $(this).removeClass('on');
    });
    $('.goods_waterfall').BlocksIt(blockData);

});