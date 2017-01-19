<?php
namespace Traits;

trait StaticProvider
{
    protected static $instance;

    public static function __callStatic($name, $arguments)
    {
        if (!self::$instance) {
            $instance = static::register();

            if (is_string($instance)) {
                $instance = \DIBuilder::singleton($instance);
                // var_dump(self::$instance);
            }

            self::$instance = $instance;
        }

        return call_user_func_array([self::$instance, $name], $arguments);
    }
}
