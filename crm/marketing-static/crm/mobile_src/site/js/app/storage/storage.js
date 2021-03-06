define(function(require,exports,module) {
	// storage
	//
	// 利用 window.name 实现跨页面跨域的数据传输。

	var win = window;

	var SCHEME = "storage:";
	//var RE_NAMES = /^storage:([^?]*)(?:\?(?:([^=]+)=([^&]*))*)?/g;
	var RE_PAIR = /^([^=]+)(?:=(.*))?$/;
	var Q = "?";
	var EQ = "=";
	var AND = "&";

	var encode = encodeURIComponent;
	var decode = decodeURIComponent;

	var STORAGE = {};
	var ORIGIN_NAME;

	var data = {};
	var storage = {};

	// 解析并初始化 name 数据。
	// 标准的 storage 数据格式为 `storage:origin-name?key=value`
	// @param {String} name.
	(function parse(name){

	  if(name && name.indexOf(SCHEME)===0){

	    var match = name.split(/[:?]/);

	    match.shift();                      // scheme: match[0];
	    ORIGIN_NAME = decode(match.shift()) || "";  // match[1]

	    var params = match.join("");        // match[2,...]

	    var pairs = params.split(AND);
	    for(var i=0,pair,key,value,l=pairs.length; i<l; i++){
	      pair = pairs[i].match(RE_PAIR);
	      if(!pair || !pair[1]){continue;}

	      key = decode(pair[1]);
	      value = decode(pair[2]) || "";

	      STORAGE[key] = value;
	    }

	  }else{

	    ORIGIN_NAME = name || "";

	  }

	})(win.name);

	// 写入数据。
	// @param {String} key, 键名。
	// @param {String} value, 键值。
	storage.setItem = function(key, value){
	  if(!key || "undefined"===typeof value){return;}
	  STORAGE[key] = String(value);
	  save();
	};

	// 读取数据。
	// @param {String} key, 键名。
	// @return {String} 键值。如果不存在，则返回 `null`。
	storage.getItem = function(key){
	  return STORAGE.hasOwnProperty(key) ? STORAGE[key] : null;
	};

	// 移除数据。
	// @param {String} key, 键名。
	storage.removeItem = function(key){
	  if(!STORAGE.hasOwnProperty(key)){return;}
	  STORAGE[key] = null;
	  delete STORAGE[key];
	  save();
	};

	// 清空 storage。
	storage.clear = function(){
	  STORAGE = {};
	  save();
	};

	storage.valueOf = function(){
	  return STORAGE;
	};

	storage.toString = function(){
	  var name = win.name;
	  return name.indexOf(SCHEME)===0 ? name : SCHEME + name;
	};

	// 保存数据到 window.name
	// 如果没有存储数据，则恢复原始窗口名称(window.name)。
	function save(){
	  var pairs = [];
	  var empty = true;
	  var value;

	  for(var key in STORAGE){
	    if(!STORAGE.hasOwnProperty(key)){continue;}
	    empty = false;

	    value = STORAGE[key] || "";
	    pairs.push( encode(key) + EQ + encode(value) );

	  }

	  win.name = empty ? ORIGIN_NAME :
	    SCHEME + encode(ORIGIN_NAME) + Q + pairs.join(AND);
	}

	// addEventLister implementation
	// @param {HTMLElement} element.
	// @param {String} eventName.
	// @param {Function} handler.
	function addEventListener(element, eventName, handler) {
	  if (!element){return;}

	  if(element.addEventListener) {
	    element.addEventListener(eventName, handler, false);
	  } else if(element.attachEvent) {
	    element.attachEvent('on' + eventName, function(evt) {
	      handler.call(element, evt);
	    });
	  }
	}

	// Save the last data for the next page.
	addEventListener(win, 'beforeunload', function(){
	  save()
	});

	win.storage = storage;

	module.exports = storage;
});