<?php
/**
 * 微信订单生成相关
 */

namespace Service\ThirdParty;

use Service\ThirdParty\WeixinPay\UnifiedOrder;
use Service\ThirdParty\WeixinPay\BaseWxpayServer;
use Service\Sign;

/**
 * 微信购买地址生成
 * e.g. (new WeixinPay())->setParameters(array())->getPayLink() => 获取支付地址
 */

class WeixinPay extends BaseWxpayServer{

    private $_params = array();

    /**
     * 支付需要的参数
     * @param array $params [description]
     */
    public function setParameters(array $params) {
        $fields = [
            'out_trade_no',     //第三方订单号
            'body',             //商品简述
            'total_fee',        //订单总金额
            'attach',           //附加数据，会在通知接口原样返回
            'openid',            //用户的openid
            //'product_id',        //商品ID
            //'detail',           //商品详细描述
            'notify_url',        //通知接口
            'callback',         //回调接口
            'appid',            //appid
            'mch_id',           //mch_id
            ];

        foreach($fields as $field) {
            if(!empty($params[$field])) {
                $this->_params[$field] = trim($params[$field]);
            }
        }

        return $this;
    }

    function __get($name) {
        return isset($this->_params[$name])?$this->_params[$name]:NULL;
    }

    function __set($name, $val) {
        return $this->_params[$name] = $val;
    }

    /**
     * 创建预支付号生成地址
     * @return [type] [description]
     */
    public function getPrepayLink(array $data) {
        $signObj = new sign();
        if(empty($data['catid'])){
            die('缺少参数');
        }
        $catid = $data['catid'];

        $data['sign'] = $signObj->getSign($data, \CFG::auth('cat_list', $catid, 'catkey'));
        return \F::URL('Pay:/Auth/Weixinpay/prepay', $data);
    }


    /**
     * 创建微信订单
     * @param  array  $params [description]
     * @return [type]         [description]
     */
    public function getPrepayId($catid) {
        $wxpay = new UnifiedOrder();
        $wxpay->setCatId($catid);
        $wxpay->setParameter('trade_type', 'JSAPI');    //支付方式
        $wxpay->setParameter('notify_url', \F::URL('Pay:/auth/weixinpay/notify', 
                    $this->notify_url?array('notify_url'=>$this->notify_url):array()));//支付后的通知接口
        
        $params = $this->_params;
        foreach($params as $field=>$val) {            
            if($field=='total_fee') {
                $val = (int)($val*100);
            }

            if(in_array($field, array('callback', 'notify_url'))) continue;

            $wxpay->setParameter($field, $val);
        }

        return $wxpay->getPrepayId();
    }

    /**
     * 进入微信支付界面
     * @return [type] [description]
     */
    public function getPayLink($catid) {
        $prepayId = $this->getPrepayId($catid);
        if(!empty($prepayId)) {
            $payParams = [
                'catid'     => $catid,
                'openid'    =>$this->openid,
                'prepay_id' =>$prepayId,
                'callback'  =>$this->callback,
            ];

            return \F::URL('Pay:/auth/weixinpay/do/', $payParams);
        }else{
            return false;
        }
    }
}
