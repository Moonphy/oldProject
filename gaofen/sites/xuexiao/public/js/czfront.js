/**
 * Created by zhiwen on 2014-12-03.
 * xuexiaocz 初中前台功能
 */
"use strict";
 (function($, win, G){

	var Util = G.util,
		
		Alert = G.tips.alert,	

		PD = G.PD,				

		contrastName = 'czschoolList',

		contrastMax = 4,

		isIE6 = navigator.userAgent.indexOf("MSIE 6.0") > 0;

	G.place = 'front';

	G.setContrastName(contrastName);

	G.setSearchUri('/cz/ajax/search');

	//一般提示层，同时只能显示一个这样的层
	var tipModalObj = null,
		Templet = G.Templet,
		tipModal = G.cls.createPK,
		contrastMove = G.cls.contrastMove,
		searchPublic = G.cls.searchPublic,
		contrastEffect = G.cls.contrastEffect,

		//PK层
	    createPK = G.cls.createPK,

	    localStorageCon = G.cls.localStorageCon;


	//对比公共方法

	function hasContrast(id, cons){
		var flag = false;
		if(id === undefined) return flag;
		$.each(cons, function(i, item){

			if(item.id === id){
				flag = true;
				return false;
			}
		});
		return flag;
	}



	//右则PK设置对比数
	function setPk(noani){	
		var ls = localStorageCon.get();
		$('#pk').find('span')[ls.length ? 'removeClass' : 'addClass']('hidden').text(ls.length);
		if(ls.length && !noani){
			$('#pk').addClass('ani');
			setTimeout(function(){
				$('#pk').removeClass('ani');
			}, 500);
		}
	}

	
	G.event();

	$(function(){

		//IE6只能在dom ready时调用
		Util.localStorage = Util.localStorage();

		G.on('setpk', function(p){
			setPk(p);
		});

		G.on('moveSuccess', function(p){
			G.fire('setpk');
		});

		G.on('deletecmp', function(p){
			G.fire('setpk');
		});

		var cpk;

		G.on('showPkBox', function(p){
			var modal = cpk.getView(), childs = modal.find('#mb').children(':lt(3)');
			childs.addClass('hidden');
			childs.eq(p.num > contrastMax ? 2 : (p.num === 0 ? 0 : 1)).removeClass('hidden');
			cpk.show();
		})
		$('#pk').on('click', function(e){
			e.preventDefault();
			e.stopPropagation();
			G.fire('showPkBox', {num : localStorageCon.get().length});
		});
		//加入对比层结束


		//模拟下拉选择框
		var uiSelects = $('.ui-select').each(function(i, uiSelect){
			var jqItem = $(uiSelect);
			new G.cls.LikeSelect({
			 	view : jqItem,
			 	handle : jqItem.find('.ui-select-trigger'),//点击位置
				valueInput : jqItem.find('.ui-select-trigger input'),
				textArea : jqItem.find('.ui-select-trigger span'),
				dropdown : jqItem.find('.ui-dropdown')
			 });

		});

		//民校推荐公用（首页与升学指导）
		var recommend = function(cboxs, btns, fn){
			var ids = [];
			cboxs.on('click', function(e){
				var checkboxs = $(this).closest('form').find('input[type=checkbox]:checked');
				if(checkboxs.length){
					fn(false, btns);
					ids = [];
					checkboxs.each(function(i, item){
						ids.push(item.value);
					});
					if(ids.length > 2){
						e.preventDefault();
						setTimeout(function(){G.cls.tipModal({
							tip_cs : 'alert-error',
							msg : '亲，别太贪心呐！最多选2项。'
						});},1);
						
					}
				}else{
					ids = [];
					fn(true, btns);
				}
			});
		};


		//特长生招生公用部分（首页与升学指导）
		var selectForm = function(view){
			var selects = view.find('select'), 
			btns =  view.find('div.actions').children(), admitForte = PD.get('admitForte'),
			setBtn = function(isLock, _btns){
				_btns.eq(0)[isLock ? 'addClass': 'removeClass']('hidden');
				_btns.eq(1)[!isLock ? 'addClass': 'removeClass']('hidden');
			};
			var checkSelectAll = function(){
				var flag = true;
				uiSelects.each(function(){
					if($(this).find('input').val() === ''){
						flag === false;
					}
				});
				setBtn(!flag, btns);
			};
			var eachSelect = function(data, dom){
				var opts = [], i = 0;
				for(var k in data){
					i++;
					var v = $.type(data[k]) === 'string' ? data[k]:data[k].name; 
					opts.push('<li rel="value:'+k+'">'+v+'</option>');
				}
				dom.html(opts.join(''));
				dom.children('li:eq(0)').trigger('click');
			};

			var uiSelects = view.find('.ui-select').each(function(i, uiSelect){
				var jqItem = $(uiSelect), nid = jqItem.attr('vrel');
				if(nid){
					G.on('likeSelect-valueChange'+nid, function(p){
						if(i === 1){
							eachSelect(admitForte[p.newValue].child, uiSelects.eq(2).find('ul'));
						}
						checkSelectAll();
					});
				}							

			});
			eachSelect(admitForte, uiSelects.eq(1).find('ul'));

			var lock = false;
			view.find('div.actions').find('a.btn-primary').on('click', function(e){
			 	e.preventDefault();
			 	view.submit();
											
			});

			checkSelectAll();


		};	

		var channel = PD.get('channel'), action = PD.get('action'), hasPKfloat = PD.get('hasPKfloat');

		switch(channel){

			case 'xuexiao' :
				switch(action){

					case 'front' ://首页
						//分页列表
						var lock = false, page = 1;
						$('#more_btn').on('click', function(e){
						//$('body').on('click', function(e){
							e.preventDefault();
							if(lock === true) return;
							lock = true;
							var matchData = location.href.match(/page=(\d)/);
							if(matchData && matchData.length > 1){
								page = parseInt(matchData[1]);
							}

							var params = PD.get('params');
							if($.type(params) !== 'object')
								params = {};
								//for(var key in params){
								//	newParams.push(key+'='+encodeURIComponent(params[key]));
								//}

							params['page'] = encodeURIComponent(++page);
							


							// var params = location.search, newparams;
							// if(params && /page=/.test(params)){
							// 	newparams = params.replace(/page=\d/, 'page='+(++page));
							// }else{
							// 	newparams = params ? params+'&page='+(++page) : '?page='+(++page);
							// }

							var loadcs = 'view-loading', pt = $(this).parent().addClass(loadcs);
							G.Ajax.send(G.getRouter('/cz/school/ajaxSchools'), params, function(r){
								if(r.errno == '0'){
									$('#school_list').append(r.rst.html);
									if($('#school_list').children().length >= Number(r.rst.total)){
										$('#more_btn').parent().hide();
									}
									pt.removeClass(loadcs);
								}
								lock = false;

							})
						});

						G.on('joincmp', function(p){//监听“加入对比”
							$('div[rel="'+p.data.id+'"]').each(function(i, li){
								contrastEffect(4, $(li));
							});
							
						});

						G.on('deletecmp', function(p){
							$('div[rel="'+p.item.id+'"]').each(function(i, li){
								contrastEffect(41, $(li), p.item);
							});
						});


						var sg = $('.school-grid');
						var isPked = function(items){
							var joined = localStorageCon.get();
							if(joined.length){
								items.each(function(i, div){
									if(hasContrast($(this).attr('rel'), joined)){
										contrastEffect(4, this);
									}else{
										contrastEffect(41, this);
									}
								});
							}
						};

						sg.each(function(i, sgitem){
							isPked($(sgitem).children());
						});
						G.on('grid-change-pk', function(e){
							isPked(sg.eq(1).children());
						});

						//中间搜索
						searchPublic($('#bodySearch'));



						//搜索列表展开
						$('div.single-line').each(function(i, item){
							var jqt = $(item), content = jqt.find('.filter-options'), h = content.height();
							if(h > 27){
								jqt.find('.filter-operations').click(function(e){
									e.preventDefault();
									jqt.toggleClass('single-line');
								}).display(1);
							}
						});

						//后则功能

						//需要登录浮层做好后才开放
						$('div.school-list li').each(function(i, item){
							$(item).hover(function(){
								$(this).find('span.operations').display(1);
							}, function(){
								$(this).find('span.operations').display(0);
							})
						});
						//右则切换
						$('#switcher').on('click', 'span', function(e){
							var jqt = $(this), rel = jqt.attr('rel');
							if(jqt.hasClass('active')) return;
							$(this).parent().find('.active').removeClass('active');
							jqt.addClass('active');
							$('#'+(rel === 'ps' ? 'gs' : 'ps')).addClass('hidden');
							$('#'+rel).removeClass('hidden');
						});

						//民校推荐
						var recommendDom = $('#recommend'), checkboxs = recommendDom.find('input[type="checkbox"]');
						var btns = recommendDom.find('#actions').children();
						btns.on('click', function(e){
							if(recommendDom.find('input[type=checkbox]:checked').length === 0){
								setTimeout(function(){G.cls.tipModal({
									tip_cs : 'alert-error',
									msg : '请选择条件'
								});},1);
								e.preventDefault();
								return false;
							}
							return true;
						})
						recommend(checkboxs, btns, $.noop);

						//setBtn(recommendDom.find('input[type=checkbox]:checked').length === 0, btns);

						//特长生招生查询
						selectForm($('#selectform'));

						//右则功能结束
						break;

					case 'index' : //搜索页

						G.on('joincmp', function(p){//监听“加入对比”
							$('li[rel="'+p.data.id+'"]').each(function(i, li){
								contrastEffect(2, $(li).find('div.operations'));
							});
							
						});

						G.on('deletecmp', function(p){
							$('li[rel="'+p.item.id+'"]').each(function(i, li){
								contrastEffect(21, $(li).find('div.operations'), p.item);
							});
						});


						var joined = localStorageCon.get(), divs = $('li>div.operations');
						if(joined.length){
							divs.each(function(i, div){
								if(hasContrast($(this).closest('li').attr('rel'), joined)){
									contrastEffect(2, this);
								}
							});
						}

						//需要登录浮层做好后才开放
						$('div.school-list li').each(function(i, item){
							$(item).hover(function(){
								$(this).find('span.operations').display(1);
							}, function(){
								$(this).find('span.operations').display(0);
							})
						});
						//右则切换
						$('#switcher').on('click', 'span', function(e){
							var jqt = $(this), rel = jqt.attr('rel');
							if(jqt.hasClass('active')) return;
							$(this).parent().find('.active').removeClass('active');
							jqt.addClass('active');
							$('#'+(rel === 'ps' ? 'gs' : 'ps')).addClass('hidden');
							$('#'+rel).removeClass('hidden');
						});

						//民校推荐
						var recommendDom = $('#recommend'), checkboxs = recommendDom.find('input[type="checkbox"]');
						var btns = recommendDom.find('#actions').children();
						btns.on('click', function(e){
							if(recommendDom.find('input[type=checkbox]:checked').length === 0){
								setTimeout(function(){G.cls.tipModal({
									tip_cs : 'alert-error',
									msg : '请选择条件'
								});},1);
								e.preventDefault();
								return false;
							}
							return true;
						})
						recommend(checkboxs, btns, $.noop);

						//setBtn(recommendDom.find('input[type=checkbox]:checked').length === 0, btns);

						//特长生招生查询
						selectForm($('#selectform'));

						//右则功能结束

						break;

					case 'detail' : //详细页	
						window.baiduMapInit = function (){
							G.fire('baiduMapInit');//避免没有加载完就点击查看地图
						}
						//function loadJScript() {
						var script = document.createElement("script");
						script.type = "text/javascript";
						script.src = "http://api.map.baidu.com/api?v=2.0&ak=6LTxrDxBGhNt9R6Tgph2dzgQ&callback=baiduMapInit";
						document.body.appendChild(script);
					
						//右则切换
						$('#switcher').on('click', 'span', function(e){
							var jqt = $(this), rel = jqt.attr('rel');
							if(jqt.hasClass('active')) return;
							$(this).parent().find('.active').removeClass('active');
							jqt.addClass('active');
							$('#'+(rel === 'ps' ? 'gs' : 'ps')).addClass('hidden');
							$('#'+rel).removeClass('hidden');
						})					

						G.on('joincmp', function(p){//监听“加入对比”
							contrastEffect(3, $('#contrastBtn'));	
						});

						G.on('deletecmp', function(p){
							contrastEffect(31, $('#contrastBtn'));	
						});
						var id = Util.parseKnV($('#contrastBtn').attr('rel'))['id'];
						
						if(localStorageCon.match(id)){
							contrastEffect(3, $('#contrastBtn'));
						}

						var fixeddiv = $('<div class="tabs-fixed hidden"><div class="container"></div></div>').appendTo('body');
						fixeddiv.find('.container').html($('div.tabs').clone());
						var top = $('.tabs').eq(0).offset().top;
						$(window).scroll(function(){
							var sh = $(this).scrollTop();		
							if(sh>top){
								fixeddiv.removeClass('hidden');			
							}else{
								fixeddiv.addClass('hidden');
							}
						});

						$(window).scroll();

						//右则显示对比
						$('div.school-list ul li').hover(function(){
							$(this).find('span.operations').removeClass('hidden');
						},function(){
							$(this).find('span.operations').addClass('hidden');
						});

						//显示QQ群
						G.Ajax.send('http://m.gaofen.com/ajax/qqgroup?callback=?', {
							channel : 'school', 
							city : remote_ip_info.city,
							section : 'xsc'
						}, function(r){	
							// if(r.err == '0'){		
								try{
									if(r.rst){
										$('div.qq-group').html(r.rst);
									}else{
										$('div.qq-group').remove();
									}
								}catch(e){

								}
							// }
									
						}, 'jsonp');

					break;

					case 'picture' : //图片页
						var lists = PD.get('imgList');
						if(lists.length > 1){
							new G.cls.picPreview({
								imgList : lists,
								view : $('#pic_body'),
								viewMain : $('#picView')
							});
						}

					break;

					case 'guide' : //升学指导 

						var setBtn = function(isLock, btns){
							btns.eq(0)[isLock ? 'addClass': 'removeClass']('hidden');
							btns.eq(1)[!isLock ? 'addClass': 'removeClass']('hidden');
						}
						var type = PD.get('type');
						if(type == '2'){  //民校推荐

							var childs = $('#actions').children(), lock;
							recommend($('.form-row input[type=checkbox]'), childs, setBtn);
							setBtn($('.form-row input[type=checkbox]:checked').length === 0, childs);
							childs.eq(0).on('click', function(e){
								e.preventDefault();
								if(!lock && $('.form-row input[type=checkbox]:checked').length){
									lock = true;
									$('#guide_type2').attr('action',location.href.replace('step=1','step=2')).submit();																	
								}
							})
						}else if(type == '1'){//特长生
						
							selectForm($('form'));

						}
						
					break;

					case 'cmp' ://对比页面
						
						var html = $(Util.parse(Templet.cmpHeader, {headHtml : $('.comparison-table tr.tb-header').html()})).appendTo('body');
						html.hide().removeClass('hidden');
						var cmpTop = $('.tb-header').offset().top + 38;
						$.each(html.find('td[rel]'), function(i, item){
							var jqt = $(item);
							jqt.find(jqt.attr('rel') ? '.switcher' : '.name-wrap').remove();
						});
						$(window).scroll(function(){
							var sh = $(this).scrollTop();
							html[sh >= cmpTop ? 'show' : 'hide']();
							if(isIE6){
								html.css({'top':th});
							}
						});
						if(isIE6){
							html.css({"position":"absolute","bottom":"0"});
						}
					break;

					case 'rank' ://学校排行榜页
						G.on('joincmp', function(p){//监听“加入对比”
							$('li[rel="'+p.data.id+'"]').each(function(i, li){
								contrastEffect(1, $(li).find('span.operations'));
							});
							
						});

						G.on('deletecmp', function(p){
							$('li[rel="'+p.item.id+'"]').each(function(i, li){
								contrastEffect(11, $(li).find('span.operations'), p.item);
							});
						});

						var isHasA = function(li){
							return $(li).find('span.operations:has(a)').length;
						}

						var setHasJoin = function(spans, lis){
							var joined = localStorageCon.get();
							spans = spans || $('li>span.operations')
							if(joined.length){
								spans.each(function(i, span){
									if(hasContrast($(this).closest('li').attr('rel'), joined)){
										contrastEffect(1, this);
									}
								});
							}

							lis = lis || $('li:has(span.operations)');
							lis.each(function(i, li){
								$(li).hover(function(){								
									isHasA(li) && $(this).find('span.operations').removeClass('hidden');
								},function(){
									isHasA(li) && $(this).find('span.operations').addClass('hidden');
								})
							});
						}

						setHasJoin();


						
						//右则ajax
						var tagCache = {}, setHtml = function(ul){
							$('#tagLists ul').remove();
							$('#tagLists').html(ul);
							setHasJoin($('#tagLists span.operations'), $('#tagLists li:has(span.operations)'));
						};
						$('#tags').on('click', 'a', function(e){
							e.preventDefault();
							var jqt = $(this), did = jqt.attr('rel');
							if(jqt.hasClass('active')) return;
							$('#tags a.active').removeClass('active');
							jqt.addClass('active');
							if(tagCache[did]){
								setHtml(tagCache[did]);
								return;
							}
							G.Ajax.send(G.getRouter('/cz/school/rankPartOfDistrict'), {'did':did}, function(r){
								if(r.errno == '0'){
									setHtml(r.rst);
									tagCache[did] = r.rst;
								}
							})
						})

					break;
				}
			break;

		}

		//加入对比层
		if(hasPKfloat !== false && hasPKfloat !== 'false'){
			cpk = createPK();
			$('#pk').removeClass('hidden');
			G.fire('setpk',{noani:true});
			G.moveaction = contrastMove($('#pk'));
		}

		//顶部搜索
		searchPublic($('#searchArea'), '精确查校');


		Util.goTop();
						
	})


	G.actions
		.reg('lmore', function(e, params){
			
			//分页列表	
			var lock = false, page = 1, jqt = $(e.target);
			var matchData = location.href.match(/page=(\d)/);
			
			if(matchData && matchData.length > 1){
				page = parseInt(matchData[1]);
			}
			page = jqt.data('page') || page;

			var params = PD.get('params');
			if($.type(params) !== 'object')
				params = {};

			params['page'] = encodeURIComponent(++page);
			
			jqt.data('page', page);
			var loadcs = 'view-loading', pt = $(e.target).parent().addClass(loadcs);
			G.Ajax.send(G.getRouter('/cz/school/ajaxSchools'), params, function(r){
				if(r.errno == '0'){
					$('#school_list').append(r.rst.html);
					if($('#school_list').children().length >= Number(r.rst.total)){
						jqt.parent().hide();
					}
					pt.removeClass(loadcs);
				}
			})
		});




 })(jQuery, window, Gaofen);