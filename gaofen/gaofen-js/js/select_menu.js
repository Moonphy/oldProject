/*!27-03-2015 12:19 Gaofen-js */
!function(o){var e=o('select[name="so_prov"],select[name="so_college_provid"],select[name="so_prov4"]'),n=[];for(var i in school_select_key)n.push("<option value='"+i+"'>"+school_select_key[i]+"</option>");e.append(n.join("")),o("#so_college_provid").bind("change",function(){var e=o(this).val(),n=o("#so_college_id"),i=[],t=school_option_key[e];if(n.find("option").remove(),0==e)n.append("<option value='0'>目标大学</option>");else{for(var a in t)i.push("<option value='"+a+"'>"+t[a]+"</option>");n.html(i.join("")),n.trigger("change")}}).trigger("change");var t=o("#so_major_catid"),a=[];for(var i in major_select_key)a.push("<option value='"+i+"'>"+major_select_key[i]+"</option>");t.html(a.join("")),t.bind("change",function(){var e=o(this).val(),n=major_subcat[e],i=[],t=o("#so_major_subcatid");t.find("option").remove();for(var a in n)i.push("<option value='"+a+"'>"+n[a]+"</option>");t.html(i.join(""))}),o('input[name="s"]').bind("focus",function(){var e=o(this),n=e.attr("rel");e.attr("autocomplete","off"),e.removeClass("input-default"),e.val()==n&&e.val("")}).bind("blur",function(){var e=o(this),n=e.attr("rel");""==e.val()?(e.val(n),e.addClass("input-default")):e.removeClass("input-default")})}(jQuery),$(document).ready(function(){function o(o,e){var n=$(o).val();return(n==e||""==n)&&$(o).val(""),!0}$("#_college").bind("click",function(){o("#so1_s","输入大学名称")}),$("#_major").bind("click",function(){o("#so2_s","输入专业名称")}),$("#_majorscore").bind("click",function(){o("#majorname","输入专业名称")})});