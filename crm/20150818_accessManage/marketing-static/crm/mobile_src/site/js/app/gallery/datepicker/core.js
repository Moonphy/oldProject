define(function(require,exports,module) {
	module.exports = function($){
    ['width', 'height'].forEach(function (dimension) {
        $.fn[dimension] = function (value) {
            var offset,
                body = document.body,
                html = document.documentElement,
                Dimension = dimension.replace(/./, function (m) { return m[0].toUpperCase(); });
            if (value === undefined) {
                return this[0] == window ?
                    html['client' + Dimension] :
                    this[0] == document ?
                        Math.max(body['scroll' + Dimension], body['offset' + Dimension], html['client' + Dimension], html['scroll' + Dimension], html['offset' + Dimension]) :
                    (offset = this.offset()) && offset[dimension];
            } else {
                return this.each(function (idx) {
                    $(this).css(dimension, value);
                });
            }
        };
    });

    ['width', 'height'].forEach(function (dimension) {
        var offset, Dimension = dimension.replace(/./, function (m) { return m[0].toUpperCase(); });
        $.fn['outer' + Dimension] = function (margin) {
            var elem = this;
            if (elem) {
                var size = elem[0]['offset' + Dimension],
                    sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
                sides[dimension].forEach(function (side) {
                    if (margin) {
                        size += parseInt(elem.css('margin-' + side), 10);
                    }
                });
                return size;
            } else {
                return null;
            }
        };
    });

    ['width', 'height'].forEach(function (dimension) {
        var offset, Dimension = dimension.replace(/./, function (m) { return m[0].toUpperCase(); });
        $.fn['inner' + Dimension] = function () {
            var elem = this;
            if (elem[0]['inner' + Dimension]) {
                return elem[0]['inner' + Dimension];
            } else {
                var size = elem[0]['offset' + Dimension],
                    sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
                sides[dimension].forEach(function (side) {
                    size -= parseInt(elem.css('border-' + side + '-width'), 10);
                });

                return size;
            }
        };
    });

    ["Left", "Top"].forEach(function (name, i) {
        var method = "scroll" + name;

        function isWindow(obj) {
            return obj && typeof obj === "object" && "setInterval" in obj;
        }

        function getWindow(elem) {
            return isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
        }

        $.fn[method] = function (val) {
            var elem, win;
            if (val === undefined) {
                elem = this[0];
                if (!elem) {
                    return null;
                }
                win = getWindow(elem);
                // Return the scroll offset
                return win ? ("pageXOffset" in win) ? win[i ? "pageYOffset" : "pageXOffset"] :
                win.document.documentElement[method] ||
                win.document.body[method] :
                    elem[method];
            }

            // Set the scroll offset
            this.each(function () {
                win = getWindow(this);
                if (win) {
                    var xCoord = !i ? val : $(win).scrollLeft(),
                        yCoord = i ? val : $(win).scrollTop();
                    win.scrollTo(xCoord, yCoord);
                } else {
                    this[method] = val;
                }
            });
        };
    });

    // Fix zepto.js extend to work with undefined parameter
    $._extend = $.extend;
    $.extend = function () {
        arguments[0] = arguments[0] || {};
        return $._extend.apply(this, arguments);
    };


    function testProps(props) {
        var i;
        for (i in props) {
            if (mod[props[i]] !== undefined) {
                return true;
            }
        }
        return false;
    }

    function testPrefix() {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            p;

        for (p in prefixes) {
            if (testProps([prefixes[p] + 'Transform'])) {
                return '-' + prefixes[p].toLowerCase() + '-';
            }
        }
        return '';
    }

    function getCoord(e, c) {
        var org = e.originalEvent,
            ct = e.changedTouches;
        return ct || (org && org.changedTouches) ? (org ? org.changedTouches[0]['page' + c] : ct[0]['page' + c]) : e['page' + c];
    }

    function init(that, options, args) {
        var ret = that;

        // Init
        if (typeof options === 'object') {
            return that.each(function () {
                if (!this.id) {
                    this.id = 'mobiscroll' + (++id);
                }
                if (instances[this.id]) {
                    instances[this.id].destroy();
                }
                new $.mobiscroll.classes[options.component || 'Scroller'](this, options);
            });
        }

        // Method call
        if (typeof options === 'string') {
            that.each(function () {
                var r,
                    inst = instances[this.id];

                if (inst && inst[options]) {
                    r = inst[options].apply(this, Array.prototype.slice.call(args, 1));
                    if (r !== undefined) {
                        ret = r;
                        return false;
                    }
                }
            });
        }

        return ret;
    }

    var id = +new Date,
        instances = {},
        extend = $.extend,
        mod = document.createElement('modernizr').style,
        has3d = testProps(['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']),
        prefix = testPrefix(),
        pr = prefix.replace(/^\-/, '').replace(/\-$/, '').replace('moz', 'Moz');

    $.fn.mobiscroll = function (method) {
        extend(this, $.mobiscroll.components);
        return init(this, method, arguments);
    };

    $.mobiscroll = $.mobiscroll || {
        util: {
            prefix: prefix,
            jsPrefix: pr,
            has3d: has3d,
            getCoord: getCoord
        },
        presets: {},
        themes: {},
        i18n: {},
        instances: instances,
        classes: {},
        components: {},
        presetShort: function (name, c) {
            this.components[name] = function (s) {
                return init(this, extend(s, { component: c, preset: name }), arguments);
            };
        }
    };

    $.scroller = $.scroller || $.mobiscroll;
    $.fn.scroller = $.fn.scroller || $.fn.mobiscroll;
    return $;
	};
});