/**
 * @author   xiezhiwen
 * 点击事件代理
 */


(function(G, $, win){
	
	var mbox = G.ui.mbox,
		Req = G.request,
		T = G.tpl,
		PD = G.PD,
		FN = G.FN;

	G.use('action').addFilter(function( e, act){//全站过滤
        if(  e.get('na') || ( act && act.na ) )
            return true;
		else{
			if($.cookie('gaofen_user') === null){
				G.use('Login');
				return false;
			}else{
				return true;
			}
		}
	}).reg('join', function(e){//我要报名
		function joinFn(){
			var box = $('body').data('joinbox'), plusFn;
			if(!box){
				box = G.use('Modal', {
					closeable : true,
					mask : true,
					view : $('#modalApply')[0],
					isReturn : false,
					beforeShow : function(){
						G.ui.Modal.prototype.beforeShow.call(this);
						if(this.isReturn){
							this.isReturn = false;
						    return;
						}
						this.clearInfo();
					},
					clearInfo : function(){
						this.jq('input:visible').not("[name=adult],[name=child]").val('');
						this.jq('textarea').val('');
						this.jq("input[name=adult],input[name=child]").val(1);
						plusFn && plusFn();
						this.jq('.form-row.success').removeClass('success');
						this.jq('.form-row.error').removeClass('error');
						this.jq('.help-inline').text('');
						this.jq('.loading-mini').cssDisplay(0);
						this.jq('#ccselect').val('');
						this.jq('#ccselect').parent().find('select:gt(0)').remove();
						this.jq('.actions').removeClass('error');
						this.jq('.actions>.help-inline').text('');
						this.jq('#codeImg').trigger('click');
					},
					onViewReady : function(){
						var view = this.jq(), that = this;
						//费用区域
						var costArea = this.jq('#costArea'), _price = 0;
						G.on('pricePlus', function(p){
							if(!p || (p.formula && p.formula.couple_cost == '0' && p.formula.adult_cost == '0' && p.formula.child_cost == '0')){
								costArea.length && costArea.find('strong').text('免费');
								_price = 0;
							}else{
								var text = '', price = 0, formula = p.formula;
								if(p.adult_cost !== 0 && p.adult_cost !== ''){
									text += (p.adult_cost+'成人');
								}
								if(p.child_cost !== 0 && p.child_cost !== ''){
									text += (p.child_cost+'小孩');
								}
								if(p.adult_cost >= p.child_cost && p.child_cost > 0){
									var pi = 1;
									price = pi * parseInt(formula.couple_cost);
									price += parseInt(formula.adult_cost) *(p.adult_cost - 1) + parseInt(formula.child_cost) * (p.child_cost - 1);
								}else{
									if(p.child_cost === 0){
										price = parseInt(formula.adult_cost) *(p.adult_cost);
									}else if(p.adult_cost === 0){
										price = parseInt(formula.child_cost) *(p.child_cost);
									}else{
										var pi = 1;
										price = pi * parseInt(formula.couple_cost);
										price += parseInt(formula.adult_cost) *(p.adult_cost - 1) + parseInt(formula.child_cost) * (p.child_cost - 1);
									}
								}
								if(price === 0 ) {
									costArea.length && costArea.find('strong').text('免费');
									_price = 0;
								}else{
									if(costArea.length){
										if(costArea.find('#peopleNum').length){
											costArea.find('#peopleNum').text(text);
											costArea.find('.hl').text(price);
											allJoinNum = p.adult_cost + p.child_cost;									
										}else{
											costArea.find('strong').html(T.parse('<span id="peopleNum">{.text}</span><span>共计<i class="hl">{.price}</i>元</span>', {text:text, price:price}));
										}
									}
									costArea.length && costArea.find('input[name="price"]').val(price);
									_price = price;
								}
							}
						})
						
						//参加人数费用
						var priceArea = this.jq('#priceArea'), allJoinNum = 0;
						if(priceArea.length){
							var formula = G.util.parseKnV(priceArea.attr('rel'));
							plusFn = function(dom, type){				
								var ipts = priceArea.find('input');
								if(arguments.length){
									var ipt = dom.parent().find('input'), v = parseInt(ipt.val());
									if(type === 'plus')
										ipt.val(++v);
									else{
										if(v === 0) return;
										if(ipts.length === 1 && v <= 1){
											ipts.eq(0).val(1);
											return;
										}
										if(parseInt(ipts.eq(0).val()) + parseInt(ipts.eq(1).val())  === 1) return;
										ipt.val(--v);
									}
								}
								var param = {
									formula : formula,
									adult_cost : 0,
									child_cost : 0
								}
								if(ipts.length === 2){
									// {adult_cost:parseInt(ipts.eq(0).val()), child_cost: parseInt(ipts.eq(1).val()), formula: formula};
									param.adult_cost = parseInt(ipts.eq(0).val());
									param.child_cost = parseInt(ipts.eq(1).val());

								}else if(ipts.length === 1){
									if(ipts.eq(0).attr('name') === 'child'){
										param.child_cost = parseInt(ipts.eq(0).val());
									}else{
										param.adult_cost = parseInt(ipts.eq(0).val());
									}
								}							
								G.fire('pricePlus',param);
							}
							priceArea.on('click', '.plus,.minus', function(e){
								var tjq = $(this), cls = tjq.attr('class');
								switch(cls){
									case 'plus' ://加
										plusFn(tjq, 'plus');
									break;
									case 'minus' ://减
										plusFn(tjq, 'minus');
									break;
								};
							})
							
							plusFn();
						}else{
							G.fire('pricePlus',{
									formula : {
										couple_cost:0,adult_cost:0,child_cost:0
									},
									adult_cost : 0,
									child_cost : 0
								});
						}
						
						//var elements = this.jq('input[name="registration[childAge]"],input[name="registration[childName]"],input[name="phone"],input[name="realname"],input[name="registration[qq]"]');
						var elements = this.jq('input[type="text"]');
						var cc = e.get('cc'), newcc = PD.get('changci');//新活动场次
						view.find('#codeImgChange').on('click', function(e){
							e.preventDefault();
							view.find('#codeImg').trigger('click');
						})
						var createOpt = function(childs, opts){
							opts = opts || ['<option value="">请选择场次</option>'];
							for(var i=0;i<childs.length;i++){
								var item = childs[i], child = '';
								if(item.children && item.children.length) child = JSON.stringify(item);
								opts.push("<option rel='"+child+"' value='"+item.text+"'>"+item.text+"</option>");
							}
							return opts;
						}

						if(newcc && $.type(newcc) === 'string'){
							newcc = $.parseJSON(newcc);
						}
						if(!cc && (!newcc || (newcc.children && !newcc.children.length))){//没有场次
							this.jq('#changci').remove();					
						}else{//创建场次。。。。
							var opts = ['<option value="">请选择场次</option>'];
							if(cc){
								var vs = cc.split('|');
								$.each(vs, function(){
									opts.push('<option value="'+this+'">'+this+'</option>');
								});
							}else{
								opts = createOpt(newcc.children, opts);
							}
							elements.push(this.jq('#ccselect'));
							this.jq('#ccselect').html(opts.join(''));
							if(!cc){
								this.jq('#ccselect').parent().on('change', 'select', function(){

									var thj = $(this);
									if(thj.val() === ''){
										thj.parent().find('select:gt('+thj.index()+')').remove();
										return;
									}

									var rel;
									try{
										 rel = $.parseJSON(thj.find('option:checked').attr('rel'));
									}catch(e){}
									if(rel){
										var next = thj.next();
										if(next.length){
											next.html(createOpt(rel.children).join(''));
											if(next.next().length){
												next.next().remove();
											}
										}else{
											var newselect = $('<select></select>').insertAfter(thj);
											newselect.html(createOpt(rel.children).join(''));
										}
									}else{
										thj.parent().find('select:gt('+thj.index()+')').remove();
									}
								});

							}
						}
						
						if(view.find('input[name="checkCode"]').length){
							elements.push(view.find('input[name="checkCode"]'));
						}
						
						function changeCode(){
							view.find('#codeImg').trigger('click');
						}
						
						var valid = G.use('validator', {
							form : view
							, trigger : '#lecturebtn'
							, validators : {
								mcode : function(elem, v, data, next){
									var self = this;
									Req.postReq('/ajax/authCode',{checkCode:v,size:20},function(er){
										if(er.isOk()){
											self.report(true, data);											
										}else{
											changeCode();
											data.m = data.m || er.getError();
											self.report(false, data);
										}
										next();
									})
								}
							}
							, elements : elements
							, onSuccess : function(data){
								var ccselect = view.find('#ccselect'), changeciData = [];
								if(ccselect.length){
									var istrue = true;
									ccselect.parent().find('select').each(function(i,item){
										if($(item).val() === ''){
											istrue = false;
											return istrue;
										}
										changeciData.push($(item).val());
									});
									if(!istrue){
										box.find('#changci').addClass('error').find('.help-inline').text('请选择场次');
										return false;
									}
									data['changci'] = changeciData.join(' ');
								}
								if(box.play()){
									//if(costArea.find('strong').text() === '免费' || costArea.find('.hl').text() == '0'){//免费活动直接提交
									if(_price === 0 || PD.get('pay_type') == '1'){//pay_type:1:线下支付 2:线上支付
										data['huodong_id'] = view.find('input[name="huodong_id"]').val();
										if(priceArea.length){
											if(priceArea.find('input[name="adult"]').length) data.adult = priceArea.find('input[name="adult"]').val();
											if(priceArea.find('input[name="child"]').length) data.child = priceArea.find('input[name="child"]').val();
											if(priceArea.find('input[name="price"]').length) data.price = costArea.find('input[name="price"]').val();
										}
										data['registration[remark]'] = view.find('textarea[name="registration[remark]"]').val();
										view.find('.loading-mini').cssDisplay(1);
										view.find('.actions').removeClass('error');
										view.find('.actions>.help-inline').cssDisplay(1).text('');
										Req.postReq('/ajax/joinLectures', data, function(rs){		
											if(rs.isOk()){	
												FN.seoFollow({'event': 'mianfeibaoming'});
												G.ui.lectureSuccess();
												box.clearInfo();
												box.play(0);
											}else{
												view.find('.loading-mini').cssDisplay(0);
												view.find('.actions').addClass('error');
												view.find('.actions>.help-inline').cssDisplay(1).text(rs.getError());												
											}
											changeCode();
											//box.play(0);
										});
										return false;
									}else{
										var applyInfo = $('#applyInfo'), infoBox = $(e.src).data('infoBox');
										box.play(0);
										if(!infoBox){
											infoBox = G.use('Modal', {
												closeable : true,
												mask : true,
												view : applyInfo[0],
												setText : function(formDom, txt){
													if(txt === '' || txt == undefined)
														formDom.cssDisplay(0);
													else
														formDom.cssDisplay(1).find('.text').html(txt);
												},
												beforeShow : function(){
													G.ui.Modal.prototype.beforeShow.call(this);
													if(ccselect.length){
														this.setText(this.jq('#matches'), data['changci']);											
													}
													this.setText(this.jq('#joinNum'), allJoinNum);										
													this.setText(this.jq('#contact'), box.jq('#contact').val());
													this.setText(this.jq('#phone'), box.jq('#phone').val());
													this.setText(this.jq('#price'), _price+'元');
												},
												onViewReady : function(){
													if(!ccselect.length){
														this.jq('#matches').remove();	
													}else{
														box.jq().find('input[name="changci"]').val(data['changci']);
													}
													$('#goPay').click(function(e){
														e.preventDefault();
														FN.seoFollow({'event': 'shoufeibaoming'});
														$('#lecturebtn').trigger('click');
													});
													$('#payEdit').click(function(e){
														e.preventDefault();
														infoBox.play(0);
														box.isReturn = true;
														box.play(1);
													});
												}
											});
											$(e.src).data('infoBox', infoBox);
										}
										
										infoBox.play(1);
										return false;
									}
								}else{
									$('#_form').submit();
									//return true;
								}
							}
						});					
					}
				})		
				$('body').data('joinbox', box);			
			}else{
				box.clearInfo();
			}
			
			box.play(1);
		}
		if(e.get('na') == '1') joinFn();
		else FN.avticeAccount(joinFn, e);
	})
	//下载
	.reg('ddoc', function(e){
		var jqe = $(e.src), headbar = jqe.closest('#headToolbar'), footbar = jqe.closest('#readControl'),
			eventStr, innerText = jqe.text();
		if(headbar.length){
			eventStr = 'downloadorbuy_top';
		}else if(footbar.length){
			eventStr = 'downloadorbuy_bot';
		}else{
			eventStr = 'downloadorbuy_body';
		}
		dataLayer.push({      
		  'event': eventStr,
		  'linktext' : innerText
		});
		e.lock(1);
		if(e.get('mobile') == '1'){
			G.use('MobileDowm', {btnMsg : '继续购买', fn : function(){
				FN.avticeAccount(pay, e);
			}}).play(1);
		}else{
			FN.avticeAccount(pay, e);
		}
		
		function pay(){		
			var src = e.src, 
				lock = false, host = 'http://'+G.PD.get('host'), isReload;
				var applyId = e.get('id'),
					type = e.get('t'),
					dt = e.get('dt'),//是否是专题页面(topic)
					opt = {},
					applyUrl = host+'/ajax/download/',
					applyTopicUrl = host+'/ajax/downloadTopic/',
					downUrl = host+'/docs/download/',
					topicUrl = host+'/docs/downloadTopic/';
				Req.isPayTofile(applyId, type, dt === 'topic' ? applyTopicUrl : applyUrl, function(r){//查询文件是否已支付
					//e.lock(0);
					var err = r.getError();
					if(r.isOk() || err == "高分币不够"){
						var data = r.getData(), template, state = data.state;
						if(state == 1){//已支付直接下载	
							location.reload();
							return;
						}
						var bookname = "《"+($('#bookName').text()||$(src).attr('vrel'))+"》",
							cs = 'modal-download';
						if(type == 1){//高分币												
							switch(state){						
								case 2 : //高分币余额不足
									template = 'win_download2';
									cs = 'modal-tips lack-balance';
								break;	
								case 3 : //用高分币购买
									template = 'win_download1';
								break;							
							};
							opt = {fid : applyId};

						}else{//现金支付
							template = 'win_download3';
							opt = {	
								money : $('#usermoney').text()||e.get('price'), 
								bookname : bookname,
								payurl : host+'/pay/docsPay',
								fid : applyId 
							};
						}
						var vbox = G.use('Modal', $.extend({
							appendTo : 'body'
							, mask : true
							, title : '下载资料'
							, bookname : bookname
							, cs : cs
							, afterHide : function(){//到完成支付步骤关闭层刷新页面
								G.ui.Modal.prototype.afterHide.call(this);
								if(isReload){
									location.reload();
								}
							}
							, contentHtml : template
							//, footers : 'win_module'
							, closeable: true
							, destroyOnClose : true
							, onViewReady : function(){
								var self = this;
								isReload = false;
								if(type == 1){
									switch(state){
										case 2 : //高分币余额不足
										break;	
										case 3 : //用高分币购买
											this.jq("form").attr("action",dt === 'topic' ? topicUrl : downUrl);
											this.jq('input[name="id"]').val(applyId);
											this.jq('input[name="download"]').click(function(_e){
												self.play(0);
												setTimeout(function(){location.reload();}, 500);
												return true;
											});
										break;							
									};
									this.jq('#residue').html(data.uCost);
									this.jq("#usecost").html(data.cost);
								}else{//现金购买
									$('#downbtn').click(function(_e){//弹出支付页面先切换内容
										var views = self.jq('div.modal-info');
										views.eq(0).cssDisplay(0);
										views.eq(1).cssDisplay(1);
										self.setTitle('等待支付');
										self.jq().addClass('pay-waiting');
										self.jq('#finish').click(function(ev){
											ev.preventDefault();
											if(lock) return;
											lock = true;
											Req.isPayTofile(applyId, 2, applyUrl, function(er){	
												if(er.isOk() && er.getData().state && parseInt(er.getData().state) == 1){//state为1时已支付其它刷新页面（4为未支付）
													isReload = true;
													views.eq(1).cssDisplay(0);
													views.eq(2).cssDisplay(1).find('form').attr('action', downUrl+applyId);												
													self.jq().removeClass('pay-waiting').addClass('pay-success');
													self.setTitle('支付成功');
													self.jq('#_downbtn').click(function(ev){
														FN.changeDownTimer();
														setTimeout(function(){self.close()}, 500);
													})
												}else{
													location.reload();
												}
											});
										});
										return true;
									});
								}							
								this.jq('#cancel').click(function(_e){
									_e.preventDefault();
									self.close();
								});
								if(data.bind == 1){
									this.jq('#share').cssDisplay(1);
								}
							}}, opt))
							//debugger;
							vbox.play(1);
						
					}else{
					
					}
				});	
			}
	})
	//资料免费下载
	.reg('cand', function(e){
		var jqe = $(e.src), headbar = jqe.closest('#headToolbar'), footbar = jqe.closest('#readControl'),
			eventStr, innerText = jqe.text();
		if(headbar.length){
			eventStr = 'downloadorbuy_top';
		}else if(footbar.length){
			eventStr = 'downloadorbuy_bot';
		}else{
			eventStr = 'downloadorbuy_body';
		}
		dataLayer.push({      
		  'event': eventStr,
		  'linktext' : innerText
		});
		
		function down(){
			FN.addFrameToDownload('http://'+G.PD.get('host')+$(e.src).attr('vrel'));
			FN.changeDownTimer();
		}
		
		if(e.get('mobile') == '1'){
			G.use('MobileDowm', {btnMsg : '继续下载', fn : function(){
				down();
			}}).play(1);
		}else{
			e.preventDefault(false);
			//down();
		}
	})
	//领取资料
	.reg('lq', function(e){
		var $e = $(e.src), vbox = $e.data('vbox'), jid = e.get('id'), lqed = $e.data('lqed');
		Req.q('/ajax/getSchool', {id:jid}, function(r){
			if(r.isOk()){
				var list = r.getData();
				//var list = {1:{id:1, school:'天河区', area:'天河北2001号'},2:{id:2, school:'东山区', area:'东山区2001号'}, 
				//	3:{id:3, school:'芳村区', area:'芳村区2001号'}};
				G.use('Modal', {
					appendTo : 'body'
					, mask : true
					, title : '资料领取'
					, cs : 'modal-fetch fetch-success'
					, contentHtml : 'lingquDatum'
					, closeable: true
					, destroyOnClose : true
					, getItem : function(id){
						if($.type(list) == 'object') return list[id];
						for(var i=0, len = list.length;i<len;i++){
							if(list[i].id == id){
								return list[i];
							}
						}
					}
					, onViewReady : function(){
						var opts = [];
						$.each(list, function(){
							opts.push('<option value="'+this.id+'">'+this.school+'</option>');
						});
						this.jq('#school').change(function(e){
							var v = $(this).val();
							if(v != ''){
								self.jq('#schoolArea').text(self.getItem(v).addr);									
							}else{
								self.jq('#schoolArea').text('');
							}
						}).append(opts.join(''));
						
						var self = this, jf = self.jq('.form'), inputs = jf.find('input,select');
						var vd = G.use('validator', {
							form : jf,
							trigger : '#btn',
							elements : inputs, 
							onSuccess : function(data){	
								var item = self.getItem(data.school);
								Req.postReq('/ajax/receive', {
									id : jid, 
									school : item.school,
									sid : item.id,
									addr : item.addr,
									phone : data.phone,
									realname : data.username,
									title : $('#bookName').html()
								}, function(rr){
									if(rr.isOk()){//领取资料
										self.jq('.modal-info').toggleClass('hidden');
										e.clear();
										$e.text('已领取');
									}else{
										self.jq('#errorArea').text(rr.getMsg()).closest('.form-row').addClass('error');
										//self.close();									
									}
								})
								return true;
							}
						});
					}					
				}).play(1);
			}				
		});				
	}).
	//登录才能完成的功能
	reg('null', function(e){
		if($.cookie('gaofen_user')){
			e.preventDefault(false);
		}
	}).
	
	//跳过父层rel事件直接用href	
	reg('oh', function(){
		e.preventDefault(false);
		e.stopPropagation(true);
		return false;
	}).
	
	//资料上传按钮
	reg('isActive', function(e){
		if($.cookie('gaofen_user')){
			e.preventDefault(false);
			/*
			FN.avticeAccount(function(){
			console.log('test');
				e.clear();
				setTimeout(function(){
					//$(e.src).click();
					location.reload();
				},10);
			}, e);
			//e.preventDefault(false);
			*/
		}
	})
	
	/*---------------资料专题页-------------------*/
	//ppt
	.reg('pecialppt', function(e){
		var $e = $(e.src);
		if($e.hasClass('active')) return;
		$e.parent().find('.active').removeClass();		
		$e.addClass('active');
		var pptObj = $('body').data('ppt'), id = PD.get('id'), payed = e.get('isView') == '0', docid = e.get('docid')
			,pages = PD.get('pagelist')[$e.closest('li').index()], pdfName = $e.find('h4').html();
		var _pages = [], hasPage = Number(e.get('pages'));

		if(!payed){//没有付费时截取只能看内容
			$.each(pages, function(i, src){
				if(i >= hasPage) return false;
				_pages.push(src);
			});
		}else{
			_pages = pages;
		}
		$('#doc_pay').text(e.get('price')+'高分币');
		$('#docslink').attr('href', $e.find('a').attr('href'));
		if(!pptObj){// ppt init
			var scrollArea = $('#readcontainerparent');
			pptObj = G.use('pptScroll', {
				view : scrollArea[0],				
				pages : _pages, 
				total:e.get('total'),
				modelSize : {'comment':{w:718,h:1015}, 'full' : {w:978,h:734}},//一般模式
				fid : docid,
				dragBar : false,
				scrollBar: scrollArea.find('#readControl'),
				offMargin : scrollArea.offset().left-10
			});
			$('body').data('ppt', pptObj);
		}else{
			pptObj.resetInit({
				pages : _pages, 
				total:e.get('total'),
				fid : docid,
			});
		}
	}, {na:1})
	
	//在flash下显示点击资料内容
	.reg('flashread', function(e){
		var $e = $(e.src), id = PD.get('id'), v = PD.get('isView')||1, docid = e.get('docid')
			,numPages = e.get('pages'), pdfName = $e.find('h4').html();
			
		if($e.hasClass('active')) return;
		
		$e.parent().find('.active').removeClass();
		
		$e.addClass('active');
		
		$('#introduction').html($e.find('div:hidden').html());
		
		var price = e.get('price'), isView = e.get('isView'), actions = $('#actions'), title = $e.find('h4').text();
		actions.find('span').text('￥'+price);
		
		//资料售价：￥12点击购买本资料
		
		//$('#dtitle').text('现在预览：'+title);
		
		var jqa = actions.find('a'), rels = G.util.parseKnV(jqa.attr('rel')), rel = '';
		if(rels.mobile && rels.mobile == '1'){
			rel = 'mobile:1,';
		}
		if(isView === '1'){//单个购买
			jqa.text('点击购买本资料').removeData().attr('rel',rel+('e:ddoc,id:'+docid+',t:2,price:￥'+price)).attr('vrel', title);
		}else{//可以直接下载
			jqa.text('下载').removeData().attr({'rel':rel+('e:cand'),'vrel':'/docs/download/'+docid});
		}

		actions.cssDisplay(1);
		
		/*
		if(isView){
			window.onCurrPageChanged = function(){
				var page = numPages;
				if ($FlexPaper('documentViewer').getCurrPage() >= page){
					var costType = Number(price) > 0 ? 2 : 1,
						mt = costType == 2 ? price+'元' :'';
					var rpbox = Gaofen.FN.readAfterPay(mt, docid, costType, $.cookie('gaofen_user') ? 1 : 0);
					rpbox.jq('#finish').attr({'vrel': title, 'rel' : rel+('e:ddoc,id:'+docid+',t:2,price:￥'+price)});
				}
			}
		}
		*/
		var getDocumentUrl = function(document, docid){		
			if(v){
				var url = "{/docs/pdf2swf/?docId="+docid+"&doc={pdfName}&v=1&format={format}&page=[*,0],{numPages}}";
				url = url.replace("{numPages}",numPages);
			}else{
				var url = "/docs/pdf2swf/?docId="+docid+"&doc={pdfName}&format={format}&page={page}";
			}
			url = url.replace("{v}",v);
			url = url.replace("{pdfName}",document);
			//url = '{/docs/pdf2swf/?docId=Ni9RT3Nic042UTg9&doc=81&v=1&format={format}&page=[*,0],3}';
			return url;
		};
		$('#documentViewer').FlexPaperViewer({ config : {
			 DOC : escape(getDocumentUrl(pdfName, docid)),
			 Scale : 1,
			 ZoomTransition : 'easeOut',
			 ZoomTime : 0.5,
			 ZoomInterval : 0.2,
			 FitPageOnLoad : false,
			 FitWidthOnLoad : true,
			 FullScreenAsMaxWindow : false,
			 ProgressiveLoading : false,
			 MinZoomSize : 0.2,
			 MaxZoomSize : 1,
			 SearchMatchAll : false,
			 InitViewMode : 'Portrait',
			 ViewModeToolsVisible : true,
			 ZoomToolsVisible : true,
			 NavToolsVisible : true,
			 CursorToolsVisible : true,
			 SearchToolsVisible : false,
			 jsDirectory :"/public/img/",
			 localeChain: 'zh_CN'
			}}
		);
	}, {na : 1 })
	//购买资料
	.reg('gm', function(e){
		e.lock(1);
		if(e.get('mobile') == '1'){
			G.use('MobileDowm', {btnMsg : '继续购买', fn : function(){
				FN.avticeAccount(pay, e);
			}}).play(1);
		}else{
			FN.avticeAccount(pay, e);
		}
		function pay(){
			var id = PD.get('id'), applyUrl = '/ajax/downloadTopic', host = 'http://'+PD.get('host'), lock = false;
			e.lock(1);
			Req.isPayTofile(id, '', applyUrl, function(r){
				e.lock(0);
				var err = r.getError();
				if(r.isOk()){
					var data = r.getData(), template, state = data.state;
					if(state == 1){//已支付直接下载	
						location.reload();
						return;
					}
					G.use('Modal', {
						appendTo : 'body'
						, mask : true
						, fid : id
						, title : '购买文档'
						, cs : 'modal-download'
						, contentHtml : 'win_download3'
						, payurl : host+'/pay/docsTopicPay'
						, closeable: true
						, destroyOnClose : true
						, onViewReady : function(){
							//填充数据 1.标题  2.内容  3.价格
							var btitle = PD.get('title'),
								orgPrice = PD.get('orgPrice'),
								docsNum = PD.get('docsNum'),
								bmoney = PD.get('price'),
								cont = this.jq('#cont'),
								self = this,
								temp = [];
							temp.push('<p id="btitle">《'+btitle+'》</p>');
							temp.push('<p id="bcontent">内含：'+docsNum+'份文档，原价<span class="deprecated">'+orgPrice+'元</span>，现在购买立即省'+(orgPrice - bmoney)+'元</p>');
							temp.push('<p>现价：<strong class="hl" id="money">'+bmoney+'元</strong></p>');
							cont.html(temp.join(''));
							$('#downbtn').click(function(_e){//弹出支付页面先切换内容
								var views = self.jq('div.modal-info');
								views.eq(0).cssDisplay(0);
								views.eq(1).cssDisplay(1);
								self.setTitle('等待支付');
								self.jq().addClass('pay-waiting');
								self.jq('#finish').click(function(ev){
									ev.preventDefault();
									if(lock) return;
									lock = true;
									Req.isPayTofile(id, '', applyUrl, function(er){	
										if(er.isOk() && er.getData().state && parseInt(er.getData().state) == 1){//state为1时已支付其它刷新页面（4为未支付）
											isReload = true;
											views.eq(1).cssDisplay(0);
											views.eq(2).cssDisplay(1).find('form').attr('action', host+'/docs/downloadTopic/'+id);												
											self.jq().removeClass('pay-waiting').addClass('pay-success');
											self.setTitle('支付成功');
											self.jq('#_downbtn').click(function(ev){
												FN.changeDownTimer();
												setTimeout(function(){self.close()}, 500);
											})
										}else{
											location.reload();
										}
									});
								});
								return true;
							});	
							
							this.jq('#cancel').click(function(_e){
								_e.preventDefault();
								self.close();
							});
							if(data.bind == 1){
								this.jq('#share').cssDisplay(1);
							}
						}					
					}).play(1);
				}
			})
		}
	})
	
	//签到
	.reg('qd', function(e){
		FN.avticeAccount(cb, e);
		function cb(){
			e.lock(1);
			Req.qiandao2('qiandao', function(r){
				if(r.isOk()){
					e.clear();				
					mbox.BubbleSuccess($(e.src), '今日获得3高分币', function(){
						location.reload();
					});
					/*签到完加分*/
					//var num = $('span.num');
					//num.html(parseInt(num.html())+3);
					//$(e.src).addClass('signed').html('');
				}else{
					switch(Number(r.getCode())){
						case 404 : 
						case 423001:
							G.use('Login');//未登录						
						break;
						case 423101 : 
						case 423003 ://已签到
							mbox.BubbleAlert($(e.src), '今天您已签到!');
							//$(e.src).addClass('btn-signed').text('今天您已签到');
						break;
						default :
							mbox.BubbleAlert($(e.src), '今天您已签到!');
							//mbox.alert('','网络问题，请稍后再试试吧。')
						break;
					}
					e.lock(0);
				}
				
			});		
		}
	})
	
	
	//设置年级
	.reg('sl', function(e){
		e.lock(1);
		var jqsrc = $(e.src), box = jqsrc.data('box');
		if(box){
			box.play(1)
		}else{
			box = G.use('setGrade', {fn : function(v){
				if(v){
					if(e.get('t') === '家长'){
						//jqsrc.text('我是'+v+'家长');
					}else{
						//jqsrc.text('我是'+v+'学生');
					}
				}
			}});
			jqsrc.data('box', box);
		}		
		e.lock(0);
	})	

	
	//---------------资料专题页结束-------------------
	/*
	//会员中心取消订单
	.reg('canceldd', function(e){
		//http://my.gaofen.com/ajax/orderCancel?order_id=xxx;
		var id = e.get('id'), action = '/ajax/orderCancel';
		e.lock(1);
		Req.q('my.gaofen.com'+action, {order_id : id}, function(r){
			e.lock(0);
			var err = r.getError();
			if(r.isOk()){
				$(e.src).closest('tr').remove();
			}else{
				mbox.BubbleError(err);
			}
		})
	})
	*/
	
	//收藏/取消收藏
	.reg('collect', function(e){
		var id = e.get('id'), type = e.get('type'), favAction = e.get('favAction'), action = '/docs/DocsFav';
		e.lock(1);
		Req.q(action, {id : id, type:type, favAction:favAction, grade : e.get('grade')}, function(r){
			e.lock(0);
			var err = r.getError(), nf = 'add', cs = 'add-fav', text = '收藏', jqt = $(e.src);
			if(favAction === 'add'){
				nf = 'del';
				cs  = 'add-fav cancel-fav';
				text = '取消收藏';
			}
			if(r.isOk()){
				e.save('favAction', nf);
				jqt.html(text);
				jqt.attr('class', cs);
			}else{
				mbox.BubbleError(err);
			}
		})
	})
	//课程报名 
	.reg('cjoin', function(e){
		var view = $('#modalApply'), box  = $('body').data('box');
		if(!box){
			box = G.use('Modal', {
			view : view[0]
			,mask : true
			, closeable: true
			, beforeHide : function(){
				this.jq('.form-row').each(function(){
					$(this).removeClass('error').find('.help-inline').text('');
					$(this).find('input,select').val('');
				});
				this.joinSuccess(false);
			}
			,joinSuccess : function(p){
				this.jq('#joinSuccess').cssDisplay(p);
				this.jq('#joinInfo').cssDisplay(!p);
			}
			, onViewReady : function(){
				var jf = this.jq('#joinInfo'), view = this.jq(), that = this;
				this.jq('#cname').text($('#ctitle').text());
				var campus = PD.get('campus'), elements = jf.find('input');
				if(campus){//创建地点。。。。
					var opts = ['<option value="">请选择地点</option>'];
					for(var key in campus){
						opts.push('<option value="'+key+'">'+campus[key].name+'</option>');
					};
					elements.push(this.jq('#ccselect'));
					this.jq('#ccselect').html(opts.join(''));
				}
				
				this.jq('#ccselect').on('change', function(){
					var p = $(this).closest('.form-row'), et = p.find('.help-inline')
					if(!this.value){
						p.addClass('error').removeClass('success');
						et.cssDisplay(1).html('请选择上课地点');
					}else{
						p.removeClass('error').addClass('success');
						et.html('OK');
					}
				})
				
				this.jq('#closebtn').on('click', function(e){
					e.preventDefault();
					that.play(0);
				})
				G.use('validator', {
					form : jf
					, trigger : '#cjbtn'
					, elements : elements
					, onSuccess : function(data){
						var v = that.jq('#ccselect');
						v.change();
						jf.find('.actions').removeClass('error').find('.help-inline').text('');
						if(v){
							data.id = e.get('id');
							Req.postReq('/Ajax/joinCourse', data, function(r){
								if(r.isOk()){
									that.joinSuccess(true);	
									that.jq('#un').text(data.un);
									that.jq('#ccselectv').text(that.jq("#ccselect").find("option:selected").text());
									var dom  = $(e.src).parent().find('#parson'), parson = parseInt(dom.text());
									dom.text((++parson)+'人参加');
								}else{
									jf.find('.actions').addClass('error').find('.help-inline').text(r.getError());
								}
							})
						}
						return false;
					}
				});
			
			}});
			$('body').data('box', box);
		};
		box.play(1);
	})
	
	//课程评论
	.reg('courseCm', function(e){
		G.use('Modal', {
			appendTo : 'body'
			, title : '评价课程'
			, cs : 'modal-comment'
			, contentHtml : 'courseComment'
			, closeable: true
			, ctitle : e.get('title')||''
			, mask : true
			, destroyOnClose : true
			, setBtn : function(v, loading){
				this.jq('span.btn-disabled').cssDisplay(!v);
				this.jq('#btn').cssDisplay(v);
				this.jq('.loading-mini').cssDisplay(loading);
			}
			,setMsg : function(msg){
				this.jq('.actions')[msg ? 'addClass':'removeClass']('error');
				this.jq('.help-inline').text(msg);
			}
			
			,insertList : function(v){
				var ul = $('div.comment-list ul');
				var temp = ['<li><span class="avatar">{.imgTag}</span>',
							'<div class="info">',
								'<p>{.v}</p>',
								'<div class="author">{.username}<span class="date">{.time}</span>',
								'</div>',
							'</div>',
						'</li>'].join('');
				var userPanel = $('#userPanel'), img = userPanel.find('#userpic').html(), username = userPanel.find('#user').text(),
					timeArr = Gaofen.util.timeChange(+new Date), time = timeArr[0]+'-'+timeArr[1]+'-'+timeArr[2];
				var html = T.parse(temp, {v:v,time:time, username:username, imgTag:img});
				
				if(!$('div.comment-list').hasClass('hidden')){
					$(html).insertBefore(ul.children().eq(0));
				}else{
					$('div.alert-inline').cssDisplay(0);
					$('div.comment-list').cssDisplay(1);
					ul.append(html);
				}
				$('body,html').animate({scrollTop:ul.offset().top},400);
				
			}
			, onViewReady : function(){
				var that = this, tdom = this.jq('textarea');
				tdom.on('keyup', function(){
					var v = $.trim($(this).val());
					that.setBtn(v);
				})
				that.jq('#btn').on('click', function(ev){
					ev.preventDefault();
					var v = $.trim(tdom.val());
					if(v){
						that.setBtn('', true);
						var host = PD.get('host')||'dev.cms.gaofen.com';
						Req.postReq('http://'+host+'/ajax/commentCourse', {id:e.get('id'), message: v}, function(r){
							if(r.isOk()){
								//that.play(0);
								that.jq('div.form').cssDisplay(0);
								that.jq('div.alert').cssDisplay(1);
								that.jq('#delbtn').on('click', function(e){
									e.preventDefault();
									that.close();
								});
								if(PD.get('action') === 'view'){
									$(e.src).parent().remove();
									that.insertList(v);									
								}else{//个人中心
									$(e.src).replaceWith('已评价');
								}
								//Gaofen.ui.mbox.BubbleSuccess($('.btn-primary')[1],'评论发表成功');
							}else{
								that.setBtn(true, '');
								that.setMsg(r.getError());
							}
						})
					}
					
				})
			
		}}).play(1);
	})
	
	//展开收起
	.reg('loc', function(e){
		var css = e.get('css'), p = $(e.src).closest('.'+css).cssDisplay(0);
		p.parent().find('.'+css).not(p).cssDisplay(1);
	})
	
	//小升初"?"提示信息
	.reg('help', function(e){
		var info = $('#help_info'), infoCon =[];
		info.find('div').each(function(){
			var con = $(this).html().split('：');
			infoCon.push('<li><h3>'+con[0]+'</h3>')
			infoCon.push('<p>'+con[1]+'</p></li>');
		});
		infoCon = infoCon.join('');
		G.use('Modal', {
			appendTo : 'body'
			, cs : 'modal-xsc-info'
			, contentHtml : '<ul class="xsc-info">'+infoCon+'</ul>'
			, closeable: true
			, mask : true
			, destroyOnClose : true
		}).play(1);
	}, {na : 1})
	
	//邮箱验证
	.reg('mailyz', function(e){
		
		FN.avticeAccount(function(){
			if('recharge' === PD.get('action')){//充值先验证邮箱
				$('#rechargeForm').submit();
			}else{
				$(e.src).replaceWith('<span class="btn btn-disabled">已验证</span>');
			}
		}, e);
	})
	
	
	//活动取消报名
	.reg('cancelhd', function(e){
		var uri = $(e.src).attr('href'),
			fy = e.get('fy') === '1',
			box = $('body').data('cancelBox'),
			createBox = function(beforeFn){
				return G.use('Modal', {
					view : $('#modalCancel')[0]
					, closeable: true
					, mask : true
					, onViewReady : function(){
						this.jq('#successBtn').on('click', function(ev){
							ev.preventDefault();
							box.play(0);							
							var status = $(e.src).closest('p.status');
							if(fy){
								status.find('.success').attr('class', 'warning').text('取消报名 (处理中)');
							}else{							
								status.find('.success').attr('class', 'canceled').text('已取消');
							}
							$(e.src).remove();
						})
						var actionsArea = box.jq('#actionsArea');
						this.jq('#cancelBtn').on('click', function(e){
							e.preventDefault();
							actionsArea.find('.loading-mini').cssDisplay(1);							
							fn(function(r){
								if(true){
									box.jq('div.form').cssDisplay(0);
									box.jq('div.alert-success').cssDisplay(1);
								}else{
									actionsArea.addClass('error');
									actionsArea.find('.loading-mini').cssDisplay(0);
									actionsArea.find('.help-inline').text(r.getError());
								}								
							});
						})
					}
					,beforeShow : function(){
						G.ui.Modal.prototype.beforeShow.call(this);
						var itemArea = $(e.src).closest('div.item'), formArea = box.jq('div.form');
						itemArea.find('p[rel]').each(function(i, item){							
							var text = $(item).text().split('：')[1],
							name = $(item).attr('rel');
							if(name === '_price') text = text.replace('元','');
							formArea.find('[rel='+name+']').text(text);
						});
						formArea.find('[rel=_name]').text(itemArea.find('h3.title a').text());
					}
					, afterHide  : function(){
						G.ui.Modal.prototype.afterHide.call(this);
						this.jq('div.form,div.alert-success').cssDisplay(0);
						var actionsArea = box.jq('#actionsArea');
						actionsArea.find('.loading-mini').cssDisplay(0);
						actionsArea.removeClass('error');
						actionsArea.find('.help-inline').text('');
					}
				});				
			}
			fn = function(cb){
				cb && cb();
				$.get(uri);//没有返回					
			};
		if(!fy){			
			var status = $(e.src).closest('p.status').find('.success').attr('class', 'canceled').text('已取消');
			$(e.src).remove();
			$.get(uri);//没有返回
			return;
			fn(function(r){
				if(true){
					if(!box){
						box = createBox();					
					}
					box.jq('div.alert-success').cssDisplay(1);
					box.play(1);
				}else{
					G.ui.mbox.BubbleError(e.src, r.getError())
				}
			});
		}else{
			if(!box){
				box = createBox();					
			}
			box.jq('div.form').cssDisplay(1);
			box.play(1);
		}
	});   
	
	
		
	
})(Gaofen, jQuery, window);
