<?php
namespace Api;

use Api\OpenApiException;


/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年02月25日
 *
 * api基础核心类、方法
 *
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/
class OpenApi
{
    public static function api($apiRoute, $p)
    {
        try {
            $methodPos = strrpos($apiRoute, '\\');
            $apiClass = trim(substr($apiRoute, 0, $methodPos), '\\');

            $apiClass = explode('\\', $apiClass);

            foreach ($apiClass as $index => $class) {
                //$class = strtolower($class);
                $apiClass[$index] = ucfirst($class);
            }

            $apiClass = implode('\\', $apiClass);

            $apiFunc = trim(substr($apiRoute, $methodPos), '\\');

            $apiPathPrefix = 'Api\\Apis\\';
            $apiObj = NY($apiPathPrefix . ucfirst($apiClass), ['params' => $p]);

            // 获取接口数据
            $rst = \DIBuilder::call($apiObj, $apiFunc, ['p' => $p, 'params' => $p, 'param' => $p]);

            // $rst = call_user_func_array(array($apiObj, $apiFunc), array($p));

            return OpenApi::rst($rst);
        } catch (OpenApiException $e) {
            if (method_exists($e, 'apiErr')) {
                return $e->apiErr();
            } else {
                throw $e;
            }
        } catch (\Exception $e) {

            if (defined('API_IN_HTTP_REQUEST') && API_IN_HTTP_REQUEST) {

                $exception = new OpenApiException([
                    'err' => $e->getMessage(),
                    'api' => $apiRoute,
                    'errno' => 1,
                ]);

                return $exception->apiErr();
            } else {
                throw $e;
            }
        }
    }

    /**
     * API库Base类
     *
     * @param mixed $baseClass
     * @param array $params
     * @return array|object
     * @throws \Api\OpenApiException
     * @throws \Exception
     */
    public static function apiBase($baseClass, $params = array(), $single = true)
    {
        try {
            $baseClass = str_replace('/', '\\', $baseClass);
            $baseClass = ltrim($baseClass, '\\');
            $apiPathPrefix = 'Api\\Base\\';
            $apiObj = NY($apiPathPrefix . $baseClass, $params, $single);

            return $apiObj;
        } catch (OpenApiException $e) {
            if (method_exists($e, 'apiErr')) {
                return $e->apiErr();
            } else {
                throw $e;
            }
        }
    }


    /**
     * 解释命令行的参数
     *
     */
    public static function parseCliParams()
    {
        global $argv;
        if (count($argv) < 3) {
            return true;
        }

        for ($i = 2; $i < count($argv); $i++) {
            $tmp = explode(":", $argv[$i], 2);
            $tmp[0] = strtoupper($tmp[0]);
            if ($tmp[0] == 'POST') {
                $tmpArr = array();
                parse_str($tmp[1], $tmpArr);
                $_POST = array_merge($_POST, $tmpArr);
            }
            if ($tmp[0] == 'GET') {
                $tmpArr = array();
                parse_str($tmp[1], $tmpArr);
                $_GET = array_merge($_GET, $tmpArr);
            }
            if ($tmp[0] == 'COOKIE') {
                $tmpArr = array();
                parse_str($tmp[1], $tmpArr);
                $_COOKIE = array_merge($_COOKIE, $tmpArr);
            }
        }
        $_REQUEST = array_merge($_POST, $_GET, $_COOKIE);

        return $_REQUEST;
    }

    /**
     * 获取API　ROUTE,通过HTTP方式调用
     *
     */
    public static function getHttpApiRoute()
    {
        $m = (isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : isset($_SERVER['REQUEST_URI'])) ? $_SERVER['REQUEST_URI'] : false;
        if (!$m) {
            OpenApi::throwException('110001', '无效、非法API路由');
        }

        //兼容r路由方式
        if (isset($_GET['r']) && $_GET['r']) {
            $m = $_GET['r'];
            $m = str_replace('/api/index', '', $m);
        } else {
            $pos = strpos($m, '?');
            if ($pos !== false) {
                $m = substr($m, 0, $pos);
            }
        }

        $m = preg_replace('#^/api\.php/(.+)#', '\\1', $m);
        $m = preg_replace('#^/api/(.+)#', '\\1', $m);
        $m = preg_replace('#^/apis/(.+)#', '\\1', $m);
        $m .= '.httpCall';

        return $m;
    }

    /**
     * 获取来源
     *
     */
    public static function source()
    {
        $source = isset($_REQUEST['source']) ? $_REQUEST['source'] : '';

        return $source;
    }


