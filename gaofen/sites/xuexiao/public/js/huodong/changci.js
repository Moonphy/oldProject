/**
 * Created by Administrator on 2016-7-21.
 */

var _changCi = Gaofen.cfg.changci;
var _jiage = Gaofen.cfg.jiage;
var formAction = Gaofen.cfg.formAction;

var jparse = function(data){
    if($.type(data) === 'object' ) return data;
    var rd = '';
    try{
        rd = JSON.parse(data);
    }catch(e){}
    return rd;
};
var changCiData = jparse(_changCi);
var jiage = jparse(_jiage);

var ChangCiOnes = changCiData.children;
/**
 * 增加人数
 * @param e
 */
function plusFn(e){
    var num = parseInt($(e).prev().find('i').text());
    var numN = num + 1;
    $(e).prev().find('i').text(numN);
    $(e).prev().find('input').val(numN);
    priceAll(jiage);
}

/**
 * 减少报名人数
 * @param e
 * @param Minnum 最少人数
 */
function minusFn(e, Minnum){
    var that = e;
    var num = parseInt($(that).next().find('i').text());
    var numN = num - 1;

    if(numN >= Minnum){
        $(that).next().find('i').text(numN);
        $(that).next().find('input').val(numN);
    }

    priceAll(jiage);
}

/**
 * 计算活动费用
 * @param danjia 大人和小孩参加活动的单价
 */
function priceAll(danjia){
    var parent = $('#parentNum'),
        child = $('#childNum');

    var parentNum = parseInt(parent.text());
    var childNum = parseInt(child.text());
    var price = 0;

    if(parent.length > 0){
        price += parentNum * danjia.parent;
    }
    if(child.length > 0){
        price += childNum * danjia.child;
    }

    if(price === 0){
        $('#priceAll').text('免费');
    }else{
        $('#priceAll').text(price + '元');
    }
    $("#input-num-warn").addClass('hidden');
}
priceAll(jiage);

/**
 * 场次选择
 */
function changCi(data){

    var ChangCiOnes = data.children;
    if(ChangCiOnes &&　ChangCiOnes.length>0){

        for (var i in ChangCiOnes){
            var _name = ChangCiOnes[i].text.replace(' ','');
            $('#changci select').append('<option value=' + _name + '>' + _name +'</option>');
        }
    }else{
        $('#changci').remove();
        $("#input-changci-warn").remove();
    }
}

//var ext_select_name=$('#add_type').attr('name');
// console.log(ext_select_name);
//var ext_select_type = '否';//是否卓越会员，默认不是
$('body').on('change','select', function () {
    var option = $(this).find('option:checked').val();
    $(this).next('span').text(option);
    $("#input-changci-warn").addClass('hidden');

    /*if($('.select-label select').find('option:checked').val() == '是'){
        return ext_select_type = '是';
    }else if($('.select-label select').find('option:checked').val() == '否'){
        return ext_select_type = '否';
    }*/
});

if(!!$('#changci') && $('#changci').length>0){

    changCi(changCiData);


    if(ChangCiOnes &&　ChangCiOnes.length>0){
        $('#changci select')[0].selectedIndex = -1;
    }

    $('#changci select').on('change', function (e) {

        var that = e.target;
        var oIndex = $(that).find('option:checked').index();

        appendC2(changCiData, oIndex);
    });
}




$('body').on('change','#changci3 select', function () {
    $("#input-changci3-warn").addClass('hidden');
});

var _changci2 = 0;
var _changci3 = 0;
function appendC2(data,idx){
    var ChangCiOnes = data.children;
    var C2 = ChangCiOnes[idx].children;
    var C2Lng = C2.length;

    $('#changci2').remove();
    $('#changci3').remove();
    $("#input-changci2-warn").hide();
    _changci2 = 0;

    if(C2Lng > 0){
        var html = '<div class="input-row" id="changci2">' +
            '<select name="changci2">' +
            '</select><span>场次选择</span><i class="icon icon-down"></i>' +
            '</div>' +
            '<p class="tl mt-10 hidden" id="input-changci2-warn"><i class="icon-warn">!</i><span class="font-xs">请选择场次</span></p>';

        $('#changci').after(html);
        for(var j in C2){
            var _name = C2[j].text.replace(' ','');
            $('#changci2 select').append('<option value=' + _name + '>' + _name +'</option>');
        }

        $('#changci2 select')[0].selectedIndex = -1;
        _changci2 = 1;

        $('body').on('change','#changci2 select', function (e) {
            var that = e.target;
            var nexIndex = $(that).find('option:checked').index();
            var C3 = C2[nexIndex].children;
            var C3Lng = C3.length;
            _changci3 = 0;

            $("#input-changci2-warn").hide();
            $('#changci3').remove();
            $("#input-changci3-warn").hide();
            if(C3Lng > 0){
                var _html = '<div class="input-row" id="changci3">' +
                    '<select name="changci3">' +
                    '</select><span>场次选择</span><i class="icon icon-down"></i>' +
                    '</div>' +
                    '<p class="tl mt-10 hidden" id="input-changci3-warn"><i class="icon-warn">!</i><span class="font-xs">请选择场次</span></p>';

                $('#changci2').after(_html);
                for(var h in C3){
                    var _name_ = C3[h].text.replace(' ','');
                    $('#changci3 select').append('<option value=' + _name_ + '>' + _name_ +'</option>');
                }

                $('#changci3 select')[0].selectedIndex = -1;
                _changci3 = 1;
            }
        });
    }

}

