<?php
namespace Api;

use Api\OpenApi;
/**
 * 继承Exception的异常类
 *
 */
class OpenApiException extends \Exception {

	public $err = array();

	public function __construct($eArr=array())
	{
		$this->err = $eArr;
	}

	//提供给外界调用的错误信息获取接口
	public function apiErr()
	{
		if (defined('API_IN_HTTP_REQUEST') && API_IN_HTTP_REQUEST){
			echo OpenApi::rst($this->err);exit;
		}
		return $this->err;
	}

	//获取错误码
	public function errno()
	{
		return isset($this->err['errno']) ? $this->err['errno'] : 0;
	}
}