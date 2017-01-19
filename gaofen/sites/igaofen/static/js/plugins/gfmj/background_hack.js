$(function(){


	var trs = $('#users_form tbody>tr'), ids = [], idsObj = {};
	trs.each(function(i, item){
		var id = $(item).find('td').eq(1).text();
		ids.push(id);
		idsObj[id] = $(item);
	});
	if(ids.length){
		$.get(G_BASE_URL+'/gfmj/ajax/is_mj/uids-'+ids.join(','), function (result){
			try{
		    	for(var k in result.rsm){
		    		var itemData = result.rsm[k], obj = idsObj[k];
		    		if(itemData == null){
			    		if(G_USER_ID != k)
			    			obj.find('.nowrap').append('<a href="javascript:void(0)" onclick="mj_add(event,'+k+')" class="icon icon-plus md-tip mj-add" title="增加马甲" data-original-title="增加马甲"></a>');
		    		}else{
			    		if(obj && G_USER_ID != k){
			    			obj.find('.nowrap').append('<a href="javascript:void(0)" onclick="mj_delete(event,'+itemData.id+')" class="icon icon-delete md-tip mj-del" title="删除马甲" data-original-title="删除马甲"></a>');		    			
			    		}
		    		}
		    		$('.aw-content-wrap .md-tip').tooltip('hide');
		    	}
			}catch(e){

			}

	    }, 'json').error(function (error){
	    	// WS.alert('');
	    });
	}

	window.mj_delete = function(e, id){
		e.preventDefault();
		// if(confirm("确定要删除马甲吗？")){
		AWS.dialog('confirm',{message:'确定要删除马甲吗？'}, function(isconfirm){
			AWS.loading('show');
			$.get(G_BASE_URL+'/gfmj/ajax/delete/id-'+id, function (result){
				AWS.loading('hide');
				try{
					var _id = $(e.target).closest('tr').find('td').eq(1).text();
					$(e.target).parent().append('<a href="javascript:void(0)" onclick="mj_add(event,'+_id+')" class="icon icon-plus md-tip mj-add" title="增加马甲" data-original-title="增加马甲"></a>');
				    $(e.target).remove();
				    $('.aw-content-wrap .md-tip').tooltip('hide');
				}catch(e){

				}

		    }, 'json').error(function (error){
		    	WS.alert('');
		    });
		})
	}

	window.mj_add = function(e, id){
		e.preventDefault();
		var dom = $(e.target), nickname = dom.closest('tr').find('td').eq(2).text();
		AWS.dialog('confirm',{message:''}, function(isconfirm){

		});
		$('.aw-confirm-box .yes').unbind('click').on('click', function(e){
			var mjid = $.trim($('#aw-ajax-box input[type="text"]').val());
			if(mjid && /^[0-9a-zA-Z]*$/.test(mjid)){
				$('#mjmodaltips').hide();
				AWS.loading('show');
				$.get(G_BASE_URL+'/gfmj/ajax/add/uid-'+id+'__flag-'+mjid+'__nickname-'+encodeURIComponent(nickname), function (result){
					AWS.loading('hide');
					$(".alert-box").modal('hide');
					try{
						dom.parent().append('<a href="javascript:void(0)" onclick="mj_delete(event,'+result.rsm+')" class="icon icon-delete md-tip mj-del" title="删除马甲" data-original-title="删除马甲"></a>')
					    dom.remove();
					    $('.aw-content-wrap .md-tip').tooltip('hide');
					}catch(e){

					}
			    }, 'json').error(function (error){
			    	// WS.alert('');
			    	$('#mjmodaltips').text('操作错误！').show();
			    });
			}else{
				$('#mjmodaltips').text('请正确填写编号！').show();

			}
		})
		
			$('#aw-ajax-box .modal-body').html('马甲编号：<input name="mj" type="text"><span style="color:red;display:none;" id="mjmodaltips"></span>');
		
		return;
		AWS.loading('show');
		$.get(G_BASE_URL+'/gfmj/ajax/add/uid-'+id+'__nickname-'+nickname, function (result){
			AWS.loading('hide');
			try{
				$(e.target).parent().append('<a href="javascript:void(0)" onclick="mj_delete(event,'+result.rsm+')" class="icon icon-delete md-tip mj-del" title="删除马甲" data-original-title="删除马甲"></a>')
			    $(e.target).remove();
			    $('.aw-content-wrap .md-tip').tooltip('hide');
			}catch(e){

			}
	    }, 'json').error(function (error){
	    	WS.alert('');
	    });
	}
})