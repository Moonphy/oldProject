BTR.define(["require","exports","module","../../../base/index","../../../nav/nav","../../../gallery/iscroll/api","../../../gallery/template/main","../../../gallery/moment/main","../../../gallery/iscroll/list-api","text!./list-item.tpl"],function(e,t,n){var r=e("../../../base/index"),i=r.$,s=e("../../../nav/nav"),o=e("../../../gallery/iscroll/api"),u=e("../../../gallery/template/main"),a=e("../../../gallery/moment/main"),f=new s({prev:{id:"J_prev",text:'<i class="icon iconfont">&#xe61f;</i>返回'},title:"拜访信息",op:{text:'<a href="add.html"><i class="icon iconfont">&#xe637;</i></a>'}});f.init();var l=e("../../../gallery/iscroll/list-api");i(function(){function s(){return n.template||(n.template=e("text!./list-item.tpl")),n.template}var t=i("#J_result_list"),n={},a=new l({loadDataContainer:t,url:"/wx/visit/messageDetailList",buildParam:function(){return"?taskID="+r.data.get("curr_taskid")+"&size="+a.size+"&current="+a.current},success:function(e){return r.state.check(e,function(t){if(t){t||(t=[]);var n=u.compile(s());a.appendData(n(e)),r.mobileDevice&&i("#wrapper").off(r.events.click,".item a").on(r.events.click,".item a",function(e){location.href=i(this).attr("href")})}}),e},container:"#J_result_list",loadedCallback:function(){console.log("数据加载完了"),f.scroll&&f.scroll.refresh()},canDel:!1}),f=new o({id:"#wrapper",pulldownAction:function(){a.refresh()},pullupAction:function(){var e=this;a.nomore=!0,a.loadNext(function(){e.refresh()})}});f.initialize(),a.initialize(),t.on(r.events.over,"li.item",function(){i(this).css({background:"#ddd"})}).on(r.events.out,"li.item",function(){i(this).css({background:"#fff"})}),i("#addcar").on(r.events.click,function(){i.ajax({url:"/wx/message/countVisit",data:"taskID="+r.data.get("curr_taskid"),success:function(e){r.state.check(e,function(){location.href="../accidentcar/add.html"},function(){r.msg.info("抱歉，不能添加事故车，请先添加拜访信息！",2e3)})}})}),i("#J_prev").on("click",function(){var e=r.data.get("curr_factory_url");e?location.href=e:history.back()}),r.pageLoaded()})});