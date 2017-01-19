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
		var id = e.get('id'), type = e.get('type'), title = '报名讲座', url = '/ajax/joinLectures', host = G.PD.get('host');		
		if(type === 'shiting'){//参加视听
			title = '参加视听',
			url = '/ajax/joinCourse';
		}
		url = 'http://'+host+url;
		G.use('Modal', {
			appendTo : 'body'
			, mask : true
			, title : title
			, cs : 'modal-apply'
			, contentHtml : 'win_lecture'
			, closeable: true
			, destroyOnClose : true
			, beforeHide : function(){
				if(this.uploader){
					this.uploader = null;
					try{
						this.uploadForm.remove();
					}catch(e){
						if(__debug) console.log('error to delete form');
					}				
				}
			}
			, onViewReady : function(){
				var jf = this.jq('#joinInfo'), view = this.jq(), that = this;
				this.jq('#close').click(function(){
					that.close();
				});
				G.use('validator', {
					form : jf
					, trigger : '#lecturebtn'
					, elements : jf.find('input')
					, onSuccess : function(data){
						var _number = jf.find('#select01').val(), uf;
						if(!that.uploader){
							uf = that.uploadForm = $(['<form  target="_blank" class="hidden" method="post">',
								'<input type="text" name="id" value='+id+'>',
								'<input type="text" name="applynum" value='+_number+'>',
								'<input type="text" name="phone" value='+data.txt_mobile+'>',
								'<input type="text" name="realname" value='+data.user+'><input type="submit" ></form>'].join('')).appendTo('body');
							that.uploader = G.use('Uploader', {
								form:uf[0],
								domain : 'gaofen.com',
								action :url || 'http://editor.wp.com/special/2013gaokaozy/test',
								onload:function(r){
									if(r.isOk()){
										jf.addClass('hidden');
										view.find('.alert').removeClass('hidden alert-error').addClass('alert-success');
										view.find('.alert .info').find('h3').html('报名成功');
										view.find('.thumb-info-details .details p:last').find('i')
										.html(parseInt(_number)+parseInt(view.find('.thumb-info-details .details p:last').find('i').html()));
									}else{
										view.find('.form').addClass('hidden');
										view.find('.alert').removeClass('hidden alert-success').addClass('alert-error');
										view.find('.alert .info').find('h3').html('报名失败');
										view.find('.alert .info').find('p').html(msg.err);
									}
								}
							});
						}else{
							var inputs = that.uploadForm.find('input');
							inputs.eq(1).val(_number);
							inputs.eq(2).val(data.txt_mobile);
							inputs.eq(3).val(data.user);
						}
						that.uploader.upload();
						return false;
					}
				});
			
			}}).play(1);
		
	}, {na : 1})
	//下载
	.reg('ddoc', function(e){
		e.lock(1);
		var src = e.src, 
			lock = false, host = 'http://'+G.PD.get('host'), isReload;
			var applyId = e.get('id'),
				type = e.get('t'),
				opt = {},
			    applyUrl = host+'/ajax/download/',
				downUrl = host+'/docs/download/';
			Req.isPayTofile(applyId, type, applyUrl, function(r){//查询文件是否已支付
				e.lock(0);
				var err = r.getError();
				if(r.isOk() || err == "高分币不够"){
					var data = r.getData(), template, state = data.state;
					if(state == 1){//已支付直接下载	
						location.reload();
						return;
					}
					if(type == 1){//高分币												
						switch(state){						
							case 2 : //高分币余额不足
								template = 'win_download2';
							break;	
							case 3 : //用高分币购买
								template = 'win_download1';
							break;							
						};
						opt = {fid : applyId};

					}else{//现金支付
						template = 'win_download3';
						opt = {	
							money : $('#usermoney').text(), 
							bookname : "《"+$('#bookName').text()+"》",
							payurl : host+'/pay/docsPay',
							fid : applyId 
						};
					}
					
					var vbox = G.use('Modal', $.extend({
						appendTo : 'body'
						, mask : true
						, title : '购买文档'
						, cs : 'modal-download'
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
										this.jq("#usecost").html(data.cost);
										this.jq(".tip_cUost").html(data.uCost);
									break;	
									case 3 : //用高分币购买
										this.jq("form").attr("action",downUrl);
										this.jq("#usecost").html(data.cost);
										this.jq('input[name="id"]').val(applyId);
										this.jq('#residue').html("您剩余高分币："+data.uCost);
										this.jq('input[name="download"]').click(function(_e){
											//G.FN.changeDownTimer();
											setTimeout(function(){location.reload();}, 1000);
											return true;
										});
									break;							
								};
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
	})
	//资料免费下载
	.reg('cand', function(e){
		FN.addFrameToDownload('http://'+G.PD.get('host')+$(e.src).attr('vrel'));
		FN.changeDownTimer();
	}, {na : 1})
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
	
	reg('null', function(e){//登录才能完成的功能
		if($.cookie('gaofen_user')){
			e.preventDefault(false);
		}
	});   
		
	
})(Gaofen, jQuery, window);
