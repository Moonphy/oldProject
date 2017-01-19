<?php

namespace Modules\Teacher;

class Order {

	//获取好评率
    public function getTime($orderInfo, $type='short') {
        $orderInfo = (array)$orderInfo;
        if($type=='short'){
            return date('Y-m-d', strtotime($orderInfo['created_at']));
        } else {
            return date('Y-m-d H:i', strtotime($orderInfo['created_at']));
        }        
    }

    //获取课单类型
    public function getOrderType($orderInfo) {
        $orderInfo = (array)$orderInfo;
        return \CFG::teacher('order_type', $orderInfo['catid'], $orderInfo['order_type']);
    }

    //获取订单内容
    public function getOrderContent($orderInfo) {
        $orderInfo = (array)$orderInfo;
        return '联系人：'.$orderInfo['uname'].' 联系电话：'.$orderInfo['phone'];
    }

    //获取订单状态
    public function getOrderStatus($orderInfo) {
        $orderInfo = (array)$orderInfo;
        $msg = '';
        if($orderInfo['pay_status']==1){
            $msg = '未支付';
        }elseif($orderInfo['pay_status']==-1){
            $msg = '支付失败';
        }elseif($orderInfo['pay_status']==2 && $orderInfo['refund_status']==3){
            $msg = '已退款';
        }elseif($orderInfo['pay_status']==2 && $orderInfo['order_status']==1){
            $msg = '已支付未处理';
        }elseif($orderInfo['pay_status']==2 && $orderInfo['order_status']==2) {
            $msg = '待排课';
        }elseif($orderInfo['pay_status']==2 && $orderInfo['order_status']==3) {
            $msg = '已排课';
        }elseif($orderInfo['pay_status']==2 && $orderInfo['order_status']==4) {
            $msg = '完成';
        }

        return $msg;
    }

    //获取微信支付Link
    public function getPrepayLink($orderInfo) {
        $orderInfo = (array)$orderInfo;
        static $wxUserInfo = [];
        /*if(empty($wxUserInfo)) {
            $wxUserInfo = \F::api('auth:/Auth/Weixin/get', array('uid'=>$orderInfo['uid']));
        }*/

        if(\F::inEnv('product') && $orderInfo['total_fee']<1) {
            \F::setEnv('test');
        }
        
        $orderParams = [
            'id'=>$orderInfo['id'],
            'notify_url' => \F::URL('Teacher:/Teacher/Account/notify'),
            'callback' => \F::URL('Teacher:/Teacher/user/order', array('id'=>$orderInfo['id'])),
        ];

        return \F::URL('Pay:/Auth/Weixinpay/pay', $orderParams);
    }

    //获取支付状态描述
    public function getPayStatus($orderInfo) {
        $orderInfo = (array)$orderInfo;
        return \CFG::auth('pay_status', $orderInfo['pay_status']);
    }

    //是否已支付
    public function hadPay($orderInfo) {
        $orderInfo = (array)$orderInfo;
        return $orderInfo['pay_status']===1?false:true;
    }

    //是否已退款
    public function hadRefund($orderInfo) {
        $orderInfo = (array)$orderInfo;
        return $orderInfo['refund_status']===0?false:true;
    }

    //是否可以退款
    public function canRefund($orderInfo) {
        $orderInfo = (array)$orderInfo;
        return ($orderInfo['refund_status']===0 && $orderInfo['pay_fee']>0)?true:false;
    }

    /**
     * 订单是否已进行
     * @return boolean [description]
     */
    public function isProcess($orderInfo) {
        $orderInfo = (array)$orderInfo;
        return $orderInfo['order_status']===3;
    }

    /**
     * 订单是否已完成
     * @return boolean [description]
     */
    public function isFinish($orderInfo) {
        $orderInfo = (array)$orderInfo;
        return $orderInfo['order_status']===4;
    }

    //获取价评
    public function getEvaluate($evaluate){

        $return = '';
        switch($evaluate){
            case 1:
                $return = '差评';
            break;

            case 3:
                $return = '中评';
            break;

            case 5:
                $return = '好评';
            break;
        }
        return $return;
    }

    //订单是否已过期
    public function isExpired($orderInfo) {
        $orderInfo = (array)$orderInfo;
        if(!$this->hadPay($orderInfo) && (time()>strtotime($orderInfo['created_at']) + 3600*24)) { //24小时候过期
            return true;
        }

        return false;
    }
}