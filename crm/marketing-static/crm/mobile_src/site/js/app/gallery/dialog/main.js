define(function(require,exports,module) {
    var $ = require('zepto');
        Mask = require('../mask/main');
    ;(function ($, window, undefined) {
        require('css!./dialog.css');
        var win = $(window),
            isLock = false;

        var Dialog = function (options) {
            this.settings = $.extend({}, Dialog.defaults, options);
            this.init();
        }
        /**
         * 默认配置
         */
        Dialog.defaults = {
            clsPrefix:'ui-dialog',
            // 内容
            content: '加载中...',
            // 标题
            title: 'load',
            // 宽度
            width: 'auto',
            // 高度
            height: 'auto',
            // 确定按钮回调函数
            ok: null,
            // 取消按钮回调函数
            cancel: null,
            // 关闭后回调函数
            onclose: null,
            // xiaohui callback
            ondestory:null,
            // 确定按钮文字
            okText: '确定',
            // 取消按钮文字
            cancelText: '取消',
            // 自动关闭时间(毫秒)
            time: null,
            // 是否锁屏
            lock: true,
            // z-index值
            zIndex: 9999
        }

        Dialog.prototype = {

            /**
             * 初始化
             */
            init: function () {
                if (this.settings.lock) {
                    this.lock();
                }
                if(!this.dialog){
                    this.create();
                }else{
                    this.dialog.show();
                }
                if (!isNaN(this.settings.time) && this.settings.time != null) {
                    this.time();
                }

            },

            /**
             * 创建
             */
            create: function () {
                // HTML模板
                var templates = require('text!./main.tpl');    
                var title = this.settings.title,
                    animate = '';

                switch (title){
                    case 'load':
                        animate = 'faa-spin animated faa-slow'
                        break;
                }
                templates = templates.replace(/\{title\}/,title)
                .replace(/\{prefix\}/g,this.settings.clsPrefix)
                .replace(/\{animate\}/g,animate)
                .replace(/\{content\}/,this.settings.content);

                // 追回到body
                this.dialog = $('<div>').addClass(this.settings.clsPrefix)
                .css({zIndex: this.settings.zIndex ++ })
                .html(templates).prependTo('body');

                // 设置ok按钮
                $.isFunction(this.settings.ok) && this.ok()
                // 设置cancel按钮
                $.isFunction(this.settings.cancel) && this.cancel();
                // 设置大小
                this.size();
                // 设置位置
                this.position();

            },

            /**
             * ok
             */
            ok: function () {
                var _this = this,
                    footer = this.dialog.find('.'+this.settings.clsPrefix+'-footer');

                $('<a>', {
                    href: 'javascript:;',
                    text: this.settings.okText
                }).on("click", function () {
                    var okCallback = _this.settings.ok();
                    if (okCallback == undefined || okCallback) {
                        _this.close();
                    }

                }).addClass('ui-dialog-ok').prependTo(footer);

            },

            /**
             * cancel
             */
            cancel: function () {

                var _this = this,
                    footer = this.dialog.find('.ui-dialog-footer');

                $('<a>', {
                    href: 'javascript:;',
                    text: this.settings.cancelText
                }).on("click", function () {
                    var cancelCallback = _this.settings.cancel();
                    if (cancelCallback == undefined || cancelCallback) {
                        _this.close();
                    }
                }).addClass('ui-dialog-cancel').appendTo(footer);

            },

            /**
             * onClose
             */
            onClose: function () {
                // 设置close回调函数
                $.isFunction(this.settings.onclose) && this.settings.onclose();
            },
            onDestory: function(){
                $.isFunction(this.settings.ondestory) && this.settings.ondestory();
            },

            /**
             * 设置大小
             */
            size: function () {

                var content = this.dialog.find('.ui-dialog-content'),
                    wrap = this.dialog.find('.ui-dialog-wrap');

                content.css({
                    width: this.settings.width,
                    height: this.settings.height
                });
                //wrap.width(content.width());
            },

            /**
             * 设置位置
             */
            position: function () {

                var _this = this,
                    winWidth = win.width(),
                    winHeight = win.height(),
                    scrollTop = 0;

                this.dialog.css({
                    left: (winWidth - _this.dialog.width()) / 2,
                    top: (winHeight - _this.dialog.height()) / 2 + scrollTop
                });

            },

            /**
             * 设置锁屏
             */
            lock: function () {
                if(this.mask)
                    this.mask.show();
                else{
                    this.mask = Mask();
                }
                this.clock = true;
            },

            /**
             * 关闭方法
             */
            close: function (destory) {
                if (this.settings.lock && this.clock) {
                    if(destory)
                        this.mask.close();
                    else
                        this.mask.destory();
                }
                if(destory){
                    this.dialog.remove();
                    this.onDestory();
                }
                else{
                    this.dialog.hide();
                    this.onClose();
                }
            },
            /***
            * 
            */
            destory: function(){
                
            },

            /**
             * 定时关闭
             */
            time: function () {

                var _this = this;

                this.closeTimer = setTimeout(function () {
                    _this.close();
                }, this.settings.time);

            },
            show:function(){
                this.init();
            }

        }

        module.exports = Dialog;

    })(require('zepto'), window);
});