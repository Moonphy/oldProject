<?php

/**
 * 获取配置数据
 *
 * example: CFG::school('location') => inclue('/config/school.ini.php')+include('/config/school.php')
 * return 反回已加载配置文件相关下标数据
 *
 */
class CFG
{
    public static $config = array();

    public static function __callStatic($name, $arguments)
    {
        $name = str_replace('__', '/', strtolower($name));
        if (strtolower(substr($name, -4)) === 'args' && isset($arguments[0]) && is_array($arguments[0])) {
            $name = substr($name, 0, -4);
            $arguments = $arguments[0];
        }

        array_unshift($arguments, $name);

        return self::getConfig($arguments);
    }

    /**
     * 获取配置项
     *
     * @param string $filename
     * @param mixed $section
     * @param mixed $name
     * @param mixed $val
     * @example
     *     F::getConfig('others.ini', 'school', 'type', '1');  return '高中';
     *
     * @return null|array
     */
    public static function getConfig($params = array())
    {
        if (!is_array($params)) {
            $params = func_get_args();
        }

        $cfgFilename = array_shift($params);

        $env = class_exists('F', false) ? \F::getEnv() : _SITE_ENV;

        if (empty(static::$config["{$env}.{$cfgFilename}"])) {
            $cfgFilePath = CONFIG_PATH . '/' . $cfgFilename;

            static::$config[$cfgFilename] = self::getConfigByPath($cfgFilePath);

            /*
                product环境不需做环境配置递归替换
             */
            if($env!='product') {
                $cfgFilePath = CONFIG_PATH . '/' . $env . '/' . $cfgFilename;
                $envConfigs = self::getConfigByPath($cfgFilePath);

                static::$config[$cfgFilename] = array_replace_recursive(static::$config[$cfgFilename], $envConfigs);
            }
        }

        if (empty($params)) {
            return null;
            //return static::$config[$cfgFilename];
        }

        $val = null;
        foreach ($params as $_k) {
            if (!isset($val[$_k]) && !isset(static::$config[$cfgFilename][$_k])) {
                $val = null;
                break;
            }
            if ($val === null) {
                $val = static::$config[$cfgFilename][$_k];
            } else {
                $val = $val[$_k];
            }
        }

        return $val;
    }

    protected static function getConfigByPath($cfgFilePath)
    {
        $configs = [];
        if (is_file($cfgFilePath . '.ini.php')) {
            $configs = require($cfgFilePath . '.ini.php');
        }

        if (is_file($cfgFilePath . '.ini')) {
            $iniObj = new \Yaf_Config_Ini($cfgFilePath . '.ini');
            $configs = is_array($configs) && $configs ? $configs + $iniObj->toArray()
                : $iniObj->toArray();
        }

        return $configs;
    }
}
