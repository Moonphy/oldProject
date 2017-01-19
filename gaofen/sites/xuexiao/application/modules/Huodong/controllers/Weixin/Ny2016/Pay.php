<?php

use Modules\Huodong\Ny2016\BaseController;
use Modules\Huodong\Ny2016\Prize;
use Modules\Huodong\Ny2016\Fav;
use Modules\Huodong\Ny2016\Redpack;

class Weixin_Ny2016_PayController extends BaseController
{
    public function payAction()
    {
        $this->requireLogin();
        $this->requireCard();

        $user = $this->userObj;
        $card = $this->materialObj;

        $cardUrl = F::URL("{$this->cardPrefix}/card/");
        $notifyUrl = F::URL("{$this->payPrefix}/paynotify/");
        $callbackUrl = F::URL("{$this->payPrefix}/paycallback/");

        if ($this->isEnd()) {
            F::redirect($cardUrl);
            exit;
        }

        if ($this->noPay) {
            F::redirect($cardUrl);
            exit;
        }

        $redpackObj = new Redpack();
        $redpackObj->setType($this->type);
        $redpack = $redpackObj->getRedpackStatus($user->id, $card->uid);

        if (isset($redpack)) {
            F::redirect($cardUrl);
            exit;
        }

        $amount = V('g:amount');
        // 0 mark fav but dont send redpack
        if (!in_array($amount, [
            '0', 
            // '0.10',
            // '1.11', '2.16', '6.66', '9.99',
            // '3.22', '9.88', // '50.00',
            // '2.22', '8.88',
            // '1.68', '1.88', '2.16', '6.66',
            '1.11', '1.28', '1.68', '1.88',
        ])) {
            F::redirect($cardUrl);
            exit;
        }

        $favObj = new Fav();
        $favObj->setType($this->type);
        $favObj->add($card->id, $user->id);

        if ($amount == '0') {
            //$redpackObj->setAppid($this->appid);
            //$redpackObj->sendRedpack($user->id, $card->uid, $card->openid, 0, 2, 0, null);
            F::redirect($cardUrl);
            exit;
        }
        if ($amount == '1.01') {
            $amount = '0.01';
        }

        $order_type = array_search($amount, [
            '0',
            '1.11', '2.16', '6.66', '9.99',
            '3.22', '9.88', // '50.00',
            '2.22', '8.88',
            '0.01',
            '0.10', 
            '1.16', '1.88', 
            '1.28', '1.68',
        ]);

        $orders = F::api('Pay:/Auth/PayOrder/listByCond', [
            'catid' => $this->catid,
            'uid' => $user->id,
            'pay_status' => 1,
        ]);

        $orders = array_filter($orders['list'], function($c) use ($card, $order_type) {
            return ($c['pid'] == $card->id) && ($c['order_type'] == $order_type);
        });

        $order = null;
        if (0 == sizeof($orders)) {
            // create order 未处理
            $orderData = [
                'catid' => $this->catid,
                'pid' => $card->id,
                'uid' => $user->id,
                'uname' => $user->nickname,
                'order_type' => $order_type,
                'pay_type' => 1,
                'amount' => 1,
                'fee' => floatval($amount),
                'total_fee' => floatval($amount),
                'attach' => '',
                'order_status' => 1,
            ];

            $order = F::api('Pay:/Auth/PayOrder/create', $orderData);
        } else {
            $order = array_shift($orders);
            $order['fee'] = floatval($amount);
            $order['total_fee'] = floatval($amount);
            $order['order_status'] = 1;
            $order = F::api('Pay:/Auth/PayOrder/update', $order);
        }

        // create prepay link
        $params = [
            'id'        => $order['id'],
            'openid'    => $user->openid,
            'uid'       => $user->id,
            'callback'  => $callbackUrl.'?oid='.$order['id'],
            'notify_url'=> $notifyUrl.'?oid='.$order['id'],
        ];
        $prepayUrl = F::URL('Pay:/Auth/Weixinpay/pay', $params);

        F::redirect($prepayUrl);
    }

    public function paynotifyAction()
    {
        // do nothing
    }

    public function paycallbackAction()
    {
        $this->requireLogin();
        $this->requireCard();
        $user = $this->userObj;
        $card = $this->materialObj;
        $oid = V('g:oid');
        $errMsg = V('g:errMsg', '');
        $cardUrl = F::URL("{$this->cardPrefix}/card/");

        $order = F::api('Pay:Auth/PayOrder/get', ['id' => $oid]);
        if (!$order) {
            $cardUrl = F::URL("{$this->cardPrefix}/card/");
            F::redirect($cardUrl);
            exit;
        }

        if ($order['pay_status'] == 2 && $order['order_status'] != 4) {
            $data = [
                'amount' => $order['pay_fee'] * 100,
                'openid' => $card->openid,
                'order_id' => $order['id'],
                'card_id' => $card->id,
                'mch_billno' => '',
            ];

            $order = F::api('Pay:Auth/PayOrder/update', [
                'id' => $order['id'],
                'catid' => $this->catid,
                'order_status' => 4,
            ]);

            $assemblage = F::api('Huodong/Bestvoice/Assemblage/create', [
                'uid' => $user->id,
                'pid' => $card->uid,
                'type' => $this->type,
                'cond1' => 0, // 0 - not send; 1 - sent;
                'assemblage' => $data,
            ]);

            if ('' != $card->unionid && '' != $user->unionid) {
                F::api("weixin:user/union/{$user->unionid}/make-friend", [
                    'unionid' => $card->unionid,
                    'src' => $this->prjCode,
                    'type' => 6, // 1 - chat, 2 - moment, 3 - other, 4 - unknown
                ], [], 'POST');
            }

            $this->redeemRedpack($card);
        }

        F::redirect($cardUrl);
    }

    protected function redeemRedpack($card)
    {
        $history = F::api('Huodong/Bestvoice/Assemblage/listByCond', [
            'type' => $this->type,
            'pid' => $card->uid,
            'cond1' => 0,
            'limit' => 20,
        ]);

        $amount = 0;
        foreach ($history['list'] as $i) {
            $amount = $amount + $i->assemblage['amount'];
        }
        if ($amount < 100) {
            return;
        }

        $redpackObj = new Redpack();
        $redpackObj->setType($this->type);
        $redpackObj->setAppid($this->appid);
        $mch_billno = $redpackObj->sendRedpack(0, $card->uid, $card->openid, $amount, 2, null, null);
        
        if (false == $mch_billno) {
            return false;
        }

        foreach ($history['list'] as $i) {
            $tmp = $i->assemblage;
            $tmp['mch_billno'] = $mch_billno;
            F::api('Huodong/Bestvoice/Assemblage/update', [
                'id' => $i->id,
                'cond1' => 1,
                'assemblage' => $tmp,
            ]);
        }
    }
}
