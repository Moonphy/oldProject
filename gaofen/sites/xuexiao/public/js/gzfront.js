/**
 * Created by zhiwen on 2015-02-01.
 * xuexiaogz 高中前台功能
 */
"use strict";

 (function($, win, G){

	var Util = G.util,
		
		Alert = G.tips.alert,	

		PD = G.PD,			

		contrastName = 'gzschoolList',

		contrastMax = 4,

		isIE6 = navigator.userAgent.indexOf("MSIE 6.0") > 0;

	G.place = 'front';

	G.setContrastName(contrastName);
	G.setSearchUri('/gz/ajax/search');

	G.event();

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

	var hasContrast = function(id, cons){		
		var flag = false;
		if(id === undefined) return flag;
		$.each(cons, function(i, item){

			if(item.id === id){
				flag = true;
				return false;
			}
		});
		return flag;
	};


	//右则PK设置对比数
	var setPk = function(noani){
		var ls = localStorageCon.get();
		$('#pk').find('span')[ls.length ? 'removeClass' : 'addClass']('hidden').text(ls.length);
		if(ls.length && !noani){
			$('#pk').addClass('ani');
			setTimeout(function(){
				$('#pk').removeClass('ani');
			}, 500);
		}
	};


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

		//input输入框统一样式（除搜索）

		$('input:not(.search-query)').focus(function(e){
			$(this).addClass('input-focus');
		}).blur(function(e){
			$(this).removeClass('input-focus');
			$(this)[$(this).val() === '' ? 'addClass' : 'removeClass']('input-null');
		});

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

		//加入对比层结束

		var channel = PD.get('channel'), action = PD.get('action'), hasPKfloat = PD.get('hasPKfloat');


		switch(channel){

			case 'xuexiao' :
				switch(action){
					case 'index' ://首页
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

						//需要登录浮层做好后才开放(收藏)
						$('div.school-list li').each(function(i, item){
							$(item).hover(function(){
								$(this).find('span.operations').display(1);
							}, function(){
								$(this).find('span.operations').display(0);
							})
						});
						new Focus({view : $('.slider'), childs: $('.slider>a')});


						var chooseDom = $('#choose_school'), ipt = chooseDom.find('input[type="text"].input-text'), actions = chooseDom.find('div.actions');

						ipt.on('keyup', function(e){
							var parent = $(this).closest('.form-row'), msgDom = chooseDom.find('.help-inline').display(0);
							parent.removeClass('error');
							actions.removeClass('error');
							var v = this.value = $.trim(this.value.replace(/[^0-9]/ig,""));
							var able = !!(v === '');
							if(v !== '' && (v > 810 || v < 1)){
								able = 1;
								msgDom.display(1);
								parent.addClass('error');
								actions.addClass('error');
							}
						});
						actions.find('button').click(function(e){
							var v = $.trim(ipt.val());
							if(v === '' || v > 810){
								var parent = ipt.closest('.form-row'); 
								chooseDom.find('.help-inline').display(1);
								parent.addClass('error');
								actions.addClass('error');
								return false;
							}
						});

						//处理ie9以下兼容placeholder
						G.FN.placeholder(ipt);

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
						//}


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
						$(window).scroll(function(){
							var sh = $(this).scrollTop();		
							if(sh>530){
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

						//更多
						$('div.js-hide').on('click', function(e){
							e.preventDefault();
							$(this).hide().parent().find('table tr:hidden').display(1);
						})

						//显示QQ群
						G.Ajax.send('http://m.gaofen.com/ajax/qqgroup?callback=?', {
							channel : 'school', 
							city : remote_ip_info.city,
							section : 'zhongkao'
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
							var childs = $('#actions').children(), lock, ids = [];
							$('.form-row input[type=checkbox]').on('click', function(e){

								var checkboxs = $('.form-row input[type=checkbox]:checked');
								if(checkboxs.length){
									setBtn(false, childs);
									ids = [];
									checkboxs.each(function(i, item){
										ids.push(item.value);
									});
									if(ids.length > 2){
										e.preventDefault();
										setTimeout(function(){tipModal({
											tip_cs : 'alert-error',
											msg : '亲，别太贪心呐！最多选2项。'
										});},1);
										
									}
								}else{
									ids = [];
									setBtn(true, childs);
								}
							});
							setBtn($('.form-row input[type=checkbox]:checked').length === 0, childs);
							childs.eq(0).on('click', function(e){
								e.preventDefault();
								if(!lock && ids.length){
									lock = true;
									$('#guide_type2').attr('action',location.href.replace('step=1','step=2')).submit();																	
								}
							})
						}else if(type == '1'){//特长生
							var view = $('#guide_type1'), selects = view.find('select'), 
								btns =  view.find('div.actions').children(), admitForte = PD.get('admitForte');
							var eachSelect = function(data, dom){
								var opts = [];
								for(var k in data){
									var v = $.type(data[k]) === 'string' ? data[k]:data[k].name; 
									opts.push('<option value="'+k+'">'+v+'</option>');
								}
								dom.html(opts.join(''));
							}
							selects.eq(1).change(function(e){
								var v = this.value;

								eachSelect(admitForte[v].child, selects.eq(2));
							})
							eachSelect(admitForte, selects.eq(1));
							selects.eq(1).trigger('change');

							var lock = false;
							selects.eq(0).change(function(){
								lock = !!this.value;
								setBtn(!lock, btns);
							})
							setBtn(!selects.eq(0).val(), btns);
							btns.eq(0).on('click', function(e){
								e.preventDefault();
								$('#guide_type1').attr('action',location.href.replace('step=1','step=2')).submit();									
							})


						}
						
					break;

					case 'cmp' ://对比页面
						
						var html = $(Util.parse(Templet.cmpHeader, {headHtml : $('.comparison-table tr.tb-header').html()})).appendTo('body');
						html.hide().removeClass('hidden');
						$.each(html.find('td[rel]'), function(i, item){
							var jqt = $(item);
							jqt.find(jqt.attr('rel') ? '.switcher' : '.name-wrap').remove();
						});
						$(window).scroll(function(){
							var sh = $(this).scrollTop();
							html[sh >= 305 ? 'show' : 'hide']();
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
					case 'list' :
						//分页列表
						var lock = false, page = 1;
						$('#more_btn').on('click', function(e){
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

							params['page'] = encodeURIComponent(++page);

							var loadcs = 'view-loading', pt = $(this).parent().addClass(loadcs);
							G.Ajax.send(G.getRouter('/gz/school/ajaxSchools'), params, function(r){
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

						//处理ie9以下兼容placeholder
						G.FN.placeholder($('input[name=low_mark]'));




						var chooseDom = $('#choose_school'), ipt = chooseDom.find('input[type="text"].input-text'), actions = chooseDom.find('div.actions');

						ipt.on('keyup', function(e){
							var parent = $(this).closest('.form-row'), msgDom = chooseDom.find('.help-inline').display(0);
							parent.removeClass('error');
							actions.removeClass('error');
							var v = this.value = $.trim(this.value.replace(/[^0-9]/ig,""));
							var able = !!(v === '');
							if(v !== '' && (v > 810 || v < 1)){
								able = 1;
								msgDom.display(1);
								parent.addClass('error');
								actions.addClass('error');
							}
						});
						actions.find('button').click(function(e){
							var v = $.trim(ipt.val());
							if(v === '' || v > 810){
								var parent = ipt.closest('.form-row'); 
								chooseDom.find('.help-inline').display(1);
								parent.addClass('error');
								actions.addClass('error');
								return false;
							}
						});

					break;

					case 'select' :
						var form = $('#select_form'), ipt = form.find('input[name="low_mark"]'), actions = form.find('.actions');
						var nowVal = ipt.val().replace(/[^0-9]/ig, '');
						ipt.on('keyup', function(e){
							var parent = $(this).closest('.form-row'), msgDom = parent.find('.help-inline').display(0);
							parent.removeClass('error');
							var v = this.value = $.trim(this.value.replace(/[^0-9]/ig,""));
							var able = !!(v === '');
							if(v !== '' && (v > 810 || v < 1)){
								able = 1;
								msgDom.display(1);
								parent.addClass('error');
							}
							form.find('.btn-primary').display(!able);
							form.find('.btn-disabled').display(able);
						}).val(nowVal);
						ipt.trigger('keyup');

						//处理ie9以下兼容placeholder
						G.FN.placeholder($('input[name=low_mark]'));

					break;

					case 'history' :
					case 'result' : //估分选校
						var form = $('#select_form'),
							search = function(){
								form.submit();
							},

							setOpt = function(arr){
								var lis = form.find('#luqu_sel').find('ul li');
								lis.each(function(i, li){
									if(i != 0){
										var rel = Util.parseKnV($(li).attr('rel'))
										if($.inArray(Number(rel.value), arr) == -1)
											$(li).remove();
									}
								})
							};

						form.find('.ui-select').each(function(i,item){
							G.on('likeSelect-valueChange'+$(item).attr('vrel'), function(e){
								search();
							})
							if($(item).find('input[name="year"]').length){
								var v = $(item).find('input').val();
								if(Number(v) < 2014){
									setOpt([1,3,2,4]);
								}else{							
									setOpt([5,6,7,2,4]);
								}
							}

						});
						
					
						var ipt = form.find('input[name="low_mark"]');
						if(ipt.length){
							var nowVal = ipt.val().replace(/[^0-9]/ig, ''), parent = ipt.closest('.form-row');
							ipt.on('keyup', function(e){
								var msgDom = parent.find('.help-inline').display(0);
								parent.removeClass('error');
								var v = this.value = $.trim(this.value.replace(/[^0-9]/ig,""));
								var able = !!(v === '');
								if(v !== '' && (v > 810 || v < 1)){
									able = 1;
									msgDom.display(1);
									parent.addClass('error');
								}
								form.find('.btn-primary').display(!able);
								form.find('.btn-disabled').display(able);
							}).on('blur', function(e){
								if(!parent.hasClass('error')){
									search();
								}
							}).val(nowVal);
							ipt.trigger('keyup');
						}

						//处理ie9以下兼容placeholder
						G.FN.placeholder($('input[name=low_mark]'));
					break;
				}
			break;

		}



		//加入对比层
		if(hasPKfloat !== false && hasPKfloat !== 'false'){
			cpk = createPK();
			$('#pk').removeClass('hidden');
			G.fire('setpk',{noani:true});
			G.moveaction = contrastMove($('#pk'));//公共调用
		}

		//顶部搜索
		searchPublic($('#searchArea'), '精确查校');



		Util.goTop();

	});

	G.actions.reg('igrid', function(e, d){
		var jqt = $(e.target), datas = jqt.parent().data('datas')||[], grid = $('#school_grid');
		if(jqt.attr('href')){
			var span = jqt.parent().find('span'), rel = span.attr('rel'),
				_rel = Util.parseKnV(rel);
			if(!datas.hasOwnProperty(_rel.id)){
				datas[_rel.id] = grid.html();
				jqt.parent().data('datas', datas);
			}
			if(datas.hasOwnProperty(d.id)){
				grid.fadeOut('fast', function(e){
					grid.html(datas[d.id]).show();
					G.fire('grid-change-pk');
				})
			}else{
				grid.html('<div class="loading-mini"></div>');
				G.Ajax.send(G.getRouter('/gz/school/ajaxDistrict'), {id:d.id}, function(e){
					if(e.errno == '0'){
						grid.html(e.rst.html);
						G.fire('grid-change-pk');					
					}else{}
				});
			}
			
			span.replaceWith('<a href="#" rel="'+rel+'">'+span.text()+'</a>');
			jqt.replaceWith('<span class="active" rel="'+jqt.attr("rel")+'">'+jqt.text()+'</span>');

			

		}
	}).reg('null', function(e){

	});

	/*-------------  私有功能  ----------------*/

	//焦点图
	var Focus = function(opt){
		var config = $.extend(this, {
			view : '',
			index : 0,
			pageDom : '.pages',
			pageTag : 'li',
			pagecs : 'active',
			childs : '',
			createControl : true,
			sliderControl : $('<ul class="pages"></ul>'),
			processTime : 400,
			animateType : 1,
			animateTime : 4000,
			timer : null,
			auto : true
		}, opt);

		var camera = this.view, parent = camera.find('.parent'), cw = camera.width(),
			that = this, childs = this.childs, len = childs.length, sliderControl = config.sliderControl,
			pages;
		if(len < 2) return;

		if(config.createControl === true){
			var controls = [];
			childs.each(function(i){
				controls.push("<li >"+(++i)+"</li>");
			});
			sliderControl.append(controls.join(''));
			$("li:first",sliderControl).addClass(config.pagecs);	
			camera.append(sliderControl);
			pages = sliderControl.children();
		}

		var setRun = function(){
			clearTimer();
			if(that.auto) that.timer = setTimeout(run, that.animateTime);
		};

		var clearTimer = function(){
			if(that.auto) clearTimeout(that.timer);
		};

		var animate = function(from, to){
			switch(that.animateType){
				case 1: //淡入淡出
					childs.eq(from).animate({'opacity':0.4}, that.processTime, function(){
						childs.eq(to).css({'zIndex':1, 'opacity':1});
						$(this).css({'zIndex':0, 'opacity':0});
					});				
				break;
				case 2 : //左右
				break;
			}
			setPage();
			setRun();
		}


		var run = function(to){
			clearTimer();
			var _index = that.index;
			if(to !== undefined){
				that.index = to;
			}else{
				that.index = (that.index+1) % len;
			}
			animate(_index, that.index);
		};

		var setPage = function(){
			pages.each(function(i, item){
				$(item)[i === that.index ? 'addClass' : 'removeClass'](that.pagecs);
			});
		}

		var init = (function(){
			//childs.eq(0).find('img').attr('src','http://res.vmall.com/pimages//sale/2015-02/20150202114441518.jpg');
			//childs.eq(1).find('img').attr('src','http://res.vmall.com/pimages//sale/2015-01/20150130100610103.jpg');
			//childs.eq(2).find('img').attr('src','http://res.vmall.com/pimages//sale/2015-02/20150203104044429.jpg');
			if(pages.length){
				switch(that.animateType){
					case 1: //淡入淡出
						childs.each(function(i, item){
							var p = i === that.index ? 1 : 0;
							$(item).css({'zIndex':p, 'opacity':p, 'position':'absolute'}).show();
						})
					break;
				}
				camera.find(that.pageDom).on('click', that.pageTag, function(e){
					e.preventDefault();
					var jqt = $(this);					
					if(!jqt.hasClass(that.pagecs)){
						clearTimer();
						run(jqt.index());
					}
				})

				camera.hover(function(){
					clearTimer();
				}, function(){
					setRun();
				})
			}				
			setRun();
		})();

		return {
			run : run
		}

	};

	//new Focus({view : $('.slider'), childs: $('.slider>a')});
	//http://map.baidu.com/?newmap=1&shareurl=1&l=19&tn=B_NORMAL_MAP&c=12609862,2631075&cc=gz&i=-1%7C-1|-1&s=s%26da_src%3Dpcmappg.searchBox.sugg%26wd%3D%E5%8C%97%E4%BA%AC%E8%B7%AF%E6%AD%A5%E8%A1%8C%E8%A1%97%26c%3D257%26src%3D0%26wd2%3D%E5%B9%BF%E5%B7%9E%E5%B8%82%E8%B6%8A%E7%A7%80%E5%8C%BA%26sug%3D1%26l%3D12%26from%3Dwebmap&pw=2
	//http://map.baidu.com/?newmap=1&shareurl=1&l=19&tn=B_NORMAL_MAP&c=12609862,2631075&cc=gz&i=-1|-1|-1&s=s&da_src=pcmappg.searchBox.sugg&wd%E5%8C%97%E4%BA%AC%E8%B7%AF%E6%AD%A5%E8%A1%8C%E8%A1%97&c=257&src=0&wd2=%E5%B9%BF%E5%B7%9E%E5%B8%82%E8%B6%8A%E7%A7%80%E5%8C%BA&sug=1&l=12&from=webmap&pw=2
 })(jQuery, window, Gaofen);
