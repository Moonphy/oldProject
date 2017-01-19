<?php 

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_order_class extends AWS_MODEL
{
	/**
	 * [get_order 获取一条订单记录]
	 * @param  [type]     $where [description]
	 * @param  [type]     $field [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-08-24
	 */
	public function get_order($where = null,$field= null){
		$res=$this->fetch_field_row('specialist_order',$field,$where);
		return $res;
	}

	public function get_order_by_id($order_id, $withAttr=false) {
		$order_id = (int)$order_id;

		$key = 'specialist_order_'.$order_id;
		if(!($result = AWS_APP::cache()->get($key))) {
			$result = $this->get_order("`order_id`='{$order_id}'");
			AWS_APP::cache()->set($key, $result, get_setting('cache_level_normal'));
		}

		if($withAttr) {
			$result['question_data'] = $this->model('specialist_question')->get_question_by_id($result['question_id']);
			$result['answer_data'] = $this->model('specialist_answer')->get_answer_by_id($result['answer_id']);
		}

		return $result;
	}

	/**
	 * 删除单条缓存
	 * @param  [type] $order_id [description]
	 * @return [type]              [description]
	 */
	public function del_cache_by_id($order_id) {
		$key = 'specialist_order_'.$order_id;
		return AWS_APP::cache()->delete($key);
	}

	public function select_order($where = null, $field= null, $order = null, $limit = null, $offset = 0){
		$res=$this->fetch_field_row('specialist_order',$field,$where,$order,$limit,$offset);
		return $res;
	}

	/**
	 * [add_order 添加order表记录]
	 * @param  [type]     $data [description]
	 * @author ken
	 * @date   2016-08-25
	 */
	public function add_order($data){
		$insert_id=$this->insert('specialist_order',$data);
		return $insert_id;
	}

	/**
	 * [update_order 更新订单表数据]
	 * @param  [type]     $data  [description]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-08-31
	 */
	public function update_order($data,$where){
		$affect_num=$this->update('specialist_order',$data,$where);
		$info = $this->get_order($where);
		$this->del_cache_by_id($info['order_id']); //更新后删除对应缓存，防止数据不同步
		return $affect_num;
	}

	/**
	 * [is_answer_pay 回答是否支付]
	 * @param  [type]     $answer_id [description]
	 * @return boolean               [description]
	 * @author ken
	 * @date   2016-09-02
	 */
	public function is_answer_pay($answer_id,$uid){
		$where="answer_id='{$answer_id}' AND uid='{$uid}' AND order_type=1";
		$res=$this->fetch_row('specialist_order',$where);
		return $res;
	}

	/**
	 * [is_question_pay 提问是否支付]
	 * @param  [type]     $qustion_id [description]
	 * @return boolean                [description]
	 * @author ken
	 * @date   2016-09-02
	 */
	public function is_question_pay($qustion_id,$uid){
		$where="question_id='{$question_id}' AND uid='{$uid}' AND order_type=1";
		$res=$this->fetch_row('specialist_order',$where);
		return $res;
	}

	/**
	 * [select_order_user_gaofen description]
	 * @param  [type]     $field    [description]
	 * @param  [type]     $where    [description]
	 * @param  [type]     $order_by [description]
	 * @param  integer    $limit    [description]
	 * @param  integer    $offset   [description]
	 * @return [type]               [description]
	 * @author ken
	 * @date   2016-10-26
	 */
	public function select_order_user_gaofen($field=null, $where=null, $order_by=null, $limit=10, $offset=0){
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
		
		$sql.="FROM aws_specialist_order ";

		$sql.="LEFT JOIN aws_specialist_question ON aws_specialist_order.question_id=aws_specialist_question.question_id ";
		$sql.="LEFT JOIN aws_specialist_answer ON aws_specialist_order.answer_id=aws_specialist_answer.answer_id ";
		$sql.="LEFT JOIN aws_users ON aws_specialist_order.uid=aws_users.uid ";

		if($where!=''){
			$sql.="WHERE $where ";
		}else{
			$sql.="WHERE 1 ";
		}

		if($order_by){
			$sql.="ORDER BY $order_by ";
		}
		$sql.="LIMIT ".$offset.','.$limit;
		$res = $this->query_all_other($sql);

		// 结果为空
		if (empty($res)) {
			return [];
		}

		// 查询教师信息（提问）
		// $specialist_uids = [];
		// foreach ($res as $key => $value) {
		// 	if($value['question_specialist_uid'] != 0){
		// 		$specialist_uids[$value['question_specialist_uid']] = $value['question_specialist_uid'];
		// 	}

		// 	if($value['answer_specialist_uid'] != 0){
		// 		$specialist_uids[$value['answer_specialist_uid']] = $value['answer_specialist_uid'];
		// 	}
		// }
		// $specialist_uids_str = implode(',', $specialist_uids);
		
		// $sql ="SELECT ";
		// $sql.="user_name,uid ";
		// $sql.="FROM aws_users ";
		// $sql.="WHERE uid in ($specialist_uids_str) ";
		// $result = $this->query_all_other($sql);

		// // 组合结果
		// foreach ($res as $key => $value) {
		// 	// 提问
		// 	foreach ($result as $k => $v) {
		// 		if( $value['question_specialist_uid'] == $v['uid'] ){
		// 			$res[$key]['specialist_name'] = $v['user_name'];
		// 		}
		// 	}

		// 	// 偷听回答
		// 	foreach ($result as $k => $v) {
		// 		if( $value['answer_specialist_uid'] == $v['uid'] ){
		// 			$res[$key]['specialist_name'] = $v['user_name'];
		// 		}
		// 	}
		// }

		// 查询成功支付的偷听记录所对应的问题内容
		$sql ="SELECT question_name,aws_specialist_order.answer_id,user_name ";
		$sql.="FROM aws_specialist_order ";

		$sql.="LEFT JOIN aws_specialist_answer ON aws_specialist_order.answer_id=aws_specialist_answer.answer_id ";
		$sql.="LEFT JOIN aws_specialist_question ON aws_specialist_answer.question_id=aws_specialist_question.question_id ";
		$sql.="LEFT JOIN aws_users ON aws_specialist_order.uid=aws_users.uid ";

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
	 * [count_order description]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-10-26
	 */
	public function count_order($where=null){
		$sql="SELECT ";

		$sql.="aws_specialist_order.order_id ";
		
		$sql.="FROM aws_specialist_order ";

		$sql.="LEFT JOIN aws_specialist_question ON aws_specialist_order.question_id=aws_specialist_question.question_id ";
		$sql.="LEFT JOIN aws_specialist_answer ON aws_specialist_order.answer_id=aws_specialist_answer.answer_id ";
		$sql.="LEFT JOIN aws_users ON aws_specialist_order.uid=aws_users.uid ";

		if($where!=''){
			$sql.="WHERE $where ";
		}else{
			$sql.="WHERE 1 ";
		}

		$res = $this->query_all_other($sql);

		return count($res);
	}

	/**
	 * [sum_order description]
	 * @param  [type]     $field [需要统计的字段]
	 * @param  [type]     $where [description]
	 * @return [type]            [description]
	 * @author ken
	 * @date   2016-10-27
	 */
	public function sum_order($field,$where){
		$sql="SELECT sum($field) as sum FROM aws_specialist_order ";
		if($where!=''){
			$sql.="WHERE $where ";
		}else{
			$sql.="WHERE 1 ";
		}

		$res = $this->query_row($sql);
		return $res;
	}
}