<?php

namespace Modules\Huodong\BaseTask;

use Yaf_Controller_Abstract;
use Modules\Huodong\BaseTask\User;
use Service\ThirdParty\WeixinJssdk;
use Cache\Redis;
use F;
use Modules\Huodong\Bestvoice\Common;

abstract class BaseController extends Yaf_Controller_Abstract
{
    abstract protected function getType();

    abstract protected function getLoginUrl();

    abstract protected function prerequisite();

    abstract protected function isEnd();

    abstract protected function getPrjCode();

    abstract protected function getUser();

    abstract protected function getMaterial();

    public function init() {
        $this->userObj = $this->getUser();
        $this->materialObj = $this->getMaterial();

        $jsSdk = new WeixinJssdk();
        $jsConfig = $jsSdk->getCfg();
        $this->getView()->assign('wxConfig', json_encode($jsConfig));
        $this->getView()->assign('isEnd', $this->isEnd());
    }

    protected function getCacheKey($key) {
        return $this->getPrjCode().':'.$this->getType().':'.$key; 
    }

    protected function getCache() {
        return Redis::getInstance('huodong');
    }

    protected function requireLogin($json = false) {
        if (!$this->userObj->isLogin()) {
            if ($json) {
                F::ajaxRst([], '500', '请登录');
            } else {
                // todo get current url
                $uri = $this->getCurrentUri();
                $uri = urlencode($uri);
                F::redirect($this->getLoginUrl()."?f=$uri");
            }
            exit;
        }
    }

    protected function getCurrentUri() {
        return $url = Common::getCurrentUrl();
    }
}
