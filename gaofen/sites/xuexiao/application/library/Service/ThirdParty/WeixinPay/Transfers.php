<?php 
namespace Service\ThirdParty\WeixinPay;

use Service\ThirdParty\WeixinPay\BaseWxpayClient;
use Service\ThirdParty\WeixinPay\SDKRuntimeException;
use Service\ThirdParty\WeixinPay\WxpayConfig as WxPayConf_pub;

/**
 * 企业付款
 */
class Transfers extends BaseWxpayClient {

	function __construct() 
	{
		//设置接口链接
		$this->url = "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers";
		//设置curl超时时间
		$this->curl_timeout = CURL_TIMEOUT;
	}


	/**
	 * 生成接口参数xml
	 */
	function createXml()
	{
		try
		{
			//检测必填参数
			if($this->parameters["partner_trade_no"] == null) 
			{
				throw new SDKRuntimeException("缺少商户订单号！"."<br>");
			}

			if($this->parameters["openid"] == null) 
			{
				throw new SDKRuntimeException("缺少用户openid！"."<br>");
			}

			if(empty($this->parameters['check_name'])) {
				throw new SDKRuntimeException("请填写是否校验用户姓名选项"."<br>");
			}

			if(in_array($this->parameters['check_name'], ['FORCE_CHECK', 'OPTION_CHECK']) && empty($this->parameters['re_user_name'])) {
				throw new SDKRuntimeException("请填写校验用户真实姓名"."<br>");
			}

			if(!is_numeric($this->parameters['amount']) || $this->parameters['amount']<1) {
				throw new SDKRuntimeException("填写正确的支付金额，单位为'分'!"."<br>");
			}

			if(empty($this->parameters['desc'])) {
				throw new SDKRuntimeException("必须填写企业付款描述信息!"."<br>");
			}

			if(empty($this->parameters['spbill_create_ip'])) {
				throw new SDKRuntimeException("缺少调用接口的机器Ip地址!"."<br>");
			}

		   	$this->parameters["mch_appid"] = empty($this->parameters["mch_appid"])?
	   										$this->getCfg('app_id'):$this->parameters["mch_appid"];//公众账号ID
	   		$this->parameters["mchid"] = empty($this->parameters["mchid"])?
	   										$this->getCfg('mch_id'):$this->parameters["mchid"];//商户号//商户号
		    $this->parameters["nonce_str"] = $this->createNoncestr();//随机字符串
		    $this->parameters["sign"] = $this->getSign($this->parameters);//签名
		    return  $this->arrayToXml($this->parameters);
		}catch (SDKRuntimeException $e)
		{
			die($e->errorMessage());
		}
	}

	/**
	 * 	作用：获取结果，使用证书通信
	 */
	function getResult() 
	{		
		$this->postXmlSSL();
		$this->result = $this->xmlToArray($this->response);
		return $this->result;
	}
}