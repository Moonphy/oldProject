<?php

namespace Modules\Huodong\Xunbao;

use Modules\Huodong\BaseTask\BaseController as Controller;
use Modules\Huodong\Xunbao\User;
use Modules\Huodong\Xunbao\Material;
use F;
use CFG;

abstract class BaseController extends Controller {
    protected $xbPrefix = 'huodong_m:/huodong/weixin_xunbao_xunbao';
    protected $aPrefix = 'huodong_m:/huodong/weixin_xunbao_taska';

    public function init() {
        parent::init();
        
        $this->getView()->assign('footA', [
            'link' => F::URL('huodong_m:/huodong/weixin_xunbao_xunbao/index/'), 
            'title' => '寻宝首页',
        ]);
        $this->getView()->assign('footB', [
            'link' => F::URL('huodong_m:/huodong/weixin_xunbao_taska/index2/'), 
            'title' => '活动一',
        ]);
        $this->getView()->assign('footC', [
            'link' => F::URL('huodong_m:/huodong/weixin_xunbao_xunbao/portfolio/'), 
            'title' => '我的营地',
        ]);
        $this->getView()->assign('linkA', F::URL('huodong_m:/huodong/weixin_xunbao_taska/index2/'));
        $this->getView()->assign('linkB', F::URL('huodong_m:/huodong/weixin_xunbao_taskb/index/'));
        $this->getView()->assign('linkC', F::URL('huodong_m:/huodong/weixin_xunbao_taskc/index/'));
    }

    protected function getLoginUrl() {
        return F::URL("{$this->xbPrefix}/login/");
    }

    protected function isEnd() {
        // todo temporary until it is final
        return false;
    }

    protected function getPrjCode() {
        return 'XB2016';
    }

    protected function getUser() {
        return new User();
    }

    protected function getMaterial() {
        return new Material($this->getType());
    }

    protected function getCatid() {
        if (!isset($this->catid)) {
            $xb2016 = CFG::huodong('xb2016');
            $this->catid = $xb2016['catid'];
        }
        return $this->catid;
    }

    protected function getAppid() {
        return '';
    }
}
