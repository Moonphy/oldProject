<?php

namespace Webservice\Teacher;

class Api {
	private $_authYes = false;

	public function auth($data) {
		$username = !empty($data->item[0]) ? (is_object($data->item[0])?$data->item[0]->value:''):'';
		$password = !empty($data->item[1]) ? (is_object($data->item[1])?$data->item[1]->value:''):'';
		$this->data = $data;
		$userData  = [
			'zy'=>'A2@a*w',

		];

		if(isset($userData[$username]) && $userData[$username]===$password) {
			$this->_authYes = true;
		}

	}

	/**
	 * 订单线下支付状态更新
	 * @param  string $trade_no 订单号
	 * @param  string $action pay 支付状态同步 ；refund 退款状态同步
	 * @return object  {'trade_no':121212, 'result':true}
	 */
	public function syncBTLPayStatus($parameter) {
		$trade_no = $parameter->trade_no;
		$action = $parameter->action;
		//return $this->data;
		//卓越的原因，暂时把授权取消
		//if($this->_authYes){
			$result = false;

			if($action==='pay') {//线下支付
				$rs = \F::api('/Teacher/Order/update', ['id'=>$trade_no, 'pay_type'=>2, 'pay_status'=>2, 'order_status'=>2]);
				if(!empty($rs->id)) {
					$result = true;
				}
			}elseif($action==='refund'){
				$rs = \F::api('/Teacher/Order/update', ['id'=>$trade_no, 'refund_status'=>3]);
				if(!empty($rs->id)) {
					$result = true;
				}
			}

			return ['trade_no'=>$trade_no, 'result'=>$result];
		//}else{
		//	throw new \SoapFault('1000000', '没访问权限');
		//}
	}

	//带授权给卓越测试用，测完删除
	public function syncBTLPayStatusWithAuth($parameter) {
		$trade_no = $parameter->trade_no;
		$action = $parameter->action;
		//return $this->data;
		//卓越的原因，暂时把授权取消
		if($this->_authYes){
			$result = false;

			if($action==='pay') {//线下支付
				$rs = \F::api('/Teacher/Order/update', ['id'=>$trade_no, 'pay_type'=>2, 'pay_status'=>2, 'order_status'=>2, 'refund_status'=>-1]);
				if(!empty($rs->id)) {
					$result = true;
				}
			}elseif($action==='refund'){
				$rs = \F::api('/Teacher/Order/update', ['id'=>$trade_no, 'refund_status'=>3]);
				if(!empty($rs->id)) {
					$result = true;
				}
			}

			return ['trade_no'=>$trade_no, 'result'=>$result];
		}else{
			throw new \SoapFault('1000000', '没访问权限');
		}
	}
}