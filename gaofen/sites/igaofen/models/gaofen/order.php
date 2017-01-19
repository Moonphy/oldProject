<?php 

/**
 * 高分微信订单
 */

if (!defined('IN_ANWSION'))
{
    die;
}


class gaofen_order_class extends AWS_MODEL{


	/**
	 * 创建订单
	 * @param  [type] 
	 *                $data['out_trade_no'] 关联记录ID，即高分家长的order_id
	 *                $data['pid'] 高分家长uid
	 *                $data['fee'] 单价，单位元
	 *                $data['amount'] 购买数量
	 *                $data['total_fee'] 总价，单位元，支付时以此价格为准
	 *          array $data['attach'] 附加值
	 *                
	 * @return id|false
	 */
	public function create($data) {
		$data['catid'] = $this->get_catid();
		$mapInfo = $this->model('gaofen_account')->get_gaofen_user_by_uid($data['pid']);
		$data['uid']	= $mapInfo['gaofen_uid'];

		$rs = $this->model('gaofen_api')->request('pay:/Auth/PayOrder/create', $data);

		if(isset($rs['id'])) {
			return ['order_num'=>$rs['id']];
		}else{
			return false;
		}
	}

	public function get($id) {
		return $this->model('gaofen_api')->request('pay:/Auth/PayOrder/get', ['id'=>$id]);
	}

	/**
	 * 取得支付地址
	 * @param  [type] $order_num  支付订单ID, 即高分家长的order_num
	 * @param  [type] $callback 支付成功或失败后跳转到此目的URL
	 * @param  [type] $notify_url 异步通知接口 [<description>]
	 * @return string
	 */
	public function get_pay_link($order_num, $callback, $notify_url) {
		$querys = ['id'=>$order_num, 'notify_url'=>$notify_url];
		if($callback) {
			$querys['callback']	= $callback;
		}
		if(AWS_APP::config()->get('gaofen')->env=='product') {
			$pay_url_prefix = 'http://u.gaofen.com/auth/weixinpay/pay';
		}else{
			$pay_url_prefix = 'http://u.dev.gaofen.com/auth/weixinpay/pay';
		}
		
		return $pay_url_prefix.'?'.http_build_query($querys);
	}

	/**
	 * 验证是否支付成功
	 * @param  [type] $xml file_get_contents('php://input'); raw input 内容
	 * @return [type]      false|订单详细
	 */
	public function notify_check($xml) {
		$data =  $this->model('gaofen_sign')->xmlToArray($xml);
        $data = $data ? $data:[];

        if(empty($data)) return false;
     

        if($this->model('gaofen_sign')->checkSign($data, $this->get_catKey())) {
            $order_num = $data['out_trade_no'];
            $orderInfo = $this->model('gaofen_api')->request('pay:/Auth/PayOrder/get', ['id'=>$order_num]);
            return $orderInfo;
        }

        return false;
	}

	/**
	 * 获取catid
	 * @return [type] [description]
	 */
	public function get_catid() {
		return AWS_APP::config()->get('gaofen')->catid;
	}

	/**
	 * 获取catkey
	 * @return [type] [description]
	 */
	private function get_catkey() {
		return AWS_APP::config()->get('gaofen')->catkey;
	}
}