<?php
use Cache\Redis;
use Traits\StaticProvider;
class Cache
{
    use StaticProvider;
    protected $_cache;

    public function __construct(Redis $cache)
    {
        $this->_cache = $cache;
    }

    public function __call($name, $arguments)
    {
        return call_user_func_array([$this->_cache, $name], $arguments);
    }

    protected static function register()
    {
        return 'Cache';
    }
}
