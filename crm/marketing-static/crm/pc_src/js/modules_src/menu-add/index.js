var menuAdd;
var common = require('common');
var $ = common.jquery;
var layer = require('layer');

$('#backBtn').on('click',function(){
    window.history.back();
});

var resourceCode = $('#resourceCode');
var resourceName = $('#resourceName');
var resourceURL = $('#resourceURL');
var resourceMethodType = $('#resourceMethodType');
var parentId = $('#parentId');
var state = $('#state');
var resourceMemo = $('#resourceMemo');


$('#submitBtn').on('click',function(){

    if($.isEmpty(resourceCode.val())){
        layer.tips('请输入菜单编码',resourceCode);
        return;
    }
    if($.isEmpty(resourceName.val())){
        layer.tips('请输入菜单名称',resourceName);
        return;
    }
    if($.isEmpty(resourceURL.val())){
        layer.tips('请输入菜单URL',resourceURL);
        return;
    }
    if($.isEmpty(resourceMethodType.val())){
        layer.tips('请选择请求类型',resourceMethodType);
        return;
    }
 	if($.isEmpty(parentId.val())){
        layer.tips('请输入父级ID',parentId);
        return;
    }
 	if($.isEmpty(state.val())){
        layer.tips('请选择状态',state);
        return;
    }
 	if($.isEmpty(resourceMemo.val())){
        layer.tips('请输入备注',resourceMemo);
        return;
    }

    $.ajax({
    	url:'/auth/add/resource',
    	type:'POST',
    	traditional:true,
    	data:{
    		resourceCode:resourceCode.val(),
    		resourceName:resourceName.val(),
    		resourceURL:resourceURL.val(),
    		resourceMethodType:resourceMethodType.val(),
    		state:state.val(),
    		parentId:parentId.val(),
    		resourceMemo:resourceMemo.val()
    	},
    	errorMsg:'抱歉，新建菜单失败！',
	    callback: function (data) {
	    	$.alert('新建菜单成功！','s');
	    }
    });

});

module.exports = menuAdd;
