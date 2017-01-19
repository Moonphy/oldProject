/**
 * Created by zhiwen on 2015-1-8.
 * 学校初中库 mobile
 */
"use strict";
var lock = false;
if(typeof Gaofen === 'undefined'){
    window['Gaofen'] = {};
    Gaofen = window['Gaofen'];
}
//window['Gaofen'] = Gaofen;

var router = {
    dev : {

        searchBarUri : '/Czweixin/School/list?q=',//搜索区

        selectUri : '/Czweixin/school/ajaxSchools',//下拉区

        pageListUri : 'Czweixin/school/ajaxSchools'//更多

    },

    pro : {

        searchBarUri : 'list.html?q=',

        selectUri : 'chuzhong-ajaxSchools.html',

        pageListUri : 'chuzhong-ajaxSchools.html'
    }

}, routerModal = location.href.indexOf('dev') > 0 ? 'dev' : 'pro';

(function($, win, G){

    var isPc = function(){  
           var userAgentInfo = navigator.userAgent;  
           var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];  
           var flag = true;  
           for (var v = 0; v < Agents.length; v++) {  
               if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
           }  
           return flag;  
        } 
    var eventType = isPc() ? 'click' : 'tap';

    G.PD = (function(){

        if(typeof G.cfg === 'undefined')
            G.cfg = {};
        var data = G.cfg,
        _window = {};
        return {
            set : function(name, _data){
                var len = arguments.length;
                if (len == 3){
                    _window[name] = _data
                    data[name] = _data;         
                }else if(len == 2){
                    $.extend(data, _data);
                }else if(len == 1){
                    $.extend(data, name);
                }
            },
            
            get : function(name){       
                var len = arguments.length;
                if(len == 1)
                    return data[name];
                else{
                    if(len === 0) return G.cfg;
                    return _window[name];
                }
            }       
        }  

    })();
    

    var Base = {

        //广播事件
        on : function(name, fn){
            Base.actions.reg('self_'+name, fn);
        },

        getQueryString : function(name){
             var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
             r = win.location.search.substr(1).match(reg);
             if(r!=null)return  decodeURIComponent(r[2]); return null;
        },

        encode : function(v){
            return encodeURIComponent(v);
        },

        fire : function(name, params){
            var fns = Base.actions.get('self_'+name);
            if(fns){
                if($.type(fns) === 'array'){
                    $.each(fns, function(i, fn){
                        fn(params);
                    })
                }else{
                    fns(params);
                }
                //return Gaofen.actions.get('self_'+name)(params);
            }else{
                console || console.log('no event');
            }
        },

        send : function(url, param, fn, method){
            if( !param ) param = {__rnd : +new Date};
            else param['__rnd'] = +new Date;
            method = method || 'get';
            switch(method){
                case 'get' :
                    $.get(url, param, fn);
                break;
                case 'post' :
                    $.post(url, param, fn);
                break;
                case 'jsonp' :
                    $.getJSON(url, param, fn);
                break;              
            }
            
        },
        
        util : {
            parse : function(htmls, map){
                var tplReg =  /\{(\.?[\w_|$]+)(\.[\w_$]+)?\}/g;
                return htmls.replace(tplReg, function(s, k , k1){
                    var v, modfs, k_str, key;
                    if (k.charCodeAt(0) === 46)  {
                        k_str = k.substr(1);
                        modfs = k_str.split('|');
                        key = modfs.shift();
                        v = map[key] === undefined? '' : map[key];
                    }
                    return v;
                });
            },
            parseKnV : function(strRel){
                var map = {}, kv, kvs = strRel.split(',');
                try {
                    for( var i=0,len=kvs.length;i<len;i++){
                        // if not contains ':'
                        // set k = true
                        if(kvs[i].indexOf(':') === -1){
                            map[kvs[i]] = true;
                        }else {
                            // split : to k and v
                            kv = kvs[i].split(':');
                            // escape value
                            map[kv[0]] = kv[1];
                        }
                    }
                }catch(e) { 
                    throw 'Syntax Error:rel字符串格式出错。' + strRel; 
                }
            
                return map;
            }
            
            ,bind : function(fn, scope){
              return function() {
                  return fn.apply(scope, arguments);
              };
            }
            
            ,isEmail : function(txt){
                return /.+@.+\.[a-zA-Z]{2,4}$/.test(txt);
            }           
            
            ,byteLen : function(text){
                var len = text.length;
                var matcher = text.match(/[^\x00-\xff]/g);
                if(matcher)
                    len += matcher.length;
                return len;
            },

            imgIsLoaded : function(uri, fn){
                var image = new Image();       
                image.onload = function () { //图片下载完毕时异步调用callback函数。  
                    fn();  
                };
                image.src = uri;
                if(image.complete) fn();               
            }
            
        },

        
        tips : {        
            alert : function(msg, type){//type : success\warning\error
                if(typeof toastr)
                    toastr[type || 'success'](msg);     
                else
                    alert(msg);
            }
        },
        
        event : function(cb){
            $('body').on(eventType, function(e){              
                var tg = $(e.target), rel = tg.attr('rel'), data = [];
                for(var i=0;i<10;i++){
                    var _rel = tg.attr('rel');
                    
                    if(_rel){
                        var item = Base.util.parseKnV(_rel);
                        data.push(item);
                    }
                    tg = tg.parent();
                }
                var len = data.length;
                if(len){
                    for(var j = 0;j<len;j++){
                        var evt = Base.actions.get(data[j]['e']);
                        //console.log('event:'+data[j]['e']);                       
                        if(evt){
                            e.preventDefault();
                            evt(e, data[j]);
                        }                           
                    }
                }
            })
        },
        
        actions : {
            evts : {},
            get : function(ns){
                return this.evts[ns];
            },
            
            reg : function(ns, fn){
                if(!this.evts[ns])
                    this.evts[ns] = fn;
                else{
                    var orfn = this.evts[ns];
                    if($.type(orfn) === 'array'){
                        orfn.push(fn);
                    }else{
                        var newfn = [orfn];
                        newfn.push(fn);
                        this.evts[ns] = newfn;
                    }

                }
                return this;
            }
        },
        
        
        getRouter : function(url, router){
            var luri = location.href;
            if(luri.indexOf('dev') > 0)//开发环境
                return url;
            else{//正式环境
                return '/xuexiao/chuzhong-'+url;
            }
        },
        
        
        
        cls : {},


    };

    var myFastClick = function(etype, el, fn){
        var zel = $(el), dom = $(el).get(0), evt, preventDefault = true, stopPropagation = true;
        if($.type(etype) === 'object'){
            evt = etype.evt;
            preventDefault = etype.hasOwnProperty('pd') ? etype.pd : preventDefault;
            stopPropagation = etype.hasOwnProperty('sp') ? etype.sp : stopPropagation;
        }else{
            evt = etype;
        }
        $(el).on('touchend', function (e) {
            var event = $.Event(evt);
            //这里为了方便而已，其实该e.target
            dom.dispatchEvent(event);
            preventDefault && e.preventDefault();
            stopPropagation && e.stopPropagation();
        });
        $(el).on(etype, fn);
    }

    function initReady(){
        var channel = G.PD.get('channel');

        //公共部分
        //回退
        $('.return, .icon-return').on(eventType, function(e){
            e.preventDefault();
            win.history.go(-1);
        });


        var body = $('body'),
            uimask = $('.ui-mask');
        //右上角功能位置事件
        myFastClick(eventType, $("#navToggle"), function (e) {
            var show = 1;
            if (body.hasClass("hide-nav")) {
                body.removeClass("hide-nav");
            }
            if (body.hasClass("show-nav")) {
                show = 0;
                body.addClass("hide-nav");
            }
            $(this).toggleClass("active");
            body.toggleClass("show-nav");
            if(show){
                uimask.removeClass('hidden');
                $('html').css('overflow', 'hidden');
            }else{
                uimask.addClass('hidden');
                $('html').css('overflow', 'auto');
            }   
        });

        myFastClick(eventType, uimask, function (e) {
            $('#navToggle').trigger(eventType);
        });

       

        //顶部搜索
        searchCmp();

        //模拟点击效果
        $('body').on(eventType, 'a', function(e){
            $(e.target).addClass('active');
            setTimeout(function(){$(e.target).removeClass('active')}, 500);
        }); 

        //跳到PC
        $('#topc').on(eventType, function(e){
            if(channel === 'index' || channel === 'list'){
                if(routerModal === 'dev'){
                    win.location.href = 'http://'+win.location.host+'/cz/school/index';
                }else{
                    win.location.href = 'http://school.gaofen.com/chuzhong/';
                }
            }else if(channel === 'view' || channel === 'article'){
                if(routerModal === 'dev'){
                    win.location.href = 'http://'+win.location.host+'cz/school/view?id='+G.PD.get('id');
                }else{
                    win.location.href = 'http://school.gaofen.com/chuzhong/'+G.PD.get('id')+'.html';
                }
            }
        });

        /*---------------公共部分结束--------------------*/

        switch(channel){
            case 'index' : 


            break;

            case 'album' : 
                var pic_viewer = $('#pic_viewer'),
                imgTpl = '<div class="pic" vrel="{.title}"><div class="loading" rel={.img}><span class="bounce1"></span><span class="bounce2"></span><span class="bounce3"></span></div></div>',
                sliderTpl = '<img src="{.img}" alt="{.title}" width="{.wd}"/><span>{.title}</span>',
                sliderShow = false,
                childs,
                _index = 0, 
                wd = $(win).width(),
                showImg  = function(i){
                    var showItem = pic_viewer.children('.pic-container').children().eq(i);
                    if(showItem.find('.loading').length){
                        var imgUri = showItem.find('.loading').attr('rel'),
                            title = showItem.attr('vrel');
                        Base.util.imgIsLoaded(imgUri, function(){
                            showItem.find('.loading').replaceWith(Base.util.parse(sliderTpl, {
                                img : imgUri,
                                title : title,
                                wd : wd
                            }));
                        })
                    }
                },
                sliderInit,
                setTileIndex = function(title){
                    var child = childs.eq(_index);

                    pic_viewer.find('.pic-title').text($.trim(child.attr('vrel')));
                    pic_viewer.find('.pic-pages').text((_index+1)+'/'+childs.length);
                },
                sliderEvent = function(index){                   
                    pic_viewer
                        .on('showImg', function(){                              
                            showImg(_index);
                            setTileIndex();
                        }).on('sliderTo', function(e, obj){
                            //debugger;
                            var turnTo = obj.turnTo || 'left', toPx = wd;
                            if(turnTo === 'left'){
                                toPx = -wd;
                            }
                            //childs = pic_viewer.find('.pic-container').children();
                            var to = obj.to % childs.length;
                            if(to < 0) to = childs.length + to;
                            childs.eq(to).css('left', -toPx);
                            childs.eq(obj.form).animate({'left':toPx}, 200);
                            childs.eq(to).animate({'left':0}, 200);
                            _index = to;
                            pic_viewer.trigger('showImg');                            
                        })
                }, 
                album = function(index){
                    var form = _index;
                    _index = index;
                    if(sliderInit){ 
                        if(form !== _index){
                            childs.eq(form).css('left', wd);
                            childs.eq(_index).css('left', 0);
                            pic_viewer.trigger('showImg'); 
                        }
                        pic_viewer.removeClass('hidden');   
                        $('html').addClass('show-pic-viewer');
                         //slider.slideTo(_index);
                    }else{
                        var lists = $('#album_list').children(), imgs = [], parse = Base.util.parse;
                        lists.each(function(i,item){
                            var title = '';
                            try{ title = $.trim($(item).find('.title').text());}catch(e){}
                            imgs.push(parse(imgTpl, {
                                img : $(item).attr('rel'),
                                title : title
                            }))                                        
                        });
                        //var w = wd * imgs.length;
                        childs = pic_viewer.width(wd).find('.pic-container')
                        // .css({'position': 'relative;'})
                        .html(imgs.join(''))
                        .children().each(function(i, item){
                            if(i === _index){
                                $(item).css({'left':0});
                            }else{
                                $(item).css({'left': wd});
                            }
                        });
                        pic_viewer.removeClass('hidden');
                        pic_viewer.trigger('showImg');
                        sliderInit = true;
                        var x;
                        $('body').on('touchstart', function(e){
                            x = e.touches[0].pageX;
                        }).on('touchmove', function(e){
                            var left = (e.touches[0].pageX-x)/1.5;
                            if(_index === 0 && left>0){
                                childs.eq(0).css('left', left > wd/3? wd/3 : left);
                             }else if(left < 0 && _index === childs.length -1){
                                childs.eq(_index).css('left', left < -wd/3? -wd/3 : left);
                            }
                        }).on('touchend', function(e){
                            //childs.eq(_index).css('left', 0);
                            childs.eq(_index).animate({'left':0},120);
                        })
                    }
                    $('html').addClass('show-pic-viewer');
                    sliderShow = true;
                }
                $('#album_list').find('.album-item').on(eventType, function(e){
                    e.stopPropagation(true);                  
                    album($(this).index());  
                })
                var tapTimer = null,
                tapEvent = function(){
                   tapTimer = win.setTimeout(function(){
                        $('html').animate({'opacity': 0}, 250);
                        win.setTimeout(function(){
                            pic_viewer.addClass('hidden');
                            $('html').removeClass('show-pic-viewer');
                            $('html').css('opacity', 1);
                            sliderShow = false;
                        },  200);
                    }, 30);
                };
                $('body').on('tap', function(){
                    if(sliderShow)
                        tapEvent();
                }).on('swipeLeft swipeRight', function(e, type){
                    win.clearTimeout(tapTimer);
                    tapTimer = null;
                    if(!pic_viewer.hasClass('hidden')){
                        var index = _index, turnTo;
                        if(e.type === 'swipeLeft'){
                            if(_index + 1 === childs.length) return;
                            ++_index;
                            turnTo = 'left';
                        }else{
                            if(_index === 0 ) return;
                            --_index;
                            turnTo = 'right';
                        }

                        pic_viewer.trigger('sliderTo', {form:index, to:_index, turnTo:turnTo});
                        //slider.slideTo(_index);
                    }
                });
                sliderEvent();

            break;

            case 'list' : 

                var selects  = $('#searchArea select'), page = 1, selected = false,
                    url  =router[routerModal].selectUri, q = Base.getQueryString('q');
                    var params = q ? {q:Base.encode(q)} : {}, 
                    cityjq = $('#city'), city = '广州';
                    if(cityjq.length){
                        city = cityjq.text().indexOf('广州') != -1 ? '广州' : '深圳';
                    }
                
                $('#searchArea').on('change', 'select', function(e){
                    page = 1;
                    search();
                });

                var getSelect = function(){
                    var data = {};
                    selects.each(function(i, select){
                        data[this.name] = this.value;
                    });
                    return data;
                }

                var search = function(){
                    var param = getSelect();
                    var page = param['page'] = 1;
                    //params = param;
                    var _url = url;
                    // if(routerModal === 'pro'){//正式环境
                    //     _url += 'q'+(p.district ? p.district : 0);
                    //     _url += 'p'+(p.property ? p.property : 0);
                    //     _url += '.html';
                    //     param = {};
                    // }
                    setTitle(param);
                    $('#listMore').addClass('hidden');
                    $('#school_list').html('');
                    getSearchData(param, function(r){
                        if(r.errno == '0'){
                            $('#body_loading').addClass('hidden');
                            insertList(r.rst.html, false);
                            isShowMore(parseInt(r.rst.total));
                        }
                    }, _url);
                    selected = true;
                }

                var getSearchData = function(p, fn, _url){
                    var _url = _url || url;
                    $('#body_loading').removeClass('hidden');
                    Base.send(_url, p, function(r){
                        
                        try{
                            r = $.type(r) === 'string' ? JSON.parse(r) : r;
                        }catch(e){
                            console.log('result error!');
                        }

                        fn && fn(r);
                    });
                }

                var getOption = function(opts, val){
                    var text;
                    $.each(opts, function(i, item){
                        if($(item).val() === val){
                            text = $(item).text();
                            return false;
                        }
                    });
                    return text;
                }

                var setTitle = function(p){
                    var titleDom = $('h2.mod-hd'), title = '';
                    if(p.district === '' && p.property === ''){
                        title = city+'全部学校';
                    }else if(p.district === ''){
                        title = city+getOption(selects.eq(1).find('option'), p.property);
                    }else if(p.property === ''){
                        title = getOption(selects.eq(0).find('option'), p.district)+'全部学校';
                    }else{
                        title = getOption(selects.eq(0).find('option'), p.district)+getOption(selects.eq(1).find('option'), p.property||p.gz_property);
                    }
                    titleDom.text(title);
                };
                
                var insertList = function(data, isInsert){
                    if(isInsert)
                        $('#school_list').append(data);
                    else
                        $('#school_list').html(data);
                }

                var isShowMore = function(total){
                    if($('#school_list').children().length >= total){
                        $('#listMore').addClass('hidden');
                    }else{
                        $('#listMore').css('visibility','visible').removeClass('hidden');
                    }
                }

                myFastClick(eventType, $('#listMore'), function(e){
                    var param = getSelect();
                    if(!(selected || param.district || param.property)){
                        param = params;
                    }                                       
                    param.page = ++page;
                    $(this).addClass('hidden');
                    params = param;
                    var _url = url;
                    getSearchData(params, function(r){
                        if(r.errno == '0'){
                            $('#body_loading').addClass('hidden');
                            insertList(r.rst.html, true); 
                            isShowMore(parseInt(r.rst.total||0));                            
                        }
                    }, _url);
                });

                isShowMore($('#school_list').children().length === 0 ? 0 : parseInt(G.PD.get('total')||0));
            break;
            case 'view' : 
                //更多
                $('div.js-hide').on('click', function(e){
                    e.preventDefault();
                    $(this).hide().parent().find('table tr').each(function(i, tr){
                        if($(tr).hasClass('hidden')) $(tr).removeClass('hidden');
                    });
                    // $(this).hide().parent().find('table tr:hidden').display(1);
                });



                //显示QQ群
                $.getJSON('http://m.gaofen.com/ajax/qqgroup?callback=?', {
                    channel : 'school', 
                    city : remote_ip_info.city,
                    __rnd : +new Date,
                    section : location.href.indexOf('gaokao') > -1 ? 'zhongkao' : 'xsc'
                }, function(r){
                    // if(r.err == '0'){        
                        try{
                            if(r.rst){
                                $('div.page-content').append(r.rst);
                            }
                        }catch(e){

                        }
                    // }
                            
                }, 'jsonp');

            break;
        }

    }

    function getInputVal(dom){
        return $.trim($(dom).val());
    }

    //搜索区
    function searchCmp(fn){
        var searchBar = $('#searchBar'), ipt = searchBar.find('input');
        if(searchBar.length === 0) return;
        $('#search').on(eventType, function(e){
            searchBar.toggleClass('hidden');
            e.preventDefault();
            ipt.val('');
            setTimeout(function(){
                $('#header').toggleClass('show-search-bar');                       
            }, 0);

            $(this).toggleClass('active');
            
        }).on('click', function(e){
            e.preventDefault();
        });

        myFastClick(eventType, searchBar.find('button'), function(e){
            search();
        });

        // searchBar.find('button').on('click' || eventType, function(e){//tap 事件有点透现象
        //     e.preventDefault();
        //     e.stopPropagation();
        //     search();
        // });

        function search(){
            var v  = Base.encode(getInputVal(ipt));
            if(v){
                if(fn) fn(v);
                else{
                    // Base.getRouter(router[routerModal].searchBarUri+v);
                     win.location.href = Base.getRouter(router[routerModal].searchBarUri+v);
                }
            }else ipt.focus();
        }

        $('body').on('keyup', function(e){
            if(13 === e.keyCode){
                search();
            }
        })       
    }

    $(function(){

        var moudule_name = Gaofen.PD.get('moudule_name');//区分模块，gz为高中，cz表示初中
        if(moudule_name === 'gz'){
            router = {
                dev : {

                    searchBarUri : '/gz/mobile_school/list?q=',//搜索区

                    selectUri : '/gz/mobile_school/ajaxSchools',//下拉区

                    pageListUri : 'gz/mobile_school/ajaxSchools'//更多

                },

                pro : {

                    searchBarUri : 'list.html?q=',

                    selectUri : 'gaozhong-ajaxSchools.html',

                    pageListUri : 'gaozhong-ajaxSchools.html'
                }

            }
        }

        initReady();
    });

})(Zepto, window, Gaofen);