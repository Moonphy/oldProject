<?php

use Modules\Huodong\Xunbao\BaseController;
use Modules\Huodong\Xunbao\Material;
use Modules\Huodong\BaseTask\ActionTraits\Login;
use Modules\Huodong\BaseTask\ActionTraits\Portfolio;

class Weixin_Xunbao_XunbaoController extends BaseController
{
    use Login;
    use Portfolio {
        portfolioAction as portfolio;
    }

    protected function getType()
    {
        $xb2016 = CFG::huodong('xb2016');
        return $xb2016['type'];
    }

    protected function prerequisite()
    {
        return true;
    }

    protected function getLoginCallbackUrl()
    {
        return F::URL("{$this->xbPrefix}/loginCallback/");
    }

    public function indexAction()
    {
        $this->getView()->assign('links', [
            'taska' => F::URL("{$this->aPrefix}/index2/"),
            'isEnd' => $this->isEnd(),
        ]);
    }

    public function index2Action() {
     
    }

    public function statusAction() {
        $config = CFG::huodong('xb2016');
        $catid = $config['catid'];
        $appid = CFG::auth('cat_list', $catid, 'app_id');
        $mch_id = CFG::auth('weixin_cfg', $appid, 'mch_id');

        $url = F::URL($this->xbPrefix.'/index2/');
        $jsConfig = F::api("weixin:/account/{$appid}/jssdk/getConfig/", [
            'url' => $url,
        ]);
        if (isset($jsConfig['content'])) {
            $jsConfig = $jsConfig['content'];
        } else {
            $jsConfig = [];
        }
 
        F::ajaxRst([
            'host' => $_SERVER['HTTP_HOST'],
            'links' => [
                'home' => F::URL($this->xbPrefix.'/index2/'),
                'taska' => F::URL($this->aPrefix.'/index2/'),
                'taskb' => null,
                'taskc' => null,
                'login' => F::URL($this->xbPrefix.'/login/'),
            ],
            'api' => [
                'status' => F::URL($this->xbPrefix.'/status/'),
                'me' => F::URL($this->xbPrefix.'/me/'),
                'portfolio' => F::URL($this->xbPrefix.'/portfolio2/'),
                'updatePortfolio' => F::URL($this->xbPrefix.'/updateportfolio/'),
            ],
            'config' => $jsConfig,
        ]);
    }

    public function meAction() {
        $this->requireLogin(true);
    
        $uid = $this->userObj->getUserId();

        $config = CFG::huodong('xb2016');
        $m1 = new Material($config['taska']['type']);
        $m1->setByUid($uid);

        $taska = [];
        if (!$m1->id) {
            $taska['id'] = null;
        } else {
            $taska['id'] = $m1->id;
            $taska['ext_data'] = $m1->ext_data;
            $taska['fav_num'] = $m1->fav_num;
            $taska['fav_num_total'] = $m1->fav_num_total;
            $taska['path'] = $m1->getImageLink();
            $taska['updated_at'] = $m1->updated_at;
        }

        F::ajaxRst([
            'taska' => $taska,
            'taskb' => null,
            'taskc' => null,
            'user' => [
                'headimgurl' => $this->userObj->headimgurl,
                'nickname' => $this->userObj->nickname,
            ],
        ]);
    }

    public function portfolio2Action() {
        $this->requireLogin(true);

        $info = $this->getPortfolio();
        F::ajaxRst([
            'portfolio' => $info,
        ]);
    }

    public function portfolioAction() {
        $this->portfolio();
        $this->getView()->assign('user', $this->getUser());
        $this->getView()->assign('links', [
            'updatePortfolio' => F::URL("{$this->xbPrefix}/updatePortfolio"),
        ]);
    }

    public function taskportfolioAction() {
        $this->portfolio();
        $to = V('g:to', '');
        F::redirect($to);
        exit;
        $this->getView()->assign('links', [
            'updatePortfolio' => F::URL("{$this->xbPrefix}/updatePortfolio"),
            'to' => $to,
        ]);
    }

    protected function getDefaultInfo() {
        return [
            'name' => '',
            'age' => '',
            'gender' => '',
            'cell' => '',
            'province' => '广东省',
            'city' => '广州市',
            'district' => '',
        ];
    }

    protected function getPortfolioValidation() {
        return [
            'name' => [
                'p' => '/^.{1,20}$/u',
                'm' => '学生名字。必填项。不长于20个字。',
            ],
            'age' => [
                'p' => '/^(\d{1,2})?$/',
                'm' => '学生年级。可选项。不大于20。',
            ],
            'gender' => [
                'p' => '/^(F|M)?$/',
                'm' => '学生性别。可选项。',
            ],
/*
            'cell' => [
                'p' => '/^(\d{7,11})?$/',
                'm' => '联系号码。可选项。输入你的手机或座机号码。',
            ],
*/
            'province' => [
                'p' => '/^.{0,10}$/u',
                'm' => '地址：省。可选项。输入你的现居住的省。不长于10个字。',
            ],
            'city' => [
                'p' => '/^.{0,20}$/u',
                'm' => '地址：市。可选项。输入你的现居住的市。不长于20个字。',
            ],
            'district' => [
                'p' => '/^.{0,20}$/u',
                'm' => '地址：区。可选项。输入你的现居住的区。不长于20个字。',
            ],
        ];
    }

}
