var menuEdit;

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
		chkboxType: { "Y" : "ps", "N" : "ps" }
	},
	data: {
		key:{
			checked:"checked",
			children:"subDTO",
			name:"resourceName",
			title:"resourceCode",
			url:"resourceURL"
		},
		simpleData: {
			enable: true
		}
	}
};

function getMenusByRoleId(id,callback){
	$.ajax({
		url:'/auth/find/roleHoldResourceList',
		data:'roleId='+id,
		errorMsg:'获取岗位现有菜单失败！',
		callback:function(data){
			callback.call(this,data);
		}
	});
}

function getAllMenus(callback){
	$.ajax({
		url:'/auth/find/resourceTree',
		errorMsg:'抱歉，拉取菜单树失败！',
	    callback: function (data) {
	    	callback.call(this,data);
	    }
	});
}

getAllMenus(function(allmenus){
	
	var tree = ztree.init($("#tree"),setting,allmenus.subDTO);
	//自动展开所有节点
	tree.expandAll(true);

	getMenusByRoleId(id,function(imenus){
		if(imenus && imenus.length>0){
			//需要选中的id
			var needchecked = [];
			for (var i = 0; i < imenus.length; i++) {
				needchecked.push(imenus[i].resourceId);
			}
			//根据id筛选出需要选中的node
			var nodes = tree.getNodesByFilter(function(node) {
			    return (node.level == 2 && needchecked.indexOf(node.resourceId)!=-1);
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
	    	return node.checked==true || node.halfCheck==true;
	    });
	    var ids = [];
	    for (var i = 0; i < nodes.length; i++) {
	    	var node = nodes[i];
	    	ids.push(node.resourceId);
	    }
	    $.ajax({
	    	url:'/auth/update/roleHoldResource',
	    	type:'POST',
	    	traditional:true,
	    	data:{
	    		roleId:id,
	    		resourcesJson:JSON.stringify(ids)
	    	},
	    	errorMsg:'抱歉，菜单分配失败！',
		    callback: function (data) {
		    	$.alert('菜单信息分配成功！','s');
		    }
	    });

	});

});




module.exports = menuEdit;
