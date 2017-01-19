<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/18
 * Time: 下午12:09
 */

namespace Filters;


use Filters\Contracts\ControllerFilter;
use Yaf_Dispatcher;
use Yaf_Request_Http;

/**
 * 关闭视图渲染
 * Class DisableView
 * @package Filters
 */
class DisableView extends ControllerFilterBase implements ControllerFilter
{
    /**
     * @var Yaf_Dispatcher
     */
    private $dispatcher;

    public function __construct(Yaf_Dispatcher $dispatcher, ControllerFilter $nextFilter = null)
    {
        parent::__construct($nextFilter);

        $this->dispatcher = $dispatcher;
    }

    /**
     * 执行过滤器的主方法
     * @param Yaf_Request_Http $request
     * @return mixed
     */
    public function handle(Yaf_Request_Http $request)
    {
        if ($this->shouldExecute($request->getActionName())) {

            $this->dispatcher->disableView();
        }
        $this->next($request);
    }
}