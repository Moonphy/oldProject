BTR.define(["require","exports","module","../../../../base/index","../../../../nav/nav","../../../problem/icon"],function(e,t,n){var r=e("../../../../base/index"),i=r.$,s=e("../../../../nav/nav"),o=e("../../../problem/icon"),u=new s({prev:{id:"J_prev",text:'<i class="icon iconfont">&#xe61f;</i>问题反馈'},title:"问题详情"});u.init(),i(function(){var e=r.utils.mapQuery(window.location.search);i.ajax({url:"/wx/platFormQuestion/find",data:"feedBackID="+e.id,success:function(e){r.state.check(e,function(e){e||(e=[]),e.length>0&&(e=e[0],i("#type .text").text(e.platTypeName),i("#desc .text").text(e.content),i(".J_icon_type").html(o.get(e.platTypeID)),r.pageLoaded())})}}),i("#J_prev").on("click",function(){history.back()})})});