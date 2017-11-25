//seajs插件
var seaPL = {
    'seajs-text':'1.0.2',
    'seajs-log':'1.0.1',
    'seajs-combo':'1.0.0'
};
//业务组件
var bussPL = {
    'crm-jquery':'0.0.1',
    'common':'0.0.1',
    'core':'0.0.1',
    'loadcity':'0.0.1'
}
//通用组件
var tyPL = {
    'jquery':'1.7.2',
    'tpl':'0.0.1',
    'layer':'1.9.3',
    'laydate':'0.1.1',
    'calendar':'0.1.1',
    'charts':'0.0.1',
    'pagination':'0.0.1',
    'fancybox':'2.1.5',
    'dialog':'0.0.1',
    'moment':'2.9.0',
    'store':'0.0.1',
    'upload':'0.0.1',
    'raty':'0.0.1',
    'template':'0.0.1',
    'plupload':'2.1.1',
    'suggest':'0.0.1',
    'underscore':'1.8.2',
    'mousewheel':'3.0.6',
    'validate':'0.0.1',
    'tagsinput':'0.0.1',
    'ztree':'3.5.18'
}

var alias = {};
//生成基础模块关系 
//eg：'seajs-text': 'seajs/seajs-text/1.0.2/seajs-text'
for(name in seaPL){
    alias[name] = 'seajs/'+name+'/'+seaPL[name]+'/'+name;
}

seajs.config({
    // 模式
    debug: DEBUG,
    base: GLOBAL.SEA,
    alias:{
        '$':DEBUG?'{gallery}/jquery/index':'{gallery}/jquery/1.7.2/index'
    },
    // 变量配置
    vars: {
        'modules': GLOBAL.MODULES,
        'gallery': GLOBAL.GALLERY,
        'cdn': GLOBAL.CDN
    },
    // 文件编码
    charset: 'utf-8',
     // 映射配置
    map: [
        //[/^(.*\.(?:css|js|tpl))(.*)$/i, '$1?' + GLOBAL.TIMESTAMP]
    ]
});

//业务模块
for(name in bussPL){
    alias[name] = DEBUG?'{modules}/'+name+'/index':'{modules}/'+name+'/'+bussPL[name]+'/index';
}
//通用模块
for(name in tyPL){
    alias[name] = DEBUG?'{gallery}/'+name+'/index':'{gallery}/'+name+'/'+tyPL[name]+'/index';
}
//合并配置
seajs.config({
    alias:alias
});