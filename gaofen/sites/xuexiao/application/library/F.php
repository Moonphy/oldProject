<?php

class F
{
    /**
     * 调用API
     *
     * @param mixed $apiRoute                   API路由, 调用玩程项目api时加前缀.例: "cms:course/get"
     * @param mixed $p                          参数 是一个 K=>V 的数组
     * @param mixed $rfp                        resetful参加表；调用远程API时：array('id'=>10) 生成 'course/get/id/10'
     *                                          调用本地API时：array('s'=>'CZ') 生成 's/CZ/course/get';
     * @param mixed $method                     HTTP请求方式 GET POST
     * @return array|mixed
     * @throws Exception
     * @throws \Api\OpenApiException
     * @example
     *                                          F::api('cms:course/get', array());
     *                                          F::api('baike/get', array());
     */
    public static function api($apiRoute, $p = array(), $rfp = array(), $method = 'GET')
    {
        $apiRoute = explode(':', $apiRoute);

        $prj = $apiPath = '';
        if (count($apiRoute) > 1) { //远程api访问
            $prj = $apiRoute[0];
            $apiHost = str_replace('\\', '/', F::getRemoteApiHost($prj));
            $apiUri = '/' . ltrim(str_replace('\\', '/', $apiRoute[1]), '/');
            if (empty($apiHost)) {
                throw new Exception($prj . 'api host不存在');
            }

            if ($prj == 'cp') { //cp兼容处理
                if (!empty($apiUri)) {
                    $apiUri = explode('/', $apiUri);
                    if (isset($apiUri[1])) {
                        $p['mod'] = $apiUri[1];
                    }
                    if (isset($apiUri[2])) {
                        $p['action'] = $apiUri[2];
                    }
                }
                $apiPath = $apiHost;
            } else {
                $apiPath = $apiHost . $apiUri;
            }
        } else {
            $apiPath = str_replace('/', '\\', $apiRoute[0]);
        }


        //restful参数处理
        $restfulParams = array();
        foreach ($rfp as $key => $val) {
            $restfulParams[] = "$key/$val";
        }

        $restfulParams = implode('/', $restfulParams);
        if ($restfulParams) {
            $restfulParams = '/' . $restfulParams;
        }

        if (strpos($apiPath, 'http') !== false) {
            return F::httpApi($apiPath . $restfulParams, $p, $method);
        } else {
            return \Api\OpenApi::api($apiPath, $p);
        }
    }

    /**
     * 访问远程API
     *
     * @param mixed $url
     * @return mixed
     */
    public static function httpApi($url, $params = array(), $method='get')
    {
        if (is_array($params)) {
            $data = array();
            if ($params) {
                foreach ($params as $key => $val) {
                    $data[$key] = $val;
                }
            }
            $data['source'] = API_APPKEY;
            $data['token'] = API_TOKEN;
            $data['timestamp'] = APP_LOCAL_TIMESTAMP;
            $data['signature'] = md5(API_TOKEN . '#' . $data['timestamp'] . '#' . API_APPKEY . '#' . API_APPSECRET);
        } else {
            $data = $params;
        }
        $http = NY('http');
        $http->setUrl($url);
        if (is_array($params)) {
            $http->setData($data);
        } else {
            $http->setRawData($data, 'json');
        }
        //echo '<!--'.(strpos($url, '?')!==false?$url:$url.'?').http_build_query($data).PHP_EOL.'-->';
        $res = null;
        $res = $http->request($method);

        return json_decode($res, true);
    }

    /**
     * 获取远程项目api地址
     *
     * @param mixed $prj
     * @param mixed $env
     * @return bool|mixed
     */
    public static function getRemoteApiHost($prj, $withScheme = true, $env = null)
    {
        $env = $env ? $env : static::getEnv();
        $prj = strtolower($prj);

        $host = CFG::host__api($env, $prj);;
        if (!$withScheme) {
            $host = preg_replace(array('#http://#', '#https://#'), '', $host);
        }

        return $host ? $host : false;
    }

    /**
     * 获取项目地址
     *
     * @param mixed $prj
     * @param mixed $withScheme 地址是否返回协议头
     * @param mixed $env
     * @return bool|mixed
     */
    public static function getSiteHost($prj, $withScheme = true, $env = null)
    {

        $env = $env ? $env : static::getEnv();
        $prj = strtolower($prj);

        $host = CFG::host__host($env, $prj);;
        if (!$withScheme) {
            $host = preg_replace(array('#http://#', '#https://#'), '', $host);
        }

        return $host ? $host : false;
    }

