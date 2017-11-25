var factoryList;
var common = require('common');
var $ = common.jquery;
var pagination = require('pagination');
var dialog = require('dialog');
var layer = require('layer');

var tpl = require('tpl');
var listtpl = require('./src/list-tpl');
var list = $('#list');

goPage(0);

$('.btn').on('click',function(){
    var ops = getBaseFilterParams();
    goPage(0,ops);
});

function getBaseFilterParams(){
    var t = $(".filter .group input").serialize();
    return t==undefined? '':t;
}

function goPage(page){
    $.ajax({
        url:'/org/find/list',
        data:'current='+page+'&size=25&'+getBaseFilterParams(),
        callback: function (data) {
            pagination.init({
                target:'.pager',
                total:data.total,
                eachCount:data.size,
                currentPage:data.current,
                callback:goPage
            });
            list.empty();
            tpl(listtpl).render(data, function (render) {
                list.append(render.replace(/undefined/g,'').replace(/null/g,''));
            });
        }
    });
}

module.exports = factoryList;
