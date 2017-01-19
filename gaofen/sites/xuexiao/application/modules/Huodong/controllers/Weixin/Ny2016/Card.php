<?php

use Modules\Huodong\Bestvoice\User;
use Modules\Huodong\Ny2016\Material;
use Modules\Huodong\Ny2016\Prize;
use Modules\Huodong\Ny2016\Fav;
use Modules\Huodong\Ny2016\Redpack;
use Modules\Huodong\Ny2016\BaseController;
use Modules\Huodong\Bestvoice\Audio;

class Weixin_Ny2016_CardController extends BaseController
{
    public function indexAction()
    {
        $shareType = V('g:type', 3);
        $this->materialObj->reset();
        $this->materialObj->setData($shareType, 'shareType');
        $loginLink = F::URL("{$this->userPrefix}/login/");
        $ruleLink = F::URL("{$this->cardPrefix}/rule/");

        $this->getView()->assign(compact(['loginLink', 'ruleLink']));
        $this->assignShareAct();
    }

    public function index2Action()
    {
        $cardId = V('g:card');
        $shareType = V('g:type', 3);
        $this->materialObj->reset();
        $this->materialObj->set($cardId);
        $this->materialObj->setData($shareType, 'shareType');
        if (!$this->materialObj->hasMaterial()) {
            F::redirect(F::URL("{$this->cardPrefix}/index/"));
            exit;
        }
        $loginLink = F::URL("{$this->userPrefix}/login/");

        $card = $this->materialObj;
        $favCount = $card->fav_num;

        $this->getView()->assign(compact(['loginLink', 'card', 'favCount']));
        $this->assignShareCard($cardId);
    }

    public function cardAction()
    {
        $this->requireLogin();
        $this->requireCard();
        $user = $this->userObj;
        $card = $this->materialObj;

        $prizeObj = new Prize();
        $prizeObj->setType($this->type);
        $redpackObj = new Redpack();
        $redpackObj->setType($this->type);
        $drawStatus = $prizeObj->getDrawStatus($user->id, $card->id);
        $redpackStatus = $redpackObj->getRedpackStatus($user->id, $card->uid);
        $favObj = new Fav();
        $favObj->setType($this->type);
        $favList = $favObj->getList($card->id);
        $fav = $favObj->get($card->id, $user->id);
        $favStatus = isset($fav)?true:false;

        $drawLink = F::URL("{$this->drawPrefix}/draw/");
        $payLink = F::URL("{$this->payPrefix}/pay/");
        $getDrawLink = F::URL("{$this->drawPrefix}/getdraw/");
        $indexLink = F::URL("{$this->cardPrefix}/index/");
        $ruleLink = F::URL("{$this->cardPrefix}/rule/");

        $this->getView()->assign(compact(['user', 'card', 'drawStatus', 'redpackStatus', 'favList', 'favStatus']));
        $this->getView()->assign(compact(['drawLink', 'payLink', 'getDrawLink', 'indexLink', 'ruleLink']));
        $this->assignShareCard($card->id);
    }

    public function shareCardAction()
    {
        $this->materialObj->reset();
        $this->requireLogin();
        $this->requireMyCard();

        $user = $this->userObj;
        $card = $this->materialObj;

        $redpackObj = new Redpack();
        $redpackObj->setType($this->type);
        // $redpackObj->fetch();
        $redpacks = $redpackObj->getTips($user->id);
        $redpackCount = sizeof($redpacks);
        $redpackAmount = array_reduce($redpacks, function($p, $c) {
            return $p + $c->amount;
        }, 0);
        $redpackAmount = $redpackAmount/100;
        $favObj = new Fav();
        $favObj->setType($this->type);
        $favList = $favObj->getList($card->id);

        $prizeObj = new Prize();
        $prizeObj->setType($this->type);
        $drawStatus = $prizeObj->getDrawStatus($user->id, $card->id);

        $drawLink = F::URL("{$this->drawPrefix}/draw/");
        $inviteLink = F::URL("{$this->cardPrefix}/index2/", ['card' => $card->id]);
        $getDrawLink = F::URL("{$this->drawPrefix}/getdraw/");
        $makeCardLink = F::URL("{$this->cardPrefix}/makecard/");
        $rankLink = F::URL("{$this->cardPrefix}/rank/");


        $list = F::api('/Huodong/Bestvoice/Material/listByCond', [
            'type' => $this->type,
            'limit' => 10,
            'sort'=>'fav_num',
        ]);
        $finalRank = F::api('/Huodong/Bestvoice/Material/getRankById', [
            'id' => $card->id,
            'type' => $this->type,
            'field' => 'fav_num',
        ]);

        $this->getView()->assign(compact(['user', 'card', 'redpackCount', 'redpackAmount', 'favList', 'redpacks', 'drawStatus']));
        $this->getView()->assign(compact(['drawLink', 'inviteLink', 'getDrawLink', 'rankLink', 'makeCardLink']));
        $this->getView()->assign(compact(['finalRank']));
        $this->assignShareCard($card->id);
    }