    /**
     * 获取某些定列的快捷连接
     * @param   [type] $flag [description] 连接名或项目名
     * @param string $env
     * @return  [type]       [description]
     */
    public static function getLink($flag, $env = null)
    {

        $env = $env ? $env : static::getEnv();
        $link = CFG::host__link($env, $flag);

        return $link;
    }

    /**
     *
     * 当前环境状态检测
     *
     * @param mixed $name develop/test/product
     * @return bool
     */
    public static function inEnv($name)
    {
        return self::getEnv() == $name;
    }

    /**
     * @param $name
     */
    public static function setEnv($name)
    {
        \Yaf_Registry::set('_SITE_ENV', $name);
    }

    public static function getEnv()
    {
        if (\Yaf_Registry::has('_SITE_ENV')) {
            return \Yaf_Registry::get('_SITE_ENV');
        } elseif (defined("_SITE_ENV")) {
            return _SITE_ENV;
        }
    }

    ///　IP客户IP
    public static function ip()
    {
        static $ip = false;
        if ($ip) {
            return $ip;
        }

        if (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown")) {
            $ip = getenv("REMOTE_ADDR");
        } elseif (getenv("HTTP_CLIENT_IP") && strcasecmp(getenv("HTTP_CLIENT_IP"), "unknown")) {
            $ip = getenv("HTTP_CLIENT_IP");
        } elseif (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown")) {
            $ip = getenv("HTTP_X_FORWARDED_FOR");
        } elseif (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'],
                "unknown")
        ) {
            $ip = $_SERVER['REMOTE_ADDR'];
        } else {
            $ip = "unknown";
        }

