<?php

use Modules\Huodong\Ny2016\BaseController;

class Weixin_Ny2016_UserController extends BaseController
{
    public function loginAction()
    {
        $callback = F::URL("{$this->userPrefix}/logincallback/");
        if (!$this->userObj->isLogin()) {
           if(!$this->userObj->autoLogin()) {
                $params = [
                    'catid' => $this->catid,
                    'callback' => F::URL('huodong_m:huodong/weixin_account/callback', ['callback' => $callback.'?l=1']),
                ];
                F::redirect(F::URL('auth:/Auth/Weixin/sync', $params));
            }
        }
        F::redirect($callback);
    }

    public function loginCallbackAction()
    {
        $this->requireLogin();
        $user = $this->userObj;
        $this->materialObj->hasMaterial($user->id);

        if ('1' == V('g:l', '0')) {
            F::api("weixin:account/{$this->appid}/login", [
                'unionid' => $user->unionid,
                'openid' => $user->openid,
                'nickname' => $user->nickname,
                'headimgurl' => $user->headimgurl,
                'sex' => $user->sex,
            ], [], 'POST');
        }
        if ($this->materialObj->hasMaterial() && !$this->materialObj->isUser($user->id)) {
            $card = $this->materialObj;
            $type = $card->getData('shareType');
            if (!isset($type)) {
                $type = 4;
            }
            if ('' != $card->unionid) {
                F::api("weixin:user/union/{$card->unionid}/make-friend", [
                    'unionid' => $user->unionid,
                    'src' => $this->prjCode,
                    'type' => $type, // 1 - chat, 2 - moment, 3 - other, 4 - unknown
                ], [], 'POST');
            }
        }

        $url = F::URL("{$this->cardPrefix}/makeCard/");
        if ($this->materialObj->hasMaterial()) {
            if ($this->materialObj->isUser($user->id)) {
                $url = F::URL("{$this->cardPrefix}/shareCard/");
            } else {
                $url = F::URL("{$this->cardPrefix}/card/");
            }
        }

        F::redirect($url);
    }
}