    public function makeCardAction()
    {
        $this->requireLogin();

        if ($this->materialObj->hasMaterial()) {
            // F::redirect(F::URL("{$this->userPrefix}/logincallback/"));
            $this->getView()->assign('haveCard', true);
        }

        $makeLink = F::url("{$this->cardPrefix}/makeCard");
        $createLink = F::url("{$this->cardPrefix}/createCard");
        $shareLink = F::url("{$this->cardPrefix}/shareCard");

        $this->getView()->assign(compact(['makeLink', 'createLink', 'shareLink']));
        $this->assignShareAct();
    }

    public function createCardAction()
    {
        $this->requireLogin();
        $user = $this->userObj;

        $media_id   = V('p:media_id'); //素材ID
        $sec        = (int)V('p:sec'); //秒数
        $type = $this->type;
        $uid = $user->id;

        /*
        if ($this->materialObj->hasMaterial()) {
            F::ajaxRst(false, 100001, '已创建贺卡');
        }
        */
        if($this->isEnd()) {
            F::ajaxRst(false, 100001, '活动已结束');
        }

        $saveUri = "/huodong/voice/".$this->type."/{$uid}_".md5(time());
        $savePath = DATA_PATH.$saveUri;

        $audObj = new Audio();
        $rs = $audObj->save($media_id, $savePath);

        //微信目前只允许1分钟录音，否则尝试获取正确录音时间
        if($sec>2*60*1000) {
            $tryGetSec = $audObj->getDuration($savePath);
            if(is_int($tryGetSec) && $tryGetSec>0) {
                $sec = $tryGetSec*1000;
            }
        }

        F::log($rs);

        if($rs) {
            $saveData = [
                'uid'   => $uid,
                'path'  => $saveUri,
                'type'  => $type,
                'mil_sec'   => $sec,
                'type'  => $this->type,
            ];

            $mid = $this->getFistMidByUid($uid);
            if($mid) {
                $saveData['id'] = $mid;
                $rs = F::api('/Huodong/Bestvoice/Material/update', $saveData);
            }else{
                if($uid!=$this->userObj->getInviter()) {
                    $saveData['inviter'] = $this->userObj->getInviter();
                }
                $rs = F::api('/Huodong/Bestvoice/Material/create', $saveData);
                $mid = $rs->id;
            }
        }else{
            F::ajaxRst(false, 100000, '保存失败');
        }

        //上报数据
        file_get_contents('http://bbs.gaofen.com/plugin.php?id=sms_club:test&nickname='.$this->userObj->nickname);
        F::ajaxRst(['id'=>$mid, 'voice'=>$rs->present()->getVoiceLink()]);
    }

    public function rankAction()
    {
        $this->requireLogin();
        $this->requireMyCard();
        $user = $this->userObj;
        $card = $this->materialObj;

        $list = F::api('/Huodong/Bestvoice/Material/listByCond', [
            'type' => $this->type,
            'limit' => 7,
            'sort'=>'fav_num',
        ]);
        $finalRank = F::api('/Huodong/Bestvoice/Material/getRankById', [
            'id' => $card->id,
            'type' => $this->type,
            'field' => 'fav_num',
        ]);
        $shareLink = F::url("{$this->cardPrefix}/shareCard");

        $this->getView()->assign(compact(['finalRank', 'list', 'card', 'user']));
        $this->getView()->assign(compact(['shareLink']));
    }

