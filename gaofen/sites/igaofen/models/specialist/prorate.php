<?php 
/**
 * 订单金额分配记录
 */
if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_prorate_class extends AWS_MODEL
{

	const _TABLE = 'specialist_prorate';

	const TYPE_QUESTION = 1; //提问
	const TYPE_TAP 		= 2; //偷听

	
	/**
	 * 获取用户分成记录
	 * @param  [type]  $uid   [description]
	 * @param  integer $page  [description]
	 * @param  integer $limit [description]
	 * @return [type]         [description]
	 */
	public function fetch_all_by_uid($uid, $page=1, $limit=20) {

	}

	/**
	 * 分配提问金额
	 * @param  [type] $order_id [description]
	 * @return [type]           [description]
	 */
	public function compute_prorate_by_order_id_for_question($order_id) {

		$order_info = $this->model('specialist_order')->get_order_by_id($order_id);

		if($order_info['order_type']==1 && $order_info['refund_type']==0) {
			$question_info = $this->model('specialist_question')->get_question_by_id($order_info['question_id']);

			$questioner_prize = $this->get_rate('question', 'questioner') * $order_info['price'];
			$specialist_prize = $this->get_rate('question', 'specialist') * $order_info['price'];
			$gaofen_prize = $order_info['price'] - $questioner_prize - $specialist_prize;

			$data = [
				'order_id' 		=> $question_info['order_id'],
				'type'			=> static::TYPE_QUESTION,
				'question_uid'	=> $question_info['uid'],
				'specialist_uid'=> $question_info['specialist_uid'],
				'questioner_prize' 	=> $questioner_prize,
				'specialist_prize'	=> $specialist_prize,
				'gaofen_prize'	=> $gaofen_prize,
			];

			$rs = $this->save_prorate($data);
			if($rs) {
				$this->model('gaofen_account')->reward_by_uid($data['question_uid'], $data['questioner_prize']);
				$this->model('gaofen_account')->reward_by_uid($data['specialist_uid'], $data['specialist_prize']);
				return $data;
			}else{
				write_log('提问订单金额分配失败：'.$order_id);
			}			
		}


		return false;
	}

	/**
	 * 分配窃听回复金额
	 * @param  [type] $id [description]
	 * @return [type]     [description]
	 */
	public function compute_prorate_by_order_id_for_tap($order_id) {
		$order_info = $this->model('specialist_order')->get_order_by_id($order_id);

		if($order_info['order_type']==1 && $order_info['refund_type']==0) {
			$answer_info = $this->model('specialist_answer')->get_answer_by_id($order_info['answer_id']);
			$question_info = $this->model('specialist_question')->get_question_by_id($answer_info['question_id']);

			$questioner_prize = $this->get_rate('answer', 'questioner') * $order_info['price'];
			$specialist_prize = $this->get_rate('answer', 'specialist') * $order_info['price'];
			$gaofen_prize = $order_info['price'] - $questioner_prize - $specialist_prize;

			$data = [
				'order_id' 		=> $order_id,
				'type'			=> static::TYPE_TAP,
				'question_uid'	=> $question_info['uid'],
				'specialist_uid'=> $question_info['specialist_uid'],
				'questioner_prize' 	=> $questioner_prize,
				'specialist_prize'	=> $specialist_prize,
				'gaofen_prize'	=> $gaofen_prize,
			];
			
			$rs = $this->save_prorate($data);
			if($rs) {
				$this->model('gaofen_account')->reward_by_uid($data['question_uid'], $data['questioner_prize']);
				$this->model('gaofen_account')->reward_by_uid($data['specialist_uid'], $data['specialist_prize']);
				return $data;
			}else{
				write_log('偷听订单金额分配失败：'.$order_id);
			}	

		}

		return false;
	}


	/**
	 * 保存数据
	 * @param  array  $data [description]
	 * @return [type]       [description]
	 */
	public function save_prorate(array $data) {
		if(!isset($data['add_time'])) {
			$data['add_time'] = time();
		}

		return $this->insert(static::_TABLE, $data);
	}

	/**
	 * 返回分配比率
	 * @param  [type] $user_type [questioner|buyer|specialist|gaofen] 用户类型
	 * @param  string $rate_type [question|answer] 分配类型
	 * @return [type]            [description]
	 */
	public function get_rate($rate_type, $user_type) {

		$rate = 0;
		$key = implode('_', [$rate_type, $user_type]);
		switch($key) {
			case 'question_specialist':
				$rate = 0.95;
			break;

			case 'question_gaofen':
				$rate = 0.05;
			break;

			case 'answer_specialist':
				$rate = 0.4;
			break;

			case 'answer_questioner':
				$rate = 0.4;
			break;

			case 'answer_gaofen':
				$rate = 0.2;
			break;
		}

		return $rate;
	}

	/**
	 * [select_prorate_order_question_user description]
	 * @param  [type]     $field  [description]
	 * @param  [type]     $where  [description]
	 * @param  [type]     $order  [description]
	 * @param  integer    $limit  [description]
	 * @param  integer    $offset [description]
	 * @return [type]             [description]
	 * @author ken
	 * @date   2016-10-25
	 */
	public function select_prorate_order_question_user($field=null, $where=null, $order_by=null, $limit=0, $offset=0){
		
		$sql="SELECT ";

		if($field){
			if(is_array($field)){
				$sql.= implode(',', $field).' ';
			}else{
				$sql.= $field.' ';
			}
		}else{
			$sql.="* ";
		}
		
		$sql.="FROM aws_specialist_prorate ";

		$sql.="LEFT JOIN aws_specialist_order ON aws_specialist_prorate.order_id=aws_specialist_order.order_id ";
		$sql.="LEFT JOIN aws_specialist_question ON aws_specialist_order.question_id=aws_specialist_question.question_id ";
		$sql.="LEFT JOIN aws_users ON aws_specialist_prorate.question_uid=aws_users.uid ";

		if($where!=''){
			$sql.="WHERE $where ";
		}else{
			$sql.="WHERE 1 ";
		}

		if($order_by){
			$sql.="ORDER BY $order_by ";
		}
		if($limit){
			$sql.="LIMIT ".$offset.','.$limit;
		}
		$res = $this->query_all_other($sql);

		if (empty($res)) {
			return [];
		}

		// 查询教师信息
		$specialist_uids = [];
		foreach ($res as $key => $value) {
			$specialist_uids[$value['specialist_uid']] = $value['specialist_uid'];
		}
		$specialist_uids_str = implode(',', $specialist_uids);
		
		$sql ="SELECT ";
		$sql.="user_name,uid ";
		$sql.="FROM aws_users ";
		$sql.="WHERE uid in ($specialist_uids_str) ";
		$result = $this->query_all_other($sql);

		// 组合结果
		foreach ($res as $key => $value) {
			foreach ($result as $k => $v) {
				if( $value['specialist_uid'] == $v['uid'] ){
					$res[$key]['specialist_name'] = $v['user_name'];
				}
			}
		}

		// 查询偷听记录所对应的问题内容
		$sql ="SELECT question_name,aws_specialist_order.answer_id,user_name ";
		$sql.="FROM aws_specialist_prorate ";

		$sql.="LEFT JOIN aws_specialist_order ON aws_specialist_prorate.order_id=aws_specialist_order.order_id ";
		$sql.="LEFT JOIN aws_specialist_answer ON aws_specialist_order.answer_id=aws_specialist_answer.answer_id ";
		$sql.="LEFT JOIN aws_specialist_question ON aws_specialist_answer.question_id=aws_specialist_question.question_id ";
		$sql.="LEFT JOIN aws_users ON aws_specialist_prorate.question_uid=aws_users.uid ";

		if($where!=''){
			$sql.="WHERE $where ";
		}else{
			$sql.="WHERE 1 ";
		}

		$rs = $this->query_all_other($sql);

		// 组合结果
		foreach ($res as $key => $value) {
			// 提问
			foreach ($rs as $k => $v) {
				// 将answer_id非0的结果插入
				if($value['answer_id'] != 0){
					if( $value['answer_id'] == $v['answer_id'] ){
						$res[$key]['question_name'] = $v['question_name'];
					}
				}
			}
		}

		return $res;
	}

	/**
	 * [count_prorate description]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-10-25
	 */
	public function count_prorate($where=null){
		$res = $this->fetch_field_all('specialist_prorate', $field='id', $where);
		$count = count($res);
		return $count;
	}

	/**
	 * [sum_order description]
	 * @param  [type]     $field [description]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-10-27
	 */
	public function sum_order($field,$where){
		$sql="SELECT sum($field) as sum FROM aws_specialist_prorate ";
		if($where!=''){
			$sql.="WHERE $where ";
		}else{
			$sql.="WHERE 1 ";
		}

		$res = $this->query_row($sql);
		return $res;
	}
}