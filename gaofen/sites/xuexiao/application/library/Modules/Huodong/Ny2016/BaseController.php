<?php
namespace Modules\Huodong\Ny2016;

use Modules\Huodong\Ny2016\User;
use Modules\Huodong\Ny2016\Material;
use F;
use CFG;
use Service\ThirdParty\WeixinJssdk;

abstract class BaseController extends \Yaf_Controller_Abstract
{
    public function init()
    {
        $this->type = 6;

        $this->round = [
            // start date, end date, total redpack, split to num of days
            4 => [1454515200 /*201602040000*/, 1455465600 /*201602150000*/, 500, 10],
            6 => [1455552000 /*201602160000*/, 1455562960 /*201602172500*/, 500, 7], // test
        ];
        // 关闭埋红包
        $this->noPay = false;

        $ny2016 = CFG::huodong('ny2016');
        $this->catid = $ny2016['catid'];
        $this->appid = CFG::auth('cat_list', $this->catid, 'app_id');
        $this->mch_id = CFG::auth('weixin_cfg', $this->appid, 'mch_id');

        $this->userObj = new User();
        $this->makeItTest();

        $this->materialObj = new Material($this->type);
        $this->cardPrefix = 'huodong_m:/huodong/weixin_ny2016_card';
        $this->userPrefix = 'huodong_m:/huodong/weixin_ny2016_user';
        $this->payPrefix = 'huodong_m:/huodong/weixin_ny2016_pay';
        $this->drawPrefix = 'huodong_m:/huodong/weixin_ny2016_draw';

        $this->dataPrefix = '/Houdong/Bestvoice';
        $this->prjCode = 1; // NY2016

        $jsSdk = new WeixinJssdk();
        $this->getView()->assign('wxConfig', json_encode($jsSdk->getCfg()));

        $this->getView()->assign('isEnd', $this->isEnd());
        $this->getView()->assign('noPay', $this->noPay);
    }

    protected function makeItTest()
    {
        $testAccount = [8840199, 8915794, 8840188, 8839493];
        if (in_array($this->userObj->id, $testAccount)) {
            $this->type = 6;
        }
    }

    protected function isEnd()
    {
        return time() > $this->round[$this->type][1];
    }

    protected function assignShareCard($cardId)
    {
        $this->getView()->assign('wxConfigDetail', json_encode([
            'title' => '元宵节，快来拿红包啦！',
            'desc' => '元宵节，抢春节压轴红包！亲子贺元宵，100%中奖！',
            'link' => F::URL("{$this->cardPrefix}/index2/", ['card' => $cardId]),
            'imgUrl' => GAOFEN_STATIC.'/html/weixin/bainian/img/share-1.png',
        ]));
    }

    protected function assignShareAct()
    {
        $this->getView()->assign('wxConfigDetail', json_encode([
            'title' => '元宵节，快来拿红包啦！',
            'desc' => '元宵节，抢春节压轴红包！亲子贺元宵，100%中奖！',
            'link' => F::URL("{$this->cardPrefix}/index/", ['holder' => 1]),
            'imgUrl' => GAOFEN_STATIC.'/html/weixin/bainian/img/share-1.png',
        ]));
    }

    protected function requireLogin()
    {
        if (!$this->userObj->isLogin()) {
            F::redirect(F::URL("{$this->userPrefix}/login/"));
            exit;
        }
    }

    /**
     * has to be someone else's card
     */
    protected function requireCard()
    {
        if (!$this->materialObj->hasMaterial() || $this->materialObj->isUser($this->userObj->id)) {
            // dont have card, or card is belong to this user
            F::redirect(F::URL("{$this->cardPrefix}/index/?e=1"));
            exit;
        }
        if (null != $this->materialObj->deleted_at) {
            F::redirect(F::URL("{$this->cardPrefix}/index/?e=2"));
            exit;
        }
    }

    /**
     * has to be my card
     */
    protected function requireMyCard()
    {
        if (!$this->materialObj->hasMaterial($this->userObj->id) && !$this->materialObj->isUser($this->userObj->id)) {
            // dont have card, or card is not belong to this user
            F::redirect(F::URL("{$this->cardPrefix}/index/?e=3"));
            exit;
        }
        if (null != $this->materialObj->deleted_at) {
            F::redirect(F::URL("{$this->cardPrefix}/index/?e=4"));
            exit;
        }
    }
}
