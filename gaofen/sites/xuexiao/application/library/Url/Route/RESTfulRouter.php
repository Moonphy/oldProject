<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/12
 * Time: 下午5:04
 */

namespace Url\Route;


// RESTful Route API Wrapper
use Closure;
use Yaf_Router;

/**
 * Class RESTfulRouter
 * @package Url\Route
 */
class RESTfulRouter
{
    /**
     * @var bool
     */
    private $strict;
    /**
     * @var
     */
    private $router;
    /**
     * @var int
     */
    private $index = 0;
    /**
     * @var string
     */
    private $prefix = '__REST_';

    /**
     * @param Yaf_Router $router
     * @param bool $strict
     */
    public function __construct(Yaf_Router $router, $strict = false)
    {
        $this->router = $router;
        $this->strict = $strict;
    }


    /**
     * @param array $options
     * @param callable $callable
     */
    public function group(array $options, Closure $callable)
    {

    }

    /**
     * @param $method
     * @param $path
     * @param $controller
     * @param $action
     */
    public function on($method, $path, $controller, $action)
    {
        $method = trim($method);
        $controller = trim($controller);

        $module_controller = explode('/', $path);

        $module = '';
        if (count($module_controller) > 1) {
            $module = array_shift($module_controller);
            $controller = implode('/', $module_controller);
        }

        if (strpos($method, ' ')) { // multi method
            $methods = preg_split('/\s+/', $method);
            foreach ($methods as $method) {
                $this->register($method, $path, $module, $controller, $action);
            }
        } else {
            $this->register($method, $path, $module, $controller, $action);
        }
    }

    /**
     * @param $method
     * @param $path
     * @param $module
     * @param $controller
     * @param $action
     */
    private function register($method, $path, $module, $controller, $action)
    {
        $this->router->addRoute($this->prefix . $this->index++,
            new RESTfulRoute($path, [
                'controller' => $controller,
                'action' => $action,
                'module' => $module,
                'method' => $method
            ], $this->strict)
        );
    }
}