    /**
     * 抛出错误
     *
     * @param mixed $errno     错误码
     * @param mixed $err       错误信息
     * @param string $debugErr 管理员看的高级信息，可能会暴露更多的信息
     * @throws \Api\OpenApiException
     */
    public static function throwException($errno, $err, $debugErr = null)
    {
        //获取当前自在执行的API
        $api = OpenApi::kv('API-LAST-CALL');
        $errMsg = (API_IS_DEBUG && $debugErr) ? $debugErr : $err;

        $errObj = array('api' => $api, 'errno' => $errno, 'err' => $errMsg);

        throw new OpenApiException(array('api' => $api, 'errno' => $errno, 'err' => $errMsg));
    }

    /**
     * 获取一个参数值
     *
     * @param array $p    当前接口的所有参数
     * @param string $k   需要获取值的KEY
     * @param string $def 默认值
     *
     * @return string
     */
    public static function param($p, $k, $def = null)
    {
        return isset($p[$k]) ? $p[$k] : $def;
    }

    /**
     * 内置的静态数据缓存方法，一次执行周期有效
     *
     * @param mixed $k 缓存 KEY
     *                 注意：
     *                 命名时，请加上各自的前缀以防冲突如: prefix#keyname
     * @param mixed $v 缓存的静态数据
     * @return mixed|null 例 ：
     *                 例 ：
     *                 OpenApi::kv($k,$v);     设置一个 KEY 为 $k 值 为 $v 的静态数据
     *                 OpenApi::kv($k);        返回一个 KEY 为 $k 的静态数据
     *                 OpenApi::kv();          返回所有静态数据
     */
    public static function kv($k = null, $v = null)
    {
        static $data = array();
        $type = func_num_args();
        switch ($type) {
            case 1 :
                return $k && isset($data[$k]) ? $data[$k] : null;
                break;
            case 2 :
                $data[$k] = $v;

                return $v;
                break;
            case 0 :
                return $data;
                break;
        }

        return null;
    }

    /**
     * 统一格式化输出数据
     *
     */
    public static function rst($rst)
    {
        if (OpenApi::httpDebug()) {
            header("Content-type:text/html; charset=utf-8");
            echo '<pre>', "RST:\n", print_r($rst, 1), "<hr>\n";
        }

        if (defined('API_IN_HTTP_REQUEST') && API_IN_HTTP_REQUEST) {
            header("Content-type:text/html; charset=utf-8");

            if (is_object($rst) && class_implements($rst, '\Illuminate\Support\Contract\JsonableInterface')) {

                $rst = $rst->toJson();

            } else {
                $rst = json_encode($rst);
            }
            echo $rst;
            exit;
        }

        return $rst;
    }

    /**
     * 是否在HTTP　调试状态
     */
    public static function httpDebug()
    {
        return API_IS_DEBUG && isset($_GET['debug']) && $_GET['debug'] || (isset($_COOKIE['debug']) && $_COOKIE['debug']);
    }

    /**
     * http 接口验证
     *
     */
    public static function httpVerify($p = array())
    {
        $source = OpenApi::source();
        if (empty($source)) {
            OpenApi::throwException('110010', 'source paramter(appkey) is missing');
        }

        if(empty(\CFG::api_token($source))) {
            OpenApi::throwException('110020', 'source paramter(appkey) is missing');
        }

        $token = isset($p['token']) ? $p['token'] : null;
        $timestamp = isset($p['timestamp']) ? $p['timestamp'] : null;
        $signature = isset($p['signature']) ? $p['signature'] : null;
        if (empty($token) || empty($timestamp) || empty($signature)) {
            OpenApi::throwException('110011', '缺少必要的参数');
        }

        /// 请求url有效时间5分钟
        $times = $timestamp + 60 * 5;
        if (APP_LOCAL_TIMESTAMP > $times) {
            OpenApi::throwException('110015', '请求已经过期');
        }

        /*
        $row = CACHE::get('gfapp_server_token_'.$source);
        if (empty($row)) {
            $CI = & get_instance();
            $CI->load->library('db');
            $sql = $CI->db->SQL('SELECT `token`, `app_key`, `app_secret` FROM %s WHERE `app_key` = "%s" LIMIT 1', $CI->db->getTable(API_T_APP_SERVER_TOKEN), $source);
            $row = $CI->db->getOne($sql);
            if (empty($row)) {
                OpenApi::throwException('110012', 'consumer_key不存在');
            }
            $CI->db->close();
        }
        if ($row['token'] != $token) {
            OpenApi::throwException('110013', 'Token不合法');
        }
         */

        if (\CFG::api_token($source, 'token') !== $token) {
            OpenApi::throwException('110013', 'Token不合法');
        }

        $app_secret = \CFG::api_token($source, 'secret');
        $check_signature = md5($token . '#' . $timestamp . '#' . $source . '#' . $app_secret);
        if ($check_signature != $signature) {
            OpenApi::throwException('110014', '签名值不合法');
        }
        // 缓存 server token值
        //CACHE::set('gfapp_server_token_'.$row['app_key'], $row);

        return true;
    }

