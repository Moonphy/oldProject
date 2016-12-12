var custSearch;

var common = require('common');
var $ = common.jquery;
var moment = require('moment');
var loadcity = require('loadcity');
var pagination = require('pagination');
var layer = require('layer');
var laydate = require('laydate');
var tpl = require('tpl');
//DOMS
var dataPicker = $('.datepicker'),
    startDate = $('#startDate'),
    endDate = $('#endDate'),
    mfctyName = $('#mfctyName'),
    mfctyId = $('#mfctyId'),
    list = $('#list'),
    list2 = $('#list2'),
    list3 = $('#list3'),
    province = $('#province'),
    city = $('#city'),
    area = $('#area'),
    box = $('#box'),
    box2 = $('#box2'),
    breadcrumb1 = $('.breadcrumb1'),
    breadcrumb2 = $('.breadcrumb2'),
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

list.on('click','tr',function(){
    var _self = $(this);
    if(_self.hasClass('nodata')){
        return;
    }
    var mfactyName = _self.data('mfactyname');
    var mfactyId = _self.data('mfactyid');
    cache.params.currMfctyId = mfactyId;
    breadcrumb1.text(mfactyName);
    require.async('./src/list-tpl2', function (tpl) {
        cache.tpl2 = tpl;
        load2(0,function(){
            //打开弹窗
            box.show();
            cache.d = layer.open({
                type: 1,
                title:'详细数据',
                area:'1024px',
                content:$('#box')
            });
        });
    });
});

//函数
function getBaseFilterParams(){
    var val = $.trim(mfctyId.val());
    if(!val){
        $.alert('请输入或选择汽修厂再查询！','i');
        return false;
    }else{
        return "mfctyID="+encodeURIComponent(val)+'&'+getDateFilterParams();
    }
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

//加载主页面列表
function load(page){
    page = page==undefined?0:page;
    var params = getBaseFilterParams();
    if(!params){return;}
    $.ajax({
        url:'/statisticsTrade/find/statisticsOrderAndReturnForTradeAnalyseByMfctyID',
        data:encodeURI(params+'&size=10&current='+ page),
        errorMsg:'抱歉，拉取数据失败',
        callback:function(model){
            list.empty();
            if(!model || model.length<=0){
                list.empty().append(['<tr class="nodata">',
                    '<td colspan="9">没有符合条件的数据</td>',
                    '</tr>'].join(''));
                return;
            }
            list.append(['<tr class="data" data-mfactyId="',
                model.mfctyID,
                '" data-mfactyname="',
                model.mfctyName,
                '">',
                '<td>',
                model.mfctyName,
                '</td>',
                '<td>',
                model.allOrderMoney,
                '</td>',
                '<td>',
                model.orderAllNum,
                '</td>',
                '<td>',
                model.returnGoodsMenoy || 0,
                '</td>',
                '<td>',
                model.returnGoodsNum || 0,
                '</td>',
                '<td>',
                model.orderReturnRatio,
                '</td>',
                '<td>',
                model.returnNumToOrderNumRatio,
                '</td>',
                '</tr>'].join(''));
        }
    });
}

function load2(page,callback){
    page = page==undefined?0:page;
    $.ajax({
        url:'/statisticsTrade/find/statisticsByMfctyID',
        data:encodeURI(getDateFilterParams()+'&mfctyID='+cache.params.currMfctyId+'&size=10&current='+ page),
        callback:function(model){
            list2.empty();

            tpl(cache.tpl2).render(model, function (render) {
                list2.append(render.replace(/undefined/g,'').replace(/null/g,''));
            });

            pagination.init({
                target:'.pager2',
                total:model.total,
                eachCount:model.size,
                currentPage:model.current,
                callback:load2
            });

            callback && callback();
        }
    });
}

//初始化
loadcity.loadProvince(province);

var $searchResults = $('#searchResults');
var $searchResultsList = $('#searchResults ul');

listenChange('mfctyName',loadAccount);

function listenChange(inputId,changeCallback){
    function callback(){
        changeCallback.call(this);
    }
    var element = document.getElementById(inputId);
    if("\v"=="v") {
        element.onpropertychange = callback;
    }else{
        element.addEventListener("input",callback,false);
    }
}

function loadAccount(){
    var self = $(this);
    self.prev('input').val('');
    var key = self.val();
    var top = self.offset().top+36;
    var left = self.offset().left;
    $.ajax({
        url:'/statisticsTrade/search/mainMfcty',
        data:'key='+encodeURIComponent(key),
        callback:function(model){
            if(model.model && model.model.length>0){
                $searchResultsList.empty();
                $.each(model.model,function(idx,data){
                    var li = document.createElement('li');
                    li = $(li).text(data.mfctyName).data('data',data);
                    $searchResultsList.append(li);
                });
                $searchResults.css({
                    top:top,
                    left:left
                }).show();
            }
        }
    })
}

$searchResults.on('click','li',function(){
    var data = $(this).data('data');
    if(data){
        mfctyId.val(data.mfctyID);
        mfctyName.val(data.mfctyName);
    }
});

$(document).on('click',function(e){
    $('#searchResults').hide();
});

module.exports = custSearch;
