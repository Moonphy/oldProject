<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/13
 * Time: 下午4:25
 */

namespace Weixin;

use ORM\Auth\Weixin;
use F;

Trait AuthTrait
{
    protected $authCookieName = 'gaofen:weixin';
    protected $callBack = null;
    protected $redirectAction = null;

    public function setCallBack($callBack)
    {
        $this->callBack = $callBack;
    }

    public function Auth()
    {
        $info = F::getCookie($this->authCookieName);

        if ($info) {

            return true;
        }

        $action = $this->getRequest()->getActionName();

        $this->authAction($action);

        return true;
    }

    public function getWeixinInfo()
    {
        if (F::inEnv('develop')) {
            $userInfo = F::api('auth:/Auth/Weixin/get', ['uid' => '8839497']);

            if ($userInfo && !isset($userInfo['errno'])) {

                return new Weixin($userInfo);
            }
        }

        $this->Auth();

        $info = F::getCookie($this->authCookieName);

        if ($info) {

            return new Weixin(json_decode($info, true));
        }

    }

    public function authAction()
    {
        $url = $this->callBack ? $this->callBack : $this->getMyURL('callback', V('G'));

        $state = $this->getRequest()->getActionName();

        $authDomain = F::getSiteHost('auth');

        $this->redirect($authDomain . '/auth/weixin/sync?state=' . $state . '&callback=' . urlencode($url));
    }

    public function callBackAction()
    {
        $action = V('G:state');
        $userInfo = F::api('auth:/Auth/Weixin/get', ['uid' => V('G:uid')]);

        if ($userInfo) {

            $userInfo = new Weixin($userInfo);

            F::setCookie($this->authCookieName, $userInfo->toJson(), time() + 60 * 60 * 24 * 365, 'gaofen.com');
        }


        $url = $this->getMyURL($action, V('G'));

        $this->redirect($url);

        return false;
    }

    public function getMyURL($action, $params)
    {
        $module = $this->getRequest()->getModuleName();
        $controller = $this->getRequest()->getControllerName();
        $url = F::URL($module . '/' . $controller . '/' . $action, array_except($params, ['r']));

        return my_domain() . $url;
    }

}