    public static function createAppKeySecretToken($source_text)
    {
        //sleep(rand(5,15));
        $appKey = time() * 2;

        $appSecret = md5(uniqid() . time());

        $token = md5($appKey . '#' . $appSecret);

        $timestamp = time();

        $db = null;
        $CI = &get_instance();
        $CI->load->library('db');
        $data = array(
            'app_key' => $appKey,
            'app_secret' => $appSecret,
            'token' => $token,
            'timestamp' => $timestamp,
            'source_text' => $source_text,
        );
        if (($CI->db->save($data, '', API_T_APP_SERVER_TOKEN)) !== false) {
            return true;
        }

        return false;
    }

    public static function cfg($key)
    {
        global $G_API_CONFIG;
        if (isset($G_API_CONFIG[$key])) {
            return $G_API_CONFIG[$key];
        }

        return array();
    }

    /**
     * 根据用户服务器环境配置，递归还原变量
     * @param $mixed
     * @return 还原后的值
     */
    public static function _magicVar($mixed)
    {
        if ((function_exists('get_magic_quotes_gpc') && get_magic_quotes_gpc()) || @ini_get('magic_quotes_sybase')) {
            if (is_array($mixed)) {
                return array_map(array('openApi', '_magicVar'), $mixed);
            }

            return stripslashes($mixed);
        } else {
            return $mixed;
        }
    }

    /**
     * 通过HTTP 调用API请求
     *
     */
    public static function doApiRequest()
    {
        if (strtolower(PHP_SAPI) == "cli") {
            global $argv;
            if (!isset($argv[1])) {
                OpenApi::throwException('110012', 'CLI调用时，参数不够，至少提供API参数');
            }

            return OpenApi::api($argv[1], OpenApi::parseCliParams());
        } else {
            $route = OpenApi::getHttpApiRoute();
            $p = OpenApi::getHttpApiParams();

            // http 调用接口的统一认证
            $rArr = OpenApi::parseApiRoute($route);
            $auth = $rArr['auth'];

            if ($auth == 'httpCall') {
                try {
                    OpenApi::httpVerify($p);
                } catch (OpenApiException $e) {
                    if (method_exists($e, 'apiErr')) {
                        return $e->apiErr();
                    } else {
                        throw $e;
                    }
                }
                $route = $rArr['route'];
            }

            $apiPath = str_replace('/', '\\', $route);

            // 去掉验证后的数据
            $p = array_except($p, ['source', 'token', 'timestamp', 'signature', 'secrect']);

            return OpenApi::api($apiPath, $p);
        }
    }

    /**
     * 获取API 参数，如果不是POST，将取 $_GET ,通过HTTP方式调用
     *
     */
    public static function getHttpApiParams()
    {
        //参数选择
        $params = strtoupper($_SERVER['REQUEST_METHOD']) == 'POST' ? $_POST : $_GET;
        if (isset($params['debug'])) {
            unset($params['debug']);
        }
        $params = OpenApi::_magicVar($params);

        return is_array($params) ? $params : array();
    }

    /**
     * 解析api路由
     *
     */
    public static function parseApiRoute($r)
    {
        $rt = trim($r, " /?&.");

        $rm = array();
        if (count(explode('..', $r)) > 1 || !preg_match("#^([^\s\.]+)\.([^\s\.]+)\$#sim", $rt, $rm)) {
            openApi::throwException('110001', '无效、非法API路由:[' . $r . ']');

            return false;
        }

        $route = $rm[1];
        $auth = $rm[2];

        $apiRoute = array();
        if (!preg_match('#^([^/].*)/(.+)#i', $route, $apiRoute)) {
            openApi::throwException('110001', '无效、非法API路由:[' . $route . ']');

            return false;
        }
        $apiClass = $apiRoute[1];
        $apiFunc = $apiRoute[2];
        $apiFile = null;

        return array(
            'route' => $route,    //路由名称
            'auth' => $auth,      //授权类型
            'apiClass' => $apiClass, //API类
            'apiFunc' => $apiFunc,//API成员方法
            'apiFile' => $apiFile, //apiFile
        );
    }
}
