BTR.define(["require","exports","module","../../../base/index","../../../nav/nav","../../../gallery/moment/main","../../bill/state"],function(e,t,n){var r=e("../../../base/index"),i=r.$,s=e("../../../nav/nav"),o=e("../../../gallery/moment/main"),u=e("../../bill/state"),a=new s({prev:{id:"J_prev",text:'<i class="icon iconfont">&#xe61f;</i>返回'},title:"询价单详情"});a.init(),i(function(){function h(t){var n="",r=t.quotedetailEntityList;return r&&i.each(r,function(e,t){n+=["<li>",'<span class="money">&yen;'+t.quotePrice+"</span>",'<span class="remark">'+t.remark+"</span>","</li>"].join("")}),(e+"").replace("{name}",t.PartsName).replace("{num}",t.num).replace("{money}",n)}var e=i("#J_dtl_list").text(),t=i(".J_time"),n=i(".J_no"),s=i(".J_state"),a=i(".J_total"),f=i(".J_total_money"),l=i("#J_order_list"),c=!1;i.ajax({url:"/wx/billOfDocument/find/inquirySheetDetail",data:"inquiryID="+r.utils.mapQuery(window.location.search).id,success:function(e){r.state.check(e,function(e){e||(e=[]);if(e.length>0){e=e[0],t.text(o(e.publishTime).format("HH:mm:ss")),n.text(e.inquiryNo);var a=u.inquiry[e.status];a=="已报价"&&(c=!0),s.text(a);var f=e.partDetailEntityList;if(f.length>0){var p="";i.each(f,function(e,t){p+=h(t)}),l.append(p),c&&i(".J_quote").removeClass("fn-hide")}else r.msg.info("没有明细")}else r.msg.info("没有数据")})}}),i("#J_prev").on("click",function(){history.back()}),i("#J_order_list").on(r.events.click,".total_money_btn",function(){i(this).parents(".content").next().toggle()}),r.pageLoaded()})});