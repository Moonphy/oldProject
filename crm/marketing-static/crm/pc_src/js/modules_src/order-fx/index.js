var orderFx;
var common = require('common');
var $ = common.jquery;
var layer = $.layer;
var moment = require('moment');
var loadcity = require('loadcity');
var pagination = require('pagination');
var laydate = require('laydate');

//DOMS
var dataPicker = $('.datepicker'),
    startDate = $('#startDate'),
    endDate = $('#endDate'),
    list = $('#list'),
    province = $('#province'),
    city = $('#city'),
    area = $('#area'),
    orderCol1 = $('#orderCol1'),
    cache = {params:{}};

//事件绑定
var _start = {
    elem: '#startDate',
    format: 'YYYY-MM-DD',
    event: 'focus',
    choose: function(datas){
        _end.min = datas;
        _end.start = datas;
    }
};
var _end = {
    elem: '#endDate',
    event: 'focus',
    choose: function(datas){
        _start.max = datas;
    }
};

laydate(_start);
laydate(_end);

$('#query').on('click', function () {
    load();
});

orderCol1.on('change',function(){
    load();
});

$('.timebtn').on('click','button.item',function(e){
    var _self = $(this);
    var _siblings = _self.siblings();
    if(_self.hasClass('active')){
        dataPicker.removeAttr('disabled','none');
    }else{
        dataPicker.attr('disabled','disabled');
    }
    _siblings.removeClass('active').find('.arrow-up').addClass('fn-hide');
    _siblings.find('.arrow-text').addClass('fn-hide');
    _self.toggleClass('active').find('.arrow-up').toggleClass('fn-hide');
    _self.find('.arrow-text').toggleClass('fn-hide');
    //如果选择了时间区间，而不是的自定义时间区间的话，会将选择的时间区间设置在dataPicker的data上
    var day = _self.data('day');
    var today = moment().format('YYYY-MM-DD');
    var date = moment().subtract(day, 'days').format('YYYY-MM-DD');
    var yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    //console.log(day,date,day>0?yesterday:today);
    var end = day>0?yesterday:today;
    dataPicker.eq(0).data('date',date);
    dataPicker.eq(1).data('date',end);
    $('#startDate').val(date);
    $('#endDate').val(end);
});

$('button.item').eq(0).trigger('click');

province.on('change',function(){
    var val = province.val();
    city.find(':not(:first)').remove();
    area.find(':not(:first)').remove();
    if(val){
        loadcity.loadCity(city,val);
    }
});
city.on('change', function () {
    var val = city.val();
    if(val) {
        area.find(':not(:first)').remove();
        loadcity.loadArea(area, val);
    }
});

//函数
function getBaseFilterParams(){
    var areastr = $(".filter select").serialize();
    areastr = areastr ==undefined? '':areastr;
    return areastr+'&'+getDateFilterParams()+'&'+getOrderByFilterParams();
}

function getDateFilterParams(){
    var datestr = '';
    var btn = $(".filter button.active");
    if(btn.length<=0){
        datestr = $(".filter input").serialize();
    }else{
        datestr = 'start='+startDate.data('date')+'&end='+endDate.data('date');
    }
    return datestr ==undefined? '':datestr;
}

function getOrderByFilterParams(){
    var sortBy = orderCol1.val();
    return sortBy;
}

//加载主页面列表
function load(page){
    page = page==undefined?0:page;
    $.ajax({
        url:'/statisticsTrade/find/InquiryForTradeAnalyse',
        data:getBaseFilterParams()+'&size=10&current='+ page,
        errorMsg:'抱歉，拉取数据失败',
        callback:function(mode){
            var tmp = '';
            if(!mode.model || mode.model.length<=0){
                list.empty().append(['<tr class="nodata">',
                    '<td colspan="5">没有符合条件的数据</td>',
                    '</tr>'].join(''));
                return;
            }
            $.each(mode.model,function(idx,model){
                var statisticsTrade = model.statisticsTradeEntity;
                var statisticsInqueryEntity = statisticsTrade.statisticsInqueryEntity;
                tmp+=['<tr class="data">',
                    '<td>',
                    model.cityName,
                    '</td>',
                    '<td>',
                    statisticsInqueryEntity.inqueryToOrderRatio,
                    '</td>',
                    '<td>',
                    statisticsInqueryEntity.inqueryAllNum,
                    '</td>',
                    '<td>',
                    statisticsTrade.regTimeToFirstTradeInqueryNum,
                    '</td>',
                    '<td>',
                    statisticsTrade.sensitizeTimeToFirstTradeInqueryNum,
                    '</td>',
                    '</tr>'].join('');
            });
            list.empty().append(tmp);
            pagination.init({
                target:'.pager1',
                total:mode.total,
                eachCount:mode.size,
                currentPage:mode.current,
                callback:load
            });
        }
    });
}

//初始化
load();
loadcity.loadProvince(province);

module.exports = orderFx;
