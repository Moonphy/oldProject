/**
 * Created by Administrator on 2014/10/12.
 */
$(document).ready(function(){
    $(".center_wrap2 input").click(function() {
       $("#popup-edit").show();
    });

    $(".popup-edit ul li").click(function(){
        $("#txtType").val($(this).text());
        $("#popup-edit").hide();
    });
});