var menuEdit;
var common = require('common');
var $ = common.jquery;
var layer = require('layer');


 //加载数据
var id = $.utils.getqs('id');
if($.isEmpty(id)){
    $.keyNotFound();
    return;
}

var resourceCode = $('#resourceCode');
var resourceName = $('#resourceName');
var resourceURL = $('#resourceURL');
var resourceMethodType = $('#resourceMethodType');
var parentId = $('#parentId');
var state = $('#state');
var resourceMemo = $('#resourceMemo');

$('#backBtn').on('click',function(){
    window.history.back();
});


function load(id,callback){
	$.ajax({
		url:'/auth/edit/resource',
		data:'resourceId='+id,
		errorMsg:'获取菜单现有信息失败！',
		callback:function(data){
			callback.call(this,data[0] || {});
		}
	});
}


load(id,function(data){
	resourceCode.val(data.resourceCode);
	resourceName.val(data.resourceName);
	resourceURL.val(data.resourceURL);
	resourceMethodType.val(data.resourceMethodType);
	parentId.val(data.parentId);
	state.val(data.state);
	resourceMemo.val(data.resourceMemo);
});


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
    	url:'/auth/update/resource',
    	type:'POST',
    	traditional:true,
    	data:{
    		resourceId:id,
    		resourceCode:resourceCode.val(),
    		resourceName:resourceName.val(),
    		resourceURL:resourceURL.val(),
    		resourceMethodType:resourceMethodType.val(),
    		state:state.val(),
    		parentId:parentId.val(),
    		resourceMemo:resourceMemo.val()
    	},
    	errorMsg:'抱歉，编辑菜单信息失败！',
	    callback: function (data) {
	    	$.alert('菜单信息编辑成功！','s');
	    }
    });

});

module.exports = menuEdit;
