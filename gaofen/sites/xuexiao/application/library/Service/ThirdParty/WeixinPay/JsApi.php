<?php
namespace Service\ThirdParty\WeixinPay;

use Service\ThirdParty\WeixinPay\BaseCommonUtil;
use Service\ThirdParty\WeixinPay\SDKRuntimeException;
use Service\ThirdParty\WeixinPay\WxpayConfig as WxPayConf_pub;

/**
* JSAPI支付——H5网页端调起支付接口
*/
class JsApi extends BaseCommonUtil {
	var $openid;//用户的openid
	var $parameters;//jsapi参数，格式为json
	var $prepay_id;//使用统一支付接口得到的预支付id

	function __construct() 
	{
	}

	/**
	 * 	作用：设置prepay_id
	 */
	function setPrepayId($prepayId)
	{
		$this->prepay_id = $prepayId;
		return $this;
	}

	function setOpenId($openid) {
		$this->openid = $openid;
		return $this;
	}


	/**
	 * 	作用：设置jsapi的参数
	 */
	public function getParameters()
	{
		$jsApiObj["appId"] = $this->getCfg('app_id');
		$timeStamp = time();
	    $jsApiObj["timeStamp"] = "$timeStamp";
	    $jsApiObj["nonceStr"] = $this->createNoncestr();
		$jsApiObj["package"] = "prepay_id=$this->prepay_id";
	    $jsApiObj["signType"] = "MD5";
	    $jsApiObj["paySign"] = $this->getSign($jsApiObj);
	    $this->parameters = json_encode($jsApiObj);
		
		return $this->parameters;
	}
}
