var factoryEdit;

var common = require('common');
var $ = common.jquery;
var layer = $.layer;
var upload = require('upload');
var loadcity = require('loadcity');
require('validate')($,true);
$(function(){
    var province = $('#province'),
        city = $('#city'),
        area = $('#area'),
        container2 = $('#container2'),
        imglist = $('.imglist'),
        gszz = $('#gszz'),
        gszzLoading = $('.gszzLoading'),
        deletebtn = $('.deletebtn'),
        filters = [{title:'图片文件',extensions:'bmp'},{title:'图片文件',extensions:'jpeg'},{title:'图片文件',extensions:'jpg'},{title:'图片文件',extensions:'png'},{title:'图片文件',extensions:'gif'}],
        form = $('#form'),
        saveBtn = $('#saveBtn');


    //加载数据
    var id = $.utils.getqs('id');
    if($.isEmpty(id)){
        $.keyNotFound();
        return;
    }
    loadInfo(id);
    function loadInfo(id){
        $.ajax({
            url:'/org/find/specif',
            data:'orgID='+encodeURIComponent(id),
            callback: function (model) {
                setDatas(model);
            }
        })
    }

    function setDatas(model){
        var id = $('#id');
        var auditTime =$('#auditTime');
        var filter = $('#filter');
        var createTime = $('#createTime');
        var orgType = $('#orgType');

        var feilds = ['mfctyName','businessLicenseNo',
            'legalPerson','identityNo',
            'orgType','contactPerson','contactMobile',
            'businessTelephone','fax','email','address'];

        var keys = ['mfctyName','businessLicenseNo',
            'legalPerson','identityNo',
            'orgType','contactPerson','contactMobile',
            'businessTelephone','fax','email','address'];

        var baseInfo = model.qpuOrgEntity;

        id.text(baseInfo.orgID);
        auditTime.text(baseInfo.auditTime);
        createTime.text(baseInfo.createTime);
        (model.isFilter && model.isFilter===true) && filter.attr('checked','checked');
        if(baseInfo.businessLicensePic!=undefined && baseInfo.businessLicensePic!=''){
            gszz.attr('src',decodeURIComponent(baseInfo.businessLicensePic));
        }
        orgType.val(baseInfo.orgType);

        feilds.forEach(function(name,i){
            _$(name).val(baseInfo[keys[i]]);
        });

        function _$(name){
            return $('input[name="'+name+'"]');
        }

        loadcity.loadProvince(province,baseInfo.provinceID);
        loadcity.loadCity(city,baseInfo.provinceID,baseInfo.cityID);
        loadcity.loadArea(area,baseInfo.cityID,baseInfo.countyID);

        //门头照片
        var pics = model.orgFacadePics;
        pics && pics.forEach(function(src){
            var img = document.createElement('img');
            img.src=decodeURIComponent(src);
            imglist.append(img);
        });
    }

    province.on('change',function(){
        var val = province.val();
        city.find(':not(:first)').remove();
        area.find(':not(:first)').remove();
        if(val){
            loadcity.loadCity(city,val);
        }
    });
    city.on('change', function () {
        var val = city.val();
        if(val) {
            area.find(':not(:first)').remove();
            loadcity.loadArea(area, val);
        }
    });

    var token = null;
    var domain = '';
    $.ajax({
        url:'/cdn/qn/token',
        async:false,
        errorMsg:'token获取失败，请刷新重试！',
        callback: function (model) {
            token = model.token;
            domain = model.domain;
        }
    });
    uploadInit();
    uploadInit2();
    function uploadInit(){
        gszzLoading.hide();
        var uper = new upload.initalize({
            browse_button:'uploadbtn1',
            container:'container1',
            drop_element:'container1',
            uptoken:token,
            //downloadUrl:'/cdn/qn/file?key=',
            downloadUrl: domain,
            multi_selection:false,//禁用多选
            filters:filters,
            max_file_size:'10mb',
            init:{
                'UploadFile': function (up, file) {//当一个文件被上传的时候触发
                    gszzLoading.show();
                    gszz.hide();
                },
                'FileUploaded':function(up, file, info) {
                    var res = JSON.parse(info);
                    var url =  upload.sdk.imageView2({
                        mode:2,
                        w:216,
                        h:180,
                        quality:70
                    },res.key);
                    gszzLoading.hide();
                    gszz.attr('src',url).show();
                }
            }
        });
    }

    //现有门头照片张数
    function haveImgCount(){
        return imglist.find('img').length;
    }
    //上传门头照片逻辑
    function uploadInit2(){
        var uper = new upload.initalize({
            browse_button:'uploadbtn2',
            container:'container2',
            drop_element:'container2',
            uptoken:token,
            //downloadUrl:'/cdn/qn/file?key=',
            downloadUrl:domain,
            filters:filters,
            max_file_size:'10mb',
            init:{
                'UploadFile': function (up, file) {//当一个文件被上传的时候触发
                    if(haveImgCount()<4){
                        var div = document.createElement('div');
                        div.className='uploading';
                        var i = document.createElement('i');
                        i.className='fa fa-spinner fa-spin fa-2x';
                        var span = document.createElement('span');
                        file.loading=div;
                        file.process=span;
                        div.appendChild(i);
                        div.appendChild(span);
                        imglist.append(div);
                    }else{
                        uper.uploader.splice();
                        $.alert('门头照片最多四张，多出的照片不会上传！','i');
                    }
                },
                'UploadProgress': function(up, file) {
                    // 每个文件上传时,处理相关的事情
                    //file.process.innerHTML= file.percent + "%";
                },
                'FileUploaded':function(up, file, info) {
                    var res = JSON.parse(info);
                    var url =  upload.sdk.imageView2({
                        mode:1,
                        w:245,
                        h:205,
                        quality:70
                    },res.key);
                    var img = document.createElement('img');
                    img.src=url;
                    img.name='urlPic';
                    $(file.loading).replaceWith(img);
                }
            }
        });
    }

    //门头照片删除逻辑
    container2.on('mouseover','img', function () {
        var left = this.offsetLeft;
        var top = this.offsetTop;
        deletebtn.css({
            left:left,
            top:top
        }).removeClass('fn-hide');
        $(this).addClass('predelete');
    });
    container2.on('mouseout','img', function () {
        deletebtn.addClass('fn-hide');
        $(this).removeClass('predelete');
    });
    container2.on('dblclick','img', function () {
        $(this).remove();
        deletebtn.addClass('fn-hide');
    });

    form.on('focus','input', function (e) {
       if($(this).hasClass('active')){
           $('.errortip').css({
               top:$(this)[0].offsetTop+36,
               left:$(this)[0].offsetLeft
           }).text($(this).attr('msg') || $(this).attr('placeholder')).show();
       }
    });
    form.on('blur','input', function () {
        $('.errortip').hide();
    });

    form.Validform({
        btnSubmit:'#saveBtn',
        tiptype:function(msg,o,cssctl){
            //msg：提示信息;
            //o:{obj:*,type:*,curform:*}, obj指向的是当前验证的表单元素（或表单对象），type指示提示的状态，值为1、2、3、4， 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态, curform为当前form对象;
            //cssctl:内置的提示信息样式控制函数，该函数需传入两个参数：显示提示信息的对象 和 当前提示的状态（既形参o中的type）;
            if(o.type==3){
                o.obj.addClass('active').attr('msg',msg);
                if(o.obj[0].localName=='select'){
                    $.layer.tips(msg, o.obj,{ tips:[1, '#df0007']});
                }
            }else{
                o.obj.addClass('pass').removeClass('active');
            }
        },
        beforeSubmit:function(curform){
            //在验证成功后，表单提交前执行的函数，curform参数是当前表单对象。
            //这里明确return false的话表单将不会提交;
            save();
            return false;
        }
    });

    function save(){
        var json = form.serializeObject();//此函数详见crm-jquery模块
        json[encodeURIComponent(gszz.attr('name'))] = encodeURIComponent(gszz.attr('src'));
        var imgs = $(imglist[0]).find('img');
        var arr = [];
        $.each(imgs,function(i,img){
            arr.push(encodeURIComponent(img.getAttribute('src')));
        });
        json.urlPic = arr;
        json.orgID = encodeURIComponent(id);
        //收集城市，省份，地区信息
        json.provinceName = province.find("option:selected").text();
        json.cityName = city.find("option:selected").text();
        json.countyName = area.find("option:selected").text();
        $.ajax({
            url:'/org/edit/mfcty',
            type:'POST',
            traditional:true,
            data:json,
            errorMsg:'抱歉，信息更新失败！',
            callback: function () {
                $.alert('信息更新成功！','s');
            }
        })
    }

});
module.exports = factoryEdit;
