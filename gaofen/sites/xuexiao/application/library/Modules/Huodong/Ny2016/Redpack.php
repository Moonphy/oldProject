<?php
namespace Modules\Huodong\Ny2016;

use F;

class Redpack
{
    protected $_type = 0;
    protected $_appid = '';

    public function fetch()
    {
        F::api('weixin:mch/redpack/fetch', [], [], 'POST');

        $result = F::api('/Huodong/Bestvoice/Redpack/listByCond', [
            'type' => $this->getType(),
            'status' => 0,
        ]);

        $redpacks = $result['list'];
        if (sizeof($redpacks) == 0) {
            return;
        }

        $mch_billno = array_reduce($redpacks, function($p, $c) {
            array_push($p, $c->mch_billno);
            return $p;
        }, []);
        $billnoToId = array_reduce($redpacks, function($p, $c) {
            $p['k'.$c->mch_billno] = $c->id;
            return $p;
        }, []);

        while (!empty($mch_billno)) {
            $curMchBillno = array_splice($mch_billno, 0, 20);

            $result = F::api('weixin:mch/redpack/check', ['billno[]' => $curMchBillno], [], 'POST');
var_dump($curMchBillno);

            if (!isset($result['content'])) {
                return;
            }
            foreach ($result['content'] as $bill) {
var_dump($bill);
                if ($bill['status'] == 'completed') {
                    F::api('/Huodong/Bestvoice/Redpack/update', ['id' => $billnoToId['k'.$bill['mch_billno']], 'status' => 1]);
                }
            }
        }
    }

    public function getTotal()
    {
        $incomplete = F::api('/Huodong/Bestvoice/Redpack/listByCond', [
            'type' => $this->getType(),
            'status' => 0,
        ]);

        $completed = F::api('/Huodong/Bestvoice/Redpack/listByCond', [
            'type' => $this->getType(),
            'status' => 1,
        ]);

        $failure = F::api('/Huodong/Bestvoice/Redpack/listByCond', [
            'type' => $this->getType(),
            'status' => 2,
        ]);

        return $incomplete['total'] + $completed['total'] + $failure['total'];
    }

    public function getTips($userId)
    {
        // change it to assemblage table
        $order = F::api('Huodong/Bestvoice/Assemblage/listByCond', [
            'pid' => $userId,
            'type' => $this->getType(),
        ]);

        $order = array_map(function($c) {
            $i = new \StdClass();
            //$i->sender_id = $c->uid;
            //$i->receiver_id = $c->pid;
            $i->created_at = $c->created_at->format('Y-m-d');
            if (isset($c->assemblage) && isset($c->assemblage['amount'])) {
                $i->amount = $c->assemblage['amount'];
            } else {
                $i->amount = 0;
            }
            $i->sender = F::api('/Huodong/Bestvoice/User/get', ['id' => $c->uid])->toArray();
            $i->sender = array_intersect_key($i->sender, [
                'nickname' => '',
                'headimgurl' => '',
            ]);
            if(empty($i->sender['headimgurl'])) {
                $i->sender['headimgurl'] = GAOFEN_STATIC.'/html/weixin/bainian/img/dummies/avatar_48x48.png';
            }
            return $i;
        }, $order['list']);

        return $order;

        $redpacks = F::api('/Huodong/Bestvoice/Redpack/listByCond', [
            'type' => $this->getType(),
            'receiver_id' => $userId,
        ]);

        $result = array_filter($redpacks['list'], function($i) {
            return $i->order_id != null;
        });

        return $result;
    }

    public function getRedpackStatus($senderId, $receiverId)
    {
        // change it to assemblage table
        $order = F::api('Huodong/Bestvoice/Assemblage/listByCond', [
            'uid' => $senderId,
            'pid' => $receiverId,
            'type' => $this->getType(),
        ]);

        if (sizeof($order['list']) == 0) {
            return null;
        }

        return 'completed';

        $redpacks = F::api("/Huodong/Bestvoice/Redpack/listByCond", [
            'type' => $this->getType(),
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
        ]);

        $result = array_filter($redpacks['list'], function($i) {
            return $i->order_id == null;
        });

        if (sizeof($result) == 0) {
            return null;
        }

        return $result[0]->status;
    }

