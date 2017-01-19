/**
 * Created by zhiwen on 2015-04-24.
 * teacherfront 选师前台功能
 */
"use strict";

(function(G, Vue, win){
	var path = window.location.pathname;
	if(!/\/$/.test(path)){
	   window.location.href = window.location.href.replace(path, path+'/');
	   return;
	}

    Vue.config.debug = true;

    var Ajax = G.Ajax.request,
    	localReq,
    	domain = 'http://m.gaofen.com/';

    //单页路由
    var Hash = (function(){
        var href = win.location.href, hash = win.location.hash;
        var obj = {
            getRouter : function(){
                return win.location.hash;
            },
            getHash : function(){
                var hash = location.hash.replace('#','');
                if(hash === ''){
                    hash = G.PD.get('router') === 'index' ? 'home' : 'home';
                }
                return hash;
            },
            setHash : function(_hash){
                hash = _hash;
                location.hash = hash;
            }
        };
        return obj;
    })();


    //共用部分
    var mixin = {
        watch : {
            'partShow' : function(v, oldv){
                if(v && !this.$get('render')){
                    this.$set('render', true);
                    this.$emit('readyInit');
                }
                if(v){
                	makeGa.ga('open', 'page-'+this.router);
                }
            }
        },
        ready : function(){
            this.$emit('routerfn'); 
        },
        events : {
            readyInit : function(){
            },
            routerfn : function(){
                this.$on('router', function(e){
                    var router = this.$get('router');                   
            		loading.isloaded = false;
                    if(router.indexOf('&') === -1 && e.router.indexOf('&') === -1){
                        this.$set('partShow', e.router === this.$get('router'));
                    }else{
                        router = router.split('&');
                        var _router = e.router.split('&')[0];
                        var show = false;
                        for(var i=0;i<router.length;i++){
                            if(_router === router[i]){
                                show = true;
                                break;
                            }
                        }
                        makeGa.ga('open', 'page-'+e.router);
                        this.$set('partShow', show);
                    }
                })
            }
        },
        data : {
        	wxisReady : false,
            ajaxLoad : false,
            render : false,//是否
            partShow : false,
            transitionName: 'fade'
        },
        getTopItem : function(items, num){
            num = num || 3;
            var newItems = [];
            for(var i=0, len = items.length;i<len;i++){
                if(i < num ){
                    newItems.push(items[i]);
                }else{
                    break;
                }
            }
            return newItems;
        },
        getOtherItem : function(items, num){
            num = num || 3;
            var newItems = [];
            for(var i=0, len = items.length;i<len;i++){
                if(i >= num ){
                    newItems.push(items[i]);
                }else{
                    break;
                }
            }
            return newItems;
        },
        showTips : function(isShow, err){//显示提示信息
            if(isShow){
                alert(err);
            }
        }
    };


    //提示框组件
    var Popup = function(id, mixin){
        var popup = new Vue({
            el : id||'#popup-rule',
            mixins : mixin ? [mixin] : [],
            watch : {
            	'isShow' : function(v, ov){
            		if(v === false){
            			this.$options.events.afterClose();
            		}
            	}
            },
            methods : {
                close : function(){
                    this.isShow = false;
                }

            },
            events : {
            	afterClose : function(){
            	}
            },
            data : {
                isShow : true,
                transitionName: 'fade'
            }
        });
        return popup;
    };


	var screenlist = Vue.extend({
		props : ['sLists'],
	  	template: '#srceen-template'
	})

	Vue.component('screen-list', screenlist);

    //学校列表
    var recentLists = Vue.extend({
      props: ['recentLists'],
      methods : {
        preview : function(id, evt){
            evt.preventDefault();
            this.$dispatch('child-msg', {type:'detail', id:id});
        },
        markfav : function(id, index){
            this.$dispatch('child-msg2', {type:'home', id:id, index : index});
        }
      },
      template : '#school-template'
    });
    Vue.component('school-lists', recentLists);

    //学校列表2
    var schoolLists2 = Vue.extend({
      props: ['schoolLists'],
      methods : {
        preview : function(id, evt){
            evt.preventDefault();
            this.$dispatch('child-msg', {type:'detail', id:id});
        },
        markfav : function(id, index){
            this.$dispatch('child-msg2', {type:'home', id:id, index : index});
        }
      },
      template : '#otherschool-template'
    });
    Vue.component('otherschool-lists', schoolLists2);


    //点赞
    var topLists = Vue.extend({
      props: [ 'topLists'],
      methods : {
        preview : function(id, evt){
            evt.preventDefault();
            this.$dispatch('child-msg', {type:'detail', id:id});
        },
        markfav : function(id, index){
            this.$dispatch('child-msg2', {type:'home', id:id, index : index});
        }
      },
      template : '#topuserLists-template'
    });
    Vue.component('top-lists', topLists);


    //点赞
    var topotherLists = Vue.extend({
      props: [ 'topotherLists'],
      template : '#topotherLists-template'
    });
    Vue.component('topother-lists', topotherLists);


    //最新点赞
    var recentHeads = Vue.extend({
      props: [ 'recentLists'],
      methods : {
        preview : function(id, evt){
            evt.preventDefault();
            this.$dispatch('child-msg', {type:'detail', id:id});
        }
      },
      template : '#recenthead-template'
    });
    Vue.component('recent-lists', recentHeads);
    

	var makeGa;
        //dom加载完成后调用
    var readyFn = function(_router, noInit){
        //google 数据
        makeGa = (function(){
            // if(typeof ga === 'undefined'){
            //  return {
            //      ga : function(){
            //          console.log(arguments);
            //      }
            //  }
            // }

            return {
                ga : function(eventAction/*-open dialog-*/, eventLabel, eventValue, obj){
                    try{
                        dataLayer.push({
                            'event': 'GAEvent', 
                            'eventCategory': 'ZKAO16', 
                            'eventAction': eventAction,
                            'eventLabel': eventLabel,
                            'eventValue': eventValue||''                           
                        });
                    }catch(e){}
                }
            }
        })();


        var router = _router || G.PD.get('router'), setTimer = null;

        var api = G.PD.get('api');
   //      api = {
   //      	comment:"http://dev.fake.gaofen.com/huodong/weixin_zhongkao_index/comment/",
			// getschcool:"http://dev.fake.gaofen.com/huodong/weixin_zhongkao_index/getschool/",
			// home:"http://dev.fake.gaofen.com/huodong/weixin_zhongkao_index/home/",
			// imageUpload:"http://dev.fake.gaofen.com/huodong/weixin_zhongkao_index/imageUpload/",
			// markfav:"http://dev.fake.gaofen.com/huodong/weixin_zhongkao_index/markfav/",
			// jsConfig : api.jsConfig,
			// school:"http://dev.fake.gaofen.com/huodong/weixin_zhongkao_index/school/"
   //      }
        // localReq = 'http://dev.fake.gaofen.com/';
        var issuccess = true, regTime = 0;
        var regWx = function(obj){
            GWX.wxready({debug : false}, function(e){
                // self.isAllowUpload = true;
                if(issuccess){
	                obj.wxjdkready = true;
	                obj.$broadcast('schoolapp-ready');
	                var wxerror = document.getElementById('wxerror');
            		if(wxerror){
                		wxerror.style.display = 'none';
                    }
                }else{
                	if(++regTime < 15){               		
                		var wxerror = document.getElementById('wxerror');
                		if(wxerror){
                    		wxerror.style.display = 'block';
                    		wxerror.innerHTML = regTime;
                         }
                		regWx(obj);
                	}		    			
                	
                }
            });
        }

        var app = new Vue({
            el : '#schoolapp',
            ready : function(){
                var self = this;
        		Ajax(api.jsConfig, {
			    	data : {link : win.location.href},
                    success : function(res){                                           
                        if(res.errno == '0'){  
                           	G.PD.set({wxconfig: res.rst.config});
			                wx.error(function(res){			    				    		
						    	issuccess = false;	
						    });	
						    if(res.rst.config.length !== 0)
                            	regWx(self);        
                            else{
                            	var wxerror = document.getElementById('wxerror');
                            	if(wxerror){
                            		wxerror.style.display = 'block';
                            		wxerror.innerHTML = '0';
                            	}
                            }
                        }else{
                            // self.$options.showTips(1, res.err);
                        }
                    }
			    })
                setTimeout(function(){
                    self.$emit('fire');
                },30);
                this.$on('hashchange', function(obj){                   
                    self.$emit('fire', obj);
                });
                win.addEventListener('hashchange', function(){//按左上角返回时解发，为了避免正常跳转时多次触发用setTimeout                  
                    setTimer = setTimeout(function(){self.$emit('fire');}, 20);
                }, false);
            },
            showTips : function(t, msg){
            	if(t) alert(msg);
             },
            events : {
                fire : function(obj){
                    var router = Hash.getHash();
                    if(obj && obj.myrouter){
                        router = obj.myrouter;
                    }
                    if(router.indexOf('home') == -1 && router.indexOf('detail') == -1 && router.indexOf('share') == -1 && router.indexOf('build') == -1 ){
                    	router = 'home';
                    }
                    app.$broadcast('router', {
                        router : router,
                        data : obj
                    });
                    setTimeout(function(){clearTimeout(setTimer);}, 10);
                },
                getHomeData : function(fn, url){
                    // if(this.homeData){
                    //     fn && fn(this.homeData);
                    //     return;
                    // }
                    var self = this;
                    Ajax(url || api.home,{
                            data : {},
                            success : function(res){   
                            	loading.isloaded = false;                                          
                                if(res.errno == '0'){ 
                                        self.homeData = res.rst; 
                                        fn && fn(res.rst);                                      
                                }else{
                                	
                                    self.$options.showTips(1, res.err);
                                }
                            },
                            failure : function(xhr){
                                // self.$options.showTips(1, '请求失败！');
                            }
                        }
                    );
                },
                getSchoolById : function(id, fn){
                	var self = this, url = api.school;
                    Ajax(url,{
                            data : {m: id},
                            success : function(res){  
                            	loading.isloaded = false;                                      
                                if(res.errno == '0'){  
                                        fn && fn(res.rst);                                      
                                }else{                           
                                    self.$options.showTips(1, res.err);
                                    fn && fn('');
                                }
                            },
                            failure : function(xhr){
                                // self.$options.showTips(1, '请求失败！');
                            }
                        }
                    );
                },
                getSchoolIdByName : function(name, fn){
                	var self = this, url = api.getschool;
                    Ajax(url,{
                            data : {name: name},
                            success : function(res){                                           
                                if(res.errno == '0'){  
                                    fn && fn(res.rst);                                      
                                }else{
                                    // self.$options.showTips(1, res.err);
                                }
                            }
                        }
                    );
                },
                markfav : function(sid, fn){
                	var self = this, url = api.markfav;               	
                    Ajax(url,{
                            data : {m: sid},
                            success : function(res){   
                            	loading.isloaded = false;                                     
                                if(res.errno == '0'){  
                                    fn && fn(res.rst);                                      
                                }else{                               	
                                    fn && fn();
                                    self.$options.showTips(1, res.err);
                                    // self.$options.showTips(1, res.err);
                                }
                            },
                            failure : function(xhr){
                                self.$options.showTips(1, '请求失败！');
                            }
                        }
                    );
                },
               	comment : function(txt,sid, t, fn){
                	var self = this, url = api.comment;
                	loading.isloaded = true;
                    Ajax(url,{
                            data : {m: sid, text: txt, t : t},
                            success : function(res){
                            	loading.isloaded = false;                                           
                                if(res.errno == '0'){  
                                    fn && fn(res.rst);
                                    // window.scrollTo(0,0);                                      
                                }else{
                                    // self.$options.showTips(1, res.err);
                                }
                            }
                        }
                    );
                },
            },

            data : {
            	isShowPrize : false,
            	wxjdkready : false,
                homeData : null,
                status : null
            }
        });  

        var loading = new Vue({
        	el : '#loading',
        	data : {
        		isloaded : false
        	},
        	load : function(status){
        		if(status != undefined) 
        			this.isloaded = status;
        		else return this.isloaded;
        	}
        });

		var homePage = new Vue({
            el : '#s_index',
            parent : app,
            mixins: [mixin],
            watch : {
            	'isShowSearch' : function(v, ov){
            		if(v === false){
            			this.insertSchool = '';
            			document.getElementById('auto-input').style.display = 'none';
            		}else{
            			this.uploadImgText = '上传母校图片';
            			this.localIds = '';
            		}
            	},
            	'partShow' : function(v){
            		if(v === true){
            			if(app.wxjdkready){           			    
            			    this.$emit('shareReady');
            			}else{
            				this.$on('schoolapp-ready', function(){
            					this.$emit('shareReady');
            					// this.$options.events.shareReady();
            				});
            			}
            		}
            	},
            	'recent' : function(v){
            		clearTimeout(this.recentTimer);
            		var index = 0, self = this, len = this.recent.length,
            		showUser = function(){
            			if(index >= len) index = 0;
            			self.recentUser = self.recent[index];
            			index++;
            			if(len > 1)
	            			self.recentTimer = setTimeout(function(){
	            				showUser();
	            			}, 2500);
            		};
            		showUser();
            	}
            },

            events : {
            	shareReady : function(){
            		this.wxisReady = true;
            		var title = '我为母校中考加油！我自豪，我点赞！', desc = title;
					var info = {
						    title: title, // 分享标题
						    desc: desc, // 分享描述
						    type : 8
						},

						info2 = {
						    title: title, // 分享标题
						    desc: desc, // 分享描述
						    type : 9
						};
            		share(info ,info2);
            	},
            	setEndtime : function(_endTime){
            		var self = this;
            		var costTime = function(endTime){
						var day = endTime/(60*60*24);
						if(day>= 1){
						  day = Math.floor(day);
						  endTime = endTime - 60*60*24*day;
						}else{
						    day = 0;
						}
						var hour = endTime/(60*60);
						if(hour >= 1){
						    hour = Math.floor(hour);
						    endTime = endTime - 60*60*hour;
						}else{
						  hour = 0;
						}

						var minute = endTime/(60);
						if(minute > 0){
						    minute = Math.ceil(minute);
						}else{
						  minute = 0;
						}
						self.endTime = {
							day : day,
							hour : hour,
							minute : minute
						}
						// console.log(self.endTime);
						if(endTime > 60000)
	            			setTimeout(function(){
	            				_endTime -= 60;
	            				costTime(_endTime);
	            			}, 60000);
            		}
            		costTime(_endTime);
            	},
            	getListData : function(fn){
            		var self = this;
                    this.$parent.$emit('getHomeData', function(res){

                    	self.$emit('setfavStatus', res.rank.total, function(r){
                    		self.totalLists = r;
                    	}, 'total');
                    	self.$emit('setfavStatus', res.rank.today, function(r){
                    		self.todayLists = r;
                    	}, 'today');
                    	self.$emit('setfavStatus', res.rank.recent, function(r){
                    		self.recentListrender = r;
                    		for(var i=0;i<r.length;i++)                				
                    			self.recentLists.push(r[i]);
                    	});

                    	self.schools = res.school;

                    	self.recent = res.recent;

                    	// self.endTime = res.endTime;
                    	if(res.time){
                    		self.$emit('setEndtime', res.time);
                    	}

                    	if(res.notify && res.notify.type){
                    		if(res.notify.type === "lucky"){
                    			winnerInfo.prize = '幸运奖';
                    			winnerInfo.prizeDetail = '50元京东购物卡';
                    		}else if(res.notify.type === "first"){
                                winnerInfo.prize = '总冠军校园大队长';
                                winnerInfo.prizeDetail = '价值2500元的Apple Watch Sport智能手表';
                            }else if(res.notify.type === "second"){
                                winnerInfo.prize = '总亚军校园大队长';
                                winnerInfo.prizeDetail = '价值1200元的Kindle全新升级版6英寸';
                            }else if(res.notify.type === "third"){
                                winnerInfo.prize = '总季军校园大队长';
                                winnerInfo.prizeDetail = '价值500元的手机充值卡';
                            }else{
                    			winnerInfo.prize = '校园奖';
                    			winnerInfo.prizeDetail = '100元京东购物卡';
                    		}

                    		winnerInfo.isShowPrize = true;
                    	}

                    	fn && fn(res);

                    });
            	},
                readyInit : function(){
		            var self = this;
		            loading.isloaded = true;
		            this.$emit('getListData', function(res){

		            	var winner = res.winner, len = winner.length, winHtml =[];
		            	if(len){
		            		self.isShowReward = true;
                            if(len > 2) len = 2;
		            		for(var i=0;i<len;i++){
		            			winHtml.push(winner[i]);
		            		}
		            		self.winneruser = winHtml.join('');
		            		var adText = document.getElementById('ad-text'), lennum = 0;
		            		adText.innerHTML = winHtml.join('');
                            if(allWinnerBox.winnerHTML === ''){
                                allWinnerBox.winnerHTML = winner.join('');                                
                            }
                            allWinnerBox.isShowWinner = true;
                        }

                    	loading.isloaded = false; 
                    	var autoComplete = new AutoComplete('ranking','auto-input',self.schools);
					    $('ranking').oninput = function(evt){
					        autoComplete.start(evt);
					    }

                    });

                    this.$on('child-msg2', function(obj){
                    	self.$emit('markfav', obj.id, obj.index);
                    })

            	},
                markfav : function(id, index){
            		loading.isloaded = true;
            		var self = this;
            		this.$parent.$emit('markfav', id, function(r){
            			loading.isloaded = false;
            			self.$emit('setfavStatus', index, function(item){
            				item.fav_num_total = Number(item.fav_num_total)+1;
            				item.fav_num = Number(item.fav_num)+1;
            				item.fav = Number(item.fav)+1;
            				if(r && self.navType !== 'recent' && index !== 0){
            					var per = self.schoolLists[0].fav;

            					item.percent = 100*item.fav/per+'%';
            				}
            			});
            		});
            	},
            	setfavStatus : function(data, fn, type){
            		var self = this;
	            	if(typeof data == "string" || typeof data == "number" ){
	            		var itemData = null;
	            		if(this.navType === 'recent'){
	            				this.recentListrender[data].favcs = 'active';
	            				itemData = this.recentListrender[data];
	            				self.recentLists = [];
	            					setTimeout(function(){
	            						self.recentLists = self.recentListrender;
	            						fn && fn(itemData);
		            				},0);
	            			}else{
	            				if(this.navType === 'today'){
		            				this.todayLists[data].favcs = 'active';
		            				this.schoolLists = [];
		            				setTimeout(function(){
		            					self.schoolLists = self.todayLists;
		            					fn && fn(itemData);
		            				},0);
		            				itemData = this.todayLists[data];
		            			}else{
		            				this.totalLists[data].favcs = 'active';
		            				self.schoolLists = [];
		            				itemData = this.totalLists[data];
		            				setTimeout(function(){
		            					self.schoolLists = self.totalLists;
		            					fn && fn(itemData);
		            				},0);		            				
		            			}
	            			} 
	            	}else{
	            		var perNum = 0;
	            		for(var i=0,len = data.length;i<len;i++){
	            			if(type && (type === 'today' || type === 'total')){
	            				if(i === 0){
	            					data[i].percent = '100%';
	            					perNum = type === 'today' ? data[i].fav_num : data[i].fav_num_total;
	            					data[i].fav = perNum;
	            				}else{
	            					if(type === 'today'){
	            						data[i].fav = data[i].fav_num;
		            					data[i].percent = 100*data[i].fav_num/perNum+'%';
		            				}else{
		            					data[i].fav = data[i].fav_num_total;
		            					data[i].percent = 100*data[i].fav_num_total/perNum+'%';
		            				}
	            				}
	            			}	            			          			
	            			data[i].favcs = '';	
	            		}
	            		// console.log(data);
	            		fn && fn(data);
	            	}
	            }
            },
            methods : {
                'showWinner' : function(){
                    allWinnerBox.isShowWinner = true;
                },
            	shareReady : function(){
            		if(this.wxisReady) return;
            		// document.getElementsByClassName('btn-school')[0].style.background = 'yellow';
            	},
            	nav : function(evt, type){
            		evt.preventDefault();
            		makeGa.ga('click', 'markfav-'+this.router);
            		if(type === 'today'){
            			this.schoolLists = this.todayLists;
            		}else if(type === 'total'){
            			this.schoolLists = this.totalLists;
            		}
            		this.navType = type;
            	},
            	search : function(evt){
            		evt.preventDefault();
            		makeGa.ga('dialog', 'search-'+this.router);
            		this.isShowSearch = true;
            	},
	            closeSearch : function(evt){
	            	this.isShowSearch = false;
	            },
            	toschool : function(evt){
					evt.preventDefault();
					var target = evt.target;
					makeGa.ga('click', 'searchtoschool-'+this.router);
					if(target.tagName === 'A'){

						var schoolName = evt.target.innerHTML, self = this;
						loading.isloaded = true;
						this.$parent.$emit('getSchoolIdByName', schoolName, function(r){
	            			loading.isloaded = false;
	            			self.isShowSearch = false;
	            			location.hash = '#detail&id='+r.id;
    						this.$dispatch('hashchange', {router:'detail', item:{id: r.id}});
	            		});
						
					}
				},
            	addSchool : function(evt){
					evt.preventDefault();
					makeGa.ga('dialog', 'addSchoolBtn-'+this.router);
					this.isShowSearch = false;
					this.isShowAdd = true;		
				},
	            preview : function(obj){
	            	makeGa.ga('click', 'previewSchool-'+this.router);
                    location.hash = '#'+obj.type+'&id='+obj.id;
                    this.$dispatch('hashchange', {router:obj.type, item:obj});
                },
                upload : function(evt){
                	evt.preventDefault();
                	makeGa.ga('click', 'addSchool-'+this.router);
                	if(this.schoolname === ''){
                		alert('请填写学校名称');
                		return;
                	}
                	if(this.schoolServerId === ''){
                		alert('请填上传学校图片');
                		return;
                	}
                	loading.isloaded = true;
                	self = this;
				    Ajax(api.imageUpload, {
				    	data : {
				    		text : this.schoolname,
				    		media_id : this.schoolServerId
				    	},
				    	method : 'POST',
                        success : function(res){   
                        	loading.isloaded = false;                                        
                            if(res.errno == '0'){ 
								self.isShowAdd = false; 
								location.hash = '#detail&id='+res.rst.id;   
								// location.reload();                       
                            }else{
                                
                            }
                        }
				    })

                },
                selectUpload : function(evt){
    	            // if(!this.isAllowUpload) return;
    	            var self = this;
    	            makeGa.ga('click', 'uploadImg-'+this.router);
                    wx.chooseImage({
                        success: function (res) { 
                            var localIds = res.localIds;
                            self.localIds = localIds.toString();
                            this.uploadImgText = '重新上传';
                            wx.uploadImage({
                                localId: localIds.toString(), 
                                isShowProgressTips: 1,
                                success: function (r) {
                                    self.schoolServerId = r.serverId; 
         //                            wx.previewImage({
									//     current: r.serverId, // 当前显示图片的http链接
									//     urls: [r.serverId] // 需要预览的图片http链接列表
									// });
                                    // alert(r.serverId)
                                },
                                fail : function(res){
                                	// alert(JSON.stringify(res));
                                }
                            });
                        }
                    });
                },
                closeAdd : function(){
                	this.isShowAdd = false;
                },
                showPrize : function(evt){
                	evt.preventDefault();
                	makeGa.ga('dialog', 'lockprize-'+this.router);
            		prizeInfo.isShowPrize = true;              	
                }
            },
            data : {
            	router : 'home',
            	searchBox : null,
            	schools : [],
            	favcs : 'active',
            	isShowSearch : false,
            	isShowAdd : false,
            	isAllowUpload : false,
            	isShowPrize : false,
            	isShowReward : false,
            	winneruser : '',
            	winnerBarWidth : '700px',
            	uploadImgText : '上传母校图片',
            	schoolname : '',
            	insertSchool : '',
            	localIds : '',
            	schoolServerId : '',
            	navType : 'recent', 
            	totalLists : [],
            	todayLists: [],
            	schoolLists : [],            	
				recentListrender : [],
            	recentLists: [],
            	recentTimer : null,          	
            	endTime : null,
            	recent : [],
            	recentUser : '',
            }
        });

/*---------------------------- 创建分享页 -------------------------*/
	var s_build = new Vue({
		el : '#s_build',
        parent : app,
        mixins: [mixin],
        watch : {
        	'isShowSearch' : function(v, ol){
        		if(!v){
        			this.insertSchool = '';
        			this.autoComplete.autoObj.style.display = 'none';
        		}else{
        			makeGa.ga('dialog', 'searchSchool-'+this.router);
        		}
        	},
        	'partShow' : function(v, ol){
        		// if(v && !this.autoComplete){
        		if(!v) return;
        			this.content = '';       		
        			var reg = /id=[0-9]+/;
            		var arr = location.href.match(reg);
            		if(arr && arr.length){
            			arr = arr[0].split('=');
            			this.mid = arr[1];
            		}
        			var self = this;
        			loading.isloaded = true; 
				    Ajax(api.card, {
				    	data : {
				    		m : this.mid
				    	},
				    	method : 'GET',
                        success : function(res){   
                        	loading.isloaded = false;                                        
                            if(res.errno == '0'){ 
                            	self.schools = res.rst.schools;
                            	self.user = res.rst.user;
                            	self.nickname = self.user.nickname;
                            	if(res.rst.material){
                            		self.school = res.rst.material.ext_data.text;
                            	}else{
                            		self.school = '';
                            	}
                            	if(!self.autoComplete){
                            		var autoComplete = new AutoComplete('ranking2','auto-input2',self.schools);
								    autoComplete.obj.oninput = function(evt){
								        autoComplete.start(evt);
								    }
									self.autoComplete = autoComplete;
                            	}else{
                            		self.autoComplete.value_arr = self.schools;
                            	}

                        		var title = self.user.nickname+'在这里向母校深情表白了，你过来偷看一下？', desc = title;
								var info = {
									    title: title, // 分享标题
									    desc: desc, // 分享描述
									    type : 6
									},

									info2 = {
									    title: title, // 分享标题
									    desc: desc, // 分享描述
									    type : 7
									};
                                if(app.wxjdkready){                             
                                    share(info ,info2, '', self.aid);
                                }else{
                                    self.$on('schoolapp-ready', function(e){
                                        share(info ,info2, '', self.mid);
                                    });
                                }
                            }else{
                                
                            }
                        }
				    })
        		// }
        	}
        },
        methods : {
        	getschool : function(evt){
				evt.preventDefault();
				var target = evt.target;
				// makeGa.ga('click', 'searchtoschool-'+this.router);
				if(target.tagName === 'A'){
					var schoolName = evt.target.innerHTML, self = this;
					// loading.isloaded = false;
        			self.isShowSearch = false;
        			self.school = schoolName;

				}
        	},
        	showProfess : function(evt){
        		if(!this.isShowProfess){
        			makeGa.ga('dialog', 'showProfess-'+this.router);
        		}
        		this.isShowProfess = !this.isShowProfess;
        	},
        	chooseProfess : function(evt){
        		this.isShowProfess = false;
        		this.content = evt.target.innerText;
        		// console.log(evt.target.innerText)
        	},
        	showMyself : function(){
        		makeGa.ga('dialog', 'showMyself-'+this.router);
        		this.isShowMyself = true;
        		this.isShowProfess = false;
        	},
        	enter : function(evt){
        		evt.preventDefault();
        		var text = evt.target.value;
	        	var len = text.length;
				var matcher = text.match(/[^\x00-\xff]/g);
				if(matcher){
					len += matcher.length;
				}
				if(len > 160){
					var m = Math.floor((len - 160)/2);
					this.beleftText = '已超出<span style="color:red;">'+m+'</span>字'
				}else	        	
	        		this.beleftText = '剩余<span>'+(80 - Math.floor(len/2))+'</span>字';
	        	this.beleftLen = len;
	        },
	        finishEnter : function(){
	        	if(this.beleftLen < 160){
	        		this.content = this.tempProfess;
	        		this.isShowMyself = false;
	        	}else{
	        		alert('已超出限制数！');
	        	}
	        },
	        chooseSchool : function(){
	        	this.isShowSearch = true;
	        },
	        save : function(evt){
	        	if(this.school && this.content && this.nickname){
	        		loading.isloaded = true;
	        		makeGa.ga('click', 'saveShare-'+this.router);
	    			Ajax(api.savecard, {
				    	data : {
				    		name : this.school,
				 			nickname : this.nickname,
				 			content : this.content
				    	},
				    	method : 'GET',
                        success : function(res){   
                        	loading.isloaded = false;                                        
                            if(res.errno == '0'){ 
           						 self.school = '';
           						  self.content = ''; 
           						  self.nickname = '';
           						  location.hash = '#share&aid='+res.rst.aid;
                            }else{
                                alert(res.error);
                            }
                        }
				    })
	        	}
	        }
        },
        data : {
        	router : 'build',
        	mid : '',//学校ID
        	"user": {
					"id": '',
					"headimgurl": "",
					"nickname": ""
				}, 
			school  : '',
        	schools :  [],
			isShowSearch : false,
			insertSchool : '',
			autoComplete : false,
        	beleftLen : 0,
        	tempProfess : '',
        	beleftText : '剩余<span>80</span>字',
        	content : '',
        	nickname : '',
        	isShowProfess : false,
        	isShowMyself : false
        }
    });


/*---------------------------- 分享页 ----------------------------*/

	var s_share = new Vue({
		el : '#s_share',
        parent : app,
        mixins: [mixin],
        methods : {
        	toProfress : function(){
        		makeGa.ga('click', 'saveShare-'+this.router);
        	}
        },
        watch : {
        	'partShow' : function(v, ov){
        		if(v){
			        var reg = /aid=[0-9]+/;
            		var arr = location.href.match(reg);
            		if(arr && arr.length){
            			arr = arr[0].split('=');
            			this.aid = arr[1];
            			this.card.mid = this.aid;
            		}
            		if(!this.aid){
            			app.$broadcast('router', {
	                        router : 'home',
	                        data : ''
	                    });
	                    return;
            		}
        			loading.isloaded = true;
                	var self = this;
				    Ajax(api.getcard, {
				    	data : {
				    		aid : this.aid
				    	},
				    	method : 'GET',
                        success : function(res){   
                        	loading.isloaded = false;                                        
                            if(res.errno == '0'){ 
                            	self.card = res.rst.card;
                            	self.recent = res.rst.recent;
                                var title = self.card.nickname+'在这里向母校深情表白了，你过来偷看一下？', desc = title;
								var info = {
									    title: title, // 分享标题
									    desc: desc, // 分享描述
									    type : 4
									},

									info2 = {
									    title: title, // 分享标题
									    desc: desc, // 分享描述
									    type : 5
									};
                                if(app.wxjdkready){                             
                                    share(info ,info2, '', self.aid);
                                }else{
                                    self.$on('schoolapp-ready', function(e){
                                        share(info ,info2, '', self.aid);
                                    });
                                }

                            }else{
                                location.hash = '#home';
                            }
                        }
				    })
        		}
        	}
        },
        data : {
        	router : 'share',
        	"recent": [],
        	"card": {
					"uid":"",
					"nickname": "",
					"mid": "",
					"headimgurl": "",
					"text": "",
					"content" : ''
				},
        	aid : '',
        	isShowProfess : false,
        	isShowWrite : false
        }
	});


/*---------------------------- 详细页 ----------------------------*/

		var detail  = new Vue({
            el : '#s_detail',
            parent : app,
            mixins: [mixin],
            watch : {
            	'isComment' : function(v, ov){
            		if(v){
            			this.showCommentTime = +new Date;
            			makeGa.ga('click', 'showComment-'+this.router);
            		}
            	}
            },
            methods : {
                'showWinner' : function(){
                    allWinnerBox.isShowWinner = true;
                },
            	toHome : function(){
            		makeGa.ga('click', 'tohome-'+this.router);
            	},
            	markfav : function(evt){
            		if(this.favcs) return;
            		makeGa.ga('click', 'markfav-'+this.router);
            		loading.isloaded = true;
            		var self = this;
            		this.$parent.$emit('markfav', this.sid, function(r){
            			loading.isloaded = false; 
            			
            			// 'btn btn-disabled btn-block';           			
            			self.$emit('initPage', function(){
            				self.favcs = true;
            			});
            			homePage.$emit('getListData');
            		});
            	},
            	// showComment : function(evt){
            	// 	evt.preventDefault();
            	// 	this.isComment = !this.isComment;
            	// },
            	submit : function(evt){
            		evt.preventDefault();
            		var self = this;
            		if(loading.isloaded) return;
            		loading.isloaded = true;
            		if(this.commentmsg !== ''){
            			makeGa.ga('click', 'commit-'+self.router);
            			var t = +new Date - this.showCommentTime;
            			this.$parent.$emit('comment', this.commentmsg, this.sid, t, function(r){
            				// alert('评论成功！');
            				self.isComment = false;

            				self.$emit('setComment', [{
            					text : self.commentmsg,
            					time : Math.ceil(t/1000)
            				}]);
            				window.scrollTo(0,0); 
            				loading.isloaded = false;
            				self.commentmsg = '';
            			});
            		}
            	},                
            	showPrize : function(evt){
                	evt.preventDefault();
                	makeGa.ga('dialog', 'lockprize-'+this.router);
            		prizeInfo.isShowPrize = true;              	
                }
            },
            ready : function(){
                this.$on('router', function(e){
                    if(e.router.indexOf('detail&id') > -1){  
                    	window.scrollTo(0,0);                   	
                    	var self = this;
                    	if(e.data){
                    		this.sid = e.data.item.id;
                    	}else{
                    		var reg = /id=[a-zA-Z0-9]+/;
                    		var arr = location.href.match(reg);
                    		if(arr && arr.length){
                    			arr = arr[0].split('=');
                    			this.sid = arr[1];
                    		}
                    	}

                    	this.$emit('initPage', function(res){
                    		var thisShare = function(id, num, schoolname){
        						var title = '我是第'+num+'个为母校【'+schoolname+'】中考加油的人',
									desc = '我为母校中考加油！我自豪，我点赞！';
								
								var info = {
									    title: title, // 分享标题
									    desc: desc, // 分享描述
									    type : 1
								},

								info2 = {
								    title: title, // 分享标题
								    desc: desc, // 分享描述
								    type : 2
								};
								share(info, info2, id);
                    		}
                    		if(app.wxjdkready){
                    			thisShare(self.sid, res.school.fav_num_total, res.school.ext_data.text);
                    		}else{
                    			self.$on('schoolapp-ready', function(e){
                    				thisShare(self.sid, res.school.fav_num_total, res.school.ext_data.text);
                    			});
                    		}
                    		
                    	});
                    }else{
                    	this.sLists = [];
                    }
                });                
            }, 
            events : {
                readyInit : function(){
                	this.sLists = [];
            	}, 
            	setComment : function(datas){
            		var self = this;
            		var pushData = function(d){
            			d.top = (Math.ceil(Math.random()*5)-1)*30;
						self.sLists.push(d);
						if(datas.length){
							setTimeout(function(){
								if(!self.partShow){
									datas = '';
									self.sLists = [];
								}else{
									pushData(datas.shift());
								}
							}, Math.ceil(Math.random()*3)*1000);
						}
            		}
            		if(datas.length)
            			pushData(datas.shift());
            	},
            	initPage : function(fn){
            		this.sLists = [];
        		  	loading.isloaded = true;
        		  	this.favcs = false;
		            var self = this;
		            
                    this.$parent.$emit('getSchoolById',this.sid, function(res){
                    	if(res === ''){
                    		location.href = '/huodong/weixin_zhongkao_index/index/';
                    		return;
                    	}
                    	self.detail = res; 
                    	self.topotherLists = [];
                    	if(res.top.length < 3){
                    		var len = 3-res.top.length, names = [];
                    		if(len === 1){
                    			names = ['小队长'];
                    		}else if(len === 2){
                    			names = ['中队长','小队长'];
                    		}else{
                    			names = ['大队长','中队长','小队长'];
                    		}
                    		for(var i=0;i<len;i++){
                    			self.topotherLists.push({
                    				name : names[i]
                    			});
                    		}
                    	}
                    	self.topLists = res.top;
                    	self.ulwidth = 3 * 161 +'px';
                    	self.recentLists = res.recent;
                    	// self.recentListrender = res.recent; 
                    	self.$emit('setComment', res.comment);
                    	fn && fn(res);
                    	loading.isloaded = false;  

                    	var winner = res.winner, len = winner.length, winHtml =[];
		            	if(len){
		            		self.isShowReward = true;                          
                            if(len > 2) len = 2;
		            		for(var i=0;i<len;i++){
		            			winHtml.push(winner[i]);
		            		}
		            		self.winneruser = winHtml.join('');
		            		var adText = document.getElementById('ad-text-school'), lennum = 0;
		            		adText.innerHTML = winHtml.join('');
                            if(allWinnerBox.winnerHTML === ''){
                                allWinnerBox.winnerHTML = winner.join('');
                            }
                            allWinnerBox.isShowWinner = true;
		            	}

                    	if(res.notify && res.notify.type){
                    		if(res.notify.type === "lucky"){
                    			winnerInfo.prize = '幸运奖';
                    			winnerInfo.prizeDetail = '50元京东购物卡';
                    		}else{
                    			winnerInfo.prize = '校园奖';
                    			winnerInfo.prizeDetail = '100元京东购物卡';
                    		}

                    		winnerInfo.isShowPrize = true;
                    	}
		            	               	
                    });
            	}
            },
            data : {
            	winnerBarWidth : '700px',
            	isShowReward : false,
            	router : 'detail',
            	ulwidth : '483px',
            	isComment : false,
            	topLists : [],
            	commentmsg : '',
            	favcs : false,
				recentLists : [],
				topotherLists : [],
				sLists : [],
            	sid : null,
            	detail : null,
            	showCommentTime : '',
            	ts : 'fade'
            }
          });

	};

	var prizeInfo = new Vue({
		el : '#prize',
		data : {
			isShowPrize : false
		}
	});

	var winnerInfo = new Vue({
		el : '#winnerBox',
		data : {
			'prize' : '',
			'prizeDetail' : '',
			isShowPrize : false
		}
	});

    var allWinnerBox = new Vue({
        el : '#allWinnerBox', 
        data : {
            'isShowWinner' : false,
            winnerHTML : ''
        }
    });

	Vue.filter('usernick', function (value) {
		switch(value){
			case 0:			
				return '大队长';
			break;
			case 1:
				return '中队长';
				break;
			case 2:
				return '小队长';
				break;
			default :
				return '';
		}
	});

    if(document.addEventListener){
        document.addEventListener( "DOMContentLoaded", setTimeout(readyFn,5), false );
    }


	var $ = function (id) {
	    return "string" == typeof id ? document.getElementById(id) : id;
	}
	var Bind = function(object, fun) {
	    return function() {
	        return fun.apply(object, arguments);
	    }
	}
	function AutoComplete(obj,autoObj,arr){
	    this.obj=$(obj);        //输入框
	    this.autoObj=$(autoObj);//DIV的根节点
	    this.value_arr=arr;        //不要包含重复值
	    this.index=-1;          //当前选中的DIV的索引
	    this.search_value="";   //保存当前搜索的字符
	}
	AutoComplete.prototype={
	    //初始化DIV的位置
	    init: function(){
	        // this.autoObj.style.left = this.obj.offsetLeft + "px";
	        // this.autoObj.style.top  = this.obj.offsetTop + this.obj.offsetHeight + "px";
	        // this.autoObj.style.width= this.obj.offsetWidth - 2 + "px";//减去边框的长度2px  
	    },
	    //删除自动完成需要的所有DIV
	    deleteDIV: function(){
	        while(this.autoObj.hasChildNodes()){
	            this.autoObj.removeChild(this.autoObj.firstChild);
	        }
	        // this.autoObj.className="auto_hidden";
	    },
	    //设置值
	    setValue: function(_this){
	        return function(){
	            _this.obj.value=this.seq;
	            // _this.autoObj.className="auto_hidden";
	        }      
	    },
	    //模拟鼠标移动至DIV时，DIV高亮
	    autoOnmouseover: function(_this,_div_index){
	        return function(){
	            _this.index=_div_index;
	            var length = _this.autoObj.children.length;
	            for(var j=0;j<length;j++){
	                if(j!=_this.index ){    
	                    _this.autoObj.childNodes[j].className='auto_onmouseout';
	                }else{
	                    _this.autoObj.childNodes[j].className='auto_onmouseover';
	                }
	            }
	        }
	    },
	    //更改classname
	    changeClassname: function(length){
	        for(var i=0;i<length;i++){
	            if(i!=this.index ){      
	                this.autoObj.childNodes[i].className='auto_onmouseout';
	            }else{
	                this.autoObj.childNodes[i].className='auto_onmouseover';
	                this.obj.value=this.autoObj.childNodes[i].seq;
	            }
	        }
	    }
	    ,
	    //响应键盘
	    pressKey: function(event){
	        var length = this.autoObj.children.length;
	        //光标键"↓"
	        if(event.keyCode==40){
	            ++this.index;
	            if(this.index>length){
	                this.index=0;
	            }else if(this.index==length){
	                this.obj.value=this.search_value;
	            }
	            this.changeClassname(length);
	        }
	        //光标键"↑"
	        else if(event.keyCode==38){
	            this.index--;
	            if(this.index<-1){
	                this.index=length - 1;
	            }else if(this.index==-1){
	                this.obj.value=this.search_value;
	            }
	            this.changeClassname(length);
	        }
	        //回车键
	        else if(event.keyCode==13){
	            // this.autoObj.className="auto_hidden";
	            this.index=-1;
	        }else{
	            this.index=-1;
	        }
	    },
	    //程序入口
	    start: function(event){
	        if(event.keyCode!=13&&event.keyCode!=38&&event.keyCode!=40){
	            this.init();
	            this.deleteDIV();
	            this.search_value=this.obj.value;
	            var valueArr=this.value_arr;
	            valueArr.sort();
	            if(this.obj.value.replace(/(^\s*)|(\s*$)/g,'')==""){ return; }//值为空，退出
	            try{ var reg = new RegExp("(" + this.obj.value + ")","i");}
	            catch (e){ return; }
	            var div_index=0;//记录创建的DIV的索引
	            this.autoObj.style.display = 'none';
	            for(var i=0;i<valueArr.length;i++){
	                if(reg.test(valueArr[i])){
	                	this.autoObj.style.display = 'block';
	                    var diva = document.createElement("a");
	                    diva.href = '#';
	                    diva.onmouseover=this.autoOnmouseover(this,div_index);
	                    diva.innerHTML = valueArr[i].replace(reg,"$1");//搜索到的字符粗体显示
	                    this.autoObj.appendChild(diva);
	                    div_index++;
	                }
	            }
	        }
	        this.pressKey(event);
	        window.onresize=Bind(this,function(){this.init();});
	    }
	}

	var share = function(messageInfo, timelineInfo, id, aid){
		var uri = 'http://m.gaofen.com/huodong/weixin_zhongkao_index/share/', uid = G.getCookie('EV_BV_U') || 0;
			uri = uri+'?uid='+uid;
			if(id){
				uri +='&id='+id;
			}
			if(aid){
				uri +='&aid='+aid;
			}
			messageInfo.link = uri+'&type='+messageInfo.type;
			timelineInfo.link = uri+'&type='+timelineInfo.type;
			messageInfo.imgUrl = 'http://file.gaofen.com/html/weixin/support-school/dist/img/shareface.png';
			timelineInfo.imgUrl = 'http://file.gaofen.com/html/weixin/support-school/dist/img/shareface.png';
			delete messageInfo['type'];
            delete timelineInfo['type'];
            wx.onMenuShareAppMessage(messageInfo);
			wx.onMenuShareTimeline(timelineInfo);
	}

})(Gaofen, Vue, window);
