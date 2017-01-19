<?php
namespace Service\ThirdParty\WeixinPay;

class  SDKRuntimeException extends \Exception {
	public function errorMessage()
	{
		return $this->getMessage();
	}

}

?>