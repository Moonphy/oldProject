/* 小动态瀑布流
 * nano from https://github.com/trix/nano.git
 *
 * 返回 json 的结构:
 * {
 *    "photos": {
 *      "total": 60, 
 *          "photo": [
 *              "name": "heyun51@gmail.com",
 *              "price": "359.00",
 *              "id": 1796,
 *              "quantity": 0
 *          ], 
 *      "perpage": 10, 
 *      "page": 4, 
 *      "pages": 6
 *    },
 *    "stat": "ok"
 * }
 * */
;(function($) {
    $.fn.extend({
        miniWaterfall: function(options) {
            // 默认值
            settings = $.extend({
                url: window.location.href,
                row: 4,
                row_id: "waterfall_id_",
                row_class: "waterfall_class",
                tpl_id: "#tpl",
                loading_id: "#loading",
                page: 1,
                perpage: 10
            }, options);

            var div_html = "";
            var divs = new Array();
            for(i=1; i<=settings.row; i++) {
                div_html += '<div id="' + settings.row_id + i + '" class="' + settings.row_class + '"></div>';
                divs.push("#" + settings.row_id + i);
            }
            $(this).append(div_html); // 生成列数
            $(this).after('<div id="page" style="display: none" data-page="' + settings.page + '" data-perpage="' + settings.perpage + '"></div>');

            // 每个块的插入
            function waterfall_put(json) {
                var div_hg = new Array();
                $.each(divs, function(i, n) {
                    div_hg.push({"hg": $(n).outerHeight(), "id": n});
                });

                // 按从低到高 排序 div_hg
                div_hg.sort(function(a, b) {
                    return a.hg - b.hg;
                });

                $.each(json, function(i, n) {
                    $(div_hg[i%settings.row].id).append($(settings.tpl_id).nano(n));
                });
            }

            var current_p = 0;
            $(window).scroll(function(){
                if ($(document).height() - $(this).scrollTop() - $(this).height()<100) {
                    var page = $('#page').attr('data-page');
                    var perpage = $('#page').attr('data-perpage');

                    if(page != current_p) {
                        $(settings.loading_id).show();
                        current_p = page;
                        $.getJSON(settings.url, {"page": page, "perpage": perpage}, function(d) {
                            if (d.stat !== 'ok') {
                                alert('load data error!');
                                $(settings.loading_id).hide();
                                return;
                            }
                            waterfall_put(d.photos.photo);

                            page++;
                            if(page <= d.photos.pages) {
                                $('#page').attr('data-page', page);
                            }
                            $(settings.loading_id).hide();
                        });
                    }
                }
            });
        },
        nano: function(data) {
            return $(this).html().replace(/\{([\w\.]*)\}/g, function(str, key) {
                var keys = key.split("."), v = data[keys.shift()];
                for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
                return (typeof v !== "undefined" && v !== null) ? v : "";
            });
        }
    });
})(jQuery);
