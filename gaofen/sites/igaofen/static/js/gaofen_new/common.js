/**
 * Created by Administrator on 2016-12-23.
 */

;(function ($, window) {
    var JZ_TEMPLATE = {
        article_tmp: function (opts) {
            return '<div class="ui-thumbnail"><a href="' + opts.article_url +
                '" title="" target="_blank" class="img-wrap"><img src="' + opts.article_img +
                '" alt=""></a><div class="ui-thumbnail-content"><a href="' + opts.article_url +
                '" title="" target="_blank" class="thumbnail-title">' + opts.article_title +
                '</a><div class="thumbnail-tips mt10"><span><i class="icon icon-fav-grey"></i>' + opts.article_zan +
                '</span><span><i class="icon icon-msg-grey"></i>' + opts.article_comments +
                '</span><span class="fr">' + opts.article_time +
                '</span></div></div></div>'
        },
        special_tmp: function (opts) {
            return '<div class="ui-thumbnail ui-thumbnail-special"><a href="' + opts.special_url +
                '" title="" target="_blank" class="img-wrap"><img src="' + opts.special_img +
                '" alt=""/></a><div class="ui-thumbnail-content special-thumbnail-content"><a href=' + opts.special_url +
                '" title="" target="_blank" class="thumbnail-title">'+ opts.special_title +
                '</a><div class="thumbnail-tips mt5">共' + opts.article_num + '篇内容</div> </div> </div>'
        },
        comment_tmp: function (opts) {
            var COMMENT_TMP_HEADER = '<li class="comment-item"><div class="avatar-container fl">'+
                '<div class="ui-avatar"><img src="'+ opts.user_avatar + '"></div><i class="avatar-lev hidden">Lv.' + opts.lev + '</i></div>'+
                '<div class="comment-item-content" data-id="'+ opts.uid +'"><div class="item-header"><span class="avatar-user mr10">'+ opts.user_name +'</span>';
            var COMMENT_TMP_REPLY;
            if(typeof(opts.reply_user_name) == 'undefined'){
                COMMENT_TMP_REPLY = '<span>' + opts.add_time + '</span></div>';
            }else{
                COMMENT_TMP_REPLY = '<span class="font-md font-blue mr10">回复</span><span class="avatar-user mr10">'+ opts.reply_user_name +'</span><span>' + opts.add_time + '</span></div>';
            }
            var COMMENT_TMP_CONTENT;
            if(typeof(opts.user_id) != 'undefined'){
                COMMENT_TMP_CONTENT = '<div class="item-content"><p>'+ opts.message +'</p></div>'+
                    '<div class="item-reply"><a href="javascript: void(0);" title="" class="btn-zan" data-item-id="' + opts.item_id + '"><i class="icon icon-zan"></i><span>'+
                    opts.fav_count +'</span></a><a href="javascript: void(0);" title="" class="btn-comment"><i class="icon icon-msg-grey"></i></a></div></div></li>';
            }else{
                COMMENT_TMP_CONTENT = '<div class="item-content"><p>'+ opts.message +'</p></div></div></li>';
            }
            return COMMENT_TMP_HEADER + COMMENT_TMP_REPLY + COMMENT_TMP_CONTENT;
        },
        comment_form: '<div class="add-comment-form clearfix mt5"><form><textarea class="add-comment-area"></textarea><a href="javascript: void(0);" class="btn btn-blue btn-sm fr btn-reply">回复</a></form></div>',
        loadingBox: '<div class="loader-box-f mt20"><span></span><span></span><span></span><span></span><span></span></div>',
        loadingBoxFixed: '<div class="loader-box-fixed"><div class="icon-loading"><div class="dot dot1"><i class="dot-t"></i><i class="dot-b"></i></div><div class="dot dot2"><i class="dot-t"></i><i class="dot-b"></i></div><div class="dot dot3"><i class="dot-t"></i><i class="dot-b"></i></div><div class="dot dot4"><i class="dot-t"></i><i class="dot-b"></i></div></div></div>'
    };

    var JZ = {
        loading: function(type){
            if(!$('.loader-box-f').length){
                $('#btn-more').before(JZ_TEMPLATE.loadingBox);
            }
            if(type == 'show'){
                if($('.loader-box-f').css('display') == 'block'){
                    return false
                }
                $('.loader-box-f').fadeIn();
            }
            else{
                $('.loader-box-f').fadeOut();
            }
        },
        loading_fixed: function(type){
            if(!$('.loader-box-fixed').length){
                $('.wrap').append(JZ_TEMPLATE.loadingBoxFixed);
            }
            if(type == 'show'){
                if($('.loader-box-fixed').css('display') == 'block'){
                    return false
                }
                $('.loader-box-fixed').fadeIn();
            }
            else{
                $('.loader-box-fixed').fadeOut();
            }
        },

        // 宝库点击加载更多栏目
        load_treasury_article: function(whole_url){
            JZ.loading('show');

            var _page = $('#btn-more').attr('data-page');
            if(!_page){
                _page = 1
            }
            if(_page == undefined){
                $('#btn-more').attr('data-page', _page);
            }

            _get = 0;

            $.post(whole_url, {'page':_page}, function(result){
                JZ.loading('hidden');

                var data = $.parseJSON(result);
                if (data.rsm.length) {
                    for (var i = 0; i < data.rsm.length; i++) {
                        var opts = {
                            article_url: G_BASE_URL + '/article/' + data.rsm[i].id,
                            article_img: data.rsm[i].article_cover_url_big,
                            article_title: data.rsm[i].title,
                            article_zan: data.rsm[i].fav_num,
                            article_comments: data.rsm[i].comments,
                            article_time: data.rsm[i].add_date
                        };
                        var tmp = JZ_TEMPLATE.article_tmp(opts);
                        $('.treasury-group').append(tmp)
                    }
                    $('#btn-more').attr('data-page', parseInt($('#btn-more').attr('data-page')) + 1);
                    _get = 1;
                } else {
                    $('#btn-more').text('没有更多了，不要点我了~~').addClass('disabled')
                }
            })
        },
        // 点击加载更多精选
        load_feature_article: function(){
            JZ.loading('show');

            var _page = $('#btn-more').attr('data-page');
            if(!_page){
                _page = 1
            }
            if(_page == undefined){
                $('#btn-more').attr('data-page', _page);
            }

            _get = 0;

            $.post(G_BASE_URL + '/feature_article/?page=' + _page, function(result){
                JZ.loading('hidden');

                var data = $.parseJSON(result);
                if (data.rsm.length) {
                    for (var i = 0; i < data.rsm.length; i++) {
                        var opts = {
                            article_url: G_BASE_URL + '/article/' + data.rsm[i].id,
                            article_img: data.rsm[i].article_cover_url_big,
                            article_title: data.rsm[i].title,
                            article_zan: data.rsm[i].fav_num,
                            article_comments: data.rsm[i].comments,
                            article_time: data.rsm[i].add_date
                        };
                        var tmp = JZ_TEMPLATE.article_tmp(opts);
                        $('.treasury-group').append(tmp)
                    }
                    $('#btn-more').attr('data-page', parseInt($('#btn-more').attr('data-page')) + 1);
                    _get = 1;
                } else {
                    $('#btn-more').text('没有更多了，不要点我了~~').addClass('disabled')
                }
            })
        },
        // 点击加载更多专题
        load_special: function(selector, _type, start_page, callback){
            JZ.loading('show');

            if(!start_page){
                start_page = 1
            }
            if(selector.attr('data-page') == undefined){
                selector.attr('data-page', start_page);
            }

            var _page = selector.attr('data-page');

            $.post(G_BASE_URL + '/special/?type=' + _type + '&page=' + _page, function(result){
                JZ.loading('hidden');

                var data = $.parseJSON(result);
                if (data.rsm.length) {
                    for (var i = 0; i < data.rsm.length; i++) {
                        var opts = {
                            special_url: G_BASE_URL + '/special/detail/' + data.rsm[i].id,
                            special_img: data.rsm[i].special_cover_url,
                            special_title: data.rsm[i].special_title,
                            //special_fav: data.rsm[i].is_recommend,
                            article_num: data.rsm[i].article_num
                        };
                        var tmp = JZ_TEMPLATE.special_tmp(opts);
                        $('.treasury-group').append(tmp)
                    }
                    selector.attr('data-page', parseInt(selector.attr('data-page')) + 1);
                    _get = 1;
                } else {
                    _get = 0;
                    selector.text('没有更多了，不要点我了~~').addClass('disabled')
                }
            })
        },
        // 搜索页加载
        load_search: function (url, type) {
            JZ.loading('show');

            var _page = $('#btn-more').attr('data-page');
            if(!_page){
                _page = 1
            }
            if(_page == undefined){
                $('#btn-more').attr('data-page', _page);
            }

            switch (type){
                case 'article' :
                    JZ.load_search_article(_url, _page);
                    break;
                case 'special' :
                    JZ.load_search_special(_url, _page);
                    break;
                case 'question' :
                    JZ.load_search_question(_url, _page)
            }
        },
        load_search_question: function( url, _page){
            $.get(url + '?page=' + _page, function(result){
                JZ.loading('hidden');

                var data = $.parseJSON(result);
                if (data.rsm.length) {
                    for (var i = 0; i < data.rsm.length; i++) {
                        var opts = {
                            article_url: G_BASE_URL + '/question/' + data.rsm[i].question_id,
                            article_img: data.rsm[i].question_cover_url_big,
                            article_title: data.rsm[i].question_content,
                            article_zan: data.rsm[i].thanks_count,
                            article_comments: data.rsm[i].answer_count,
                            article_time: data.rsm[i].add_date
                        };
                        var tmp = JZ_TEMPLATE.article_tmp(opts);
                        $('.treasury-group').append(tmp)
                    }
                    $('#btn-more').attr('data-page', parseInt($('#btn-more').attr('data-page')) + 1);
                    _get = 1;
                } else {
                    _get = 0;
                    $('#btn-more').text('没有更多了，不要点我了~~').addClass('disabled')
                }
            })
        },
        load_search_special: function( url, _page){
            $.get(url + '?page=' + _page, function(result){
                JZ.loading('hidden');

                var data = $.parseJSON(result);
                if (data.rsm.length) {
                    for (var i = 0; i < data.rsm.length; i++) {
                        var opts = {
                            special_url: G_BASE_URL + '/special/detail/' + data.rsm[i].id,
                            special_img: data.rsm[i].special_cover_url_big,
                            special_title: data.rsm[i].special_title,
                            article_num: data.rsm[i].article_num
                        };
                        var tmp = JZ_TEMPLATE.special_tmp(opts);
                        $('.treasury-group').append(tmp)
                    }
                    $('#btn-more').attr('data-page', parseInt($('#btn-more').attr('data-page')) + 1);
                    _get = 1;
                } else {
                    _get = 0;
                    $('#btn-more').text('没有更多了，不要点我了~~').addClass('disabled')
                }
            })
        },
        load_search_article: function( url, _page){
            $.get(url + '?page=' + _page, function(result){
                JZ.loading('hidden');

                var data = $.parseJSON(result);
                if (data.rsm.length) {
                    for (var i = 0; i < data.rsm.length; i++) {
                        var opts = {
                            article_url: G_BASE_URL + '/article/' + data.rsm[i].id,
                            article_img: data.rsm[i].article_cover_url_big,
                            article_title: data.rsm[i].title,
                            article_zan: data.rsm[i].fav_num,
                            article_comments: data.rsm[i].comments,
                            article_time: data.rsm[i].add_date
                        };
                        var tmp = JZ_TEMPLATE.article_tmp(opts);
                        $('.treasury-group').append(tmp)
                    }
                    $('#btn-more').attr('data-page', parseInt($('#btn-more').attr('data-page')) + 1);
                    _get = 1;
                } else {
                    _get = 0;
                    $('#btn-more').text('没有更多了，不要点我了~~').addClass('disabled')
                }
            })
        },
        // 点赞
        article_comment_vote: function(selector, item_id, rating, type) {
            JZ.loading_fixed('show');
            $.post(G_BASE_URL + '/article/ajax/article_vote/', {item_id: item_id, rating: rating, type: type }, function (result) {
                JZ.loading_fixed('hidden');
                if (result.errno != 1) {
                    alert(result.err);
                } else {
                    var zanNode = selector.find('span');
                    var zanNum = parseInt(zanNode.text());
                    zanNode.text(zanNum + 1);
                }
            }, 'json');
        },
        // 加载更多评论
        load_comment_list: function (BASE_URL) {
            JZ.loading('show');

            $.get(BASE_URL, function (result) {
                var data = $.parseJSON(result);
                if (data.rsm.length) {
                    for (var i = 0;i < data.rsm.length; i++){
                        var opts = {
                            user_avatar: data.rsm[i].avatar_url,
                            lev: data.rsm[i].user_info.fans_count,
                            user_name: data.rsm[i].user_info.user_name,
                            add_time: JZ.timestampToday(parseInt(data.rsm[i].add_time)),
                            message: data.rsm[i].message,
                            fav_count: data.rsm[i].votes,
                            reply_user_name: data.rsm[i].at_user_info ? data.rsm[i].at_user_info.user_name : undefined,
                            user_id: G_USER_ID ? G_USER_ID : undefined,
                            item_id: data.rsm[i].id,
                            uid: data.rsm[i].uid
                        };

                        $('.comment-list').append(JZ_TEMPLATE.comment_tmp(opts));
                    }
                    _get = 0;
                } else {
                    if (!$('#comment-max').length) {
                        $('.comment-list').append('<div class="comment-none mt50 mb30" id="comment-max" data-get="0"><span class="font-blue-dark">我是有底线的</span></div>');
                    }
                }
            });
            comment_page += 1;
            JZ.loading('hidden');
        },
        // 评论文章
        save_article_comment: function (selector, article_id,message,post_hash) {
            JZ.loading_fixed('show');
            $.post(G_BASE_URL + '/article/ajax/save_comment/', {article_id: article_id, message: message, post_hash: post_hash }, function (result) {
                JZ.loading_fixed('hidden');
                if (result.errno != 1) {
                    alert(result.err);
                } else {
                    selector.parent().find('textarea').val('');
                    window.location.reload();
                }
            }, 'json');
        },
        // 回复评论
        save_comment: function (selector, article_id, message, post_hash, at_uid) {
            JZ.loading_fixed('show');
            $.post(G_BASE_URL + '/article/ajax/save_comment/', {article_id: article_id, message: message, post_hash: post_hash, at_uid: at_uid }, function (result) {
                JZ.loading_fixed('hidden');
                if (result.errno != 1) {
                    alert(result.err);
                } else {
                    selector.parent().remove();
                    window.location.reload();
                }
            }, 'json');
        },
        // 收藏文章标签
        add_favorite_tag: function() {
            $.post(G_BASE_URL + '/favorite/ajax/update_favorite_tag/', {
                'item_id' : $('#favorite_form input[name="item_id"]').val(),
                'item_type' : $('#favorite_form input[name="item_type"]').val(),
                'tags' : $('#favorite_form .add-input').val()
            }, function (result) {
                if (result.errno == 1) {
                    $('.aw-favorite-box .aw-favorite-tag-list').show();
                    $('.aw-favorite-box .aw-favorite-tag-add').hide();

                    $('.aw-favorite-tag-list ul').prepend('<li class="active"><a data-value="' + $('#favorite_form .add-input').val() + '"><span class="title">' + $('#favorite_form .add-input').val() + '</span></a><i class="icon icon-followed"></i></li>');
                    $('#favorite_form .add-input').val('')
                }
            }, 'json');
        },
        get_favorite_tag: function () {
            $.get(G_BASE_URL + '/favorite/ajax/get_favorite_tags/', function (result) {
                var html = '';
                $.each(result, function (i, e) {
                    html += '<li><a data-value="' + e['title'] + '"><span class="title">' + e['title'] + '</span></a><i class="icon icon-followed"></i></li>';
                });

                $('.aw-favorite-tag-list ul').append(html);

                $.post(G_BASE_URL + '/favorite/ajax/get_item_tags/', {
                    'item_id' : $('#favorite_form input[name="item_id"]').val(),
                    'item_type' : $('#favorite_form input[name="item_type"]').val()
                }, function (result) {
                    if (result != null) {
                        $.each(result, function (i, e) {
                            var index = i;

                            $.each($('.aw-favorite-tag-list ul li .title'), function (i, e) {
                                if ($(this).text() == result[index]) {
                                    $(this).parents('li').addClass('active');
                                }
                            });
                        });
                    }
                }, 'json');
                // 添加或删除收藏标签
                $(document).on('click', '.aw-favorite-tag-list ul li a', function() {
                    var _this = this,
                        addClassFlag = true, url = G_BASE_URL + '/favorite/ajax/update_favorite_tag/';

                    if ($(this).parents('li').hasClass('active')) {
                        url = G_BASE_URL + '/favorite/ajax/remove_favorite_tag/';

                        addClassFlag = false;
                    }

                    $.post(url, {
                            'item_id' : $('#favorite_form input[name="item_id"]').val(),
                            'item_type' : $('#favorite_form input[name="item_type"]').val(),
                            'tags' : $(_this).attr('data-value')
                        }, function (result) {
                            if (result.errno == 1) {
                                if (addClassFlag) {
                                    $(_this).parents('li').addClass('active');
                                } else {
                                    $(_this).parents('li').removeClass('active');
                                }
                            }
                        }, 'json');
                });

            }, 'json');
        },
        // 文章分享
        share_out: function (options) {
            var url = options.url || window.location.href, pic = '', title;

            if (options.title) {
                title = options.title + ' - ' + G_SITE_NAME;
            } else {
                title = $('title').text();
            }

            shareURL = 'http://www.jiathis.com/send/?webid=' + options.webid + '&url=' + url + '&title=' + title +'';

            if (options.content) {
                if ($(options.content).find('img').length) {
                    shareURL = shareURL + '&pic=' + $(options.content).find('img').eq(0).attr('src');
                }
            }

            window.open(shareURL);
        },


        // 日期时间格式化
        timestampToday: function (timestamp, beforeDay) {
            if (timestamp === '') return '';
            timestamp = JZ.fdate(timestamp);
            var nowTime = new Date();
            var dateTimes = 24 * 60 * 60 * 1000;
            beforeDay = (beforeDay || 3) * dateTimes;
            var bigTimes = nowTime - timestamp;
            if (bigTimes > beforeDay) { // 如果时间已过去指定天数就直接显示日期，否则大于1天显示N天前，小于1天显示小时
                var D = JZ.splitDate(timestamp);
                return D.year + '-' + D.month + '-' + D.day
            }
            if (bigTimes > dateTimes) { // 显示几天前
                return Math.floor(bigTimes / dateTimes) + '天前'; // 几天前
            }
            if (bigTimes > 60 * 60 * 1000) { // 显示小时
                return Math.floor(bigTimes / (60 * 60 * 1000)) + '小时前'
            }
            if (bigTimes > 60 * 1000) {
                return Math.floor(bigTimes / (60 * 1000)) + '分钟前'
            }

            if (bigTimes > 1000) {
                return Math.floor(bigTimes / (1000)) + '秒前'
            }
            return '刚刚'
        },
        fdate: function (date) {
            if (typeof date === 'string') {
                date = Number(date)
            }
            if (date < 2000000000) {
                date *= 1000
            }
            return date
        },
        splitDate: function (date) {
            var formatDate = new Date(date);
            var year = formatDate.getFullYear().toString();
            var month = formatDate.getMonth() + 1 > 9 ? (formatDate.getMonth() + 1).toString() : '0' + (formatDate.getMonth() + 1).toString();
            var day = formatDate.getDate() > 9 ? formatDate.getDate().toString() : '0' + formatDate.getDate().toString();
            var hours = formatDate.getHours() > 9 ? formatDate.getHours().toString() : '0' + formatDate.getHours().toString();
            var minutes = formatDate.getMinutes() > 9 ? formatDate.getMinutes().toString() : '0' + formatDate.getMinutes().toString();
            var seconds = formatDate.getSeconds() > 9 ? formatDate.getSeconds().toString() : '0' + formatDate.getSeconds().toString();
            return {year: year, month: month, day: day, hours: hours, minutes: minutes, seconds: seconds}
        }
    };


    (function () {
        var headerSlide = $('.header-slide');
        if( headerSlide && headerSlide.length > 0){
            $(".link-treasury").on('mouseenter', function () {
                $(".header-slide").slideDown();
            });
            $(".header-slide").on('mouseleave', function () {
                $(this).slideUp();
            });
            var headerSwipe = new swipePC('#topSlide', {
                "size": 6,
                "scrollTime": 1000,
                "auto": false,
                "loop": false
            });
        }
    })();

    window.JZ_TEMPLATE = JZ_TEMPLATE;
    window.JZ = JZ;

})(jQuery,window);