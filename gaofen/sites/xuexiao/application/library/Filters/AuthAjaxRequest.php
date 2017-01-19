<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/18
 * Time: 上午11:20
 */

namespace Filters;


use Filters\Contracts\ControllerFilter;
use Yaf_Request_Http;
use F;

/**
 * Class AuthAjaxRequest
 * @package Filters
 */
class AuthAjaxRequest extends ControllerFilterBase implements ControllerFilter
{

    /**
     * @param Yaf_Request_Http $request
     */
    public function handle(Yaf_Request_Http $request)
    {
        // 获取请求的action
        $method = $request->getActionName();

        if ($this->shouldExecute($method)) {
            $this->_handle($request);
        }

        $this->next($request);
    }

    /**
     * @param Yaf_Request_Http $request
     */
    protected function _handle(Yaf_Request_Http $request)
    {
        // 回调函数
        $callback = V('R:' . JSONPCALLBACK, false);
        // 检查访问权限
        if (V('r:' . V_JS_REQUEST_ROUTE)) {
            // 加载 user_agent
            $agent = NY('userAgent');

            if ($request->isXmlHttpRequest() && !$agent->is_browser() && !$agent->is_mobile()) {
                F::ajaxRst(null, '700001', 'Api security check failure', false, $callback);
            }
        } else {
            F::ajaxRst(null, '700002', 'Does not allow access', false, $callback);
        }

    }
}