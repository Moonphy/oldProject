/**
 * 海外生存大作战
 */ 
"use strict";
(function(G, Vue, win){

    Vue.config.debug = true;

    var Ajax = G.Ajax.request,
        doman = 'http://m.gaofen.com/';

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
                    hash = G.PD.get('router') === 'task' ? 'rule' : 'index';
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

    //作品列表组件
    var Taskullists = Vue.extend({
      props: ['taskItems'],
      methods : {
        preview : function(id, evt){
            evt.preventDefault();
            this.$dispatch('child-msg', {type:'preview', id:id});
        }
      },
      template : '#item-template'
    });
    Vue.component('task-lists', Taskullists);

    //排行榜前三组件
    var topRank = Vue.extend({
      props: ['topTasks', 'alltopTasks'],
      methods : {
        preview : function(id, evt){
            evt.preventDefault();
            this.$dispatch('child-msg', {type:'preview', id:id});
        }
      },
      template : '#rankItem_template'
    });

    Vue.component('top-rank', topRank);

    //排行榜其它列表组件
    var topotherRank = Vue.extend({
      props: ['topotherTasks', 'alltopotherTasks'],
      methods : {
        preview : function(id, evt){
            evt.preventDefault();
            this.$dispatch('child-msg', {type:'preview', id:id});
        }
      },
      template : '#rank_template'
    });

    Vue.component('topother-rank', topotherRank);


    //共用部分
    var mixin = {
        watch : {
            'partShow' : function(v, oldv){
                if(v && !this.$get('render')){
                    this.$set('render', true);
                    this.$emit('readyInit');
                }
            }
        },
        ready : function(){
            this.$emit('routerfn'); 
        },
        events : {
            readyInit : function(){
                console.log('readyInit')
            },
            routerfn : function(){
                this.$on('router', function(e){
                    var router = this.$get('router');
                    if(router.indexOf('&') === -1){
                        this.$set('partShow', e.router === this.$get('router'));
                    }else{
                        router = router.split('&');
                        var show = false;
                        for(var i=0;i<router.length;i++){
                            if(e.router === router[i]){
                                show = true;
                                break;
                            }
                        }
                        this.$set('partShow', show);
                    }
                })
            }
        },
        data : {
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

    var mixin2 = {
            data : {
                loading : false,
                lastPage : false,
                page : 1,
                count : 0
            },
            events : {
                getList : function(fn){
                    var self = this;
                    var url = '/huodong/weixin_xunbao_taska/getitems';
                    if(this.lastPage || this.loading) return;
                    this.loading = true;
                    Ajax(url,{
                            data : {'page':this.page++},
                            success : function(res){
                                self.loading = false;
                                if(res.errno == '0'){                                                                                           
                                    if(res.rst.items){
                                        var items = self.$get('taskItems');
                                        for(var i=0;i<res.rst.items.length;i++)
                                            items.push(res.rst.items[i]);
                                        if(i < 10) self.lastPage = true;
                                    }
                                    // items.push({url:'#',nickname : '中国式', img:'http://ww3.sinaimg.cn/orj480/644471aegw1f3sc1b4kn8j20j60bwadx.jpg', id:2});
                                    self.$set('taskItems', items);

                                    // self.$emit('readyInit');
                                }else{
                                    // setError(1, r.err);
                                    self.$options.showTips(1, res.err);
                                }
                                fn && fn(res);
                                // console.log(self.$data.taskItems)
                            },
                            failure : function(xhr){
                                self.$options.showTips(1, '请求失败！');
                            }
                        }
                    );
                }
            }
        
    };

    //提示框组件
    var Popup = function(id){
        var popup = new Vue({
            el : id||'#popup-rule',
            ready : function(){

            },
            methods : {
                close : function(){
                    this.isShow = false;
                }
            },
            data : {
                isShow : true,
                transitionName: 'fade'
            }
        });
        return popup;
    };




    
    //dom加载完成后调用
    var readyFn = function(_router, noInit){

        var router = _router || G.PD.get('router'), setTimer = null;

        var app = new Vue({
            el : '#taskapp',
            ready : function(){
                var self = this;
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
            events : {
                fire : function(obj){
                    var router = Hash.getHash();
                    if(obj && obj.myrouter){
                        router = obj.myrouter;
                    }
                    app.$broadcast('router', {
                        router : router,
                        data : obj
                    });
                    setTimeout(function(){clearTimeout(setTimer);}, 10);
                },
                getMeData : function(fn, url){
                    if(this.me){
                        fn && fn(this.me);
                        return;
                    }
                    var self = this;
                    Ajax(url || doman+'/huodong/weixin_xunbao_taska/me/',{
                            data : {},
                            success : function(res){                                                  
                                if(res.errno == '0'){ 
                                        self.me = res.rst; 
                                        fn && fn(res.rst);                                      
                                }else{
                                    // self.$options.showTips(1, res.err);
                                }
                            },
                            failure : function(xhr){
                                // self.$options.showTips(1, '请求失败！');
                            }
                        }
                    );
                },

                getRank : function(fn){
                    Ajax(doman+'/huodong/weixin_xunbao_taska/rank/',{
                            data : {},
                            success : function(res){                                                  
                                if(res.errno == '0'){
                                        fn && fn(res.rst);                                      
                                }else{
                                    // self.$options.showTips(1, res.err);
                                }
                            },
                            failure : function(xhr){
                                // self.$options.showTips(1, '请求失败！');
                            }
                        }
                    );
                },

                getStatus : function(fn){
                    if(this.status){
                        fn && fn(this.status);
                        return;
                    }
                    var self = this;
                    Ajax(doman+'/huodong/weixin_xunbao_xunbao/status/',{
                            data : {},
                            success : function(res){                                                  
                                if(res.errno == '0'){ 
                                        self.status = res.rst; 
                                        fn && fn(res.rst);                                      
                                }else{
                                    // self.$options.showTips(1, res.err);
                                }
                            },
                            failure : function(xhr){
                                // self.$options.showTips(1, '请求失败！');
                            }
                        }
                    );
                },
            },

            data : {
                me : null,
                status : null
            }
        });  

        //底部菜单
        new Vue({
            el :'#nav-menu',
            ready : function(){

            },
            data : {
                page : {
                    footer : {
                        A : {
                            link : '/huodong/weixin_xunbao_xunbao/index2/',
                            title : '寻宝首页'
                        },
                        B :  {
                            link : '/huodong/weixin_xunbao_taska/index2/',
                            title : '活动一'
                        },
                        C :  {
                            link : '/huodong/weixin_xunbao_xunbao/index2/#camp',
                            title : '我的营地'
                        }
                    }
                }
            }
        });

        switch(router){
            case 'xunbao':
                new Vue({
                    el : '#xunbaoIndex',
                    parent : app,
                    mixins : [mixin],
                    events : {
                        readyInit : function(){
                            var self = this;
                            this.$parent.$emit('getStatus', function(res){
                                var items = [], links = res.links, i = 0;
                                    for(var k in res.links){
                                        if(k === 'home') continue;
                                        var item = {
                                            link : links[k],
                                            cs : 'btn btn-un-start',
                                            alt : '敬请期待',
                                            name : ''
                                        }
                                        if(links[k]){
                                            item.name = '立即动起手来';
                                            item.cs = 'btn btn-start';
                                            item.alt = '开始任务';
                                        }else{
                                            if(i === 1){
                                                item.name = '活动一 敬请期待';
                                            }
                                            if(i === 2){
                                                item.name = '活动二 敬请期待';
                                            }else if(i === 3){
                                                item.name = '活动三 敬请期待';
                                            }
                                        }
                                        items.push(item);
                                        i++;
                                    }
                                    self.tasks = items;
                                    console.log(items)
                            });
                        }
                    },
                    data : {
                        tasks : [],
                        router : 'index'
                    }
                });

                new Vue({
                    el : '#campPage',
                    parent : app,
                    mixins : [mixin],
                    events : {
                        readyInit : function(){
                            var self = this;
                            this.$parent.$emit('getMeData', function(r){
                                self.meinfo = r;
                            }, doman+'/huodong/weixin_xunbao_xunbao/me/');
                        }
                    },
                    data : {
                        meinfo : {path : ''},
                        tasks : [],
                        router : 'camp'
                    }
                });

                new Vue({
                    el : '#userInfo',
                    parent : app,
                    mixins : [mixin],
                    events : {
                        readyInit : function(){
                            var self = this;
                            var script = document.createElement('script');
                            script.src = 'http://file.gaofen.com/html/v5/js/city.js';
                            script.onload = function(){
                                if(self.cityready){
                                    self.$options.initCity(self.userInfo.district);
                                }else{
                                    self.cityready = true;
                                }
                            };
                            document.head.appendChild(script);
                            if(Hash.getHash() === 'uinfo'){//发布
                                this.submitTxt = '保存发布';
                            }else{//修改
                                this.$parent.$emit('getMeData', function(r){
                                    self.meinfo = r;
                                });
                                this.$parent.$emit('getStatus', function(r){
                                    Ajax(r.api.portfolio,{
                                            data : {},
                                            success : function(res){                                    
                                                if(res.errno == '0'){ 
                                                   self.userInfo = res.rst.portfolio;   
                                                   if(self.userInfo.gender === 'M'){
                                                        self.gendered = '男';
                                                    }else if(self.userInfo.gender === 'F'){
                                                        self.gendered = '女';
                                                    }                                         
                                                }else{
                                                    // self.$options.showTips(1, res.err);
                                                }
                                            }
                                        }
                                    );
                                });
                            }                            
                        }
                    },

                    initCity : function(district){
                        PCAS('province', 'city', 'district',
                        '广东省',
                        '广州市',
                        district
                        );
                    },

                    watch : {
                        'userInfo.gender' : function(v, oldv){
                            if(v === 'M'){
                                this.gendered = '男';
                            }else if(v === 'F'){
                                this.gendered = '女';
                            }
                        },
                        'userInfo' : function(){
                            if(this.cityready){
                                this.$options.initCity(this.userInfo.district);
                            }else{
                                this.cityready = true;
                            }
                        }
                    },
                    methods : {
                        save : function(evt){
                            evt.preventDefault();
                            var userInfo = this.userInfo, self = this;
                            if(userInfo.name === ''){
                                this.$options.showTips(1, '请填写孩子姓名！');
                                return;
                            }
                            this.ajaxLoad = true;
                            Ajax(doman+'/huodong/weixin_xunbao_xunbao/updateportfolio',{
                                    data : userInfo,
                                    method : 'POST',
                                    success : function(res){     
                                        self.ajaxLoad = false;
                                        if(res.errno == '0'){                 
                                           self.$options.showTips(1, '保存成功！');
                                           location.hash = '#camp'
                                        }else{
                                            self.$options.showTips(1, res.err);
                                        }
                                    },
                                    failure : function(xhr){
                                        self.$options.showTips(1, '请求失败！');
                                    }
                                }
                            );
                        }
                    },
                    data : {
                        cityready : false,
                        gendered : '',
                        userInfo : {
                            gender : '',
                            age : ''
                        },
                        meinfo : {},
                        tasks : [],
                        submitTxt : "保存上传",
                        router : 'info&uinfo'
                    }

                });


                new Vue({
                    el : '#mytasks',
                    parent : app,
                    mixins : [mixin],
                    getTaskAttr : function(info, i, taskname){
                        if(info){
                            var task = {taskname : taskname, status : '进行中', path : info.path, alt : '进行中', cs : 'btn btn-start-y', link:'#'};
                            if(info.fav_num_total >= 5){
                                task.status = '已成功征服';
                                task.alt = '已成功征服';
                            }
                            return task;
                        }
                        return {    
                            path : '',
                            link : '#',
                            taskname : taskname, 
                            cs : 'btn btn-un-start',
                            alt : '尚未开始',
                            status : i === 0 ? '活动一 尚未开始' : (i === 1 ? '活动二 尚未开始' : '活动三 尚未开始')
                        };
                    },
                    events : {
                        readyInit : function(){
                            var self = this;
                            this.$parent.$emit('getMeData', function(res){
                                var items = [], links = res.links, i = 0;
                                if(res.taska){
                                    self.tasks.push(self.$options.getTaskAttr(res.taska, 0, 'taska'));                                   
                                }
                                if(res.taskb !== undefined){
                                    self.tasks.push(self.$options.getTaskAttr(res.taskb, 1, 'taskb'));
                                }
                                if(res.taskc !== undefined){
                                    self.tasks.push(self.$options.getTaskAttr(res.taskc, 2, 'taskc'));
                                }
                                if(self.tasks[0].path){//获取任务链接
                                    self.$parent.$emit('getStatus', function(res){
                                        for(var k in res.links){
                                            for(var i=0;i<self.tasks.length;i++){
                                                if(k === self.tasks[i].taskname){                                                 
                                                    self.tasks[i].link = res.links[k];
                                                }
                                            }
                                        }
                                    });
                                }

                            }, doman+'/huodong/weixin_xunbao_xunbao/me/');
                        }
                    },
                    data : {
                        meinfo : {path : ''},
                        tasks : [],
                        router : 'mytask'
                    }
                });

            break;
            case 'task' ://任务
                var taskrule, tasklist, taskpost, tasktasks, taskpreview;
                taskrule =  new Vue({
                        el : '#taskrule',
                        parent : app,
                        mixins: [mixin, mixin2],
                        events : {
                            readyInit : function(){
                                var self = this;
                                scroll.init(function(){
                                    self.$emit('readyInit');
                                });
                                this.$parent.$emit('getMeData', function(r){
                                    if(r.id){                                    
                                        self.$emit('getList', function(rs){
                                            self.showTaskLists = true;
                                            self.count = rs.rst.count;
                                        })
                                    }
                                });
                            }
                        },

                        methods : {

                            progress : function(hash, evt){
                                evt.preventDefault();
                                win.location.hash = '#'+hash;                               
                            },
                            preview : function(obj){
                                location.hash = '#'+obj.type;
                                var item = null;
                                for(var i=0;i<this.taskItems.length;i++){
                                    if(this.taskItems[i].id === obj.id){
                                        item = this.taskItems[i];
                                        break;
                                    }
                                }
                                taskrule.$dispatch('hashchange', {router:obj.type, item:item});
                            }
                        },
                        data : {     
                            showTaskLists : false,    
                            taskItems : [],                
                            router : 'rule'                            
                        }
                    });


                    tasklist =  new Vue({
                        el : '#taskrank',                       
                        parent : app,
                        mixins: [mixin],
                        methods : {
                            progress : function(){
                                console.log(arguments);
                            },
                            selectTab : function(n){
                                this.part1 = n == '1' ? true : false;
                            }
                        },
                        data : {
                            router : 'rank',
                            part1 : true,
                            alltopTasks : [],
                            alltopotherTasks : [],
                            topotherTasks : [],
                            topTasks : []
                        },
                        events : {
                            readyInit : function(){
                                var self = this;
                                this.$parent.$emit('getRank', function(res){
                                    var weekly = res.weekly, final = res.final;                                                                                         
                                    self.topTasks = self.$options.getTopItem(weekly, 3);
                                    self.alltopTasks = self.$options.getTopItem(final, 3);
                                    self.topotherTasks = self.$options.getOtherItem(weekly);
                                    self.alltopotherTasks = self.$options.getOtherItem(final);
                                });
                            }
                        }
                    });


                    taskpost =  new Vue({
                        el : '#taskpost',
                        parent : app,
                        mixins: [mixin],
                        methods : {
                            formSubmit : function(e){
                                e.preventDefault();
                                if(this.ajaxLoad) return;
                                if(this.serverId === ''){
                                    // alert('请上传图片');
                                    self.$options.showTips(1, '请求失败！');
                                    return;
                                }
                                if(this.form.txt === ''){
                                    self.$options.showTips(1, '请发表一下作品感言！');
                                    return;
                                }
                                var self = this;
                                this.ajaxLoad = true;
                                Ajax(doman+'/huodong/weixin_xunbao_taska/upload/',{
                                        data : {'media_id':this.serverId, text : this.form.txt},
                                        method : 'POST',
                                        success : function(res){      
                                            self.ajaxLoad = false;
                                            if(res.errno == '0'){                 
                                               location.href = doman+'/huodong/weixin_xunbao_xunbao/taskportfolio/?to='+doman+'/huodong/weixin_xunbao_taska/index2?upload=true#preview';

                                            }else{
                                                self.$options.showTips(1, res.err);
                                            }
                                        },
                                        failure : function(xhr){
                                            self.$options.showTips(1, '请求失败！');
                                        }
                                    }
                                );
                            },
                            choosePic : function(e){
                                e.preventDefault();
                                var self = this;
                                if(!this.isAllowUpload) return;
                                wx.chooseImage({
                                    success: function (res) { 
                                        // alert(JSON.stringify(res))
                                        self.form.img = res.localIds[0];
                                        wx.uploadImage({
                                            localId: res.localIds[0], 
                                            success: function (r) {
                                                self.serverId = r.serverId; 
                                                // alert(r.serverId)
                                            }
                                        });
                                    }
                                });
                            }
                        },
                        data : {
                            router : 'post',
                            isAllowUpload : false,
                            serverId : '',
                            form : {
                                // img : 'http://ww3.sinaimg.cn/orj480/644471aegw1f3sc1b4kn8j20j60bwadx.jpg',
                                img : '',
                                imgUrl :'http://ww3.sinaimg.cn/orj480/644471aegw1f3sc1b4kn8j20j60bwadx.jpg',
                                txt : ''
                            }
                        },
                        events : {
                            readyInit : function(){
                                var self = this;
                                Ajax(doman+'/huodong/weixin_xunbao_taska/status/', 
                                    {data:{},
                                    success:function(res){
                                    if(res.errno == '0'){                                   
                                        G.PD.set({wxconfig: res.rst.config});
                                        GWX.wxready({debug : true}, function(e){
                                            self.isAllowUpload = true;
                                            document.getElementById('uploadImage').click();
                                        });

                                    }else{
                                        self.$options.showTips(1, res.err);
                                    }
                                }});

                                this.$parent.$emit('getMeData', function(r){
                                    var user = r.user;
                                    if(r.id){
                                        self.form.img = r.path;
                                    }
                                });



                            }
                        }
                    });

                    tasktasks =  new Vue({
                            el : '#tasklist',
                            parent : app,
                            mixins: [mixin, mixin2],
                            data : {     
                                taskItems : [],                                                                                
                                router :'list'
                            },
                            methods : {
                                preview : function(obj){
                                    location.hash = '#'+obj.type;
                                    var item = null;
                                    for(var i=0;i<this.taskItems.length;i++){
                                        if(this.taskItems[i].id === obj.id){
                                            item = this.taskItems[i];
                                            break;
                                        }
                                    }
                                    this.$dispatch('hashchange', {router:obj.type, item:item});
                                }
                            },
                            events : {
                                readyInit : function(){
                                    var self = this;
                                    scroll.init(function(){
                                        // self.$emit('readyInit');
                                        self.$emit('getList', function(rs){
                                            // self.showTaskLists = true;
                                            self.count = rs.rst.count;
                                        })
                                    });
                                    self.$emit('getList', function(rs){
                                        // self.showTaskLists = true;
                                        self.count = rs.rst.count;
                                    })
                                }
                            }
                        });

                        taskpreview =  new Vue({
                            el : '#taskpreview',
                            parent : app,
                            mixins: [mixin],
                            ready : function(){
                                this.$on('router', function(e){
                                    if(e.router === 'preview'){
                                        if(location.search.indexOf('upload=true')> -1){
                                            this.$options.methods.showpopup();
                                        }
                                        this.$emit('getTaskInfo', e.data ? e.data.item : '');
                                    }
                                });
                            }, 
                            methods : {
                                markfav : function(evt){
                                    evt.preventDefault();
                                    if(this.ajaxLoad) return;
                                    this.ajaxLoad = true;
                                    var self = this;
                                    Ajax(doman+'/huodong/weixin_xunbao_taska/markfav/', {data:{
                                        m : this.task.id
                                    },
                                    success:function(res){
                                        self.ajaxLoad = false;
                                        if(res.errno == '0'){ 
                                            self.isFav = true;
                                        }  
                                    }, 
                                    failure : function(err){}});
                                },

                                showpopup : function(evt){
                                    evt && evt.preventDefault();
                                    var popup = this.popup;
                                    if(!popup){
                                        this.popup = Popup();
                                    }else{
                                        popup.isShow = true;
                                    }
                                }
                            },
                            data : {
                                router : 'preview',
                                isme : false,
                                isFav : true,
                                popup : null,
                                weeklyRank : 0,
                                task : {}
                            },
                            events : {

                                getIsfav : function(id){
                                    var self = this;
                                    Ajax(doman+'/huodong/weixin_xunbao_taska/isfav/', {data:{
                                        m : id
                                    },
                                    success:function(res){
                                        if(res.errno == '0'){ 
                                            self.isFav = res.rst.isFav;
                                        }  
                                    }, 
                                    failure : function(err){}});
                                },

                                getTaskInfo : function(item){
                                    var self = this;
                                    if(item){
                                        this.$set('task', item);
                                        
                                        // this.isme = false;
                                        this.$parent.$emit('getMeData', function(r){
                                            if(item.id === r.id){
                                                self.isFav = true;
                                            }else{
                                                self.$emit('getIsfav', item.id);                                              
                                            }
                                        });
                                    }else{
                                        this.$parent.$emit('getMeData', function(r){
                                            if(r.id){
                                                self.$parent.$emit('getRank', function(res){
                                                    self.weeklyRank = res.weeklyRank;
                                                    self.isme = true;
                                                });                                    
                                                self.$set('task', r); 

                                            }else{
                                                location.hash = '#post';
                                            }
                                        });
                                    }
                                }
                            }
                        });
            
                break;
        }
    };


    //判断滚动条是否到底部
    var scroll = (function(){
        function getScrollTop(){
        　　var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
        　　if(document.body){
        　　　　bodyScrollTop = document.body.scrollTop;
        　　}
        　　if(document.documentElement){
        　　　　documentScrollTop = document.documentElement.scrollTop;
        　　}
        　　scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        　　return scrollTop;
        }
        //文档的总高度
        function getScrollHeight(){
        　　var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
        　　if(document.body){
        　　　　bodyScrollHeight = document.body.scrollHeight;
        　　}
        　　if(document.documentElement){
        　　　　documentScrollHeight = document.documentElement.scrollHeight;
        　　}
        　　scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        　　return scrollHeight;
        }
        //浏览器视口的高度
        function getWindowHeight(){
        　　var windowHeight = 0;
        　　if(document.compatMode == "CSS1Compat"){
        　　　　windowHeight = document.documentElement.clientHeight;
        　　}else{
        　　　　windowHeight = document.body.clientHeight;
        　　}
        　　return windowHeight;
        }

        return {
            init : function(fn){
                window.onscroll = function(){
                　　if(getScrollTop() + getWindowHeight() == getScrollHeight()){
                        fn && fn();
                　　}
                };
            }
        }
    })();


    if(document.addEventListener){
        document.addEventListener( "DOMContentLoaded", setTimeout(readyFn,5), false );
    }

})(Gaofen, Vue, window);

