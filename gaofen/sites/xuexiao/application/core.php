<?php

/**
 * 自动载入类
 * @param string  $className 需要创建的类名(包括命名空间)
 * @param array   $params    创建的类所需的参数
 * @param boolean $single    是否为单例
 * @return object
 */
function NY($className, array $params = array(), $single = false)
{
    static $instance;

    $classNameArray = explode('_', $className);

    foreach ($classNameArray as $index => $part) {
        $classNameArray[$index] = ucfirst($part);
    }

    $className = implode('_', $classNameArray);

    // $builder = DIBuilder::instance();


    if ($single) {
        return DIBuilder::singleton($className, $params);
    }

    return DIBuilder::make($className, $params);
}

/**
 * 实例API MODEL
 *
 * @param $apiName api类名
 * @param $params base所需的参数
 * @param $static 是否单列 默认是
 *
 * return object
 */
function NAPI($apiName, $params, $single = true)
{
    static $instance;

    $prefix = 'Api/Base/';

    try {
        $apiBase = NY($prefix.$apiName, $params, $single);
    } catch (Exception $e) {
        Api\OpenApi::throwException('110002',    '无法找到API base model文件['.$apiFileModel.']');
    }

    return $apiBase;
}

/**
 * V($vRoute,$def_v=NULL);
 * 获取还原后的  $_GET ，$_POST , $_FILES $_COOKIE $_REQUEST $_SERVER $_ENV
 * 同名全局函数： V($vRoute,$def_v=NULL);
 * @param $vRoute	变量路由，规则为：“<第一个字母>[：变量索引/[变量索引]]
 * 					例:	V('G:TEST/BB'); 表示获取 $_GET['TEST']['BB']
 * 						V('p'); 		表示获取 $_POST
 * 						V('c:var_name');表示获取 $_COOKIE['var_name']
 * @param $def_v
 * @param $setVar	是否设置一个变量
 * @return unknown_type
 */
function V($vRoute, $def_v = null, $setVar = false)
{
    static $v;
    if (empty($v)) {
        $v = array();
    }
    $vRoute = trim($vRoute);

    //强制初始化值
    if ($setVar) {
        $v[$vRoute] = $def_v;
        return true;
    }

    if (!isset($v[$vRoute])) {
        $vKey = array('C' => $_COOKIE,'G' => $_GET,        'P' => $_POST,'R' => $_REQUEST,
                      'F' => $_FILES,    'S' => $_SERVER,    'E' => $_ENV,
        );
        if (empty($vKey['R'])) {
            $vKey['R'] = array_merge($_COOKIE, $_GET, $_POST);
        }
        if (!preg_match("#^([cgprfse-])(?::(.+))?\$#sim", $vRoute, $m) || !isset($vKey[strtoupper($m[1])])) {
            trigger_error("Can't parse var from vRoute: $vRoute ", E_USER_ERROR);
            return null;
        }

        //----------------------------------------------------------
        $m[1] = strtoupper($m[1]);
        $tv = $vKey[$m[1]];

        //----------------------------------------------------------
        if (empty($m[2])) {
            $v[$vRoute] =  ($m[1] == '-' || $m[1] == 'F' || $m[1] == 'S' || $m[1] == 'E') ? $tv :  F::magicVar($tv);
        } elseif (empty($tv) && is_null($tv)) {
            return  $def_v;
        } else {
            $vr = explode('/', $m[2]);
            while (count($vr)>0) {
                $vk = array_shift($vr);
                if (!isset($tv[$vk])) {
                    return $def_v;
                    break;
                }
                $tv = $tv[$vk];
            }
        }
        $v[$vRoute] = ($m[1] == '-' || $m[1] == 'F' || $m[1] == 'S' || $m[1] == 'E')  ? $tv :  F::magicVar($tv);
    }
    return $v[$vRoute];
}
/**
 * put your comment there...
 *
 * @param mixed $tpl
 * @param mixed $param
 * @param mixed $noDiv
 * @param mixed $html
 * @param mixed $inJson 如果AD是包含在json结构里时设为1
 */
function AD($tpl, $param = '', $noDiv = false, $html = '', $inJson = '')
{
    //global $tplslug, $noshtml;

    if ($noDiv) {
        $jsad = "<script type='text/javascript'>callad('{$tpl}','{$html}','{$inJson}');</script>";
    } else {
        $jsad = "<div id='{$tpl}' $param><script type='text/javascript'>callad('{$tpl}','{$html}','{$inJson}');</script></div>";
    }
    echo $jsad;
    /*
    $tpl_path = $GLOBALS['TPL_PATH'].'shtml/ad/'.$tpl.'.htm';
    if($noshtml){
        //判断模板是否存在 如果不存在 直接输出js脚本
        if(file_exists($tpl_path)){
            include tpl('shtml/ad/'.$tpl);
        }else{
            echo $jsad;
        }

    }else{
        //如果shtml模板和真实文件都存在 则引用shtml 否则删除shtml文件
        $shtml_path = GCC.'shtml/ad/'.$tpl.'.shtml';
        if(file_exists($shtml_path) && file_exists($tpl_path)){
            echo '<!--#include virtual="/shtml/ad/'.$tpl.'.shtml"-->';
        }else{
            @unlink($shtml_path);
            echo $jsad;
        }
    }
     */
}

function LOGF($log, $type = 'db')
{
    $io = NY('fileio');
    $log = '['.date('Y-m-d H:i:s', APP_LOCAL_TIMESTAMP).']'.$type.': '.$log."\n";
    $io->write(P_VAR_LOG_FILE, $log, true);
}