    public function resendRedpack() {
        return;

        $failure['list'] = [
/*
            [5398,'o3tJMt--Y5ntKYTIDSYGZ7xq9DDw', 118],
            [12300,'o3tJMtycMzq7wBioEtZoRXkf8NRk', 105]
*/
        ];

        $redpack = [
            'send_name' => '豆计划',
            'total_amount' => 0,
            'wishing' => '豆计划，陪伴孩子成长每一步',
            'act_name' => '元宵抢红包',
            'remark' => '豆计划，陪伴孩子成长每一步',
        ];

        foreach ($failure['list'] as $r) {
            $redpack['total_amount'] = $r[2];

            //$user = F::api('/Huodong/Bestvoice/User/get', array('id' => $r->receiver_id));
            //$receiverOpenid = $user->openid;
            $receiverOpenid = $r[1];
            
            $status = 0;
            $mch_billno = null;
            $amount = $r[2];
            if ($amount != 0) {
                $appid = $this->getAppid();
                $result = F::api("weixin:account/{$appid}/user/open/{$receiverOpenid}/mch/sendredpack/", $redpack, [], 'POST');
                if (isset($result['content']['mch_billno'])) {
                    $mch_billno = $result['content']['mch_billno'];

                    if ($result['content']['return_code'] == 'FAIL') {
                        $mch_billno = $result['content']['return_msg'];
                        $status = 4;
                    }
                } else {
                    $mch_billno = 'Fail to get mch_billno';
                    $status = 5;
                }
            }

            $newData = [
                'id' => $r[0],
                'mch_billno' => $mch_billno,
                'status' => $status,
                'amount' => $amount,
            ];

var_dump($newData);

            F::api('/Huodong/Bestvoice/Redpack/update', $newData);
        }
    }

    public function sendRedpack($senderId, $receiverId, $receiverOpenid, $amount, $type, $orderId = null, $prizeId = null)
    {
        if ($type == 1) {
            // $card -> $user
            $redpack = [
                'send_name' => '豆计划',
                'total_amount' => $amount,
                'wishing' => '豆计划，陪伴孩子成长每一步',
                'act_name' => '元宵抢红包',
                'remark' => '豆计划，陪伴孩子成长每一步',
            ];
        } else {
            // $user -> $card
            $redpack = [
                'send_name' => '豆计划',
                'total_amount' => $amount,
                'wishing' => '豆计划，陪伴孩子成长每一步',
                'act_name' => '元宵抢红包',
                'remark' => '豆计划，陪伴孩子成长每一步',
            ];
        }

        $status = 0;
        $mch_billno = null;
        if ($amount != 0) {
            $appid = $this->getAppid();
            $result = F::api("weixin:account/{$appid}/user/open/{$receiverOpenid}/mch/sendredpack/", $redpack, [], 'POST');
            if (isset($result['content']['mch_billno'])) {
                $mch_billno = $result['content']['mch_billno'];

                if ($result['content']['return_code'] == 'FAIL') {
                    $mch_billno = $result['content']['return_msg'];
                    $status = 2;
                }
            } else {
                $mch_billno = 'Fail to get mch_billno';
                $status = 2;
            }
        }

        if (isset($mch_billno)) {
            $saveData = [
                'mch_billno' => $mch_billno,
                'type' => $this->getType(),
                'status' => $status,
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
                'amount' => $amount,
                'order_id' => $orderId,
                'prize_id' => $prizeId,
            ];
            F::api('/Huodong/Bestvoice/Redpack/create', $saveData);
        }

        if ($status != 0) {
            return false;
        }

        return $mch_billno;
    }

    public function setType($type)
    {
        $this->_type = $type;
        return $this;
    }

    public function getType()
    {
        return $this->_type;
    }

    public function setAppid($appid)
    {
        $this->_appid = $appid;
        return $this;
    }

    public function getAppid()
    {
        return $this->_appid;
    }
}
