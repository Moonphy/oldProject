/**
 * Created by zhiwen on 2015-05-29.
 * custom 自定义表单
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
				},
				'join_number_text' : {
					title : '参加人数',
					id : 'join_number_text_area'
				},
				//特殊项目
				//开始、结束时间
				'start_end_text' : {
					title : '报名时间',
					id : 'start_end_text_area'					
				}
			},

			addFieldChoose : function(item, id, temp){
				return Util.parse(G.tpls.get(temp), $.extend({field_id:id},item));
			},

			addField : function(obj, id){
				if(!id){//新增加
					id = Util.createFieldId();
					var _type = obj.type;
					obj = $.extend(Ui[obj.type].prototype.getBaseOpt(), obj);

					obj.type = _type;
					obj.field_id = id;
					// console.log(obj)
				}
				var field, type = obj.type, self = this, componentType = type;
				switch(type){
					case 'single_line_text' : //创建单行文本					
					case 'phone_text'://电话
					case 'phone_mobile_text'://手机
					case 'email_text'://邮箱
					case 'paragraph_text' ://多行文本
					case 'join_number_text' : //参加人数
						var title_value = obj.title_value || '未命名';
						if(type === 'email_text'){
							componentType = 'single_line_text';
							title_value = obj.title_value || '邮箱';
							obj.title_value = title_value;
						}
						if(obj.title_value === undefined){
							obj.title_value = Ui[componentType].prototype.title_value;
						}
						var data = $.extend({
							autoRender : true,
							isCreate : obj.isCreate || true,
							field_id : id,
							// title_value : obj.title_value || '未命名',
							// default_value : obj.default_value || '',
							field_type : type,
							appendTo : '#fields_area',
							view : G.tpls.getItemView(componentType, $.extend({
								field_id : id,
								title_value : '未命名',
								field_type : type
							}, obj))
						}, obj);
						field = G.use(componentType, data);
					break;
					case 'single_choice_text' : //单项选择
					case 'multiple_choice_text'://多项选择

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
					case 'start_end_text':

						field = G.use(type, $.extend({
							autoRender : true,
							isCreate : obj.isCreate || true,
							field_id : id,
							title_value : obj.title_value || '日期',
							default_value : obj.default_value || '',
							appendTo : '#fields_area',
							view : G.tpls.getItemView(type, $.extend({
								field_id : id,
								title_value : '未命名',
								field_type : type
							}, obj))
						}, obj));
					break;

					case 'code_text' : 
						field = G.use(type, $.extend({
							autoRender : true,
							isCreate : obj.isCreate || true,
							field_id : id,
							title_value : obj.title_value || '验证码',
							appendTo : '#fields_area',
							view : Util.parse(G.tpls.get('code_text'), $.extend({
								field_id : id,
								title_value : '验证码',
								field_type : type
							}, obj))
						}, obj));
					break;

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
					arrange = obj.arrange || Ui['single_choice_text'].prototype.arrange;
				if(items){
					var itemTemp = prefix+'_choice_'+arrange+'_text';
					$.each(items, function(i, item){
						itemHtml.push(self.addFieldChoose(item, id, itemTemp));
					});
				}
				return itemHtml;
			},

			createSelect : function(items){

			},

			createOption : function(opts){
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

			copyFeild : function(id, fieldDom){
				var item = this.getFieldById(id);
				var newData = Util.clone(item.getSideBarData()), id = Util.createFieldId();
	        	var _newData = $.extend(newData, {field_id : id, appendTo : function(e){
	        		$(e).insertAfter(fieldDom);
	        	}});
	        	// if($.inArray(item.field_type, ['single_choice_text','drop_down_text','multiple_choice_text']) > -1){
	        	// 	var _items = $.extend([], _newData.items);

	        	// 	_newData.items = _items;

	        	// 	_items[0].name = '-------';

	        	// 	console.log(item.items[0].name, _items[0].name);
	        	// 	// newData.items = newData.choices
	        	// }
	        	manageFields.addField(_newData, id);
			},

			getData : function(){
				var data = [], childs = $('#fields_area').children(), extData = [];
				$.each(childs, function(i, dom){
					var rel = Util.parseKnV($(dom).attr('rel')),item = fields[rel.id];
					var itemData = item.getSideBarData();
					if(item.type === 'code_text'){
						itemData.frontIndex = i;
						extData.push(itemData);
					}else
						data.push(item.getSideBarData());
				});

				return [data,extData];
			},

			rander : function(data){
				// this.randerBase(data);
				// var fields = data.fields;
				// if($.type(fields) === 'string')
				// 	fields = JSON.parse(fields);
				// $.each(fields, function(i, item){
				// 	manageFields.addField(item, item.field_id);
				// });

				var fields = data.fields;
				if($.type(fields) === 'string')
					fields = JSON.parse(fields);
				var fd = fields.data, ext = fields.extData;
				if(ext && $.type(ext) === 'string'){
					ext = JSON.parse(ext);
				}
				$.each(fd, function(i, item){
					manageFields.addField(item, item.field_id);
				});
				$.each(ext, function(i, item){
					manageFields.addField(item, item.field_id, 'esp');
				});
			},

			randerBase : function(bd){
				var headers = $('#entry_area>.form-header');
				headers.find('input').val(bd.title);
				tinymce.get('rich-text-editor').setContent(bd.description);
			}
		};
		return returnObj;
	})();

	//测试使用
	win.manageFields = manageFields;


	/**
	 * 验证码
	 */
	Ui.code_text = G.reg('code_text', Util.create(G.ui.fieldComponent, {
		title : '验证码',
		field_id : '',
		field_type : 'code_text',
		getSideBarData : function(){
			var jq = this.jq(), self = this;
			return {
				field_id : this.field_id,
				type : this.field_type
			};
		},
		innerViewReady : function(e){
			G.ui.fieldComponent.prototype.innerViewReady.call(this, e);
			var self = this;
		}
	}));

	/**
	 * 单行文本
	 */
	Ui.single_line_text = G.reg('single_line_text', Util.create(G.ui.fieldComponent, {
		title : '单行文本',
		isCreate : true,//新建or修改
		title_value : '未命名',//标题
		default_value : '',//默认值
		field_id : '',
		field_type : 'single_line_text',
		getSideBarData : function(){
			var jq = this.jq(), self = this;
			return {
				field_id : self.field_id,
				type : self.field_type,
				title_value : jq.find('#title_txt').text(),
				default_value : jq.find('input[name="default_value"]').val(),
				tips_value : self.tips_value,
				choices : {//校验部分
					presence : self.presence,
					number : self.number
				}
			};
		},
		innerViewReady : function(e){
			G.ui.fieldComponent.prototype.innerViewReady.call(this, e);
			var self = this;
			// G.on('sidebar_text_ipt_blur', function(e){
			// 	if(self.field_id === e.id){
			// 		var targetDom = e.targetDom, type = e.type, v = e.v;
			// 		if(type === 'title'){
			// 			targetDom.find('#title_txt').text(v === '' ? '未命名' : v);
			// 		}else if(type === 'tips-textarea'){
			// 			self.jq().find('div.help-block').html(v);
			// 			self.tips_value = v;
			// 		}else{
			// 			targetDom.find('input[name="default_value"]').val(v);
			// 		}
			// 	}
			// });
		}
	}));

	/**
	 * 多行文本
	 */
	Ui.paragraph_text = G.reg('paragraph_text', Util.create(G.ui.fieldComponent, {
		title : '多行文本',
		isCreate : true,//新建or修改
		title_value : '未命名',//标题
		default_value : '',//默认值
		field_id : '',
		field_type : 'paragraph_text',
		getSideBarData : function(){
			var jq = this.jq(), self = this;
			return {
				field_id : self.field_id,
				type : self.field_type,
				title_value : jq.find('#title_txt').text(),
				default_value : jq.find('textarea').val(),
				tips_value : self.tips_value,
				choices : {//校验部分
					presence : self.presence,
					number : self.number
				}
			};		
		},
		innerViewReady : function(e){
			G.ui.fieldComponent.prototype.innerViewReady.call(this, e);
			// var self = this;
			// G.on('sidebar_text_ipt_blur', function(e){
			// 	if(self.field_id === e.id){
			// 		var targetDom = e.targetDom, type = e.type, v = e.v;
			// 		if(type === 'title'){
			// 			targetDom.find('#title_txt').text(v === '' ? '未命名' : v);
			// 		}else if(type === 'default_value'){
			// 			targetDom.find('textarea').text(v);
			// 		}
			// 	}
			// });
		}
	}));

	/**
	 * phone
	 */
	Ui.phone_text = G.reg('phone_text', Util.create(G.ui.fieldComponent, {
		title : '电话',
		isCreate : true,//新建or修改
		title_value : '电话',//标题
		default_value : '',//默认值
		field_id : '',
		field_type : 'phone_text',
		getSideBarData : function(){
			var jq = this.jq(), self = this;
			return {
				field_id : self.field_id,
				type : self.field_type,
				title_value : jq.find('#title_txt').text(),
				default_value : jq.find('input[name="default_value"]').val(),
				tips_value : self.tips_value,
				choices : {//校验部分
					presence : self.presence,
					number : self.number
				}
			};		
		}
	}));

	/**
	 * mobile
	 */
	Ui.phone_mobile_text = G.reg('phone_mobile_text', Util.create(G.ui.fieldComponent, {
		title : '手机',
		isCreate : true,//新建or修改
		title_value : '手机',//标题
		default_value : '',//默认值
		field_id : '',
		field_type : 'phone_mobile_text',
		getSideBarData : function(){
			var jq = this.jq(), self = this;
			return {
				field_id : self.field_id,
				type : self.field_type,
				title_value : jq.find('#title_txt').text(),
				default_value : jq.find('input[name="default_value"]').val(),
				tips_value : self.tips_value,
				choices : {//校验部分
					presence : self.presence,
					number : self.number
				}
			};		
		},
		innerViewReady : function(e){
			G.ui.fieldComponent.prototype.innerViewReady.call(this, e);
			// var self = this;
			// G.on('sidebar_text_ipt_blur', function(e){
			// 	if(self.field_id === e.id){
			// 		var targetDom = e.targetDom, type = e.type, v = e.v;
			// 		if(type === 'title'){
			// 			targetDom.find('#title_txt').text(v === '' ? '未命名' : v);
			// 		}else{
			// 			targetDom.find('input[name="default_value"]').val(v);
			// 		}
			// 	}
			// });
		}
	}));




	/**
	 * 日期
	 */
	Ui.date_text = G.reg('date_text', Util.create(G.ui.fieldComponent, {
		title : '日期',
		isCreate : true,//新建or修改
		title_value : '日期',//标题
		default_value : '',//默认值
		date_show : '',//特定日期
		field_id : '',
		field_type : 'date_text',
		getSideBarData : function(){
			var jq = this.jq(), self = this;
			return {
				field_id : self.field_id,
				type : self.field_type,
				title_value : jq.find('#title_txt').text(),
				default_value : jq.find('input[name="default_value"]').val(),
				date_show : self.date_show,
				tips_value : self.tips_value,
				choices : {//校验部分
					presence : self.presence,
					number : self.number
				}
			};		
		},
		innerViewReady : function(e){
			G.ui.fieldComponent.prototype.innerViewReady.call(this, e);
			var self = this;
			G.on('sidebar_text_ipt_blur', function(e){
				if(self.field_id === e.id){
					var targetDom = self.jq(), type = e.type, v = e.v;
					if(type === 'title'){
						targetDom.find('input[name="default_value"]').val(v);
						self.default_value = v;
					}else{
						self.date_show = v;
					}
				}
			});
		}
	}));


	/**
	 * 开始时间结束时间
	 */
	Ui.start_end_text = G.reg('start_end_text', Util.create(G.ui.fieldComponent, {
		title : '报名时间',
		isCreate : true,//新建or修改
		title_value : '报名时间',//标题
		default_value : '',//默认值
		date_show : '',//特定日期
		canDel : false,//不允许删除
		canCopy : false,//不允许复制
		startTime : '2015-8-10 20:00:00',
		endTime : '',
		field_id : '',
		field_type : 'start_end_text',
		getSideBarData : function(){
			var jq = this.jq(), self = this;
			return {
				field_id : self.field_id,
				type : self.field_type,
				title_value : jq.find('#title_txt').text(),
				startTime : jq.find('#startTime').text(),
				endTime : jq.find('#endTime').text(),
				tips_value : self.tips_value
			};		
		},
		innerViewReady : function(e){
			G.ui.fieldComponent.prototype.innerViewReady.call(this, e);
			var self = this;
			G.on('sidebar_text_ipt_blur', function(e){
				if(self.field_id === e.id){
					var targetDom = self.jq(), type = e.type, v = e.v;
					if(type === 'title'){
						targetDom.find('input[name="default_value"]').val(v);
					}else{
						targetDom.find('#'+type).text(v);
					}
				}
			});
		}
	}));


	/**
	 * 单项选择/或者多项选择 multiple_choice_text
	 */
	Ui.single_choice_text = G.reg('single_choice_text', Util.create(G.ui.fieldComponent, {
		title : '单项选择',
		isCreate : true,//新建or修改
		title_value : '未命名',//标题
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
		arrange : 'queue',
		field_type : 'single_choice_text',
		getSideBarData : function(){
			var jq = this.jq(), self = this;
			return {
				field_id : self.field_id,
				type : self.field_type,
				title_value : jq.find('#title_txt').text(),
				items : self.items,
				tips_value : self.tips_value,
				choices : {//校验部分
					presence : self.presence,
					arrange : self.arrange,
					number : self.number
				}
			};		
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
		innerViewReady : function(e){
			G.ui.fieldComponent.prototype.innerViewReady.call(this, e);
			var self = this;

			G.on('sidebar_text_checked_change', function(opts){
				if(self.field_id === opts.id){
					var type = opts.type;
					if(type === 'checked-change' || type === 'checkbox-checked'){
						var checkeds = self.jq().find('#choice_main input[type="radio"]');
						if(self.field_type === 'multiple_choice_text'){
							checkeds = self.jq().find('#choice_main input[type="checkbox"]');
						}
						$.each(opts.items, function(i, opt){
							// checkeds.eq(i).prop('checked', true)
							checkeds.eq(i).prop('checked', !!opt.checked)
							self.items[i].checked = opt.checked;
						});
					}else if(type === 'item-del'){
						self.jq().find('#choice_main').children().eq(opts.index).remove();
						self.items.splice(opts.index,1);
					}else if(type === 'item-add'){
						self.items.splice(opts.index, 0, opts.item);
						self.resetItemDom();
					}

				}
				// setTimeout(function(){self.resetItemDom();},1);
			});
			G.on('sidebar_text_inputText_change', function(opts){
				if(self.field_id === opts.id){
					self.items[opts.index].name = opts.name;
					self.resetItemDom();
				}
			});

			G.on('fields-item-sort-change', function(opts){
				if(self.field_id === opts.id){
					self.changePosition(opts.beforeSort, opts.nowSort);
				}
			});
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
	 * 参加人数
	 */
	Ui.join_number_text = G.reg('join_number_text', Util.create(G.ui.fieldComponent, {
		title : '参加人数',
		isCreate : true,//新建or修改
		title_value : '参加人数',//标题
		default_value : '',//默认值
		adult : 1, //大人
		children : 1, //小孩
		field_id : '',
		field_type : 'join_number_text',
		getSideBarData : function(){
			var jq = this.jq(), self = this;
			return {
				field_id : self.field_id,
				type : self.field_type,
				title_value : jq.find('#title_txt').text(),
				adult : jq.find('input[name="adult"]').val(),
				children : jq.find('input[name="children"]').val(),
				choices : {//校验部分
					presence : self.presence,
					number : self.number
				}
			};
		},
		innerViewReady : function(e){
			G.ui.fieldComponent.prototype.innerViewReady.call(this, e);
			var self = this;
			G.on('sidebar_text_ipt_blur', function(e){
				if(self.field_id === e.id){
					var targetDom = e.targetDom, type = e.type, v = e.v;
				// 	if(type === 'title'){
				// 		targetDom.find('#title_txt').text(v === '' ? '未命名' : v);
				// 	}else if(type === 'tips-textarea'){
				// 		self.jq().find('div.help-block').html(v);
				// 		self.tips_value = v;
				// 	}else{
						targetDom.find('input[name="'+type+'"]').val(v);
				// 	}
				}
			});
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
		getSideBarData : function(){
			var jq = this.jq(), self = this;
			return {
				field_id : self.field_id,
				type : self.field_type,
				title_value : jq.find('#title_txt').text(),
				items : self.items,
				tips_value : self.tips_value,
				choices : {//校验部分
					presence : self.presence,
					number : self.number
				}
			};		
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
				if(item.children.length){

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
			var opts = [], result = [], selected = [];
			if(!(selects && selects.length)){
				selects = [this.getItemBase()];
			}
			
			$.each(selects, function(i, item){
				if(item.selected && item.children && item.children.length)
					selected = item.children;
				if(item.id === '') item.id = 's_'+Util.createFieldId();
				opts.push(Util.parse(G.tpls.get('drop_down_text_opt'), item));			
			});
			result.push(Util.parse(G.tpls.get('drop_down_text_select'), {
				id: id || 's_'+Util.createFieldId(),
				options : opts.join('')
			}));	
			if(selected.length){
				 result.push(this.renderSelect(selected));
			}		

			return result.join('');
		},
		resetItems : function(items, id, state){
			$.each(items, function(i, item){
				if(item.id === id){
					item.checked = 'checked';
					item.selected = 'selected';
				}else{
					item.checked = '';
					item.selected = '';
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
		changeSelect : function(target, id){

		},		
		innerViewReady : function(e){
			// console.log(this.getItemBase())
			// this.items = [this.getItemBase()];
			// this.items.push(this.getItemBase());
			// this.items[0].checked = 'checked';
			// this.items[0].children.push(this.getItemBase('', this.items[0].id));
			G.ui.fieldComponent.prototype.innerViewReady.call(this, e);
			var self = this;
			G.on('sidebar_text_ipt_blur', function(e){
				if(self.field_id === e.id){
					var targetDom = e.targetDom, type = e.type, v = e.v;
					if(type === 'title'){
						targetDom.find('#title_txt').text(v === '' ? '未命名' : v);
					}else{
						targetDom.find('input[name="default_value"]').val(v);
					}
				}
			});
			//sidebar修改选项
			G.on('sidebar_text_dropdown_checked_change', function(opts){
				if(self.field_id === opts.id){
					var item = self.getItem(opts.rel.id, self.items);
					
					if(item.checked !== opts.state){						
						var parent = opts.rel.parent ? self.getItem(opts.rel.parent) : self.items;
						if(parent.children) parent = parent.children;
						if(parent){
							self.resetItems(parent, opts.rel.id, opts.state);
							self.reloadSelectView();
						}
					}
				}
			});

			G.on('sidebar_text_inputText_change', function(opts){
				if(self.field_id === opts.id){
					var rel = opts.rel, pid = rel.parent, id = rel.id;
					if(id){
						var item = self.getItem(id);
						if(item){
							item.name = opts.name;
							if(item.selected){
								var option = self.jq().find('option[rel="id:'+id+',parent:'+pid+'"]');
								option.text(item.name).val(item.name);
							}
						}
					}

				}
			});

			G.on('sidebar_text_checked_change', function(opts){
				if(self.field_id === opts.id){
					var rel = opts.item.rel, parent = self.getItem(rel.parent);
					if(opts.type=== 'item-del'){//删除
						var item = self.getItem(rel.id);
						self.deleteItem(parent, item);
						self.reloadSelectView();
					}else{//添加
						var newItem = self.getItemBase('', rel.parent, rel.id);
						// console.log(newItem);
						if(parent.children){
							parent.children.splice(opts.index, 0, newItem);
							// parent.children.push(newItem);
						}else{
							parent.splice(opts.index,0, newItem);
						}
					}
				}
			});

			G.on('fields-item-sort-change', function(opts){
				if(self.field_id === opts.id){
					self.changePosition(opts.beforeSort, opts.nowSort, opts.parent);
				}
			});
		},

		changePosition : function(start, end, pid){
			var items = this.getItem(pid);
			var item = items.splice(start, 1);
			items.splice(end, 0, item[0]);
			this.renderSelect();
		}
	}));



	var sidebar;

	G.reg('sidebar', Util.create(Base, {
		curField_id : '',//当前对应field
		curField_type : 'single_line_text',
		targetDom : '',
		autoRender : true,
		iptErrorCs : 'has-error',
		errorTipCs : 'help-block',
		nullTitle : '未命名',
		titleErrorTips : '标题不能为空',
		view : $('#sidebar')[0],
		display : function(p){
			return $(this.view).display(p);
		},
		setInputError : function(ipt, hasVal, tips){
			var p = ipt.parent();
			if(!hasVal){
				p.addClass(this.iptErrorCs);
				p.find('.'+this.errorTipCs).display(1).text(tips);
			}else{
				p.removeClass(this.iptErrorCs);
				p.find('.'+this.errorTipCs).display(0);
			}
		},
		setInfo : function(obj){
			this.curField_id = obj.id;
			this.curField_type = obj.type;
			this.targetDom = obj.targetDom;
		},
		setPosition : function(opt){
			try{
				var targetDom = this.targetDom,
					top = targetDom.offset().top,
					childs = this.jq().children('div');
				childs.eq(0).offset({top: top - 60});
				childs.eq(1).offset({top: top - 60+100});
			}catch(e){}

		},

		getComponet : function(p){
			var curPart = p || this.curField_type;
			return manageFields.components[curPart];
		},

		getComponetDom : function(p){
			var info = this.getComponet(p);
			return this.jq().find('#'+info['id']);
		},

		setTitle : function(p){
			var info = this.getComponet(p);
			this.jq().find('.edit-box-tit').text(info['title']);
		},
		showPart : function(p){
			var dom = this.getComponetDom();
			this.jq().find('#edit_fields_area').children(':not([id="field_ext"])').display(0);
			this.jq().find('#field_tips').display(1);
			dom.display(1);
		},
		resetComponetDate : function(data){
			var dom = this.getComponetDom(), self = this, extData = data.choices, type = this.curField_type;
			// tinymce.get('tinymce_area').setContent();
			tinymce.get('tinymce_area').setContent(data.tips_value||'');
			var ipts = dom.find('input'), title_value = data.title_value === self.nullTitle ? '' : data.title_value;
			ipts.eq(0).val(title_value);
			self.setInputError(ipts.eq(0), !!title_value, self.titleErrorTips);
			switch(type){
				case  'paragraph_text' :
					var ipts = dom.find('input');

					dom.find('textarea[name="default"]').text(data.default_value);
				// break;
				case 'single_line_text' : 
				case 'phone_text':
				case 'phone_mobile_text':

					ipts.length > 1 && ipts.eq(1).val(data.default_value);
				break;
				case 'single_choice_text' :
				case 'multiple_choice_text' :
						var prefix = 'single';
						if(type === 'multiple_choice_text'){
							prefix = 'multiple';
						}
						var itemHtml = [], items = data.items;
						if(items){
							var itemTemp = 'sidebar_'+prefix+'_choice_item';
							$.each(items, function(i, item){
								itemHtml.push(manageFields.addFieldChoose(item, self.curField_id, itemTemp));
							});
						}
						dom.find('#choices_text_area').html(itemHtml.join(''));
				break;
				case 'drop_down_text' :
					var itemHtml = [], items = data.items;
					if(items){
							var itemTemp = 'sidebar_drop_drow_item';
							itemHtml = self.createSelect(items);
						}
					dom.find('#choices_text_area').html(itemHtml.join(''));	
				break;
				case 'date_text' : 
					// var ipts = dom.find('input'), title_value = data.title_value === self.nullTitle ? '' : data.title_value;
					// ipts.eq(0).val(title_value);
					// self.setInputError(ipts.eq(0), !!title_value, self.titleErrorTips);
					ipts.eq(1).val(data.default_value||'');
					dom.find('select').val(data.date_show||'');
				break;
			}
			if($.inArray(this.curField_type, ['single_line_text','paragraph_text','phone_text','phone_mobile_text','email_text'])> -1){
				this.jq().find('#e_number').display(1);
			}else{
				this.jq().find('#e_number').display(0);
			}
			var extdom = this.jq().find('#field_ext');
			if(extData){
				extdom.display(1);
				$.each(extData, function(key, item){
					extdom.find('input[name='+key+']').prop('checked', item);
				});
			}else{
				extdom.display(0);
			}
		},
		createSelect : function(items){
			// console.log(html)
			var itemTemp = 'sidebar_drop_drow_item', selects = [], self = this, radioId = Util.createFieldId();
			$.each(items, function(i, item){
				// var tmp = Util.parse(G.tpls.get(itemTemp), item), _html;
				var html = [];
				var tmp = G.tpls.get(itemTemp);
				if(item.children && item.children.length){
					html = self.createSelect(item.children);
					if($.type(html) === 'array'){
						html = html.join('');
					}
				}
				var data = $.extend({childs:html, radioId: radioId}, item);
				tmp = Util.parse(tmp, data);
				 // console.log(tmp)
				selects.push(tmp);

				// selects.push(Util.parse(G.tpls.get('itemTemp'), item));
			});
			return selects;

		},
		onViewReady : function(e){
			this.setEvent();
			var self = this;
			G.on('field-active-side', function(opt){
				var old_id  = self.curField_id;
				self.setInfo(opt);
				self.setTitle();
				self.resetComponetDate(opt.data);
				self.display(1);
				self.setPosition();
				if(opt.id !== old_id){
					self.showPart();
				}
			});

			G.on('nosidebar', function(opts){
				// if(opts.show){
					self.display(!!opts);
				// }
			})

			G.on('fields-sort-change', function(e){
				if(self.targetDom) self.setPosition();
			});
			var beforeSort;
			$('#sidebar div[id="choices_text_area"]').each(function(i, item){
				self.defineSort(item);
			});

		},

		defineSort : function(target){
			var self = this, beforeSort;
			$(target).sortable({ handle: 'span.sort-handler',
				start : function(e, li){
					beforeSort = $(li.item).index();
				},
	        	update  : function(e, li){
	        		var jqItem = $(li.item), rel = Util.parseKnV(jqItem.attr('rel'));
	        		var returnData = {
						id : self.curField_id,
						beforeSort : beforeSort,
						nowSort : jqItem.index()
					};
	        		if(self.curField_type === 'drop_down_text'){
	        			returnData.parent = rel.parent;
	        		}
					G.fire('fields-item-sort-change', returnData);
				}
			});
		},

		//删除图标状态
		checkedRemoveState : function(opt){
			var state = 0;
			if(opt.type === 'item-del'){
				state = opt.len  === 1 ? 0 : 1;
			}else if(opt.type === 'item-add'){
				state = 1;
			}
			var items = this.getComponetDom().find('.text-danger');
			items.eq(0).display(state);
		},

		getDate : function(p){
			var date = new Date();
			if(p) date = new Date(p); 
			var year = date.getFullYear(), month = date.getMonth()+1,
				day = date.getDate();
			return year+'-'+month+'-'+day;
		},

		setEvent : function(e){
			var self = this;
			G.on('tinymce-tips-blur', function(opt){
				G.fire('sidebar_text_ipt_blur', {
					targetDom : self.targetDom,
					id : self.curField_id,
					type : 'tips-textarea',
					v : opt.text
				})
			});
			$.each(manageFields.components, function(name, item){
				var part = self.getComponetDom(name);
				switch(name){
					case 'date_text' : 
					case 'start_end_text' :
						var dates = $.fn.datetimepicker.dates.
						    cn = {
						      days: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
						      daysShort: ["日", "一", "二", "三", "四", "五", "六", "七"],
						      daysMin: ["日", "一", "二", "三", "四", "五", "六", "七"],
						      months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
						      monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
						      today: "今天",
						      meridiem: ['am', 'pm'],
						      clear: "清除"
						    };
							$('#cdate,#startTime,#endTime').datetimepicker({
						        weekStart: 1,
						        todayBtn:  1,
								autoclose: 1,
								todayHighlight: 1,
								startView: 2,
								minView: 2,
						        language:'cn',
						         format:"yyyy-mm-dd",
								forceParse: 0
								
						    }).on('changeDate', function(e){
						    	console.log(this.value)
									G.fire('sidebar_text_ipt_blur', {
										targetDom : self.targetDom,
										id : self.curField_id,
										type : this.name,
										v  : this.value
									});
								});
						part.find('#cdate,#startTime,#endTime').on('keydown', function(e){
							if(e.keyCode === 8){
								$(this).val('');
							}
						});


						$('#date_show_change').on('change', function(e){
							var v = this.value, setv = '';;
							if(v === ''){
								setv = '';
							}else{
								if(v === 'today'){
									setv = self.getDate();
								}else if(v === 'yesterday'){
									setv = self.getDate(+new Date-(1000*24*3600));
								}else{
									setv = self.getDate(+new Date+(1000*24*3600));
								}
							}
							$('#cdate').val(setv).datetimepicker('update').trigger('changeDate');
							G.fire('sidebar_text_ipt_blur', {
								targetDom : self.targetDom,
								id : self.curField_id,
								type : 'date_show_change',
								v  : v
							});
						})
						
					case 'paragraph_text' : 
						part.find('textarea[name="default"]').on('blur', function(e){
							G.fire('sidebar_text_ipt_blur', {
								targetDom : self.targetDom,
								type : 'default',
								id : self.curField_id,
								v  : this.value
							});
						});
					
					case 'single_choice_text':
					case 'multiple_choice_text':
					case 'drop_down_text':
						var chooses = part.find('#choices_text_area').on('click', function(e){
							var target = e.target, targetType = 'radio', type = 'checked-change', _items = [];
							if(target.type === 'checkbox'){
								targetType = 'checkbox';
								type = 'checkbox-checked';
							}
							if(name === 'drop_down_text'){
									var list = $(target).closest('.radio'), rel = Util.parseKnV(list.attr('rel'));
									G.fire('sidebar_text_dropdown_checked_change', {
										rel : rel,
										state : $(target).prop('checked')? 'checked' : '',
										id : self.curField_id
									});
							}else{
								$(target).closest('.choices').find('input[type="'+targetType+'"]').each(function(i, tar){
									_items.push({checked:$(tar).prop('checked') ? 'checked':''});
									// _items.push($(tar).prop('checked'));
								})
								G.fire('sidebar_text_checked_change', {
									type : type,
									id : self.curField_id,
									items : _items
								});
							}
						}).on('keyup', function(e){
							var target = e.target, jqDom = $(target), targetType = 'text';
							if(target.type === targetType){
								var data = {
									id : self.curField_id,
									type : targetType,
									index : jqDom.closest('div').index(),
									name : $.trim(jqDom.val())
								};
								if(name  === 'drop_down_text'){
									data.rel = Util.parseKnV(jqDom.closest('div').attr('rel'));
								}
								G.fire('sidebar_text_inputText_change', data);
							}
							
						}).on('click', 'a.text-danger,a.text-success', function(e){//删除项
							e.preventDefault();

							self.addItem(e, name);

						}).on('click', 'div.toggle', function(e){
							var t = $(this), pdom = t.parent();
							if(pdom.hasClass('fold')){
								pdom.removeClass('fold');
								pdom.find('.choices').display(1);
							}else{
								pdom.addClass('fold');
								pdom.find('.choices').display(0);
							}


						});
					
						part.on('click','div.extra-actions>a', function(e){
							e.preventDefault();
							var jqDom = $(e.currentTarget), id = jqDom.attr('id');
							if(id === 'dropdown_add'){
								var itemdiv = part.find('#choices_text_area').children().eq(0);
								self.addItem(e, name, {
									itemdiv : itemdiv,
									parent : '',
									rel : itemdiv.attr('rel')
								});
							}else if(id === 'dropdown_close'){
								part.find('#choices_text_area .radio').addClass('fold');
								part.find('#choices_text_area .choices').display(0);
							}else if(id === 'dropdown_open'){
								part.find('#choices_text_area .radio').removeClass('fold');
								part.find('#choices_text_area .choices').display(1);
							}
						})

					case 'single_line_text':
					case 'phone_text':
					case 'phone_mobile_text':
					case 'email_text'://邮箱
					case 'join_number_text':
						part.find('input:not("#cdate")').on('blur', function(e){
							G.fire('sidebar_text_ipt_blur', {
								targetDom : self.targetDom,
								id : self.curField_id,
								type : this.name,
								v : $.trim(this.value)
							});
							if(this.name === 'title'){
								self.setInputError($(this), !!$.trim(this.value), self.titleErrorTips);
							}
						});
					break;
				}
				
			});

			var extdom = this.jq().find('#field_ext'), checkboxs = extdom.find('input[type="checkbox"]');
			checkboxs.on('click', function(e){
				var name = this.name, v = $(this).prop('checked');
				G.fire('sidebar-checkbox-click', {
					targetDom : self.targetDom,
					id : self.curField_id,
					name : name,
					v : v
				})
			})
		},

		addItem : function(e, name, obj){
			var self = this, jqDom = $(e.currentTarget),itemdiv = jqDom.closest('div');
				
			if(obj){//下拉“添加新项”
				itemdiv = obj.itemdiv;
			}
			var index = itemdiv.index(), type = 'item-del', item = {},
				len = itemdiv.parent().children().length,
				drop_del = false;
			if(jqDom.hasClass('text-danger')){	
				if(itemdiv.parent().attr('id') === 'choices_text_area') 
					drop_del = true;							
				itemdiv.remove();
				len--;
				if(name  === 'drop_down_text'){
					item = {
						rel : Util.parseKnV(itemdiv.attr('rel'))
					};

				}
			}else if(jqDom.hasClass('text-success') || obj){
				type = 'item-add';
				len++;
				item = {
					name : '选项',
					checked : ''
				};
				var newDom = $(itemdiv.clone());
				newDom.find('.choices').html('');
				newDom.find(':checked').prop('checked',false);
				if(name  === 'drop_down_text'){
					var rel = itemdiv.attr('rel');
					 if(obj){
					 	rel = obj.rel;

					 }
					var relobj = Util.parseKnV(rel);

					if(obj){
						relobj.id = '';			
					}
					var nid = 's_'+Util.createFieldId(), newRel = 'parent:'+relobj.id+',id:'+nid;
					// if(itemHtml.parent().attr('id') !== 'choices_text_area'){
						newDom.attr('rel', newRel);
					// }
					var brothers = itemdiv.find('.choices').children(), radioId;
					if(brothers.length){
						radioId = brothers.eq(0).find('input[type="radio"]').attr('name');
					}else{
						radioId = Util.createFieldId();
					}
					if(obj){
						relobj.id = obj.parent;
						newRel = 'parent:'+obj.id+',id:'+nid;
						brothers = [];
						radioId = itemdiv.find('input[type="radio"]').attr('name');
						drop_del = true;
						len = 2;
					} 

					item = {
						rel : {
							id : nid,
							parent : relobj.id
						}
					};
					// var brothers = itemdiv.find('.choices').children(), radioId;

					newDom.find('input[type="radio"]').attr('name', radioId);
					newDom.find('input[type="input"]').val('');
					newDom.find('input[type="text"]').val('选项');
					if(obj){
						newDom = newDom.appendTo(itemdiv.parent());
					}else{
						var p = itemdiv.find('.choices').eq(0);
						newDom = newDom.appendTo(p);
						// p.sortable({ handle: '>span.sort-handler'});
						self.defineSort(p);
					}

					newDom.find('.text-danger').removeClass('hidden');
					index = newDom.index();
				}else{
					newDom = newDom.insertAfter(itemdiv);
				}
			}
			G.fire('sidebar_text_checked_change', {
				type : type,
				id : self.curField_id,
				index : index,
				item : item
			});
			if(name === 'drop_down_text' && !drop_del) return;
			self.checkedRemoveState({
				type : type,
				len : len,
				name : name
			});
			
		}
	}));



	var editingcs = 'editing';
	G.actions.reg('field', function(e, obj){
		// var fields_area = $('#fields_area'), target = obj.target;
		G.fire('field-active', {
			field_id : obj.id
		});
		return true;
	})
	//显示添加按钮
	.reg('showBtns', function(e, obj){
		G.fire('isShow-adds-area', {
			show : true
		});
		e.stopPropagation();
	})
	//添加具体项目
	.reg('add', function(e, obj){
		if(obj.type === 'code_text' && manageFields.getFeildsByType('code_text').length > 0) return;
		delete obj['target'];
		delete obj['e'];
		var field = manageFields.addField(obj);
		field.jq().trigger('click');
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



	var State = 'create';

	$(function(){

		var cfg = Gaofen.PD.get();

		if(cfg && cfg.form)
			State = 'edit';

		G.event();

		sidebar = G.use('sidebar');


 		// manageFields.addField({type:'single_line_text'});

		$('html').on('click', function(e){
			G.fire('isShow-adds-area', {
				show : false
			});
			// G.fire('show-hide-header', {
			// 	show : 0
			// })
		});


		tinymce.init({
          selector: '#tinymce_area',
          menubar: false,
          height: 120,
          statusbar : false,
          init_instance_callback : function(editor){
			editor.$('body').on('blur', function(e){
				G.fire('tinymce-tips-blur', {
					text : editor.getContent()
				});
			});
		  }
        });


        G.actions
        .reg('pre', function(e){
        	var d = manageFields.getData(),
        		jqform = $('#preview_from'),
        		ipts = jqform.find('input'),
        		headers = $('#entry_area>.form-header'),
        		formname = $.trim(headers.eq(0).find('input').val()),
				des = tinymce.get('rich-text-editor').getContent();
			if(!formname){
				Tips.setTips('error', '请填写表单名称');
				return;
			}

			ipts.eq(0).val(formname);
			ipts.eq(1).val(des);
			ipts.eq(2).val(JSON.stringify(d[0]));
			ipts.eq(3).val(JSON.stringify(d[1]));
			jqform.submit();

        })
        .reg('save', function(e){
        	var d = manageFields.getData(),
        		uri = '/form/backend_dashboard/store',
        		headers = $('#entry_area>.form-header'),
        		formname = $.trim(headers.eq(0).find('input').val()),
				des = tinymce.get('rich-text-editor').getContent();
			if(!formname){
				Tips.setTips('error', '请填写表单名称');
				return;
			}
			var postData = {
        		title : formname,
        		description : des,
        		height : $('#fields_area').height()+350,
        		fields : {data: d[0], extData : d[1]}
        	};
			if(State === 'edit'){
	        	uri = '/form/backend_form/update';
	        	postData.id = G.PD.get('form').id;
	        }
        	G.Ajax.send(uri, postData, function(r){
        		Tips.setTips('success', '保存成功', function(){
        			if(State === 'create')
        				location.href = '/form/backend_form/edit?id='+r.rst.id;
        		});
        		
        	},'post');
        }).reg('entry', function(e){
	        G.fire('field-active', {
				field_id : ''
			});
			$('#sidebar').display(0);
			G.fire('show-hide-header', {
				show : 1
			});
			e.stopPropagation();
        }).reg('editheader', function(e){
        	e.stopPropagation();
        }).reg('del', function(e){
        	var fieldDom = $(e.target).closest('.field'), rel = Util.parseKnV(fieldDom.attr('rel'));
        	manageFields.removeField(rel.id);
        	fieldDom.remove();
        	sidebar.display(0);
        }).reg('copy', function(e){
        	var fieldDom = $(e.target).closest('.field'), rel = Util.parseKnV(fieldDom.attr('rel'));
        	
        	// var item = manageFields.getFieldById(rel.id);

        	manageFields.copyFeild(rel.id, fieldDom);

        });


        tinymce.init({
          selector: '#rich-text-editor',
          menubar: false,
          height: 120,
          statusbar : false,
          init_instance_callback : function(editor){
	        if(State === 'edit'){
	        	manageFields.randerBase(cfg.form);
	        }
		  }

        });

        if(State === 'edit'){
        	manageFields.rander(cfg.form);
        }else{

        	manageFields.addField({
        		title_value : '报名时间',
        		type : 'start_end_text'
        	})
        }

        $('#fields_area').sortable({ handle: '.sort-handler',
        	update  : function(e, li){
				G.fire('fields-sort-change');
			}
		}); //handle设置实现拖动位置 

        (function(){
        	var formAction = $('.form-actions'), h = formAction.eq(0).offset().top,
        		wh = $(window).height();
	        $(window).scroll(function(){
				var sh = $(this).scrollTop();		
				if(wh+sh > h){
					formAction.eq(0).display(0);
					formAction.eq(1).display(1);				
				}else{
					formAction.eq(1).display(0);
					formAction.eq(0).display(1);	
				}
			});
        })();
		


	});

})(window, jQuery, Gaofen);