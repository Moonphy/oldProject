define("gallery/layer/1.9.3/src/ext",["jquery"],function(e,i,n){n.exports=function(i){var n=e("jquery");i.layui_layer_extendlayerextjs=!0;var t=i.cache,a=function(e){return t.skin?" "+t.skin+" "+t.skin+"-"+e:""};return i.prompt=function(e,t){e=e||{},"function"==typeof e&&(t=e);var l,r=2==e.formType?'<textarea class="layui-layer-input">'+(e.value||"")+"</textarea>":function(){return'<input type="'+(1==e.formType?"password":"text")+'" class="layui-layer-input" value="'+(e.value||"")+'">'}();return i.open(n.extend({btn:["&#x786E;&#x5B9A;","&#x53D6;&#x6D88;"],content:r,skin:"layui-layer-prompt"+a("prompt"),success:function(e){l=e.find(".layui-layer-input"),l.focus()},yes:function(n){var a=l.val();""===a?l.focus():a.length>(e.maxlength||500)?i.tips("&#x6700;&#x591A;&#x8F93;&#x5165;"+(e.maxlength||500)+"&#x4E2A;&#x5B57;&#x6570;",l,{tips:1}):t&&t(a,n,l)}},e))},i.tab=function(e){e=e||{};var t=e.tab||{};return i.open(n.extend({type:1,skin:"layui-layer-tab"+a("tab"),title:function(){var e=t.length,i=1,n="";if(e>0)for(n='<span class="layui-layer-tabnow">'+t[0].title+"</span>";e>i;i++)n+="<span>"+t[i].title+"</span>";return n}(),content:'<ul class="layui-layer-tabmain">'+function(){var e=t.length,i=1,n="";if(e>0)for(n='<li class="layui-layer-tabli xubox_tab_layer">'+(t[0].content||"no content")+"</li>";e>i;i++)n+='<li class="layui-layer-tabli">'+(t[i].content||"no  content")+"</li>";return n}()+"</ul>",success:function(e){var i=e.find(".layui-layer-title").children(),t=e.find(".layui-layer-tabmain").children();i.on("mousedown",function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0;var i=n(this),a=i.index();i.addClass("layui-layer-tabnow").siblings().removeClass("layui-layer-tabnow"),t.eq(a).show().siblings().hide()})}},e))},i.photos=function(e,t,l){function r(e,i,n){var t=new Image;t.onload=function(){t.onload=null,i(t)},t.onerror=function(e){t.onload=null,n(e)},t.src=e}var o={};if(e=e||{},e.photos){var s=e.photos.constructor===Object,u=s?e.photos:{},c=u.data||[],y=u.start||0;if(o.imgIndex=y+1,s){if(0===c.length)return void i.msg("&#x6CA1;&#x6709;&#x56FE;&#x7247;")}else{var d=n(e.photos),p=d.find(e.img||"img");if(0===p.length)return;if(t||d.find(u.img||"img").each(function(t){var a=n(this);c.push({alt:a.attr("alt"),pid:a.attr("layer-pid"),src:a.attr("layer-src")||a.attr("src"),thumb:a.attr("src")}),a.on("click",function(){i.photos(n.extend(e,{photos:{start:t,data:c,tab:e.tab},full:e.full}),!0)})}),!t)return}o.imgprev=function(e){o.imgIndex--,o.imgIndex<1&&(o.imgIndex=c.length),o.tabimg(e)},o.imgnext=function(e){o.imgIndex++,o.imgIndex>c.length&&(o.imgIndex=1),o.tabimg(e)},o.keyup=function(e){if(!o.end){var n=e.keyCode;e.preventDefault(),37===n?o.imgprev(!0):39===n?o.imgnext(!0):27===n&&i.close(o.index)}},o.tabimg=function(n){u.start=o.imgIndex-1,i.close(o.index),i.photos(e,!0,n)},o.event=function(){o.bigimg.hover(function(){o.imgsee.show()},function(){o.imgsee.hide()}),o.bigimg.find(".layui-layer-imgprev").on("click",function(e){e.preventDefault(),o.imgprev()}),o.bigimg.find(".layui-layer-imgnext").on("click",function(e){e.preventDefault(),o.imgnext()}),n(document).on("keyup",o.keyup)},o.loadi=i.load(1,{shade:"shade"in e?!1:.9,scrollbar:!1}),r(c[y].src,function(t){i.close(o.loadi),o.index=i.open(n.extend({type:1,area:function(){var i=[t.width,t.height],a=[n(window).width()-100,n(window).height()-100];return!e.full&&i[0]>a[0]&&(i[0]=a[0],i[1]=i[0]*a[1]/i[0]),[i[0]+"px",i[1]+"px"]}(),title:!1,shade:.9,shadeClose:!0,closeBtn:!1,move:".layui-layer-phimg img",moveType:1,scrollbar:!1,moveOut:!0,shift:5*Math.random()|0,skin:"layui-layer-photos"+a("photos"),content:'<div class="layui-layer-phimg"><img src="'+c[y].src+'" alt="'+(c[y].alt||"")+'" layer-pid="'+c[y].pid+'"><div class="layui-layer-imgsee"><span class="layui-layer-imguide"><a href="javascript:;" class="layui-layer-iconext layui-layer-imgprev"></a><a href="javascript:;" class="layui-layer-iconext layui-layer-imgnext"></a></span><div class="layui-layer-imgbar" style="display:'+(l?"block":"")+'"><span class="layui-layer-imgtit"><a href="javascript:;">'+(c[y].alt||"")+"</a><em>"+o.imgIndex+"/"+c.length+"</em></span></div></div></div>",success:function(i,n){o.bigimg=i.find(".layui-layer-phimg"),o.imgsee=i.find(".layui-layer-imguide,.layui-layer-imgbar"),o.event(i),e.tab&&e.tab(c[y],i)},end:function(){o.end=!0,n(document).off("keyup",o.keyup)}},e))},function(){i.close(o.loadi),i.msg("&#x5F53;&#x524D;&#x56FE;&#x7247;&#x5730;&#x5740;&#x5F02;&#x5E38;",{time:2e3},function(){c.length>1&&o.imgnext(!0)})})}},i}});