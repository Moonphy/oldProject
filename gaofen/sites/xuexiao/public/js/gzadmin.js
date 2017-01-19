/**
 * Created by zhiwen on 2015-1-28.
 * 高中库后台
 */
 
(function($, win, G){

    var luri = location.href.toLowerCase(), router = [	
		'gzadmin/school/list',//高中库学校列表
		'gzadmin/school/edit?', //学校简介
		'gzadmin/school/editinfo?',//学校概览 学生生活 招生信息
		'gzadmin/tip/index'],//经验分享
		
		Util = G.util,
		
		Alert = G.tips.alert;
	
	G.place = 'admin';

	G.event();
	
	
	//共用提交层
	function modelAlert(fn){
		var modalConfirmDelete = $('#modalConfirmDelete');
		$('#delSchoolSure').on('click', function(e){
			fn && fn();
			$('body').trigger('confirm-md-sure');
		});
		return modalConfirmDelete;
	}
	
	function listHandle(listDom, selectAll, uri, fn){
		var ids = [];
		$('#'+selectAll).on('click', function(){
				listDom.find('tbody input[type="checkbox"]').prop('checked', $(this).prop('checked'));			
			})
			
			var modalConfirmDelete = modelAlert(function(){
				$.post(uri, {ids:ids.join(',')}, function(r){
					if(r.errno == '0'){
						Alert('删除成功！');
						modalConfirmDelete.modal('hide');
						fn && fn();
					}else{
						Alert('操作失败！','error');
					}				
				})
			});
			$('#footerAction').on('click', 'a', function(e){
				e.preventDefault();
				if($(this).attr('id') === 'delSchool'){
					var ipts = listDom.find('tbody input[type="checkbox"]:checked');
					ids = [];
					if(ipts.length){
						ipts.each(function(i, ipt){
							ids.push($(ipt).closest('tr').attr('rel'));
						});
						//modalConfirmDelete.modal({'show':true, backdrop : 'static'});
						modalConfirmDelete.modal({ 'show' : true});
					}else{
						Alert('请选择删除项!','error');
					}
				}else{
					
				}
			})
	}
	
	
	$(function(){	
		if(typeof toastr)
			toastr.options.timeOut = 2000;
				
		//路由
		if(luri.indexOf(router[0]) > 0){//学校列表页
			var ipts = $('#school_list tbody input[type="checkbox"]:checked');

			//listHandle($('#school_list'), 'selectAll' , ''); 暂时不需要删除功能
			
		
			var modalAddSchool = $('#modalAddSchool'), areaNewCmp;
			modalAddSchool.on('show.bs.modal',function(e){
				modalAddSchool.find('input[type="text"]').val('');
				areaNewCmp.reset();							
			}).on('hide.bs.modal',function(e){				
				location.reload();
			});

			areaNewCmp = Util.areaCmp(modalAddSchool);
			modalAddSchool.find('input[name="property"]').eq(0).prop('checked', true);
			new G.cls.validate({
				form : modalAddSchool
				,eachCallBall : function(dom, data){
					Alert(data.m,'error');
					return false;
				}
				,elements : modalAddSchool.find('input[type="text"],select')
				, trigger : '#addSure'
				, onSuccess : function(data){
					var property = modalAddSchool.find('input[name="property"]:checked').val(), that = this;
					var areaData = areaNewCmp.getData();
					$.post(G.getRouter('/school/create'), {//添加学校
						name : data.school_name,
						district : areaData.district,
						city : areaData.city,
						admit_range_id : property
					}, function(r){
						if(r.errno === 0){
							Alert('创建成功');
							that.elements.each(function(){
								$(this).val('');
							});
							modalAddSchool.find('input[name="property"]').eq(0).prop('checked', true);
						}else{
							Alert(r.err,'error');
						}
						that.lock = false;
					})
				}
			});
		}else if(luri.indexOf(router[1]) > 0){//基础信息
			var school_id = $('#school_id').val();
			function showPart(part){
				var lis = $('ul.nav-tabs>li');
				if(part === 'partA'){
					lis.eq(1).removeClass('active');
					lis.eq(0).addClass('active');
					$('#partB').addClass('hidden');
					$('#partA').hide().removeClass('hidden').fadeIn(500);
				}else{
					lis.eq(0).removeClass('active');
					lis.eq(1).addClass('active');
					$('#partA').addClass('hidden');
					$('#partB').hide().removeClass('hidden').fadeIn(500);
				}
				location.hash = part === 'partB' ? '#intro'	: '#base';			
			}
			showPart(location.hash === '#intro' ? 'partB' : 'partA')
			$('ul.nav-tabs').on('click', 'li', function(e){
				var tjq = $(this), text = tjq.text();
				if(text === '学校简介' || text === '基础信息'){
					e.preventDefault();

					if(!tjq.hasClass('active')){
						if(changeFlag === true){
							if(!confirm('有未保存数据！确定跳转?')){
								e.preventDefault();
							}
							return;
						}
						var part = text === '学校简介' ? 'partB' : 'partA';
						//changeFlag = false;
						showPart(part);
						/*
						$('ul.nav-tabs').find('.active').removeClass();
						tjq.addClass('active');
						var h = $('#part').children(':hidden'), s = $('#part').children(':visible');
						h.removeClass('hidden');
						s.addClass('hidden');
						*/
					} 
				}else{
					if(changeFlag === true){
						if(!confirm('有未保存数据！确定跳转?')){
							e.preventDefault();
						}
					}
				}
			});

			//区域选择
			var checkboxs = $('#recruitScope input[type="checkbox"]'), 
				chedEvent = function(min, max, result){
					if(result !== undefined) result = result;
					else result = true;
					if(arguments.length === 1){
						$('#recruitScope input[value="'+min+'"]').prop('checked', true);
						return;
					}
				    checkboxs.each(function(i, item){
						var v = parseInt(item.value);
						if(v >= min && v <= max){
							$(item).prop('checked', result);
						}
					});

				};
			$('#recruitScope').on('click', 'input', function(e){
				var ched = $(this);
				if(ched.prop('checked')){

					switch(ched.val()){
						case '1' : 
							chedEvent(2, 30);
						break;
						case '2' : 
							chedEvent(5);
							chedEvent(6);
							chedEvent(8);
						break;

						case '3' : 
							chedEvent(5, 11);
						break;

						case '4' : 
							chedEvent(5, 11);
							chedEvent(16);
						break;
						case '17' :
							chedEvent(12);
						break;
						case '18' :
							chedEvent(12);
							chedEvent(16);
						break;

						case '19' : 
							chedEvent(16);
						break;


					}
				}else if(ched.val() == '1'){
					chedEvent(2, 30, false);
				}
			})

			

		
			var shareForm = $('#shareForm');

			Util.areaCmp(shareForm);

			new G.cls.validate({
				form : shareForm
				,eachCallBall : function(dom, data){
					Alert(data.m,'error');
					return false;
				}
				,elements : shareForm.find('input[type="text"],select')
				, trigger : '#shareBtn'
				, onSuccess : function(data){
					var property = shareForm.serializeArray();
					changeFlag = false;
					$.post(G.getRouter('/school/updatePartA'), property, function(r){
						if(r.errno === 0){
							Alert('修改成功');
						}else{
							Alert(r.err,'error');
						}
					})
					return false;
				}
			});
			
			Util.tinymce({
				elements : 'introEditor',
				setup : function(ed){
					ed.on('paste', function(e){
						tinymce.clearStyle('introEditor_ifr',e);
					})
				}
			});
			
			
			//简介部分
			$('#introBtn').on('click', function(e){
				e.preventDefault();
				var intro = tinymce.get('introEditor').getContent();
				if(intro){
					$.post(G.getRouter('/school/updatePartB'), {
						intro : intro,
						id : school_id
					}, function(r){
						if(r.errno === 0){
							Alert('修改成功');
						}else{
							Alert(r.err,'error');
						}
					})
				}else{
					Alert('请填写简介','error');
				}
			});
			
			
			//上传图片
			var liTemp = ['<div class="col-sm-3" id="uploadList_{.i}">',
                  '<div class="thumbnail">',
						'<div class="progress" id="uploadProgress_{.i}">',
						  '<div style="width:0%" class="progress-bar progress-bar-striped active"></div>',
						'</div>',
						'<div id="img_body_{.i}" class="hidden">',
							'<img src="{.result}"  id="pic_{.i}">',
							'<input type="text" name="cover" class="hidden">',
							'<input type="text" name="title" class="form-control input-sm">',
							'<div class="operations">',
							  '<button href="#" class="btn btn-default btn-xs"><i class="glyphicon glyphicon-star"></i> 设为封面</button>',
							  '<button href="#" class="btn btn-danger btn-xs"><i class="glyphicon glyphicon-trash"></i></button>',
							'</div>',
						'</div>',
                  '</div>',
                '</div>'].join(''),
				uploading = false,
				img_preview = $('#img_preview');
				
			var photoList = new html5Upload({
				fileType : ['jpg','gif','png'],//[jpg,gif,png] //允许上传格式（*表示都可以上传）
				fileInput: $("#school_img").get(0),
				url : G.PD.get('uploadUri') || G.getRouter('/admin/upload/html5upload'),
				autoUpload : true, //是否自动上传
				//fileObject : 'Filedata',
				previewImgTemp : liTemp,
				parent : '.col-sm-3',
				//delBtn : 'glyphicon-trash',外部处理删除
				preview : img_preview,
				setProgress : function(index, percent){
					var eleProgress = this.preview.find("#uploadProgress_" + index);
					if(percent != 100)
						eleProgress.children().eq(0).css('width', percent+'%');
					else
						eleProgress.hide();
				},
				initReady : function(){
					var childs = this.preview.children(), len = childs.length;
					if(len === 0) return;
					for(var i=0;i<len;i++){
						childs.eq(i).attr('id', 'uploadList_'+(i+1));
						this.saveStack.push({url:'', index : i+1 });
					};
					this.uploadIndex = i;
				},
				afterOneSuccess : function(file, response){
					var dom = this.getDomByIndex(file.index);
					this.preview.find("#uploadProgress_" + file.index).replaceWith(dom.find('#img_body_'+file.index).html());
					dom.find('#img_body_'+file.index).remove();
					dom.find('input:hidden').val(response.rst.uri);
					this.uploadImgToServer(dom, response);
				},
				uploadImgToServer : function(dom, response){
					$.post(G.getRouter('/Pic/create'), {
						uri : response.rst.uri,
						sid : school_id,
						sort : dom.index()
					}, function(r){
						if(r.errno === 0){
							dom.attr('rel', r.rst.id);						
						}
					})
				},
				
				beforeUpload : function(formData){
					img_preview.sortable('disable');
					formData.append('path', 'xuexiao');
					uploading = true;
				},
				onComplete: function() {
					this.fileInput.value = '';
					img_preview.sortable('enable');
					uploading = false;
				}
			});
			
			img_preview.sortable({ revert : true, helper: 'clone' , opacity: 0.8 ,placeholder: 'col-sm-3 thumbnail placeholder',
				update : function(){
					var t  = $(this), startIndex = t.data('index')+1, sorts = [];
					$(this).children(':lt('+startIndex+')').each(function(i, item){
						sorts.push($(item).attr('rel'));						
					});
					//http://dev.xuexiao.gaofen.com/Czadmin/Pic/updateSort?ids=xxx,xxx,xxx
					$.post(G.getRouter('/Pic/updateSort'), {
						ids : sorts.join(',')
					}, function(r){
						if(r.errno === 0){
							Alert('排序成功！');
						}else{
							Alert(r.err,'error');
						}
					})
				},
				start : function(e, ui){
					$(this).data('index', ui.item.index());
				}
			});
			//var sortable = img_preview.disableSelection();//不被选上会影响输入框
			var del_id, parentDom;
			var modalConfirmDelete = modelAlert(function(){
				delUploadImg(parentDom, true);
			});
			
			function delUploadImg(dom, isHide){
				$.get(G.getRouter('/Pic/delete'), {id:del_id}, function(r){
					if(r.errno == '0'){
						Alert('删除成功！');
						if(isHide){
							modalConfirmDelete.modal('hide');
						}
						var index = dom.attr('id').split('_')[1];
						!photoList.removeFilter(index) && photoList.removeSaveStack(index);
						dom.length && dom.remove();
					}else{
						Alert('操作失败！','error');
					}				
				})

			}
			
			
			img_preview.on('click', 'button.btn-default,button.btn-danger', function(e){
				e.preventDefault();
				var tjq = $(this);
				parentDom = tjq.closest(photoList.parent);
				if(tjq.hasClass('btn-default')){//设置封面
					$.post(G.getRouter('/school/updatePartB'), {
						cover : parentDom.find('input:hidden').val(),
						id : school_id
					}, function(r){
						if(r.errno === 0){
							img_preview.find('div.cover').removeClass('cover');
							tjq.closest('.thumbnail').addClass('cover');
							Alert('设置封面成功！');
						}else{
							Alert(r.err,'error');
						}
					})
				
				}else{//删除
					del_id = parentDom.attr('rel');
					if(tjq.closest('.thumbnail').hasClass('cover')){
						modalConfirmDelete.modal({ 'show' : true});
					}else{
						delUploadImg(parentDom);
					}	
				}
			})
			
			//保存图片简介
			img_preview.on('focus blur', 'input[name="title"]', function(e){
				var t = $(this);
				if(e.type === 'focusin'){
					ov = $.trim(t.val());
					t.data('ov', ov);
				}else{
					var p = t.closest('div.col-sm-3'), ov = t.data('ov'), v = $.trim(this.value);
					if(ov !== v){
						$.post(G.getRouter('/Pic/update'), {
								title : $.trim(this.value),
								id : p.attr('rel')
							}, function(r){
							if(r.errno === 0){
								Alert('保存成功！');
							}else{
								Alert(r.err,'error');
							}
						})
					}
				}
			});

			var changeFlag = false;
			shareForm.find('input,select').on('change', function(e){
				changeFlag = true;
			});
			
/*-----------------------------------------------学校概览------------------------------------------------*/
			
		}else if(luri.indexOf(router[2]) > 0){//学校概览
			var flag, aname, currentList, comfireMd = modelAlert(), current, allConfigArea = $('#allConfig'), sid = allConfigArea.find('input[name="sid"]').val(), id = allConfigArea.find('input[name="id"]').val(),
				sort = allConfigArea.find('input[name="sort"]').val(), type = allConfigArea.find('input[name="type"]').val(), 

				name = allConfigArea.find('input[name="name"]').val(), sys = allConfigArea.find('input[name="sys"]').val(),
				sortChange = false//排序发生变化时不能编辑;

				,listLock = false //列表加载时不能保存
				;
			$('#mode_list').on('click', 'a', function(e){
				var rel = $(this).attr('rel');
				if(rel){
					rel = Util.parseKnV(rel);
					currentList = $(this).closest('li');
					flag = rel.flag;
					aname = rel.name;
					sys = rel.hasOwnProperty('sys') ? rel.sys : currentList.find('input[name="sys"]').val();
					if(sortChange){
						e.preventDefault();
						e.stopPropagation();
						Alert('请先保存排序','error');
					}
				}else{
					currentList = $(this).closest('li');
				}
			});

			var admitForte = G.PD.get('admitForte');
		
			var md = $('#modalEditModule'), minfo = null;
			md.on('show.bs.modal',function(e){
				$.each(tinymce.get(), function(i, editor){
					editor.destroy();
				});
				md.find('#removeFloat').remove();
				var tempId = flag;
				if(tempId === 'udm_text'){
					tempId = 'rich_text';
				}
				md.find('#modal_body').html('<div id="removeFloat">'+Util.parse($('#'+tempId).html(), {})+'</div>');	
				md.find('.modal-title>input').val(getEditTitle());
				//渲染列表
				renderData();
			}).on('hide.bs.modal',function(e){
				minfo = null;
			});
			
			md.on('change_forte', function(ev, p){
				console.log(arguments);
				var key = p.dom.val();
				createSelectChild(p.target, key);				
			});
			
			//添加模块
			$('#addModalBtn').on('click', function(e){
				if(sortChange){//拖动后先保存才能插入内容
					Alert('请先保存排序才能添加模块','error');
				}else{
					var v = $('#modalSelect').val();
					if(v){
						createModalList(v);
						$('#mode_list').sortable('disable');//插入后先保存才能拖动
					}else{
						Alert('请选择模块','error');
					}
				}
			})
			
			$('#mode_list').sortable({ revert : true, helper: 'clone' , opacity: 0.8 ,placeholder: 'placeholder',
				update : function(){
					sortChange = true;
				}
			});
			
			$('#listSaveBtn').on('click', function(e){
				e.preventDefault();
				if(!id && id != '0'){
					Alert('暂时不能保存','error');
					return;
				}
				var params = {}, unEdit = false;
				$('#mode_list').children().each(function(i, item){
					var that = $(this), index = that.index();
					var ipts = that.find('input'), textareas = that.find('textarea');
					if(ipts.length < 2){							
						unEdit = ipts.length === 0 ? that : '请先刷新页面!';
						return false;
					}else{
						ipts.each(function(j, ipt){
							params['data['+i+']['+ipt.name+']'] = ipt.value;
						});		
						params['data['+i+'][value]'] = textareas.eq(0).text();						
					}
				});
				if(unEdit !== false){
					if(unEdit === '请先刷新页面!'){
						Alert(unEdit,'error');
					}else{
						Alert('请先编辑:"'+getEditTitle(unEdit)+'"模块','error');
					}
				}else{
					params = addPublicParams(params);
					params.module_name = aname;
					updateInfo(params, function(r){
						Alert('保存成功！');
						setTimeout(function(){location.reload()}, 2000);
					});
				}
			})
			
			
			//----------------------------公共方法-----------------------------		

			//添加模块方法
			function createModalList(d){
				var dobj = Util.parseKnV(d);
				dobj.rel = d;
				$('#mode_list').append(Util.parse(G.tpls.get('modalList'), dobj))
			}
				
			//公共保存数据方法
			function updateInfo(params, fn){
				$.post(G.getRouter('/School/updateInfo'), params, function(r){
					if(r.errno === 0){
						if(id === '' ){
							if(r.rst.id != undefined)
								id = r.rst.id;
						}
						if(fn){
							fn(r);
						}else{
							if(currentList.find('input').length ===0){
								currentList.append('<input class="hidden" value="未刷新">');
							}
							Alert('保存成功！');
							//setTimeout(function(){location.reload()}, 2000);
							md.modal('hide');
						}
					}else{
						Alert(r.err,'error');
					}	

				})
			}
			//公共参数
			function addPublicParams(params){
				return $.extend(params||{}, {
					id : id,
					name : name,
					type : type,
					sort : sort,
					sid : sid					
				});
			}
			
			function get(uri, params, fn){
				$.post(uri, params, function(r){
					if(r.errno === 0){
						fn && fn(r.rst);
					}else{
						Alert(r.err,'error');
					}
				})
			}
			
			function renderData(){
				md.find('input.form-control').eq(0).prop('readonly', true);
				switch(flag){
					case 'gz_score'://升学成绩
						scorePart(G.getRouter('/School/getScoreList'), 'scoreList');
					break;
					case 'gz_admit_score': //录取分数线
						scorePart(G.getRouter('/School/getAdmitScoreList'), 'admit_scoreList');
						var luqu_opts = createOpts(G.PD.get('luquTypeList'), 1),
							admit_range_id_opts = createOpts(G.PD.get('gzAdmitRangeList'), 1);
						$('#luqu_id').html(luqu_opts);
						$('#admit_range_id').html(admit_range_id_opts);
					break;
					case 'admit_forte' : //特长生
						scorePart(G.getRouter('/School/getAdmitForteList'), 'admit_forteList');
					break;
					case 'schedule' ://作息时间
						scorePart(G.getRouter('/School/getScheduleList'), 'scheduleEdit');
					break;
					case 'udm_text' : //自定义模块
					case 'rich_text' : //一般编辑器
						Util.tinymce({
							elements : 'introEditor',
							setup : function(ed){
								ed.on('paste', function(e){
									clearStyle('introEditor_ifr',e);
								})
							},
							init_instance_callback  : function(){//初始化后上数据
								this.setContent(currentList.find('.operations textarea').text());
							}
						});
						if(flag === 'udm_text'){
							var v = md.find('input.form-control').eq(0).val();
							md.find('input.form-control').eq(0).prop('readonly', false).val(v === '自定义内容' ? '' : v);
						}
					break;
				}
			}
			
			function getEditTitle(target){
				var dom = (target || currentList);
				try{
					var ipt = dom.find('input[name="name"]');
					if(ipt.length){
						return ipt.val();
					}else{
						return dom.find('.name').text();
					}
				}catch(e){}
				return '';
			}
			
			var addOrEdit = function(url, opt, fn){
				$.post(url, opt, function(r){
					fn && fn(r);
				});
			};
			
			function scorePart(url, tempName){		
				listLock = true;		
				get(url, {sid:sid, module_name : aname}, function(r){
					listLock = false;
					var trs = [], items = r.list;
					
					if(flag === 'schedule'){
						try{
							renderSchedule(items.data);
							scheduleId = items.id;
						}catch(e){
							console.log('item==null');
						}
					}else{					
						$.each(items, function(i, item){
							if(flag === 'admit_forte'){
								item['cate_name'] = getTextByCateName(item.type, item.cate);
							}
							if(flag === 'gz_admit_score'){//录取分数线
								item['luqu_id_text'] = G.PD.get('luquTypeList')[item.luqu_id||1];
								item['admit_range_id_text'] = G.PD.get('gzAdmitRangeList')[item.admit_range_id||1];
							}
							trs.push(createList(tempName, item));
						});
						md.find('tbody#resultBody').html(trs.join(''));
						
						if(flag === 'admit_forte'){
							createSelectParent($('#forteSelectp'));
							$('#forteSelectp').trigger('change_forte', {dom : $('#forteSelectp'), target : $('#forteSelectp_c')});
						}
					}
				});
				
			}

			var createOpts = function(data, selected){
				var opts = [];
				$.each(data, function(i, item){
					var selectedcs;
					if(i == selected){
						selectedcs = "selected";
					}
					opts.push('<option value="'+i+'" '+selectedcs+'>'+item+'</option>');
				});
				return opts.join('');
			}

			var getNum = Util.getNum;//取数字

			var getFromVal = function(formData, vals){
				vals = vals || {};
				$.each(formData, function(i, item){
					item = $(item);
					var key = item.attr('name'), val = item.val();
					if(!key){
						key = item.attr('id');
					}
					if(item.get(0).tagName === 'input' && !item.attr('text')){
						val = getNum(val);
					}
					vals[key] = val;
				});
				return vals;
			}

			//----------------------------公共方法结束-----------------------------
			
			//------------------------------------------升学成绩--------------
			var tempTr;
			
			var checkYear = function(newYear, onlyCheckNull){
				if(newYear === '') return '请填写年份';
				if(onlyCheckNull) return '';
				var has = '';
				md.find('tbody tr:visible').each(function(){
					var td =  $(this).find('td:eq(0)');
					if(td.length && td.text().indexOf(newYear) != -1){
						has = '所填写年份已存在';								
						return false;
					}
				});
				return has;
			};
			
			var createList = function(tempName, data){
				return Util.parse(G.tpls.get(tempName), data);
			}			
			
			var insertTo = function(newYear){
				var target;
				md.find('#resultBody tr:visible').each(function(i){
					var td =  $(this).find('td:eq(0)');
					if(td.length){
						var year = getNum(td.text());
						if(year && parseInt(year) < newYear){
							target = $(this);
							return false;
						}
					}
				});
				return target;
			}
			
			
			//---------------升学成绩模块结束-----------
			
			
			//-----------------------------------------------特长生功能功能模块-----------
			var createSelectParent = function(dom){
				var optsp = [];
				for(var key in admitForte){
					optsp.push('<option value="'+key+'">'+admitForte[key]["name"]+'</option>');
				}
				dom.html(optsp.join(''));
			}
			
			var createSelectChild = function(dom, pk){
				var optsc = [], data = admitForte[pk]['child'];
				for(var key in data){
					optsc.push('<option value="'+key+'">'+data[key]+'</option>');
				}
				dom.html(optsc.join(''));
				return dom;
			}
			
			
			var getTextByCateName = function(type, cate){
				return admitForte[type]['child'][cate];
			}
			
			//-----------特长生功能模块结束-----------
			
			
			//--------------------------------------------------作息时间功能功能模块-----------
			var renderSchedule = function(data){
				var trs = md.find('tbody tr');
				$.each(data, function(i, d){
					var tr = trs.eq(i), ipts = tr.find('input');
					ipts.eq(0).val(d[0]);
					ipts.eq(1).val(d[1]);
					ipts.eq(2).val(d[2]);
				});
				
			}
			
			var scheduleId; //作息时间id
			
			//-----------作息时间功能模块结束-----------
			
			//确认删除
			$('body').on('confirm-md-sure', function(){
				if(flag === undefined || current === undefined){
					currentList.remove();
					comfireMd.modal('hide');
					return;
				}
				if(flag === 'schedule'){
					Alert('删除成功！');
					current.remove();
					current = null;
					comfireMd.modal('hide');
				}else{
					var actions = {
						"gz_score" : 'deleteScore',
						"admit_forte" : 'deleteAdmitForte',
						"gz_admit_score" : 'deleteAdmitScore'
					};
					$.post(G.getRouter('/School/'+actions[flag]), {
							id : current.attr('rel')
						}, function(r){
						if(r.errno === 0){
							Alert('删除成功！');
							current.remove();
							current = null;
							comfireMd.modal('hide');
						}else{
							Alert(r.err,'error');
						}
					})
				}
			})

			//添加记录
			md.find('.modal-body').on('click', '.form-horizontal .btn-sm', function(){// 添加
				if(flag === 'gz_score' || flag === 'gz_admit_score' || flag === 'admit_forte' || flag === 'schedule'){//升学成绩
					var formData = md.find('div.form-horizontal input[type="text"]'), result = checkYear(formData.eq(0).val());
					if((flag !== 'schedule'&& flag !== 'admit_forte' && flag !== 'gz_admit_score') && result) Alert(result, 'error');//特长生年份可以相同
					else{
						//if(flag === 'schedule' && $.trim(formData.eq(0).val()) === ''){
						//	Alert('请填写作息时间', 'error');
						//	return;
						//}
						var data = {}, url, tempName = 'scoreList';
						if(flag === 'gz_score'){//高考成绩
							data = getFromVal(formData, data);
							data.sid = sid;
							url = G.getRouter('/School/updateScore');
						}else if(flag === 'gz_admit_score'){//录取分数线
							url = G.getRouter('/School/updateAdmitScore');
							tempName = 'admit_scoreList';
							var selects = md.find('div.form-horizontal select');
							data = {
								sid : sid,
								luqu_id : selects.eq(0).val(),
								luqu_id_text : selects.eq(0).find('option:selected').text(),
								admit_range_id : selects.eq(1).val(),
								admit_range_id_text : selects.eq(1).find('option:selected').text(),
							}
							data = getFromVal(formData, data);
	
						}else if(flag === 'admit_forte'){//特长生
							url = G.getRouter('/School/updateAdmitForte');
							tempName = 'admit_forteList';
							var selects = md.find('div.form-horizontal select');
							data = {
								sid : sid,
								type : selects.eq(0).val(),
								cate : selects.eq(1).val()
							}
							data = getFromVal(formData, data);

							data.cate_name = getTextByCateName(data.type, data.cate);
						}else  if(flag === 'schedule'){//作息时间
							url = G.getRouter('/School/updateSchedule');
							tempName = 'scheduleEdit';
							var len = md.find('.modal-body tr').length, params = {};
							params[len] = {
								0 : formData.eq(0).val(),
								1 : formData.eq(1).val(),
								2 : formData.eq(2).val()
							}
							//data格式：data[N][0]=上午&data[N][1]=上午&data[N][2]=晚上
							data = {
								sid : sid,
								data : params,
								mt : '',
								at : '',
								nt :''
							};	
							var tr = createList(tempName, data);
							md.find('#removeFloat tbody').append(tr);
						}
						data.module_name = aname;
						if(flag !== 'schedule'){						
							addOrEdit(url, data, function(r){
								if(r.errno === 0){
									Alert('保存成功！');
									data.id = r.rst.id;
									var target = insertTo(Number(data.year)), tr = createList(tempName, data);
									if(!target)
										md.find('#resultBody').append(tr);
									else
										$(tr).insertBefore(target);
										formData.val('');
								}else{
									Alert(r.err,'error');
								}
							})	
						}							
					}
				}
			}).on('click', 'button.btn-warning,button.btn-danger,button.btn-default,button.btn-success', function(e){
				if($(this).hasClass('btn-danger')){//删除
					comfireMd.modal('show');
					current = $(this).closest('tr');
				}else if($(this).hasClass('btn-default')){//取消
					$(this).closest('tr').remove();
					tempTr.show();
				}else if($(this).hasClass('btn-warning')){//编辑	
					if(flag === 'gz_score' || flag === 'gz_admit_score' || flag === 'admit_forte' || flag === 'schedule'){
						tempTr = $(this).closest('tr').hide();						
						var td = tempTr.find('td');
						if(flag === 'gz_score'){//高考成绩
							$(Util.parse(G.tpls.get('scoreListEdit'), {
								year : getNum(td.eq(0).text()),
								joins : getNum(td.eq(1).text()),
								yiben_luqu : getNum(td.eq(2).text()),
								erben_a_luqu : getNum(td.eq(3).text()),
								erben_b_luqu : getNum(td.eq(4).text())
							})).insertAfter(tempTr);
						}else if(flag === 'gz_admit_score'){//录取分数线
							var luqu_opts = createOpts(G.PD.get('luquTypeList'), td.eq(1).attr('rel')),
								admit_range_id_opts = createOpts(G.PD.get('gzAdmitRangeList'), td.eq(2).attr('rel'));
								$(Util.parse(G.tpls.get('gz_admit_scoreEdit'), {
								year : getNum(td.eq(0).text()),
								luqu_opts : luqu_opts,
								admit_range_id_opts : admit_range_id_opts,
								low_mark : getNum(td.eq(3).text()),
								low_mark_last : getNum(td.eq(4).text()),
								last_student_wish : getNum(td.eq(5).text()),
								last_student_mark : getNum(td.eq(6).text()),
								last_student_num : getNum(td.eq(7).text()),
								other_low_mark : getNum(td.eq(8).text()),							
								other_low_num : td.eq(9).text()||'',
								max_wish_num : td.eq(10).text()||''
							})).insertAfter(tempTr);
						}else if(flag === 'admit_forte'){//特长生
							var vrel = tempTr.attr('vrel').split('-');
							var dom = $(Util.parse(G.tpls.get('admit_forteEdit'), {
								num : getNum(td.eq(2).text()),
								year : getNum(td.eq(0).text()),
								memo : td.eq(3).text()
							})).insertAfter(tempTr);
							var selects = dom.find('select');
							createSelectParent(selects.eq(0));
							//selects.eq(0).trigger('change_forte', {dom : selects.eq(0), target : selects.eq(1)});
							dom.find('select').eq(0).val(vrel[0]);
							createSelectChild(dom.find('select').eq(1), vrel[0]).val(vrel[1]);
							
						}else if(flag === 'schedule'){
							$(Util.parse(G.tpls.get('scheduleEdit'), {
								mt : td.eq(0).text(),
								at : td.eq(1).text(),
								nt : td.eq(2).text()
							})).insertAfter(tempTr);
						}
					}else if(flag === ''){
					
						
					}
				}else if($(this).hasClass('btn-success')){//保存
					if(flag === 'gz_score' || flag === 'gz_admit_score' || flag === 'admit_forte'){
						var editTr = $(this).closest('tr'), tds = editTr.find('input'), result = checkYear(tds.eq(0).val(), (flag === 'admit_forte' || flag === 'gz_admit_score'));		
						if(result ) Alert(result, 'error');
						else{						
							var data = {}, url, tempName = 'scoreList';
							if(flag === 'gz_score'){//升学成绩
								data = {
										id : editTr.prev().attr('rel'),
										sid : sid
								};
								data = getFromVal(tds, data);
								url = G.getRouter('/School/updateScore');
							}else if(flag === 'gz_admit_score'){//录取分数线
								url = G.getRouter('/School/updateAdmitScore');
								tempName = 'admit_scoreList';

								var selects = editTr.find('select');
								data = {
									id : editTr.prev().attr('rel'),
									sid : sid,
									luqu_id : selects.eq(0).val(),
									luqu_id_text : selects.eq(0).find('option:selected').text(),
									admit_range_id : selects.eq(1).val(),
									admit_range_id_text : selects.eq(1).find('option:selected').text(),
								}
								data = getFromVal(tds, data);	
							}else if(flag === 'admit_forte'){//特长招生
								url = G.getRouter('/School/updateAdmitForte');
								tempName = 'admit_forteList';
								var selects = editTr.find('select');
								data = {
									id : editTr.prev().attr('rel'),
									sid : sid,
									type : selects.eq(0).val(),
									cate : selects.eq(1).val()
								}
								data = getFromVal(tds, data);
								data.cate_name = getTextByCateName(data.type, data.cate);
							}
							data.module_name = aname;
							addOrEdit(url, data, function(r){
								if(r.errno === 0){
									editTr.prev().replaceWith(createList(tempName, data));
									editTr.remove();
								}else{
									Alert(r.err,'error');
								}
							})		
						}
					}
				}
			}).on('change', 'select.input-sm', function(){//特长生项目选择
				if(flag !== 'admit_forte') return;
				if($(this).attr('rel') != 'parent') return;
				var parent = $(this).closest('tr.warning'), child;
				if(parent.length === 0){
					parent = $(this).closest('div.form-group');
				}
				child = parent.find('select').eq(1);
				md.trigger('change_forte', {dom : $(this), target : child});
			});
			
			md.on('click', '#surebtn', function(evt){// 确认
				if(listLock) return;
				var jqt = $(this);
				if(jqt.data('lock')) return;
				jqt.data('lock', 1);
				if(flag === 'gz_score' || flag === 'gz_admit_score' || flag === 'admit_forte'){//升学成绩\录取分数线\特长招生				
					var ids = [], key = 'data['+currentList.index()+']', params = addPublicParams({});
					md.find('#resultBody tr:visible').each(function(i){
						ids.push($(this).attr('rel'));
					});
					params[key] = {
							flag : flag,
							module_name : aname,
							value : ids.join(','),
							name : aname,
							sys : sys
						};
						
					updateInfo(params, function(r){
						jqt.data('lock', '');
						if(currentList.find('input').length ===0){
							currentList.append('<input class="hidden" value="未刷新">');
						}
						Alert('保存成功！');
						//setTimeout(function(){location.reload()}, 2000);
						md.modal('hide');
					});
				
				}else if(flag === 'schedule'){//作息时间
					var data = {}, k = 0, key = 'data['+currentList.index()+']';
					md.find('tbody tr').each(function(i, item){
						var ipts = $(item).find('input');
						if($.trim(ipts.eq(0).val())|| $.trim(ipts.eq(1).val()) || $.trim(ipts.eq(2).val())){
							data[k] = {};
							data[k][0] = $.trim(ipts.eq(0).val());
							data[k][1] = $.trim(ipts.eq(1).val());
							data[k][2] = $.trim(ipts.eq(2).val());
							k++;
						}						
					});
					$.post(G.getRouter('/School/updateSchedule'), {
						id :scheduleId,
						sid : sid,
						data : data
					}, function(r){
						if(r.errno === 0){
							//id = r.rst.id;
							var params = addPublicParams({}), scheduleId = r.rst.id;							
							params[key] = { flag : flag, value : scheduleId, name : getEditTitle(), sys:sys};
							updateInfo(params, function(r){								
								currentList.find('input[name="value"]').val(scheduleId);
								Alert('保存成功！');
								md.modal('hide');
								jqt.data('lock', '');
							})							
						}else{
							jqt.data('lock', '');
							Alert(r.err,'error');
						}	
					})
				}else if(flag === 'rich_text' || flag === 'udm_text'){//富文本
					var text = tinymce.get('introEditor').getContent(), key = 'data['+currentList.index()+']',
						params = addPublicParams({}), _name = $.trim(md.find('input.form-control').eq(0).val());
						if(_name === ''){
							jqt.data('lock', '');
							Alert('请填写名称!','error');
							return;
						}
						params[key] = { flag : flag, value : text, name : _name, sys:sys};
						updateInfo(params, function(r){
							$(this).data('lock', 1);
							if(currentList.find('input').length ===0){
								currentList.append('<input class="hidden" value="未刷新">');
							}
							if(flag === 'udm_text'){
								currentList.find('.name').text(_name);
								currentList.find('input[name="name"]').val(_name);
							}
							
							if(!currentList.find('.operations textarea').length){
								currentList.find('.operations>a[rel]').append('<textarea class="hidden"></textarea>');
							}
							currentList.find('textarea').each(function(i, item){
								$(item).text(text);
							});
							Alert('保存成功！');
							md.modal('hide');
							jqt.data('lock', '');
						})	
				
				}
			})
			
			
/*---------------------------------------经验分享----------------------------------------------------------------*/			
		
		
		}else if(luri.indexOf(router[3]) > 0){//经验分享
			var tips_list = $('#tips_list'), editId, tipsForm = $('#tipsForm');
			listHandle(tips_list, 'selectAll' , G.getRouter('/tip/delete/school_id/'+$('#school_id').val()), function(){
				location.reload();
			});
			
			tips_list.on('click', 'tbody tr a.btn-warning', function(){
				editId = $(this).closest('tr').attr('rel');
			})
			
			var modalAddExperience = $('#modalAddExperience');
			modalAddExperience.on('show.bs.modal',function(e){
				var info = tips[editId];
				clearModal();
				if(editId && info){
					renderEditor(info);
				}
				$('#eid').val(editId||'');
				$('#btn').text(editId?'修改' : '添加');
				photoList.initReady();
			}).on('hide.bs.modal',function(e){				
				editId = '';
			});
			
			function clearModal(){
				tipsForm.find('input,select,textarea').val('');
				$('#preview').html('');
			}
			
			function renderEditor(info){			
				for(var k in info){
					if(k === 'impression'){
						$.each(info[k].split('@'), function(i, item){
							tipsForm.find('input[name=impression'+(i+1)+']').val(item);
						});
						
					}else
						tipsForm.find('input[name='+k+']').val(info[k]);
				}
				tipsForm.find('select').val(info.role);	
				tipsForm.find('textarea').val(info.content);
				$('#preview').html(
					Util.parse(previewTemp, {i:1, result : '/data/uploads/'+info.avatar})
				);				
			}			
			
			
			var previewTemp = '<div class="thumbnail avatar" id="uploadList_{.i}"><img width=56 height=56 src="{.result}" alt=""></div></div>'
			
			var photoList = new html5Upload({
				fileType : ['jpg','gif','png'],//[jpg,gif,png] //允许上传格式（*表示都可以上传）
				fileInput: $("#school_img").get(0),
				url :  G.PD.get('uploadUri') || G.getRouter('/admin/upload/html5upload'),
				autoUpload : true, //是否自动上传
				previewImgTemp : previewTemp,
				preview : $('#preview'),
				initReady : function(){
					var childs = this.preview.children(), len = childs.length;
					if(len === 0) return;
					for(var i=0;i<len;i++){
						childs.eq(i).attr('id', 'uploadList_'+(i+1));
						this.saveStack.push({url:'', index : i+1 });
					};
					this.uploadIndex = i;
				},
				afterOneSuccess : function(file, response){
					var dom = this.getDomByIndex(file.index);
					tipsForm.find('input[name="avatar"]').val(response.rst.uri);
				},
				
				beforeDel : function(index){
					if(this.saveStack.length == 0) return;
					var self  = this, file = this.saveStack[0], filepath = file.url;
					self.removeSaveStack(file.index);
				},
				
				beforeUpload : function(formData){
					formData.append('path', 'xuexiao/avatar');
				},
				onComplete: function() {
					this.fileInput.value = '';
				}
			});
			
			
			new G.cls.validate({
				form : tipsForm
				,eachCallBall : function(dom, data){
					Alert(data.m,'error');
					return false;
				}
				//,elements : modalAddSchool.find('input[type="text"],select')
				, trigger : '#btn'
				, onSuccess : function(data){
					var property = [], that = this;
					$.post(tipsForm.attr('action'), data, function(r){
						if(r.errno === 0){
							Alert('创建成功');
							location.reload();
							that.elements.each(function(){
								$(this).val('');
							});
						}else{
							Alert(r.err,'error');
						}
						that.lock = false;
					})
				}
			});
		
		}
	})
 
 
})(jQuery, window, Gaofen)
 