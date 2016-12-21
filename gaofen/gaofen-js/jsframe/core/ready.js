/**
 * @author : xiezhiwen
 * 页面入口程序
 */


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
			G.FN.setHome(this);
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
		FN.gaofen_app_cityMenu();
		
		//全局搜索方法
		var inputor = $('#searchValue');
		FN.gaofen_app_search({
			view : inputor.parent()[0],
			inputor : inputor,
			url : 'http://s.gaofen.com/search/article/?q='
		});
		
		//反回顶部
		FN.goTop();
		
		//顶部广告位
		var jqad = $('#slidertop');
		if(jqad.find('a').length>1)
			jqad.slideScroll({
				hasContorl : false,
				//effect : 'shadow',
				//overStop : false,
				createControl : true,
				hasControl : true,
				//sliderControl : $('<ul class="pages"></ul>'),
				target : 'a',
				speed : 5000
			});
	})();

	
/*-----------公共结束----------*/

/*-----------模块功能----------*/		
	switch(channel){

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