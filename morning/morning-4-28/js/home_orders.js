var intDiff = parseInt(10000);//倒计时总秒数量

function timer(intDiff){
    window.setInterval(function(){
        var day=0,
            hour=0,
            minute=0,
            second=0;//时间默认值
        if(intDiff > 0){
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        $('#day_show').html(day+' '+"天");
        $('#hour_show').html('<s id="h"></s>'+hour+' '+'时');
        $('#minute_show').html('<s></s>'+minute+' '+'分钟');
        $('#second_show').html('<s></s>'+second+' '+'秒');
        intDiff--;
    }, 1000);
}

!function(){
    laydate.skin('default');//切换皮肤，请查看skins下面皮肤库
    laydate({elem: '#demo'});//绑定元素
}();
//日期范围限制
var start = {
    elem: '#start',
    format: 'YYYY-MM-DD',
    min: '2015-01-01', //设定最小日期为当前日期
    max: '2099-06-16', //最大日期
    istime: true,
    istoday: false,
    choose: function(datas){
        end.min = datas; //开始日选好后，重置结束日的最小日期
        end.start = datas; //将结束日的初始值设定为开始日
    }
};

var end = {
    elem: '#end',
    format: 'YYYY-MM-DD',
    min: '2015-01-01',
    max: '2099-06-16',
    istime: true,
    istoday: false,
    choose: function(datas){
        start.max = datas; //结束日选好后，充值开始日的最大日期
    }
};
laydate(start);
laydate(end);

$(function(){

    timer(intDiff);

    $(".checkins button").click(function() {
        var p = $(this).next();
        var span = p.find("span");
        var num = parseInt(span.text());

        var n = num+1;
        $(span).text(n);
    });

    $(".status select").change(function () {
        $(".status").submit();
    });

    $('#end').on('input propertychange keyup change', function() {
        $("#date").submit();
    });

});