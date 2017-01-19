<?php
namespace Modules\Huodong\BaseTask\ActionTraits;

use F;
use Modules\Huodong\Bestvoice\Common as BCommon;

trait Login
{
    abstract protected function getCatid();
    abstract protected function getAppid();
    abstract protected function getLoginCallbackUrl();
    abstract protected function requireLogin($json = false);

    protected function loginCallback()
    {
        return;
    }

    public function loginAction()
    {
        $from = V('g:f', '')?:BCommon::getCurrentUrl();
        $from = urlencode($from);

        $callback = $this->getLoginCallbackUrl();
        if (!$this->userObj->isLogin()) {
           if(!$this->userObj->autoLogin()) {
                $params = [
                    'catid' => $this->getCatid(),
                    'callback' => F::URL('huodong_m:huodong/weixin_account/callback', ['callback' => "{$callback}?l=1&f={$from}"]),
                ];
                F::redirect(F::URL('auth:/Auth/Weixin/sync', $params));
            }
        }
        F::redirect("{$callback}?f={$from}");
    }

    public function loginCallbackAction()
    {
        $this->requireLogin();
        $user = $this->userObj;

        if ('1' == V('g:l', '0')) {
            F::api("weixin:account/{$this->getAppid()}/login", [
                'unionid' => $user->unionid,
                'openid' => $user->openid,
                'nickname' => $user->nickname,
                'headimgurl' => $user->headimgurl,
                'sex' => $user->sex,
            ], [], 'POST');
        }

        $this->loginCallback();

        if ($f = V('g:f', false)) {
            F::redirect($f);
        }
        exit;
    }
}
