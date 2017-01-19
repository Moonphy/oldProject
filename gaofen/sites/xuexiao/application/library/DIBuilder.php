<?php
use DI\DI;
use Illuminate\Container\Container;
use Traits\StaticProvider;

/**
 * DependencyInjectionBuilder
 * 注入依赖创建类
 */
class DIBuilder
{
    use StaticProvider;
    private $_builder;

    public function __construct(DI $di)
    {
        $this->_builder = $di;
    }

    protected static function register()
    {
        return new static(new DI(new Container, new CFG));
    }

    public function __call($name, $arguments)
    {
        return call_user_func_array([$this->_builder, $name], $arguments);
    }
}
