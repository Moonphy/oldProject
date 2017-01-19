<?php
/**
 * Created by PhpStorm.
 * User: tim
 * Date: 15/3/15
 * Time: 6:30 PM
 */

namespace Cache\Contracts;

/**
 * Interface Repository
 * @package Cache\Contracts
 */
interface Repository
{
    /**
     * 判断是否有key是否存在
     * @param $key
     * @return bool
     */
    public function has($key);

    /**
     * 获取key的数据
     * @param $key
     * @return mixed
     */
    public function fetch($key);

    /**
     * @param $key
     * @param $value
     * @param int $minutes
     * @return mixed
     */
    public function remember($key, $value, $minutes = 5);

    /**
     * @param $key
     * @return mixed
     */
    public function forgot($key);
}