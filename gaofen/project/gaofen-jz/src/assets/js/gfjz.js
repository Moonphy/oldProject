/**
 * Created by Administrator on 2017-1-5.
 */
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
        }
    };
    
    window.JZ_TEMPLATE = JZ_TEMPLATE;
    window.JZ = JZ;
})(jQuery,window);