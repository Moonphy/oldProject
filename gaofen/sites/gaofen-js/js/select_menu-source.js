//$('select[name="so_prov"]:not(:first),select[name="so_college_provid"]:not(:first),select[name="so_prov4"]:not(:first)').remove()
(function($){
    //城市select
    var jq_school_select_key=$('select[name="so_prov"],select[name="so_college_provid"],select[name="so_prov4"]'),
        jq_scholl_select_options=[];
    for(var key in school_select_key){
        jq_scholl_select_options.push("<option value='"+key+"'>"+school_select_key[key]+"</option>")
    }
    jq_school_select_key.append(jq_scholl_select_options.join(''));

    $('#so_college_provid').bind("change",function(){
        var index=$(this).val(),
            jq_so_collage=$('#so_college_id'),
            options=[],
            obj=school_option_key[index];
           jq_so_collage.find("option").remove();
        if(index==0){
            jq_so_collage.append("<option value='0'>目标大学</option>")
            }else{   
                for(var key in obj){
                     options.push("<option value='"+key+"'>"+obj[key]+"</option>")
                } 
           jq_so_collage.html(options.join(''));
           jq_so_collage.trigger("change");
        }
    }).trigger("change");
    //专业类
    var jq_so_major_catid=$("#so_major_catid"),
        jq_so_major_options=[];
    for(var key in major_select_key){
        jq_so_major_options.push("<option value='"+key+"'>"+major_select_key[key]+"</option>");
    }
    jq_so_major_catid.html(jq_so_major_options.join(''));
    jq_so_major_catid.bind("change",function(){
        var index=$(this).val(),
            obj=major_subcat[index],
            options = [],
            jq_so_marjor_select = $('#so_major_subcatid');
        jq_so_marjor_select.find("option").remove();

        for(var key in obj){
            options.push("<option value='"+key+"'>"+obj[key]+"</option>");
        }
        jq_so_marjor_select.html(options.join(''));

    })
    //input focus,blur
    $('input[name="s"]').bind("focus",function(){
        var _this=$(this),
            ipt=_this.attr("rel");
            _this.attr("autocomplete","off")
            _this.removeClass("input-default")
        if(_this.val()==ipt)
            _this.val('');       
    }).bind("blur",function(){
         var _this=$(this),
            ipt=_this.attr("rel");
        if(_this.val()==''){       
            _this.val(ipt);
            _this.addClass("input-default");
        }else{
            _this.removeClass("input-default")
        }
    })

    

})(jQuery);

$(document).ready(function(){
    function gaokao_search(_id,_str){
        var s=$(_id).val();
         if(s == _str || s == ''){
            $(_id).val('');
        }
        return true;
    }
    $("#_college").bind("click",function(){
        gaokao_search("#so1_s","输入大学名称");
    })
    $("#_major").bind("click",function(){
        gaokao_search("#so2_s","输入专业名称");
    })
    $("#_majorscore").bind("click",function(){
        gaokao_search("#majorname","输入专业名称");
    })
});