    public function ruleAction() {
        $indexLink = F::URL("{$this->cardPrefix}/index/");
        $this->getView()->assign(compact(['indexLink']));
    }

    public function endAction() {}

    public function fetchAction() {
        $this->requireLogin();
        $user = $this->userObj;

        if (false == in_array($user->id, [
            8839494, // 大奔
            8839496, // 清之雪
            8840199, // benjaH
        ])) {
            F::redirect(F::URL("{$this->cardPrefix}/index/"));
            exit;
        }
 
        $redpackObj = new Redpack();
        $redpackObj->setType($this->type);
        $redpackObj->fetch();
        exit;
    }

    public function resendAction() {
        $this->requireLogin();
        $user = $this->userObj;
        $key = 'resend';
        if ('1' == CACHE::get($key)) {
            echo 'ran';
            exit;
        }
        CACHE::setex($key, 60, '1');

        if (false == in_array($user->id, [
            8839494, // 大奔
            8839496, // 清之雪
            8840199, // benjaH
        ])) {
            F::redirect(F::URL("{$this->cardPrefix}/index/"));
            exit;
        }

        $redpackObj = new Redpack();
        $redpackObj->setType($this->type);
        $redpackObj->setAppid($this->appid);
        $redpackObj->resendRedpack();

        var_dump('done');
        exit;
    }
 
    public function logAction() {
        $this->requireLogin();
        $user = $this->userObj;

        if (false == in_array($user->id, [
            8839494, // 大奔
            8839496, // 清之雪
            8840199, // benjaH
        ])) {
            F::redirect(F::URL("{$this->cardPrefix}/index/"));
            exit;
        }

        $pay = F::api('Huodong/Bestvoice/Assemblage/listByCond', [
            'type' => $this->type,
            'limit' => 999,
        ]);

        $result = [];
        $payTotal = 0;
        $payRedeem = 0;
        $payNoredeem = 0;
        foreach($pay['list'] as $i) {
            $key = 'card:'.$i->assemblage['card_id'];
            if (!isset($result[$key])) {
                $result[$key] = [
                    'card_id' => $i->assemblage['card_id'],
                    'user_id' => $i->uid,
                    'pay_count' => 0,
                    'pay_total' => 0,
                    'pay_redeem' => 0,
                    'pay_noredeem' => 0,
                ];
            }
            ++$result[$key]['pay_count'];
            $result[$key]['pay_total'] += $i->assemblage['amount'];
            if ($i->cond1 == 1) {
                $result[$key]['pay_redeem'] += $i->assemblage['amount'];
                $payRedeem += $i->assemblage['amount'];
            } else {
                $result[$key]['pay_noredeem'] += $i->assemblage['amount'];
                $payNoredeem += $i->assemblage['amount'];
            }
            $payTotal += $i->assemblage['amount'];
        }

        usort($result, function($a, $b) {
            return ($a['pay_total'] > $b['pay_total']) ? -1: 1;
        });

        $this->getView()->assign(compact(['payTotal', 'payRedeem', 'payNoredeem', 'result']));
    }

    public function deleteAction() {
        $user = $this->userObj;
        $card = $this->materialObj;

        if (!$card->isUser($user->id)) {
            echo 'Fail';
            exit;
        }
        $id = F::api('/Huodong/Bestvoice/Material/delete', ['id' => $card->id, 'type' => $this->type]);
        echo 'deleted material '.$id;
        echo '<br/>';
        echo '<br/>';
        echo '跳回index后生效。';
        exit;
    }

    private function getFistMidByUid($uid) {
        $uVoice =  F::api('/Huodong/Bestvoice/Material/listByCond', ['type'=>$this->type, 'uid'=>$uid, 'limit'=>1]);
        $mid = NULL;
        if(!empty($uVoice['list'][0]->id)){
            $mid = $uVoice['list'][0]->id;
        }

        return $mid;
    }

}
