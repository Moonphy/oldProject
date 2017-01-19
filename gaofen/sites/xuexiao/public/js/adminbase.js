/**
 * Created by zhiwen on 2015-1-30.
 * 学校后台基础信息，在base基础上扩展
 */
 
(function($, win, G){
	var Util = G.util,
		isIE = navigator.userAgent.toLowerCase().indexOf("msie") > 0;
	$.extend(G.util, {
		//所在区域
		areaCmp : function(area){
			var fg = area.find('#areaPart'), fgRel = fg.attr('rel'), city = G.PD.get('city'),
				parentSelect = fg.find('select:eq(0)'), changeSelect = fg.find('select:eq(1)');
			try{
				fgRel = Util.parseKnV(fgRel);
			}catch(e){}
			var createOpt = function(data, dom){
				var opts = ['<option value="">请选择</option>'], v, name;
				for(var k in data){
					var item = data[k];
					if(item.name){
						v = k+'_'+item.name;
						name = item.name;
					}else{
						v = k+'_'+item;
						name = item;
					}					
					opts.push('<option value="'+v+'">'+name+'</option>');
				}
				dom.html(opts.join(''));
			}
			parentSelect.on('change', function(){
				var v = this.value;
				if(v === ''){
					createOpt({}, changeSelect);
					//changeSelect.val('');
				}else{
					v = v.split('_')[0];
					var data = city[v];
					createOpt(data['district'], changeSelect);
				}
			})

			if(city){
				createOpt(city, parentSelect);
				if($.type(fgRel) === 'object'){
					var id = fgRel.city, pcity = city[id];
					parentSelect.val(fgRel.city+'_'+pcity['name']).trigger('change');
					changeSelect.val(fgRel.district+'_'+pcity['district'][fgRel.district]);
				}			
			}
			return {
				getData : function(){
					return {
						city : parentSelect.val(),
						district : changeSelect.val()
					}
				},
				reset : function(){
					parentSelect.val('');
					parentSelect.trigger('change');
				}
			};	
		},

		getNum : function(text){
			return text.replace(/[^0-9\.]/ig,"");
		},

		tinymce : function(opt){
			var config = {			
				//selector: 'textarea',
				mode : "exact",
				theme: 'modern',
				statusbar : false,
				height : 250,
				elements : 'editor',
				convert_urls : false,
				language : 'zh_CN',
				setup : function(ed){
				},
				plugins: [
					'filemanager', 'image', 'code','link'
				],
				toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image code'
			 };
			 
			if(opt){
				$.extend(config, opt);
			}
			tinymce.init(config);


			//editor paste clear style
			tinymce.clearStyle = function(eid, _e){
				function getSel(w){
					return w.getSelection ? w.getSelection() : w.document.selection;
				}
				function setRange(sel,r){
					sel.removeAllRanges();
					sel.addRange(r);
				}
				function filterPasteData(originalText){
					//保留br p换行
					return originalText.replace(/style="[^"]*"/gi, '')
						.replace(/<br/gi,'mybr-tag')
						.replace(/<p/gi,'myp-tag')
						.replace(/<\/p/gi,'mypp-tag')
						.replace(/<[^>]+>/g,"")
						.replace(/myp-tag/g,"<p")
						.replace(/mypp-tag/g,"</p")
						.replace(/mybr-tag/g,"<br")
						.replace(/class="[^"]*"/gi,"")//清除class
						.replace(/style="[^"]*"/gi,"");//清除style
					/*
					//去除所以tag
					originalText =  originalText.replace(/<w[^>]*?>*?<\/w:.*?>/gi,"");
					return $('<div></div>').html(originalText).text();
					//去掉样式
					var reg = /style="[^"]*"/gi, //去掉样式style
						_class = /class="[^"]*"/gi,
						cleara = /<a[^>]*?>([\s\S]*?)<\/a>/gi; 
					return originalText.replace(reg,"").replace(_class,"").replace(cleara,'$1');
					*/
				}
				function block(e){
					e.preventDefault();
				}
				var w,or,divTemp,originText;
				var newData;
				function pasteClipboardData(editorId,e){
					var objEditor = document.getElementById(editorId);
					var edDoc=objEditor.contentWindow.document, enableKeyDown, rng;
					if(isIE){

						return false; 
					
					}else{
						enableKeyDown=false;
		//create the temporary html editor
						var divTemp=edDoc.createElement("DIV");
						divTemp.id='htmleditor_tempdiv';
						divTemp.innerHTML='\uFEFF';
						divTemp.style.left="-10000px"; //hide the div
						divTemp.style.height="1px";
						divTemp.style.width="1px";
						divTemp.style.position="absolute";
						divTemp.style.overflow="hidden";
						edDoc.body.appendChild(divTemp);
		//disable keyup,keypress, mousedown and keydown
						objEditor.contentWindow.document.addEventListener("mousedown",block,false);
						objEditor.contentWindow.document.addEventListener("keydown",block,false);
						enableKeyDown=false;
		//get current selection;
						w=objEditor.contentWindow;
						or=getSel(w).getRangeAt(0);
		//move the cursor to into the div
						var docBody=divTemp.firstChild;
						rng = edDoc.createRange();
						rng.setStart(docBody, 0);
						rng.setEnd(docBody, 1);
						setRange(getSel(w),rng);
						originText=objEditor.contentWindow.document.body.textContent;
						if(originText==='\uFEFF')
						{
							originText="";
						}
						window.setTimeout(function(){
		//get and filter the data after onpaste is done
							if(divTemp.innerHTML==='\uFEFF'){
								edDoc.body.removeChild(divTemp);
								return;
							}
							newData=divTemp.innerHTML;
		// Restore the old selection
							if (or){
								setRange(getSel(w),or);
							}
							newData=filterPasteData(newData);
							divTemp.innerHTML=newData;
		//paste the new data to the editor
							try{
								objEditor.contentWindow.document.execCommand('inserthtml', false, newData );
								edDoc.body.removeChild(divTemp);
							}catch(e){}
						},0);
		//enable keydown,keyup,keypress, mousedown;
						enableKeyDown=true;
						objEditor.contentWindow.document.removeEventListener("mousedown",block,false);
						objEditor.contentWindow.document.removeEventListener("keydown",block,false);
						return true;
					}
				}
				
				pasteClipboardData(eid, _e);
			
			}




		}
	});


})(jQuery, window, Gaofen)