        return preg_match('/^((25[0-5]|2[0-4]\d|(1\d|[1-9])?\d)\.){3}(25[0-5]|2[0-4]\d|(1\d|[1-9])?\d)$/',
            $ip) ? $ip : '0.0.0.0';
    }

    /**
     * html过滤后页面输出函数
     * @param string $str
     */
    public static function escape($str, $quote_style = ENT_COMPAT)
    {
        if (is_numeric($str)) {
            return $str;
        } else {
            return htmlspecialchars($str, $quote_style);
        }
    }

    /**
     * html过滤后页面输出函数
     * @param string $str
     * @return string
     */
    public static function O($str, $return = false, $default = '')
    {
        $str = F::escape($str);
        $str = $str !== false ? $str : $default;
        if ($return) {
            return $str;
        } else {
            echo $str;
        }
    }

    /**
     * 生成本地URL
     * @param [type] $path     [description] 例：'entry/view' 或 'cms:docs/view'
     * @param array $params [description] 例：array('id'=>10, 'type'=>1) 或 'id=10&type=1'
     * @param array $rfp    [description] 例: array('id'=>10) 结果:'entry/view/id/10'
     * @return string
     * @example
     *                      F::URL('entry/view', array('type'=>1), array('id'=>100)) => 'entry/view/id/100?type=1';
     *                      F::URL('shiti:docs/view', array('type'=>1), array('id'=>100)) => 'http://shiti.gaofen.com/view/id/100?type=1';
     */
    public static function URL($path, $params = array(), array $rfp = array())
    {
        $url = $host = $prj = '';
        $path = explode(':', $path);

        $prj = $sitePath = $prjHost = '';
        if (count($path) > 1) {
            $prj = $path[0];
            $prjHost = F::getSiteHost($prj);

            $path = str_replace('\\', '/', $path[1]);
        } else {
            $path = $path[0];
        }

        $path = '/' . ltrim($path, '/');

        //远程项目地址已带controller，兼容带controller host的URL拼装
        if ($prjHost && (substr($prjHost, strrpos($prjHost, '/', 1)) === substr($path, 0, strpos($path, '/', 1)))) {
            $path = substr($path, strpos($path, '/', 1));
        }

        //restful参数格式拼装
        $restfulParams = array();
        foreach ($rfp as $key => $val) {
            $restfulParams[] = "$key/$val";
        }

        $restfulParams = implode('/', $restfulParams);
        $restfulParams = $restfulParams ? ('/' . $restfulParams) : '';

        $query = is_array($params) ? http_build_query($params) : $params;

        $url = $prjHost . $path . $restfulParams . ((strpos($path, '?') === false && $query) ? '?' . $query : $query);

        //开启rewrite
        if (_USE_REWRITE) {
            // return F::rewriteUrl($url);
            $rewriteRules = DIBuilder::singleton('Url\RewriteRulesFactory')->make($url, $prj);

            if ($rewriteRules->uriData) {
                $url = DIBuilder::singleton('Url\Rewrite')->getURL($rewriteRules, (bool)$prjHost);
            }
        }

        return $url;
    }


    /**
     * 根据用户服务器环境配置，递归还原变量
     * @param $mixed
     * @return 还原后的值
     */
    public static function magicVar($mixed)
    {
        if ((function_exists('get_magic_quotes_gpc') && get_magic_quotes_gpc()) || @ini_get('magic_quotes_sybase')) {
            if (is_array($mixed)) {
                return array_map(array('F', 'magicVar'), $mixed);
            }

            return stripslashes($mixed);
        } else {
            return $mixed;
        }
    }

    /**
     * 跳转url函数
     *
     * @param string $url
     * @param string $location
     * @param string $code
     *
     */
    public static function redirect($url, $location = 'location', $code = '301')
    {
        header("Location: " . $url, false, $code);
        exit;
    }

    /**
     * F::ajaxRst($rst,$errno=0,$err='');
     * 通用的 AJAX 或者  API 输出入口
     * 生成后的JSON串结构示例为：
     * 成功结果： {"rst":[1,0],"errno":0}
     * 失败结果 ：{"rst":false,"errno":1001,"err":"access deny"}
     *
     * @param $rst
     * @param int|错误代码 $errno       错误代码，默认为 0 ，表示正常执行请求， 或者 >0 的 5位数字 ，1 开头的系统保留
     * @param string|错误信息 $err      错误信息，默认为空
     * @param bool|是否直接返回数据 $return 是否直接返回数据，不输出
     * @param bool|回调方法 $callback   回调方法
     * @return unknown_type
     */
    public static function ajaxRst($rst, $errno = 0, $err = '', $return = false, $callback = false)
    {
        $r = array('rst' => $rst, 'errno' => $errno * 1, 'err' => $err);
        if ($return) {
            if ($callback) {
                return $callback . '(' . json_encode($r) . ')';
            }

            return json_encode($r);
        } else {
            header('Content-type: application/json');
            if ($callback) {
                echo $callback . '(' . json_encode($r) . ')';
            } else {
                echo json_encode($r);
            }
            exit;
        }
    }

    public static function ajaxRstIfError($rst)
    {
        if (is_array($rst) && isset($rst['errno'])) {
            static::ajaxRst([], $rst['errno'], $rst['err']);
        }
    }

    public static function ifrAjaxRst($rst, $errno = 0, $err = '', $callback = false, $domain = 'gaofen.com')
    {
        $r = array('rst' => $rst, 'errno' => $errno * 1, 'err' => $err);
        echo '<script>document.domain="' . $domain . '";' . $callback . '(' . json_encode($r) . ')</script>';
        exit;
    }

    /**
     * 构建js请求url
     *
     * @param string $url
     *
     * @return string
     */
    public static function jsRequestUrl($url)
    {
        if (strpos($url, '?') === false) {
            $url .= '?' . V_JS_REQUEST_ROUTE . '=' . APP_LOCAL_TIMESTAMP;
        } else {
            $url .= '&' . V_JS_REQUEST_ROUTE . '=' . APP_LOCAL_TIMESTAMP;
        }

        return $url;
    }

    /**
     * 只负责生成格式化地址，不生成具体缩略图，生成缩略图由rewrite到controller thumbnail处理
     *
     * @param string $image upload的相对地址
     * @param stirng $size  格式；160_50
     * @return string
     */
    public static function imageUrl($image, $size = '', $dir = '', $returnDefault=true)
    {
        if (preg_match('#[http|ftp|https]://.+#', $image)) {
            return $image;
        }

        if (!$image) {
            if($returnDefault) {
                return 'http://file.gaofen.com/blank.gif';
            }else{
                return '';
            }
        }

        if ($size) {
            $size = explode('_', $size);
            if ((int)$size[0] > 0) {
                $fileExt = strrchr($image, '.');
                $pathWithFilename = str_replace($fileExt, '', $image);
                $image = $pathWithFilename . '_' . $size[0] . '_' . (int)@$size[1] . $fileExt;
            }
        }

        if (self::inEnv('develop')) {
            $imageUrl = F::getSiteHost('xuexiao') . '/thumbnail/show?path=' . $image;
        } else {
            $imageUrl = Web_Image_URL . ($dir ? $dir : '/') . $image;
        }

        return $imageUrl;
    }


    /**
     * 获取一段文本
     *
     * @param string $str     原始文本
     * @param int $length     需要截取的长度
     * @param int $start      开始位置，默认为　0
     * @param string $suffix  截取后是否需要增加后缀如　...　默认为空
     * @param string $charset 文本的字符集，默认为 utf-8
     *
     * @return string
     */
    public static function mSubstr($str, $length, $start = 0, $suffix = '', $charset = 'utf-8')
    {
        if (function_exists('mb_substr')) {
            $return = mb_substr($str, $start, $length, $charset);
        } elseif (function_exists('iconv_substr')) {
            $return = iconv_substr($str, $start, $length, $charset);
        } else {
            $re['utf-8'] = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|[\xe0-\xef][\x80-\xbf]{2}|[\xf0-\xff][\x80-\xbf]{3}/";
            $re['gb2312'] = "/[\x01-\x7f]|[\xb0-\xf7][\xa0-\xfe]/";
            $re['gbk'] = "/[\x01-\x7f]|[\x81-\xfe][\x40-\xfe]/";
            $re['big5'] = "/[\x01-\x7f]|[\x81-\xfe]([\x40-\x7e]|\xa1-\xfe])/";
            preg_match_all($re[$charset], $str, $match);
            $slice = join('', array_slice($match[0], $start, $length));
            $return = $slice;
        }
        if ($start == 0 && strlen($str) == strlen($return)) {
            return $return;
        }

        return $return . $suffix;
    }

    /**
     * 返回错误信息
     *
     * @param string $msg 错误信息
     *
     * @return string
     */
    public static function err404($msg, $module = '', $tpl='error')
    {
        //$dispatcher = Yaf_Dispatcher::getInstance();
        //$view = $dispatcher->initView(BASEPATH. '/application/views/');
        $viewDir = $module ? '/application/modules/' . $module . '/views/' : '/application/views/';
        $view = new Yaf_View_Simple(BASEPATH . $viewDir);
        if (is_array($msg)) {

            $view->assign($msg);

        } else {

            $view->assign('msg', $msg);
        }
        $view->display('common/'.$tpl.'.html');
        exit;
    }

    /**
     * 公共模版包含
     *
     * @param string $file   文件名
     * @param array $args    参数
     * @param string $module 模块名称
     *
     * @return bool
     */
    public static function TPL($file, array $args = array(), $module = '', $includeOnly = false)
    {
        $modulePath = $module ? '/modules/' . ucfirst(strtolower($module)) : '';

        $tplFilePath = BASEPATH . '/application' . $modulePath . '/views/';

        //参数赋值

        if ($args) {
            extract($args, EXTR_SKIP);
        }
        $file = $tplFilePath . $file;

        if ($includeOnly) {
            ob_start();
            include $file;

            return $string = ob_get_clean();
        }

        include $file;
    }

    /**
     * 网站标题
     *
     * @return string
     */
    public static function siteTitle($title, array $params = [])
    {
        $school_type = CFG::school('school', 'type');
        $params['school_type'] = isset($params['school_type']) ? $school_type[$params['school_type']] : null;

        foreach ($params as $key => $value) {
            $title = str_replace('{' . strtolower($key) . '}', $value, $title);
        }

        return $title;
    }

    /**
     * 资料图标
     *
     * @param string $format 格式
     * @param string $type   类型 1 小图标 2 中图标 3为大图标
     *
     * @return string
     */
    public static function docsIcon($format, $type)
    {
        $format = str_replace(array('docx', 'xlsx', 'pptx'), array('doc', 'xls', 'ppt'), $format);
        switch ($type) {
            case '1':
                $iconClass = 'icon-' . $format;
                break;
            case '2':
                $iconClass = 'icon-' . $format . '-large';
                break;
            case '3':
                $iconClass = 'icon-' . $format . '-larger';
                break;
        }

        return $iconClass;
    }

    public static function Editor()
    {
        return "
        <script src='/public/js/tinymce/tinymce.min.js'></script>
        <script type='text/javascript'>
          tinymce.init({
            selector: 'textarea',
            theme: 'modern',
            plugins: [
                'filemanager', 'image', 'code'
            ],
            toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image code'
             });
        </script>";
    }


    /**
     * dz uc加密解密算法
     *
     * @param string $string
     * @param string $operation 操作类型 值'ENCODE'是加密 值'DECODE'是解密
     * @param string $key       密钥
     * @param int $expiry
     *
     * @return string
     */
    public static function uc_authcode($string, $operation = 'DECODE', $key = 'AUTHKEY', $expiry = 0)
    {
        $ckey_length = 4;

        $key = md5($key ? $key : DES_KEY);
        $keya = md5(substr($key, 0, 16));
        $keyb = md5(substr($key, 16, 16));
        $keyc = $ckey_length ? ($operation == 'DECODE' ? substr($string, 0, $ckey_length) : substr(md5(microtime()),
            -$ckey_length)) : '';

        $cryptkey = $keya . md5($keya . $keyc);
        $key_length = strlen($cryptkey);

        $string = $operation == 'DECODE' ? base64_decode(substr($string, $ckey_length)) : sprintf('%010d',
                $expiry ? $expiry + time() : 0) . substr(md5($string . $keyb), 0, 16) . $string;
        $string_length = strlen($string);

        $result = '';
        $box = range(0, 255);

        $rndkey = array();
        for ($i = 0; $i <= 255; $i++) {
            $rndkey[$i] = ord($cryptkey[$i % $key_length]);
        }

        for ($j = $i = 0; $i < 256; $i++) {
            $j = ($j + $box[$i] + $rndkey[$i]) % 256;
            $tmp = $box[$i];
            $box[$i] = $box[$j];
            $box[$j] = $tmp;
        }

        for ($a = $j = $i = 0; $i < $string_length; $i++) {
            $a = ($a + 1) % 256;
            $j = ($j + $box[$a]) % 256;
            $tmp = $box[$a];
            $box[$a] = $box[$j];
            $box[$j] = $tmp;
            $result .= chr(ord($string[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
        }
        if ($operation == 'DECODE') {
            if ((substr($result, 0, 10) == 0 || substr($result, 0, 10) - time() > 0) && substr($result, 10,
                    16) == substr(md5(substr($result, 26) . $keyb), 0, 16)
            ) {
                return substr($result, 26);
            } else {
                return '';
            }
        } else {
            return $keyc . str_replace('=', '', base64_encode($result));
        }
    }

    /**
     * 输出js配置项
     *
     * @param string $channel 频道
     *
     * @return string
     */
    public static function jsFooterCfg($channel = 'baike', $controller = false, $action = false, $host = 'baike')
    {
        $getRequest = Yaf_Dispatcher::getInstance()->getRequest();

        $controllerName = $getRequest->getControllerName();
        $controllerName = strtolower($controller ? $controller : $controllerName);

        $actionName = $getRequest->getActionName();
        $actionName = strtolower($action ? $action : $actionName);


        $host = F::getSiteHost($host, false);

        $cfg = "<script>Gaofen.PD.set({'channel':'" . $channel . "','module':'" . $controllerName . "','action':'" . $actionName . "','host':'" . $host . "'});</script>";

        return $cfg;
    }

    /**
     * 设置全局变量
     *
     * @param string $name        变量名
     * @param string|array $value 值
     *
     * @return
     */
    public static function setGlobalVars($name, $value)
    {
        if (isset($GLOBALS['GAOFEN_G_VARS'][$name])) {
            $GLOBALS['GAOFEN_G_VARS'][$name] = array();
        }
        $GLOBALS['GAOFEN_G_VARS'][$name] = $value;
    }

    /**
     * 获取全局变量
     *
     * @param string $name
     *
     * @return array
     */
    public static function getGlobalVars($name)
    {
        if (isset($GLOBALS['GAOFEN_G_VARS'][$name])) {
            return $GLOBALS['GAOFEN_G_VARS'][$name];
        }

        return array();
    }


    /**
     * 设置cookie值
     *
     * @param string $var
     * @param string $value
     * @param int|string $time
     *
     * @return bool
     */
    public static function setCookie($var, $value = '', $time = 0, $domain = COOKIE_DOMAIN)
    {
        $time = (int)$time; //$time > 0 ? $time : ($value == '' ? -1 : 0);
        $s = (isset($_SERVER['SERVER_PORT']) &&  $_SERVER['SERVER_PORT']== '443' ? 1 : 0);
        //$var = COOKIE_PRE.$var;
        $_COOKIE[$var] = $value;
        if (is_array($value)) {
            foreach ($value as $k => $v) {
                setcookie($var . '[' . $k . ']', $v, $time, COOKIE_PATH, $domain, $s);
            }
        } else {
            setcookie($var, $value, $time, COOKIE_PATH, $domain, $s);
        }
    }

    /**
     * 获取cookie值
     *
     * @param string $var
     *
     * @return string|bool
     */
    public static function getCookie($var)
    {
        //$var = COOKIE_PRE.$var;
        $val = V('c:' . $var);

        return $val ? $val : false;
    }

    /**
     * 获取头像地址
     *
     * @param mixed $uid
     * @param mixed $size small|middlle|large
     */
    public static function getAvatar($uid, $size = 'small')
    {
        $uid = (int)$uid;

        return "http://uc.gaofen.com/avatar.php?uid={$uid}&size={$size}";
    }


    /**
     *
     * @param  string $id decrypt
     * @return integer 数据库的id
     */
    public static function decrypt($id)
    {
        //des解密文档id
        $des = NY('des');
        $theId = $des->decrypt($id, DES_KEY);

        return $theId;
    }

    /**
     *
     * @param  string $id decrypt
     * @return integer 数据库的id
     */
    public static function encrypt($id)
    {
        //des解密文档id
        $des = NY('des');
        $theId = $des->encrypt($id, DES_KEY);

        return $theId;
    }

    /**
     * put your comment there...
     *
     * @param mixed $tpl
     * @param mixed $param
     * @param mixed $noDiv
     * @param mixed $html
     * @param mixed $inJson 如果AD是包含在json结构里时设为1
     * @example:
     *
     *
     */
    public static function AD($tpl, $param = '', $noDiv = false, $html = '', $inJson = '')
    {
        //global $tplslug, $noshtml;

        if ($noDiv) {
            $jsad = "<script type='text/javascript'>callad('{$tpl}','{$html}','{$inJson}');</script>";
        } else {
            $jsad = "<div id='{$tpl}' $param><script type='text/javascript'>callad('{$tpl}','{$html}','{$inJson}');</script></div>";
        }
        echo $jsad;
    }

    /**
     * 面包屑导航
     * @param  array $params [description]params
     * @param  string $tpl   [description]
     * @return [type]      [description]
     */
    public static function breadcrumbNav(array $params = array(), $tpl = '')
    {
        $componentsName = '\\Components\\BreadcrumbNav\\' .
            ucfirst(\Yaf_Dispatcher::getInstance()->getRequest()->getModuleName()) . 'Nav';

        return NY($componentsName, array('params' => $params));
    }

    /**
     * 获取seo数据
     * 例：
     *     F::SEO()->getTitle('name'='高分网');   => "{name}是一家网络教育机构" => "高分网是一家网络教育机构"
     *     F::SEO()->getKeyword(); //同上
     *     F::SEO()->getDesc(); //同上
     *
     *     特殊参数：
     *     string $__callBack = ''; //可能有某些文本模版需要复杂数据要处理，才得出最后显示结果，这里候可以用回调方式
     *     string $__pindex = ''; //有些seo需求在同一页面显示不同的seo文本，这里可用参数组成相应的下标获取相应的模板
     *     F::SEO()->getTitle('__callBack'='', name'='高分网');
     * @param array $params
     * @return object
     */
    public static function SEO(array $params = array())
    {
        $componentsName = '\\Components\\Seo\\' .
            ucfirst(\Yaf_Dispatcher::getInstance()->getRequest()->getModuleName());

        return NY($componentsName, $params);
    }

    /**
     * 调用component组件
     * @param  [type] $componentName [description]
     * @param  array $args [description]
     * @return [type]                [description]
     */
    public static function com($componentName, $args = array())
    {
        return NY('\Components\\' . $componentName, $args);
    }

    public static function activeAction($when, $action, $title)
    {
        $date = F::friendly_date($when, 'mohu');

        switch ($action) {
            case 'visited':
                $action = '浏览';
                break;
            case 'faved':
                $action = '收藏';

            default:
                $action = "浏览";
                break;
        }

        return "<p>$date$action" . '了' . "$title</p>";
    }

    /**
     * 友好的时间显示
     *
     * @param int $sTime   待显示的时间
     * @param string $type 类型. normal | mohu | full | ymd | other
     * @return string
     */
    public static function friendly_date($sTime, $type = 'normal')
    {
        if (!$sTime) {
            return '';
        }
        //sTime=源时间，cTime=当前时间，dTime=时间差
        $cTime = time();
        $dTime = $cTime - $sTime;
        $dDay = intval(date("z", $cTime)) - intval(date("z", $sTime));
        //$dDay     =   intval($dTime/3600/24);
        $dYear = intval(date("Y", $cTime)) - intval(date("Y", $sTime));
        //normal：n秒前，n分钟前，n小时前，日期
        if ($type == 'normal') {
            if ($dTime < 60) {
                if ($dTime < 10) {
                    return '刚刚';    //by yangjs
                } else {
                    return intval(floor($dTime / 10) * 10) . "秒前";
                }
            } elseif ($dTime < 3600) {
                return intval($dTime / 60) . "分钟前";
                //今天的数据.年份相同.日期相同.
            } elseif ($dYear == 0 && $dDay == 0) {
                //return intval($dTime/3600)."小时前";
                return '今天' . date('H:i', $sTime);
            } elseif ($dYear == 0) {
                return date("m月d日 H:i", $sTime);
            } else {
                return date("Y-m-d H:i", $sTime);
            }
        } elseif ($type == 'mohu') {
            if ($dTime < 60) {
                return $dTime . "秒前";
            } elseif ($dTime < 3600) {
                return intval($dTime / 60) . "分钟前";
            } elseif ($dTime >= 3600 && $dDay == 0) {
                return intval($dTime / 3600) . "小时前";
            } elseif ($dDay > 0 && $dDay <= 7) {
                return intval($dDay) . "天前";
            } elseif ($dDay > 7 && $dDay <= 30) {
                return intval($dDay / 7) . '周前';
            } elseif ($dDay > 30) {
                return intval($dDay / 30) . '个月前';
            }
            //full: Y-m-d , H:i:s
        } elseif ($type == 'full') {
            return date("Y-m-d , H:i:s", $sTime);
        } elseif ($type == 'ymd') {
            return date("Y-m-d", $sTime);
        } else {
            if ($dTime < 60) {
                return $dTime . "秒前";
            } elseif ($dTime < 3600) {
                return intval($dTime / 60) . "分钟前";
            } elseif ($dTime >= 3600 && $dDay == 0) {
                return intval($dTime / 3600) . "小时前";
            } elseif ($dYear == 0) {
                return date("Y-m-d H:i:s", $sTime);
            } else {
                return date("Y-m-d H:i:s", $sTime);
            }
        }
    }

    /**
     * 首页生成筛选搜索连接
     * @param  array $filters     筛选首选的项目(所在区域, 学校类型, 入学途径)
     * @param  string $paramsName 筛选的get参数 eg:存入'distict' 返回 /index?distict=1的参数
     * @param  array $filterKey   筛选url的key(SEO必须保留空值的参数)
     * @return string
     */
    public static function filterUrl(array $filters, $paramsName, array $filterKey, $uri = '/cz/school/index')
    {
        $allFilter = ['0' => '全部'];

        $filters = $allFilter + $filters;

        $paramsValue = V('G:' . $paramsName);

        $output = null;

        foreach ($filters as $id => $filter) {
            /**
             * 判断并高亮当前选中的项目
             */
            if ($paramsValue == $id) {
                $output .= "<span class='active'>" . $filter . '</span>';
            } else {
                $params = array_except($_GET, ['q']);

                // SEO: url必须带上其他过滤选项的参数,默认为值为0
                $filterParams = array_fill_keys($filterKey, 0);

                $params = array_merge($filterParams, $params);

                $params[$paramsName] = $id;

                $url = F::URL($uri, $params);
                $output .= "<a href='" . $url . "'>" . $filter . '</a>';
            }
        }

        return $output;
    }

    /**
     * 函数或类方法的命名参数调用
     * 注：所有命名传参不受目标函数参数顺序影响!
     *
     * @param  [type] $mixed array(obj, method) 或 function name
     * @param  [type] $args  参数
     * @return [type] $mixed
     * @example
     *     //函数调用
     *     如有函数：function getList($school_type, $cate){}
     *
     *     F::invoke('getList', array(2,3)) === F::invoke('getList', array('cate'=>3, 'school_type'=>2));
     *
     *
     *     //对像调用
     *     F::invoke('class::method', array($p1, pn...));
     *     F::invoke(array('classname', 'method'), array($p1, $pn...));
     *     F::invoke(array($obj, 'method'), array($p1, $pn...))
     *
     */
    public static function invoke($mixed, $args)
    {
        //支持静态调用
        $_staticInvoke = false;
        if (is_string($mixed) && false !== strpos($mixed, '::')) {
            $mixed = explode('::', $mixed);
            $_staticInvoke = true;
        }

        //合并形参默认值与传参
        $combineArgs = function (array $defaultArgs, array $newArgs) {
            $_i = 0;

            if(!empty($defaultArgs)) {
                //形参递入先数值索引下标，再伪名下标
                foreach ($defaultArgs as $k => $v) {
                    if (isset($newArgs[$_i])) {
                        $defaultArgs[$_i] = $newArgs[$_i];
                    }

                    if (isset($newArgs[$k])) {
                        $defaultArgs[$k] = $newArgs[$k];
                    }

                    $_i++;
                }
            }else{
                $defaultArgs = $newArgs;
            }

            return $defaultArgs;
        };

        //对像调用
        $classInvoke = function ($class, $method, $args) use ($combineArgs) {

            if (!is_object($class)) {
                //$class = new $class();
                $class = NY($class, array(), true);
            }

            $rObj = new reflectionObject($class);
            $defaultArgs = array();
            foreach ($rObj->getMethod($method)->getParameters() as $p) {
                if ($p->isDefaultValueAvailable()) {
                    $defaultArgs[$p->getName()] = $p->getDefaultValue();
                } else {
                    $defaultArgs[$p->getName()] = null;
                }
            }

            return $rObj->getMethod($method)->invokeArgs($class, $combineArgs($defaultArgs, $args));

        };

        //静态调用
        $methodInvoke = function($class, $method, $args) use ($combineArgs){
            $method = new ReflectionMethod($class, $method);
            $defaultArgs = array();
            foreach ($method->getParameters() as $p) {
                if ($p->isDefaultValueAvailable()) {
                    $defaultArgs[$p->getName()] = $p->getDefaultValue();
                } else {
                    $defaultArgs[$p->getName()] = null;
                }
            }
            $method->setAccessible(true);
            return $method->invokeArgs(null, $combineArgs($defaultArgs, $args));
        };

        //函数调用
        $funcInvoke = function ($funcName, $args) use ($combineArgs) {
            $funcObj = new reflectionFunction($funcName);
            $defaultArgs = array();
            foreach ($funcObj->getParameters() as $p) {
                if ($p->isDefaultValueAvailable()) {
                    $defaultArgs[$p->getName()] = $p->getDefaultValue();
                } else {
                    $defaultArgs[$p->getName()] = null;
                }
            }

            return $funcObj->invokeArgs($combineArgs($defaultArgs, $args));
        };

        if (is_string($mixed)) {
            return $funcInvoke($mixed, $args);
        } elseif (is_array($mixed)) {
            $mixed = array_values($mixed);
            if($_staticInvoke) {
                return $methodInvoke($mixed[0], $mixed[1], $args);
            }else{
                return $classInvoke($mixed[0], $mixed[1], $args); 
           }            
        }

        return false;
    }

    /**
     * 返回控制
     * @param  string $url      [description]
     * @param  string $backFlag [description]
     * @return [type]           [description]
     */
    static function goBack($url=''){
        $referer = isset($_SERVER['HTTP_REFERER'])?$_SERVER['HTTP_REFERER']:'';
        $serverName = $_SERVER['SERVER_NAME'];
        if(empty($referer) || (strpos($referer, $serverName)===false)) {
            return $url;
        }else{
            return 'javascript:window.history.back();';
        }

    }


    /**
     * 日志记录
     * @param  [type] $msg [description]
     * @param  string $filename
     * @param  string $dirname [description]
     * @return [type]      [description]
     */
    static function log($msg, $filename='error', $dirname='') {
        $path = LOG_PATH;

        $path .= $dirname ? DS.strtolower($dirname):'';

        if(!is_dir($path)) {
            mkdir($path, 0777, true);
        }

        $path .= DS.strtolower($filename).'.log';

        $msg = '['.date('Y-m-d H:i:s').'] '.$msg.PHP_EOL;

        //return file_put_contents($path, $msg, FILE_APPEND);
        return error_log($msg, 3, $path);
    }

    /**
     * [dump 直观打印数据]
     * @param  [type]     $data [description]
     * @return [type]           [description]
     * @author ken
     * @date   2016-07-26
     */
    static function dump($data){
        echo '<pre>';
        var_dump($data);
        echo '</pre>';
        exit;
    }

    /**
     * [p 直观打印数据]
     * @param  [type]     $data [description]
     * @return [type]           [description]
     * @author ken
     * @date   2016-07-26
     */
    static function p($data){
        echo '<pre>';
        print_r($data);
        echo '</pre>';
        exit;
    }


    /**
     * 二进制值转换
     * @param  [type]  $flag [description]
     * @param  boolean $only [description]
     * @return [type]        [description]
     */
    static function parseFlag($flag, $only = true)
    {
        $flag = intval($flag);
        $flags = array();
        if ($only) {
            for ($i = 1; $i <= 30; $i++) {
                $k = pow(2, $i - 1);
                if ($flag & $k) {
                    $flags[$i] = 1;
                }
            }
        } else {
            for ($i = 1; $i <= 20; $i++) {
                $k = pow(2, $i - 1);
                $flags[$i] = ($flag & $k) ? 1 : 0;
            }
        }

        return $flags;
    }
}
