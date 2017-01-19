/**
 * Created by zhiwen on 2015-04-21.
 */
 
(function($, win, G){

    var luri = location.href.toLowerCase(), router = [	
    	'teacheradmin/teacher/list',//列表
		'teacheradmin/teacher/editparta',//基本信息
		'teacheradmin/teacher/editpartb' //详细信息
		
		],//经验分享
		
		Util = G.util,

		Ajax = G.Ajax,

		PD = G.PD,
		
		Alert = G.tips.alert;
	
	G.place = 'teacheradmin';

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

		if(luri.indexOf('id') === -1){
			$('#headTab').on('click', 'a', function(e){
				e.preventDefault();
			})
		}
				
		//路由
		if(luri.indexOf(router[0]) > 0){//列表
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

			new G.cls.validate({
				form : modalAddSchool
				,eachCallBall : function(dom, data){
					Alert(data.m,'error');
					return false;
				}
				,elements : modalAddSchool.find('input[type="text"],select')
				, trigger : '#addSure'
				, onSuccess : function(data){
					var property = [], that = this;
					modalAddSchool.find('input[type="checkbox"]:checked').each(function(){
						property.push(this.value);
					})
					var areaData = areaNewCmp.getData();
					$.post(G.getRouter('/school/create'), {//添加学校
						name : data.school_name,
						district : areaData.district,
						city : areaData.city,
						property : property.join(',')
					}, function(r){
						if(r.errno === 0){
							Alert('创建成功');
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

			//停用、启用
			G.actions.reg('stop-start', function(e){
				var dom = $(e.target);
				dom.data('lock', true);
				G.Ajax.send(dom.attr('href'),{}, function(r){
					if(r.errno == '0'){
						location.reload();
					}else{
						Alert(r.err||'操作失败', 'error');
					}
				})
			})

		}else if(luri.indexOf(router[1]) > 0){//基础信息
			//上传头像
			var HU = new html5Upload({
				fileType : ['jpg','gif','png'],//[jpg,gif,png] //允许上传格式（*表示都可以上传）
				fileInput: $("#facefile").get(0),
				fileObject : 'file',
				//url: '/admin/ajax/fileUpload',
				url: G.PD.get('uploadUri'),
				//http://editor.wp.com/index.php?mod=upload&action=html5&dosubmit=1&path=
				autoUpload : true, //是否自动上传
				preview : $('#facefilePreview'),
				initReady : function(e){
					var img = this.preview.find('img');
					if(img.length){
						var src  = img.attr('src');
						if(src === '' || src === '#')
							this.preview.children().remove();
						}
				},
				uploadReady : function(){
					// var img = this.preview.find('img'), src  = img.attr('src');
					// if(src === '' || src === '#')
					// 	this.preview.hide();
				},
				beforeDel : function(index){
					if(this.saveStack.length == 0) return;
					var self  = this, file = this.saveStack[0], filepath = file.webpath;
				//self.successcb();
					self.removeSaveStack(file.index);
				},
				successcb : function(){
					$('#cover').val('');
				},
				afterOneSuccess : function(file, response){
					this.preview.show();
					// $('#cover').val(response.uri);
					this.preview.find('img').attr('src', response.rst.url);
					$('#headimg').val(response.rst.uri);
				},
				beforeUpload : function(formData){
					// formData.append('thumb_width', thumb_width);
					// formData.append('thumb_height', thumb_height);
					// formData.append('watermark', watermark);
					formData.append('path', 'teacher');
					// formData.append('type', ftype);
					//uploading = true;
				},
				host : '/data/uploads/',
				onComplete: function() {//上传完成
					var chs = this.preview.children();
					if(chs.length > 1)
							chs.eq(0).remove();
					// this.preview.find('.upload_append_list').show();
				}
			});	


			var apobj = FN.areaPublic();
			// apobj.selectArea();


			var baseinfo = $('#baseinfo');
			new G.cls.validate({
				form : baseinfo
				,eachCallBall : function(dom, data){
					Alert(data.m,'error');
					return false;
				}
				,elements : baseinfo.find('input[type="text"],select')
				, trigger : '#addSure'
				, onSuccess : function(data){
					var params = $('#baseinfo').serializeArray();
					// var pid = $('#resideprovince').find('option:selected').attr('did'),
					// 	cid = $('#residecity').find('option:selected').attr('did'),
					// 	did = $('#residedist').find('option:selected').attr('did');

					// params.push({name : 'province', value : pid+'_'+$('#resideprovince').val()});
					// params.push({name :'city', value : cid+'_'+$('#residecity').val()});
					// params.push({name : 'district', value : did+'_'+$('#residedist').val()});
					// var src = $('#headimg').attr('src');
					// if(src && src != '#'){
					// 	params.push({name : 'headimg', value : src});
					// }

					// params.push({name :'city', value :$('#p_city').val()});
					// params.push({name :'district', value :$('#d_city').val()});

					Ajax.send('/Teacheradmin/Teacher/savePartA', params, function(r){
						if(r.errno == '0'){	
							Alert('保存成功！');
							if(luri.indexOf('id') === -1){
								location.href = r.rst.return_url;
							}
						}else{
							Alert(r.err, 'error');
						}

					}, 'post');
					return false;
				}
			});

			var sosomodal = $('#modalConfirmsosomap');

			sosomodal.on('show.bs.modal',function(e){
				FN.sosomap({latLng:{lat: Number($('#lat').val()), lng: Number($('#lon').val())}});						
			}).on('hide.bs.modal',function(e){	

			});

			sosomodal.find('#setPosition').on('click', function(e){
				var v = $('#latLng_pid').val();
				if(v){
					v = v.split(',');
					$('#lon').val(v[1]);
					$('#lat').val(v[0]);
				}
				sosomodal.modal('hide');
			});

			//选择地区
			var districtInit = false, setDistrict = function(result){
				var opts = ['<option value="">请选择地区</option>'];
				$.each(result, function(i,v){
					console.log(i,v)
					opts.push(Util.parse('<option value="{.id}_{.name}">{.name}</option>', {
						id : i,
						name : v
					}));
				});
				$('#d_city').html(opts.join(''));

				if(!districtInit){

					var v = $('#d_city').attr('rel');
					$('#d_city').find('option').each(function(i, item){
						if($(item).val() === v){
							$(item).prop('selected', true);
						}
					})
					districtInit = true;
				}
			};
			$('#p_city').on('change', function(){
				var v = this.value;
				if(v === '') setDistrict([]);
				else
					Ajax.send('/teacheradmin/teacher/getLocation', {
						city : v.split('_')[0]
					}, function(r){
						if(r.errno == '0'){	
							setDistrict(r.rst)
						}else{
							Alert(r.err, 'error');
						}
					}, 'post');
			}).trigger('change');



		}else if(luri.indexOf(router[2]) > 0){//详细信息
			var view = $('#partB'), tabs = view.find('#tabs'), activecs = 'active',
				lock;
			tabs.parent().on('click', 'li', function(e){
				e.preventDefault();
				if(lock){
					Alert('正在保存！','error');
					return;
				}
				var jqli = $(this), index = jqli.index();
				// console.log(jqli.index())
				if(jqli.hasClass(activecs)) return;
				tabs.find('.'+activecs).removeClass(activecs);
				jqli.addClass(activecs);
				var textareas = view.find('.form-group');
				textareas.each(function(i, item){
					if(i === index) $(item).removeClass('hidden');
					else $(item).addClass('hidden');
					// if($(item).hasClass('hidden')){
					// 	$(item).removeClass('hidden');
					// }else{
					// 	$(item).addClass('hidden');
					// }
				});
			});

			Util.tinymce({
				elements : '',
				selector: 'textarea',
				height : 400,
				width : 1000,

				setup : function(ed){
					ed.on('paste', function(e){
						tinymce.clearStyle('introEditor_ifr',e);
					})
				},
				plugins: [
					'filemanager', 'code','link','myupload'
				],
				toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link myupload code'
			});

			$('#introBtn').on('click', function(e){
				e.preventDefault();
				if(lock) return;
				lock = true;
				var li = tabs.find('.'+activecs), index = li.index(),
					params = {id : $('#id').val()},
					content1 = tinymce.get('introEditor').getContent(),
					content2 = tinymce.get('featureEditor').getContent();
				// if(index === 0 ){
					params.intro = content1;
				// }else{
					params.feature = content2;
				// }
				Ajax.send('/Teacheradmin/Teacher/savePartB', params, function(r){
					lock = false;
					if(r.errno == '0'){	
						Alert('保存成功！');
					}else{
						Alert(r.err, 'error');
					}
				}, 'post');
				
			})

		
		}
	});


	var FN = G.FN = {
		//地区共用模块
		areaPublic : function(id){
			var picInit = false, cityInit = false, distInit = false;
			window['showdistrict'] = function(container, elems, totallevel, changelevel){
				if(changelevel === 3) return;
					function isUndefined(variable) {
						return typeof variable == 'undefined' ? true : false;
					}
				var cont = $("#"+container);
				var getdid = function(elem) {
					var op = elem.find("option:selected");
					return op.eq['did'] || op.attr('did') || '0';
				};
				var pid = changelevel >= 1 && elems[0] && $("#"+elems[0]) ? getdid($("#"+elems[0])) : 0;
				var cid = changelevel >= 2 && elems[1] && $("#"+elems[1]) ? getdid($("#"+elems[1])) : 0;
				var did = changelevel >= 3 && elems[2] && $("#"+elems[2]) ? getdid($("#"+elems[2])) : 0;
				var coid = changelevel >= 4 && elems[3] && $("#"+elems[3]) ? getdid($("#"+elems[3])) : 0;
				var geturl = "http://my.gaofen.com/ajax/getLocation?op=district&container="+container
					+"&province="+elems[0]+"&city="+elems[1]+"&district="+elems[2]+"&community="+elems[3]
					+"&pid="+pid + "&cid="+cid+"&did="+did+"&coid="+coid+'&level='+totallevel+'&handlekey='+container+'&inajax=1'+(isUndefined(changelevel) ? '&showdefault=1' : '')+'&callback=?';

				Ajax.send(geturl,{},function(msg){
					try{
						var value = msg.html;
						if(value){
							cont.html(value);
							if(_province){
								setOption('resideprovince', _province);
								_province = null;
							}else if(_province === null && _city){
								setOption('residecity', _city);
								_city = null;
							}else if(_city === null && _district){
								setOption('residedist', _district);
								_district = null;
							}
						}
						if(cityInit === false && typeof remote_ip_info !== 'undefined'){
							$('#residecity option[value^="'+remote_ip_info.city+'"]').prop('selected', true).change();
							cityInit = true;
						}
					}catch(e){}

				},'jsonp');
			};




			$("#residedistrictbox").click(function(){
				picInit = true;
				cityInit = true;
			});


			var setOption = function(id, v){
				$('#'+id).find('option[did='+v+']').prop('selected', true).change();
			}

			
			var _province = PD.get('province'),
				_city = PD.get('city'),
				_district = PD.get('district');

			if(_province) setOption('resideprovince', _province);
			_province = null;
			
			return {
				checkArea : function(){
					var residedistrictbox = $('#residedistrictbox'), select = residedistrictbox.find('select'), isSelect = true;
					select.each(function(i, item){
						if($(item).val() === ''){
							isSelect = false;									
							return false;
						}
					});
					if(!isSelect){
						residedistrictbox.parent().removeClass('success').addClass('error').find('.help-inline').text('请选择地区');
						return false;
					}else{
						residedistrictbox.parent().removeClass('error').addClass('success').find('.help-inline').text('OK');
						return true;
					}
				}
			
			}
		},


		mapObj : {
			map : null,
			info : null,
			marker : null,
			geocoder:null
		},
		sosomap : function(config){
			// config.latLng.lat = 23.126162;
			// config.latLng.lng = 113.282713
			var _address, isAddress = false;
			infohtml = function(n){
				return '<div style="text-align:center;white-space:nowrap;margin:10px;">'+n+'</div>';
			},
			setLatLng = function(latLng){
				$('#latLng_pid').val(latLng.lat+','+latLng.lng);
			},
			createScript = function(){
				var script = document.createElement("script");
				script.id = 'sosomap';
				script.type = "text/javascript";
				script.src = "http://map.qq.com/api/js?v=2.exp&key=C6LBZ-ZFZ2D-NYV4D-PA45D-ZJ4V5-SRFGN&callback=sosomapInit";
				document.body.appendChild(script);
			},
			addMark = function(center){
				if(FN.mapObj.marker)
					FN.mapObj.marker.setMap(null);
				var info = FN.mapObj.info;
	            FN.mapObj.marker = new qq.maps.Marker({
	                map:FN.mapObj.map,
	                draggable : true,
	                position: center
	            });
	            setLatLng(center);
	            qq.maps.event.addListener(FN.mapObj.marker, 'dragend', function(e) {
			        center = e.latLng;
			        setLatLng(center);
			        isAddress = true;
			        FN.mapObj.geocoder.getAddress(center);

			    });
			    qq.maps.event.addListener(FN.mapObj.marker, 'dragstart', function(e) {
			        center = e.latLng;
			        // isAddress = true;
			        // FN.mapObj.geocoder.getAddress(center);
			        info.close();
			    });

				qq.maps.event.addListener(FN.mapObj.marker, 'click', function(e) {
			        info.open(); 
			        info.setContent(infohtml(_address));
			        info.setPosition(center); 
			    });
			},
			initMark = function(cent){
				if(cent.lat == 0 || cent.lng == 0) return;
				setLatLng(cent);
				var _center = new qq.maps.LatLng(cent.lat, cent.lng);
				addMark(_center);
				isAddress = true;
				FN.mapObj.geocoder.getAddress(_center);
			}
			if($('#sosomap').length){
				if(config && config.latLng){
					initMark(config.latLng);
				}
				return;
			}else{
				createScript();
			}
			window.sosomapInit = function(e){
				var myLatlng = new qq.maps.LatLng(23.129163, 113.264435);
				  var myOptions = {
				    zoom: 9,
				    center: myLatlng,
				    mapTypeId: qq.maps.MapTypeId.ROADMAP
				  }
				  var map = new qq.maps.Map(document.getElementById("sosocontainer"), myOptions);


				  FN.mapObj.geocoder = new qq.maps.Geocoder({
				        complete : function(result){
				        	// debugger;
				        	_address = result.detail.address;
				        	if(isAddress){
				        		$("#address").val(_address);
				        		FN.mapObj.info.setContent(infohtml(_address));
				        		return;
				        	}
				        	if(FN.mapObj.marker){
				        		FN.mapObj.marker.setMap(null);
				        		FN.mapObj.info.close();
				        	}
				        	var center = result.detail.location;
				        	// debugger;
				        	addMark(center);
				            FN.mapObj.map.setCenter(center);

				        }
				    });


				FN.mapObj.info = new qq.maps.InfoWindow({
			        map: map
			    });

				FN.mapObj.map = map;

				$('#searcharea').on('click', function(e){
				  	e.preventDefault();
				  	isAddress = false;
			  		var address = $("#address").val();
					FN.mapObj.geocoder.getLocation(address);
				});
				if(config && config.latLng){
					initMark(config.latLng);
				}
				
			};


		}
	}
 
 
})(jQuery, window, Gaofen);
 