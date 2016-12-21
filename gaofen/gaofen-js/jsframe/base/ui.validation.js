/**
 * @author  xiezhiwen
 * @class  Gaofen.ui.validator
 * 表单验证
 * <code><pre>
 Gaofen.use('validator', {
			form : '#myform'//表单id
			, trigger : '#btn'//提交按钮
			//, elements : $('#myform input') //仅当非表单或者特殊情况下使用
			, inForm : true
			, onSuccess : function(data){//data是收集到的要验证的内容
				return false;//返回false表单才能提交。如果不是form表单自行ajax提交
			}
		});
 </pre></code>
 */
(function(G, $, win){

    var Util = G.util,

        T = G.tpl,

        doc = document,

        hidCls   = 'hidden',

        ui = G.ui,

        Base = G.ui.Base,

        jqWin = $(window),

        jqDoc = $(doc),

        lineCls = 'form-row',

        validators = {

            /**
             * @event ne
             * 不能为空
             */
            ne : function(elem, v, data, next){
                data.m = data.m || ErrorMap['IS_NUll'];
                this.report(!!v, data);
                next();
            },

            /**
             * @event mail
             * 检测邮箱
             */
            mail : function(elem, v, data, next){
                var error = true, msg;
                if(!Util.isEmail(v)){//邮箱格式
                    msg = data.m || ErrorMap['IS_EMAIL_ERROR'];
                }/*
                 else if(Util.isIllegalChar(v)){ //非法字符
                 msg = ErrorMap['IS_EMAIL_ILLEGAL'];
                 }else if(Util.isChineseChar(v)){//中文字符
                 msg = ErrorMap['IS_EMAIL_CHINESECHAR'];
                 }else if(Util.isFullwidthChar(v)){//全角符号
                 msg = ErrorMap['IS_EMAIL_ALLANGLE'];
                 }*/
                if(msg) data.m = msg;
                this.report(!!!msg, data);
                next();
            },

            /**
             * @event sz
             * 检测输入字符长度
             * 属性：
             <div class="mdetail-params">
             <ul>
             <li>max=number，允许最大字节长度</li>
             <li>min=number，允许最小字节长度</li>
             <li>ww, wide code缩写，将长度按宽字符计算，一个汉字两个字节长度</li>
             <li></li>
             </ul>
             </div>
             例：
             <pre>
             sz=max:6,min:4,m:最少两个汉字，最多三个汉字,ww
             </pre>
             * @param {Number} max 最大长度
             * @param {Number} min 最小长度
             * @param {Boolean} ww 取值1或0，指明长度单位是否按宽字符长度计算，宽字符单位为2，一个字两个字母
             */
            sz : function(elem, v, data, next){
                var error = true;
                if(v){
                    var len = data.ww ? Util.byteLen(v) : v.length,
                        max = data.max,
                        min = data.min;
                    if(max !== undefined && parseInt(max) < len)
                        error = false;
                    if(min !== undefined && parseInt(min) > len)
                        error = false;
                    this.report(error, data);
                }else this.report(false, data);

                next();
            },

            /**
             * @event mcode
             * 敏感字符
             */
            mcode : function(elem, v, data, next){
                data.m = data.m || ErrorMap['IS_USER_ERROR3'];
                this.report( !/<|"/ig.test(v), data);
                next();
            },

            /**
             * @event illegalChar
             * 非法字符
             */
            illegalChar : function(elem, v, data, next){
                data.m = data.m || ErrorMap['IS_IllegalChar'];
                this.report( !/[`~!#$%^&*@()_+<>?:"{},\/;'[\]]/im.test(v), data);
                next();
            },
			
            /**
             * @event illegalChar
             * 非法字符
             */
            number : function(elem, v, data, next){
                data.m = data.m || '请填写数字';
				if(data.cnull && v === ''){
					data.isOK = 'false';
					this.report( true, data);
				}
                else this.report( /^[0-9]*$/im.test(v), data);
                next();
            },
            /**
             * @event radio
             * radio验证
             */
            radio : function(elem, v, data, next){
                var radio = $(elem).closest('.'+lineCls).find('input[type="radio"]:checked');
                this.report( radio.length , data);
                next();
            },

            /**
             * @event cbox
             * checkbox验证
             */
            cbox : function(elem, v, data, next){
                var radio = $(elem).closest('.'+lineCls).find('input[type="checkbox"]:checked');
                this.report( radio.length , data);
                next();
            },

            /**
             * @event cpw
             * 两次密码匹配
             *	例：
             <pre>
             cpw=pid:password,m:'两次输入密码不一致'
             </pre>
             * @param {String} pid 再一次密码输入框id
             * @param {String} m 错误提示信息
             */
            cpw : function(elem, v, data, next){
                var pid = data.pid, pv = $('#'+pid).val();
                if(v != pv){
                    data.m = data.m || '两次输入密码不一致';
                    this.report(false, data);
                }
                next();
            },

            /**
             * @event vcode
             * 验证码
             */
            vcode : function(elem, v, data, next){
                var self = this;
                $.ajax({
                    type : 'get',
                    dataType: 'html',
                    url: '/signup/checkCode?code='+v,
                    success : function(e){
                        if(e!= 'ok' && e!=""){
                            if(data.re){//刷新
                                $(elem).parent().find('img').trigger('click');
                            }
                            data.m = data.m || ErrorMap['IS_CODE_ERROR'];
                            self.report(false, data);
                        }else
                            self.report(true, data);
                        next();
                    }
                });
                /*
                 G.request.q('http://my.gaofen.com/index.php?mod=user&do=checkCode&code='+v, {}, function(e){
                 if(e!= 'ok' && e!=""){
                 data.m = data.m || ErrorMap['IS_CODE_ERROR'];
                 self.report(false, data);
                 }else
                 self.report(true, data);
                 next();
                 });		
                 */
            },

            /**
             * @event phone
             * 手机号
             */
            phone : function(elem, v, data, next){
                data.m = data.m || ErrorMap['IS_PHONE'];
				if(data.cnull && v === ''){
					data.isOK = 'false';
					this.report( true, data);
				}
                else this.report(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(v), data);
                next();
            },

            /**
             * @event vcode
             * 验证码帐号邮箱
             */
            account : function(elem, v, data, next){
                var self = this, url = '';
                if(data && data.t){
                    url = '/signup/checkUser?type='+data.t+'&username='+v;
                }else{
                    data || (data = {t : 1});
                    url = '/signup/checkUser?type=1&username='+v;
                }
                $.ajax({
                    type : 'get',
                    url: url,
                    success : function(e){
                        if(e!= '1' && e!=""){
                            data.m || (data.m = data.t == '1' ? ErrorMap['IS_EMAIL_EXIST'] : ErrorMap['IS_LIKE_EXIST']);
                            self.report(false, data);
                        }else
                            self.report(true, data);
                        next();
                    }
                });
            },

            //重复输入密码
            pwd : function(elem, v, data, next){
                var pwd2 = data.id, jqpwd2 = $('#'+pwd2), v2 = $.trim(jqpwd2.val());
                if(v2 !== ''){
                    this.report(v2==v, data);
                }
                next();
            },

            //select选择
            select : function(elem, v, data, next){
                var selects = $(elem).closest('.'+lineCls).find('select:visible'), flag = true;
                for(var i=0, len = selects.length; i<len;i++){
                    if(selects.eq(i).val() === ''){
                        flag  = false;
                        break;
                    }
                }
                this.report( flag , data);
                next();
            }
        },

        ErrorMap = {
            IS_NUll 			:   '请输入内容',
            IS_EMAIL_NULL		:	'请填写电子邮箱，可用来取回密码',
            IS_EMAIL_ERROR		:	'请检查邮箱拼写，示例：gaofen@gaofen.com',
            IS_EMAIL_EXIST		:	'此邮箱地址已被注册',
            IS_EMAIL_CHINESECHAR:	'请输入英文(a-z,A-Z)或数字（0-9）',
            IS_EMAIL_ALLANGLE   :	'邮箱不能为全角，请切换半角',
            IS_EMAIL_ILLEGAL    :	'邮箱不能使用非法字符',
            IS_PASSWORD_NULL	:	'请填写一个方便你记忆的密码',
            IS_PASSWORD_CONFIRM	:	'请再次填写密码',
            IS_CODE_NULL		: 	'请填写如图显示的四位验证码',
            IS_CODE_ERROR		: 	'验证码不正确，请检查',
            IS_USER_NULL		:	'请填写用户名， 长度为3 到 15 个字符',
            IS_USER_ERROR1		:	'用户名不能少于 3 个字符',
            IS_USER_ERROR2		:	'用户名不能多于 15 个字符',
            IS_USER_ERROR3		:	'用户名包含敏感字符',
            IS_IllegalChar      :   '不能输入特殊字符',
            IS_LIKE_EXIST       :   '此昵称已被注册',
            IS_USER_CONFIRM		:	'抱歉，用户名已被占用，请换一个试试',
            IS_USER_NO_LEGAL	:	'用户名不合法',
            IS_USER_NO_ALLOW	:	'包含不允许注册的词语',
            IS_RESIDENCE_NULL	:	'请选择你的居住地',
            IS_IDENTITY_NULL	:	'请选择你的身份',
            IS_DEAL_CHECK		:	'请先阅读《用户协议》',
            IS_PHONE 			:   '手机号格式不对，请修正'
        };



    function validatiorElement(cmp, elem){
        $.extend(this, {cmp:cmp, elem:elem});
        this.init();
    };

    validatiorElement.prototype = {

        n : -1,//验证数数

        error : 0,	//错误数

        valiArr : [],
		
		inForm : true,//表单内部

            bev : 0,

        stopByOne : true, //只要一个错了就不再验证下去


        tipsCls : 'help-inline',

        tipsMsg : '',

        init : function(){
        this.valiArr = [];
        var $t = $(this.elem), vrel = $t.attr('vrel');


        if(vrel){
            var arr = vrel.split('|'), isF = false

                , self = this, vs = validators;

            this.$t = $t;
            this.$row = $t.closest('.'+lineCls);
            this.$tips = this.$row.find('.'+this.tipsCls);
            //radio验证，最少选择一个
            if($t.attr('type') === 'radio'){
                this.valiArr.push({fn:vs['radio'], data:Util.parseKnV(vrel.split('=')[1])});
                this.cmp.addElement(this, false);
                if(arr[0] == '_f'){
                    this.$row.find('input[type="radio"]').change(function(e){
                        self.n = -1;
                        self.validate();
                    });
                }
                return;
            }

            //checkbox验证，最少选择一个
            if($t.attr('type') === 'checkbox'){
                this.valiArr.push({fn:vs['cbox'], data:Util.parseKnV(vrel.split('=')[1])});
                this.cmp.addElement(this, false);
                return;
            }

            //select验证
            if($t[0].tagName.toLowerCase() === 'select'){
                this.valiArr.push({fn:vs['select'], data:Util.parseKnV(vrel.split('=')[1])});
                this.cmp.addElement(this, false);
                return;
            }


            if(arr[0] == '_f'){
                isF = true;
                $t.blur(function(e){
                    self.n = -1;
                    self.validate();
                });
            }

            var start = isF?1:0;

            for(var i=start,len = arr.length;i<len;i++){

                var v = arr[i].split('='), data = {}, fn = vs[v[0]];
                if(v.length>1){
                    data = Util.parseKnV(v[1]);
                }

                if(v[0] === 'tips'){
                    self.tipsMsg = data['m'];
                    $t.focus(function(e){
                        self.hasFocus.call(self);
                        self.$tips.html(self.tipsMsg);
                    });
                    if(start == 0)
                        $t.blur(function(e){
                            self.displayTips.call(self, false);
                        });
                    continue;
                };

                if(fn) this.valiArr.push({fn:fn,data:data});
            }

            this.cmp.addElement(this, isF);

        }



    }

    ,hasFocus : function(){
        this.$row.removeClass('success').removeClass('error').addClass('hints');
        this.displayTips();

    }

    ,displayTips  : function(p, msg){
        this.$tips.cssDisplay(p === false ? false : 1);
    }

    ,validate : function(next){
        var vas = this.valiArr, len = vas.length, v = $.trim(this.$t.val());
        this.n++;
        if(len>this.n && !(this.stopByOne && this.error > 0)){
            vas[this.n].fn.call(this, this.elem, v, vas[this.n].data, Util.bind(this.validate, this));
        }else{
            this.cmp.elemChainResult(this.error, this.elem);
            var error = this.error ? true:false;
            this.showFlag(!error, vas[this.n-1].data);
            this.n = -1;
            this.error = 0;
            if(this.bev && this.cmp.chainAll){
                this.bev = 0;
                this.cmp.validate();
            }

        }

    }

    ,showFlag : function(isTrue, data){
        var id = this.$t.attr('id'), cmp = this.cmp, parent = '';
        if(cmp.inForm === false){

        }else{
            parent = this.$row;
            if(isTrue){
                parent.removeClass('hints').removeClass('error').addClass('success');
                this.$tips.text(cmp.isShowOk&&data.isOK !== 'false'? 'OK' : '');
                this.displayTips(true);
            }else{
                parent.removeClass('hints').removeClass('success').addClass('error');
                this.$tips.text(data.m);
                this.displayTips(true, data.m);
            }

        };
    }

    ,report : function(isTrue, data){
        !isTrue && this.error++;
    }


};

ui.validation = function(cfg){

    $.extend(this, cfg);

    this.init();

};

ui.validation.prototype = {

    idx : -1,

    errorResult : 0,

    chainAll : true, //每次都全部验证，false时只验证到有错误的项

    velem : [],

    isShowOk : true, //单个成功时显示OK

    lock : false,

    felem : [],

    elemChainResult : function(result, elem){
        if(result){
            this.errorResult++;
            this.onElemError(elem);
        }else{
            this.onElemTrue(elem);
        }
        //console.log('errorResult:'+this.errorResult);
    },

    onElemError : function(elem){
        //console.log('errorelem:'+elem);
    },

    onElemTrue : function(elem){
        //console.log('trueelem:'+elem);
    },

    init : function(){
        this.velem = [];
        this.felem = [];
        if(!validators)
            validators = {};
        this.form = $(this.form)[0];
        var self = this;

        var vals = this.validators;
        for(var key in vals){
            this.reg(key, vals[key]);
        }

        // 执行预处理

        $.each(this._getElements(), function(){
            var chain = new validatiorElement(self, this);
            //chain.doPrehandling();
        });
        var trigFn = function(){
            if(self.lock == false){
                self.lock = true;
                self.idx = -1;
                self.errorResult = 0;
                self.validate();
            }
            return false;
        };
        if( this.trigOnSubmit )
            this.form.onsubmit = trigFn;
        if( this.trigger ){
            this.trigger = $(this.trigger)[0];
            $(this.trigger).click(function(){
                return trigFn();
            });
        }

    }

    ,_getElements : function(){
        return  this.elements || this.form.elements;
    }

    ,addElement : function(elem, isF){
        this.velem.push(elem);
        isF && this.felem.push(elem);
    }

    ,validate : function(){
        var velem = this.velem;
        this.idx++;
        if(velem.length>this.idx){
            var _elem = velem[this.idx];
            _elem.bev = 1;
            velem[this.idx].validate();
        }else{
            this.chainResult();
        }

    }

    ,chainResult : function(){
        if(this.errorResult){
            this.lock = false;
            this.onError();
        }else{
            if(this.submitBefore && this.submitBefore() === false){
                return false;
            }
			var reflag = this.onSuccess(this.getData());
            if(reflag === true){
                $(this.form).submit();
            }else if(reflag === false){
                this.lock = false;
            }
        }
    }

    /**
     * 验证成功返回
     * @return {Object} data
     */
    ,onSuccess : $.noop

    ,getData : function(){
        var data = {}, es = this._getElements();
        for(var i=0,len = es.length;i<len;i++){
            var elem = es[i], $e = $(elem);
            if($e.attr('type') == 'submit') break;
            data[$e.attr('name')||$e.attr('id')] = $.trim($e.val());
        }
        return data;
    }

    /**
     * 验证错误返回
     */
    ,onError : $.noop


    /**
     * 给验证器注册事件
     * @param {String} cmd
     * @param {Function} validator
     * @return {Object} this
     */
    ,reg : function(cmd, validator) {
        if(!validators)
            validators = {};
        if($.isArray(cmd)){
            for(var i=0,len=cmd.length;i<len;i++){
                this.reg.apply(this, cmd[i]);
            }
        }else validators[cmd] = validator;
        return this;
    }

};

G.ui.validation = G.reg('validator', ui.validation);

})(Gaofen, jQuery, window);