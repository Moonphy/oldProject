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


if(typeof JSON === 'undefined') 
	JSON = {};
JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+obj+'"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof(v);
            if (t == "string") v = '"'+v+'"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};

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
			G.FN.setHome(this, this.src||'');
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
		var sideAd = true;
		//两侧试题优惠广告
		if(sideAd && (+new Date()) < 1386892800000 && channel === 'xuexiao'){
			var cs = 'ad-couplet-fold';
			$('<a id="lefta-d" target="_blank" href="http://shop72729909.taobao.com" class="ad-couplet ad-couplet-left"></a><a href="http://shop72729909.taobao.com"  target="_blank"  id="righta-d" class="ad-couplet ad-couplet-right"></a>').appendTo('body');
			var ads = $('#lefta-d,#righta-d');
			ads.mouseenter(function(){
				ads.removeClass(cs);
			}).mouseleave(function(){
				ads.addClass(cs);
			});	
		}		
	})();

/*-----------公共结束----------*/

/*-----------模块功能----------*/		
	switch(channel){
		
		//会员中心
		case 'member' :
			switch(action){
				case 'register' : //注册					
					var regForm = $('#registerForm'), url = regForm.attr('action'), codeImg = regForm.find('#codeImg');
					regForm.find('#changeCode').click(function(e){
						e.preventDefault();
						codeImg.trigger('click');
					});
					
					
					$('#regPassword').keydown(function(e){
						if(e.keyCode === 9)
							regForm.find('input[type="radio"]:eq(0)').prop('checked', true).parent().parent().focus();
					});
					
					//regForm.find('input[type="radio"]').keydown(function(e){
					//	if(e.keyCode === 9){
					//			$('#residedistrictbox').children().eq(0).focus();
					//		}
					//});
					

										
					regForm.find('#user_agree').click(function(e){
						if($(this).prop('checked') === true){
							$('#btn').prop('disabled', false).parent().addClass('btn-primary');							
						}else{
							$('#btn').prop('disabled', true).parent().removeClass('btn-primary');
						}
					});
					var apobj = FN.areaPublic();
					apobj.selectArea();
					G.use('validator', {
						form : regForm[0]
						, trigger : '#btn'
						, onError : function(){
							apobj.checkArea();
						}
						, onSuccess : function(data){
							if(!apobj.checkArea()) return false;
							regForm.find('#btn').parent().cssDisplay(0);
							regForm.find('#reging').cssDisplay(1);
							data.user_agree = true;
							data.status = regForm.find('input[name="status"]:checked').val();
							var self = this;
							$.ajax({
								type : 'post',
								url: url,
								data : data,
								success : function(result){
									self.lock = false;
									var msg;
									switch(Number(result)){
										case -1 : 
											msg = "用户名不合法";
										break;
										case -2 : 
											msg = "包含要允许注册的词语";
										break;
										case -3 : 
											msg = "用户名已经存在";
										break;
										case -4 : 
											msg = "Email 格式有误";
										break;
										case -5 : 
											msg = "Email 不允许注册";
										break;
										case -6 : 
											msg = "该 Email 已经被注册";
										break;
										case -7 : 
											msg = "内容填写不完整";
										break;
										case -8 : 
											msg = "验证码不正确，请检查";
											codeImg.trigger("click");
										break;
									};
									if(msg){
										regForm.find('#error').html(msg);
										regForm.find('.actions').addClass('error');
										regForm.find('#reging').cssDisplay(0);
										regForm.find('#btn').parent().cssDisplay(1);
									}else{
										//跟踪代码SEO
										FN.seoFollow({'event': 'signup'});
										
										$("body").append(result);
									}
								}
							});	
							return false;
						}
					})	
				break;
				
				case 'login' : //用户登录
					var regForm = $('#loginForm'), url = regForm.attr('action');
					regForm.find('#bubble .close').click(function(e){
						e.preventDefault();
						regForm.find('#bubble').cssDisplay(0);
					});
					G.use('validator', {
						form : regForm[0]
						, trigger : regForm.find('#btn')
						, isShowOk : false
						, onSuccess : function(data){						
							regForm.find('#btn').parent().cssDisplay(0);
							regForm.find('#reging').cssDisplay(1);
							data.logstatus = $('#logstatus').prop('checked');
							regForm.find('#bubble').cssDisplay(0);
							var self = this;
							$.ajax({
								type : 'post',
								url: url,
								data : data,
								success : function(result){
									self.lock = false;
									var msg;
									if(result === '-1' || result === '-2'){
										msg = '用户名或密码错误';
									}
									if(msg){
										FN.seoFollow({'event': 'signinfailed'});
										regForm.find('#bubble').cssDisplay(1).html(msg);
										regForm.find('#reging').cssDisplay(0);
										regForm.find('#btn').parent().cssDisplay(1);
									}else{
										//跟踪代码SEO
										FN.seoFollow({'event': 'signin'});
										setTimeout(function(){
											$("body").append(result);
										},2000);
										
									}										
								}
							});	
							return false;
						}
					});
				
				break;
				
				case 'my' :
					//隐藏广告位
					var nt = $('#notice');
					if($.cookie('memberTopAd')){
						nt.cssDisplay(0);
					}else{
						nt.cssDisplay(1);
					}
					nt.find('.close').click(function(e){
						e.preventDefault();
						var div = $('<div></div>').insertBefore(nt);
						div.append(nt).animate({'height':0}, 400, function(){
							$.cookie('memberTopAd', 1, {expires : 1});
							div.remove();
						})
					});
				break;	
				case 'task' : 	
				/*
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
							Req.qiandao2('check', function(r){ 
								var code = Number(r.getCode());
								if(code !== ''){
									switch(code){
										case 0 ://未签到
											qiandao.attr('rel', 'e:qd');
										break;
										case 423003 ://已签到
										case 423101 : 
											if(action === 'my'){
												qiandao.addClass('signed').html('');
											}else{
												qiandao.replaceWith('<span class="btn btn-disabled">已领取</span>');
											}
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
							qiandao.attr('rel', 'e:null');
						}
					}
					
					if(PD.get('emailstatus') == '0'){
						FN.avticeAccount('', '');
					}
					*/
				break;
				
				case 'invite' :
					$('#invite').on('click', function(e){
						e.preventDefault();
						var txt = $('#inviteVal').val();
						if (window.clipboardData) {
							window.clipboardData.clearData();
							clipboardData.setData("Text", txt);
							alert("复制成功！");
						}else{
							window.prompt("请 Ctrl+C 复制内容", txt);
						}
					})
				break;
				
				//最新资料
				case 'newDatum' : 
					FN.isHasNewList('', $('#newLists tr:first').attr('rel'), 120000);
				break;
				//最新讲座
				case 'newlectures' : 
					FN.isHasNewList('', $('#newLists div:first').attr('rel'), 120000, '/ajax/getNewLectures');
				break;
				//找回密码
				case 'getPassword' :			
					var pwdForm = $('#pwdForm'), ipts = pwdForm.find('input');
					pwdForm.find('#changeCode').click(function(e){
						e.preventDefault();
						$("#codeImg").trigger('click');
					});
					
					G.use('validator', {
						form : pwdForm[0]
						, elements : ipts
						, trigger : '#btn'
						, onSuccess : function(data){
							pwdForm.find('#btn').parent().cssDisplay(0);
							pwdForm.find('#reging').cssDisplay(1);
							pwdForm.find('#error').html('');
							pwdForm.find('.actions').attr('class', 'actions');
							var self = this;
							Req.postReq('/ajax/findpwd', {
								email : data.email,
								checkCode : data.checkCode
							}, function(r){
								if(r.isOk()){
									location.href = r.getData().url;
								}else{
									pwdForm.find('#error').html(r.getError());
									pwdForm.find('.actions').addClass('error');
									pwdForm.find('#reging').cssDisplay(0);
									pwdForm.find('#btn').parent().cssDisplay(1);
								}
							});
							return false;
						}
					});
				break;
				//重置密码
				case 'renewpwd' : 
					var pwdForm = $('#pwdForm'), ipts = pwdForm.find('input');
					G.use('validator', {
						form : pwdForm[0]
						, elements : ipts
						, trigger : '#btn'
						, onSuccess : function(data){
							pwdForm.find('#btn').parent().cssDisplay(0);
							pwdForm.find('#reging').cssDisplay(1);
							pwdForm.find('#error').html('');
							pwdForm.find('.actions').attr('class', 'actions');
							$('form').submit();
							//return;

							return false;
						}
					});
					
				break;
				
				case 'doreset' :
					var stime = $('#stime'), time = 3000;
					if(stime.length){
						stime.text(time / 1000);
						setInterval(function(){
							time -=1000;
							if(time <= 0 ){
								location.href = 'http://'+location.host;
							}else stime.text(time / 1000);
						}, 1000);
					}
				break;
				
				//注册确认通知信
				
				case 'active' : 
					G.use('action').reg('active', function(re){
						G.use('Modal', {
							appendTo : 'body',
							contentHtml : 'activeCode',
							title : '请输入验证码',
							cs : 'modal-captcha',
							closeable: true,
							destroyOnClose : true,
							onViewReady : function(){								
								var btn = this.jq('#btn'), jqmsg = this.jq('#msg'), ipt = this.jq('#ipt'), codeArea = this.jq('#codeArea'),
									actions = this.jq('#actions'), self = this, jqvcode = self.jq('#vcode'), vcodeUrl = PD.get('src');
									revcode();
								function revcode(){
									jqvcode.attr('src', vcodeUrl+"&d="+(new Date().getTime()));
								}
								this.jq('#changeVcode').click(function(e){
									e.preventDefault();
									revcode();
								});
								function showMsg(msg, p){
									if(p){
										jqmsg.text(msg).cssDisplay(p);
									}else{
										jqmsg.cssDisplay(p);
									}
								}
								ipt.blur(function(e){
									if($.trim(ipt.val()) !== '') {
									    codeArea.addClass('success');
									}else{
										codeArea.removeClass('success');
									}
								});
								btn.click(function(e){
									var v = $.trim(ipt.val());
									if(v === ''){
										showMsg('请输入验证码', 1);
									}else{									
										showMsg('', 0);
										btn.parent().addClass('hidden');
										actions.find('span:eq(0)').removeClass('hidden');
										Req.q(PD.get('ajaxUrl'), {code : v}, function(r){
											if(r.isOk()){
												self.jq('#gfbody').html('<div class="alert alert-success"><i class="ico"></i><div class="info"><p>邮件已重新发送，请关闭窗口登录邮箱验证。</p></div></div>');
												//actions.html('<span class="btn btn-disabled">发送成功</span>');
											}else{
												self.jq('#changeVcode').trigger('click');
												actions.find('span:eq(0)').addClass('hidden');
												btn.text('立刻重发').parent().removeClass('hidden');
												showMsg(r.getError(), 1);
												ipt.val('');
											}
										
										});
										
									}
								});
							}					
						}).play(1);
						
					});
				break;
				
				//QQ、weibo帐号登录时完善帐号
				case 'bind':
					var pwdForm = $('#regForm'), ipts = pwdForm.find('input,select'), hasArea = $('#resideprovince').length;
					if(hasArea){
						var apobj = FN.areaPublic();
						apobj.selectArea();
					}
					G.use('validator', {
						form : pwdForm[0]
						//, elements : ipts
						, trigger : '#btn'
						, onError : function(){
							if(hasArea)apobj.checkArea();
						}
						, onSuccess : function(data){
							if(hasArea) if(!apobj.checkArea()) return false;
							pwdForm.find('#btn').parent().cssDisplay(0);
							pwdForm.find('#reging').cssDisplay(1);
							pwdForm.find('#error').html('');
							data.status = pwdForm.find('input[name="status"]:checked').val();
							//pwdForm.find('.actions').attr('class', 'actions');
							Req.postReq(pwdForm.attr('action'), data, function(r){
								if(r.isOk()){
									FN.seoFollow({'event': 'bindsignup'});
									setTimeout(function(){
										location.href = r.getData().url;
									},2000);
								}else{
									pwdForm.find('#btn').parent().cssDisplay(1);
									pwdForm.find('#reging').cssDisplay(0);
									pwdForm.find('#error').html(r.getError());
								}
							});
							return false;
						}
					});

				break;
				
				case 'recharge' : //高分币充值
					var jqForm = $('#rechargeForm'), jqcontrol = jqForm.find('div.amount-options>span'), 
						gift = jqForm.find('div.gift'), tips = jqForm.find('p.tips');
					jqcontrol.on('click', function(e){
						var jqt = $(this);
						if(jqt.hasClass('active').length) return;
						jqForm.find('span.active').removeClass('active');
						jqt.addClass('active');
						var rel = Util.parseKnV(jqt.attr('rel'));
						gift.cssDisplay(rel.o != '0').find('span').text(rel.o);
						tips.find('span').text(parseInt(rel.p)*10+parseInt(rel.o));
						jqForm.find('#price').val(rel.p);
					})	

					if(PD.get('emailstatus') != '1'){//没有验证的帐号，弹出浮层
						FN.avticeAccount('', '', {
							email : PD.get('email'),
							emaillink : PD.get('emaillink')||''
						});
					}
				break;
				
				case 'credit' :
					$('input[name="iostate"]').on('click', function(e){
						var id = this.id, val = id.replace('io_', '');
						location.href = '/my/credit?iostate='+val;						
					})
				break;
				
				case 'profile' : 
					$('#tabs').on('click', function(e){
						e.preventDefault();
						var jqthis = $(e.target);
						if(jqthis.hasClass('active')) return;
						var index = jqthis.index();
						$('.form-profile').cssDisplay(index === 0);
						$('.form-contact').cssDisplay(index === 1);
						var span = $(this).children(':not(a)'), text  = span.text();
						span.replaceWith('<a href="#">'+text+'</a>');
						jqthis.replaceWith('<span class="active">'+(jqthis.text())+'</span>');
					});
					
					var userInfo = PD.get('userInfo');
				
					var area = new AreaSelect({
						provinceId : 'resideprovince',
						cityId : 'residecity',
						distId : 'residedist'}).setArea(userInfo.resideprovince, userInfo.residecity, userInfo.residedist);
					
					var profileArea = $('#profileArea'), elements = profileArea.find('select');
					elements.push(profileArea.find('input[type="radio"]').eq(0));
					G.use('validator', {
						form : profileArea
						, trigger : '#profileBtn'
						, elements : elements
						, onSuccess : function(data){
							var actions = $('#profileActions'), children = actions.children();
							actions.removeClass('error').removeClass('success');
							children.eq(2).text('');
							children.eq(0).cssDisplay(0);
							children.eq(1).cssDisplay(1);
							data.status = profileArea.find('input[name="status"]:checked').val();
							console.log(data.status);
							Req.postReq('/Ajax/updateProfile', data, function(r){
								children.eq(0).cssDisplay(1);
								children.eq(1).cssDisplay(0);
								if(r.isOk()){																	
									profileArea.find('.form-row').removeClass('success');									
									profileArea.find('.help-inline').text('');
									actions.addClass('success');	
									children.eq(2).text('Ok');
								}else{
									actions.addClass('error');
									children.eq(2).text(r.getError());
								}
								setTimeout(function(){
									actions.removeClass('error').removeClass('success');	
									children.eq(2).text('');
									return false;
								}, 2000);
							})							
						}
					});
					
					
					//联系方式
					var contactArea = $('#contactArea'), alock;
					contactArea.find('.reSend').click(function(e){
						e.preventDefault();
						if(alock) return;
						alock = true;
						var url = 'http://my.gaofen.com/ajax/cse';
						Req.q(url, {email:PD.get('email')}, function(act){
							var aresult = act.getData();
							if(act.isOk()){
								contactArea.find('#send').cssDisplay(0);
								$('#afterSend').cssDisplay(1);
							}else{
								alock = false;									
							}
						});
					});	
					G.use('validator', {
						form : contactArea
						, trigger : '#contactBtn'
						, elements : contactArea.find('input')
						, onSuccess : function(data){
							var actions = $('#contactActions'), children = actions.children();
							actions.removeClass('error').removeClass('success');
							children.eq(2).text('');
							children.eq(0).cssDisplay(0);
							children.eq(1).cssDisplay(1);
							//Req.q('/my/punch?action=check', data, function(r){
							Req.postReq('/Ajax/updateContact', data, function(r){
								children.eq(0).cssDisplay(1);
								children.eq(1).cssDisplay(0);
								if(r.isOk()){																	
									contactArea.find('.form-row').removeClass('success');									
									contactArea.find('.help-inline').text('');
									actions.addClass('success');	
									children.eq(2).text('Ok');
								}else{
									actions.addClass('error');
									children.eq(2).text(r.getError());
								}
								setTimeout(function(){
									actions.removeClass('error').removeClass('success');	
									children.eq(2).text('');
									return false;
								}, 2000);
							})							
						}
					});
					
								
				break;
				
				case 'resetPwd' :
					var pwdArea = $('#pwdArea');
					pwdArea.find('#changeCode').click(function(e){
						e.preventDefault();
						pwdArea.find('#codeImg').trigger('click');
					});
					G.use('validator', {
						form : pwdArea
						, trigger : '#pwdBtn'
						, elements : pwdArea.find('input')
						, onSuccess : function(data){
							var actions = $('#pwdActions'), children = actions.children();
							if(data.newPwd === data.oldPwd){
								actions.addClass('error');
								children.eq(2).text('新密码不能和原密码一致');
								return false;
							}
							actions.removeClass('error').removeClass('success');
							children.eq(2).text('');
							children.eq(0).cssDisplay(0);
							children.eq(1).cssDisplay(1);
							//Req.q('/my/punch?action=check', data, function(r){
							Req.postReq('/Ajax/updatePassword', data, function(r){
								children.eq(0).cssDisplay(1);
								children.eq(1).cssDisplay(0);
								if(r.isOk()){																	
									pwdArea.find('.form-row').removeClass('success');									
									pwdArea.find('.help-inline').text('');
									actions.addClass('success');	
									children.eq(2).text('Ok');
									pwdArea.find('.form-row input').val('');
									pwdArea.find('#codeImg').trigger('click');
								}else{
									actions.addClass('error');
									children.eq(2).text(r.getError());
								}
								setTimeout(function(){
									actions.removeClass('error').removeClass('success');	
									children.eq(2).text('');
									return false;
								}, 2000);
							})							
						}
					});
				
				break;
				
			}
		break;
		
		
		case 'lectures' : //活动
            switch(action){
                case 'view' : 
                    var apply_aside = $('#apply_aside').hide().cssDisplay(1);
                    $(window).scroll(function(){
                        var sh = $(this).scrollTop();        
                        if(sh>355){
                            apply_aside.fadeIn(300);            
                        }else{
                            apply_aside.fadeOut(300);
                        }
                    });

                    //显示当前学段QQ群
					var side = $('div.widget-sponsor');
					if(side.length){
						var section = $('ul.breadcrumb>li').eq(2).find('a').text();
						if(section === '小学'){
							section = 'xsc';
						}else if(section === '幼升小'){
							section = 'sx';
						}else if(section === '初中'){
							section = 'zhongkao';
						}else if(section === '高中'){
							section = 'gaokao';
						}

						Req.q('http://m.gaofen.com/ajax/qqgroup?callback=?', {
							channel : 'huodong', 
							city : remote_ip_info.city,
							section : section
						}, function(r){	
								try{
									$(r.getData()).insertAfter(side);
								}catch(e){

								}		
						});
					}

                break;
            }
            
        break;

	
		case 'jiangzuo' : //讲座模块
		
			switch(action){
				case 'index' : //讲座首页
					//修改右则状态
					/*
					Req.q('http://'+host+'/ajax/getLecturesCount', {}, function(r){
						if(r.isOk()){
							var jqps = $('div.widget-statistic>div.status p'), data = r.getData();
								jqps.eq(0).html('举办讲座： '+data.lectuCount+'场');
								jqps.eq(1).html('参加人数： '+data.applynumCount+'人');
								jqps.eq(2).html('合作机构： '+data.orgCount+'家');
						}
					});	
					*/
					var page = 2;
					G.use('action').reg('more', function(e){
						$(e.src).cssDisplay(0);
						$('#loadding').cssDisplay(1);
						Req.q('/ajax/getLecturesList', {page:page}, function(r){
							$('#loadding').cssDisplay(0);
							if(r.isOk()){
								var result = r.getData();
								$('div.thumb-info-list').append(result.itemHtml);								
								if(result.nextPage != 'false' && result.nextPage !== false){
									page++;
									$(e.src).cssDisplay(1);
								}
							}
						});
					}, {na : 1});
				case 'list' :
					//G.use('jiangzuoChangeStatus');
				break;
				case 'view' : //讲座详细页
				case 'report': //讲座报道
					/*
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
					*/
					if(PD.get('huodong_success') === 1){
						G.ui.lectureSuccess();
					}
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
				case 'index' : //资料首页
					/*
					//tab切换
					var showTimer, timer = 300, cache = {}, cs = 'active'; 
					$('div.heading-tabs .tabs-s2>.item').mouseenter(function(){
						clearTimeout(showTimer);
						var dom = $(this);
						if(!dom.hasClass(cs)){
							var id = dom.attr('id'), data = cache[id];
							if(data) showTab(dom ,data);
							else showTimer = setTimeout(function(){getTab(dom, id)}, timer);
						}
					});
					function getTab(dom, id){
						var id = dom.attr('id');
						Req.q('/ajax/getBlock', {bid:id}, function(r){
							if(r.isOk()){
								showTab(dom, cache[id] = r.getData());
							}
						});
					}
					
					function showTab(dom, data){
						var parent = dom.closest('div.mod-data'), target = parent.find('div.tab-cont'),
							hideA = parent.find('.'+cs), hid = hideA.attr('id');
						if(!cache[hid]) cache[hid] = target.html();
						target.html(data);
						hideA.removeClass(cs);
						dom.addClass(cs);						
					}
					*/
					//右则切换
					var ts1 = $('#tabSwitch1');
					G.use('HoverSwitch',{
						view : ts1[0],
						//targetName : '.item',
						contentList : ts1.children(':gt(0)'),
						controler : ts1.find('#tabs'),
						innerViewReady : function(){
							this.jq().find('#tabs').click(function(e){
								var target = $(e.target), href = target.attr('href');
								if(!href || href === '#')
									e.preventDefault();
							});
						}
					})
					
					var ts2 = $('#tabSwitch2');
					G.use('HoverSwitch',{
						view : ts2[0],
						contentList : ts2.children(':gt(0)'),
						controler : ts2.find('#tabs'),
						innerViewReady : function(){
							this.jq().find('#tabs').click(function(e){
								e.preventDefault();
							});
						}
					})
					
				
				break;
				case 'view' :
					G.use('HeadToolbar', {
						view : $('#headToolbar')[0],
						showPx : 195,
						sharePx : 264
					}).play(0);
					/*
					//换一组
					var lists = PD.get('guess');
					if(lists){
						var len = lists.length, likeList = $('#likeList'), changeClass = $('#changeClass');
						if(len > 10){//少于10不处理
							changeClass.cssDisplay(1).on('click', function(e){
								e.preventDefault();
								likeList.animate({'opacity':0.1}, 300, function(){
									likeList.html(getListData().join(''));
									likeList.animate({'opacity':1}, 100);
								});							
							});
													
							function getRandom(max){
								return Math.floor(Math.random()*max);
							}
							function getListData(){
								var indexList = [], nd = [];
								while(indexList.length < 5){
									var num = getRandom(len);
									if($.inArray(num, indexList) === -1){
										indexList.push(num);
										nd.push(G.tpl.parse('<li><a target="_blank" title="" href="/{.id}.htm">{.title}</a></li>', lists[num]));
									}
								}
								
								return nd;
							}					
						}
					}		
					*/
					//资料问卷调查
					//FN.ziliaoDiaocha();
				case 'dochtml' : //资料浏览
					if(PD.get('jsReader')){//需要初始化阅读器
						if(PD.get('isPPT')){
							var scrollArea = $('#scrollArea');
							G.use('pptScroll', {
								view : scrollArea[0],
								pages : PD.get('pages'), 
								total:PD.get('total'),
								fid : PD.get('fid'),
								dragBar : scrollArea.find('#dragBar'),
								scrollBar: scrollArea.find('#scrollBar'),
								offMargin : scrollArea.offset().left-10
							});
						}else{
							if(PD.get('total') === 0){//没有预览内容可以下载
								$('#readControl').find('a').on('click', function(e){
									e.preventDefault();
								})
							}else{
								var v = G.use('Reader', {controlView : $('#readControl'), view : $('#pageContain'), isImg : PD.get('isImg') === 1 ? 1 : 0});
							}
						}
					}
				break;
				case 'userupload' : //资料上传
					var jf = $('#form1'), inputs = jf.find('input,textarea');
					var vd = G.use('validator', {
						form : jf,
						trigger : '#btnSubmits',
						elements : inputs, 
						onSuccess : function(data){	
							if($('#pact').prop('checked')){
								$('#file_upload').uploadify('upload','*');
							}
							return false;
						}
					});
					
					$('#pact').click(function(){
						if($(this).prop('checked')){
							vd.lock = false;
							$('#btnSubmits').removeClass('btn-disabled');
						}else{
							vd.lock = true;
							$('#btnSubmits').addClass('btn-disabled');
						}
					});
					
					var SWFUPLOADSESSID = PD.get('SWFUPLOADSESSID') || "", swf_auth_key = PD.get('swf_auth_key') || "";
					var up = $('#file_upload').uploadify({
						'fileObjName' : 'uploadefile',
						'auto': false,
						'swf'      : '/public/js/uploadify/uploadify.swf',
						'uploader' : "/ajax/uploadFile/?SWFUPLOADSESSID="+SWFUPLOADSESSID+"&swf_auth_key="+swf_auth_key+"&__rnd="+(+new Date),
						'fileTypeExts' : '*.doc;*.docx;*.xls;*.xlsx;*.ppt;*.pptx;*.pdf',
						'queueSizeLimit' : 1,
						'fileSizeLimit' : '20480KB',
						'buttonImage' : "/public/js/swfupload/swfuploadbtn.png",
						'width' : 76,
						'height' : 20,
						'buttonCursor' : 'arrow',
						'onUploadStart' : function(file){
							vd.lock = true;
							//$('#pact').prop('disabled', true);
							$('#fsUploadProgress').removeClass('hidden');
							$('#btnSubmits').addClass('btn-disabled');							
						},
						'onSelect' : function(file){
							$('#txtFileName').val(file.name);
						},
						'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
							var percent = Math.round(bytesUploaded / bytesTotal * 100);						
							$('#fsUploadProgress').html('正在上传文档，请稍候...(<em>'+percent+'</em>%)');
						},
						'onUploadSuccess' : function(file, data, response) {
							vd.lock = false;
							document.getElementById("hidFileID").value = data;
							$('#fsUploadProgress').cssDisplay(0).text('');
							$('#btnSubmits').removeClass('btn-disabled');
							jf.submit();
						},
						itemTemplate :'<div></div>'
					});
					break;
				case 'userUploadActive' : 
					var alock = false, jqmsg = $('#msg');								
						$('#send').click(function(e){
							e.preventDefault();
							if(alock) return;
							alock = true;
							jqmsg.attr('class', 'loading-mini').text('发送中...');
							var url = 'http://my.gaofen.com/ajax/cse';
							//if(G.PD.get('host').indexOf('dev')>-1 ) url = 'http://dev.login.gaofen.com/ajax/cse';
							Req.q(url, {email:PD.get('email')}, function(act){
								var aresult = act.getData();
								alock = false;				
								if(act.isOk()){
									jqmsg.attr('class', 'icon-success').text('已发送');
									//setTimeout(function(){
									//	location.reload();
									//},2000);
								}else{
									//alock = false;									
									jqmsg.attr('class', 'icon-error').text(act.getError());
								}
								jqmsg.cssDisplay(1);
							});
						});	
				break;
				
				case 'docspecial' : //资料专题页
					// 右则列表分页
					var panel = $('#doclistsPanel'), listPanel = panel.find('#doclists'), reads = 6,
						lis = listPanel.children('li').clone(),activeDom = '',
						len = lis.length, pager = panel.find('div.pager'), page = 0, allPage = Math.ceil(len/reads);
					activeDom = listPanel.children('li:eq(0)').trigger('click').find('h4').text(), toTop = panel.offset().top - 65;
					if(len > reads){
						listPanel.children('li:gt('+(reads-1)+')').remove();
						pager.cssDisplay(1);
						pager.find('a').on('click', function(e){
							e.preventDefault();
							var cs = $(this).attr('class');
							if(cs === 'prev'){//上一页
								setPageBtn(page--);
							}else if(cs === 'next'){//下一页
								setPageBtn(page++);
							}
						})												
					}
					
					function setPageBtn(){
						pager.find('.prev-disabled').cssDisplay(page === 0);
						pager.find('.prev').cssDisplay(page > 0);
						pager.find('.next-disabled').cssDisplay(page === allPage -1);
						pager.find('.next').cssDisplay(page < allPage -1);
						var sli = page*reads, eli = sli+reads;
						var data = lis.slice(sli, eli);
						append(data);
						$('body,html').animate({scrollTop:toTop},600);
					}
					function append(data){
						//var ul = $('<ul></ul>').css('opacity', 0.1);
						var ul = $('<ul></ul>');
						var active = listPanel.find('li.active');
						if(active.length) activeDom = active.find('h4').text();
						$.each(data, function(i, item){
							var temp = $(item).clone();
							if(temp.find('h4').text() === activeDom)
								temp.addClass('active');
							ul.append(temp);
						});
						listPanel.animate({'opacity':0.1}, 300, function(){
							listPanel.replaceWith(ul);
							listPanel = panel.find('ul');
							return;
							ul.animate({'opacity':1}, 300, function(){
								listPanel = panel.find('ul');
							});								
						})
					}
					// 右则列表分页结束
					G.use('HeadToolbar', {
						view : $('#headToolbar')[0],
						showPx : 282,
						sharePx : 0
					}).play(0);

					// 右则“？”
					Gaofen.use('HoverDelay', {
						view: $('#hoverDelay')[0],
						hoverView : $('#hoverDelay span.bubble')		
					}).play(1);

					//资料问卷调查
					//FN.ziliaoDiaocha();
				break;
				//以下是频道页面
				case 'xsc':
				//case 'zhongkao':
				//case 'gaokao':
				/*
					var intros = $('#modData div.intro');					
					$('#tagshandle>a').on('mouseover', function(e){
						var index = $(this).index();
						if(!intros.eq(index).hasClass('hidden')) return;
						intros.addClass('hidden');
						intros.eq(index).removeClass('hidden');
					})
					*/
				break;
			}
		break;
		case 'shiti' : //试题
			switch(action){
			    case 'order' :
					//默认加上“请选择地区”
					/*
					PCAA[19][0].push("--请选择地区--");
                    new PCAS("resideprovince","residecity","residedist","广东省","广州市","");
                    $("#resideprovince,#residecity").prop("disabled",true).css({"cursor":"no-drop"});
					*/
					var area = new AreaSelect({
						provinceId : 'resideprovince',
						cityId : 'residecity',
						distId : 'residedist'}).setArea('广东省', '广州市');
					$("#resideprovince,#residecity").prop("disabled",true).css({"cursor":"no-drop"});
					
                    $('input[name="pay_type"]').click(function(){
                        if($(this).val()==1){
                            //$("#resideprovince ").val("广东省").trigger("change");
							area.setArea('广东省', '广州市');
                            $("#resideprovince,#residecity").prop("disabled",true).css({"cursor":"no-drop"});
                        }else{
                            $("#resideprovince,#residecity").prop("disabled",false).css({"cursor":"default"});
                        }
                    });
					if($('input[name="pay_type"]:checked').val() == '2'){//网上支付
						$("#resideprovince,#residecity").prop("disabled",false).css({"cursor":"default"});
					}

                    var jqForm = $('#order_add_info');
                    G.use('Ord_amount', {view : jqForm.find('#moneyArea')[0], amount : jqForm.find('#quantity')}).play();
                    G.use('validator', {
                        form : jqForm[0]
                        , trigger : '#ord_btn'
                        , onSuccess : function(data){
                            var self = this, url = jqForm.attr('action'),
                                pay_type = $('input[name="pay_type"]:checked').val();
                            data.pay_type = pay_type;
                            $('#ord_btn').removeAttr("disabled");
                            self.lock = true;

                            Req.postReq(url, data, function(r){
                                self.lock = false;
                                if(r.isOk()){
                                    location.href = r.getData().url;
                                }else{
                                    var code = r.getCode(), msg = this.getRaw().err;
                                    alert(msg);
                                    $('#ord_btn').removeAttr("disabled");

                                }
                            });
                            return false;
                        }
                    });
                break;
			
			}
		break;
				
		case 'docspecial' :
			$('#saveMoney').text(Number(PD.get('orgPrice'))-Number(PD.get('price'))+'元');
			$('#doclists li:eq(0)').trigger('click');
			/*-----右侧浮窗-----*/
			$("#fbHandle").click(function(){
				var $me = $(this).parent();
				if($me.hasClass("fb-hide")){
					$me.animate({right:0}, function(){
						$(this).removeClass("fb-hide");
						$(this).find("i").attr("title","收缩");
					});
				}else{
					$me.animate({right:-161},function(){
						$(this).addClass("fb-hide");
						$(this).find("i").attr("title","展开");
					});
				}
			});	
			if($.cookie('gaofen_user')){//资料专题提示下载
				var url = 'http://'+PD.get('host') + '/ajax/downloadTip', id = PD.get('id');
				Req.q(url, {id : id}, function(r){
					if(r.isOk()){//只有支付未下载过才显示
						G.use('Modal', {
							appendTo : 'body'
							, mask : true
							, title : '下载文档'
							, cs : 'modal-download'
							, bookname : PD.get('title')
							, contentHtml : 'downloadTip'
							, closeable: true
							, destroyOnClose : true
							, onViewReady : function(){
								this.jq('#bookname').append($('#docsnumtips').text());
								var self = this;
								$('div.feedback').css('z-index', 10000);
								$('#downbtn').click(function(_e){
									FN.addFrameToDownload('http://'+G.PD.get('host')+'/docs/downloadTopic/'+PD.get('id'));
									setTimeout(function(){self.close()}, 500);
								});	
							}					
						}).play(1);
					}
				});
			}
		break;
		
		case 'course' : //课程
			switch(action){
			    case 'view' :
					//加baidu地图
					//百度地图API功能
					function loadJScript() {
						var script = document.createElement("script");
						script.type = "text/javascript";
						script.src = "http://api.map.baidu.com/api?v=2.0&ak=3VX7hs1LAveYBWCRfnvT6Hxp&callback=baiduInit";
						document.body.appendChild(script);
					}
					window['baiduInit'] = function() {
						var map = new BMap.Map("gaofenMap"),
							point = new BMap.Point(113.29, 23.16); 
						map.centerAndZoom(point,11);                 
						map.enableScrollWheelZoom();                 						
						var index = 0, myGeo = new BMap.Geocoder(),adds = [];
						$.each(PD.get('campus'), function(i, item){
							adds.push(item.address);
						});

						function bdGEO(){
							geocodeSearch(adds.shift());
							index++;
						}
						function geocodeSearch(add){
							if(adds.length){
								setTimeout(bdGEO,400);
							}
							if(add)
								(function(_index){
									myGeo.getPoint(add, function(point){									
										if (point) {
											var address = new BMap.Point(point.lng, point.lat);
											addMarker(address,new BMap.Label(_index+":"+add,{offset:new BMap.Size(10,-2)}));
										}
									}, "广州市");
								})(index+1);

						}
						// 编写自定义函数,创建标注
						function addMarker(point,label){
							var marker = new BMap.Marker(point);
							map.addOverlay(marker);
							marker.setLabel(label);
						}
						bdGEO();
					} 
					loadJScript();
				break;
			
			}
			
		break;
		
		case 'baike':
			switch(action){
			
				case 'index' : 
					//var ts1 = $('#entryPanelSwitch');
					$('.widget-latest-entry,.widget-hot-entries').each(function(){
						var view = $(this);
						G.use('HoverSwitch',{
							view : view[0],
							targetName : 'span',
							contentList : view.children(':gt(0)'),
							controler : view.find('.tabs-s2'),
							innerViewReady : function(){
								this.jq().find('.tabs-s2').click(function(e){
									var target = $(e.target), href = target.attr('href');
									if(!href || href === '#')
										e.preventDefault();
								});
							}
						})
					});
				break;
				
				case 'view' : 
					var view  = $('#entrySlider'), itemLen = view.find('div.col');
					if(itemLen.length>3){
						view.multSlider({
							itemTag : 'div.col',
							main : view.find('.inner'),		
							pageNumber : view.find('#pageNumber'),
							pageArea : view.find('#pageArea'),
							controlerLeft : view.find('#prev'),
							controlerRight : view.find('#next'),
							//autoRun : true,
							itemCount : itemLen.length
						}).init();
						view.find('#pageArea').removeClass('hidden');
					}
					
					//处理iframe 视频 图片父级p不缩进
					var entryDetails = $('div.entry-details'), iframes = entryDetails.find('iframe');
					if(iframes.length){
						var wd = entryDetails.width();
						iframes.height(wd*9/15);
						iframes.each(function(i, item){
							$(this).height(wd*0.6224).width('100%').parent().css('text-indent', 0);							
						});
					}
					
					entryDetails.find('img').each(function(){
						$(this).parent().css('text-indent', 0);				
					});
						
				break;
			
			}
		break;
	}
	
	//在线客服
	FN.feedback();
	
/*-----------模块功能结束----------*/	

});