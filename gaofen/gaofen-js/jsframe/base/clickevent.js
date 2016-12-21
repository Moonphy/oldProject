/**
 * @author  xiezhiwen
 * @class  Gaofen.ex.Event
 * 单击事件处理
 */
(function(G, $, win) {
    var undefined, Util = G.util;
    /**
     * @property data
     * 当前处理元素的rel数据
     * @type Object
     */
    function ActionEvent(rels) {
        this.q = rels;
        // 初始状态
        this.idx = -1;
        // end pos
        this.end = this.q.length - 1;
    };

    ActionEvent.prototype = {

        prevented : undefined,

        stopPropagationed : undefined,

        /**
         * 当前DOM路径内向上查找rel属性中包含name键的数据
         <pre><code>
         // rel="w:123456"
         var wbId = e.get('w');
         </code></pre>

         * @param {String} name
         * @return {String} value
         */
        get : function(name) {
            var r = this.getRel(name);
            return r && r.data && r.data[name];
        },
        /**
         * 返回经escape函数转义后的字符串数据
         * @param {String} name
         * @return {String}
         */
        escape : function(name) {
            var v = this.get(name);
            if (v !== undefined)
                return escape(v);
        },
        /**
         * 当前DOM路径内向上查找含有rel以name为键的元素
         * <pre><code>
         // 从当前产生事件的元素开始向上查找获得包含w字段的元素
         var parent = e.getEl('w');
         </code></pre>
         * @param {String} name
         * @return {HTMLElement}
         */
        getEl : function(name) {
            var r = this.getRel(name);
            return r && r.src;
        },

        /**
         * 清空元素rel数据。
         */
        clear : function(name) {
            var wrap = name ? this.getRel(name) : this;
            var jq = $(wrap.src);
            jq.data('gf_rel', null);
            jq.attr('rel', '');
        },
        /**
         * 保存一个键值对到含有name键的元素的rel属性中，如未指定name值，数据被保存到当前触发元素，即e.src中。<br/>
         */
        save : function(k, v, name) {
            var wrap = name ? this.getRel(name) : this;
            var jq = $(wrap.src);

            // 是否存在缓存
            var rel = jq.data('gf_rel');
            if (rel) {
                rel['data'][k] = v;
				//rel = wrap['data'];
            } else {
                rel = G.ex.Event.parseRel(jq.attr('rel'));
                rel[k] = v;
            }

            //wrap.data = rel;
            // 更新缓存
            jq.data('gf_rel', rel);

            var serial = [], _rel = rel['data'];
            for (var i in _rel) {
                var val = _rel[i] || '';
                serial.push(i + ':' + val.replace(':', '\\:').replace(',', '\\,'));
            }
            serial = serial.join(',');
            jq.attr('rel', serial);
        },

        /**
         * 上溯DOM获得rel含有name键元素或其子元素的jQuery对象
         *@param {String} name 字段名
         * @param {Selector} [child] 可查找元素下的子元素
         * @return {jQuery}
         */
        jq : function(name, child) {
            var jq = $(this.getEl(name));
            if (child)
                jq = jq.find(child);
            return jq;
        },

        // private
        getRel : function(name) {
            var set = this.q;
            for (var i = this.idx, end = this.end; i <= end; i++) {
                var d = set[i].data;
                if (d[name] !== undefined)
                    return set[i];
            }
        },

        // private
        _next : function() {
            var nxt = this.q[++this.idx];
            // 最终状态
            if (nxt === undefined)
                this.idx = 0;
            return nxt;
        },

        // private 拷贝包括当前状态等所有数据。
        clone : function() {
            var act = new ActionEvent(this.q);
            act.idx = 0;
            return act;
        },

        /**
         * 是否终止浏览器默认操作，<b>默认为终止</b>。<br/>
         常见的处理完checkbox或radio元素的事件后，调用该方法使得元素改变选择状态。<br/>
         * @param {Boolean} prevented
         */
        preventDefault : function(set) {
            this.prevented = set;
        },
        /**
         * 是否停止浏览器的事件冒泡，<b>默认为停止</b>。
         * 对于{@link Gaofen.ui.Base}组件，在有自身的actionMgr处理的同时，也有全局或更父层action处理的情况下，
         * 可以在{@link Gaofen.ui.Base#onactiontrig}方法中调用本方法将动作事件上传到父层，这样父层的监听器就能正确处理其它事件。
         * 例如：
         * <pre>
         * <code>
         new Gaofen.ui.Base({
         view:'#panel',
         actionMgr:true,
         // 默认的onactiontrig处理后是停止事件上传的，
         // 所以要手动开启以将未处理的提交到父层处理。
         onactiontrig:function(actEvent){
         switch(actEvent.get('e')){
         case 'local' :
         // do something local stuff here.
         break;

         // or else , take other events to parents.
         default:
         e.stopPropagation(false);
         break;
         }
         }
         });
         * </code>
         * </pre>
         * @param {Boolean} stopPropagation
         * @see #preventDefault
         */
        stopPropagation : function(set) {
            this.stopPropagationed = set;
        },
        /**
         * 标记当前动作，或获得当前动作标记。
         * 常用于标记以防止动作重复触发动作。
         * @param {Boolean} locked
         * @param {String} [name] name
         *<pre><code>
         // 锁定动作元素，使得不能再触发
         e.lock(1);
         // 待请求处理后恢复
         Gaofen.request.post(data, function(){
         // 解除锁定
         e.lock(0);
         });
         </code></pre>

         */
        lock : function(set, name) {
            var k = 'gf_e_' + this.data.e;
            if (name)
                k += '_' + name;
            if (set === undefined)
                return $(this.src).data(k);
            $(this.src).data(k, set);
        }
    };

    var Event = G.ex.Event = G.reg('Event', function(cfg) {

        cfg && $.extend(this, cfg);
        if (!this.actions)
            this.actions = {};
        if (!this.filters)
            this.filters = [];

        if (this.target) {
            this.bind(this.target);
            delete this.target;
        }

    });

    Event.parseRel = function(rel) {
        if ( typeof rel === 'string')
            return Util.parseKnV(rel);
        return Util.parseKnV($(rel).attr('rel'));
    };

    Event.collectRels = function(trigSource, stopEl, cache) {
        var rels, rel, self = this;

        if (cache === undefined)
            cache = true;
        // 往上收集rel
        Util.domUp(trigSource, function(el) {
            var jq = $(el);

            if (cache) {
                rel = jq.data('gf_rel');
                if (!rel) {
                    rel = jq.attr('rel');
                    if (rel) {
                        rel = {
                            src : el,
                            data : self.parseRel(rel)
                        };
                        jq.data('gf_rel', rel);
                    }
                }
            } else {
                rel = jq.attr('rel');
                if (rel)
                    rel = {
                        src : el,
                        data : self.parseRel(rel)
                    };
            }

            if (rel) {
                if (!rels)
                    rels = [];
                rels[rels.length] = rel;
            }

        }, stopEl);

        return rels;
    };

    var globalFilters = [];

    var extEvent = {

        bind : function(select, evt) {
            var self = this;
            if (select) {
                var js = select.jquery ? select : $(select);
                js.bind(evt || 'click', function(e) {
                    var rels = G.ex.Event.collectRels(e.target, this, this.cacheNodeData);
                    rels && self.fireRels(rels, e);
                });
            }
        },
        fireRels : function(rels, evt) {
            var er = new ActionEvent(rels);
            er.evt = evt;
            var rel, data, hs = globalFilters.length, hg = this.filters.length, handled, prevented, stopPropagationed;

            while ( rel = er._next()) {
                data = rel.data;
                if (data.e) {
                    er.src = rel.src;
                    er.data = data;
                    if (er.lock()) {
                        if (__debug)
                            console.warn('action  has been locked for resubmiting');
                        handled = true;
                        stopPropagationed = true;
                        prevented = true;
                        return;
                    }
                    var act = this.actions[data.e];
                    if (hs) {
                        handled = true;
                        if (this._fireArray(globalFilters, er, act) === false) {
                            stopPropagationed = er.stopPropagationed;
                            prevented = er.prevented;
                            break;
                        }
                    }

                    if (hg) {
                        handled = true;
                        if (this._fireArray(this.filters, er, act) === false) {
                            break;
                        }
                    }
                    stopPropagationed = er.stopPropagationed;
                    prevented = er.prevented;
                    if (act) {
                        // clone e
                        var hdE = er.clone();
                        hdE.src = er.src;
                        hdE.data = data;
                        hdE.evt = evt;
                        if (__debug)
                            console.log('act e:', hdE);
                        if (!handled)
                            handled = true;
                        if (act.h.call(this, hdE) === false) {
                            if (hdE.stopPropagationed !== undefined)
                                stopPropagationed = hdE.stopPropagationed;
                            if (hdE.prevented !== undefined)
                                prevented = hdE.prevented;
                            break;
                        }

                        if (hdE.stopPropagationed !== undefined)
                            stopPropagationed = hdE.stopPropagationed;
                        if (hdE.prevented !== undefined)
                            prevented = hdE.prevented;
                    }
                } else{
                    //console.log('null e:' + data);
				}
            }

            if (evt && handled) {
                // we defaultly preventDefault and stopPropagation
                if (prevented === undefined)
                    prevented = true;
                if (stopPropagationed === undefined)
                    stopPropagationed = true;

                if (prevented)
                    evt.preventDefault();

                if (stopPropagationed)
                    evt.stopPropagation();
            }

        },
        addFilter : function(filter, global) {
            global ? globalFilters.push(filter) : this.filters.push(filter);
            return this;
        },
        // 如果未注册action:，act有可能为空，所以act应用时要作空检查
        
        _fireArray : function(gs, e, act) {
            for (var i = 0, len = gs.length; i < len; i++)
                if (gs[i].call(this, e, act) === false)
                    return false;
        },
        reg : function(act, handler, cfg) {
            var d = {
                n : act,
                h : handler
            };
            if (cfg)
                $.extend(d, cfg);

            this.actions[act] = d;
            return this;
        }
    };

    $.extend(G.ex.Event.prototype, extEvent);

    G.reg('action', G.use('Event'));

})(Gaofen, jQuery, window);