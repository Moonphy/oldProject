$(function () {
    var currYear = (new Date()).getFullYear();
    var opt={};
    opt.date = {preset : 'date'};
    opt.datetime = {preset : 'datetime'};
    opt.time = {preset : 'time'};
    opt.default = {
        theme: 'android-ics light',
        display: 'modal',
        mode: 'scroller',
        dateFormat: 'yyyy-mm-dd',
        lang: 'zh',
        showNow: true,
        nowText: "今天",
        startYear: currYear - 60,
        endYear: currYear
    };

    $("#appDate").mobiscroll($.extend(opt['date'], opt['default']));
});