<?php if (! defined('BASEPATH')) {
    exit('No direct script access allowed');
}
/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年02月25日
 *
 * 系统环境公共配置项
 *
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/

//静态文件版本号，用作更新浏览器缓存
define('STATIC_VERSION', 221);

//调试配置
//显示错误信息
error_reporting(E_ALL &~ E_STRICT);
@ini_set('display_errors', 1);

//环境常量
define('_SITE_ENV', 'develop'); //开发：develop test:测试 正式：product

//开启/关闭rewrite
define('_USE_REWRITE', 0); //是否开启rewrite

// 接口调试开关
define('API_IS_DEBUG', false);
// 记录数据库日志
define('DB_IS_DEBUG', true);


//CURL_PROXY
//define('CURL_PROXY_HOST', '12o7.0.0.1:8888');
$ZKAO16_WINNER = [
    '8' => [
        'champ' => [8840199, 183],
        'lucky' => 8841198,
    ],
    '9' => [
        'champ' => [8840197, 182],
        'lucky' => 8840196,
    ],
    '10' => [
        'champ' => [8840197, 182],
        'lucky' => 8840196,
    ],
    '11' => [
        'champ' => [8840197, 182],
        'lucky' => 8840196,
    ],
    'first' => 8840199,
    'second' => 8840198,
    'third' => 8840197,
];
define('ZKAO16_WINNER', json_encode($ZKAO16_WINNER));
