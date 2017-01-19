/**
 * Created by Administrator on 2017-1-5.
 */
/*
;(function ($, window) {
    var JZ_TEMPLATE = {
        article_tmp: function (article_url, article_img, article_title, article_zan, article_comments, article_time) {
            return '<div class="ui-thumbnail"><a href="' + article_url +
                '" title="" target="_blank" class="img-wrap"><img src="' + article_img +
                '" alt=""></a><div class="ui-thumbnail-content"><a href="' + article_url +
                '" title="" target="_blank" class="thumbnail-title">' + article_title +
                '</a><div class="thumbnail-tips mt10"><span><i class="icon icon-fav-grey"></i>' + article_zan +
                '</span><span><i class="icon icon-msg-grey"></i>' + article_comments +
                '</span><span class="fr">' + article_time +
                '</span></div></div></div>'
        },
        special_tmp: function (special_url, special_img, special_title, special_comments, special_fav) {
            return '<div class="ui-thumbnail ui-thumbnail-special"><a href="' + special_url +
                '" title="" target="_blank" class="img-wrap"><img src="' + special_img +
                '" alt=""/></a><div class="ui-thumbnail-content special-thumbnail-content"><a href=' + special_url +
                '" title="" target="_blank" class="thumbnail-title">'+ special_title +
                '</a><div class="thumbnail-tips mt5">共' + special_comments + '篇内容，' + special_fav + '收藏</div> </div> </div>'
        },
        comment_tmp: function (user_avatar, lev, user_name, add_time, message, fav_count, reply_user_name) {
            var COMMENT_TMP_HEADER = '<li class="comment-item"><div class="avatar-container fl">'+
                '<div class="ui-avatar"><img src="<?php echo G_STATIC_URL; ?>/'+ user_avatar + '"></div><i class="avatar-lev hidden">Lv.' + lev + '</i></div>'+
                '<div class="comment-item-content"><div class="item-header"><span class="avatar-user mr10">'+ user_name +'</span>';
            var COMMENT_TMP_REPLY;
            if(typeof(reply_user_name) == 'undefined'){
                COMMENT_TMP_REPLY = '<span>' + add_time + '</span></div>';
            }else{
                COMMENT_TMP_REPLY = '<span class="font-md font-blue mr10">回复</span><span class="avatar-user mr10">'+ reply_user_name +'</span><span>' + add_time + '</span></div>';
            }
            var COMMENT_TMP_CONTENT = '<div class="item-content"><p>'+ message +'</p></div>'+
                '<div class="item-reply"><a href="javascript: void(0);" title="" class="btn-zan"><i class="icon icon-zan"></i><span>'+
                fav_count +'</span></a><a href="javascript: void(0);" title="" class="btn-comment"><i class="icon icon-msg-grey"></i></a></div></div></li>';
            return COMMENT_TMP_HEADER + COMMENT_TMP_REPLY + COMMENT_TMP_CONTENT;
        },
        loadingBox: '<div class="loader-box-f mt20"><span></span><span></span><span></span><span></span><span></span></div>'
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
        load_article: function(url, selector, container, start_page, type, callback){
            if(!start_page){
                start_page = 1
            }
            if(selector.attr('data-page') == undefined){
                selector.attr('data-page', start_page);
            }else{
                selector.attr('data-page', parseInt(selector.attr('data-page')) + 1);
            }

            //selector.on('click', function () {
                //var _this = this;

            $.get(url + selector.attr('data-page') + '.js', function(result){
                var data = $.parseJSON(result);
                console.log(data[2]);
                for (var i = 0; i < result.length; i++) {
                    var article_url = result[i].article_url,
                        article_img = result[i].article_img,
                        article_title = result[i].article_title,
                        article_zan = result[i].article_zan,
                        article_comments = result[i].article_comments,
                        article_time = result[i].article_time;
                    var tmp = JZ_TEMPLATE.article_tmp(article_url, article_img, article_title, article_zan, article_comments, article_time);
                    console.log(article_url, article_img, article_title, article_zan, article_comments, article_time);
                    container.append(tmp)
                }
            })
            //})
        },

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
})(jQuery,window);*/
