BTR.define(["require","exports","module","../../base/index","../../nav/nav","../bill/state"],function(e,t,n){var r=e("../../base/index"),i=r.$,s=e("../../nav/nav"),o=e("../bill/state"),u=new s({prev:{id:"J_prev",text:'<i class="icon iconfont">&#xe61f;</i>返回'},title:"基本情况",op:{id:"J_edit",text:"编辑"}});u.init(),i(function(){function u(){i.ajax({url:"/wx/visit/busniess",data:"ID="+s,success:function(e){r.state.check(e,function(e){e||(e=[]),e.length>0&&(e=e[0],i("#J_purchase_crane").text(o.monthBuy[e.monthBuy]),i("#J_local_purchase").text(o.localPurchase[e.localPercent]),i("#J_purchase").text(e.buyUser),i("#J_pay").text(e.payUser),i("#J_have_account").text(e.existAccount?"有":"无"),r.data.set("curr_factory_baseinfo_2",e))})}})}var e=i("#J_nav"),t=i(".J_trigger"),n=[i("#J_pannel1"),i("#J_pannel2")],s=r.utils.mapQuery().id;if(typeof s=="undefined")return;e.on(r.events.click,".J_trigger",function(){var e=i(this);t.removeClass("active"),e.addClass("active"),e.hasClass("J_t1")?(n[0].show(),n[1].hide()):(n[0].hide(),n[1].data("hasData")==undefined&&u(),n[1].show().data("hasData",!0))}),i.ajax({url:"/wx/visit/basedMesg",data:"ID="+s,success:function(e){r.state.check(e,function(e){e||(e=[]),e.length>0&&(e=e[0],i("#J_name").text(e.mfctyName),i("#J_type").text(o.factoryType[String(e.mfctyType)]),i("#J_address").text(e.address),i("#J_phone").text(e.cactTel),i("#J_contact").text(e.cactMan),i("#J_crane").text(e.liftingFrame),i("#J_kaoqi").text(e.boothRoom),i("#J_area").text(e.businessArea),r.data.set("curr_factory_baseinfo_1",e))})}}),i("#J_prev").on("click",function(){var e=r.data.get("curr_factory_url");e?location.href=e:history.back()}),i("#J_edit").on(r.events.click,function(){r.data.set("curr_factory_baseinfo_url",window.location.href),location.href="information-edit.html?id="+s}),r.pageLoaded()})});