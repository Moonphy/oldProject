/**
 * Created by zhiwen on 2015-5-29.
 * 自定义表单模版
 */
 
(function($, win, G){
	
	G.tpls = {
	
		get : function(name){
			return this[name];
		},

		getItemView : function(name, maps){
			var parent = this.get('field'), itemhtml = G.util.parse(this.get(name), maps);
			return G.util.parse(parent, $.extend({
				item_content : itemhtml
			}, maps));
		},


		'field' : ['<div class="field" rel="e:field,id:{.field_id},type:{.field_type}"><i class="fa fa-bars sort-handler"></i>',
	                    '<div class="actions"><i title="删除" class="fa fa-trash" rel="e:del"></i><i rel="e:copy" title="复制" class="fa fa-copy"></i>',
	                    '</div>',
	                    '<div class="icons">',
	                    '</div>',
	                    '<div class="form-group">',
	                        '<label class="control-label" id="title_txt">{.title_value}',
	                        '</label>',
	                        '<div class="error-message"></div>',
	                        '<div class="help-block">{.tips_value}',
	                        '</div>',
	                        '<div class="controls">',
	                            '{.item_content}',
	                        '</div>',
	                    '</div>',
                '</div>'].join(''),

        'code_text' : ['<div class="field" rel="e:field,id:{.field_id},type:{.field_type}"><i class="fa fa-bars sort-handler"></i>',
                '<div class="actions"><i title="删除" rel="e:del" class="fa fa-trash"></i></div>',
                '<div class="icons">',
                '</div>',
                '<div class="form-group">',
                  '<label class="control-label">验证码',
                  '</label>',
                  '<div class="help-block">',
                  '</div>',
                  '<div class="controls">',
                    '<div class="captcha">',
                      '<input type="text" disabled="disabled" class="form-control input-sm w80"><img src="../../images/captcha.png" alt=""><a href="#">看不清，换一张</a>',
                    '</div>',
                    '<div class="error-message hidden"><i class="fa fa-warning"></i><span>出错啦</span></div>',
                  '</div>',
                '</div>',
              '</div>'].join(''),

		'single_line_text' : ['<input value="{.default_value}" rows="3" name="default_value" disabled="disabled" class="form-control">'].join(''),
		'phone_text' : ['<input rows="3" name="default_value" disabled="disabled" class="form-control">'].join(''),
		'phone_mobile_text' : ['<input rows="3" name="default_value" disabled="disabled" class="form-control">'].join(''),

		//单、多项选择
		'choice_text' : ['<div class="choices" id="choice_main">{.chooses}</div>'].join(''),

        //单项选择横响排列                    
        'single_choice_inline_text' : ['<div class="radio-inline"><label>',
                                    '<input name="{.field_id}" {.checked} type="radio" disabled="disabled">{.name}',
                                '</label></div>'].join(''),
        //单项选择纵响排列   
        'single_choice_queue_text'  : ['<div class="radio"><label>',
                                    '<input type="radio" name="{.field_id}" {.checked}  disabled="disabled">{.name}',
                                '</label></div>'].join(''), 

         //参加人数                         
        'join_number_text' : ['<div class="checkbox-inline">',
                                    '<div>小孩：<input type="text" value="{.children}" name="children"><button>+</button><button>-</button></div>',
                                    '<div>大人：<input type="text" value="{.adult}"  name="adult"><button>+</button><button>-</button></div>',
                                '</div>'].join(''),

        //单项选择其它                    
        'single_choice_other_text' : ['<div class="radio-inline other-choice"><label>',
                                    '<input type="radio"  name="{.field_id}"  {.checked}   disabled="disabled">其他',
                                    '<input type="text" disabled="disabled" class="form-control input-sm">',
                                '</label></div>'].join(''),

        //多项选择横响排列                    
        'multiple_choice_inline_text' : ['<div class="checkbox-inline"><label>',
                                    '<input name="{.field_id}" {.checked} type="checkbox" disabled="disabled">{.name}',
                                '</label></div>'].join(''),
        //多项选择纵响排列   
        'multiple_choice_queue_text' : ['<div class="checkbox"><label>',
                                    '<input type="checkbox" name="{.field_id}" {.checked}  disabled="disabled">{.name}',
                                '</label></div>'].join(''),   

        //多项选择其它                    
        'multiple_choice_other_text' : ['<div class="checkbox-inline other-choice"><label>',
                                    '<input type="checkbox"  name="{.field_id}"  {.checked}   disabled="disabled">其他',
                                    '<input type="text" disabled="disabled" class="form-control input-sm">',
                                '</label></div>'].join(''),
        //下拉选项
        'drop_down_text_select' : ['<select disabled="disabled" rel="id:{.id},parent:{.parent}" id={.id} class="form-control input-md">{.options}',
                            '</select>'].join(''),

        'drop_down_text_opt' : '<option value="{.name}" {.selected} rel="id:{.id},parent:{.parent}">{.name}</option>',

        //日期
        'date_text' : ['<input rows="3" value="{.default_value}" name="default_value" disabled="disabled" class="form-control">'].join(''),

        'start_end_text' : ['<div class="checkbox-inline"><label>开始时间：</label>',
                                    '<span type="text"  id="startTime">{.startTime}</span>',
                                    '<label>结束时间：</label><span type="text"  id="endTime">{.endTime}</span>',
                                '</div>'].join(''),


		'paragraph_text' : ['<textarea name="default_value" rows="3" disabled="disabled" class="form-control">{.default_value}</textarea>'].join(''),

		'single_line_edit' : ['<div class="field">',
                        '<div class="form-group">',
                            '<label class="control-label">标题</label>',
                            '<div class="controls">',
                                '<input type="text" placeholder="未命名" value="{.title_value}" class="form-control input-sm">',
                                '<div class="help-block hidden">标题不能为空</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                    '<div class="field">',
                        '<div class="form-group">',
                            '<label class="control-label">默认值</label>',
                            '<div class="controls">',
                                '<input type="text" class="form-control input-sm"  value="{.default_value}" >',
                            '</div>',
                        '</div>',
                    '</div>'].join(''),

        //sidebar部分
        'sidebar_single_choice_item' : ['<div class="radio">',
                                        '<label>',
                                            '<input type="radio" {.checked}  name="edit_{.field_id}" >',
                                            '<input type="text" placeholder="选项" class="form-control input-sm" value="{.name}">',
                                        '</label><span class="actions"><a href="#" title="删除" class="text-danger"><i class="fa fa-minus-circle"></i></a><a href="#" title="添加新项" class="text-success"><i class="fa fa-plus-circle"></i></a></span><span class="sort-handler"><i class="fa fa-bars"></i></span>',
                                    '</div>'].join(''),

        'sidebar_single_choice_other' : ['<div class="radio">',
                                '<label>',
                                    '<input type="radio" {.checked}  name="edit_{.field_id}"  value="{.name}">其它',
                                '</label><span class="actions"><a href="#" title="删除" class="text-danger"><i class="fa fa-minus-circle"></i></a></span><span class="sort-handler"><i class="fa fa-bars"></i></span>',
                            '</div>'].join(''), 


        'sidebar_multiple_choice_item' : ['<div class="checkbox">',
                                        '<label>',
                                            '<input type="checkbox" {.checked}  name="edit_{.field_id}" >',
                                            '<input type="text" placeholder="选项" class="form-control input-sm"  value="{.name}">',
                                        '</label><span class="actions"><a href="#" title="删除" class="text-danger"><i class="fa fa-minus-circle"></i></a><a href="#" title="添加新项" class="text-success"><i class="fa fa-plus-circle"></i></a></span><span class="sort-handler"><i class="fa fa-bars"></i></span>',
                                    '</div>'].join(''),

        'sidebar_multiple_choice_other' : ['<div class="checkbox">',
                                '<label>',
                                    '<input type="rcheckboxadio" {.checked}  name="edit_{.field_id}"  value="{.name}">其它',
                                '</label><span class="actions"><a href="#" title="删除" class="text-danger"><i class="fa fa-minus-circle"></i></a></span><span class="sort-handler"><i class="fa fa-bars"></i></span>',
                            '</div>'].join(''),

        'sidebar_drop_drow_item' : ['<div class="radio" rel="parent:{.parent},id:{.id}">',
                                        '<div class="toggle"><i class="fa fa-minus-square-o"></i><i class="fa fa-plus-square-o"></i></div>',
                                        '<label>',
                                            '<input type="radio" {.checked} name="{.radioId}">',
                                            '<input type="text" placeholder="选项"  value="{.name}" class="form-control input-sm">',
                                        '</label><span class="actions"><a href="#" title="删除" class="text-danger"><i class="fa fa-minus-circle"></i></a><a href="#" title="添加子项" class="text-success"><i class="fa fa-plus-circle"></i></a></span><span class="sort-handler"><i class="fa fa-bars"></i></span>',
                                        '<div class="choices">{.childs}',
                                        '</div>',
                                    '</div>'].join('')                          




	}
})(jQuery, window, Gaofen);