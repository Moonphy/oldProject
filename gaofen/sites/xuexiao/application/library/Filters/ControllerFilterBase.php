<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/18
 * Time: 上午10:49
 */

namespace Filters;


use Filters\Contracts\ControllerFilter;

/**
 * Class ControllerFilterBase
 * @package Filters
 */
abstract class ControllerFilterBase
{
    /**
     * @var ControllerFilter
     */
    protected $nextFilter;

    /**
     * @var array
     */
    protected $onlys = [];

    /**
     * @var array
     */
    protected $excepts = [];


    /**
     * @param ControllerFilter|null $nextFilter
     */
    public function __construct(ControllerFilter $nextFilter = null)
    {
        $this->nextFilter = $nextFilter;
    }

    /**
     * @param \Yaf_Request_Http $request
     */
    public function next(\Yaf_Request_Http $request)
    {
        if ($this->nextFilter) {
            $this->nextFilter->handle($request);
        }

    }

    /**
     * @param array $actions
     */
    public function only(array $actions)
    {
        $this->onlys = $this->tolower($actions);
    }

    /**
     * @param array $actions
     */
    public function except(array $actions)
    {
        $this->excepts = $actions;
    }

    /**
     * @param $actions
     * @return array
     */
    protected function tolower($actions)
    {
        return array_map(function ($name) {
            return strtolower($name);
        }, $actions);
    }

    /**
     * @param $action
     * @return bool
     */
    public function shouldExecute($action)
    {
        // 默认情况下所有方法都执行filter
        if (!$this->onlys && !$this->excepts) {

            return true;
        }

        if ($this->onlys) {
            return in_array($action, $this->onlys) && !in_array($action, $this->excepts);
        }

        if (in_array($action, $this->excepts)) {

            return false;
        }

        return true;

    }

}