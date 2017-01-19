<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/25
 * Time: 下午2:31
 */

return [

    'const' => [
        'W_BASE_HTTP' => isset($_SERVER['SERVER_NAME']) ? 'http://'.$_SERVER['SERVER_NAME']:'',
        'DS' => DIRECTORY_SEPARATOR,
        'API_TOKEN' => 'a803c266281f9abdbaf7c3821e314472',
        'API_APPKEY' => '2678132890',
        'API_APPSECRET' => '724cebe11a604204d81fa10d4f26e91d',
        //微信配置
        'WX_APPID' => 'wx0c00a259e6ec67b5',
        'WX_APPSECRET' => 'b7d711b38d40b1c1659440563c9c7a45',
        'WX_MCHID' => '1233846802',
        'WX_MCHKEY' => '6e8981a96114bd38837b594a31394bfd',
        'WX_SSLCERT_PATH' => ' / home / wwwroot / cert / weixin / apiclient_cert . pem',
        'WX_SSLKEY_PATH' => ' / home / wwwroot / cert / weixin / apiclient_key . pem',
        'WX_NOTIFY_URL' => 'http://u.gaofen.com/Auth/Wxpay/notify',
        //smtp mail配置
        'GAOFEN_SEND_MAIL_FROM' => 'gaofenmail@163.com',
        'GAOFEN_SMTP_HOST' => 'smtp.163.com',
        'GAOFEN_SMTP_USER' => 'gaofenmail@163.com',
        'GAOFEN_SMTP_PASS' => 'gaofen888',
        'GAOFEN_SMTP_PORT' => 25,
        'S_GAOFEN_STATIC' => 'http://file.gaofen.com',
        'Web_Image_URL' => '{S_GAOFEN_STATIC}',
        'GAOFEN_STATIC' => '{S_GAOFEN_STATIC}',
        'ATTACH_DIR' => BASEPATH . '/data/',
        'ATTACH_URL' => isset($_SERVER['HTTP_HOST']) ? 'http://' . $_SERVER['HTTP_HOST'] . '/data/' : '',
        'RPC_URL_ARTICLE' => 'http://cp.gaofen.com/api.php?mod=rpc',
        'UC_KEY' => 'mygaofencom',                                // 与 UCenter 的通信密钥, 要与 UCenter 保持一致
        'JS_PATH' => 'js/gaofen.js',
        'WB_AKEY' => '550029278',//sina微博api
        'WB_SKEY' => '4c24da66e3d0965f1cd0cd18e70531b8',
        'WB_CALLBACK_URL' => 'http://dev.cms.gaofen.com/account/callBack',
        'QQ_AKEY' => '10035337', //qq互联api
        'QQ_SKEY' => 'laKIBCM1bh2vHFdY',
        'QQ_CALLBACK_URL' => 'http://dev.cms.gaofen.com/account/callBack',
        'APP_LOCAL_TIMESTAMP' => time(), // 经过较准的，本地时间戳　所有使用APP_LOCAL_TIMESTAMP　的地方用这个常替代，防止，无法更改服务器时间导致的问题

        'PUBLIC_PATH' => BASEPATH . '/public',//公共静态资源目录
        'DATA_PATH' => BASEPATH . '/data',//存放缓存、上传文件目录
        'MODULES_PATH' => BASEPATH . '/application/modules',

        'UPLOAD_PATH' => '{DATA_PATH}' . '/uploads',//存放上传文件目录
        'SWF_PATH' => '{UPLOAD_PATH}' . '/swf', //存放上swf文件目录
        'W_BASE_URL_PATH' => '/',
        'LOG_PATH' => '{DATA_PATH}' . '/log', //存放日志文件目录
        'STATIC_PAGES_PATH' => '{DATA_PATH}' . '/html', //存放静态文件目录
        'MAX_UPLOAD_FILE_SIZE' => '50',
        'P_VAR_LOG_FILE' => '{LOG_PATH}' . date("/Y_m/d/Ymd") . ".log.php", // 当前系统的日志文件格式
        'V_JS_REQUEST_ROUTE' => "__rnd", /// 判断当前请求是否是 JS 请求的变量理由; 通常 AJAX请求同样被认为是API请求
        'FILE_DATE_SUFFIX' => date('Ymd'),
        'DES_KEY' => '386783c36ce1f6221c973e80149ee335', // des公共key
        'COOKIE_NAME_PRE' => 'GUC_', /// cookie 前缀
        'COOKIE_PATH' => '/', /// cookie 路径
        'COOKIE_DOMAIN' => isset($_SERVER['HTTP_HOST']) ? (strrpos(strstr($_SERVER['HTTP_HOST'], '.'),
                '.') == 0) ? '.' . $_SERVER['HTTP_HOST'] : strstr($_SERVER['HTTP_HOST'], '.') : '',
        'JSONPCALLBACK' => 'callback', //jsonp回调key名
        'CURL_TIMEOUT' => 30, //curl请求超时时间

    ],
];