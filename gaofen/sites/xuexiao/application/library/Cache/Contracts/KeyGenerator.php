<?php
/**
 * Created by PhpStorm.
 * User: tim
 * Date: 14/3/15
 * Time: 10:44 PM
 */

namespace Cache\Contracts;


interface KeyGenerator 
{
    /**
     * @param array $params
     * @return string
     */
    public function getCacheKey(array $params);
}