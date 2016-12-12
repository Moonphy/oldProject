var editRoleUser;

var common = require('common');
var $ = common.jquery;
var ztree = require('ztree');
ztree.loadPlugin('excheck');

var id = $.utils.getqs('id');
if($.isEmpty(id)){
    $.keyNotFound();
    return;
}

$('#backBtn').on('click',function(){
    window.history.back();
});

var setting = {
	check: {
		enable: true,
		chkboxType: { "Y" : "", "N" : "" }
	},
	data: {
		key:{
			checked:"checked",
			children:"subDTO",
			name:"roleName",
			title:"roleName",
			url:""
		},
		simpleData: {
			enable: true
		}
	}
};

function getRolesByUserId(id,callback){
	$.ajax({
		url:'/auth/find/userPlayRoleList',
		data:'userId='+id,
		errorMsg:'获取用户现有岗位失败！',
		callback:function(data){
			callback.call(this,data);
		}
	});
}

function getAllRoles(callback){
	$.ajax({
		url:'/auth/find/roleTree',
		data:'userId='+id,
		errorMsg:'抱歉，拉取岗位树失败！',
	    callback: function (data) {
	    	callback.call(this,data);
	    }
	});
}

getAllRoles(function(allroles){
	
	var tree = ztree.init($("#tree"),setting,allroles.subDTO);
	//自动展开所有节点
	tree.expandAll(true);
	getRolesByUserId(id,function(iroles){
		if(iroles && iroles.length>0){
			//需要选中的id
			var needchecked = [];
			for (var i = 0; i < iroles.length; i++) {
				needchecked.push(iroles[i].roleId);
			}
			//根据id筛选出需要选中的node
			var nodes = tree.getNodesByFilter(function(node) {
			    return (needchecked.indexOf(node.roleId)!=-1);
			});
			for (var i=0, l=nodes.length; i < l; i++) {
				tree.checkNode(nodes[i],true,true,false);
			}
		}
		//禁用state=1的节点
		var nodes = tree.getNodesByFilter(function(node){
	    	return node.state==1;
	    });
	    for (var i=0, l=nodes.length; i < l; i++) {
			tree.setChkDisabled(nodes[i], true);
		}
	});

	$('#submitBtn').on('click',function(){
	    var nodes = tree.getNodesByFilter(function(node){
	    	console.log(node);
	    	return node.checked==true;
	    });
	    var ids = [];
	    for (var i = 0; i < nodes.length; i++) {
	    	var node = nodes[i];
	    	ids.push(node.roleId);
	    }
	    $.ajax({
	    	url:'/auth/update/userPlayRole',
	    	type:'POST',
	    	traditional:true,
	    	data:{
	    		userId:id,
	    		rolesJson:JSON.stringify(ids)
	    	},
	    	errorMsg:'抱歉，岗位分配失败！',
		    callback: function (data) {
		    	$.alert('用户岗位分配成功！','s');
		    }
	    });

	});

});

module.exports = editRoleUser;
