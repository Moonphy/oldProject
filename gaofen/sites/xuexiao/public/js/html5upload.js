(function($, win){
	function drawImage(ImgD,FitWidth,FitHeight, fn){			
		function loaded(w, h){
			var _w, _h;
			if(w>0 && h>0){
				 if(w/h>= FitWidth/FitHeight){
					 if(w>FitWidth){
						_w = FitWidth;
						_h = (h*FitWidth)/w;
					 }else{
						_w = w; 
						_h = h;
					 }
				 } else{
					 if(h>FitHeight){
						_h = FitHeight;
						 _w = (w*FitHeight)/h;
					 }else{
						_w = w; 
						_h = h;
					 } 
				}
				ImgD.width = _w;
				ImgD.height = _h;
			 }
			
			if(fn){
				fn(_w, _h, ImgD);
			}
			
		}		

		 var image = new Image();
		 $(image).load(function(){
			 loaded(image.width, image.height);
		 });
		 image.src = ImgD.src;
	};
	
	var html5Upload = function(opt){

		$.extend(this, opt);

		var self = this;
		if (this.dragDrop) {
			this.dragDrop.addEventListener("dragover", function(e) { self.funDragHover(e); }, false);
			this.dragDrop.addEventListener("dragleave", function(e) { self.funDragHover(e); }, false);
			this.dragDrop.addEventListener("drop", function(e) { self.funGetFiles(e); }, false);
		}
		if (this.fileInput) {
			this.fileInput.addEventListener("change", function(e) { self.funGetFiles(e); }, false);	
		}
		
		if (this.upButton) {
			this.upButton.addEventListener("click", function(e) { self.funUploadFile(e); }, false);	
		} 
		if(this.preview){
			this.preview.click(function(e){
				e.preventDefault();
				//var cls = self.delBtn || 'upload_delete';
				if($(e.target).hasClass(self.delBtn || 'upload_delete')){
					var div = $(e.target).closest(self.parent||'.upload_append_list'), index = div.attr('id').split('_')[1];
					!self.removeFilter(index) && self.removeSaveStack(index);
				};
			});
		}
		this.fileFilter = [];
		this.saveStack = [];
		this.initReady && this.initReady();
	};
	
	html5Upload.prototype = {
		fileInput: null,
		dragDrop: null,
		uploadIndex : 0,
		upButton: null,//上传按钮
		preview : null,//上传预览
		//uploadedPreview : null,//上传成功后预览
		url: "",
		fileFilter: [],	//上传时暂存器	
		saveStack : [],
		successDelete : false,
		fileType : '*',//[jpg,gif,png]
		maxSize : 111024000,
		enAllowTip : '格式不正确',
		outSize : '大小超出范围',
		autoUpload : false,//自动上传
		showTip : function(tip){
			alert(tip);	
		},
		
		getFileByIndex : function(index){
			for(var i=0,len=this.fileFilter.length;i<len;i++){
				if(index == this.fileFilter[i].index){
					return this.fileFilter[i];
				}
			}
			return null;
		},
		
		funDeleteFile : function(index){
			for(var i = 0, len = this.fileFilter.length;i<len;i++){
				if(this.fileFilter[i] == file){
					this.fileFilter.splice(i, 1);
					this.preview && this.preview.children().eq(i).remove();
					this.onDelete && this.onDelete();
					break;
				}
			}
		},
		
		//删除filter
		removeFilter : function(index){		
			for(var i = 0, len = this.fileFilter.length;i<len;i++){
				if(index == this.fileFilter[i].index){
					this.beforeDel && this.beforeDel(i);
					this.fileFilter.splice(i, 1);
					if(!this.autoUpload){
						var dom = this.getDomByIndex(index);
						if(dom.length){
							this.preview && dom.remove();
							this.onDelete && this.onDelete();
						}
					}
					return true;
				}				
			}
			return false;
			
		},
		
		//删除上传失败的
		removeUploadFail : function(index){
			for(var i = 0, len = this.fileFilter.length;i<len;i++){
				if(index == this.fileFilter[i].index){
					this.fileFilter.splice(i, 1);
					if(this.autoUpload){
						var dom = this.getDomByIndex(index);
						if(dom.length){
							this.preview && dom.remove();
							this.onDelete && this.onDelete();
						}
					}
					return true;
				}				
			}
			return false;
		},
		
		
		//删除上传成功了的
		removeSaveStack : function(index){
			for(var i = 0, len = this.saveStack.length;i<len;i++){
				if(index == this.saveStack[i].index){
					//this.beforeDel && this.beforeDel(i);
					this.saveStack.splice(i, 1);
					var dom = this.getDomByIndex(index);
					if(dom.length){
						this.preview && dom.remove();
					}
					return true;
				}				
			}
			return false;
		},
		
		getDomByIndex : function(index){
			if(this.preview)
				return this.preview.find('#uploadList_'+index);
			else return [];
		},
		
		filter: function(files) {
			var arrFiles = [];
			for (var i = 0, file; file = files[i]; i++) {				
				if(this.fileType !== '*'){
					var type = this.getFileType(file);
					if(!this.allowType(type)){
						this.showTip('只允许上传:'+this.fileType.toString()+' 格式的文件');
						//this.showTip('文件"' + file.name +'"'+ this.enAllowTip);
						continue;
						//console.log(this.isImage(type));
					}
				}
				if (file.size >= this.maxSize) {
					this.showTip('文件"'+ file.name + '"'+ this.outSize);	
				} else {
					arrFiles.push(file);	
				}			
			}
			return arrFiles;
		},
		
		getFileType : function(file){
			var type, arr;
			if(file.type){
				arr = file.type.split('/');	
				if(arr.length>1) type = arr[1];
			}else if(file.name){
				arr = file.name.split('.');
				var len = arr.length;
				type = arr[len - 1];
			}
			file.fileType = type;
			return type;
		},
		
		allowType : function(type){//是否是允许的上传格式
			if(this.fileType !== '*'){
				for(var i=0,j=this.fileType.length;i<j;i++){
					var _type = this.fileType[i];
					if(type == 'jpeg'){
						if(type === this.fileType[i] || 'jpg' === this.fileType[i]) return true;
					}else if(type === this.fileType[i]) return true;
				}
				return false;
			}
			return true;
		},
		
		isImage : function(type){
			return $.inArray(type.toLowerCase(), ['gif','jpg', 'jpeg', 'png', 'bmp']) > -1;					
		},
		
		previewImgTemp : '<div id="uploadList_{.i}" class="upload_append_list"><p><strong>{.filename}</strong>'+ 
								'<br />' +
								'<img width="100" height="100" id="uploadImage_{.i}" src="{.result}" class="upload_image" /></p>'+ 
								'<span id="uploadProgress_{.i}" class="upload_progress"></span>' +
								'<a href="#" class="upload_delete" title="删除" data-index="{.i}">删除</a>'+
							'</div>',
		previewTemp : '<div id="uploadList_{.i}" class="upload_append_list"><p><strong>{.filename}</strong>'+ 
							'<a href="#" class="upload_delete" title="删除" data-index="{.i}">删除</a><br />' +
							'<span id="uploadProgress_{.i}" class="upload_progress"></span>' +
						'</div>',
		onSelect: function(files) {
			if(!this.preview) return;//没有预览
			var html = [], i = 0, self = this;
			if($.trim(this.preview.html()) === '') this.preview.html('<div class="upload_loading"></div>');
			var funAppendImage = function() {
				file = files[i];				
				if (file) {
					if(!file.fileType) self.getFileType(file);
					if(self.isImage(file.fileType)){							
						var reader = new FileReader()
						reader.onload = function(e) {
								html.push(self.parse(self.previewImgTemp, {
									i : file.index,
									filename : file.name,
									result : e.target.result
								}));					
							i++;
							funAppendImage();
						}
						reader.readAsDataURL(file);
					}else{//一般文件
						html.push(self.parse(self.previewTemp, {
							i : file.index,
							filename : file.name
						}));							
						i++;
						funAppendImage();
					}	
				} else {
					self.preview.find('.upload_loading').remove();
					self.preview.append(html.join(''));
					var img = self.preview.find('img.upload_image');
					for(var j=0,len = img.length;j<len;j++){
						drawImage(img.eq(j).get(0), 100, 100);
					}
					if (html.length) {
						this.upButton && this.upButton.show();	
					} else {
						//提交按钮隐藏
						this.upButton && this.upButton.hide();	
					}
				}
			};
			funAppendImage();		
		},
		onDragOver: function() {
			$(this).addClass("upload_drag_hover");
		},
		onDragLeave: function() {
			$(this).removeClass("upload_drag_hover");
		},
		onSuccess: function(file, response) {
			//$("#uploadInf").append("<p>上传成功，图片地址是：" + response + "</p>");
			var _file = $.extend({index : file.index}, response);
			if(this.preview){
				var temp = this.previewImgTemp;
				if(!this.isImage(file.fileType ? file.fileType : this.getFileType(file))){	
					temp = this.previewTemp;
				}				
			}
			this.afterOneSuccess && this.afterOneSuccess(file, _file);
			this.removeFilter(file.index, response);
			this.saveStack.push(_file);
			this.setProgress(file.index, 100);

			//this.removeFilter(file.index, response);

		},
		onFailure: function(file) {
			$("#uploadInf").append("<p>图片" + file.name + "上传失败！</p>");	
			$("#uploadImage_" + file.index).css("opacity", 0.2);
		},
		onDelete: function(){
			if(this.preview){
				if(this.preview.children().length == 0){
					$(this.upButton).hide();
				}
			}
		},
		onProgress: function(file, loaded, total) {
			var percent = (loaded / total * 100).toFixed(2);
			console.log('进度：'+percent);
			if(this.preview)
				this.setProgress(file.index, percent);
		},
		
		setProgress : function(index, percent){
			if(this.preview){
				var eleProgress = this.preview.find("#uploadProgress_" + index);
				eleProgress.show().text(percent+'%').css('left', percent+'%');
			}
		},
		
		onComplete: $.noop,
		
		funDragHover: function(e) {
			e.stopPropagation();
			e.preventDefault();
			this[e.type === "dragover"? "onDragOver": "onDragLeave"].call(e.target);
			return this;
		},

		funGetFiles: function(e) {
			this.funDragHover(e);
			var files = e.target.files || e.dataTransfer.files;
			if(this.preview)
				this.fileFilter = this.fileFilter.concat(this.filter(files));
			else
				this.fileFilter = this.filter(files);
			this.funDealFiles();
			this.autoUpload && this.funUploadFile();
			return this;
		},
		

		funDealFiles: function() {
			var len = this.fileFilter.length;			
			for (var i = 0; i<len; i++) {
				var file = this.fileFilter[i];
				file.index = ++this.uploadIndex;
			}
			this.onSelect(this.fileFilter);
			
			return this;
		},
		
		funUploadFile: function() {
			var self = this, len = this.fileFilter.length;
			if (location.host.indexOf("sitepointstatic") >= 0) {
				return;	
			}
			this.uploadReady && this.uploadReady();
			for (var i = 0, file; file = this.fileFilter[i]; i++) {				
				(function(file) {
					var xhr = new XMLHttpRequest();
					if (xhr.upload) {
						xhr.upload.addEventListener("progress", function(e) {
							self.onProgress(file, e.loaded, e.total);
						}, false);
			
						xhr.onreadystatechange = function(e) {
							if (xhr.readyState == 4) {
								if (xhr.status == 200) {
									var result = $.parseJSON(xhr.responseText);
									if(result.error != '0' && result.error != '' && result.errno !='0'){
										self.removeUploadFail(file.index);
										self.showTip(result.msg||result.err);
									}else{
										self.onSuccess(file, $.parseJSON(xhr.responseText));
									}
									if (!self.fileFilter.length) {
										self.onComplete();	
									}
								} else {
									self.onFailure(file, xhr.responseText);		
								}
							}
						};
						
						var fd  = new FormData(); 									 
						xhr.open("POST", self.url, true);
						//xhr.setRequestHeader("X_FILENAME", file.name);
						xhr.setRequestHeader("X-Requested-With","XMLHttpHequest");
						xhr.setRequestHeader("content-length",file.size);
						fd.append(self.fileObject||'Filedata',file);
						self.beforeUpload && self.beforeUpload(fd);
						xhr.send(fd);
					}	
				})(file);	
			}	
				
		},
		
		tplReg :  /\{(\.?[\w_|$]+)(\.[\w_$]+)?\}/g, 
		parse : function(htmls, map){
			return htmls.replace(this.tplReg, function(s, k , k1){
				var v, modfs, k_str, key;

				if (k.charCodeAt(0) === 46)  {
					k_str = k.substr(1);
					modfs = k_str.split('|');
					key = modfs.shift();
					v = map[key];
				}
				return v;
			});
		}
	
	};

	window.html5Upload = html5Upload;
})(typeof jQuery !== 'undefined' ? jQuery : Zepto, window);