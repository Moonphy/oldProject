BTR.define(["require","exports","module","../../base/index","../../nav/nav"],function(e,t,n){var r=e("../../base/index"),i=r.$,s=e("../../nav/nav"),o=new s({prev:{id:"J_prev",text:'<i class="icon iconfont">&#xe61f;</i>返回'},title:"任务事项-详情",op:{id:"J_complete",text:"完成"}});o.init(),i(function(){var e=r.utils.mapQuery(window.location.search),t=["planTime","mfctyName","state","taskName"],n=e.taskid;if(n==undefined){r.msg.error("TaskId丢失，请返回重试");return}i.ajax({url:"/wx/task/find/specifiTask",data:"taskID="+n,success:function(e){r.state.check(e,function(e){e||(e=[]);if(e.length>0){e=e[0];var r=i(".value");i.each(r,function(r,s){if(r==1)i(s).html('<a class="factoryurl" href="../factory/index.html?id='+e.custID+"&taskId="+n+"&custID="+e.custID+"&factory="+encodeURI(e.mfctyName)+'">'+e[t[r]]+"</a>");else if(r==2){var o=e[t[r]];i(s).text(o==0?"未完成":o==1?"已取消":o==2?"已过期":o==3?"已完成":"未知"+o),o==3&&i("#J_complete").hide()}else i(s).text(e[t[r]])})}})}}),i("#J_prev").on("click",function(){history.back()}),i("#J_complete").on(r.events.click,function(){i.ajax({url:"/wx/task/update/taskState",data:"tasKID="+n,type:"POST",success:function(e){r.state.check(e,function(){r.msg.success("操作成功，感谢使用",2e3,function(){location.href="list.html"})})}})}),r.pageLoaded()})});