<?php
namespace Presenters\Auth;

use \Presenters\AbstractModelPresenter;

class PayOrder extends AbstractModelPresenter
{
    function __toString() {

    }

    //获取好评率
    public function getTime($type='short') {
        if($type=='short'){
            return date('Y-m-d', strtotime($this->_model->created_at));
        } else {
            return date('Y-m-d H:i', strtotime($this->_model->created_at));
        }        
    }

    //获取课单类型
    public function getOrderType() {
        return \CFG::auth('order_type', $this->_model->catid, $this->_model->order_type);
    }

    //获取订单内容
    public function getOrderContent() {
        return '联系人：'.$this->_model->uname.' 联系电话：'.$this->_model->phone;
    }

    //获取订单状态
    public function getOrderStatus() {
        $msg = '';
        if($this->_model->pay_status==1){
            $msg = '未支付';
        }elseif($this->_model->pay_status==-1){
            $msg = '支付失败';
        }elseif($this->_model->pay_status==2 && $this->_model->refund_status==3){
            $msg = '已退款';
        }elseif($this->_model->pay_status==2 && $this->_model->order_status==1){ //通常是同步订单到卓越接口失败
            $msg = '已支付未处理';
        }elseif($this->_model->pay_status==2 && $this->_model->order_status==2){
            $msg = '待排课';
        }elseif($this->_model->pay_status==2 && $this->_model->order_status==3) {
            $msg = '已排课';
        }elseif($this->_model->pay_status==2 && $this->_model->order_status==4) {
            $msg = '完成';
        }


        return $msg;
    }

    //获取微信支付Link
    public function getPrepayLink() {
        static $wxUserInfo = [];
        /*if(empty($wxUserInfo)) {
            $wxUserInfo = \F::api('auth:/Auth/Weixin/get', array('uid'=>$this->_model->uid));
        }*/
        
        $orderParams = [
            'id'=>$this->_model->id,
            'notify_url' => \F::URL('Teacher:/Teacher/Account/notify'),
            'callback' => \F::URL('Teacher:/Teacher/user/order', array('id'=>$this->_model->id)),
        ];

        return \F::URL('Pay:/Auth/Weixinpay/pay', $orderParams);
    }

    //获取支付状态描述
    public function getPayStatus() {
        return \CFG::auth('pay_status', $this->_model->pay_status);
    }

    //是否已支付
    public function hadPay() {
        return $this->_model->pay_status===1?false:true;
    }

    //是否已退款
    public function hadRefund() {
        return $this->_model->refund_status===0?false:true;
    }

    /**
     * 订单是否已进行
     * @return boolean [description]
     */
    public function isProcess() {
        return $this->_model->order_status===3;
    }

    /**
     * 订单是否已完成
     * @return boolean [description]
     */
    public function isFinish() {
        return $this->_model->order_status===4;
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

}
