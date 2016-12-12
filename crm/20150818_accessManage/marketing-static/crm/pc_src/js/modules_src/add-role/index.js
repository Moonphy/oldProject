var addRole;
var common = require('common');
var $ = common.jquery;
var layer = require('layer');

$('#backBtn').on('click',function(){
    window.history.back();
});

var roleCode = $('#roleCode');
var roleName = $('#roleName');
var state = $('#state');
var roleId = $('#roleId');
var parentId = $('#parentId');

function add(params){
	$.ajax({
        url:'/auth/add/role',
        type:'POST',
        data:params,
        errorMsg:'抱歉，添加岗位信息失败！',
        callback: function (data) {
        	$.alert('岗位信息添加成功！','s');
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

loadAllRole(function(data){
	var tmp = '';
	for (var i = 0; i < data.length; i++) {
		var mo = data[i];
		tmp += '<option value="'+mo.roleId+'">'+mo.roleName+'</option>';
	}
	$('#parentId').empty().append(tmp);
});

$('#submitBtn').on('click',function(){

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
    	roleCode:roleCode.val(),
    	roleName:roleName.val(),
    	state:state.val(),
    	parentId:parentId.val()
    };
    add(params);
});

module.exports = addRole;
