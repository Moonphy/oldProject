define(function(require,exports,module){
	//sheng shi qu liandong 
	module.exports = function(opts,$,C){
    var defualts = {
        $SHENG : $('#J_sheng'),
        $SHI : $('#J_shi'),
        $QU : $('#J_qu'),
        $TEXT : $('li div.value span'),
        RS : $('ul.chosen-results')
    };
    var suffix = C.debug.getSuffix();
    var ops =$.extend(defualts,opts||{});
    var selcity = {};
    $.extend(selcity.load = {},{
        loadProvince : function(target){
            $.ajax({
                url:'/base/province/find/all'+suffix,
                success:function(data){
                    C.state.check(data,function(model){
                        target.empty();
                        if(!model) model = [];
                        var tmp='';
                        if(model.length>0){
                            $.each(model,function(idx,data){
                                tmp+='<li class="active-result" value="{{id}}">{{val}}</li>'
                                    .replace('{{id}}',data.proId)
                                    .replace('{{val}}',data.proName);
                            });
                        }else{
                            tmp+='<li class="active-result" value="-1">无结果</li>'
                        }
                        target.append(tmp);
                    },function(msg){
                        C.msg.info(msg);
                    });
                }
            });
        },
        loadCity:function(target,id){
            if(id==undefined) {
                target.empty().append('<li class="active-result" value="-1">请选择省份</li>');
                return;
            }
            $.ajax({
                url:'/base/city/find/{proId}'.replace('{proId}',id)+suffix,
                success:function(data){
                    C.state.check(data,function(model){
                        target.empty();
                        if(!model) model = [];
                        var tmp='';
                        if(model.length>0){
                            $.each(model,function(idx,data){
                                tmp+='<li class="active-result" value="{{id}}">{{val}}</li>'
                                    .replace('{{id}}',data.cityId)
                                    .replace('{{val}}',data.cityName);
                            });
                        }else{
                            tmp+='<li class="active-result" value="-1">无结果</li>'
                        }
                        target.append(tmp);
                    },function(msg){
                        C.msg.info(msg);
                    });
                }
            });
        },
        loadArea:function(target,id,clearId){
            if(clearId){
                $(ops.$TEXT[2]).data('id',undefined);
            }
            if(id==undefined) {
                target.empty().append('<li class="active-result" value="-1">请选择市级</li>');
                return;
            }
            $.ajax({
                url:'/base/area/find/{cityId}'.replace('{cityId}',id)+suffix,
                success:function(data){
                    C.state.check(data,function(model){
                        target.empty();
                        if(!model) model = [];
                        var tmp='';
                        if(model.length>0){
                            $.each(model,function(idx,data){
                                tmp+='<li class="active-result" value="{{id}}">{{val}}</li>'
                                    .replace('{{id}}',data.areaId)
                                    .replace('{{val}}',data.areaName);
                            });
                        }else{
                            tmp+='<li class="active-result" value="-1">无结果</li>'
                        }
                        target.append(tmp);
                    },function(msg){
                        C.msg.info(msg);
                    });
                }
            });
        }
    });

    //初始化省级
    selcity.load.loadProvince(ops.$SHENG.find('ul.chosen-results'));

    selcity.initializeSel = function(target,level){
        var $TARGET = target,
            $ALL_DROP = $('.chosen-drop'),
            $TARGET_DROP = $TARGET.find('.chosen-drop');
        $TARGET.on(C.CLICK,function(){
            $ALL_DROP.hide();
            if($TARGET.find('li.active-result').length>0){
                $TARGET_DROP.css({
                    display: 'inline-block'
                });
            }
        }).on(C.events.over,'li',function(){
            $(this).addClass('highlighted');
        }).on(C.events.out,'li',function(){
            $(this).removeClass('highlighted');
        }).on(C.events.click,'li',function(){
            var target = $(this);
            var text = target.text(),
                val = target.val(),
                _TEXT = $TARGET.find('div.value span');
            _TEXT.text(text);
            _TEXT.data('id',val);//保存id
            C.log('你选择了：'+text,'值为：'+val);
            $TARGET_DROP.hide();
            var lv = $TARGET.data('level');
            switch (lv){
                case 1:
                    $(ops.$TEXT[1]).text('请选择');
                    $(ops.$TEXT[2]).text('请选择');
                    selcity.load.loadCity($(ops.RS[1]),val);
                    selcity.load.loadArea($(ops.RS[2]),undefined,true);
                    break;
                case 2:
                    $(ops.$TEXT[2]).text('请选择');
                    selcity.load.loadArea($(ops.RS[2]),val,true);
                    break;
                default:
                    break;
            }
        }).data('level',level);

        $(document).on(C.CLICK,function(e){
            if(!$(e.target).hasClass('item') && $(e.target).parents('li').length<=0){
                $ALL_DROP.hide();
            }
        });

        if(level==1){
            $(ops.$TEXT[0]).text($model.proName);
            $(ops.$TEXT[1]).text($model.cityName);
            $(ops.$TEXT[2]).text($model.areaName);

            selcity.load.loadCity($(ops.RS[1]),$model.proId);
            selcity.load.loadArea($(ops.RS[2]),$model.cityId,false);

            $(ops.$TEXT[0]).data('id',$model.proId);
            $(ops.$TEXT[1]).data('id',$model.cityId);
            $(ops.$TEXT[2]).data('id',$model.areaId);
        }
    };

    var $model = {};
    //拉取现有的
    $.ajax({
        url:'/wx/user/find/fullArea',
        async:false,
        success:function(data){
            C.state.check(data,function(model){
                $model = model;
            });
        }
    });
    selcity.initializeSel(ops.$SHENG,1);
    selcity.initializeSel(ops.$SHI,2);
    selcity.initializeSel(ops.$QU,3);
    return selcity;
	}
});