var menuList = {};
var common = require('common');
var $ = common.jquery;
var pagination = require('pagination');
var layer = require('layer');
var tpl = require('tpl');
var listtpl = require('./src/list-tpl');
var list = $('#list');

$('#querybtn').on('click',function(){
	menuList.load(0);
});

menuList.load = function(page){
	$.ajax({
        url:'/auth/find/resourceList',
        data:'size=10&current='+page+'&name='+$.trim($('#key').val()),
        errorMsg:'抱歉，拉取数据失败！',
        callback: function (data) {
            list.empty();
            tpl(listtpl).render(data, function (render) {
                list.append(render.replace(/undefined/g,'').replace(/null/g,''));
            });
            pagination.init({
                target:'.pager',
                total:data.total,
                eachCount:data.size,
                currentPage:data.current,
                callback:menuList.load
            });
        }
    });
}

menuList.del = function(id){
     layer.confirm('是否确认删除此菜单？',{icon: 3, title:'提示'},function(index){
        $.ajax({
            url:'/auth/del/resource',
            type:'POST',
            data:'resourceId='+id,
            errorMsg:'删除失败！',
            callback:function(data){
                $.alert('已成功删除！','s');
                menuList.load(($('.gn-current').text()-1) || 0);
            }
        });
    });
}

menuList.load(0);

$('body').on('click','.delbtn',function(){
    menuList.del($(this).data('id'));
});

$('#addbtn').on('click',function(){
    window.location.href = "add.do";
});

module.exports = menuList;
