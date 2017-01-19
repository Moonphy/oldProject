<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/17
 * Time: 下午1:57
 */

namespace Cache\Stores;


use Cache\Contracts\Store;
use Cache\Redis;

/**
 * Class StringStore
 * 保存字符串类型的缓存
 *
 * @package Cache\Stores
 */
class StringStore implements Store
{
    /**
     * @var Redis
     */
    private $redis;

    const FOREVER_TTL = 31536000;
    /**
     * @var string
     */
    private $prefix;

    /**
     * @param Redis $redis
     * @param string $prefix
     */
    public function __construct(Redis $redis, $prefix = '')
    {

        $this->redis = $redis;
        $this->prefix = $prefix;
    }

    /**
     * Retrieve an item from the cache by key.
     * 获取key是字符串,获取单条缓存
     * 如果key是数组,批量获取缓存
     *
     * @param  string|array $key
     * @return mixed
     */
    public function get($key)
    {
        if (is_string($key)) {

            return $this->redis->get($this->getPrefix() . $key);
        }

        if (is_array($key)) {

            $keys = array_map(function ($key) {
                return $this->getPrefix() . $key;
            }, $key);

            $values = $this->redis->mGet($keys);

            // 排除找不到缓存(false)的key
            return array_filter($values, function ($value) {

                return $value !== false;
            });
        }
    }

    /**
     * Store an item in the cache for a given number of minutes.
     * 获取key是字符串,储存单条缓存
     * 如果key和value都是数组,批量添加缓存
     *
     * @param  string $key
     * @param  mixed $value
     * @param  int $minutes
     * @return void
     */
    public function put($key, $value, $minutes)
    {
        if (is_string($key)) {

            $cache = $this->redis;

            // 数字类的缓存不序列化存储
            if (is_numeric($value)) {
                $cache = $this->redis->_getSpeficCache('master');
                $cache->setOption(\Redis::OPT_SERIALIZER, \Redis::SERIALIZER_NONE);
            }

            $cache->set($this->getPrefix() . $key, $value, $minutes);
        }

        /** key和value都是数组,而且数量相同 */
        if ($this->_isMultiAdd($key, $value)) {

            $keys = $this->_getMultiPrefixKeys($key);

            // 由于mset不支持TTL的参数,所以使用pipeline来快速添加过期时间
            $this->redis->pipeline();
            $this->redis->mset(array_combine($keys, $value));

            foreach ($keys as $key) {
                $this->redis->expire($key, $minutes);
            }

            $this->redis->exec();
        }
    }

    /**
     * 判断是否批量添加
     * @param $key
     * @param $value
     * @return bool
     */
    protected function _isMultiAdd($key, $value)
    {
        return is_array($key) && is_array($value) && count($key) == count($value);
    }

    /**
     * 返回加了前缀的key
     * @param array $key
     * @return array
     */
    protected function _getMultiPrefixKeys(array $key)
    {
        return array_map(function ($key) {
            return $this->getPrefix() . $key;
        }, $key);
    }

    /**
     * Increment the value of an item in the cache.
     *
     * @param  string $key
     * @param  mixed $value
     * @return int|bool
     */
    public function increment($key, $value = 1)
    {
        return $this->redis->inc($this->getPrefix() . $key, $value);
    }

    /**
     * Decrement the value of an item in the cache.
     *
     * @param  string $key
     * @param  mixed $value
     * @return int|bool
     */
    public function decrement($key, $value = 1)
    {
        return $this->redis->dec($this->getPrefix() . $key, $value);
    }

    /**
     * Store an item in the cache indefinitely.
     *
     * @param  string $key
     * @param  mixed $value
     * @return void
     */
    public function forever($key, $value)
    {
        $this->put($key, $value, self::FOREVER_TTL);

        $keys = is_array($key) ? $key : [$key];

        $keys = $this->_getMultiPrefixKeys($keys);

        $this->redis->pipeline();

        foreach ($keys as $key) {

            $this->redis->persist($key);
        }

        $this->redis->exec();
    }

    /**
     * Remove an item from the cache.
     *
     * @param  string $key
     * @return bool
     */
    public function remove($key)
    {
        $this->redis->del($this->getPrefix() . $key);
    }

    /**
     * Remove all items from the cache.
     *
     * @return void
     */
    public function flush()
    {
        $this->redis->flushDB();
    }

    /**
     * Get the cache key prefix.
     *
     * @return string
     */
    public function getPrefix()
    {
        return $this->prefix;
    }

    public function __call($name, $arguments)
    {
        return call_user_func_array([$this->redis, $name], $arguments);
    }

}