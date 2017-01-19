<?php
namespace Service\BestStudy;
use \F;
use Service\ThirdParty\WeixinPay;

class WeixinRefund{
	private $API_ORDERUPDATE = ''; //更新订单状态
	private $API_ORDERREFUND = \F::URL('Pay:/Auth/WeixinPay/refund');//'http://u.gaofen.com/auth/weixinpay/refund'; //退款

	const ERR_10000 = '%s值类型不正确';
	const ERR_10001 = '%s不能为空';
	const ERR_10002	= '无效订单';
	const ERR_10003 = '退款金额超出正常范围';

	/**
	 * 微信退款API
	 * @param  [type] $parameters['order_id'] 订单ID
	 * @param  [type] $parameters['refund_fee'] 订单退款金额
	 * @return [type]             [description]
	 */
	public function refund($parameters) {

		$order_id = isset($parameters['order_id']) ? $parameters['order_id']:'';
		$refund_fee = isset($parameters['refund_fee']) ? $parameters['refund_fee']:'';

		if(empty($refund_fee) || !is_numeric($refund_fee) {
			return $this->error('ERR_10000', array('refund_fee'));
		}

		if(empty($order_id)) {
			return $this->error('ERR_10001', array('order_id'));
		}

		//订单信息
		$orderInfo = F::api('/Teacher/Order/get', array('id'=>$order_id));

		//无效订单
		if(empty($orderInfo) || isset($orderInfo['errno'])){
			return $this->error('ERR_10002');
		}

		if($refund_fee > $orderInfo['total_fee']) {
			return $this->error('ERR_10003');
		}

		$orderData = array(
			'out_trace_no'=>$order_id,
		);

		$wxPay = new WeixinPay();
		$orderData['sign'] = $wxPay->getSign($orderData);
		$postXml = $wxPay->arrayToXml($orderData);
		$result = $wxPay->postXmlCurl($postXml, $this->API_ORDERREFUND);
		return $this->result($wxPay->xmlToArray($result));
	}

	private function error($errcode, array $msgdata=array()){
		array_unshift($msgdata, self::$errcode);
		$sObj = new \ReflectionFunction('sprintf');
		$errmsg = $sObj->invokeArgs($msgdata);

		return array('errcode'=>$errcode, 'errmsg'=>$errmsg);
	}

	private function result($result = array()) {
		return ['result'=>$result];
	}


}