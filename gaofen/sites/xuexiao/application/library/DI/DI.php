<?php
namespace DI;

use Illuminate\Container\Container;
use CFG;
use Exception;
use ReflectionParameter;
use ReflectionMethod;

/**
 * DependencyInjectionBuilder
 * 注入依赖创建类
 */
class DI
{
    /**
     * @var array
     */
    protected $_paramters;

    /**
     * @var string
     */
    protected $_className;
    /**
     * @var CFG
     */
    private $config;

    private $container;


    public function __construct(Container $container, \CFG $config)
    {
        $this->container = $container;
        $this->config = $config;
        $this->registerBasic();
        $this->registerCoreContainerAliases();
        $this->registerBinding();
        $this->registerSingleton();
    }

    /**
     * @param $name
     * @param $arguments
     * @return mixed
     */
    public function __call($name, $arguments)
    {
        return call_user_func_array([$this->container, $name], $arguments);
    }

    /**
     * 生成单例对象
     * @param  string $className     需要生成的类|接口|父类
     * @param  array|null $paramters 生成类所需的参数
     * @return object
     */
    public function singleton($className, array $paramters = [])
    {
        if ($this->container->resolved($className)) {

            return $this->container->make($className);
        }

        $instance = $this->container->make($className, $paramters);
        $this->container->instance($className, $instance);

        return $instance;
    }

    /**
     * @param $instance
     * @param $method
     * @param array $paramters
     * @return mixed
     * @throws Exception
     */
    public function call($instance, $method, array $paramters)
    {
        $this->_paramters = $paramters;
        $reflector = new ReflectionMethod($instance, $method);
        $dependencies = [];

        // 获取该方法的所有参数
        foreach ($reflector->getParameters() as $paramter) {
            $dependencies[] = $this->tryResolveDependency($paramter);
        }

        return call_user_func_array([$instance, $method], $dependencies);
    }

    /**
     * 生成注入依赖所需的参数
     * @param  ReflectionParameter $paramter
     * @return any
     * @throws Exception
     */
    protected function tryResolveDependency(ReflectionParameter $paramter)
    {
        // 获取参数的名字
        $paramterName = $paramter->getName();

        if (isset($this->_paramters[$paramterName])) {
            return $this->_paramters[$paramterName];
        }

        $dependency = $paramter->getClass();

        // 假如依赖参数不是类
        if (is_null($dependency)) {
            if ($paramter->isDefaultValueAvailable()) {
                // 假如依赖参数有默认值
                return $paramter->getDefaultValue();
            }

            $className = $this->_className;

            throw new Exception("$className 的参数 $paramterName 需要提供值");
        }

        // 假如依赖是类，递归生成该类
        return $this->make($dependency->getName(), $this->_paramters);
    }

    public function getApplication()
    {
        return $this->container;
    }

    public function registerBasic()
    {
        $this->container->alias('app', get_class($this));
        $this->container->instance(get_class($this), $this);

        $this->container->instance(get_class($this->container), $this->container);
    }

    protected function registerCoreContainerAliases()
    {
        $aliases = $this->config->getConfig('di', 'aliases');

        foreach ($aliases as $key => $aliases) {
            foreach ((array)$aliases as $alias) {
                $this->container->alias($alias, $key);
            }
        }
    }

    protected function registerBinding()
    {
        $binding = $this->config->getConfig('di', 'bind');

        foreach ($binding as $class => $bind) {

            $this->container->bind($class, $bind);

        }
    }

    protected function registerSingleton()
    {
        $singletons = $this->config->getConfig('di', 'singleton');

        foreach ($singletons as $class => $bind) {

            $this->container->singleton($class, $bind);

        }
    }
}
