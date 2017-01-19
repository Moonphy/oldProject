<?php

use Service\ThirdParty\WeixinPay\JsApi;
use Service\ThirdParty\WeixinJssdk;
use Service\ThirdParty\WeixinPay\Notify;
use Service\ThirdParty\WeixinPay\Refund;
use Service\ThirdParty\WeixinPay;
use Service\Sign;

class WeixinpayController extends Yaf_Controller_Abstract
{   
    /**
     * 微信订单后生成支付连接
     * @return [type] [description]
     */
    public function prepayAction() {

        $fields = ['uid', 'openid', 'catid', 'pid','fee', 'order_type', 'amount', 'total_fee', 'body', 'attach', 'notify_url', 'callback', 'sign'];

        foreach($fields as $f){
            if(V('g:'.$f)!==NULL){
                $data[$f] = V('g:'.$f);
            }
        }

        //生成订单所属分类
        if(empty($data['catid'])){
            die('缺少catid');
        }

        //订单分类
        $catList = array_keys(CFG::auth('cat_list'));
        if(!isset($catList[$data['catid']])) {
            die('catid不存在'); 
        }

        //订单宿主
        if(empty($data['pid'])){
            die('缺少pid'); 
        }

        //总价
        if(empty($data['total_fee'])){
            die('缺少total_fee');
        }

        //商品描述
        if(empty($data['body'])){
            die('缺少body');
        }

        //商品描述
        if(empty($data['callback'])){
            die('缺少callback');
        }

        //缺少签名
        if(empty($data['sign'])){
            die('缺少签名');
        }


        $errmsg = '';

        if(Sign::checkSign($data, \CFG::auth('cat_list', $data['catid'], 'catkey'), ['openid', 'uid'])) {
            $data['appid'] = \CFG::auth('cat_list', $data['catid'], 'app_id');
            $data['mch_id'] = \CFG::auth('weixin_cfg', $data['appid'], 'mch_id');
            
            $orderInfo = F::api('/Auth/PayOrder/create', $data);
            if(!empty($orderInfo->id)){
                $id = $orderInfo->id;
                $params = [
                    'id'        => $id,
                    'callback'  => $data['callback'],
                    'notify_url'=> isset($data['notify_url'])?$data['notify_url']:''
                ];
                F::redirect(F::URL('/Auth/Weixinpay/pay', $params));
            }else{
                $errmsg = '订单生成失败';
            }
        }else{
            $errmsg = '签名验证失败';
        }

        $this->getView()->assign('errmsg', $errmsg);
    }


    //生成加签名支付链接
    public function buildPrepayLinkAction() {
        $wxPay = new WeixinPay();
        $data = V('g');
        if(empty($data['catid'])){
            die('缺少catid');
        }
        echo $wxPay->getPrepayLink($data);
        return false;
    }

    /**
     * 微信订单先生成支付连接
     * @param  int $id 订单ID
     * 
     * @return [type] [description]
     */
    public function payAction() {
        $orderid    = V('g:id');            //订单ID
        $openid     = V('g:openid');        //openid
        $callback   = V('g:callback');      //回跳地址
        $notify_url = V('g:notify_url');    //异步通知接口
        $uid        = V('g:uid');

        //callback 参数
        $data['id']         = $orderid;
        $data['callback']   = $callback;
        $data['notify_url'] = $notify_url;

        $orderInfo =  F::api('/Auth/PayOrder/get', ['id'=>$orderid]);
        //同步登录
        if(empty($openid)){
            $loginParams = array('callback'=>F::URL('Pay:/Auth/Weixinpay/pay', $data));
            $loginParams['catid']   = $orderInfo->catid;
            if(!empty($orderInfo->uid)) {
                $loginParams['scopes']  = 'snsapi_base';
            }

            F::redirect(F::URL('Auth:/Auth/Weixin/sync', $loginParams));
        }

        
        if(!empty($orderInfo->id)){
            if(empty($orderInfo->uid)) {
                F::api('/Auth/PayOrder/update', ['id'=>$orderid, 'uid'=>$uid]);
            }
            $wxPay = new WeixinPay();
            $data['out_trade_no']   = $orderInfo->id;
            $data['total_fee']      = $orderInfo->total_fee;
            $data['openid']         = $openid;
            $data['body']           = \CFG::auth('cat_list', $orderInfo->catid, 'body').'-'.($orderInfo->out_trade_no?:$orderInfo->id);
            $data['appid']          = $orderInfo->app_id;
            $data['mch_id']         = $orderInfo->mch_id;

            $payLink = $wxPay->setParameters($data)->getPayLink($orderInfo->catid);
            if($payLink){
                F::redirect($payLink);
            }else{
                F::redirect($callback);
            }
        }

        die('获取订单信息出错');
        return false;
    }


