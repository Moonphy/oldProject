var crmGztj;

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
    list2 = $('#list2'),
    list3 = $('#list3'),
    province = $('#province'),
    city = $('#city'),
    area = $('#area'),
    box2 = $('#box2'),
    box3 = $('#box3'),
    orderCol = $('th[scope="sort"]'),
    orderCol1 = $('#orderCol1'),
    orderCol2 = $('#orderCol2'),
    orderCol3 = $('#orderCol3'),
    breadcrumb1 = $('.breadcrumb1'),
    breadcrumb2 = $('.breadcrumb2'),
    exporting = $('#exporting'),
    exporting_box2 = $('#exporting_box2'),
    cache = {
        params: {}
    };

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

$('#query').on('click', function() {
    load();
});
orderCol.on('click',function(){
    var self = $(this);
    var active = self.hasClass('active');
    var val = self.data('val');
    orderCol.removeClass('active');
    self.addClass(active?'':'active');
    load();
});

orderCol2.on('change', function() {
    load2();
});

$('.timebtn').on('click', 'button.item', function(e) {
    var _self = $(this);
    var _siblings = _self.siblings();
    if (_self.hasClass('active')) {
        dataPicker.removeAttr('disabled', 'none');
    } else {
        dataPicker.attr('disabled', 'disabled');
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
    var end = day > 0 ? yesterday : today;
    dataPicker.eq(0).data('date', date);
    dataPicker.eq(1).data('date', end);
    $('#startDate').val(date);
    $('#endDate').val(end);
});
$('button.item').eq(0).trigger('click');
province.on('change', function() {
    var val = province.val();
    city.find(':not(:first)').remove();
    area.find(':not(:first)').remove();
    if (val) {
        loadcity.loadCity(city, val);
    }
});
city.on('change', function() {
    var val = city.val();
    if (val) {
        area.find(':not(:first)').remove();
        loadcity.loadArea(area, val);
    }
});
//主列表点击tr，展示此地区的详细数据
list.on('click', 'tr', function() {
    var _self = $(this);
    if (_self.hasClass('nodata')) {
        return;
    }
    var areaId = _self.data('area');
    if (areaId == undefined) {
        return;
    }
    var areaName = _self.data('areaname');
    //更新数据
    cache.params.currCityId = areaId;
    cache.params.currCityName = areaName;
    breadcrumb1.text(areaName);
    load2(0, function () {
        //打开弹窗
        box2.show();
        cache.d2 = layer.open({
            type: 1,
            title:'地区详细数据',
            area:'1024px',
            content:$('#box2')
        });
    });
});
/*box2.on('click', '#list2 tr', function() {
    var _self = $(this);
    if (_self.hasClass('nodata')) {
        return;
    }
    var userName = _self.data('username');
    var userId = _self.data('userid');
    cache.params.currUserId = userId;
    breadcrumb2.text(userName);
    load3(0, function () {
        //打开弹窗
        box3.show();
        cache.d3 = layer.open({
            type: 1,
            title:'用户详细数据',
            area:'1024px',
            content:$('#box3')
        });
    });
});

box3.on('click', '.breadcrumb1', function() {
    cache.d3 && layer.close(cache.d3);
});*/

//函数
function getBaseFilterParams() {
    var areastr = $(".filter select").serialize();
    areastr = areastr == undefined ? '' : areastr;
    return areastr + '&' + getDateFilterParams() + '&' + getOrderByFilterParams();
}

function getDateFilterParams() {
    var datestr = '';
    var btn = $(".filter button.active");
    if (btn.length <= 0) {
        datestr = $(".filter input").serialize();
    } else {
        datestr = 'start=' + startDate.data('date') + '&end=' + endDate.data('date');
    }
    return datestr == undefined ? '' : datestr;
}

function getOrderByFilterParams() {
    var sortBy = $('th[scope="sort"].active').data('val') || '';
    return sortBy;
}

function getOrder2ByFilterParams() {
    return orderCol2.val();
}


function loadTop() {
    var keys = ['totalUseCrm', 'totalVisitNum', 'totalTaskNum', 'totalCreateNum'];
    $.ajax({
        url: '/statisticsCrm/find/yesterdayCrmAnalyse',
        callback:function(mode){
            var inner = $('#inner');
            var numbers = inner.find('.number');
            $.each(numbers, function(idx, number) {
                $(number).text(mode[keys[idx]]);
            });
        }
    });
}


//加载主页面列表
function load(page) {
    page = page == undefined ? 0 : page;
    exporting.attr('href','/statisticsCrm/find/crmUserAnalyseExportExcel?'+encodeURI(getBaseFilterParams()));
    $.ajax({
        url: '/statisticsCrm/find/crmUserAnalyse',
        data: encodeURI(getBaseFilterParams() + '&size=10&current=' + page),
        errorMsg:'抱歉，数据加载失败',
        callback:function(mode){
            var tmp = '';
            if (!mode.model || mode.model.length <= 0) {
                list.empty().append(['<tr class="nodata">',
                    '<td colspan="5">没有符合条件的数据</td>',
                    '</tr>'
                ].join(''));
                exporting.hide();
                return;
            }
            exporting.show();
            $.each(mode.model, function(idx, model) {
                var cityDTO = model.cityDTO;
                var statisticsCrmEntity = model.statisticsCrmEntity;
                tmp += ['<tr class="data" data-area="',
                    cityDTO.cityId,
                    '" data-areaname="',
                    cityDTO.cityName,
                    '">',
                    '<td>',
                    cityDTO.cityName,
                    '</td>',
                    '<td>',
                    statisticsCrmEntity.totalUseCrm,
                    '</td>',
                    '<td>',
                    statisticsCrmEntity.totalTaskNum,
                    '</td>',
                    '<td>',
                    statisticsCrmEntity.totalVisitNum,
                    '</td>',
                    '<td>',
                    statisticsCrmEntity.totalCreateNum,
                    '</td>',
                    '</tr>'
                ].join('');
            });
            list.empty().append(tmp);
            pagination.init({
                target: '.pager1',
                total: mode.total,
                eachCount: mode.size,
                currentPage: mode.current,
                callback: load
            });
        }
    });
}

function load2(page,callback) {
    page = page == undefined ? 0 : page;
    exporting_box2.attr('href','/statisticsCrm/find/crmUserAnalyseByCityIDExportExcel?'+encodeURI(getDateFilterParams() + '&' + getOrder2ByFilterParams() + '&cityID=' + cache.params.currCityId));
    $.ajax({
        url: '/statisticsCrm/find/crmUserAnalyseByCityID',
        data: encodeURI(getDateFilterParams() + '&' + getOrder2ByFilterParams() + '&cityID=' + cache.params.currCityId + '&size=10&current=' + page),
        callback:function(mode){
            if (!mode.model || mode.model.length <= 0) {
                list2.empty().append(['<tr class="nodata">',
                    '<td colspan="6">没有符合条件的数据</td>',
                    '</tr>'
                ].join(''));
                exporting_box2.hide();
                return;
            }
            var tmp = '';
            exporting_box2.show();
            $.each(mode.model, function(idx, model) {
                tmp += ['<tr class="data" data-userId="',
                    model.userID,
                    '" data-username="',
                    model.userName,
                    '">',
                    '<td>',
                    model.userName,
                    '</td>',
                    '<td>',
                    model.taskNum,
                    '</td>',
                    '<td>',
                    model.visitCustNum,
                    '</td>',
                    '<td>',
                    model.createMfctyNum,
                    '</td>',
                    '<td>',
                    model.workDay,
                    '</td>',
                    '<td>',
                    model.workTime,
                    '</td>',
                    '<td>',
                    '<a href="mobile/crm/gztj-Bmap.do">查看</a>',
                    '</td>',
                    '</tr>'
                ].join('');
            });
            list2.empty().append(tmp);
            pagination.init({
                target: '.pager2',
                total: mode.total,
                eachCount: mode.size,
                currentPage: mode.current,
                callback: load2
            });
            callback && callback();
        }
    });
}

function load3(page,callback) {
    page = page == undefined ? 0 : page;
    $.ajax({
        url: '/statisticsCrm/find/visitDetailByUserID',
        data: encodeURI(getDateFilterParams() + '&userID=' + cache.params.currUserId + '&size=10&current=' + page),
        callback:function(mode){
            if (!mode.model || mode.model.length <= 0) {
                list3.empty().append(['<tr class="nodata">',
                    '<td colspan="4">没有符合条件的数据</td>',
                    '</tr>'
                ].join(''));
                return;
            }
            var tmp = '';
            $.each(mode.model, function(idx, model) {
                tmp += ['<tr class="data">',
                    '<td>',
                    model.mfctyName,
                    '</td>',
                    '<td>',
                    model.enterTime,
                    '</td>',
                    '<td>',
                    model.leaveTime,
                    '</td>',
                    '<td>',
                    model.content,
                    '</td>',
                    '</tr>'
                ].join('');
            });
            list3.empty().append(tmp);
            pagination.init({
                target: '.pager3',
                total: mode.total,
                eachCount: mode.size,
                currentPage: mode.current,
                callback: load3
            });
            callback && callback();
        }
    });
}

//初始化
loadTop();
loadcity.loadProvince(province);
loadcity.loadAreaFull(function(model){
    province.val(model.proId);
    province.trigger('change');
    load();
});
module.exports = crmGztj;