$("#phone").on('input',function () {
    if(!$(this).val().match(/^1[3-9]\d{9}$/)){
        $("#input-phone-warn").removeClass('hidden');
    }else{
        $("#input-phone-warn").addClass('hidden');
    }
});

$('#name').on('input', function () {
    $("#input-name-warn").addClass('hidden');
});

/**
 * 提交
 * @param data
 */
function postData(data){

    Gaofen.Ajax.send(formAction, data, function(res){
        var _res =JSON.parse(res);
        if(_res.errno != ''){
            alert(_res.err)
        }else{
            dataLayer.push({'event': 'shoufeibaoming'});
            $('#success-popup,.ui-mask').removeClass('hidden');
        }
    }, 'post')
}

$('#btn-submit').on('click',function () {

    /*var apply_num;
    if(!$('#parentNum')){
        apply_num = parseInt($('#childNum').text());
    }else if(!$('#childNum')){
        apply_num = parseInt($('#parentNum').text());
    }else{
        apply_num = parseInt($('#parentNum').text()) + parseInt($('#childNum').text());
    }*/

    var real_name = $('#name').val();
    var _phone = $('#phone').val();

    var _changCi = 0;
    if(!!_changci2){
        _changCi = $('#changci select').find('option:checked').val() + $('#changci2 select').find('option:checked').val();
    }else{
        _changCi = $('#changci select').find('option:checked').val();
    }


    var data = $('form').serializeArray();

    var newData = {}, changci = [];

    for(var i = 0,len=data.length;i<len;i++){
        if(data[i].name.indexOf('changci')>-1){
            changci.push(data[i].value);
        }else{
            newData[data[i].name] = data[i].value;
        }
    }
    newData['changci'] =  changci.join(' ');

    var ChangCiOnes = changCiData.children;

    if(real_name === ""){
        $("#input-name-warn").removeClass('hidden');
        $('#name').focus();
    }
    if(!_phone.match(/^1[3-9]\d{9}$/)){
        $("#input-phone-warn").removeClass('hidden');
        $('#phone').focus();
    }

    if(ChangCiOnes &&　ChangCiOnes.length>0){
        if( _changCi == undefined){
            $("#input-changci-warn").removeClass('hidden');
        }else if(!!_changci2 && $('#changci2 select').find('option:checked').val() === undefined){
            $("#input-changci2-warn").removeClass('hidden');
        }else if(!!_changci3 && $('#changci3 select').find('option:checked').val() === undefined){
            $("#input-changci3-warn").removeClass('hidden');
        }else if(!!_phone.match(/^1[3-9]\d{9}$/) && real_name !== "" && _changCi !== undefined){
            postData(newData);
        }
    }else{
        if(!!_phone.match(/^1[3-9]\d{9}$/) && real_name !== ""){
            postData(newData);
        }
    }
});

/**
 * 关闭页面
 */
$('.btn-close').click(function(){
    window.opener = null;
    window.close();
});

// QQ群
var js = document.createElement('script');
js.setAttribute('type', 'text/javascript');
js.setAttribute('src', 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js');
js.onload = function(){
    Gaofen.Ajax.send('http://m.gaofen.com/ajax/qqgroup?callback=?', {
        channel : 'huodong',
        city : remote_ip_info.city,
        __rnd : +new Date,
        section : Gaofen.PD.get('school_type') || 'xsc'
    }, function(r){
        try{
            if(r.rst){
                var div = $('<div class="p5 dotted"></div>');
                div.html(r.rst);
                $('#qq').append(div);
                //div.insertAfter($('div.user-list'));
            }
        }catch(e){}
    }, 'jsonp');
};
document.getElementsByTagName('head')[0].appendChild(js);
