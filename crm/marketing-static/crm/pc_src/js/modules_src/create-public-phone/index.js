var listPublicPhone = {};
var common = require('common');
var $ = common.jquery;
var layer = require('layer');

var contactTypeName = document.getElementById('contactTypeName'),
    contactTypeID = document.getElementById('contactTypeID'),
    delBtn = $('#delBtn'),
    backBtn = $('#backBtn'),
    backUrl = '/base/pubPhone/find/pub/all';

$('#submitBtn').on('click',function(){
    $('#form').submit();
});

$.ajax({
    url:'/wx/phone/getContectType',
    errorMsg:'联系人类型信息加载失败',
    callback:function(models){
        if(models.length>0){
            contactTypeName.innerHTML = '';
            $.each(models,function(idx,data){
                var option = document.createElement('option');
                option.id = data.typeID;
                option.text = data.typeName;
                if(params.contactTypeID==data.typeID){
                    option.selected = 'selected';
                }
                contactTypeName.appendChild(option);
            });
            if(params.contactTypeID==''){
                $(contactTypeID).val(1);
            }
        }
    }
});

$(contactTypeName).on('change',function(){
    $(contactTypeID).val($('#contactTypeName option:selected')[0].id);
});
backBtn.on('click',function(){
    location.href=backUrl;
});
delBtn.on('click',function(){
    layer.confirm('你确定删除此号码？',{icon: 3, title:'提示'},function(index){
        $.ajax({
            url:'/base/pubPhone/del',
            data:'id='+encodeURIComponent(params.id),
            errorMsg:'抱歉，删除失败',
            callback:function(){
                $.alert('号码已删除！','s', function () {
                    layer.close(index);
                    location.href=backUrl;
                });
            }
        });
    });
});

module.exports = listPublicPhone;
