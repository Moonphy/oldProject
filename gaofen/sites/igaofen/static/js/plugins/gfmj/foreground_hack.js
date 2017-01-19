
$(function(){

	$.get(G_BASE_URL+'/gfmj/ajax/get_my_list/', function (result){
		var div = $('#isPublishByTime').parent();
		var opts = ['<option value="">请选择马甲</option>'];
		try{
			if($.type(result) !== 'object'){
        		result = JSON.parse(result);
        	}
			var res = result.rsm;
			$.each(res, function(i, item){
				opts.push('<option value="'+item.mj_id+'">'+item.mj_nickname+'</option>');
			})
			div.append('<select name="user_id" id="mjselect" style="display:none;margin-left:20px;width:150px">'+opts.join('')+'</select>');
		}catch(e){}
		
	});
	$('#isPublishByTime').on('change', function(e){
		$('#mjselect')[$(this).prop('checked')? 'show':'hide']();
	})

})