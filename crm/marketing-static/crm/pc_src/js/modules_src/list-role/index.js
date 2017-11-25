var listRole = {};
var common = require('common');
var $ = common.jquery;
var pagination = require('pagination');
var layer = require('layer');
var tpl = require('tpl');
var listtpl = require('./src/list-tpl');
var list = $('#list');

listRole.load = function(page){
	$.ajax({
        url:'/auth/find/roleList',
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
                callback:listRole.load
            });
        }
    });
}

listRole.del = function(id){
    layer.confirm('是否确认删除此岗位？',{icon: 3, title:'提示'},function(index){
        $.ajax({
            url:'/auth/del/role',
            type:'POST',
            data:'roleId='+id,
            errorMsg:'删除失败！',
            callback:function(data){
                $.alert('已成功删除！','s');
                listRole.load(($('.gn-current').text()-1) || 0);
            }
        });
    });
}

$('body').on('click','.delbtn',function(){
    listRole.del($(this).data('id'));
});

$('#querybtn').on('click',function(){
    listRole.load(0);
});

$('#addbtn').on('click',function(){
    window.location.href = 'add.do';
});

listRole.load(0);

module.exports = listRole;
