<?php
/**
 * 企业付款
 */
namespace Api\Apis\Auth;

use Api\OpenApi;
use Service\ThirdParty\WeixinPay\Transfers;

class WeixinTransfers extends \Api\Apis\Base
{   
    const SERVER_IP = '219.136.249.130'; //调用API的机器IP
    //获取公众号access_token
    public function transfers( $p=array() ){
        $catid      = OpenApi::param($p, 'catid');
        $partner_trade_no = OpenApi::param($p, 'trade_no'); //唯一标识
        $openid     = OpenApi::param($p, 'openid');
        $amount     = OpenApi::param($p, 'amount');
        $desc       = OpenApi::param($p, 'desc');
        $sign       = OpenApi::param($p, 'sign'); //将成为订单号的一部份，以减少订单重复几率！

        if(empty($catid) || empty($partner_trade_no) || empty($openid) || empty($amount) || empty($desc)) {
            OpenApi::throwException(100000, '缺少参数');
        }

        if(empty($sign)) {
            OpenApi::throwException(100004, '缺少sign参数');
        }

        if($amount<1) {
            OpenApi::throwException(100003, '金额不能少于1元');
        }

        $catInfo = \CFG::auth('cat_list', $catid);

        if(empty($catInfo)) {
            OpenApi::throwException(100002, '参数不正确');
        }
        $cfg = \CFG::auth('weixin_cfg', $catInfo['app_id']);
        $service  = new Transfers();

        $params = [
            'partner_trade_no'  => implode('_', [$catid, $sign, $partner_trade_no]),
            'openid'            => $openid,
            'check_name'        => 'NO_CHECK', //FORCE_CHECK, OPTION_CHECK
            'amount'            => $amount*100, //把元转为分
            'desc'              => $desc,
            'spbill_create_ip'  => static::SERVER_IP,
        ];

        $service->setCatId($catid)->setParameters($params);

        try{
            $data = $service->getResult();
        }catch(\Exception $e) {
            \F::log('error:'.$e->getMessage());
            OpenApi::throwException(100003, $e->getMessage());
        }

        //处理记录日志
                
        \F::log('request:'.var_export($p, true).PHP_EOL.'response:'.var_export($data, true), 'transfers_log', 'pay');
        return $data;
    }

}
