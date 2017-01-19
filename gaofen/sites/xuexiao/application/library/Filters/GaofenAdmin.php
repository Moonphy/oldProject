<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/18
 * Time: 下午2:15
 */

namespace Filters;


use Filters\Contracts\ControllerFilter;
use Users;
use F;
use Yaf_Request_Http;

class GaofenAdmin extends ControllerFilterBase implements ControllerFilter
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
            $_editor_auth = V('c:editor_auth');

            if (!Users::isLogin() || !$_editor_auth) {

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