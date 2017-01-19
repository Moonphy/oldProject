<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/18
 * Time: 上午11:16
 */

namespace Filters\Contracts;


use Yaf_Request_Http;

/**
 * 控制器过滤器接口
 * Interface ControllerFilter
 * @package Filters\Contracts
 */
interface ControllerFilter
{
    /**
     * 执行过滤器的主方法
     * @param Yaf_Request_Http $request
     * @return mixed
     */
    public function handle(Yaf_Request_Http $request);

    /**
     * 需要执行过滤器的方法
     * @param array $methods
     * @return mixed
     */
    public function only(array $methods);

    /**
     * 不需要自行过滤器的方法
     * @param array $methods
     * @return mixed
     */
    public function except(array $methods);

}