<?php
namespace Service\ThirdParty\WeixinPay;

use Service\ThirdParty\WeixinPay\BaseCommonUtil;
use Service\ThirdParty\WeixinPay\SDKRuntimeException;
use Service\ThirdParty\WeixinPay\WxpayConfig as WxPayConf_pub;

/**
 * 请求型接口的基类
 */
class  BaseWxpayClient extends BaseCommonUtil {
	var $parameters;//请求参数，类型为关联数组
	public $response;//微信返回的响应
	public $result;//返回参数，类型为关联数组
	var $url;//接口链接
	var $curl_timeout;//curl超时时间
	
	/**
	 * 	作用：设置请求参数
	 */
	function setParameter($parameter, $parameterValue)
	{
		$this->parameters[$this->trimString($parameter)] = $this->trimString($parameterValue);
		return $this;
	}

	/**
	 * 批量设置请求参数
	 */
	public function setParameters(array $parameters) {
		foreach($parameters as $k=>$v){
			$this->parameters[$this->trimString($k)] = $this->trimString($v);
		}
		return $this;
	}
	
	/**
	 * 	作用：设置标配的请求参数，生成签名，生成接口参数xml
	 */
	function createXml()
	{
	   	$this->parameters["appid"] = empty($this->parameters["appid"])?
	   										$this->getCfg('app_id'):$this->parameters["appid"];//公众账号ID
	   	$this->parameters["mch_id"] = empty($this->parameters["mch_id"])?
	   										$this->getCfg('mch_id'):$this->parameters["mch_id"];//商户号
	    $this->parameters["nonce_str"] = $this->createNoncestr();//随机字符串
	    $this->parameters["sign"] = $this->getSign($this->parameters);//签名
	    return  $this->arrayToXml($this->parameters);
	}
	
	/**
	 * 	作用：post请求xml
	 */
	function postXml()
	{
	    $xml = $this->createXml();
		$this->response = $this->postXmlCurl($xml,$this->url,$this->curl_timeout);
		return $this->response;
	}
	
	/**
	 * 	作用：使用证书post请求xml
	 */
	function postXmlSSL()
	{	
	    $xml = $this->createXml();
		$this->response = $this->postXmlSSLCurl($xml,$this->url,$this->curl_timeout);
		return $this->response;
	}

	/**
	 * 	作用：获取结果，默认不使用证书
	 */
	function getResult() 
	{		
		$this->postXml();
		$this->result = $this->xmlToArray($this->response);
		return $this->result;
	}
}