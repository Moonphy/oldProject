/**
 * Created by zhiwen on 2015-05-29.
 * custom 自定义表单生成程序
 */
 /*
	单选框 single_choice
	复选框 multiple_choice
	下拉框 drop_down
	日期 date
	Email email
	数字 number
	电话 phone
	多行文本 paragraph_text
	单行文本 single_line_text
 */
"use strict";

(function(win, $, G){

	var Util = G.util, Ui = G.ui, Base = Ui.Base;

	//管理已创建项目
	var manageFields = (function(){
		var fields = {};

		G.on('remove-field', function(opt){
			if(opt.id && fields[opt.id])
				returnObj.removeField(opt.id);
		})

		var returnObj = {
			components : {
				'single_line_text' : {
					title : '单行文本',
					id : 'single_line_text_area'
				},'paragraph_text':{
					title : '多行文本',
					id : 'paragraph_text_area'
				},'phone_text':{
					title : '电话',
					id : 'phone_text_area'
				},'phone_mobile_text':{
					title : '手机',
					id : 'phone_mobile_text_area'
				},'email_text':{
					title : 'Email',
					id : 'email_text_area'
				},'date_text':{
					title : '日期',
					id : 'date_text_area'
				},'single_choice_text':{
					title : '单项选择',
					id : 'single_choice_text_area'
				},'drop_down_text':{
					title : '下拉框',
					id : 'drop_down_text_area'
				},'multiple_choice_text':{
					title : '复选框',
					id : 'multiple_choice_text_area'
				}
			},

			addFieldChoose : function(item, id, temp){
				return Util.parse(G.tpls.get(temp), $.extend({field_id:id},item));
			},

			addField : function(obj, id, esp){
				if(!id){//新增加
					id = Util.createFieldId();
				}
				obj.extcss = isMobile ? 'input-lg' : 'input-sm';//pc版或者移动版样式
				var field, type = obj.type, self = this, componentType = type;
				switch(type){
					case 'single_line_text' : //创建单行文本					
					case 'phone_text'://电话
					case 'phone_mobile_text'://手机
					case 'email_text'://邮箱
					case 'paragraph_text' ://多行文本
						if(type === 'email_text') componentType = 'single_line_text';
						// console.log(Ui.fieldComponent.prototype.getVrel(obj.presence, obj.number))
						field = G.use(componentType, $.extend({
							autoRender : true,
							isCreate : obj.isCreate || true,
							field_id : id,
							presence : (obj.choices.presence === 'true' || obj.choices.presence === true) ? true : false,
							number : (obj.choices.number === 'true' || obj.choices.number === true) ? true : false,
							title_value : obj.title_value || '未命名',
							default_value : obj.default_value || '',
							field_type : type,
							appendTo : '#fields_area',
							view : G.tpls.getItemView(componentType, $.extend({
								field_id : id,
								title_value : '未命名',
								field_type : type
								// vrel : Ui.fieldComponent.prototype.getVrel(obj.presence, obj.number)
							}, obj))
						}, obj));
					break;
					case 'single_choice_text' : //单项选择
					case 'multiple_choice_text'://多项选择
							// obj.arrange = 'inline';
						var itemHtml = self.choicesItem(type, id, obj), _type = 'single_choice_text',
							items  = obj;
						// if(type === 'multiple_choice_text')
						field = G.use('single_choice_text', $.extend({
							autoRender : true,
							isCreate : obj.isCreate || true,
							field_id : id,
							title_value : obj.title_value || '未命名',
							appendTo : '#fields_area',
							field_type : type,
							view : G.tpls.getItemView('choice_text', $.extend({
								field_id : id,
								title_value : '未命名',
								field_type : type,
								chooses : itemHtml.join('')
							}, obj))
						}, obj));
					break;

					case 'drop_down_text':
						if(!obj.items){
							obj.items = [Ui.drop_down_text.prototype.getItemBase()];
						}
						
						var item_content = Ui.drop_down_text.prototype.renderSelect(obj.items);

						field = G.use(type, $.extend({
							autoRender : true,
							isCreate : obj.isCreate || true,
							field_id : id,
							presence : (obj.choices.presence === 'true' || obj.choices.presence === true) ? true : false,
							title_value : obj.title_value || '未命名',
							default_value : obj.default_value || '',
							appendTo : '#fields_area',
							view : G.tpls.getItemView(type, $.extend({
								field_id : id,
								title_value : '未命名',
								field_type : type,
								item_content : item_content
							}, obj))
						}, obj));

						// console.log(field.getItem(field.items[0].children[0].id, field.items))
						// var item_content = field.renderSelect(field.items);
						// console.log(item_content)
					break;

					case 'date_text' : 
						var tempType = type;
						 if(isMobile) tempType = 'mobile_date_text';
						 // tempType = 'mobile_date_text';
						field = G.use(type, $.extend({
							autoRender : true,
							isCreate : obj.isCreate || true,
							field_id : id,
							presence : (obj.choices.presence === 'true' || obj.choices.presence === true) ? true : false,
							title_value : obj.title_value || '日期',
							default_value : obj.default_value || '',
							appendTo : '#fields_area',
							view : G.tpls.getItemView(tempType, $.extend({
								field_id : id,
								title_value : '未命名',
								field_type : type
							}, obj))
						}, obj));
						// return '';
					break;

					case 'code_text' : //特殊数据
						field = G.use(type, $.extend({
							autoRender : true,
							isCreate : obj.isCreate || true,
							field_id : id,
							title_value : obj.title_value || '验证码',
							appendTo : '#fields_area',
							view : G.tpls.getItemView(type, $.extend({
								field_id : id,
								title_value : '验证码',
								field_type : type
							}, obj))
						}, obj));
					break;

				}

				if(esp){//特殊数据
					var index = obj.frontIndex;
					if(index !== undefined){
						var view = field.jq(), _index = view.index();
						if(index != _index){
							console.log('change-position');
							var parent = view.parent(), indexDom = parent.children().eq(index);
							view.insertBefore(indexDom);
						}
					}
				}

				return fields[id] = field;

			},

			choicesItem : function(type, id, obj){
				var prefix = 'single', self = this, items = obj.items;
				items = items || Ui['single_choice_text'].prototype.createSample();
				if(type === 'multiple_choice_text'){
					prefix = 'multiple';
				}
				obj.items = items;
				var itemHtml = [],  
					items = obj.items || Ui['single_choice_text'].prototype.items,
					arrange = obj.choices.arrange || Ui['single_choice_text'].prototype.arrange;
				if(items){
					var itemTemp = prefix+'_choice_'+arrange+'_text';
					$.each(items, function(i, item){
						itemHtml.push(self.addFieldChoose(item, id, itemTemp));
					});
				}
				return itemHtml;
			},


			afterSort : function(e){
				var childs = $('#entry_area').children();
			},

			removeField : function(id){
				return delete fields[id];
			},

			getFieldById : function(id){
				return fields[id];
			},

			getFeildsByType : function(t){
				var _fields = [];
				$.each(fields, function(i, f){
					if(f.field_type === t){
						_fields.push(f);
					}
				});
				return _fields;
			},


			getData : function(){
				var data = {data : {}, extData:{}}, isTrue = true;
				$.each(fields, function(i, item){
					// if(item.type === 'date_text'){
					// 	data[item.field_id] = item.getData();
					// 	return;
					// }
					if(!item.isNullVil()){
						isTrue = false;
					}else{
						if(item.type === 'code_text'){
							data.extData['captcha'] = item.getData();
						}else{
							data.data[item.field_id] = item.getData();
						}					
						// data.push(item.getData());
					}
				});

				return isTrue ? data : isTrue;
			},

			rander : function(data){
				// this.randerBase(data);
				var fields = '', ext = '';
				if(isPreview){
					fields = data.fields;
					ext = data.extData;
					if($.type(fields) === 'string')
						fields = JSON.parse(fields);
					if(ext && $.type(ext) === 'string'){
						ext = JSON.parse(ext);
					}
				}else{
					data = data.fields;
					if($.type(data) === 'string')
						data = JSON.parse(data);
					fields = data.data;
					ext = data.extData;
					if(ext && $.type(ext) === 'string'){
						ext = JSON.parse(ext);
					}
				}
				$.each(fields, function(i, item){				
					manageFields.addField(item, item.field_id);
				});
				$.each(ext||[], function(i, item){
					manageFields.addField(item, item.field_id, 'esp');
				});

				$('#fields_area').append('<div class="field submit-field"><input type="submit" value="提交" class="btn btn-primary" rel="e:save" id="fbtn"></div>');
			},

			randerBase : function(bd){
				var headers = $('#entry_area>.form-header');
				headers.find('input').val(bd.title);
				tinymce.get('rich-text-editor').setContent(bd.description);
			}
		};
		return returnObj;
	})();





	/**
	 * 验证码
	 */
	G.reg('code_text', Util.create(G.ui.fieldComponent, {
		title : '验证码',
		field_id : '',
		presence : true,
		nullmsg : '请输入验证码',
		uri : '/Captcha/getcode',
		field_type : 'code_text',
		getData : function(){
			var jq = this.jq(), self = this;
			return jq.find('input').val();
		},
		isNullVil : function(e){
			this.jq().find('input').trigger('blur');
			return this.isPresenceVil();
		},
		onViewReady : function(e){
			var jq = this.jq(), self = this;
			jq.find('input').on('blur', function(e){
				var v = self.getIptVal();
				if(v === ''){
					self.setError('请输入验证码');
				}else{//
					G.Ajax.send('/Captcha/auth?code='+v, {}, function(r){
						if(r.errno == '0'){

						}else{
							self.setError('请正确输入验证码');
							jq.find('img').attr('src', self.uri+'?'+(+new Date));
						}
						G.fire('codeAuth-once', {
							isTrue : r.errno == '0'
						});
					})
				}
			});
			jq.find('img,a').on('click', function(e){
				e.preventDefault();
				jq.find('img').attr('src', self.uri+'?'+(+new Date));
			});
		}
	}));

	/**
	 * 单行文本 
	 */
	G.reg('single_line_text', Util.create(G.ui.fieldComponent, {
		title : '单行文本',
		isCreate : true,//新建or修改
		title_value : '',//标题
		default_value : '',//默认值
		field_id : '',
		field_type : 'single_line_text',
		getData : function(){
			return this.getIptVal();
			var jq = this.jq(), data = {};
			// data[this.field_id] = $.trim(jq.find('input[type="text"]').val());
			return $.trim(jq.find('input[type="text"]').val());
		},
		onViewReady : function(){
			this.bindVil();
		}
	}));

	/**
	 * 多行文本
	 */
	G.reg('paragraph_text', Util.create(G.ui.fieldComponent, {
		title : '多行文本',
		isCreate : true,//新建or修改
		title_value : '',//标题
		default_value : '',//默认值
		field_id : '',
		field_type : 'paragraph_text',
		getData : function(){
			var jq = this.jq(), data = {};
			return $.trim(jq.find('textarea').val());
			// data[this.field_id] = $.trim(jq.find('textarea').val());
			// return data;
		},
		onViewReady : function(){
			this.bindVil();
		}
	}));

	/**
	 * phone
	 */
	G.reg('phone_text', Util.create(G.ui.fieldComponent, {
		title : '电话',
		isCreate : true,//新建or修改
		title_value : '',//标题
		default_value : '',//默认值
		field_id : '',
		field_type : 'phone_text',
		getData : function(){
			var jq = this.jq(), data = {};
			return $.trim(jq.find('input[type="text"]').val());
			// data[this.field_id] = $.trim(jq.find('input[type="text"]').val());
			// return data;
		},
		onViewReady : function(){
			this.bindVil();
			// var self = this;
			// jq.find('input[type="text"]').on('blur', function(e){
			// 	if(!self.isPhone()){
			// 		self.setError('请正确输入手机号');
			// 	}
			// });
			// rjq.find('input[type="text"]');
		}
	}));

	/**
	 * mobile
	 */
	G.reg('phone_mobile_text', Util.create(G.ui.fieldComponent, {
		title : '手机',
		isCreate : true,//新建or修改
		title_value : '日期',//标题
		default_value : '',//默认值
		field_id : '',
		field_type : 'phone_mobile_text',
		getData : function(){
			var jq = this.jq(), data = {};
			// data[this.field_id] = $.trim(jq.find('input[type="text"]').val());
			return $.trim(jq.find('input[type="text"]').val());
			// return data;
		},
		isNullVil : function(e){
			return (this.isPresenceVil() && this.isPhone());
		},
		isPhone : function(e){
			var v = this.getIptVal();

			if(!v){
				if(this.presence){
					this.setError('请输入手机号');
					return false;
				}else{
					return true;
				}

			} 
			if(!/^1[3|4|5|8][0-9]\d{8}$/.test(v)){
				this.setError('请正确输入手机号');
				return false
			}
			this.setError('');
			return true;
		},
		onViewReady : function(){
			// this.bindVil();
			var self = this;
			this.jq().find('input[type="text"]').on('blur', function(e){
				if(!self.isPhone()){
					// self.setError('请正确输入手机号');
				}
			});
		}
	}));




	/**
	 * 日期
	 */
	G.reg('date_text', Util.create(G.ui.fieldComponent, {
		title : '日期',
		isCreate : true,//新建or修改
		title_value : '',//标题
		default_value : '',//默认值
		date_show : '',//特定日期
		field_id : '',
		field_type : 'date_text',
		getData : function(){
			return this.getIptVal();
			var jq = this.jq(), self = this;
			return this.default_value;	
		},
		onViewReady : function(e){
			this.bindVil();
			if(!isMobile){	
				var ipt = this.jq().find('input');
				var dates = $.fn.datetimepicker.dates.cn = {
							      days: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
							      daysShort: ["日", "一", "二", "三", "四", "五", "六", "七"],
							      daysMin: ["日", "一", "二", "三", "四", "五", "六", "七"],
							      months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
							      monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
							      today: "今天",
							      meridiem: ['am', 'pm'],
							      clear: "清除"
							    };
				ipt.datetimepicker({
			        weekStart: 1,
			        todayBtn:  1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					minView: 2,
			        language:'cn',
			         format:"yyyy-mm-dd",
					forceParse: 0
			    });

			    $('.datetimepicker-days .prev').text('<');
			    $('.datetimepicker-days .next').text('>');
			}
		}
	}));


	/**
	 * 单项选择/或者多项选择 multiple_choice_text
	 */
	Ui.single_choice_text = G.reg('single_choice_text', Util.create(G.ui.fieldComponent, {
		title : '单项选择',
		isCreate : true,//新建or修改
		title_value : '',//标题
		// default_value : '',//默认值
		field_id : '',
		items : [{
			name : '选项',
			checked : ''
		},{
			name : '选项',
			checked : ''
		},{
			name : '选项',
			checked : ''
		}],//选择
		arrange : 'inline',
		field_type : 'single_choice_text',
		getData : function(){
			var jq = this.jq(), self = this, data = {};
			if(this.type === 'single_choice_text'){
				// data[this.field_id] = encodeURIComponent(jq.find('input[type="radio"]:checked').val());
				return encodeURIComponent(jq.find('input[type="radio"]:checked').val());
			}else{
				var v = [];
				jq.find('input[type="checkbox"]:checked').each(function(i,item){
					v.push(encodeURIComponent($(item).val()));
				});
				// data[this.field_id] = v;
				return v;
			}	
			return data;
		},
		addFieldChoose : function(item, id, temp){
			return Util.parse(G.tpls.get(temp), $.extend({field_id:id},item));
		},
		choicesItem : function(id, type, obj){
			var prefix = 'single', self = this;
			if(type === 'multiple_choice_text'){
				prefix = 'multiple';
			}
			var itemHtml = [],  
				items = obj.items || Ui['single_choice_text'].prototype.items,
				arrange = obj.arrange || Ui['single_choice_text'].prototype.arrange;
			if(items){
				var itemTemp = prefix+'_choice_'+arrange+'_text';
				$.each(items, function(i, item){
					itemHtml.push(self.addFieldChoose(item, id, itemTemp));
				});
			}
			return itemHtml;
		},
		createSample : function(){
			return [{
				name : '选项',
				checked : ''
			},{
				name : '选项',
				checked : ''
			},{
				name : '选项',
				checked : ''
			}];
		},
		resetItemDom : function(){
			var html = manageFields.choicesItem(this.field_type,this.field_id, this.getSideBarData());
			this.jq().find('#choice_main').html(html.join(''));
		},
		onViewReady : function(){
			this.bindVil();
		},

		changePosition : function(start, end, items){
			if(!items) items = this.items;
			// console.log(this.items)
			var item = items.splice(start, 1);
			items.splice(end, 0, item[0]);
			// console.log(this.items)
			this.resetItemDom();
		}
	}));

	/**
	 * 下拉选项
	 */
	Ui.drop_down_text = G.reg('drop_down_text', Util.create(G.ui.fieldComponent, {
		title : '下拉选项',
		isCreate : true,//新建or修改
		title_value : '',//标题
		field_id : '',
		field_type : 'drop_down_text',
		item : {
				id : '0',
				name : '选项',
				checked : '',
			    selected : '',
			    parent : '',
			    children : []
			},
		items : [],
		getData : function(){
			var jq = this.jq(), data = {}, v = [];
			jq.find('select').each(function(i, item){
				v.push(encodeURIComponent($(item).val()));
			});		
			return v;
			// return data[this.field_id] = v;
		},
		getItemBase : function(obj, parent, id){
			var item = {}, obj = obj || this.item;
			obj.children = [];
			for(var k in obj){
				var v = obj[k];
				if(k === 'id') v = id||'s_'+Util.createFieldId();
				item[k] = v;
				if(k === 'parent') item[k] = parent||'';
			}
			return item;
			// console.log(item);
		},
		getItem : function(id, items){
			if(id === '' || id === '0') return this.items;
			if(!items) items = this.items;
			var self = this;
			for(var i=0, l = items.length;i<l;i++){
				var item = items[i], tarItem;
			// $.each(items, function(k, item){
				if(id === item.id) return item;
				if(item.children && item.children.length){

					tarItem = self.getItem(id, item.children);
				}
				if(tarItem) return tarItem;
			};
			return '';

		},

		reloadSelectView : function(data){
			var sel = this.renderSelect(data||this.items);
			this.jq().find('.controls').html(sel);
		},

		renderSelect : function(selects, id){
			if(selects.length === 0) return '';
			var opts = [], result = [], selected = '', parent = '';
			if(!(selects && selects.length)){
				selects = [this.getItemBase()];
			}
			$.each(selects, function(i, item){
				// if(item.selected && item.children && item.children.length)
				// 	selected = item.children;
				if(item.selected){
					selected = (item.children && item.children.length) ? item.children : [];
				}
				if(item.id === '') item.id = 's_'+Util.createFieldId();
				opts.push(Util.parse(G.tpls.get('drop_down_text_opt'), item));	
				parent = item.parent;		
			});
			result.push(Util.parse(G.tpls.get('drop_down_text_select'), {
				id: id || 's_'+Util.createFieldId(),
				parent : parent,
				options : opts.join('')
			}));	
			if($.type(selected) === 'array'){
				 result.push(this.renderSelect(selected));
			}else if(selects[0].children && selects[0].children.length){
				result.push(this.renderSelect(selects[0].children));
			}		

			return result.join('');
		},
		resetItems : function(items, id, isCirculate){
			var self = this;
			$.each($.type(items) === 'array' ? items : items.children, function(i, item){
				if(item.id === id){
					item.checked = 'checked';
					item.selected = 'selected';
				}else{
					item.checked = '';
					item.selected = '';
					// if(isCirculate && item.children && item.children.length){
					// 	self.resetItems(item.children, '', true);
					// }
				}
			});
		},
		deleteItem : function(parent, childItem){
			var org = parent, delIndex;
			if(parent.children){
				org = parent.children;
			}
			$.each(org, function(i, item){
				if(item.id === childItem.id){
					delIndex = i;
					
				}
			});
			if(delIndex !== undefined)
				org.splice(delIndex, 1);
		},
		changeSelect : function(target, parent){

			this.resetItems(parent, target.id, true);

			this.jq().find('.controls').html(this.renderSelect(this.items));
		},
		onViewReady : function(e){
			var self = this;
			G.on('drop_down_select_onchange', function(p){
				var index = p.index;
				if(self.jq().index() === index){
					if(p.obj){
						var opt = p.obj.find('option:selected'),
							rel = Util.parseKnV(opt.attr('rel'));
						var item = self.getItem(rel.id), parent = self.getItem(rel.parent);
						// if(item.children && item.children.length){
							self.changeSelect(item, parent);
						// }
					}
				}
			})
		},			
		changePosition : function(start, end, pid){
			var items = this.getItem(pid);
			var item = items.splice(start, 1);
			items.splice(end, 0, item[0]);
			this.renderSelect();
		}
	}));

	win.manageFields = manageFields;

	
	G.actions.reg('save', function(e, obj){
		if(isPreview) return;
		// var fields_area = $('#fields_area'), target = obj.target;
		var data = manageFields.getData();		
		if(data){
			var id = G.PD.get('form').id;
			if(manageFields.getFeildsByType('code_text').length){
				G.on('codeAuth-once', function(opt){
					if(opt.isTrue){
						G.Ajax.send('/form/form/store?id='+id, {
							id : id,
							fields : data
						}, function(r){
							console.log(r);
							if(r.errno == '0') location.href="/form/form/finish";
							else alert(r.msg)
						}, 'post');
					}
					G.actions.del('self_codeAuth-once');
				})
			}else{
				G.Ajax.send('/form/form/store?id='+id, {
					id : id,
					fields : data
				}, function(r){
					console.log(r);
					if(r.errno == '0') location.href="/form/success";
				}, 'post');
			}
		}
	});

	G.on('isShow-adds-area', function(obj){
		var add_area = $('#add_area');
		// if(add_area.display())
		if(obj && obj.show){
			add_area.addClass('show-optional-fields');
		}else{
			add_area.removeClass('show-optional-fields');
		}
	});
	G.on('tips-event', function(e){
		
		if(e.type  === 'success'){

		}
	});

	var Tips = (function(){
		var dom = $('#alert_msg'), succCs = 'alert-success', errorCs = 'alert-danger',
			timer = null, timeout = 3000,
			succType = 'success', errorType = 'error',
			obj = {
				setTips : function(type, msg, fn){
					clearTimeout(timer);		
					obj.setCs(type, msg);
					timer = setTimeout(function(){
						dom.display(0);
						fn && fn();
					}, timeout);
					
				},

				setCs : function(type, msg){
					if(type === succType){
						dom.removeClass(errorCs).addClass(succCs);
					}else{
						dom.removeClass(succCs).addClass(errorCs);
					}
					dom.display(1).find('span').text(msg);
				}
			};

			return obj;
	})();



	win['gf_from_select'] = function(_this){
		var select =  $(_this), len = select.closest('.field').index();
		G.fire('drop_down_select_onchange', {
			obj : $(_this),
			index : len
		})
	};

	var isPreview = true,//预览
		isMobile = win.location.href.indexOf('mobile') > -1 ? true : false;


	var parentHost, sendIt = function(host, h){
    // 通过 postMessage 向子窗口发送数据
	    window.parent
	        .postMessage(
	            {
	            	height : h
	            },
	            host||parentHost
	        );
	}
	$(function(){

		var cfg = Gaofen.PD.get();

		if(cfg.form.id)
			isPreview = false;

		G.event();

		manageFields.rander(cfg.form);

		window.addEventListener("message", function( event ) {
	        // 把父窗口发送过来的数据显示在子窗口中
	        // console.log('event:', event.data);
	        parentHost = 'http://'+event.data.host
	        sendIt(parentHost, $('body').height());
	    }, false );

	});




})(window, jQuery, Gaofen);