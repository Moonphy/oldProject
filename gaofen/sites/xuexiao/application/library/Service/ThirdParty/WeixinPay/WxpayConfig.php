<?php

namespace Service\ThirdParty\WeixinPay;
/**
* 	配置账号信息
*/

class WxpayConfig
{
	private $_catid = '';
	static $wxCfg = [];

	/*
	//=======【基本信息设置】=====================================
	//微信公众号身份的唯一标识。审核通过后，在微信发送的邮件中查看
	const APPID = WX_APPID;
	//受理商ID，身份标识
	const MCHID = WX_MCHID;
	//商户支付密钥Key。审核通过后，在微信发送的邮件中查看
	const KEY = WX_MCHKEY;
	//JSAPI接口中获取openid，审核后在公众平台开启开发模式后可查看
	const APPSECRET = WX_APPSECRET;
	
	//=======【JSAPI路径设置】===================================
	//获取access_token过程中的跳转uri，通过跳转将code传入jsapi支付页面
	const JS_API_CALL_URL = 'http://www.xxxxxx.com/demo/js_api_call.php';
	
	//=======【证书路径设置】=====================================
	//证书路径,注意应该填写绝对路径
	const SSLCERT_PATH = WX_SSLCERT_PATH;
	const SSLKEY_PATH = WX_SSLKEY_PATH;
	
	//=======【异步通知url设置】===================================
	//异步通知url，商户根据实际开发过程设定
	const NOTIFY_URL = WX_NOTIFY_URL;

	//=======【curl超时设置】===================================
	//本例程通过curl使用HTTP POST方法，此处可修改其超时时间，默认为30秒
	const CURL_TIMEOUT = 30;
	*/
	public function __construct($catid=''){
		if($catid){
			$this->setCatId($catid);
		}
	}

	public function setCatId($catid){
		$this->_catid = $catid;
		return $this;
	}

	public function getCatId() {
		return $this->_catid;
	}

	public function getWxPayCfg(){
		$app_id = \CFG::auth('cat_list', $this->getCatId(), 'app_id');
		static::$wxCfg = \CFG::auth('weixin_cfg', $app_id);
		return static::$wxCfg;
	}

	public function __get($name){
		if(empty(static::$wxCfg)){
			$this->getWxPayCfg();
		}

		if(isset(static::$wxCfg[$name])){
			return static::$wxCfg[$name];
		}

		return null;
	}

}
	
?>