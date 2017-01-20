<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/18
 * Time: 下午2:15
 */

namespace Filters;


use F;
use Filters\Contracts\ControllerFilter;
use Users;
use Yaf_Request_Http;

class IsLogin extends ControllerFilterBase implements ControllerFilter
{

    /**
     * 执行过滤器的主方法
     * @param Yaf_Request_Http $request
     * @return mixed
     */
    public function handle(Yaf_Request_Http $request)
    {
        if ($this->shouldExecute($request->getActionName())) {

            $login_url = 'http://my.gaofen.com/signin';

            if (!Users::isLogin()) {

                F::redirect($login_url);

            } else {

                if (!Users::username()) {

                    F::redirect($login_url);
                }
            }

        }
        $this->next($request);
    }
}