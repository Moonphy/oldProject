BTR.define(["require","exports","module","../../base/index","../../nav/nav","../../storage/storage"],function(e,t,n){var r=e("../../base/index"),i=r.$,s=e("../../nav/nav"),o=e("../../storage/storage"),u=new s({prev:{text:'<a href="profile.html"><i class="icon iconfont">&#xe61f;</i>返回</a>'},op:{id:"J_edit",text:"修改"},title:"修改个人信息"});u.init(),function(){function a(){var i=t.val(),o=e.val(),u=n.val(),a=s.val();if(r.check.null(i)){r.msg.info("姓名不能为空啊，亲");return}if(r.check.null(o)||o=="-1"){r.msg.info("部门没选呐，亲");return}if(r.check.null(u)){r.msg.info("手机号码不能为空啊，亲");return}if(r.check.null(a)){r.msg.info("邮箱不能为空啊，亲");return}if(!r.check.isEmail(a)){r.msg.info("邮箱格式不对啊，亲");return}var f={deptId:o,email:a,mp:u,userName:i};return r.utils.toQueryString(f)}var e=i("#J_dept"),t=i("#J_name"),n=i("#J_phone"),s=i("#J_email"),u=o.getItem("J_model");u&&(u=JSON.parse(u),t.val(u.userName),n.val(u.mp),s.val(u.email)),r.pageLoaded(),i.ajax({url:"/wx/user/find/depart",success:function(t){r.state.check(t,function(t){t||(t=[]);if(t.length>0){var n="";i.each(t,function(e,t){t.deptId==u.deptId?n+='<option value="'+t.deptId+'" selected="selected">'+t.deptName+"</option>":n+='<option value="'+t.deptId+'">'+t.deptName+"</option>"}),e.append(n)}})}}),i("#J_edit").on(r.events.click,function(){var e=a();if(e==undefined)return;i.ajax({url:"/wx/user/edit/info",data:e,type:"POST",success:function(e){r.state.check(e,function(){r.msg.success("修改成功")})}})})}()});