/**
 * @author : xiezhiwen
 * 页面入口程序
 */
/*---------------非脚本加载完成时执行-----------------------*/
 //加载广告脚本
(function(){
	if(typeof ad_js !== 'undefined')
		Gaofen.Ad.addAd(Gaofen.Ad.getAd(ad_js[0], ad_js[1], ad_js[2]));

	//特殊广告只有深圳用户才能看到
	var szTimer, szTime = 0;
	function showSzAd(){
		if(typeof remote_ip_info === 'undefined'){
			if(szTime > 100) return;
			szTime++;
			szTimer = setTimeout(showSzAd, 400);
			return;
		}
		clearTimeout(szTimer);
		szTimer = null;
		if(remote_ip_info.city === '深圳'){
			if(!$.cookie('remoteAdCook')){
				$(Gaofen.tpl.get('shenzhengAd')).appendTo('body').find('#close').click(function(){
					$(this).parent().slideUp();
					$.cookie('remoteAdCook', true, {expires:1});
				});
			}
		}
	}
	//showSzAd();
})(); 
/*---------------非脚本加载完成时执行结束-----------------------*/

$(function(){
	var G = Gaofen,
		Req = G.request,
		Util = G.util,
		FN = G.FN,
		PD = G.PD,
		channel = PD.get('channel'),
		module = PD.get('module'),
		action = PD.get('action'),
		host = PD.get('host'),
		event = G.use('action').bind(document.body);    //全局点击事件代理
	

/*-----------公共事件----------*/
	(function(){

		//设为首页
		$('#login #set_home, #logined #set_home').click(function(e){
			e.preventDefault();
			G.FN.setHome(this, this.href||'');
		});	
		
		//用户登录状态
		FN.gaofen_app_user();
		
		//登录框
		var loginView = $('#login li.account');

		G.use('HoverDelay', {
			view: loginView[0],
			hoverView : $('div.dropdown', loginView),
			hoverEvent : function(){
				loginView.find('a.caret span.bg').cssDisplay(1);
			},
			outEvent : function(){
				loginView.find('a.caret span.bg').cssDisplay(0);
			}
		}).play(1);
		
		//全局城市切换 
		FN.gaofen_app_cityMenu(PD.get('site'), $('#subsite'));

		//全局搜索方法
		var inputor = $('#searchValue');
		FN.gaofen_app_search({
			view : inputor.parent()[0],
			inputor : inputor,
			url : 'http://so.gaofen.com/cse/search?s=2958907847468970783&nsid=0&q='
		});

		//反回顶部
		FN.goTop();

		//顶部广告位
		var jqad = $('#slidertop');
		if(jqad.find('a').length>1){
			jqad.slideScroll({
				target : 'a',
				speed : 5000
			});
		}else if(jqad.find('a').length === 1){
			jqad.removeClass('slider');
		}
		//侧边广告位(由于可能有多个)
		$('div.slider').each(function(e){
			var jqad = $(this);
			if(jqad.attr('id') === 'sliderside' && jqad.find('a').length>1)
				jqad.slideScroll({
					target : 'a',
					speed : 3000
				});
		});	

		//检查签到
		var qiandao = $('#qiandao'), hostTime = Number(PD.get('hostTime')||(+new Date()));
		if(qiandao.length){			
			try{
				if(hostTime < 137991948313) hostTime *= 1000;
				var date = Util.timeChange(hostTime);
				if(date[1] < 10) date[1] = '0'+date[1];
				qiandao.find('.date').text(date[0]+'-'+date[1]+'-'+date[2]);
				qiandao.find('.week').text(date[6]);
			}catch(e){
				if(__debug) console.log('Date Error!');
			}
			if($.cookie('gaofen_user') !== null){
				var qdbtn = qiandao.find('.btn-sign');
				Req.qiandao('check', function(r){
					var code = Number(r.getCode());
					if(code !== ''){
						switch(code){
							case 0 ://未签到
								qdbtn.attr('rel', 'e:qd');
							break;
							case 423003 ://已签到
							case 423101 : 
								qdbtn.addClass('btn-signed').text('您今天已签到');
							break;
							case 404 : 
							case 423001:
								if(__debugg)  console.log('请先登录');
								//未登录
							break;

						}
					}
				});
			}else{
				qiandao.find('.btn-sign').attr('rel', 'e:null');
			}
		}
		
		//今日话题检查
		var hts = $('div.focus-today div.actions');
		if(hts.length){
			var obj = Gaofen.use('CollectPageData',{   
				items : hts 
			}).play(1);
			$.each(obj.data, function(i, dom){
				(function(_dom){
					var jq = $(_dom.item);
					jq.data('ajax', true);
					Req.q(PD.get('host'), {
						mod : 'debate',
						action : 'check',
						tid : _dom.data.tid
					}, function(r){
							var code = r.getCode(), jqa = jq.find('a');
							jq.data('ajax', code);						
							if(code == '1000'){
								jqa.eq(0).addClass('btn-approved');				
							}else if(code == '2000'){
								jqa.eq(1).addClass('btn-objected');	
							}							
					})
				})(dom);
			});
		}
		
		//设置详细页在线人数
		FN.onlineUsers();
		
	})();
	
/*-----------公共结束----------*/

/*-----------模块功能----------*/		
	switch(channel){
	
		case 'index' : //首页
			switch(action){
				case 'view' :

				break;
			}
		break;
	

		case 'jiangzuo' : //讲座模块
		
			switch(action){
				case 'index' : //讲座首页
					//修改右则状态
					Req.q('http://'+host+'/ajax/getLecturesCount', {}, function(r){
						if(r.isOk()){
							var jqps = $('div.widget-statistic>div.status p'), data = r.getData();
								jqps.eq(0).html('举办讲座： '+data.lectuCount+'场');
								jqps.eq(1).html('参加人数： '+data.applynumCount+'人');
								jqps.eq(2).html('合作机构： '+data.orgCount+'家');
						}
					});	
				case 'list' :
					G.use('jiangzuoChangeStatus');
				break;
				case 'view' : //讲座详细页
				case 'report': //讲座报道
					var btn = $('#joinActions');
					if(btn.length){
						var rel = Util.parseKnV(btn.closest('div.thumb-info-details').attr('rel')), host = PD.get('host');;
						Req.q('http://'+host+'/ajax/getLecturesJoinState', {id:rel.id}, function(r){
							if(r.isOk()){
								var date = parseInt(r.getData().joinTime);
								if( date >= 0 ){
									btn.cssDisplay(1).find('.icon-clock').html('报名剩余'+date+'天');									
								}else{
									btn.remove();
								}
							}
						});
					}

					G.use('jiangzuoChangeStatus', {
						view : $('div.span16')[0],
						target : 'div.thumb-info-details',
						type : 'special'
					});
				break;
			};
		break;
		
		case 'xuexiao' : //学校模块

			switch(action){
			
				case 'index' : //学校首页
					Req.q('http://'+host+'/ajax/getSchoolCount', {}, function(r){
						if(r.isOk()){
							var data = r.getData(), jqp = $('#schoolData div.status>p');
							jqp.eq(0).text('收录学校： '+data.schoolCount+'所');
							jqp.eq(1).text('名校访谈： '+data.interviewCount+'人');
						}
					});
					var squery = $('#squery');
					squery.find('#go_score').click(function(e){
						e.preventDefault();
						var year = squery.find('#go_year').val(),
							batch_id = squery.find('#go_batch_id').val(),
							admareaid = squery.find('#go_admareaid').val(),
							header = 'http://'+host+'/school/score/?';
						location.href = header + $.param({'year':year, 'batch_id':batch_id, 'admareaid':admareaid});
					});
				break;
				
				case 'score' : //分数线查询
					var catchData = {};		
					$("#change_year, #change_batch_id, #change_admareaid").bind('change', function(){
						var change_year = $("#change_year").val(),
							change_batch_id = $("#change_batch_id").val(),
							change_admareaid = $("#change_admareaid").val(),
							url = 'http://'+host;		
						$('#school_score_body').html('<tr><td colspan="9">数据载入中...</td></tr>');			
							var key = [change_year, change_batch_id, change_admareaid].join('&'), data;
							if(data = catchData[key]){
								randData(data);
							}else{
								Req.q(url+'/ajax/score/',{
									'year' : change_year,
									'batch_id' : change_batch_id,
									'admareaid' : change_admareaid
								},function(r){		
									catchData[key] = r;
									randData(r);	
								});
							}
					});
									
					function randData(r){
						var data = r.getData(), html = [], batchname = '', admarea = '';
						if(data){
							var k = 1, key;					
							for(key in data) {
								var row = data[key], _style = '';
								if (!parseInt(row.low_mark)) {
									row.low_mark = '--';
								}
								if (!parseInt(row.low_mark_last)) {
									row.low_mark_last = '--';
								}
								if (!parseInt(row.last_student_wish)) {
									row.last_student_wish = '--';
								}
								if (!parseInt(row.last_student_mark)) {
									row.last_student_mark = '--';
								}
								if (!parseInt(row.last_student_num)) {
									row.last_student_num = '--';
								}
								if((k%2) == 0){
									_style = 'class="even"';  
								}
								html.push('<tr '+_style+'><td>'+row.code+'</td><td><a target="_blank" href="/school/view/?id='+row.mid+'">'+row.name+'</a></td><td>' + row.typename + '</td><td>'+row.areaname+'</td><td>'+row.low_mark+'</td><td>'+row.low_mark_last+'</td><td>'+row.last_student_wish+'</td><td>'+row.last_student_mark+'</td><td>'+row.last_student_num+'</td></tr>');
								k++;
							}
							if(k>1){
								batchname = data[key].admareaid ? data[key].batchname : '所有批次';
								admarea = data[key].areaname ? data[key].areaname : '全区';
							}
						}else{
							var err = r.getRaw().err;
							batchname = err['batchname'];
							admarea = err['areaname'];
							html.push("<tr><td colspan='9'>暂无数据</td></tr>");
						}
						$('#school_score_body').html(html.join(''));
						$('#sel_batchname').html(batchname);
						$('#sel_admarea').html(admarea);
						$('#sel_year').text($("#change_year").val());
						html = '';
					}				
				break;				
			}			
		break;
		
		case 'ziliao' : //资料
			switch(action){
				case 'view' :
				case 'dochtml' : //资料浏览
					if(PD.get('jsReader'))//需要初始化阅读器
						var v = G.use('Reader', {controlView : $('#readControl'), view : $('#pageContain'), isImg : PD.get('isImg') === 1 ? 1 : 0});
				break;
				case 'userupload' : //资料上传
					var jf = $('#form1'), inputs = jf.find('input,textarea');
					var vd = G.use('validator', {
						form : jf,
						trigger : '#btnSubmits',
						elements : inputs, 
						onSuccess : function(data){
							//jf.find('#btnSubmits').prop('disabled', true);		
							if($('#pact').prop('checked')){
								$('#btnSubmit')[0].onclick();
							}
							return true;
						}
					});
					var SWFUPLOADSESSID = PD.get('SWFUPLOADSESSID') || "", swf_auth_key = PD.get('swf_auth_key') || "";
					window.swfu = new SWFUpload({
						upload_url: "/ajax/uploadFile/?SWFUPLOADSESSID="+SWFUPLOADSESSID+"&swf_auth_key="+swf_auth_key+"&__rnd="+(+new Date),
						file_post_name: "uploadefile",
						outSizeTips : '文档大小限制在20M以内，请重新上传!',
						button_image_url : '',
						file_size_limit : "20 MB",
						file_types : "*.doc;*.ppt;*.xlsx;*.pdf;*.txt;*.docx;*.pptx;*.xls",			// or you could use something like: "*.doc;*.wpd;*.pdf",
						file_types_description : "Files",
						file_upload_limit : "0",
						file_queue_limit : "1",

						swfupload_loaded_handler : swfUploadLoaded ,
						
						file_dialog_start_handler: fileDialogStart,
						file_queued_handler : fileQueued,
						file_queue_error_handler : fileQueueError,
						file_dialog_complete_handler : fileDialogComplete,
						
						upload_start_handler : function(){
							vd.lock = true;
							$('#pact').prop('disabled', true);
							$('#fsUploadProgress').removeClass('hidden');
							$('#btnSubmits').addClass('btn-disabled');
						},
						upload_progress_handler : function(file, bytesLoaded, bytesTotal) {
							try {
								var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
								$('#fsUploadProgress').html('正在上传文档，请稍候...(<em>'+percent+'</em>%)');
							} catch (ex) {
								this.debug(ex);
							}
						},
						upload_error_handler : function(){
							uploadError.apply(this, arguments);
							$('#pact').prop('disabled', false);
							$('#btnSubmits').removeClass('btn-disabled');
							vd.lock = false;
						},
						upload_success_handler : function(file, serverData){
							document.getElementById("hidFileID").value = serverData;
							$('#fsUploadProgress').text('');
						},
						upload_complete_handler : uploadComplete,

						button_image_url : "/public/js/swfupload/swfuploadbtn.png",
						button_placeholder_id : "spanButtonPlaceholder",
						button_width: 76,
						button_height: 20,

						flash_url : "/public/js/swfupload/swfupload.swf",

						custom_settings : {
							progress_target : "fsUploadProgress",
							upload_successful : true
						}
					});
					break;
			}
		break;
	}
/*-----------模块功能结束----------*/	
});