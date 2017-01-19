<?php
/**
 * Created by PhpStorm.
 * User: tim
 * Date: 17/3/15
 * Time: 10:14 PM
 */

namespace Cache\Repositories;


use Cache\Contracts\KeyGenerator;
use Cache\Contracts\Repository;
use Cache\Contracts\Store;
use Illuminate\Database\Eloquent\Collection;

class CacheRepo implements Repository
{

    /**
     * @var Store
     */
    private $store;
    /**
     * @var KeyGenerator
     */
    private $keygen;

    public function __construct(Store $store, KeyGenerator $keygen)
    {
        $this->store = $store;
        $this->keygen = $keygen;
    }

    /**
     * 判断是否有key是否存在
     * @param $key
     * @return bool
     */
    public function has($key)
    {
        return $this->store->get($key) !== false;
    }

    /**
     * 获取key的数据
     * @param $key
     * @return mixed
     */
    public function fetch($key)
    {
        $raw_data = $this->store->get($key);

        if (is_array($raw_data)) {

            return new Collection($raw_data);
        }

        return $raw_data;
    }

    /**
     * @param $key
     * @param $value
     * @param int $minutes
     * @return mixed
     */
    public function remember($key, $value, $minutes = 5)
    {
        if (is_array($key) && $value instanceof \Illuminate\Support\Collection) {

            return $this->store->put($key, $value->all(), $minutes);

        }
        
        $this->store->put($key, $value, $minutes);
    }

    /**
     * @param $key
     * @return mixed
     */
    public function forgot($key)
    {
        // TODO: Implement forgot() method.
    }
}