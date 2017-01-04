define("modules/factory-account/0.0.1/index",["common","tpl","pagination","modules/factory-account/0.0.1/src/list-tpl"],function(require,exports,module){function load(page){page=void 0===page?0:page,$.ajax({url:"/org/find/userlist",data:"orgID="+encodeURIComponent(orgId)+"&current="+encodeURIComponent(page)+"&size=1000",callback:function(data){(!data||!data.model||data.model.length<=0)&&saveBtn.hide("fade"),tpl(listtpl).render(data,function(render){list.empty().append(render.replace(/undefined/g,"").replace(/null/g,""))}),pagination.init({target:".pager1",total:data.total,eachCount:data.size,currentPage:data.current,callback:load})}})}function update(){var params=validateParams();params&&void 0!==params&&$.ajax({url:"/org/edit/batchUser",type:"POST",data:"users="+JSON.stringify(params),callback:function(){$.alert("账号信息已更新","s")},error:function(e){$.alert("请求发送失败，请稍后重试，"+e.statusText,"e")}})}function buildParams(){var trs=list.find("tr"),users=[];return $.each(trs,function(idx,tr){var inputs=$(tr).find("input"),user={};$.each(inputs,function(idx,input){user[input.name]=input.value}),users.push(user)}),users}function validateParams(){var errors=$("input.error");if(errors.length>0)return void $.layer.tips("此账号已存在，请重新填写",errors[0]);var users=buildParams();return users.forEach(function(user,i){""==user.loginEmail||/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(user.loginEmail)||($.layer.tips("邮箱格式错误！",$(list.find("tr")[i]).find("input")[1],{tips:1}),users=!1),""==user.loginMobile||/^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/.test(user.loginMobile)||($.layer.tips("手机号码格式错误！",$(list.find("tr")[i]).find("input")[0],{tips:1}),users=!1),1!=user.isChild&&""!=user.loginMobile&&""!=user.loginEmail&&($.layer.tips("主账号只能存在手机账号或者邮箱账号，两者不能同时存在，请删除其中一个！",list.find("tr")[i],{tips:1}),users=!1)}),users}var factoryAccount,common=require("common"),tpl=require("tpl"),pagination=require("pagination"),$=common.jquery,listtpl=require("modules/factory-account/0.0.1/src/list-tpl"),list=$("#list"),saveBtn=$("#savebtn"),orgId=$.utils.getqs("id")||0;if($.layer.config({skin:"layui-layer-molv"}),$.isEmpty(orgId))return void $.keyNotFound();load(0),list.on("change","input",function(){var self=$(this),userId=self.parents("tr").find('input[name="userID"]').val(),val=self.val();$.isEmpty(val)||$.ajax({url:"/org/find/accountIsExist",data:"loginKey="+encodeURIComponent(val)+"&userID="+encodeURIComponent(userId),callback:function(isExist){isExist?($.layer.tips("此账号已存在，请重新填写",self),self.addClass("error")):self.removeClass("error")}})}),list.on("click",".reset",function(){var self=$(this),tr=self.parents("tr"),userId=self.data("id"),mobile=tr.find("input")[0];$.layer.loadPlugin("ext",function(layer){var mobileNo=mobile.value;layer.prompt({value:/^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/.test(mobileNo)?mobileNo:"",maxlength:11,title:"请输入接收密码手机号",btn:["确定填写并发送","取消操作"]},function(value,index,elem){$.ajax({url:"/org/edit/resetPwd",type:"POST",data:"tel="+encodeURI(value)+"&userID="+encodeURI(userId),callback:function(){$.alert("请求已受理，短信可能会有延迟，请告知耐心等候！","s")},error:function(e){$.alert("请求发送失败，请稍后重试，"+e.statusText,"e")}}),$.layer.close(index)}),$(".layui-layer-content").prepend('<p><i class="star">*</i>请填写用来接收账号密码的手机号：</p>').append("<p>注：登录账号和密码信息将会以短信的形式</p><p>发送到填写的手机号上请谨慎操作！！！</p>")})});var tip;list.on("focus",".J_no",function(){tip=$.layer.tips("手机账号和邮箱账号原则上是二选一的！",this,{tips:[1,"#56A6CB"]})}),list.on("blur",".J_no",function(){$.layer.close(tip)}),saveBtn.on("click",function(){update()}),module.exports=factoryAccount});