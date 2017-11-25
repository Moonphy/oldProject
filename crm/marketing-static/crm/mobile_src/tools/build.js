{
    //应用程序的目录（即<root>）。在这个文件夹下的所有文件将会被复制到dir参数标注的文件夹下。
    // app顶级目录，非必选项。如果指定值，baseUrl则会以此为相对路径
    appDir: '../site',
    //相对于appDir，代表查找文件的锚点
    // 模块根目录。默认情况下所有模块资源都相对此目录。
    // 若该值未指定，模块则相对build文件所在目录。
    // 若appDir值已指定，模块根目录baseUrl则相对appDir。
    baseUrl: 'js/lib',
    // 配置文件目录
    //mainConfigFile: '../site/js/common.js',
    // 设置模块别名
    //模块（modules）的相对目录。
    // RequireJS 2.0 中可以配置数组，顺序映射，当前面模块资源未成功加载时可顺序加载后续资源
    paths: {
        zepto:'zepto/zepto',
        touch:'zeptotouch/zepto-touch',
        backbone:'backbone/backbone',
        underscore:'underscore/underscore',
        app: '../app'
    },
    map: {
        '*': {
            'css': 'require-css/css', // or whatever the path to require-css is
            'text': 'requirejs-text/text'
        }
    },
    //这是一个输出目录，所有的应用程序文件将会被复制到该文件夹下
    dir: '../dist',
    // JS 文件优化方式，目前支持以下几种：
    //   uglify: （默认） 使用 UglifyJS 来压缩代码
    //   closure: 使用 Google's Closure Compiler 的简单优化模式
    //   closure.keepLines: 使用 closure，但保持换行
    //   none: 不压缩代码
    //optimize: "uglify",
    // 使用 UglifyJS 时的可配置参数
    // See https://github.com/mishoo/UglifyJS for the possible values.
    /*uglify: {
        toplevel: true,
        ascii_only: true,
        beautify: true,
        max_line_length: 1000
    },*/
    // 使用 Closure Compiler 时的可配置参数
    /*closure: {
        CompilerOptions: {},
        CompilationLevel: 'SIMPLE_OPTIMIZATIONS',
        loggingLevel: 'WARNING'
    },*/
    //模块包裹函数，顾名思义使用特定内容包裹模块，如此一来 define/require 就不再是全局变量，在 end 中可以暴露一些全局变量供整个函数使用
    /*wrap: {
        start: "(function() {",
        end: "}());"
    },
    // 另一种模块包裹方式
    // (function() { + content + }());
    wrap: true,
    // 另一种模块包裹方式，包裹内容可以是指定文件
    wrap: {
        startFile: "part/start.frag",
        endFile: "parts/end.frag"
    },*/
    // 不优化某些文件
    //fileExclusionRegExp: /^\./,
    // 默认保留模块的 license 注释
    preserveLicenseComments: false,
    // 若为true，优化器会强制在文件中包裹一层 define(require, exports, module) {})
    //cjsTranslate: false,
    //一个包含多个对象的数组。每个对象代表一个将被优化的模块（module）。
    modules: [
        {
            //module names are relative to baseUrl
            name: '../common',
            //List common dependencies here. Only need to list
            //top level dependencies, "include" will find
            //nested dependencies.
            include: [
                'zepto',
                'css',
                'text'
            ]
            //排除指定模块，但若该模块对所打包文件有级联依赖关系，则仍会被打包进去
            /*excludeShallow: [
                "foo/bar/bot"
            ]*/
        },
        {
            name: '../login',
            include: ['app/login'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../my',
            include: ['app/home/my/index'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../profile',
            include: ['app/home/my/profile'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../profile-edit',
            include: ['app/home/my/profile-edit'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../resetpwd',
            include: ['app/home/my/resetpwd'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../selcity',
            include: ['app/home/my/selcity'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../contact-list',
            include: ['app/home/my/contact/list'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../contact-edit',
            include: ['app/home/my/contact/edit'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../contact-add',
            include: ['app/home/my/contact/add'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../contact-common-list',
            include: ['app/home/my/contact/common'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../contact-detail',
            include: ['app/home/my/contact/detail'],
            exclude: ['../common']
        },
        //事故车提醒开始
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../accidentcar-remind-list',
            include: ['app/home/my/accidentcar/remind/list'],
            exclude: ['../common']
        },
        //备忘录开始
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../memo-list',
            include: ['app/home/my/memo/list'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../memo-add',
            include: ['app/home/my/memo/add'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../memo-detail',
            include: ['app/home/my/memo/detail'],
            exclude: ['../common']
        },
        //今日询价单和订单开始
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-order',
            include: ['app/home/factory/bill/order'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-inquiry',
            include: ['app/home/factory/bill/inquiry'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../order-detail',
            include: ['app/home/factory/bill/order-detail'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../inquiry-detail',
            include: ['app/home/factory/bill/inquiry-detail'],
            exclude: ['../common']
        },
        //问题与建议开始
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../advice-add',
            include: ['app/home/my/advice/add'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../advice-list',
            include: ['app/home/my/advice/list'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../advice-detail',
            include: ['app/home/my/advice/detail'],
            exclude: ['../common']
        },
        //拜访页面
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../visit-list',
            include: ['app/home/visit/list'],
            exclude: ['../common']
        },
        //汽修厂主页
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-index',
            include: ['app/home/factory/index'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-add',
            include: ['app/home/factory/add'],
            exclude: ['../common']
        },
        //基本情况
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-information',
            include: ['app/home/factory/information'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-info-edit',
            include: ['app/home/factory/information-edit'],
            exclude: ['../common']
        },
        //拜访信息开始
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-visit-add',
            include: ['app/home/factory/visit/add'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-visit-list',
            include: ['app/home/factory/visit/list'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-visit-detail',
            include: ['app/home/factory/visit/detail'],
            exclude: ['../common']
        },
        //添加事故车
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../accidentcar-add',
            include: ['app/home/factory/accidentcar/add'],
            exclude: ['../common']
        },
        //平台问题
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-problem-platform-add',
            include: ['app/home/factory/problem/platform/add'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-problem-platform-detail',
            include: ['app/home/factory/problem/platform/detail'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-problem-platform-list',
            include: ['app/home/factory/problem/platform/list'],
            exclude: ['../common']
        },
        //退货问题
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-problem-return-add',
            include: ['app/home/factory/problem/return/add'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-problem-return-detail',
            include: ['app/home/factory/problem/return/detail'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-problem-return-list',
            include: ['app/home/factory/problem/return/list'],
            exclude: ['../common']
        },
        //任务页面
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../task-list',
            include: ['app/home/task/list'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../task-add',
            include: ['app/home/task/add'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../task-detail',
            include: ['app/home/task/detail'],
            exclude: ['../common']
        },
        //选择汽修厂
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-select',
            include: ['app/home/factory/select'],
            exclude: ['../common']
        },
        {
            // 将 alias 别名为 ../my 和 app/home/my/index 的模块打包成一个文件
            // 将及其依赖项一并打包，但不包括 ../common
            name: '../factory-select2',
            include: ['app/home/factory/select2'],
            exclude: ['../common']
        },
        //统计开始
        {
            name: '../statistics/index/index',
            include: ['app/statistics/index/index'],
            exclude: ['../common']
        },
        {
            name: '../statistics/index/area',
            include: ['app/statistics/index/area'],
            exclude: ['../common']
        },
        {
            name: '../statistics/index/area-detail',
            include: ['app/statistics/index/area-detail'],
            exclude: ['../common']
        },
        {
            name: '../statistics/index/search',
            include: ['app/statistics/index/search'],
            exclude: ['../common']
        },
        {
            name: '../statistics/index/target',
            include: ['app/statistics/index/target'],
            exclude: ['../common']
        },
        {
            name: '../statistics/index/all',
            include: ['app/statistics/index/all'],
            exclude: ['../common']
        }
        // insertRequire 在 RequireJS 2.0 中被引入，在 built 文件的末尾插入 require([]) 以触发模块加载并运行
        // insertRequire: ["foo/baz"] 即 require(["foo/baz"])
        // 详情见 https://github.com/jrburke/almond
        /*{
            name: "foo/baz",
            insertRequire: ["foo/baz"]
        }*/
    ],
    //为那些没有使用define()声名依赖关系及设置模块值的模块，配置依赖关系与“浏览器全局”出口的脚本。
    shim: {
        'underscore': {
            exports: '_'
        },
        'zepto':{
            exports: '$'
        },
        'touch':{
            exports:'touch'
        }
    },
    //如果为true，优化器（optimizer）将从输出目录中删除已合并的文件。
    //removeCombined:true,
    //RequireJS Optimizer会自动优化应用程序下的CSS文件。

    // CSS 优化方式，目前支持以下几种：
    // none: 不压缩，仅合并
    // standard: 标准压缩，移除注释、换行，以及可能导致 IE 解析出错的代码
    // standard.keepLines: 除标准压缩外，保留换行
    // standard.keepComments: 除标准压缩外，保留注释 (r.js 1.0.8+)
    // standard.keepComments.keepLines: 除标准压缩外，保留注释和换行 (r.js 1.0.8+)
    optimizeCss:'standard',
    // 处理所有的文本资源依赖项，从而避免为加载资源而产生的大量单独xhr请求，默认为true，可以不用设置
    //inlineText: true,
    // 是否开启严格模式
    // 由于很多浏览器不支持 ES5 的严格模式，故此配置默认值为 false
    //useStrict: false,
    //任何与此规则匹配的文件或文件夹都将不会被复制到输出目录
    fileExclusionRegExp: /(.git)|node_modules$/,
    //generateSourceMaps:false
    // 命名空间，完整实例可以参考 http://requirejs.org/docs/faq-advanced.html#rename
    namespace: 'BTR',
    waitSeconds: 7
}