    //支付
    public function doAction() {
    	$openid 	= V('g:openid');
    	$prepay_id	= V('g:prepay_id'); //微信统一支付ID
        $callback   = V('g:callback'); //支付完成后跳回的地址
        $catid      = V('g:catid'); //订单分类ID


        if(empty($callback)) {
            die('必须提供callback地址');
        }

        if(empty($prepay_id)) {
            die('非法操作');
        }

        if(empty($catid)) {
            die('缺少catid');
        }

    	if(empty($openid)){
    		F::redirect(F::URL('Auth:/Auth/Weixin/sync', array('scopes'=>'snsapi_base', 'callback'=>F::URL('Pay:/Auth/Weixinpay/do', array('prepay_id'=>$prepay_id, 'callback'=>$callback)))));
    	}

        $wxJsApi = new JsApi();
        $wxJsApi->setCatId($catid);
        $wxPayCfg = $wxJsApi->setPrepayId($prepay_id)->setOpenId($openid)->getParameters();

        $jsSdk = new WeixinJssdk($catid);
        $this->getView()->assign('wxConfig', json_encode($jsSdk->getCfg()));
        $this->getView()->assign('wxPayCfg', $wxPayCfg);
        $this->getView()->assign('callback', $callback);
    }

    public function notifyAction() {
        $xmlRawData = file_get_contents('php://input');

        $notify = new Notify();
        $notify->setCatId(1); //设置临时catid, 解决抛错;
        $notify->saveData($xmlRawData);
        $xmlData = $notify->getData();

        if(!empty($xmlData['out_trade_no'])) {
            $orderInfo = F::api('/Auth/PayOrder/get', ['id'=>$xmlData['out_trade_no']]);
            if(!empty($orderInfo->catid)){
                $notify->setCatId($orderInfo->catid); //设置实际catid
            }
        }

        if($notify->checkSign(['notify_url']) == FALSE){
            $notify->setReturnParameter("return_code","FAIL");//返回状态码
            $notify->setReturnParameter("return_msg","签名失败");//返回信息
        }else{
            
            if($xmlData && is_array($xmlData)) {
                $log = F::api('/Auth/WeixinPayLog/create', $xmlData);

                if(!empty($xmlData['out_trade_no'])) {
                    $pay_status = ($xmlData['result_code']==='SUCCESS' && $xmlData['return_code']==='SUCCESS') ? 2:-1; //2成功 -1失败
                    $rs = F::api('/Auth/PayOrder/update', array(
                                                        'id'        =>$xmlData['out_trade_no'], 
                                                        'pay_type'  =>1,
                                                        'pay_status'=>$pay_status,
                                                        'pay_fee'   =>$xmlData['total_fee']/100,
                                                        'transaction_id'=>$xmlData['transaction_id'],
                                                        )
                    );

                    //更新状态成功后，返回成功给微信确认
                    if(!empty($rs) && empty($rs['errno'])){
                            $notify->setReturnParameter("return_code","SUCCESS");//设置返回码
                            if(!empty($xmlData['notify_url'])) {
                                $notify_url = $xmlData['notify_url'];
                                unset($xmlData['notify_url'], $xmlData['sign']);

                                //改写sign为由第三方catkey生的以方便第三方notice验证；
                                $xmlData['sign'] = Sign::getSign($xmlData, \CFG::auth('cat_list', $orderInfo->catid, 'catkey')); 
                                $outsiteNotify = $notify->postXmlCurl($notify->arrayToXml($xmlData), $notify_url);
                            }
                    }
                }
            }else{
                $notify->setReturnParameter("return_code","FAIL");//返回状态码
                $notify->setReturnParameter("return_msg","数据有问题");//返回信息
            }
        }

        $returnXml = $notify->returnXml();
        echo $returnXml;
        
        return false;   
    }


