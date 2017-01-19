/**
 * Created by zhiwen on 2015-12-10.
 * 谁和我最match
 */
"use strict";

(function($, win, G){

	var template = {
		welcomepopup : ['<div class="popup" id="wpopup">',
				    '<div class="popup-wrap">',
				        '<div class="popup-content">',
				            '<p>{.content}</p>',
				            // '<img src="http://file.gaofen.com/html/weixin/voice/img/doujihuascan.png" alt=""/>',
				        '</div>',
				        '<a class="close popup-btn" href="#">关闭</a>',
				        '<a class="turn popup-btn hidden" href="#">跳转</a>',
				    '</div>',
				'</div>'].join(''),
		areaOption : '<option value="{.value}" rel="{.index}">{.name}</option>',
		test : ['<div id="win_parent">恭喜！你已获奖！请留下你的手机号码等候工作人员联系！<br /><div class="input-wrap"><input type="tel" placeholder="输入手机号，登记报名" class="tel" id="tel"/><input type="submit" class="btn popup-btn popup-submit" value="提交" id="btn"/></div>',
        	'<div class="post-message hidden" id="msg"><i>!</i><span>提交失败，请重新输入手机号</span></div></div>'].join(''),

        egg : ['<div class="box"><img class="box-bg" src="http://file.gaofen.com/html/weixin/voice/img/box-bg.jpg" alt="">',
	        		'<div class="box-content"><p class="note ms-yh">恭喜您获得一次砸金蛋机会，砸开有惊喜！</p>',
					'<div seed="trip_hammer" class="hammer hmanim">',
					    '<img src="http://file.gaofen.com/html/weixin/voice/img/hammer.png" alt=""/>',
					'</div>',
					'<div class="quan">',
					    '<img src="http://file.gaofen.com/html/weixin/voice/img/quan-not.png" alt="" smartracker="on">',
					'</div>',
					'<div class="egg">',
					    '<img src="http://file.gaofen.com/html/weixin/voice/img/egg-good.png" alt="" class="egg-good"/>',
					    '<img src="http://file.gaofen.com/html/weixin/voice/img/egg-bad.png" alt="" class="egg-bad">',
					'</div></div></div>',
					// '<div class="tl hidden" id="area_school"><div>所属校区：</div>',
					// 	'<select name="area"></select><select name="school"><option value="">请选择</option></select>',
					// '</div>',
					'<div class="tl" id="winText">抽奖奖品：200个小黄人公仔，100元、200元卓越一对一代金券(<a href="/huodong/weixin_match_teacher/rule">领取说明</a>)</div>',
					'<div class="tl">如有疑问请咨询卓越教育微信管理员</div>',
					// 	'<input type="tel" placeholder="输入手机号，登记报名" class="tel" id="tel"/><input type="submit" class="btn popup-btn popup-submit" value="提交" id="btn"/></div>',
     //    				'<div class="post-message hidden" id="msg"><i>!</i><span>提交失败，请重新输入手机号</span></div>',
				].join('')	
	};


	var areas = [
		{
		   name : '请选择',
		   value : ''
		},{
			name : '广州',
			value : '7FW2',
			opts  : [{"name":"请选择","value":""},{"name":"宝岗大道（一对一）","value":"B9y8"},{"name":"岗顶（一对一）","value":"1vcb"},{"name":"农讲所（一对一）","value":"khGL"},{"name":"龙珠路（一对一）","value":"Rvsy"},{"name":"云山大道（一对一）","value":"IHMB"},{"name":"黄埔（一对一）","value":"gV7E"},{"name":"汇侨（一对一）","value":"49Qz"},{"name":"机场路（一对一）","value":"P5hC"},{"name":"江南大道（一对一）","value":"BhrO"},{"name":"丽影广场（一对一）","value":"yLD4"},{"name":"荔城富鹏（一对一）","value":"suxx"},{"name":"鹭江（一对一）","value":"PoP5"},{"name":"洛溪（一对一）","value":"WuJg"},{"name":"区庄（一对一）","value":"HEfZ"},{"name":"市桥大北路（一对一）","value":"z7fy"},{"name":"体育中心（一对一）","value":"EO8C"},{"name":"同和梅花园（一对一）","value":"5fQX"},{"name":"五羊新城（一对一）","value":"RU8r"},{"name":"西村（一对一）","value":"dz3N"},{"name":"新塘（一对一）","value":"4iHS"},{"name":"中山七（一对一）","value":"4ejF"},{"name":"东山口（一对一）","value":"J4g4"},{"name":"沙园（一对一）","value":"942X"},{"name":"车陂（一对一）","value":"MGYc"},{"name":"市二宫（一对一）","value":"TnU7"},{"name":"金沙洲（一对一）","value":"M2lO"},{"name":"芳村（一对一）","value":"GO5x"},{"name":"小北（一对一）","value":"iSSV"},{"name":"人和（一对一）","value":"zwnF"},{"name":"锦东（一对一）","value":"XjYi"},{"name":"新塘教学中心","value":"4v4I"},{"name":"荔城富鹏教学中心","value":"wShw"}]
		},{
			name : '佛山',
			value : 'VarH',
			opts  : [{"name":"请选择","value":""},{"name":"东建世纪广场（一对一）","value":"qNOD"},{"name":"城市广场（一对一）","value":"Wqtp"},{"name":"乐从（一对一）","value":"CiQP"},{"name":"黄岐（一对一）","value":"J7LK"},{"name":"亲仁（一对一）","value":"KNca"}]
		},{
			name : '东莞',
			value : 'T2MR',
			opts  : [{"name":"请选择","value":""},{"name":"国泰大厦（一对一）","value":"ueE4"},{"name":"新世界花园（一对一）","value":"dKxI"},{"name":"景湖花园（一对一）","value":"2Lnr"},{"name":"厚街明丰广场（一对一）","value":"F4Dn"}]
		},{
			name : '深圳',
			value : 'gAXI',
			opts  : [{"name":"请选择","value":""},{"name":"香蜜湖（一对一）","value":"2VuP"},{"name":"石厦（一对一）","value":"amcm"},{"name":"莲花北中心（一对一）","value":"SrPJ"},{"name":"海王（一对一）","value":"XlRn"},{"name":"宝安（一对一）","value":"bZYN"},{"name":"百花（一对一）","value":"yngK"},{"name":"桃源（一对一）","value":"zSRS"}]
		},{
			name : '中山',
			value : 'Ndaf',
			opts  : [{"name":"请选择","value":""},{"name":"竹苑（一对一）","value":"uAfm"},{"name":"恒基（一对一）","value":"0ZAN"},{"name":"体育路（一对一）","value":"HuuR"},{"name":"西区华庭（一对一）","value":"tUWb"}]
		}
	];

	var getSelected = function(select){
		return select.find('option').not(function(){ return !this.selected });
	};

	var Egg = function(){

    	var renderOpt = function(items){
    		var options = [];
    		$.each(items, function(i, item){
    		options.push(G.util.parse(template['areaOption'], {
	    			name : item.name,
	    			value : item.value,
	    			index : i
	    		}));
	    	});
    		return options;
    	};

    	var wpopup = G.FN.popup('win', template['egg'], true), lock = false,
    	    trip_egg = wpopup.find('.egg');

    	trip_egg.on('click', function(e){
    		if(lock) return;
    		lock = true;
    		wpopup.find('.hammer').removeClass('hmanim');
    		G.Ajax.send(G.PD.get('uri').prize,{}, function(res){
    			if($.type(res) !== 'object'){
			       res = JSON.parse(res);
			    }
			    if(res.errno == '0'){				    	
	    			trip_egg.addClass('open');
		    		wpopup.find('.quan').addClass('quan-show');
		    		wpopup.find('.quan>img').attr('src',res.rst.giftimg);
		    		if(res.rst.isWinnging){
		    			wpopup.find('#winText').html(res.rst.winhtml);

				    	var area_school = wpopup.find('#area_school'), options = [], sels = area_school.find('select');

				    	sels.eq(0).html(renderOpt(areas).join('')).on('change', function(e){
				    		var index = getSelected($("select").eq(0)).index();
				    		var opts = [];
				    		if(index === 0){
				    			opts = renderOpt([{
				    				name : '请选择',
				    				value : ''
				    			}]);
				    		}else{
				    			opts = renderOpt(areas[index].opts);
				    		}
				    		sels.eq(1).html(opts.join(''));
				    	});
		    			phoneBtn(wpopup);
		    			// wpopup.find('#area_school').display(1);
		    		}
		    		wpopup.find(".quan").css({width: '50%', left : '25%'}).animate({bottom: "28%",opacity:'1.0'},"slow")
		    		wpopup.find('.hammer').display(0);
		    		
		    	}else if(res.errno == '100001'){
	        		location.href = G.PD.get('uri').login;
	        	}else{
	        		alert(res.err||'操作失败！');
	        	}
    		})

    	});
	};



	//图片延迟加载
    var lazyload = function(view, match){
        var imgs = [],
            wh = $(window).height(),
            obj = {
                resetImg : function(){//列表再次加载或者分页情况
                    imgs = [];
                    getImgs();
                }
            };

        var getImgs = function(){
            var _imgs = view.find(match);
            $.each(_imgs, function(i, item){
                var jqItem = $(item);
                if(!jqItem.attr('src')){
                    var top = jqItem.offset().top;
                    imgs.push({
                        o : jqItem,
                        top : top
                    })
                }
            });
        }
        var reader = function(scrollTop){
        	var maxDel = [];
        	getImgs();
            $.each(imgs, function(i, item){
                if(!item.o.attr('src') && item.top <= scrollTop){      	
                    var img = item.o;
                    img.attr('src', img.attr('_src'));
                }
            });
        };

        //初始化
        (function(){
            $(window).scroll(function(){
                var sh = $(this).scrollTop();
                reader(sh+wh);
            }).trigger('scroll');
        })();

        return obj;
    }


	var phoneBtn = function(jqpop){
			var lock = false, btn = jqpop.find('#btn'), jqmsg = jqpop.find('#msg'), ipt = jqpop.find('#tel');
				btn.on('click', function(e){
					e.preventDefault();
					jqmsg.display(0);
					if(lock) return;					
					var tel = $.trim(ipt.val()), sels = $('#area_school select');
					var _area =  getSelected(sels.eq(0)).val(), _scholl =  getSelected(sels.eq(1)).val();
					if(_area === '' || _scholl === ''){
						jqmsg.display(1).find('span').text('请选择校区');
						return;
					}
					var venueAddr = getSelected(sels.eq(0)).text()+'-'+getSelected(sels.eq(1)).text();
					if(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(tel)){
						lock = true;
						G.Ajax.send(G.PD.get('uri').submitinfo, {
							phone : tel,
							venueAddr : venueAddr
						}, function(res){
							if($.type(res) !== 'object'){
				        		res = JSON.parse(res);
				        	}
				        	
				        	if(res.errno == '0'){
				        		jqpop.find('#win_parent').html('<b>手机登记成功</b>');
				        	}else{
				        		jqmsg.display(1).find('span').text(res.err || '提交失败');
				        	}
				        	lock = false;
						})
					}else{
					    if(tel !== ''){
					    	jqmsg.display(1).find('span').text('请正确输入手机号');
					    }
						ipt.focus();
					}
				});
			}


	G.FN = {
		 getCookie : function(name){
			var arg = name + "=", alen = arg.length, clen = document.cookie.length, i = 0;
	        while (i < clen) {
	            var j = i + alen;
	            if (document.cookie.substring(i, j) == arg) {
	                return this._getValue(j);
	            }
	            i = document.cookie.indexOf(" ", i) + 1;
	            if (i == 0) break;
	        }
	        return "";
		 },
		//显示提示层，mustShow为必需显示
		popup : function(key, content, mustShow){
			if(localStorage.getItem(key) && mustShow !== true) return;
			if($.type(content) === "string") content = {'content' : content};
			var jqpop = $(G.util.parse(template.welcomepopup, content)).appendTo('body');
			jqpop.find('.close').on('click', function(e){
				e.preventDefault();
				jqpop.remove();
			});
			if(mustShow !== true)localStorage.setItem(key, 1);
			phoneBtn(jqpop);
			return jqpop;
		},
		compareEnd : function(score, msg){
			$('#wrap').addClass('wrap-end');
			var copywriters = $('.copywriter');
			copywriters.addClass('copywriter-end');
			if(msg){
				copywriters.text(msg);
			}
			var contentwrap = $('.content-wrap');
			contentwrap.addClass('content-wrap-end').find('.teacher').addClass('teacher-end');
			if($('#pkmatch').length){
				$('#pkmatch').display(1);
			}else{
				contentwrap.find('.pk').addClass('pk-match tc').text(score);
			}
			
			contentwrap.find('.student').addClass('student-end');
			$('.pic-for').display(0);
			$('#canvas').display(1);			
			fireworks();
		}
	}


	/*---------------- 事件定义 -----------*/
	G.actions.reg('like', function(evt, obj){
		var dom = $(obj.target), id = obj.id, type = obj.type, target = dom.children('.like').length ? dom.children('.like') : dom;
		if(!target.hasClass('icon-like-hand') || dom.hasClass('active')) return;
		dom.data('lock', 1).addClass('active');
		setTimeout(function(){
			dom.removeClass('active');
		}, 150);
		G.Ajax.send(G.PD.get('uri').dofav, {
			id : id
		}, function(res){
			dom.data('lock', 0);
			if($.type(res) !== 'object'){
        		res = JSON.parse(res);
        	}
        	if(res.errno == '0'){
				// var dofav = localStorage.getItem('match-dofav5'), now = (+new Date + '').substr(0,5);
				// if(dofav){
				// 	dofav = JSON.parse(dofav);
				// 	if(dofav.now === now ){
				// 		if(dofav.times < 1){
				// 			Egg();
				// 			localStorage.setItem('match-dofav5', JSON.stringify({now: now, times : ++dofav.times}));
				// 		}
				// 	}else{
				// 		Egg();
				// 		localStorage.setItem('match-dofav5', JSON.stringify({now: now, times : 1}));
				// 	}
				// }else{
				// 	Egg();
				// 	localStorage.setItem('match-dofav5', JSON.stringify({now: now, times : 1}));
				// }
        		if(type === 'view'){//详细页
        			target.removeClass('icon-like-hand').text('已点赞');
        			return;
        		}
        		var parent = dom.parent();
				var total = parent.find('.total').text();
				dom.addClass('had-like');
				target.removeClass('icon-like-hand')
				.text('已点赞')
				.parent().find('.total').text(Number(total)+1);
				
        	}else if(res.errno == '100001'){
        		location.href = G.PD.get('uri').login;
        	}else{
        		alert(res.err||'操作失败！');
        	}
		})
	});


	$(function(){
		var router = G.PD.get('router');
		if(router === 'index'){
			router = $('#pkmatch').length ? 'matchresult' : 'index';
		}
		switch(router){
			case 'index':
				var sharebtn = $('#sharebtn');
				if(sharebtn.length === 0) return;
				var face1 = G.PD.get('face1'), teacherbtn = $('#teacherbtn'), uploading = false,
					uris = G.PD.get('uri'), uploadingDom = null,
					studentbtn = $('#studentbtn'), jqface1 = $('#face1'), jqface2 = $('#face2'),
					waitting  = $('#waitting'),
					staticFn = function(p, text){
						waitting.display(p);
						if(p){
							waitting.find('p').text(text || '正在上传中...');
						}
					};
				if(face1){
					jqface1.attr({'src':face1,'vrel':face1});
					studentbtn.display(1);
				}
				teacherbtn.display(!face1);

				$('#teacherbtn, #studentbtn').on('click', function(e){
					e.preventDefault();
					uploadingDom = e.target.id === 'teacherbtn' ? jqface1 : jqface2;
					$("#uploadfile").trigger('click');
				});

				$('#reset').on('click', function(e){
					location.reload();
				})

			    var _upload = new html5Upload({
			        fileType : ['jpg','gif','png'],//[jpg,gif,png] //允许上传格式（*表示都可以上传）
			        fileInput: $("#uploadfile").get(0),
			        url : uris.uploadface,
			        fileObject : 'file',
			        autoUpload : true, //是否自动上传
			        maxSize : 5120000,
			        outSize : '大小不能超过5M',
			        afterOneSuccess : function(file, response){
			        	staticFn(0);
			        	uploadingDom.attr('vrel', response.rst.uri);
		            	var reader = new FileReader();
		                reader.onload = function(e) {
		                    uploadingDom.attr('src', e.target.result);
		                }
		                reader.readAsDataURL(file);	  
		                if(uploadingDom.attr('id') === 'face1'){
		                	teacherbtn.display(0);
		                	studentbtn.display(1);
		                }else{
		                	staticFn(1, '对比中...');
		                	studentbtn.display(0);
		                	//对比
		                	G.Ajax.send(uris.compare, {
		                		face1 : jqface1.attr('vrel'),
		                		face2 : jqface2.attr('vrel')
		                	}, function(r){
		                		staticFn(0);
		                		r = $.parseJSON(r);
		                		if(r.errno == '0'){
		                			win.history.pushState(null, null, r.rst.url);
		                			G.FN.compareEnd(r.rst.similarity, r.rst.tips);
		                		}else{
		                			alert(r.err);
		                			$('#reset').display(1);
		                		}
		                	}, 'post');
		                }       
			        },
			        beforeUpload : function(formData){
			            uploading = true;
			        },
			        uploadReady : function(){
			        	if(this.fileFilter.length > 0)
			        		staticFn(1);
			        },
			        removeUploadFail : function(){
			        	staticFn(0);
			        },
			        onComplete: function() {	        	
			            this.fileInput.value = '';
			            uploading = false;
			        }
			    });
			break;
			case 'matchresult' : //显示比较结果
				G.FN.compareEnd('');
			break;
			case 'view' :			
				G.event();
			break;
			case 'list' : //列表页
				G.event();
				// Egg();
				/*------搜索-------*/
				var searchBox = $('#searchBox');
				new Gaofen.cls['AutoInput']({
					initReady : function(){},
					view : searchBox,
					autoPanel : '',
					autoJump : true,
					delay:1000,
		            uri : G.PD.get('uri').search+'?k=',
		            input : searchBox.find('input'),
		            floatCs	  : '.search-result',
		            // removeFloat : function(e){
		            // 	alert('1')
		            // },
		            max : 5,
		            itemTemp : '<li rel="{.id}"><a href="{.link}" >{.nickname}&{.name}</a></li>',
				});
				/*------搜索结束-------*/

				var page = 0, 
					loadding = false, allPage = 1000,//设一个无限大的数
					showLoad = function(p){
						loadding = p;
						$('#loading').display(p);
						if(p){
							var len = $('.main-wrap').children().length;
							G.Ajax.send(G.PD.get('uri').moresection, {
								page : ++page
							}, function(res){
								if($.type(res) !== 'object'){
					        		res = JSON.parse(res);
					        	}
								if(res.errno == '0'){
									var html = res.rst.html;									
									$('.main-wrap').append(res.rst.html);
									if(html == ''){//已没有数据时隐藏下拉
										allPage = page;
										$(window).unbind('scroll', nextPage);
									}else{
										var childs = $('.main-wrap').children(), newLen = childs.length, dels = [];
										for(var i = len;i<newLen;i++){
											var alink = childs.eq(i).find('a.show').attr('href');
											for(var j=0;j<len;j++){
												var _alink = childs.eq(j).find('a.show').attr('href');
												if(_alink && _alink === alink){
													$('.main-wrap').children().eq(i).remove();
													childs.splice(i,1);
													newLen--;
													i--;
													break;
												}
											}
										}
									}
								}
								showLoad(false);
							});
						}else{
							// if(page < allPage){
							// 	$('#moreList').display(1);
							// }
						}
					};


				var nextPage = function(){
						if(allPage > page && loadding === false ){
							var scroll = $('body').scrollTop(), bh = $('html').height(), wh = $(window).height();
							if(scroll + wh + 100 > bh){
								showLoad(true);
							}
						}
				}
				if(allPage > page){	
					$(window).on('scroll', nextPage);
				}

				lazyload($('div.main-wrap'), 'img.user-header');
			break;
		}

		var config = {};
		try{
			var shareData = G.PD.get('shareData');
			if(typeof shareData !== 'object'){
				shareData = JSON.parse(shareData);
			}		
			config = {
				title: shareData.title, // 分享标题
			    desc: shareData.desc || shareData.title, // 分享描述
			    link: location.href, // 分享链接
			    imgUrl: shareData.img // 分享图标
			}	
		}catch(e){}
		GWX.wxready(config);

		// G.FN.popup('win', template['test'], true);
	});

	


})(Zepto, window, Gaofen);