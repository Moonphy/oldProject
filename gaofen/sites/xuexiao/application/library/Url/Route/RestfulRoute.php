<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/12
 * Time: 下午5:08
 */

namespace Url\Route;

use Yaf_Route_Interface;
use Yaf_Route_Regex;
use Yaf_Route_Rewrite;

/**
 * Class RESTfulRoute
 * implementation by Compositing on RewriteRouter
 * @package Url\Route
 */
class RESTfulRoute implements Yaf_Route_Interface
{
    /**
     * @var Yaf_Route_Regex
     */
    private $route;
    /**
     * @var string
     */
    private $method = '*'; // default any

    /**
     * @param string $path
     * @param array $options
     * @param bool $strict
     */
    public function __construct($path, array $options, $strict)
    {
        if (is_string($options['method'])) {
            $this->method = strtolower($options['method']);
        }

        // default base on rewrite route
        if (!$strict) {
            $this->route = new Yaf_Route_Rewrite($path, $options);
        }
        // strict style route syntax base on regex route
        // eg. '/user/<name>', match '/user/haha' ,not match '/user/haha/', not match 'user/haha'
        // type filter extended
        // eg. '/user/<id:int>', match '/user/123', not match '/user/haha'
        // some regex is also supported, don't use "()"
        // eg. '/user/<name>/?', match '/user/haha' and match '/user/haha/'
        else {
            $keys = array(''); // must start with 1, YAF sucks
            $path = preg_replace_callback('/<(\w+)(:int)?>/', function ($matches) use (&$keys) {
                array_push($keys, $matches[1]);

                if (isset($matches[2])) { // integer type, TODO other types
                    return '(\d+)';
                } else {
                    return '([\w-%]+)'; // normal type
                }
            }, $path);

            unset($keys[0]);
            // regex must wrapped by #
            $this->route = new Yaf_Route_Regex("#^$path$#", $options, $keys);
        }
    }

    /**
     * @param mixed $request
     * @return bool
     */
    public function route($request)
    {
        // HTTP method adapt
        if ($this->method !== '*') {
            $method = strtolower($request->getMethod());

            // fallback method
            if ($method === 'post' && isset($_POST['_method'])) {
                $method = strtolower($_POST['_method']);
            }

            if ($method !== $this->method) {
                return false;
            }
        }

        // url adapt
        return $this->route->route($request);
    }


    /**
     * @param array $mvc
     * @param array $query
     * @return String|void
     */
    public function assemble(array $mvc, array $query = null)
    {
        // interface method
    }
}