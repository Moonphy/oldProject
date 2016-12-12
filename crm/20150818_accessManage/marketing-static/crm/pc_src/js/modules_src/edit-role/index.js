var editRole;
var common = require('common');
var $ = common.jquery;

var id = $.utils.getqs('id');
if($.isEmpty(id)){
    $.keyNotFound();
    return;
}

$('#backBtn').on('click',function(){
    window.history.back();
});


function load(id,callback){
	$.ajax({
		url:'/auth/edit/role',
		data:'roleId='+id,
		errorMsg:'获取岗位现有信息失败！',
		callback:function(data){
			callback.call(this,data);
		}
	});
}

function loadAllRole(callback){
	$.ajax({
		url:'/auth/find/AllRoleNameList',
		errorMsg:'获取所有岗位列表失败！',
		callback:function(data){
			callback.call(this,data);
		}
	})
}

var roleCode = $('#roleCode');
var roleName = $('#roleName');
var state = $('#state');
var roleId = $('#roleId');
var parentId = $('#parentId');

loadAllRole(function(data){
	var tmp = '';
	for (var i = 0; i < data.length; i++) {
		var mo = data[i];
		tmp += '<option value="'+mo.roleId+'">'+mo.roleName+'</option>';
	}
	$('#parentId').empty().append(tmp);

	load(id,function(data){
		roleCode.val(data.roleCode);
		roleName.val(data.roleName);
		state.val(data.state);
		roleId.val(data.roleId);
		parentId.val(data.parentId);
	});
});


$('#submitBtn').on('click',function(){
	if($.isEmpty(id)){
        layer.tips('id丢失！不能提交，请刷新重试',roleId);
        return;
    }
    if($.isEmpty(roleCode.val())){
        layer.tips('请输入岗位编码',roleCode);
        return;
    }
    if($.isEmpty(roleName.val())){
        layer.tips('请输入岗位名称',roleName);
        return;
    }
    if($.isEmpty(parentId.val())){
        layer.tips('请选择上级岗位',parentId);
        return;
    }
    if($.isEmpty(state.val())){
        layer.tips('请选择状态',state);
        return;
    }
    var params = {
    	roleId:id,
    	roleCode:roleCode.val(),
    	roleName:roleName.val(),
    	state:state.val(),
    	parentId:parentId.val()
    };
    $.ajax({
    	url:'/auth/update/role',
    	type:'POST',
    	data:params,
		errorMsg:'更新岗位信息失败！',
		callback:function(data){
			$.alert('岗位信息更新成功！','s');
		}
    });
});

module.exports = editRole;