    /**
     * 退款申请
     * @return [type] [description]
     */
    public function refundAction() {
        $xmlRawData = file_get_contents('php://input');
        $refund_fee = (double)V('g:refund_fee');
        $catid      = \CFG::auth('default_catid');

        $notify = new Notify();        
        $notify->setCatId($catid); //设置临时catid, 解决抛错，实际是没用到其值;

        if($refund_fee<=0) {
            $notify->setReturnParameter("return_code","FAIL");//返回状态码
            $notify->setReturnParameter("return_msg","退款总额无效");//返回信息
        } else {        
            $xmlData = Sign::xmlToArray($xmlRawData);
            if(!empty($xmlData['out_trade_no'])) {
                $orderInfo = F::api('/Auth/PayOrder/get', ['id'=>$xmlData['out_trade_no']]);
                if(!empty($orderInfo->catid)){
                    $catid = $orderInfo->catid;
                }
            }

            //签名加密钥
            $signKey = \CFG::auth('cat_list', $catid, 'catkey');

            if(Sign::checkSign($xmlData, $signKey) == FALSE){
                $notify->setReturnParameter("return_code","FAIL");//返回状态码
                $notify->setReturnParameter("return_msg","签名失败");//返回信息
            }else{
                
                if($xmlData && is_array($xmlData)) {
                    if(!empty($orderInfo) && $orderInfo->refund_status!==-1) {
                        $refund = new Refund();
                        $refund->setCatId($catid); //设置实际catid
                        
                        $refund->setParameter('out_trade_no',   $orderInfo->id);
                        $refund->setParameter('out_refund_no',  $orderInfo->id);
                        $refund->setParameter('total_fee',      (int)($orderInfo->total_fee*100));
                        $refund->setParameter('refund_fee',     (int)($refund_fee*100));
                        $refund->setParameter('op_user_id',     $orderInfo->mch_id);
                        $refund->setParameter('mch_id',         $orderInfo->mch_id);
                        $refund->setParameter('appid',          \CFG::auth('weixin_cfg', $orderInfo->mch_id, 'app_id'));

                        $refundResult = $refund->getResult();
                        if(!empty($refundResult['result_code']) && $refundResult['result_code']==='SUCCESS') {
                            $refund_status = 3; //3退款完成
                            F::api('/Auth/PayOrder/update', array('id'=>$xmlData['out_trade_no'], 'refund_fee'=>$refund_fee, 'refund_status'=>$refund_status));
                            $notify->setReturnParameter("return_code","SUCCESS");//设置返回码
                            $notify->setReturnParameter("return_msg","SUCCESS");//设置返回码
                        }else{
                            $notify->setReturnParameter("return_code","FAIL");//返回状态码
                            $notify->setReturnParameter("return_msg", @$refundResult['err_code_des']);//返回信息
                        }
                    }else{
                        $notify->setReturnParameter("return_code","FAIL");//返回状态码
                        $notify->setReturnParameter("return_msg", '订单数据异常或拒绝退款');//返回信息
                    }
                }else{
                    $notify->setReturnParameter("return_code","FAIL");//返回状态码
                    $notify->setReturnParameter("return_msg","数据有问题");//返回信息
                }
            }
        }

        $returnXml = $notify->returnXml();
        echo $returnXml;
        
        return false; 
    }
}
