<?php

use Modules\Huodong\Ny2016\Fav;
use Modules\Huodong\Ny2016\Prize;
use Modules\Huodong\Ny2016\Redpack;
use Modules\Huodong\Ny2016\BaseController;
use Zhuzhichao\IpLocationZh\Ip;

class Weixin_Ny2016_DrawController extends BaseController
{
    protected $CacheKey = 'NY:DRAW';
    public function drawAction()
    {
        $this->requireLogin();
        //$this->requireCard();

        $user = $this->userObj;
        $card = $this->materialObj;


        if (!$this->materialObj->hasMaterial()) {
             F::ajaxRst(['drawStatus' => null], '100000', 'Require Card.');
            exit;
        }
        if ($this->isEnd()) {
            F::ajaxRst(['drawStatus' => null], '100000', '活动已结束');
        }

        if ('1' == CACHE::get("{$this->CacheKey}:{$card->id}:{$user->id}")) {
            F::ajaxRst(['drawStatus' => null], '100000', '点击过于频繁。请稍后。');
            exit;
        }
        CACHE::setex("{$this->CacheKey}:{$card->id}:{$user->id}", 10, '1');

        $favId = null;
        if ($card->uid != $user->id) {
            $favObj = new Fav();
            $favObj->setType($this->type);
            $fav = $favObj->get($card->id, $user->id);
            if (!isset($fav)) {
                F::ajaxRst(['drawStatus' => null], '100000', '请先点赞');
                exit;
            }
            $favId = $fav->id;
        }

        $prizeObj = new Prize();
        $prizeObj->setType($this->type);
        $drawStatus = $prizeObj->getDrawStatus($user->id, $card->id);
        if (isset($drawStatus)) {
            F::ajaxRst(['drawStatus' => $drawStatus], '100000', '已抽过红包');
            return;
        }

        $redpackObj = new Redpack();
        $redpackObj->setType($this->type);
        $redpackCount = $redpackObj->getTotal() - 3400 - 100; // type 6 sent in the first day.
        $currentTime = time();

/*
$testData = [
    [-100, 1455879600], // 2016 0219 170000
    [-50, 1455879600], // 2016 0219 170000
    [0, 1455879600], // 2016 0219 170000
    [10, 1455879600], // 2016 0219 170000
    [50, 1455879600], // 2016 0219 170000

    [40, 1455879600 + 3600*24], // 2016 0219 170000
    [80, 1455879600 + 3600*24], // 2016 0219 170000
    [110, 1455879600 + 3600*24], // 2016 0219 170000

    [100, 1455879600 + 2*3600*24], // 2016 0219 170000
    [120, 1455879600 + 2*3600*24], // 2016 0219 170000
    [140, 1455879600 + 2*3600*24], // 2016 0219 170000
    [180, 1455879600 + 2*3600*24], // 2016 0219 170000
    [200, 1455879600 + 2*3600*24], // 2016 0219 170000

    [200, 1456329600 - 600], // 2016 0219 170000
    [300, 1456329600 - 600], // 2016 0219 170000
    [350, 1456329600 - 600], // 2016 0219 170000
    [390, 1456329600 - 600], // 2016 0219 170000
    [400, 1456329600 - 600], // 2016 0219 170000
    [410, 1456329600 - 600], // 2016 0219 170000
];
foreach ($testData as $test) {
$redpackCount = $test[0];
$currentTime = $test[1];
*/

        $round = $this->round[$this->type];
        $dayOn = intval(($currentTime - $round[0])/(3600*24)) + 1;
        $preDay = $round[2]/$round[3];
        if ($dayOn < $round[3]) {
            $availableRedpack = $dayOn * $preDay - $redpackCount;
        } else {
            $availableRedpack = $round[2] - $redpackCount;
        }
        $redpackPreCard = 5;
        if ($availableRedpack < 0) {
            $availableRedpack = 0;
        }
        $rate = $availableRedpack/$preDay;
        $redpackPreCard = ceil($rate);
        if ($redpackPreCard > 5) {
            $redpackPreCard = 5;
        }

/*
var_dump('day:'.$dayOn.' redpackPredCard:'.$redpackPreCard.' '.$rate.'='.$availableRedpack.'/'.$preDay);
}
exit;
*/
        $logData = [
            'uid' => $user->id,
            'pid' => $card->id,
            'date' => date('Ymd'),
            'type' => $this->type,
            'fav_id' => $favId,
        ];
        $prize = [
            ['q200', 2, null],
            ['q100', 1, null],
        ];

        $ip = Ip::find($user->ip);
        if (is_array($ip) && $ip[2] == '广州') {
            if ($card->uid == $user->id && $rate > 0.5) {
                array_unshift($prize, ['redpack'.$card->id, 10, $redpackPreCard]);
            } else if ($redpackPreCard > 0) {
                array_unshift($prize, ['redpack'.$card->id, 20, $redpackPreCard]);
            }
        } else {
            array_unshift($prize, ['redpack'.$card->id, 50, $redpackPreCard]);
        }

        $i = 0;
        $prizeData = null;
        while (true) {
            $isBingo = $prizeObj
                ->setGift($prize[$i][0])
                ->setWinningRate($prize[$i][1])
                ->setMaxWinner($prize[$i][2])
                ->isBingo();

            if ($isBingo) {
                $prizeData = $prizeObj->writeData($logData);
                break;
            }
            if ($i < sizeof($prize) - 1) {
                ++$i;
            }
        }

        // todo overwrite prize if fail to send redpack
        if ($prizeObj->getGift() == 'redpack'.$card->id) {
            $redpackObj = new Redpack();
            $redpackObj->setType($this->type);
            $redpackObj->setAppid($this->appid);
            $amount = mt_rand(100, 120);
            $redpackObj->sendRedpack($card->uid, $user->id, $user->openid, $amount, 1, null, $prizeData->id);
        }

        F::ajaxRst(['drawStatus' => $prizeObj->getGift2()]);
    }

    public function getdrawAction()
    {
        // deprecated
        return;
        $favObj = new Fav();
        $list = $favObj->getList();
        F::ajaxRst($list);

        return;

        $this->requireCard();
        $card = $this->materialObj;
        $user = $this->userObj;

        $pageNum = V('g:pageNum', 1);
        $items = F::api("/Huodong/Bestvoice/Prize/listByCond", [
            //'uid' => $user->id,
            'pid' => $card->id,
            'type' => $this->type,
            'page' => $pageNum,
        ]);

        $rst = [];
        foreach ($items['list'] as $i) {
            $user = F::api("/Huodong/Bestvoice/User/get", ['id' => $i->uid]);
            $t = [
                'user' => [
                    'nickname' => $user->nickname,
                    'headimgurl' => $user->headimgurl,
                ],
                'gift' => $i->gift,
                'date' => $i->created_at->timestamp,
            ];
            array_push($rst, $t);
        }

        F::ajaxRst($rst);
    }
}
