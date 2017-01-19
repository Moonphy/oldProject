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


		'field' : ['<div class="field">',
                        '<div class="form-group">',
                            '<label class="control-label">{.title_value}',
                            '</label>',
                            '<div class="help-block">{.tips_value}',
                            '</div>',
	                        '<div class="controls">',
	                            '{.item_content}',
                                '<div class="error-message hidden"  id="error_tips"><i class="fa fa-warning"></i><span>出错啦</span></div>',
	                        '</div>',
	                    '</div>',
                '</div>'].join(''),
        //验证码
        'code_text' : ['<div class="field" rel="e:field,id:{.field_id},type:{.field_type}"><i class="fa fa-bars sort-handler"></i>',
	                    '<div class="icons">',
	                    '</div>',
	                    '<div class="form-group">',
	                    	'<label class="control-label" id="title_txt">{.title_value}',
	                        '</label>',
	                        '<div class="controls">',
	                            '<input value="" rows="3" name="default_value" disabled="disabled" class="">DiNs',
	                        '</div>',
	                    '</div>',
                '</div>'].join(''),

		'single_line_text' : ['<input type="text" value="{.default_value}" class="form-control {.extcss}"/>'].join(''),

        'paragraph_text' : ['<textarea rows="3" class="form-control"></textarea>'].join(''),

		'phone_text' : ['<input type="text"  value="{.default_value}" class="form-control {.extcss}"/>'].join(''),
		'phone_mobile_text' : ['<input type="text"  value="{.default_value}" class="form-control {.extcss}"/>'].join(''),

        'start_end_text' : ['<div class="checkbox-inline"><label>开始时间：</label>',
                                    '<span type="text"  id="startTime">{.startTime}</span>',
                                    '<label>结束时间：</label><span type="text"  id="endTime">{.endTime}</span>',
                                '</div>'].join(''),
		//单、多项选择
		'choice_text' : ['<div class="choices" id="choice_main">{.chooses}</div>'].join(''),

        //单项选择横响排列                    
        'single_choice_inline_text' : ['<label class="radio-inline"><input type="radio"  name="{.field_id}" {.checked}  value="{.name}">{.name}</label>'].join(''),
        //单项选择纵响排列   
        'single_choice_queue_text'  : ['<div class="radio"><label><input type="radio"  name="{.field_id}" {.checked} value="{.name}">{.name}</label></div>'].join(''),   

        //单项选择其它                    
        'single_choice_other_text' : ['<div class="radio-inline other-choice"><label>',
                                    '<input type="radio"  name="{.field_id}" value="{.name}" {.checked}   disabled="disabled">其他',
                                    '<input type="text" disabled="disabled" class="form-control {.extcss}">',
                                '</label></div>'].join(''),

        //多项选择横响排列                    
        'multiple_choice_queue_text' : ['<div class="checkbox"><label><input type="checkbox" value="{.name}" name="{.field_id}" {.checked}>{.name}</label></div>'].join(''),
        //多项选择纵响排列   
        'multiple_choice_inline_text'  : ['<label class="checkbox-inline"><input type="checkbox" value="{.name}" name="{.field_id}" {.checked}>{.name}</label>'].join(''),   

        //多项选择其它                    
        'multiple_choice_other_text' : ['<div class="checkbox-inline other-choice"><label>',
                                    '<input type="checkbox" value="{.name}" name="{.field_id}"  {.checked}   disabled="disabled">其他',
                                    '<input type="text" disabled="disabled" class="form-control {.extcss}">',
                                '</label></div>'].join(''),
        //下拉选项
        'drop_down_text_select' : ['<select onchange="gf_from_select(this)" class="form-control {.extcss}" rel="id:{.id},parent:{.parent}">{.options}</select>'].join(''),

        'drop_down_text_opt' : '<option value="{.name}" {.selected} rel="id:{.id},parent:{.parent}">{.name}</option>',

        //日期
        'date_text' : ['<input rows="3" value="{.default_value}"" name="default_value" class="form-control Wdate">'].join(''),
        //移动端日期
        'mobile_date_text' : ['<input rows="3" type="date" value="{.default_value}" name="default_value" class="form-control Wdate">'].join(''),

        'code_text' : ['<div class="captcha"><input type="text" class="form-control {.extcss} w80"/><img src="/Captcha/getcode" alt=""/><a href="#">看不清，换一张</a></div>'].join('')


	}
})(jQuery, window, Gaofen);